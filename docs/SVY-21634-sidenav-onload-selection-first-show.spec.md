# Spec: SVY-21634 — Sidenav `onLoad` selected item and expanded groups must render on first show

## 1. Goal

Setting the selected item (`setSelectedMenuItem`) and expanded group(s) (`setMenuItemExpanded`)
from a form's `onLoad` must be reflected **on the first render** of the sidenav — the selected
item shows `svy-navitem-selected` and the expanded group opens — across all three reported
forms:

- **nav_shell** — `.mnu` menu, so the **servoyMenu** path (`copyServoyMenu`).
- **nav_nested** / **nav_states** — plain `menu` input, so the **plain-menu** path
  (`svyOnChanges` copy seeded by `svyOnInit`).

This is a **real bug fix**, not documentation. Fix the current code so an `onLoad`-set
selection/expansion just works on first show, **without** re-introducing the SVY-21654 NG0100
loop and **without** regressing SVY-21653 (cancel hook) or existing click selection.

The investigation (`docs/SVY-21634-firstshow-investigation.md`) found **two independent root
causes**, one per menu path. Both are addressed here.

Behaviour that must be preserved:
- **SVY-21653 cancel hook** — `onMenuItemSelected` returning `false` still cancels a *client
  click* selection (`sidenav.ts:590-602` path); the fixes touch only the server-originated
  seed/copy, not the click path.
- **SVY-21654 no-NG0100 / no-echo** — the selection signal is written at/within `svyOnInit`
  and the first `detectChanges()` (before the host's first check completes for those
  bindings), never in an after-checked re-entrant pass; `copyServoyMenu` keeps
  `markForCheck()` (not `detectChanges()`) and the `applyingServerSelection` guard so no
  `selectedIndexChange` echoes the server value (`sidenav.ts:828-830`).
- **Existing click selection** — `setSelectedIndex` (`sidenav.ts:799-832`) still emits
  `selectedIndexChange` on genuine clicks (gated only by `applyingServerSelection`).

## 2. Background

### 2.1 The first-show lifecycle

`ServoyExtraSidenav extends ServoyBaseComponent<HTMLDivElement>`
(`components/projects/servoyextracomponents/src/sidenav/sidenav.ts:19`). From the compiled
base class (`components/node_modules/@servoy/public/fesm2022/servoy-public.mjs`,
`class ServoyBaseComponent`):

- `ngOnChanges(changes)` runs before the view exists; while `elementRef()` is still undefined
  every incoming server push is **buffered** into `this.changes` and `svyOnChanges` is **not**
  called yet. Once `elementRef()` exists, pushes forward to `svyOnChanges` immediately.
- `svyOnInit` fires the first time the native element is available (effectively at
  `ngAfterViewInit`), **before** the buffered `svyOnChanges` replay.
- `ngAfterViewInit` calls `initializeComponent()` (→ `svyOnInit`), then replays the buffered
  `svyOnChanges(this.changes)`, then **`this.cdRef.detectChanges()`**.

So for a form whose `onLoad` already set the model, first-show order is:
1. `ngOnChanges` buffers the initial `selectedIndex` / `expandedIndex` / `servoyMenu` values
   (view not built yet).
2. `svyOnInit` (`sidenav.ts:89-101`) seeds `_selectedIndex`/`_expandedIndex` from the inputs,
   and if `servoyMenu()` schedules `copyServoyMenu()` in a microtask (`sidenav.ts:94-96`).
3. The buffered `svyOnChanges` replays.
4. `detectChanges()` renders; any `copyServoyMenu` microtask runs just after.

The template **never reads the raw inputs** — it reads the private signals `_selectedIndex()`
/ `_expandedIndex()` / `_menu()` (`sidenav.html:31,47,53,55,60,76,82,83,88,104,110,111,116`).
It tests `_selectedIndex()[level] === item.id` and `_expandedIndex()[level] === item.id`
(e.g. `sidenav.html:31,53`). A server value renders only once it has been **copied into the
signal as a parsed object** while `_menu` already holds matching items.

### 2.2 Root cause A — plain-menu path (nav_nested, nav_states): raw-string seed

`selectedIndex` / `expandedIndex` are private, two-way, `pushToServer: "deep"` **string**
properties (`components/sidenav/sidenav.spec:18-19`); their wire value is a JSON string such
as `'{"1":"customers"}'`.

`svyOnInit` (`sidenav.ts:91-92`) seeds the signals with the **raw input value, not the parsed
object**:

```ts
this._selectedIndex.set(this.selectedIndex()??{});   // 91  -> raw JSON string
this._expandedIndex.set(this.expandedIndex()??{});   // 92  -> raw JSON string
```

For `onLoad`, the Servoy runtime sets `$scope.model.selectedIndex` server-side **before** the
component is constructed, so `selectedIndex()` already holds the JSON string on first show.
Seeding the **string** means the template test `_selectedIndex()[1] === item.id` indexes a
*string* by `[1]` (→ a single character) and never matches an item id → **no selected class**
on first render. The same applies to `_expandedIndex()` → the group does not open.

The only place that parses is `svyOnChanges` (`sidenav.ts:221-226` for `expandedIndex`,
`229-234` for `selectedIndex`):

```ts
case 'selectedIndex':
    if (!change.currentValue) {
        this._selectedIndex.set({});                 // 229-230  falsy -> reset to {}
    } else if (typeof selectedIndex == 'string') {
        this._selectedIndex.set(JSON.parse(selectedIndex)); // 231-232
    }
    this.cdRef.markForCheck();                        // 234
    break;
```

That parse only runs if a (non-falsy) `selectedIndex`/`expandedIndex` SimpleChange is actually
buffered and replayed. When `onLoad` set the value before the component existed and no such
replay occurs — or the falsy-guard (`229-230` / `221-222`) resets the seed to `{}` — the signal
the template reads never holds a parsed object matching a menu id at first render. **Net: the
seed in `svyOnInit` is the load-bearing defect; the `svyOnChanges` parse is not guaranteed.**

### 2.3 Root cause B — servoyMenu path (nav_shell): selection derived only from `isSelected`

`copyServoyMenu` (`sidenav.ts:1055-1097`) derives the selection **only** from JSMenu
`isSelected`, via `copyServoyMenuItem` (`sidenav.ts:1114-1116`):

```ts
if (source.isSelected) {
    selectedNode[level] = source.itemID;
}
```

But `onLoad setSelectedMenuItem('customers', false, false)` on the server routes through
`selectItem → confirmSelection → setSelectedIndex` and writes **`$scope.model.selectedIndex`**;
it does **not** set `isSelected` on any JSMenu item (grep across `components/sidenav/` finds no
server-side `isSelected` write). So on first show the pushed `servoyMenu` items all have
`isSelected === false` → `copyServoyMenu` derives an **empty** selection
(`selection.length == 1` is false) → it enters the
`else if (!isEqual(previousSelectedIndex, {}))` branch (`sidenav.ts:1084-1086`) and **clears
`_selectedIndex` to `{}`** → 0 elements get `svy-navitem-selected`.

Meanwhile the server also pushes `selectedIndex = '{"1":"customers"}'` (the two-way property),
which `svyOnChanges case 'selectedIndex'` parses into `{1:'customers'}`. But the
`copyServoyMenu` microtask races it and resets to `{}` (no `isSelected`), and because
`copyServoyMenu` typically runs in the trailing microtask it wins → selection lost.

### 2.4 What `82aeb4e` did and did not do

`82aeb4e` ("SVY-21654 fix repeating NG0100 …", lvostinar, 2026-10-27) rewrote `copyServoyMenu`
(`sidenav.ts:1055-1097`): removed the transient `_selectedIndex.set({})`, added
`applyingServerSelection` (`sidenav.ts:71`, gating the emit at `sidenav.ts:828-830`), added the
`isEqual` reference-stabilising branches (`sidenav.ts:1084-1092`), and swapped the forced
`detectChanges()` for `markForCheck()` (`sidenav.ts:1095`). It **fixed the echo/NG0100 loop**.
It did **not** change where selection is derived: still **only** from `isSelected`
(`sidenav.ts:1114-1116`), so the `onLoad → selectedIndex` nav_shell first-show case is
untouched. The SVY-21654 regression test (`sidenav.spec.ts:541-599`) passes **only because its
fixture hand-sets `isSelected: true`** on `customers` (`sidenav.spec.ts:549`) — not what
`onLoad setSelectedMenuItem` produces at runtime (it sets `selectedIndex`, not `isSelected`).

### 2.5 Git history

- The raw-string seed in `svyOnInit` (`sidenav.ts:91-92`) and the `svyOnChanges` parse +
  reset-to-`{}` falsy guard (`sidenav.ts:220-235`) are **original to the signals migration**
  (`0d16291`/`475de68`, cPecican, 2026-02-04 "SVY-20819 use signals instead of @input"), only
  reformatted since (`0dc08ef`, Johan Compagner, 2026-08-04). The first-show break is **latent
  in that migration**, not a recent regression; `82aeb4e` did not change it.
- `82aeb4e` (2026-10-27) is the most recent sidenav change; it reworked `copyServoyMenu` for
  SVY-21654 (see 2.4) but left the `isSelected`-only derivation in place.
- `setSelectedIndex`'s emit (`sidenav.ts:828-830`, gated by `applyingServerSelection`) predates
  the signals work (`1c822f7`, lvostinar, 2025-03-21); the two-way emit on genuine clicks is
  long-standing design and must be preserved.
- `lodash-es` `isEqual` is already imported (`sidenav.ts:6`) and used by the `82aeb4e`
  `copyServoyMenu` branches.

## 3. Design

Two fixes, one per root cause. Both land the parsed object into the template-read signal
**at/within `svyOnInit` and the first `detectChanges()`** — before the host's first check
completes for the `_selectedIndex`/`_expandedIndex`-derived bindings. Seeding the correct value
*earlier* and not emitting it back **reduces** NG0100 risk (the SVY-21654 loop came from writing
the signal *after* the view was checked and echoing it to the server); it does not re-introduce
it.

### 3.1 Fix A — parse the index strings at the `svyOnInit` seed (plain-menu path)

In `svyOnInit` (`sidenav.ts:91-92`) seed the signals with a **parsed object**, mirroring the
`svyOnChanges` parse branch. The input is declared `input<any>` (`sidenav.ts:45,47`) and its
wire type is `string` (`sidenav.spec:18-19`), but to be robust (and because the runtime may in
some cases deliver an already-parsed object) **handle both**: if the value is a non-empty
`string`, `JSON.parse` it; if it is already an object, use it as-is; otherwise `{}`.

Introduce a small private helper so both call sites share one parse that matches the existing
`svyOnChanges` house style, then seed via it:

```ts
// seed the signals the template reads with a PARSED object, not the raw JSON string,
// so an onLoad-set selection/expansion renders on first show (SVY-21634).
this._selectedIndex.set(this.parseIndex(this.selectedIndex()));
this._expandedIndex.set(this.parseIndex(this.expandedIndex()));
```

where:

```ts
private parseIndex(value: any): any {
    if (!value) return {};
    if (typeof value === 'string') return JSON.parse(value);
    return value; // already an object
}
```

Effect: at first `detectChanges()` the template reads `{1:'customers'}` (an object) and
`_selectedIndex()[1] === 'customers'` matches → the selected class renders; likewise the
expanded group opens. No dependence on a replayed `svyOnChanges`.

(Optional consistency, not required for the fix: the `svyOnChanges` `string`-branch parses can
be routed through the same `parseIndex` helper so the two sites cannot drift. If done, keep the
existing falsy reset-to-`{}` semantics in `svyOnChanges` unchanged — that is SVY-21654 scope,
not this ticket.)

**Why it does not reintroduce SVY-21654 NG0100:** the write happens inside `svyOnInit`, which
runs before the buffered `svyOnChanges` replay and before the terminal `detectChanges()` in
`ngAfterViewInit`. The derived bindings are first checked with the already-correct value; no
after-checked re-write, no `selectedIndexChange` emit from the seed.

### 3.2 Fix B — fall back to the seeded/parsed `_selectedIndex` in `copyServoyMenu` (servoyMenu path)

In `copyServoyMenu` (`sidenav.ts:1055-1097`), when the JSMenu yields **no** `isSelected` item
(`selection.length !== 1`), do **not** force `_selectedIndex` to `{}`. Instead keep the
already-seeded/parsed `_selectedIndex()` (which Fix A now seeds from the `selectedIndex` input,
e.g. `{1:'customers'}`). Only clear to `{}` when there is **genuinely no selection from either
source** — i.e. the current signal is already empty.

Current branch (`sidenav.ts:1084-1086`):

```ts
} else if (!isEqual(previousSelectedIndex, {})) {
    // no server selection: fall back to an empty selection, set once (not a transient {}).
    this._selectedIndex.set({});
}
```

Change to: **do nothing in the no-`isSelected` branch** — leave `_selectedIndex` holding the
value seeded from the `selectedIndex` input. Concretely, remove the `else if … set({})` so that
when the menu yields no selection the previously-seeded selection survives:

```ts
if (selection && selection.length == 1) {
    this.applyingServerSelection = true;
    try {
        this.updateSelectedNode(selectedNode[selection[0]], this._menu()!, parseInt(selection[0]));
    } finally {
        this.applyingServerSelection = false;
    }
}
// else: no isSelected item in the JSMenu — keep the selection already seeded from the
// selectedIndex input (SVY-21634); do NOT clear to {} and race the server push.
// the isEqual reference-stabilising guard below still prevents a needless re-render.
if (isEqual(previousSelectedIndex, this._selectedIndex())) {
    this._selectedIndex.set(previousSelectedIndex);
}
this.cdRef.markForCheck();
```

Preserve exactly:
- the `applyingServerSelection = true/false` wrapper around `updateSelectedNode`
  (`sidenav.ts:1078-1083`) so a server-derived selection never emits `selectedIndexChange`
  (`sidenav.ts:828-830`);
- the trailing `isEqual` reference-stabilisation (`sidenav.ts:1090-1092`);
- `markForCheck()` (not `detectChanges()`) at the end (`sidenav.ts:1095`).

**Why it does not reintroduce SVY-21654 NG0100:** the microtask no longer sets `{}` then a
value; it keeps the already-rendered seeded selection, emits nothing, and marks for check. The
value the host last checked (the seed from Fix A) and the value after `copyServoyMenu` agree, so
no `ExpressionChangedAfterItHasBeenChecked`.

**Note (server alternative, out of scope):** an alternative is to make the server-side
`setSelectedMenuItem` set the JSMenu item's `isSelected` so `isSelected` becomes authoritative.
That is a broader `sidenav_server.js` change; prefer the client-side reconcile above. Mentioned
only as a note (see §6).

### 3.3 Expansion on the servoyMenu path

`copyServoyMenu` already parses `_expandedIndex` from a string (`sidenav.ts:1058-1061`) and, with
Fix A seeding the parsed `_expandedIndex` object, the expanded group renders on first show. No
additional expansion change is needed here. The one-expanded-group-per-level limitation (2.6
below) is a separate data-shape concern (§6).

### 3.4 Out-of-scope limitation to record: `expandedIndex` one-path-per-level

`expandedIndex` is a single JSON object keyed by level, e.g. `{"1":"sales_group"}` — it can hold
only **one** expanded group per level. Both the server and client `setExpandedIndex` rebuild the
object from the **ancestors of the one item being expanded** and overwrite the whole object, so
four successive `onLoad` `setMenuItemExpanded(...)` calls at the same level each replace the
previous → only the last (or one surviving) group remains. This is why "only Sales" opened of
four sibling groups. Changing the wire format to support multiple independent sibling expansions
is a larger change and is **OUT OF SCOPE** (see §6, Open Question Q1). Fix A makes the single
surviving expanded group render on first show — that is this ticket's expansion scope.

## 4. Implementation plan

All line references are in
`components/projects/servoyextracomponents/src/sidenav/sidenav.ts` (confirmed against current
`82aeb4e` source).

1. **Add the `parseIndex` helper.** Add a private method (place it near the other selection
   helpers, e.g. just below `svyOnChanges` or near `copyServoyMenu`):
   ```ts
   private parseIndex(value: any): any {
       if (!value) return {};
       if (typeof value === 'string') return JSON.parse(value);
       return value;
   }
   ```
   (`isEqual` and `JSON` are already available; no new import.)

2. **Fix A — parse at the seed in `svyOnInit` (`sidenav.ts:91-92`).** Replace:
   ```ts
   this._selectedIndex.set(this.selectedIndex()??{});
   this._expandedIndex.set(this.expandedIndex()??{});
   ```
   with:
   ```ts
   this._selectedIndex.set(this.parseIndex(this.selectedIndex()));
   this._expandedIndex.set(this.parseIndex(this.expandedIndex()));
   ```

3. **Fix B — stop clearing to `{}` in `copyServoyMenu` (`sidenav.ts:1084-1086`).** Remove the
   `else if (!isEqual(previousSelectedIndex, {})) { this._selectedIndex.set({}); }` branch so
   that when no JSMenu item is `isSelected` the selection seeded from the `selectedIndex` input
   is kept. Leave the `applyingServerSelection` wrapper (`1078-1083`), the trailing `isEqual`
   reference-stabilisation (`1090-1092`), and `markForCheck()` (`1095`) unchanged.

4. **(Optional) route the `svyOnChanges` string parses through `parseIndex`** (`sidenav.ts:224`
   and `232`) so the two parse sites cannot drift. Do **not** change the falsy reset-to-`{}`
   semantics there (SVY-21654 scope). Skip if it risks touching the SVY-21654 branch — the fix
   does not depend on it.

5. **Add regression tests** (see §5) to
   `components/projects/servoyextracomponents/src/sidenav/sidenav.spec.ts`.

6. **Verify** (AGENTS.md post-edit checklist, from `components/`, Windows `cmd /c "..."`):
   - `npm run build` (ng-packagr type-check),
   - `npx ng lint`,
   - `npx ng test @servoy/servoyextracomponents --no-watch --include
     "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"`.

## 5. Acceptance criteria

- [ ] **Fix A applied:** `svyOnInit` (`sidenav.ts:91-92`) seeds `_selectedIndex`/`_expandedIndex`
      with a **parsed object** (via `parseIndex`), not the raw JSON string.
- [ ] **Fix B applied:** `copyServoyMenu` (`sidenav.ts:1084-1086`) no longer clears
      `_selectedIndex` to `{}` when the JSMenu has no `isSelected` item; it keeps the selection
      seeded from the `selectedIndex` input. `applyingServerSelection`, the `isEqual`
      reference-stabilisation, and `markForCheck()` are unchanged.
- [ ] **Regression test (a) — plain-menu first show (nav_nested/nav_states):** set the `menu`
      input (a tree containing `customers` under a `sales` group) and the `selectedIndex` input
      as the JSON **string** `'{"1":"customers"}'` (and an `expandedIndex` string such as
      `'{"1":"sales"}'`); run init (`svyOnInit`) + `detectChanges`; assert `component['_selectedIndex']()`
      equals the **parsed** object `{1:'customers'}` (not the raw string), the matching item's
      `<li>` has `svy-navitem-selected`, and the expanded group is shown. **This must FAIL
      against pre-fix code** (raw-string seed → string indexed by `[1]`, no match).
- [ ] **Regression test (b) — servoyMenu first show WITHOUT `isSelected`:** set a `servoyMenu`
      with all items `isSelected: false` **plus** a `selectedIndex` input `'{"1":"customers"}'`;
      after `svyOnInit` seeds + `copyServoyMenu` + `detectChanges`, assert
      `component['_selectedIndex']()` equals `{1:'customers'}` (not wiped to `{}`) and renders —
      distinct from the existing SVY-21654 test that pre-sets `isSelected: true`
      (`sidenav.spec.ts:549`). **Must FAIL pre-fix** (cleared to `{}` at `1084-1086`).
- [ ] **Regression test (c) — guard SVY-21654:** a repeated identical `servoyMenu` sync still
      throws **no** NG0100 (`expect(() => fixture.detectChanges()).not.toThrow()`) and emits
      **no** server-originated `selectedIndexChange`. (May extend the existing
      `sidenav.spec.ts:541-599` describe block.)
- [ ] **SVY-21653 preserved:** a *client click* whose `onMenuItemSelected` returns `false` still
      cancels (no selected class applied), unchanged by these fixes.
- [ ] **Existing click selection preserved:** `setSelectedIndex` on a genuine click still emits
      `selectedIndexChange` (gated only by `applyingServerSelection`).
- [ ] All current sidenav tests still pass (SVY-21654 loop test, SVY-21636 isHeading,
      SVY-21389 autoSelectFirstChildNode, open-toggle, expand/collapse).
- [ ] `npm run build` compiles with no errors; `npx ng lint` reports no new warnings; the
      sidenav test file passes.

## 6. Out of scope

- **`expandedIndex` multi-sibling data shape.** The wire format holds one expanded group per
  level (§3.4); supporting multiple independent sibling expansions is a separate, larger change
  (array/set of expanded ids on both client and `sidenav_server.js`). Not done here; recorded as
  a known limitation and Open Question Q1. The parse-at-seed fix makes the single surviving
  expanded group render — that is this ticket's expansion scope.
- **Server-side `setSelectedMenuItem` setting JSMenu `isSelected`.** A broader `sidenav_server.js`
  change that would make `isSelected` authoritative on the servoyMenu path. The client-side
  reconcile (Fix B) is the minimal component fix; the server alternative is a note only (§3.2).
- **The shared `@servoy/public` `ServoyBaseComponent` lifecycle** — unchanged.
- **SVY-21653 / SVY-21654 behaviour** — preserved, not altered.
- **The `pushToServer: "deep"` spec contract** (`sidenav.spec:18-19`) — unchanged.
- **Legacy AngularJS `sidenav.js`** — still used by older runtimes; untouched.
- **The broader SVY-21654 hardening deferrals** (reference-stable `computed()` style/class
  methods, hoisted template literals, blanket `detectChanges()`→`markForCheck()`, `open`-echo
  guard) — not part of this ticket.

## 7. Open questions

| # | Question | Default assumption for implementation |
|---|---|---|
| Q1 | Should `expandedIndex` support multiple independent sibling groups expanded at the same level (the "all four groups open" expectation)? | No for this ticket — the one-path-per-level shape is a separate, larger model-format change (§3.4). Fix A renders the single surviving expanded group; multi-sibling expansion is tracked separately. |
| Q2 | Can the `selectedIndex` / `expandedIndex` input ever arrive as an **already-parsed object** (not a string) in some runtime path? | `parseIndex` handles both: non-empty string → `JSON.parse`, object → use as-is, falsy → `{}`. No behavioural assumption needed; robust to either. |
| Q3 | Could seeding the parsed object earlier in `svyOnInit` (vs the raw string) change timing enough to re-trigger SVY-21654 NG0100? | No — the write is inside `svyOnInit`, before the buffered `svyOnChanges` replay and the terminal `detectChanges()`, so the derived bindings are first checked with the correct value and nothing is emitted back. Regression test (c) guards this. |
| Q4 | Should the server-side `setSelectedMenuItem` also set JSMenu `isSelected` so the servoyMenu path does not rely on the `selectedIndex` reconcile? | Not in this ticket — prefer the client-side reconcile (Fix B). The server change is a broader `sidenav_server.js` edit noted in §3.2/§6; can be scoped separately if desired. |
