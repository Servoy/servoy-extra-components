# Spec: SVY-21635 — sidenav: allow several groups open at once (`allowMultipleExpanded`)

## 1. Goal
Add an `allowMultipleExpanded` boolean model property (default `false`) to
`servoyextra-sidenav` so that, when enabled, expanding one group no longer collapses its
siblings — several sections at the same level can stay open at once, which is a common
navigation pattern. With the flag off (the default) the component keeps its current
single-open "accordion" behaviour and its existing serialized `expandedIndex` format,
byte-for-byte, so no existing solution changes. The single-open default is also documented
on the new property.

## 2. Background

### 2.1 Current behaviour (single-open accordion)
The sidenav stores its expanded state as a flat `{ level → id }` map that holds at most
**one** expanded node per level. Expanding a group therefore drops any sibling that was
open at that level — the collapse-the-other-group behaviour the ticket reports. The
`sidenav.js` comment "call onMenuItemCollapse when another node is expanded"
(`components/sidenav/sidenav.js`) documents this as intended legacy behaviour. There is no
property to turn it off, and the single-open default is undocumented in the component
properties.

Reproduced in the running NG client (2026.9): on a form with groups Sales (open) and
Catalog, People & Logistics, Reference (closed), clicking "Catalog" opens Catalog and
closes Sales. An `onLoad` that called `setMenuItemExpanded(..., true)` for four groups ended
with only one open.

### 2.2 Where the single-slot model lives (dual-layer)
The expanded state is represented identically on both layers and both must stay in sync.

**Client — `components/projects/servoyextracomponents/src/sidenav/sidenav.ts`:**
- `_expandedIndex = signal<any>({})` (line 59) — keyed by level, value is a single node id.
- `setExpandedIndex(level, index, item)` (lines 852–877) rebuilds `newExpandedIndex` from
  the clicked node's ancestors (`newExpandedIndex[i+1] = anchestors[i].id`) plus
  `newExpandedIndex[level] = item.id` (only when `levels[level] !== item.id`, which is the
  click-to-collapse toggle), then **replaces** the whole map
  (`this._expandedIndex.set(newExpandedIndex)`) and emits
  `expandedIndexChange.emit(JSON.stringify(newExpandedIndex))`. Replacing the map is what
  drops the sibling.
- `clearExpandedIndex(level)` (lines 880–889) deletes every entry whose level number is
  greater than `level` (sub-level reset).
- `isNodeExpanded(nodeId, level?)` (lines 929–941) returns `levels[level] === nodeId` when a
  level is given, else scans all levels for the id.
- `toggleExpandedItem` (line 614) / `expandItem` (line 622) / `collapseItem` (line 659) call
  `isNodeExpanded(item.id, level)` and `setExpandedIndex` / `clearExpandedIndex`.
- `parseIndex(value)` (lines 246–250) seeds `_expandedIndex` from the serialized string on
  init (SVY-21634 first-show fix).
- The template (`sidenav.html`) renders a sublist and the caret state only when
  `_expandedIndex()[level] === item.id` (level 1 at lines 47, 53, 55; level 2 at lines 76,
  82, 83; level 3 at lines 104, 110, 111; and the same shape at level 4), so structurally
  only one branch per level can be open.

**Server — `components/sidenav/sidenav_server.js`:**
- `setExpandedIndex(level, index, item)` (lines 819–846) builds `newExpandedIndex` the same
  way and assigns `$scope.model.expandedIndex = JSON.stringify(newExpandedIndex)`,
  overwriting siblings.
- `clearExpandedIndex(level)` (lines 853–865), `expandItem` (line 741), `collapseItem`
  (line 781, note it calls `clearExpandedIndex(level - 1)`) and `isNodeExpanded(nodeId,
  level)` (line 1008) mirror the client exactly.

### 2.3 Not a regression
The single-open model predates the recent sidenav work. `setExpandedIndex` /
`newExpandedIndex` first appears via `0d16291` "SVY-20819 use signals instead of @input"
(a mechanical signals migration, not a behaviour change). The most recent sidenav commit
`b734d62` "SVY-21634 reflect onLoad-set sidenav selection/expansion on first show"
explicitly recorded this one-group-per-level limitation as a separate, out-of-scope
data-shape change — i.e. this ticket. Any fix must preserve the guards those commits added:
`applyingServerSelection` (NG0100 loop guard) and the `cdRef.markForCheck()` calls.

### 2.4 Approved approach (from triage)
PROCEED with **Approach 1**: add `allowMultipleExpanded` (default `false`) and, when
enabled, change expanded-state tracking from a single id per level to a **set of expanded
ids**, so sibling groups can be open simultaneously. The default-off path must stay
byte-for-byte compatible with today's accordion behaviour and the existing serialized
`expandedIndex` format. Apply symmetrically in the Angular component (`sidenav.ts` +
`sidenav.html`) and the server script (`sidenav_server.js`), update the `.spec` model and
`sidenav_doc.js`, and add tests for both flag states.

## 3. Design

### 3.1 Property contract
- Name: `allowMultipleExpanded`, type `boolean`, default `false`.
- Place it in `components/sidenav/sidenav.spec` next to the other sidenav flags (after
  `autoSelectFirstChildNode`, line 42), with a `"tags": { "doc": ... }` string describing
  the single-open default and the multi-open behaviour. It is a design-time flag, so no
  `pushToServer` is needed (it is read on both the client and the server from the model).
- Add a matching signal input in `sidenav.ts`:
  `readonly allowMultipleExpanded = input(false, { transform: (v: any) => v ?? false });`
  The transform guards against the Servoy form template binding `[allowMultipleExpanded]="model.allowMultipleExpanded"`
  evaluating to `undefined` when the server never sends a value (the documented
  signal-default gotcha).

### 3.2 Expanded-state representation
Keep the serialized form of `expandedIndex` as the `{ level → id }` JSON object. Do **not**
change the on-the-wire shape — `selectedIndex`/`expandedIndex` are `pushToServer: "deep"`
private strings and existing solutions may have persisted them. Instead, broaden the value
at a level to also accept an **array of ids** `{ level → id | id[] }`, used **only** when
`allowMultipleExpanded` is on:

- Flag **off** (default): behaviour and serialization are unchanged. `setExpandedIndex`
  still replaces the map and writes a single id per level. This is the byte-for-byte
  compatible path.
- Flag **on**: a level holds a set of expanded ids. `setExpandedIndex` **merges** the
  clicked node's id into the existing set at its level (rather than replacing the map), and
  toggling an already-expanded node removes just that id from the set. Ancestor levels are
  still expanded along the clicked node's path.

A small set of helpers normalizes access so the template predicates and `isNodeExpanded`
do not need to branch everywhere:

- `isNodeExpanded(nodeId, level?)` — when `level` is given, returns `true` if the stored
  value at `level` equals `nodeId` (single-id case) **or** is an array containing `nodeId`
  (multi case). The no-level scan is updated the same way. The template keeps calling
  `isNodeExpanded(...)` instead of inlining `_expandedIndex()[level] === item.id` so the
  array case is handled in one place.
- A `levelHasExpanded(level)` / `isExpandedAt(level, id)` internal predicate backs the
  template's "show sublist" and caret conditions.

### 3.3 `setExpandedIndex` (client and server, symmetric)
Pseudocode for both `sidenav.ts` and `sidenav_server.js`:

```
compute ancestors of item.id            // same as today
build newExpandedIndex from ancestors    // { i+1 -> ancestor[i].id }

if (allowMultipleExpanded) {
    start from a CLONE of the current expandedIndex (preserve siblings)
    overlay the ancestor path onto it
    at `level`:
        if item.id already expanded at this level -> remove it (toggle off)
        else -> add item.id to the set at this level (merge, keep siblings)
} else {
    // unchanged single-open path
    if (levels[level] !== item.id) newExpandedIndex[level] = item.id;
    // newExpandedIndex is the fresh ancestor-only map (replaces siblings)
}

persist: client -> _expandedIndex.set(...) + expandedIndexChange.emit(JSON.stringify(...)) + cdRef.markForCheck()
         server -> $scope.model.expandedIndex = JSON.stringify(...)
```

The collapse toggle currently lives partly in `setExpandedIndex` (the `levels[level] !==
item.id` check) and partly in `toggleExpandedItem`/`collapseItem`. When the flag is on,
`clearExpandedIndex(level)` must only clear **sub-levels** (level numbers greater than
`level`), which it already does — it must not wipe the current level's set. Verify
`collapseItem`'s `clearExpandedIndex(level - 1)` call (server line 805) still collapses only
the intended node when a level holds a set: with the flag on, collapsing a single node must
remove just that node's id from its level's set and clear its descendants, not collapse its
siblings. Adjust `collapseItem`/`clearExpandedIndex` so sibling sets survive in multi mode.

### 3.4 Template (`sidenav.html`)
Replace the direct `_expandedIndex()[N] === itemN.id` comparisons (sublist `@if`, the
`svy-sidenav-collapsed` class binding, and the caret `iconCollapse/Expand` class) with
calls to `isNodeExpanded(itemN.id, N)` at every level (1–4). This keeps a single source of
truth for "is this node expanded" and makes the array case render correctly without
duplicating the set-membership logic in the template. Behaviour for the flag-off path is
identical because `isNodeExpanded(id, level)` returns `levels[level] === id` there.

### 3.5 Documentation (`sidenav_doc.js`)
Add a `var allowMultipleExpanded;` entry near the other flag vars (e.g. after
`var animate;`), documenting: default `false` = single group open per level (the existing
accordion behaviour, expanding a group collapses the previously open sibling); `true` = several
sibling groups can stay open at once. This satisfies the ticket's second request (document the
single-open default). Mirror the same sentence in the `.spec` property's `doc` tag.

### 3.6 Scope of both menu paths
The change must cover both the plain `menu` (`MenuItem[]`) path and the `servoyMenu`
(`IJSMenu`) path, since both feed the same `_expandedIndex` / `$scope.model.expandedIndex`
state and the same template. No separate handling is expected, but both should be exercised
when verifying.

## 4. Implementation plan

1. **`components/sidenav/sidenav.spec`** — add the `allowMultipleExpanded` boolean model
   property (default `false`) after `autoSelectFirstChildNode` (line 42), with a `doc` tag
   describing the single-open default and the multi-open behaviour.
2. **`components/projects/servoyextracomponents/src/sidenav/sidenav.ts`**
   - Add the signal input `allowMultipleExpanded = input(false, { transform: v => v ?? false })`.
   - Update `setExpandedIndex` to branch on `allowMultipleExpanded()`: unchanged
     replace-map path when off; clone-and-merge (toggle a single id in the level's set)
     when on. Keep `expandedIndexChange.emit(JSON.stringify(...))` and `cdRef.markForCheck()`.
   - Update `isNodeExpanded(nodeId, level?)` to treat a level value as either a single id or
     an array of ids.
   - Ensure `clearExpandedIndex` only clears sub-levels (unchanged) and does not wipe the
     current level's set in multi mode; adjust `collapseItem` so collapsing one node in
     multi mode removes only that id (and its descendants), not its siblings.
   - Confirm `svyOnInit` still seeds `_expandedIndex` via `parseIndex(...)` (SVY-21634) and
     that `parseIndex` tolerates array values at a level.
3. **`components/projects/servoyextracomponents/src/sidenav/sidenav.html`** — replace every
   `_expandedIndex()[N] === itemN.id` (sublist `@if`, `svy-sidenav-collapsed` class, caret
   class) with `isNodeExpanded(itemN.id, N)` for levels 1–4.
4. **`components/sidenav/sidenav_server.js`** — mirror the `setExpandedIndex` branch, the
   `isNodeExpanded` array handling, and the `clearExpandedIndex`/`collapseItem` adjustment,
   reading `$scope.model.allowMultipleExpanded`. Keep the serialized string format.
5. **`components/sidenav/sidenav_doc.js`** — add `var allowMultipleExpanded;` with the
   documented default/behaviour.
6. **Tests** — `components/projects/servoyextracomponents/src/sidenav/sidenav.spec.ts`
   (Vitest), both flag states:
   - flag **off**: expanding a second sibling collapses the first (existing accordion
     behaviour preserved); the emitted/serialized `expandedIndex` is unchanged single-id
     shape.
   - flag **on**: expanding a second sibling leaves the first open; both appear as expanded
     via `isNodeExpanded`; collapsing one leaves the other open; ancestor path still
     expands; serialized form round-trips through `parseIndex`.
   - `setMenuItemExpanded(id, true)` called for multiple sibling groups (the ticket's
     `onLoad` scenario) leaves all open when the flag is on, and only the last when off.
7. **Verify** — from `components/`: `npm run build`, `npx ng lint`, and
   `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"`.

## 5. Acceptance criteria
- [ ] A new boolean model property `allowMultipleExpanded` (default `false`) exists in
      `sidenav.spec`, with a matching signal input in `sidenav.ts` and a `var` entry in
      `sidenav_doc.js`.
- [ ] With `allowMultipleExpanded = false` (default), behaviour is unchanged: expanding a
      group collapses the previously open sibling at that level, and the serialized
      `expandedIndex` keeps its exact current `{ level → id }` single-id shape.
- [ ] With `allowMultipleExpanded = true`, expanding sibling groups leaves earlier ones
      open; several sections at the same level can be open simultaneously; collapsing one
      leaves the others open.
- [ ] The ticket's `onLoad` scenario — calling `setMenuItemExpanded(id, true)` for four
      sibling groups — leaves all four open when the flag is on.
- [ ] The change is applied symmetrically on client (`sidenav.ts` + `sidenav.html`) and
      server (`sidenav_server.js`); both the `menu` and `servoyMenu` paths work.
- [ ] Ancestor expansion (opening a deep node expands its parents) still works in both flag
      states.
- [ ] The single-open default is documented on the property (`.spec` doc tag and
      `sidenav_doc.js`).
- [ ] The SVY-21634 guards are preserved (`applyingServerSelection`, `cdRef.markForCheck()`),
      no NG0100 warning is reintroduced.
- [ ] `npm run build` and `npx ng lint` pass; the sidenav Vitest spec passes for both flag
      states.

## 6. Out of scope
- Changing the on-the-wire serialized shape of `selectedIndex`/`expandedIndex` beyond
  allowing an array value per level (the `{ level → id }` single-id form stays the default).
- Multi-**selection** (`selectedIndex` stays single-select); this ticket is about expansion
  only.
- The related "initial expanded/selected state" ticket (filed together with this one) and
  SVY-21633 styling hooks.
- Any change to the legacy AngularJS `sidenav.js` behaviour beyond what the server/client
  parity requires.

## 7. Open questions
| Question | Owner | Status |
|----------|-------|--------|
| When `allowMultipleExpanded` is on and a node is selected (not just toggled), should selecting a sibling still auto-collapse the previously selected group, or only toggling via the caret collapses? Assumption: with the flag on, neither selection nor caret collapses siblings — only explicit collapse of a node removes it. | Dev / reporter | open |
| Should the array-valued `expandedIndex` ever be produced when the flag is off (e.g. if a solution flips the flag at runtime from on→off)? Assumption: flag off always writes the single-id shape; a pre-existing array value at a level is tolerated on read but normalized to single-id on the next write. | Dev | open |
