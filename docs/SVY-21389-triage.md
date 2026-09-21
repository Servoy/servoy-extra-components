# Triage Report — SVY-21389

**Verdict:** NEEDS_INPUT

## Reported problem
On the Sidenav, selecting a **parent** node also visually selects its **first leaf** child:
the `svy-navitem-selected` class is applied to both the parent and the first child. This is a
problem because:
- The parent may or may not have an associated form.
- `onMenuItemSelected` fires only for the parent node.
- Result: the parent and first child look selected, but programmatically only the parent was
  selected.

The reporter notes this behaviour did **not** exist in 2025.03 LTS, so they raise it as a
regression. An example solution (`SideNavTest.servoy`) is attached.

## Root-cause assessment
The behaviour is produced intentionally by `setSelectedIndex` in the Angular implementation:

`components/projects/servoyextracomponents/src/sidenav/sidenav.ts:819-821`
```ts
if (item.menuItems?.length) {
    newSelectedIndex[level + 1] = item.menuItems[0].id; // select first child
}
```

When a node with children is selected, its first child id is written into the next
`selectedIndex` level. The template then applies the selected class to that child:

`components/projects/servoyextracomponents/src/sidenav/sidenav.html:31,54,76,98`
```html
[class.svy-navitem-selected]="item.id !== null && _selectedIndex()[2] === item2.id"
```

So both the parent (level N) and its first child (level N+1) match `svy-navitem-selected`.

Meanwhile `onMenuItemSelected` (`sidenav.ts:584-597`) is only invoked once, for the node the
user actually clicked (the parent). The child is never passed through the selection handler,
which matches the reporter's observation: visually two items selected, programmatically one.

## Ticket premise check
The premise (this is new vs 2025.03 LTS) holds. Git history confirms it is not the original
design but a deliberate change:

- Commit `4b9b91af` (cPecican, 2025-04-10), ticket **SVY-20141** — *"Sidenav
  getSelectedMenuItem() returns a selected item but the sidenav UI does not reflect it"* —
  introduced exactly this line in both the legacy `sidenav_server.js` and the Angular
  `sidenav.ts`, with the comment *"auto-select first child menu item when clicking/expanding a
  node"*.
- SVY-20141 is **Closed / Fixed**, fix version **2025.6.0** — which is later than the 2025.03
  LTS the reporter compares against. That fully explains why the behaviour is absent in LTS and
  present now.

So this is not an accidental regression: SVY-20141 explicitly requested that clicking a
parent (whose own form may be empty) shows and marks the first child so the displayed form and
the UI selection agree. SVY-21389 now argues the opposite — the child should **not** be
auto-selected.

The two tickets are in direct tension. SVY-20141's reporter *wanted* the child marked selected
(because the parent had no form and the child's form was being shown). SVY-21389's reporter
does *not* want the child auto-selected (because their parent nodes are display-only and the
auto-selection misrepresents state and skips the handler).

This is a genuine product/design conflict, not a clear-cut bug. Reverting SVY-20141's line
would re-open SVY-20141. A conditional fix is possible but the correct condition depends on
intended semantics that the ticket does not pin down.

## Approaches considered

1. **Auto-select first child only when the parent has no form of its own.**
   - Pros: Preserves SVY-20141 (parent with no form → child form shown & marked) while fixing
     SVY-21389's case where the parent *does* navigate/own a form.
   - Cons: The example in SVY-21389 describes parents that "may or may not have an associated
     form"; if a display-only parent legitimately shows the child form, this still auto-selects
     the child — may not fully satisfy the reporter. Needs confirmation of the exact rule.

2. **Remove the auto-select-first-child entirely (revert SVY-20141's line 819-821).**
   - Pros: Directly matches SVY-21389's request; restores 2025.03 LTS behaviour.
   - Cons: Re-introduces SVY-20141 (UI not reflecting the shown child form). Likely just moves
     the complaint to the other reporter.

3. **Gate the behaviour behind a new spec property (e.g. `autoSelectFirstChild`, default to
   current behaviour).**
   - Pros: Lets both use cases coexist; no silent regression for existing SVY-20141 users.
   - Cons: New public API surface; requires spec + Angular sync; more than a bug fix. Only worth
     it if product wants both behaviours supported.

4. **No code change needed.**
   - Pros: The current behaviour is the documented, intended outcome of SVY-20141 as shipped in
     2025.6.0; the "regression" is actually a deliberate change.
   - Cons: SVY-21389 raises a legitimate correctness concern (handler fired for parent only,
     while UI marks two items). Doing nothing leaves that inconsistency for display-only parents.

## Recommendation
Escalate for a product decision before writing any code. The right fix is entirely dependent on
the intended selection semantics, and any change here risks re-opening SVY-20141. I lean toward
Approach 1 (auto-select the child only when the parent has no form of its own) as the most
likely reconciliation, but this must be confirmed against SVY-20141's use case and the attached
example. Do not proceed to a spec/implementation until the questions below are answered.

## Git history findings
- `4b9b91af` (SVY-20141, 2025-04-10, fix version 2025.6.0): introduced the auto-select-first-child
  line in `sidenav.ts:819-821` and the equivalent in legacy `sidenav_server.js`, with matching
  `containedForm` handling. This is the direct source of the reported behaviour and explains the
  LTS-vs-current difference.
- `1c822f77` (lvostinar, 2025-03-21): original `confirmSelection` / expand logic.
- `6e714fca`, `f1086475`, `1e64c2d0`: later refinements to the `containedForm` / `showForm`
  flow around the same block, none altering the auto-select-child rule.

## Questions for the reporter
1. When a parent node **has** its own `formName`, should selecting it (a) show and mark the
   parent only, or (b) still drill into and mark the first child? SVY-21389 implies (a).
2. When a parent node is **display-only** (no `formName`) and selecting it currently shows the
   first child's form — should the first child then be marked selected (as SVY-20141 requested),
   or should nothing be marked and no form shown?
3. Do you consider SVY-20141's behaviour wrong in all cases, or only when the parent owns a
   form? (This decides between "revert" and "make conditional".)
4. Should `onMenuItemSelected` fire for the child when the child is the item whose form ends up
   displayed, or must it only ever fire for the node the user physically clicked?
5. Are you open to a configuration flag to control auto-selecting the first child, or do you
   want a single fixed behaviour?
