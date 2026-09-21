# Spec: SVY-21389 — Sidenav: selecting a parent node should not auto-select the first leaf node

## 1. Goal
Introduce a new boolean spec property `autoSelectFirstChildNode` (default `false`) on the
sidenav that controls whether selecting a parent node also auto-selects/marks its first child
and auto-shows that child's form. With the default `false`, selecting a parent marks and expands
the parent only — restoring the pre-SVY-20141 (2025.03 LTS) behavior the reporter expects. Setting
it `true` preserves the current SVY-20141 behavior.

## 2. Background
On the sidenav, selecting a **parent** node currently applies the `svy-navitem-selected` class to
both the parent **and** its first leaf child, and auto-shows the first child's `formName`. This is
a problem because the parent may or may not own a form, and `onMenuItemSelected` fires only for the
node the user physically clicked (the parent). Visually two items look selected; programmatically
only the parent was selected — an inconsistency for display-only parents.

This behavior is not the original design. It was introduced deliberately by commit `4b9b91af`
(SVY-20141, fix version **2025.6.0**), which is why it is absent in 2025.03 LTS and present now.
SVY-20141 wanted the first child marked/shown so that when a parent has no form of its own, the
displayed child form and the UI selection agree. SVY-21389 argues the opposite. The two tickets
are in direct tension, so the resolution is to make the behavior configurable rather than pick one
side unconditionally.

The auto-select logic lives in two places that must stay in sync:
- **Angular:** `components/projects/servoyextracomponents/src/sidenav/sidenav.ts`
  - `setSelectedIndex` child marking at lines **819-821**
    (`if (item.menuItems?.length) { newSelectedIndex[level + 1] = item.menuItems[0].id; }`)
  - `confirmSelection` child form auto-show at lines **575-581**
    (`const itm = item.menuItems?.length && item.menuItems[0].formName ? item.menuItems[0] : item;`
    → `callServerSideApi('showForm', [formToHide, menuIDToShow])`)
- **Legacy server:** `components/sidenav/sidenav_server.js`
  - `setSelectedIndex` child marking at lines **964-966**
    (`if (item.menuItems && item.menuItems.length) { newSelectedIndex[level + 1] = item.menuItems[0].id; }`)
  - `confirmSelection` child form auto-show at lines **908-910**
    (`newContainedForm = item.menuItems[0].formName;`)

Both `git blame` (`sidenav.ts:819-821` → `4b9b91af`) and the grep of `sidenav_server.js`
(lines 910, 965) confirm these are the exact lines to gate.

**Release-note item (required):** this is a behavior change for existing SVY-20141 users. Because
the default is `false`, after upgrading they will no longer get the auto-select/auto-show of the
first child. To keep the SVY-20141 behavior they must set `autoSelectFirstChildNode = true`. This
must be announced in the release notes.

## 3. Design

### 3.1 New spec property
Add to `components/sidenav/sidenav.spec` a boolean property, default `false`:

```json
"autoSelectFirstChildNode"      : { "type": "boolean", "default": false, "tags": { "doc": "When true, selecting a parent node auto-selects/marks its first child and shows that child's form (the SVY-20141 behavior). When false (default), selecting a parent marks/expands only the parent; no child is marked selected and no child form is auto-shown. Note: onMenuItemSelected still fires only for the node the user clicked, regardless of this flag." } }
```

- Default `false` matches the pre-SVY-20141 (2025.03 LTS) behavior.
- The property is client-side (bound in the Angular template, sent over the websocket). It is NOT
  `serveronly`, so it requires a matching signal input in Angular.

### 3.2 Angular `sidenav.ts` changes
1. Add the signal input, using a transform to preserve the default when Servoy binds `undefined`:
   ```typescript
   readonly autoSelectFirstChildNode = input(false, { transform: (v: any) => v ?? false });
   ```
2. Gate the **child marking** in `setSelectedIndex` (lines 819-821):
   ```typescript
   if (this.autoSelectFirstChildNode() && item.menuItems?.length) {
       newSelectedIndex[level + 1] = item.menuItems[0].id; // select first child
   }
   ```
3. Gate the **child form auto-show** in `confirmSelection` (lines 575-581). When the flag is off,
   selecting a parent must not drill into the first child's form; only the parent's own form (if
   any) should be considered:
   ```typescript
   // change containedForm
   const itm = this.autoSelectFirstChildNode() && item.menuItems?.length && item.menuItems[0].formName
       ? item.menuItems[0]
       : item;
   if (itm.formName && !isItemAlreadySelected) {
       const formToHide = this.containedForm();
       const menuIDToShow = itm.id;
       this.servoyApi().callServerSideApi('showForm', [formToHide, menuIDToShow]);
   }
   ```
   The child marking and the child form auto-show move together as one unit, both gated by the
   same flag.

### 3.3 Legacy `sidenav_server.js` changes
Mirror the Angular gating so older Servoy runtimes behave identically.
1. Gate the **child marking** in `setSelectedIndex` (lines 964-966):
   ```javascript
   if ($scope.model.autoSelectFirstChildNode && item.menuItems && item.menuItems.length) {
       newSelectedIndex[level + 1] = item.menuItems[0].id; // select first child
   }
   ```
2. Gate the **child form auto-show** in `confirmSelection` (lines 908-910). When the flag is off,
   a parent (non-leaf) selection must not set `newContainedForm` to the first child's form:
   ```javascript
   if (item.menuItems && item.menuItems.length > 0 ) { // expand the node if not leaf
       expandItem(level, index, item, event, preventExpandHandler);
       if ($scope.model.autoSelectFirstChildNode) {
           newContainedForm = item.menuItems[0].formName;
       }
   } else { // expand the parent node if is a leaf
       ...
       newContainedForm = item.formName;
   }
   ```
   Leaf-node selection (the `else` branch) is unchanged.

### 3.4 Template / selection-class behavior
No template change is required. The template applies `svy-navitem-selected` based on
`_selectedIndex()` levels
(`components/projects/servoyextracomponents/src/sidenav/sidenav.html:31,54,76,98`):

```html
[class.svy-navitem-selected]="item.id !== null && _selectedIndex()[2] === item2.id"
```

Because the flag controls whether the child id is written into the next `_selectedIndex` level,
gating `setSelectedIndex` is sufficient: with the flag off, the child level is never populated, so
the child never receives `svy-navitem-selected`.

### 3.5 `onMenuItemSelected` — unchanged
`onMenuItemSelected` (`sidenav.ts:584-597`, legacy equivalent) continues to fire only for the node
the user physically clicked, regardless of the flag. This spec does not change handler-firing
semantics.

## 4. Implementation plan
1. Add `autoSelectFirstChildNode` boolean (default `false`) to `components/sidenav/sidenav.spec`.
2. Add the `autoSelectFirstChildNode` signal input (with `?? false` transform) to
   `components/projects/servoyextracomponents/src/sidenav/sidenav.ts`.
3. Gate the child marking in Angular `setSelectedIndex` (lines 819-821) behind the flag.
4. Gate the child form auto-show in Angular `confirmSelection` (lines 575-581) behind the flag.
5. Gate the child marking in legacy `sidenav_server.js` `setSelectedIndex` (lines 964-966) behind
   `$scope.model.autoSelectFirstChildNode`.
6. Gate the child form auto-show in legacy `sidenav_server.js` `confirmSelection` (lines 908-910)
   behind `$scope.model.autoSelectFirstChildNode`.
7. Update/extend the sidenav Vitest spec to cover both flag states (see acceptance criteria).
8. Verify spec/Angular sync: the new model property has a matching signal input.
9. Build (`npm run build`), lint (`npx ng lint`), and run sidenav tests.
10. Add the behavior change to the release notes (webpackage.json / release history).

## 5. Acceptance criteria
- [ ] `sidenav.spec` defines `autoSelectFirstChildNode` as a boolean with default `false`.
- [ ] `sidenav.ts` has a matching `autoSelectFirstChildNode = input(false, { transform: (v: any) => v ?? false })`.
- [ ] With `autoSelectFirstChildNode = false` (default), selecting a parent node marks/expands only
      the parent: the first child does **not** receive `svy-navitem-selected` and its form is **not**
      auto-shown.
- [ ] With `autoSelectFirstChildNode = true`, selecting a parent node auto-marks the first child
      (`svy-navitem-selected`) and auto-shows the first child's form (the current SVY-20141 behavior).
- [ ] The child marking and child form auto-show are gated by the same flag (they move as one unit)
      in both Angular and legacy layers.
- [ ] `onMenuItemSelected` fires only for the node the user physically clicked in both flag states.
- [ ] Leaf-node selection behavior is unchanged in both flag states.
- [ ] Legacy `sidenav_server.js` honors `$scope.model.autoSelectFirstChildNode` for both the child
      marking and the child form auto-show, matching the Angular behavior.
- [ ] Release notes call out the behavior change: existing SVY-20141 users must set
      `autoSelectFirstChildNode = true` to keep the auto-select behavior.
- [ ] `npm run build` compiles, `npx ng lint` passes, and sidenav tests pass.

## 6. Out of scope
- Changing `onMenuItemSelected` firing semantics (still fires only for the clicked node).
- Any per-node or per-form conditional auto-select rule (e.g. "auto-select the child only when the
  parent has no form"). The resolution is a single global flag, not a heuristic.
- Reverting or otherwise re-litigating SVY-20141.
- Leaf-node selection and expand/collapse behavior.
- Template/markup restructuring beyond the existing `_selectedIndex`-driven class binding.

## 7. Open questions
| Question | Owner | Status |
|----------|-------|--------|
| Preferred property name — `autoSelectFirstChildNode` (assumed) vs `autoSelectFirstChild`. | Product | Assumed `autoSelectFirstChildNode` per approved approach |
| Should the release note also point SVY-20141 users to the exact upgrade step in migration docs? | Docs | Open |
