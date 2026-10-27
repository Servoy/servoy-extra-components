# First-show selection/expansion investigation — sidenav (SVY-21634)

Investigation only — no fix applied. All line references are to the **current** (post-`82aeb4e`)
source on master:
`components/projects/servoyextracomponents/src/sidenav/sidenav.ts`,
`.../sidenav.html`,
`components/sidenav/sidenav_server.js`,
`components/sidenav/sidenav.spec`, and the compiled base class
`components/node_modules/@servoy/public/fesm2022/servoy-public.mjs`.

## Lifecycle facts

From `ServoyBaseComponent` in `servoy-public.mjs`:

- **`ngOnChanges(changes)` (mjs:68-92)** runs before the view exists. While
  `this.elementRef()` is still undefined (the `#element` viewchild, mjs:35), every incoming
  server push is **buffered** into `this.changes` (mjs:70-78) and `svyOnChanges` is **not**
  called yet. Once `elementRef()` exists, pushes are forwarded to `svyOnChanges` immediately
  (mjs:80-91).
- **`svyOnInit` runs from `initializeComponent()` (mjs:198-203)**, which is called at the top
  of both `ngOnInit` (mjs:46-48) and `ngAfterViewInit` (mjs:53-54), guarded by
  `!this.initialized && this.getNativeElement()`. So `svyOnInit` fires the first time the
  native element is available — i.e. effectively at `ngAfterViewInit`, **before** the buffered
  `svyOnChanges` replay.
- **`ngAfterViewInit` (mjs:53-64)**: calls `initializeComponent()` (→ `svyOnInit`), then
  `if (this.elementRef() && this.changes) { this.svyOnChanges(this.changes); this.changes = null; }`,
  then **`this.cdRef.detectChanges()`** (mjs:63).

**First-show order for a form whose `onLoad` already set the model is therefore:**
1. `ngOnChanges` buffers the initial `selectedIndex` / `expandedIndex` / `servoyMenu` values
   into `this.changes` (view not built yet).
2. `svyOnInit` (`sidenav.ts:89-101`) seeds `_selectedIndex`/`_expandedIndex` from the inputs
   and, if `servoyMenu()`, schedules `copyServoyMenu()` in a microtask.
3. The **buffered** `svyOnChanges` replays with the first batch of changes.
4. `detectChanges()` renders. Any microtask (`copyServoyMenu`) runs just after.

`_menu` is a `linkedSignal(() => this.menu())` (`sidenav.ts:61`) for the plain-menu path, so it
tracks the `menu` input reactively. For the servoyMenu path `_menu` is set imperatively inside
`copyServoyMenu` (`sidenav.ts:1069`). The template only ever reads the private signals
`_selectedIndex()`/`_expandedIndex()`/`_menu()` (`sidenav.html:31,47,53,55,60,76,82,83,88,104,110,111,116`),
never the raw inputs — so a server value renders only once it has been **copied into the signal
while `_menu` already contains matching items**.

## Plain-menu path (nav_nested/nav_states) — where it breaks

### Selection (`svy-navitem-selected` absent on first show)

For `onLoad`, the Servoy runtime sets `$scope.model.selectedIndex` server-side
(`sidenav_server.js:939-974`, via `setSelectedMenuItem`→`selectItem`→`confirmSelection`→
`setSelectedIndex`) **before** the component is constructed, so `selectedIndex` is a
*first-value input*, not a later push.

- `svyOnInit` (`sidenav.ts:91`) does `this._selectedIndex.set(this.selectedIndex() ?? {})`. At
  this point `selectedIndex()` already holds the JSON string `'{"1":"customers"}'` (onLoad ran
  server-side first). **But it sets the raw string, not the parsed object** — there is no
  `JSON.parse` in `svyOnInit`. So `_selectedIndex()` becomes the *string* `'{"1":"customers"}'`,
  and the template test `_selectedIndex()[1] === item.id` (`sidenav.html:31`) indexes a string
  by `[1]` → `'"'`, never equal to an item id → **no selected class**.
- The correction would come from the buffered `svyOnChanges` replay (step 3), `case
  'selectedIndex'` (`sidenav.ts:228-235`): `typeof selectedIndex == 'string'` →
  `_selectedIndex.set(JSON.parse(selectedIndex))`. **However** this only runs if a
  `selectedIndex` SimpleChange was actually buffered. When `onLoad` set the value before the
  component existed, Angular delivers `selectedIndex` as the **initial input value**; whether it
  arrives as a buffered `SimpleChange` at all is the load-bearing question. If it does arrive as
  `firstChange`, the parse branch fixes it — **but** the reset guard (`sidenav.ts:229-230`,
  `if (!change.currentValue) this._selectedIndex.set({})`) fires for any falsy value; an initial
  `{}`/empty string stomps the seed. The combination that produces the reported symptom: the
  seed in `svyOnInit` is the un-parsed string (wrong shape), and either no `selectedIndex`
  change replays to re-parse it, or one replays falsy and resets to `{}`. Either way the
  template never matches an id on first render. **Primary break: `sidenav.ts:91` seeds the raw
  string instead of a parsed object, and the only place that parses (`sidenav.ts:231-232`)
  depends on a `selectedIndex` SimpleChange being present/non-falsy.**

### Expansion (only some groups open — "only Sales")

`expandedIndex` is a **single JSON object keyed by level**, e.g. `{"1":"sales_group"}`, not a
set of independently expandable ids. Both the server `setExpandedIndex` (`sidenav_server.js:819-845`)
and the client `setExpandedIndex` (`sidenav.ts:844-868`) rebuild `newExpandedIndex` from the
**ancestors of the one item being expanded** and store that single path, overwriting the whole
object each call. So four successive `onLoad` `setMenuItemExpanded('sales_group'...)`,
`('catalog_group'...)`, … server calls each **replace** `$scope.model.expandedIndex` with the
path of the *last* item expanded (`sidenav_server.js:845` assigns `JSON.stringify(newExpandedIndex)`
wholesale). Only the final (or, depending on level collisions, one surviving) group remains in
`expandedIndex` by the time the model is pushed. The model format simply **cannot hold four
sibling groups expanded at the same level** — `expandedIndex[1]` is a single id. This is why "only
Sales" opens: it is not a copy/timing bug but the one-path-per-level data shape. (The same
`svyOnInit` seed-the-raw-string issue, `sidenav.ts:92`, and the reset-to-`{}` guard,
`sidenav.ts:221-222`, apply identically to `_expandedIndex`, so even the single surviving group
can fail to render for the same reason as selection.)

## servoyMenu path (nav_shell) — status after 82aeb4e

**Still broken for `onLoad`-set selection, for a different reason than the plain-menu path.**

`copyServoyMenu` derives the selection **only** from `source.isSelected` on each JSMenu item
(`copyServoyMenuItem`, `sidenav.ts:1114-1116`: `if (source.isSelected) selectedNode[level] =
source.itemID;`). But `onLoad`'s `setSelectedMenuItem('customers', false, false)` on the server
(`sidenav_server.js:659-698`) routes through `selectItem`→`confirmSelection`→`setSelectedIndex`
(`sidenav_server.js:905-925, 939-974`), which writes **`$scope.model.selectedIndex`** — it does
**not** call anything that sets `isSelected` on the JSMenu item. A grep across
`components/sidenav/` finds **no** `setSelectedItem`/`isSelected` write anywhere server-side
(only the client calls `servoyMenu.setSelectedItem(item.id)` at `sidenav.ts:562`, which is a
*client-click* path, not `onLoad`). So on first show:

- The pushed `servoyMenu` items all have `isSelected === false` → `copyServoyMenu` derives an
  **empty** selection (`selection.length == 1` is false) → it falls into the
  `else if (!isEqual(previousSelectedIndex, {}))` branch (`sidenav.ts:1084-1086`) and sets
  `_selectedIndex` to `{}` → **0 elements get `svy-navitem-selected`**, exactly the symptom.
- Meanwhile the server *also* pushes `selectedIndex = '{"1":"customers"}'` (the deep two-way
  property). That arrives in `svyOnChanges case 'selectedIndex'` (`sidenav.ts:228-235`) and sets
  `_selectedIndex` to `{1:'customers'}`. **But** the servoyMenu microtask (`copyServoyMenu`,
  scheduled from `svyOnInit`/`svyOnChanges servoyMenu`) races it and resets to `{}` because no
  item isSelected — so whichever runs last wins, and copyServoyMenu typically runs in the
  trailing microtask → selection lost.

The SVY-21654 regression test (`sidenav.spec.ts:541-597`) passes **only because its fixture
hand-sets `isSelected: true` on the `customers` item** (`sidenav.spec.ts:549`). That is not what
`onLoad setSelectedMenuItem` produces at runtime (it sets `selectedIndex`, not `isSelected`), so
the green test does **not** prove the real first-show nav_shell case. `82aeb4e` fixed the NG0100
echo loop; it did **not** make the `onLoad`-set `selectedIndex` reflect on the servoyMenu path.

The `onMenuItemSelected` returning `false` (SVY-21653) and `mustExecuteOnMenuItemSelect=false`
are **not** the first-show cause here: with `preventSelectHandler=true` the server's `selectItem`
goes straight to `confirmSelection` (`sidenav_server.js:889-903`) and does set
`$scope.model.selectedIndex`. The cancel hook matters for *client clicks*, not for the
`onLoad`→model→push→`copyServoyMenu` reflection failure.

## Root cause(s)

1. **Plain-menu path:** on first show the selection/expansion arrives as the *initial input
   value*, and `svyOnInit` (`sidenav.ts:91-92`) seeds `_selectedIndex`/`_expandedIndex` with the
   **raw JSON string** instead of the parsed object; the only code that parses lives in
   `svyOnChanges` (`sidenav.ts:223-224, 231-232`) and only runs if a (non-falsy) `selectedIndex`/
   `expandedIndex` SimpleChange is buffered and replayed — plus the falsy-guard
   (`sidenav.ts:221-222, 229-230`) can reset the seed to `{}`. Net: the signal that the template
   reads does not hold a parsed object matching a menu id at first render. (Expansion
   additionally can only show one group per level by the `expandedIndex` data shape — a separate,
   expected limitation, not a copy bug.)
2. **servoyMenu path:** `copyServoyMenu` derives selection **solely** from JSMenu
   `isSelected` (`sidenav.ts:1114-1116`), but `onLoad setSelectedMenuItem` sets the server
   `selectedIndex` model, never `isSelected`. So the first-show servoyMenu sync produces an empty
   selection and even resets a correct `selectedIndex` push to `{}` (`sidenav.ts:1084-1086`),
   racing in a trailing microtask.

## Minimal fix direction (do NOT implement)

- **Parse at the seed.** In `svyOnInit` (`sidenav.ts:91-92`) seed the signals with a parsed
  object, mirroring the `svyOnChanges` branch: if `selectedIndex()` is a non-empty string,
  `JSON.parse` it before `set`, else `{}` (same for `expandedIndex`). This makes the very first
  render match ids without depending on a replayed change. It renders at `svyOnInit`/first
  `detectChanges`, strictly *before* the host's first check completes for the derived bindings,
  so it does **not** reintroduce the SVY-21654 NG0100 (the NG0100 came from writing the signal
  *after* the view was checked and echoing it back; seeding earlier and not emitting avoids that).
- **servoyMenu: reconcile with `selectedIndex`, not only `isSelected`.** In `copyServoyMenu`,
  when the JSMenu yields no `isSelected` item, fall back to the already-parsed `_selectedIndex()`
  (seeded from the `selectedIndex` input) instead of forcing `{}` (`sidenav.ts:1084-1086`). I.e.
  only clear to `{}` when there is genuinely no selection from *either* source. Keep the existing
  `applyingServerSelection` suppression and the `markForCheck()` (not `detectChanges()`) so the
  SVY-21654 loop stays fixed. Alternatively/additionally have the server-side `setSelectedMenuItem`
  set the JSMenu item's selected state so `isSelected` is authoritative — but that is a
  server-script change and broader; the client-side reconcile is the minimal component fix.
- **Do not touch** the `expandedIndex` one-path-per-level shape as part of this fix; if the ticket
  requires multiple independent sibling groups expanded, that is a model-shape change (array/set
  of expanded ids) and should be scoped separately. For SVY-21634's stated scope, parsing the
  seed makes the single surviving expanded group render on first show.

## Risks / behaviour to preserve

- **SVY-21653 cancel hook:** `onMenuItemSelected` returning `false` must still skip
  `confirmSelection` for *client clicks* (`sidenav.ts:590-602`). The fixes above touch only the
  server-originated seed/copy, not the click path, so the cancel semantics are preserved.
- **SVY-21654 no-NG0100:** keep writing the selection signal at/within `svyOnInit`+first
  `detectChanges` (not in an after-checked re-entrant pass), keep `markForCheck()` over
  `detectChanges()` in the `copyServoyMenu` microtask (`sidenav.ts:1095`), and keep the
  `applyingServerSelection` guard so no `selectedIndexChange` echoes the server value
  (`sidenav.ts:828-830`). Earlier/parsed seeding reduces, not increases, NG0100 risk.
- **Existing click selection:** `setSelectedIndex` (`sidenav.ts:799-832`) and its
  `selectedIndexChange.emit` on genuine clicks must keep emitting (gated only by
  `applyingServerSelection`).
- **expandedIndex multi-group:** preserve the current level-keyed behaviour unless the ticket is
  explicitly rescoped; do not silently change the wire format.

## Git history notes

- `82aeb4e` (lvostinar, 2026-10-27, "SVY-21654 fix repeating NG0100…") rewrote `copyServoyMenu`
  (`sidenav.ts:1055-1097`): removed the transient `_selectedIndex.set({})`, added the
  `applyingServerSelection` flag (`sidenav.ts:71`, gating the emit at `sidenav.ts:828-830`),
  added the `isEqual` reference-stabilising branches (`sidenav.ts:1084-1092`), and swapped the
  forced `detectChanges()` for `markForCheck()` (`sidenav.ts:1095`). It fixed the echo/NG0100 but
  the selection is still derived **only** from `isSelected` — so the `onLoad`→`selectedIndex`
  nav_shell first-show case is untouched.
- The plain-menu `svyOnChanges` copy (`sidenav.ts:220-235`) with its reset-to-`{}` falsy guard
  and the string-seed in `svyOnInit` (`sidenav.ts:91-92`) are **original to the signals
  migration** (`0d16291`/`475de68`, cPecican, 2026-02-04), only reformatted since. The first-show
  break is latent in that migration, not a recent regression; `82aeb4e` did not change it.
- The SVY-21654 regression test (`sidenav.spec.ts:541-597`) exercises `copyServoyMenu` with a
  fixture that **pre-sets `isSelected: true`** on `customers` (`sidenav.spec.ts:549`); it
  therefore does not cover the real `onLoad` first-show path (which sets `selectedIndex`, not
  `isSelected`). A new test for SVY-21634 should drive selection via the `selectedIndex`
  input + initial `servoyMenu` with all `isSelected:false`, and assert the selected class renders
  on first show.
