# Review Summary — SVY-21654: Sidenav NG0100 (ExpressionChangedAfterItHasBeenChecked) every second

**Risk: ELEVATED** — removing the `{}` reset in `copyServoyMenu` means a server-selected parent with children counts as "already selected" on every later sync, so `confirmSelection` may take the collapse branch and toggle expand/collapse; no test covers it and it was not run.

**Scope reviewed:** servoy-extra-components, commit `82aeb4e` (master). Later commits build on it: `b734d62`, `6f792f9`, `a2d7abc`.

## Manual test plan

**Verifying the fix**
1. Form with a servoyMenu sidenav and a `containedForm`; call `elements.sidenav_1.setSelectedMenuItem('customers', false, false)` in `onShow`.
2. Open the form and watch `/servoy-admin/log` for about 30 s: no NG0100.
3. `customers` shows as selected in the client.

**Regression checks**
1. Server-selected parent with children: watch for expand/collapse flicker over 10 s or more (top risk).
2. Item with a `formName`: the form loads once and does not reload every second.
3. User clicks another item: `onMenuItemSelected` fires and the selection reaches the server.
4. `autoSelectFirstChildNode=true` with a server-selected parent: compare client and server selection.
5. Select via `menu.setSelectedItem(x)` from solution code, then read `getSelectedIndex()` and compare with the pre-fix build.
6. Menu with no `isSelected` item and a preset `selectedIndex` (SVY-21634 / `a2d7abc`): the selection survives.
7. Handler returning `false` (SVY-21653): no repeating error.

Automated (from `components/`): `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"`, `npm run lint`, `npm run build`.

## Possible improvements / follow-ups
- Add a test where the server-selected item has children, run 3 syncs, and assert the expanded state is stable.
- `servoyMenu.setSelectedItem(item.id)` is still called on every sync and is not gated by `applyingServerSelection`; check at runtime whether it re-triggers a round trip.
- The server `model.selectedIndex` is no longer updated for JSMenu-driven selection or the auto-selected first child; confirm whether the Servoy runtime mirrors it.
- The "no NG0100 across repeated syncs" test probably passes on pre-fix code (jsdom cannot reproduce host-driven NG0100); confirm the fix in a real NGClient.
- Confirm that Fix Version 2026.12 is the version master currently ships.
- `.opencode/sdd/project-context.md` still says Cypress/`.cy.ts`; the repo uses Vitest `*.spec.ts`.
