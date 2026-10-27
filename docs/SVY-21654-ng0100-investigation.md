# NG0100 Investigation — sidenav (SVY-21654)

Scope: find and explain **all** sources of
`ExpressionChangedAfterItHasBeenChecked` (NG0100) in the servoyextra **sidenav**
component, not just the reported `selectedIndex` flip. Investigation only — no fix
applied here. Line references are to
`components/projects/servoyextracomponents/src/sidenav/sidenav.ts` and
`components/projects/servoyextracomponents/src/sidenav/sidenav.html` as read on this
branch.

## Base-class lifecycle facts this analysis relies on

From the compiled base class (`components/node_modules/@servoy/public/fesm2022/servoy-public.mjs`,
`class ServoyBaseComponent`):

- `ngAfterViewInit()` calls `this.svyOnChanges(this.changes)` for any changes buffered
  before the view existed, **and then calls `this.cdRef.detectChanges()`** at the end.
  So the component's first `svyOnChanges` runs inside `ngAfterViewInit`, i.e. *after*
  the view has been created/checked once — the classic NG0100 window.
- `ngOnChanges()` forwards to `svyOnChanges()` once `elementRef()` exists. These are
  server-model pushes; with OnPush + signals they arrive and are applied synchronously
  in the same tick they are delivered.
- The component template binds a private `signal` (`_selectedIndex`, `_expandedIndex`,
  `_open`, `_menu`), never the raw `input()` — so every server push must be *copied*
  into the signal inside `svyOnChanges`, and that copy is what can disagree with what
  the parent view already checked.

## Confirmed / primary source — the `selectedIndex` `{"1":"customers"}` ↔ `{}` flip

**Mechanism (end to end):**

1. `selectedIndex` is a private two-way `pushToServer: "deep"` **string** property
   (`components/sidenav/sidenav.spec:18`). Its wire value is a JSON string such as
   `'{"1":"customers"}'`, not an object.
2. The template never reads the `selectedIndex` input. It reads the internal signal
   `_selectedIndex()` at `sidenav.html:31,60,88,116`
   (`item.id !== null && _selectedIndex()[level] === item.id`). The signal is seeded in
   `svyOnInit` (`sidenav.ts:87`) and re-copied in `svyOnChanges` case `'selectedIndex'`
   (`sidenav.ts:224-231`).
3. The copy logic at `sidenav.ts:224-231` is:
   ```
   case 'selectedIndex':
       if (!change.currentValue) {              // line 225
           this._selectedIndex.set({});         // line 226  -> resets to {}
       } else if (typeof selectedIndex == 'string') {
           this._selectedIndex.set(JSON.parse(selectedIndex)); // line 228
       }
       this.cdRef.markForCheck();               // line 230
       break;
   ```
   Two problems combine here:
   - **It writes a bound signal during a change-handling path that runs after the view
     was checked** (first `svyOnChanges` runs inside `ngAfterViewInit`, and every later
     server push runs in the push tick). `markForCheck()` (line 230) then re-schedules a
     check whose value differs from what the parent/host saw when `_selectedIndex` still
     held the previous state → NG0100 on the `_selectedIndex`-derived bindings.
   - **The reset-to-`{}` branch (line 225-226) fires on any falsy `change.currentValue`.**
     An empty object `{}`, an empty string `''`, or a cleared push all land here and
     stomp a selection the component (or a previous push) had set.
4. The write-back side re-emits the two-way channel:
   - `setSelectedIndex` (`sidenav.ts:823-825`) does
     `this._selectedIndex.set(newSelectedIndex); this.selectedIndexChange.emit(JSON.stringify(newSelectedIndex)); this.cdRef.markForCheck();`
   - `copyServoyMenu` (`sidenav.ts:1069`) emits `JSON.stringify(this._selectedIndex())`
     then calls `this.cdRef.detectChanges()` (line 1070).

**Why it flips once per second between `{"1":"customers"}` and `{}`:**
`setSelectedMenuItem('customers', false, false)` (called from `onShow`) ultimately runs
`selectItem(...)` with `preventSelectHandler = true` → `confirmSelection()` →
`setSelectedIndex()` sets `_selectedIndex` to `{"1":"customers"}` **and emits that string
deep to the server**. Because the property is `pushToServer: deep`, the server stores it
and — on the next model sync for the form (the ~1 Hz cadence the reporter sees) — pushes a
`selectedIndex` change back down. That inbound change re-enters `svyOnChanges` case
`'selectedIndex'`. If that pushed value is ever delivered as falsy/empty (e.g. the server
round-trips an empty or not-yet-converged value, or the SVY-21653 `onMenuItemSelected`
returning `false` left the server holding `{}` while the client holds `{"1":"customers"}`),
line 225-226 resets `_selectedIndex` to `{}`, `markForCheck()` (line 230) forces a re-check,
and the next client action/emit pushes `{"1":"customers"}` again. The two sides never
converge: client asserts `{"1":"customers"}`, an inbound empty push asserts `{}`, each
within/adjacent to the same CD tick → the repeating NG0100 the reporter logged, with
exactly the two values `{"1":"customers"}` and `{}`.

The decisive defect in this component is the **unconditional reset-to-`{}` on a falsy
inbound value combined with a bound-signal write + `markForCheck()` inside the
after-checked `svyOnChanges` path**. The symmetric `expandedIndex` branch
(`sidenav.ts:216-223`) has the identical shape and the identical latent bug.

## All other NG0100 risk sites

| Location (file:line) | Binding / call | Why it can change after-checked | Fix direction | Confidence |
|---|---|---|---|---|
| `sidenav.ts:224-231` (`svyOnChanges` `selectedIndex`) | writes `_selectedIndex` signal + `markForCheck()` (line 230); reset-to-`{}` on falsy (line 225-226) | Runs inside `ngAfterViewInit`→`svyOnChanges` (after first check) and on every server push; signal write changes `_selectedIndex()` bindings after the parent checked them | Don't reset to `{}` when the inbound value is a non-empty server selection; only copy when the parsed value actually differs; drop the `markForCheck()` (signal write already schedules CD); don't echo back a value just received | **High** |
| `sidenav.ts:216-223` (`svyOnChanges` `expandedIndex`) | writes `_expandedIndex` signal + `markForCheck()` (line 222) | Same shape as selectedIndex; `_expandedIndex()` is read at `sidenav.html:47,53,55,76,82,83,104,110,111` | Same as selectedIndex branch: guard the reset, compare before set, drop redundant `markForCheck()` | **High** |
| `sidenav.ts:240-256` `getSidenavClass()` → `sidenav.html:4` `[class]="getSidenavClass()"` | returns a **new** `Record<string,boolean>` object every call | Template method invoked every CD pass returns a referentially different object each time; the verify pass sees a "changed" binding value | Make reference-stable: `computed()` over the style/`styleClass` signals, bind the computed | **Med** (class-record diffing often tolerates this, but it is a textbook NG0100 trigger under OnPush re-entrancy) |
| `sidenav.ts:293-305` `getHeaderFormStyle()` → `sidenav.html:19` `[ngStyle]` | returns a **new** `{}`/`{minHeight}` object every call | Fresh object each invocation; `NgStyle` is re-diffed; under a re-entrant `detectChanges()` the verify pass gets a new reference | Convert to a `computed()` keyed on `headerForm()` + form cache, or memoize | **Med** |
| `sidenav.ts:307-319` `getFooterFormStyle()` → `sidenav.html:168,187` `[ngStyle]` | returns a **new** object every call | Same as header | Same — `computed()` / memoize | **Med** |
| `sidenav.ts:346-365` `getContainerStyle()` → `sidenav.html:203` `[ngStyle]` | returns a **new** `cssStyle` object every call | Same as header/footer; also depends on `getResponsiveHeight()`/`getSidenavWidth()` which hit `servoyApi()`/form cache | Same — `computed()` / memoize | **Med** |
| `sidenav.html:21,170,188,207` `[sabloTabseqConfig]="{container:true, reservedGap:50}"` | **new object literal in the template** every CD pass | Inline object literal is re-created each check → referentially unstable input to the `sabloTabseq` directive | Hoist to a `readonly` class field (e.g. `tabSeqConfig = {container:true, reservedGap:50}`) and bind that | **Med** |
| `sidenav.html:22,171,190,209` `[ngTemplateOutletContext]="{name:getHeaderForm()}"` (and footer/contained variants) | **new object literal** `{name: ...}` every pass | Fresh context object each check; `NgTemplateOutlet` input seen as changed | Bind a stable object, or a `computed()` returning the context | **Low/Med** |
| `sidenav.ts:137-139` (`relationName` → `formWillShow().finally(detectChanges())`) | `realContainedForm.set(...)` then `cdRef.detectChanges()` | Promise `.finally` resolves in a later microtask but can land in the same macrotask as an ongoing check; `detectChanges()` forces a synchronous re-check that can observe a just-mutated `realContainedForm()` (read at `sidenav.html:201,209` via `getForm()`) | Prefer letting the signal write trigger CD (OnPush + signal), or `markForCheck()`; avoid forced `detectChanges()` in a resolved-promise callback | **Low/Med** |
| `sidenav.ts:152-162,163-174` (`headerForm`/`footerForm` → `formWillShow`/`hideForm` + `detectChanges()`) | mutates `realHeaderForm`/`realFooterForm` plain fields, then `detectChanges()` | `realHeaderForm`/`realFooterForm` are read in the template via `getHeaderForm()`/`getFooterForm()` (`sidenav.html:22,171,190`); the forced `detectChanges()` after an async form-will-show can re-assert a changed value | Same as above — avoid forced `detectChanges()`, let signal/markForCheck drive it; consider making realHeader/FooterForm signals | **Low/Med** |
| `sidenav.ts:179-215` (`open` → `formWillShow`/`hideForm` + `detectChanges()`) | writes `_open` (line 180) and triggers async form shows with `detectChanges()` in `.finally` | `_open()` is read at `sidenav.html:11,160,180`; the `open` branch runs in `svyOnChanges` (after-checked) and the async `detectChanges()` compounds it | Guard against re-entrancy; let signals drive CD | **Low** |
| `sidenav.ts:1049-1071` `copyServoyMenu()` (runs via `Promise.resolve().then` from `svyOnInit`/`svyOnChanges servoyMenu`) | sets `_selectedIndex`/`_menu`, emits `selectedIndexChange` (line 1069), then `cdRef.detectChanges()` (line 1070) | Microtask after init; mutates bound signals and forces a synchronous full check that can disagree with the host's last-checked state; also emits the two-way `selectedIndex` echo | Avoid `detectChanges()` (use `markForCheck()`); don't emit `selectedIndexChange` for a selection derived from the just-received `servoyMenu`; compare before set | **Med** |
| `sidenav.ts:487-488, 521-529` (`slideMenu`/`animateSlideMenu` static branch) `_open.set(...)` + `openChange.emit` | writes `_open` and emits two-way `open` | `animateSlideMenu` is also called from `svyOnChanges` `open` branch (line 182); in the `static` else-branch it force-sets `_open.set(true)` and emits `openChange` while handling an `open` change → can echo the two-way `open` within the same tick | Don't re-set/echo `open` from inside the change handler for `open`; only emit on genuine user toggle (`slideMenu`) | **Low/Med** |

## Referentially-unstable template bindings (new object/array each evaluation)

These are template-invoked methods / inline literals that build a fresh object every CD
pass. Each is a candidate NG0100 source under OnPush + the component's own re-entrant
`detectChanges()` calls, and all are easy wins to stabilize:

- `getSidenavClass()` → `sidenav.html:4` (new `Record<string,boolean>`).
- `getHeaderFormStyle()` → `sidenav.html:19` (new style object).
- `getFooterFormStyle()` → `sidenav.html:168,187` (new style object).
- `getContainerStyle()` → `sidenav.html:203` (new style object).
- Inline `{container:true, reservedGap:50}` → `sidenav.html:21,170,188,207` (new literal).
- Inline `{name:getHeaderForm()}` / `{name:getFooterForm()}` / `{name:getForm()}` →
  `sidenav.html:22,171,190,209` (new literal).
- `[dir]="scrollbarPosition() === 'rtl' ? 'rtl' : $any(null)"` → `sidenav.html:3` is a
  scalar (safe); listed only to note it was checked and is **not** a risk.

Note: `_menu()` is a `linkedSignal` and `_selectedIndex()`/`_expandedIndex()` are plain
signals, so the `@for`/`@if` bindings over them (`sidenav.html:28,53,...`) are stable *as
long as* the signal isn't re-set to an equal-but-new object every pass — which is exactly
what the `svyOnChanges` reset branches risk doing (primary source above).

## Recommended fix set (ordered, minimal, source-fixes — do NOT implement here)

1. **Fix the `selectedIndex` convergence (primary).** In `svyOnChanges` case
   `'selectedIndex'` (`sidenav.ts:224-231`): parse the inbound value, and only
   `_selectedIndex.set(...)` when the parsed result **differs** from the current signal
   value (deep-equal compare); **do not reset to `{}` when an in-flight non-empty
   selection exists**; remove the trailing `markForCheck()` (line 230) — the signal write
   already marks the OnPush view. This removes the alternating writer of `{}`.
2. **Do the same for `expandedIndex`** (`sidenav.ts:216-223`) — identical shape, same fix.
3. **Stop echoing the two-way channel.** Where the component sets `_selectedIndex` from a
   value that *originated server-side* (`copyServoyMenu` line 1069; and any path reached by
   `setSelectedMenuItem(..., false, false)`), do **not** re-emit `selectedIndexChange` with
   the same value it just received. Emit only on genuine user-driven selection
   (`setSelectedIndex` via a real click). This breaks the deep-push echo loop.
4. **Make the style/class template methods reference-stable.** Convert `getSidenavClass`,
   `getHeaderFormStyle`, `getFooterFormStyle`, `getContainerStyle` to `computed()` signals
   (or memoize) so `[class]`/`[ngStyle]` get a stable reference across the check/verify
   passes.
5. **Hoist the inline config/context object literals.** Replace
   `{container:true, reservedGap:50}` (`sidenav.html:21,170,188,207`) with a single
   `readonly` field, and the `{name: ...}` outlet-context literals with stable
   objects/computed.
6. **Reduce forced `detectChanges()` re-entrancy.** In the async `.finally()` form-show
   callbacks (`sidenav.ts:139,144,149,156,160,167,171,189,199,206,212`) and in
   `copyServoyMenu` (line 1070), prefer `markForCheck()` over `detectChanges()`, or rely on
   the signal writes to trigger CD. Forced synchronous `detectChanges()` after an async
   resolution is a recurring NG0100 amplifier here.

Priority: items 1–3 remove the *reported* flood and the whole class of two-way echo bugs
(selectedIndex **and** expandedIndex **and** open). Items 4–6 harden the remaining
referential-instability / re-entrancy risk sites so "all possible occurrences" are
addressed, per the user's directive.

## Out of scope / won't-fix

- **Base class (`ServoyBaseComponent`).** Its `ngAfterViewInit` → `svyOnChanges` →
  `detectChanges()` sequence is the shared initialization contract for every component;
  changing it is explicitly out of scope and risky. The sidenav fix must live in the
  component's own change handling.
- **The `pushToServer: deep` spec contract** (`sidenav.spec:18-19`). The two-way deep push
  is the designed channel; the fix is to make the client converge/not echo, not to change
  the property's push mode (that would change public behavior and risk SVY-21634/SVY-21653).
- **SVY-21653 cancel-hook semantics.** If `onMenuItemSelected` returns `false`, the client
  intentionally skips `confirmSelection()`. Whether a cancelled selection should still
  reconcile the server's deep-pushed `selectedIndex` is a *selection-semantics* decision
  tracked under SVY-21653, not an NG0100 fix; this report treats it only as a trigger that
  exposes the convergence bug, which fix items 1 and 3 neutralize regardless of the handler
  return value.
- **Legacy AngularJS `sidenav.js`** and server script `sidenav_server.js` — not part of the
  NG client CD cycle; untouched.

## Git history notes

- The reset-to-`{}` + `markForCheck()` handling in `svyOnChanges`
  (`sidenav.ts:224-231`) is **original to the signals migration**, not a recent
  regression: the reset body `this._selectedIndex.set({})` / `JSON.parse` lines are from
  `0d16291` (cPecican, 2026-02-04), the `markForCheck()` from `475de68` (cPecican,
  2026-02-04 "SVY-20819 use signals instead of @input"), and only reformatted since
  (`0dc08ef`, Johan Compagner, 2026-08-04). Fixing the reset/echo therefore refines the
  signals-migration behavior rather than reverting a deliberate recent decision.
- `setSelectedIndex`'s emit + `markForCheck` (`sidenav.ts:823-825`) predate the signals
  work (`1c822f7`, lvostinar, 2025-03-21); the two-way emit is long-standing design, so
  recommendation 3 (suppress server-originated echoes) should be scoped carefully to avoid
  regressing genuine user-selection emits.
- The most recent sidenav change (`09d1259`, Gabi Boros, 2026-10-21, SVY-21636 isHeading)
  touches rendering/selection guards but not the `selectedIndex`/`expandedIndex` two-way
  copy, so it is not the introducer of the loop.
- The style/class template methods (`getSidenavClass`, `get*FormStyle`, `getContainerStyle`)
  returning fresh objects also predate the signals migration; converting them to
  `computed()` is a forward hardening step, not a revert.
