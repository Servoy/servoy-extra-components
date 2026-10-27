# Spec: SVY-21654 — Fix repeating NG0100 (ExpressionChangedAfterItHasBeenChecked) in servoyextra sidenav

## 1. Goal

Stop the **repeating** `NG0100 ExpressionChangedAfterItHasBeenChecked` error that floods the
Servoy Admin log (`/servoy-admin/log`) roughly **once per second while the sidenav is
visible**, flipping the private `selectedIndex` between a server value (`{"1":"customers"}`)
and `{}`. The fix targets **only the confirmed recurring source** of that error, at its
source — not a `markForCheck()`/`detectChanges()` band-aid, and **not** speculative
refactors elsewhere in the component.

Per the user's explicit direction: **do not make speculative modifications.** This spec is
narrowed to the mechanism that actually recurs every ~1 s (the `servoyMenu`→`copyServoyMenu`
server-echo loop and its forced `detectChanges()`), plus the minimal, directly-coupled
`svyOnChanges` `selectedIndex`/`expandedIndex` copy change needed to stop that specific loop.
The broad hardening items (reference-stable style/class `computed()`, hoisted template
literals, blanket `detectChanges()`→`markForCheck()`) from the investigation are
**explicitly deferred / out of scope** here — they are not the once-per-second error and are
not to be changed speculatively (see §6).

Behaviour that must be preserved:
- selection still works (click, `setSelectedMenuItem`, `setSelectedByIndexPath`);
- header/footer/contained forms still show and hide;
- SVY-21634 (code-set selection reflected on first show) is not regressed;
- SVY-21653 (cancel hook: `onMenuItemSelected` returning `false` cancels selection) keeps
  its semantics.

## 2. Background

### 2.1 The NG0100 mechanism in this component

`ServoyExtraSidenav extends ServoyBaseComponent<HTMLDivElement>`
(`components/projects/servoyextracomponents/src/sidenav/sidenav.ts:18`). From the compiled
base class (`components/node_modules/@servoy/public/fesm2022/servoy-public.mjs`):

- `ngAfterViewInit()` replays any buffered `svyOnChanges(this.changes)` **and then calls
  `this.cdRef.detectChanges()`**. So the component's first `svyOnChanges` runs *after* the
  view was created/checked once — the classic NG0100 window.
- `ngOnChanges()` forwards to `svyOnChanges()` once `elementRef()` exists. These are
  server-model pushes; with OnPush + signals they are applied synchronously in the push
  tick.

The template never binds the raw `input()` for selection/expansion/open — it binds the
**private signals** `_selectedIndex()`, `_expandedIndex()`, `_open()`
(`sidenav.ts:57-59`), read at `sidenav.html:31,60,88,116` (selected),
`sidenav.html:47,53,55,76,82,83,104,110,111` (expanded) and `sidenav.html:11,160,180`
(open via `open()`; `_open()` drives `addRemoveStickyStyle`/animation). Each server push
must therefore be **copied** into the signal inside `svyOnChanges`, and that copy is what
can disagree with what the parent view already checked.

### 2.2 The `selectedIndex` `{"1":"customers"}` ↔ `{}` flip

`selectedIndex` is a private, two-way, deep-pushed **string** property
(`components/sidenav/sidenav.spec:18`:
`"selectedIndex": {"type":"string","tags":{"scope":"private"},"pushToServer":"deep"}`). Its
wire value is a JSON string such as `'{"1":"customers"}'`.

The copy logic today (`sidenav.ts:224-231`):

```ts
case 'selectedIndex':
    if (!change.currentValue) {              // 225
        this._selectedIndex.set({});         // 226  -> resets to {}
    } else if (typeof selectedIndex == 'string') {
        this._selectedIndex.set(JSON.parse(selectedIndex)); // 228
    }
    this.cdRef.markForCheck();               // 230
    break;
```

Two defects combine:

1. **Reset-to-`{}` on any falsy `change.currentValue`** (lines 225-226) — an empty object,
   empty string, or a cleared push all land here and stomp a selection the component (or a
   previous push) already holds.
2. **A bound-signal write + `markForCheck()` inside the after-checked path** — the first
   `svyOnChanges` runs inside `ngAfterViewInit` (post-first-check) and every later push in
   the push tick. `markForCheck()` re-schedules a check whose `_selectedIndex()`-derived
   bindings differ from what the host saw → NG0100.

End-to-end flip: `onShow` calls `setSelectedMenuItem('customers', false, false)` →
`selectItem(..., preventSelectHandler = true)` → `confirmSelection()` → `setSelectedIndex`
(`sidenav.ts:795-826`) sets `_selectedIndex` to `{"1":"customers"}` **and emits it deep to
the server** (`sidenav.ts:824`). Because the property is `pushToServer: deep`, the server
stores it and, on the next model sync (~1 Hz), pushes `selectedIndex` back down. If that
inbound value is ever delivered falsy/empty (server round-trips an empty/not-yet-converged
value, or the SVY-21653 `return false` handler left the server at `{}` while the client
holds `{"1":"customers"}`), line 225-226 resets to `{}`, `markForCheck()` forces a re-check,
and the next client emit pushes `{"1":"customers"}` again. The two sides never converge →
the repeating NG0100 with exactly the two logged values.

The **symmetric `expandedIndex` branch** (`sidenav.ts:216-223`) has the identical shape and
the identical latent bug. The **`open` two-way channel** has a related echo (see 2.4).

### 2.3 Other NG0100 risk sites (referential instability + re-entrancy)

Template-invoked methods and inline literals build a **fresh object every CD pass**, each a
candidate NG0100 source under OnPush + the component's own re-entrant `detectChanges()`:

- `getSidenavClass()` → `sidenav.html:4` (new `Record<string,boolean>`), `sidenav.ts:240-256`.
- `getHeaderFormStyle()` → `sidenav.html:19` (new style object), `sidenav.ts:293-305`.
- `getFooterFormStyle()` → `sidenav.html:168,187` (new style object), `sidenav.ts:307-319`.
- `getContainerStyle()` → `sidenav.html:203` (new `cssStyle`), `sidenav.ts:346-365`.
- Inline `{container: true, reservedGap: 50}` → `sidenav.html:21,170,188,208` (new literal
  each pass; bound to the `sabloTabseq` directive via `[sabloTabseqConfig]`).
- Inline `{name: getHeaderForm()}` / `{name: getFooterForm()}` / `{name: getForm()}` outlet
  contexts → `sidenav.html:22,171,190,209`.
- `[dir]="scrollbarPosition() === 'rtl' ? 'rtl' : $any(null)"` (`sidenav.html:3`) is a scalar
  — **checked and NOT a risk** (do not touch).

Forced synchronous `detectChanges()` in the async form-show `.finally()` callbacks
(`sidenav.ts:139,144,149,156,160,167,171,189,199,206,212`) and in `copyServoyMenu`
(`sidenav.ts:1070`) resolve in a later microtask that can land in/adjacent to an ongoing
check and re-assert a just-mutated value — an NG0100 amplifier.

### 2.4 The `open` two-way echo

`animateSlideMenu` (`sidenav.ts:438-490`) is invoked from the `svyOnChanges` `open` branch
(`sidenav.ts:182`). In its `static`/no-slide else-branch (`sidenav.ts:486-489`) it force-sets
`this._open.set(true)` and emits `this.openChange.emit(...)` **while handling an `open`
change** — echoing the two-way `open` within the same tick. Genuine user toggling goes
through `slideMenu` (`sidenav.ts:519-535`), which is the only place that should emit
`openChange`.

### 2.5 Git history (why this is a refinement, not a revert)

- The reset-to-`{}` + `markForCheck()` handling (`sidenav.ts:224-231`) is **original to the
  signals migration**: the reset/`JSON.parse` body is from `0d16291` (cPecican, 2026-02-04),
  the `markForCheck()` from `475de68` ("SVY-20819 use signals instead of @input"), only
  reformatted since (`0dc08ef`, Johan Compagner, 2026-08-04). Fixing it refines the
  signals-migration behaviour rather than reverting a deliberate recent decision.
- `setSelectedIndex`'s emit + `markForCheck` (`sidenav.ts:823-825`) predate the signals work
  (`1c822f7`, lvostinar, 2025-03-21); the two-way emit is long-standing design, so
  suppressing server-originated echoes (fix item 3) must be scoped to **not** regress genuine
  user-selection emits.
- The most recent sidenav change (`09d1259`, Gabi Boros, 2026-10-21, SVY-21636 isHeading)
  touches rendering/selection guards but not the `selectedIndex`/`expandedIndex` two-way
  copy, so it did not introduce the loop.
- The style/class template methods also predate the signals migration; converting them to
  `computed()` is a forward hardening step, not a revert.

## 3. Design

### 3.1 The actual once-per-second loop (confirmed source)

The recurring error is driven by the **`servoyMenu` → `copyServoyMenu()` cycle**, not by the
`selectedIndex` input branch on its own. Reading the real code:

- `servoyMenu` is a server-model property. On every form model sync (~1 Hz while the form is
  open) a `servoyMenu` change is delivered to `svyOnChanges`, whose `case 'servoyMenu'`
  (`sidenav.ts:232-234`) schedules `copyServoyMenu()` in a microtask
  (`Promise.resolve().then(...)`).
- `copyServoyMenu()` (`sidenav.ts:1049-1072`):
  1. unconditionally `this._selectedIndex.set({})` (line 1052),
  2. rebuilds `_menu` and re-derives the selection from the menu
     (`updateSelectedNode`, lines 1065-1068), re-setting `_selectedIndex` to the
     server-derived value,
  3. **emits `this.selectedIndexChange.emit(JSON.stringify(this._selectedIndex()))`**
     (line 1069) — pushing that server-originated value **back** to the server over the
     two-way `selectedIndex` channel,
  4. forces `this.cdRef.detectChanges()` (line 1070).

The emit in step 3 writes the two-way property server-side, which the server reflects back on
the next sync as another `servoyMenu`/`selectedIndex` push — re-entering the cycle ~1 Hz. The
forced synchronous `detectChanges()` in step 4 runs in the post-init microtask (after the
view was already checked), and because step 1 momentarily sets `_selectedIndex` to `{}` and
step 2 sets it back to `{"1":"customers"}`, the bound `_selectedIndex()`-derived expressions
differ from what the host last checked → **NG0100 logged every cycle**, with exactly the two
values `{}` and `{"1":"customers"}` the reporter saw.

### 3.2 Fix: stop `copyServoyMenu` echoing the server value and forcing a re-check

Two minimal, directly-coupled changes in `copyServoyMenu()` (`sidenav.ts:1049-1072`):

1. **Do not emit `selectedIndexChange` for the server-derived selection.** Remove
   `this.selectedIndexChange.emit(JSON.stringify(this._selectedIndex()))` (line 1069). This
   selection originated from the server's own `servoyMenu`; emitting it back is the echo that
   re-triggers the next sync. (`selectedIndexChange` still fires for genuine user selection
   via `setSelectedIndex` on a real click — that path is unchanged.)
2. **Do not force a synchronous `detectChanges()` in this after-checked microtask.** Replace
   `this.cdRef.detectChanges()` (line 1070) with `this.cdRef.markForCheck()`. The signal
   writes (`_menu.set`, `_selectedIndex.set`) already schedule the OnPush view; a normal
   next-tick check applies the new value cleanly instead of forcing a re-check inside the
   same microtask that disagrees with the last-checked state. This removes the NG0100 itself.

### 3.3 Fix: avoid the transient `{}` write in `copyServoyMenu`

`copyServoyMenu` sets `_selectedIndex` to `{}` (line 1052) and then re-sets it to the derived
selection (lines 1065-1068) in the **same** microtask. That transient `{}` is the "current
value `{}`" half of the logged NG0100. Build the new selection into a local object and set
`_selectedIndex` **once**, to the final value — and only when it differs from the current
signal value, so an unchanged menu sync is a no-op that schedules nothing:

- Compute the derived selection into a local (as `updateSelectedNode` already populates it),
  then `this._selectedIndex.set(derived)` a single time at the end, guarded by
  `!isEqual(this._selectedIndex(), derived)`.
- Drop the leading `this._selectedIndex.set({})` (line 1052) so there is no intermediate empty
  state within the tick.

Use `lodash-es` `isEqual` for the deep compare (`lodash-es` is already a repo dependency; add
`import { isEqual } from 'lodash-es';` at the top of `sidenav.ts` if not present). This keeps
the final rendered selection identical to today (SVY-21634 unaffected) while removing the
`{}`↔value churn.

### 3.4 Minimal `selectedIndex`/`expandedIndex` input-branch guard (only if it contributes)

The `svyOnChanges` `case 'selectedIndex'` (`sidenav.ts:224-231`) and `case 'expandedIndex'`
(`sidenav.ts:216-223`) also set the signal and call `markForCheck()` on every inbound push.
On their own these are server-input copies; if, after §3.2–§3.3, the once-per-second NG0100 is
gone, **leave these branches unchanged** (no speculative edit). If the regression test shows
the input branch still contributes to the recurring error (e.g. the server also pushes
`selectedIndex` directly each sync), apply the minimal guard — set only when the parsed
inbound differs (`!isEqual`) from the current signal, and drop the redundant trailing
`markForCheck()` — but **only** if proven necessary by the failing test. Do not change the
reset-to-`{}` semantics or the emit paths otherwise.

This section is conditional by design: the user asked not to make speculative modifications,
so the input-branch edit is gated on evidence from the regression test rather than applied
preemptively.

## 4. Implementation plan

Narrowed to the once-per-second loop. All line references are in
`components/projects/servoyextracomponents/src/sidenav/sidenav.ts`.

1. **(If needed) add the deep-compare import.** At the top of `sidenav.ts` add
   `import { isEqual } from 'lodash-es';` (only if not already imported). Used by step 2.

2. **Rework `copyServoyMenu()` (`sidenav.ts:1049-1072`) — the core fix:**
   - Remove the leading `this._selectedIndex.set({})` (line 1052) so there is no transient
     empty state within the microtask.
   - Build the server-derived selection as today (`updateSelectedNode`, lines 1065-1068) but
     set `_selectedIndex` **once**, at the end, to the final derived value, guarded by
     `!isEqual(this._selectedIndex(), derived)` so an unchanged menu sync writes nothing.
     (If `updateSelectedNode` currently mutates `_selectedIndex` directly, have it build into
     a local the method then sets once; keep the final rendered selection identical.)
   - **Remove** the `this.selectedIndexChange.emit(JSON.stringify(this._selectedIndex()))`
     (line 1069) — do not echo the server-originated selection back to the server.
   - Replace `this.cdRef.detectChanges()` (line 1070) with `this.cdRef.markForCheck()`.

3. **Confirm the loop is gone with the regression test (step 5) BEFORE any further edit.**
   Run the test. If the once-per-second NG0100 scenario now passes, **stop** — do not touch
   the `selectedIndex`/`expandedIndex` input branches or anything else.

4. **(Conditional) minimal input-branch guard** — ONLY if step 3's test still shows the
   recurring NG0100 attributable to a direct per-sync `selectedIndex`/`expandedIndex` server
   push. Then, and only then: in `case 'selectedIndex'` (`sidenav.ts:224-231`) and
   `case 'expandedIndex'` (`sidenav.ts:216-223`), set the signal only when the parsed inbound
   differs (`!isEqual`) from the current value and drop the redundant trailing
   `markForCheck()`. No other change (keep reset-to-`{}` and emit semantics). Document in the
   PR why it was necessary.

5. **Add the regression test** (see §5) to the sidenav test file
   (`components/projects/servoyextracomponents/src/sidenav/sidenav.spec.ts` — confirm the
   actual path/framework; AGENTS.md = Vitest `.spec.ts`).

6. **Verify** (AGENTS.md post-edit checklist, run from `components/`, Windows `cmd /c "..."`):
   `npm run build` (ng-packagr type-check), `npx ng lint`, and the sidenav test:
   `npx ng test @servoy/servoyextracomponents --no-watch --include
   "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"`.

**Not in this plan (explicitly):** no `computed()` refactor of `getSidenavClass`/
`get*FormStyle`/`getContainerStyle`, no hoisting of template object literals, no blanket
`detectChanges()`→`markForCheck()` across the form-show `.finally()` callbacks, no `open`
two-way echo change. Those are deferred (see §6) and must not be changed speculatively.

## 5. Acceptance criteria

- [ ] `copyServoyMenu` (`sidenav.ts:1049-1072`) no longer momentarily sets `_selectedIndex`
      to `{}` and then re-sets it within the same microtask; it sets `_selectedIndex` **once**
      to the final server-derived selection, guarded by `!isEqual` so an unchanged menu sync
      writes nothing.
- [ ] `copyServoyMenu` no longer emits `selectedIndexChange` for the server-derived selection
      (the echo that re-triggered the ~1 Hz sync), and uses `markForCheck()` instead of a
      forced `detectChanges()`.
- [ ] A repeated **identical** `servoyMenu` sync does **not** re-emit `selectedIndexChange`
      and does **not** throw NG0100.
- [ ] **Regression test** reproducing the once-per-second scenario: with a `servoyMenu` set
      and a selection derived from it, repeated `copyServoyMenu()`/`servoyMenu` syncs plus
      `fixture.detectChanges()` throw **no** NG0100
      (`expect(() => fixture.detectChanges()).not.toThrow()`), and the rendered selection is
      unchanged across syncs (SVY-21634 preserved).
- [ ] **Regression test**: subscribe to `component.selectedIndexChange`; drive a
      `servoyMenu`-derived selection; assert the server-originated path emits **no**
      `selectedIndexChange` (while a genuine user click via `setSelectedIndex` still emits).
- [ ] The `selectedIndex`/`expandedIndex` input branches are changed **only if** the
      conditional step 4 proved necessary; if untouched, that is the expected outcome.
- [ ] Existing behaviour preserved: all current sidenav tests still pass (selection reflected
      in DOM — SVY-21634; disabled/heading guards — SVY-21636; `autoSelectFirstChildNode` —
      SVY-21389; open-toggle emits; expand/collapse handlers).
- [ ] No speculative edits: no `computed()` style refactor, no hoisted template literals, no
      blanket `detectChanges()`→`markForCheck()`, no `open`-echo change (unless a future
      ticket scopes them).
- [ ] `npm run build` compiles with no errors; `npx ng lint` reports no new warnings; the
      sidenav test file passes.

## 6. Out of scope

Per the user's direction (no speculative modifications), the following were identified by the
investigation as *possible* NG0100 risk sites but are **not the once-per-second error** and
are deliberately NOT changed here. They can be picked up by a separate hardening ticket if a
real recurrence is ever observed:

- **Reference-stable `computed()` refactor** of `getSidenavClass`, `getHeaderFormStyle`,
  `getFooterFormStyle`, `getContainerStyle` — `[class]`/`[ngStyle]` diff by content, and no
  evidence these drive the recurring error. Deferred.
- **Hoisting inline template object literals** (`{container:true,reservedGap:50}`,
  `{name:...}` outlet contexts). Deferred.
- **Blanket `detectChanges()`→`markForCheck()`** across the form-show/hide `.finally()`
  callbacks (`sidenav.ts:139,144,149,156,160,167,171,189,199,206,212`). Only the
  `copyServoyMenu` `detectChanges()` (the confirmed loop) is changed. Deferred.
- **The `open` two-way echo guard** (`animateSlideMenu` else-branch) — not the reported
  symptom. Deferred.
- **The `selectedIndex`/`expandedIndex` input-branch convergence** — applied only if the
  conditional step 4 proves it contributes; otherwise left as-is.

Hard out-of-scope (not to change under any option):

- The shared `@servoy/public` `ServoyBaseComponent` lifecycle — the fix lives in the sidenav.
- The `pushToServer: "deep"` spec contract (`components/sidenav/sidenav.spec:18-19`).
- SVY-21653 cancel-hook **semantics** (`onMenuItemSelected` returning `false` still cancels).
- Legacy `sidenav.js` / `sidenav_server.js` — not part of the NG-client CD cycle.

## 7. Open questions

| # | Question | Default assumption for implementation |
|---|---|---|
| Q1 | `copyServoyMenu` currently emits `selectedIndexChange` after re-deriving the selection from `servoyMenu`. Is there any consumer that relies on that server-originated emit (vs only genuine user selection)? | No — it is a server-derived value being echoed back; removing the emit stops the loop. Genuine user selection still emits via `setSelectedIndex`. If a real consumer needs the derived selection, it is already the server's own value. |
| Q2 | Does the server also push `selectedIndex` directly on each ~1 Hz sync (independently of `servoyMenu`), which would mean the input-branch guard (conditional step 4) is also required? | Assume not until the regression test shows otherwise; apply step 4 only if the test still reproduces NG0100 after the `copyServoyMenu` fix. |
| Q3 | Could setting `_selectedIndex` once (instead of `{}` then the value) in `copyServoyMenu` change the first-show rendering timing for SVY-21634? | No — the final value set is identical to today; only the transient `{}` is removed. The regression test asserts the rendered selection is unchanged. |
