# Review Summary — SVY-21654: Sidenav NG0100 (ExpressionChangedAfterItHasBeenChecked) every second

**Risk: MODERATE (was ELEVATED on `82aeb4e` alone)** — the two code risks the review found are fixed in `2cd6c49`; what remains can only be settled in a running NGClient.

**Scope reviewed:** servoy-extra-components, `82aeb4e` (master), then the review fixes in `2cd6c49`. Later commits build on the same code: `b734d62`, `6f792f9`, `a2d7abc`.

## Found in review and fixed in `2cd6c49`
- **Expand/collapse toggle (was the ELEVATED driver).** Without the `{}` reset in `copyServoyMenu`, a server-selected parent with children counted as "already selected" on every sync, so `confirmSelection` took the collapse branch and the node could flip expanded/collapsed. A server-derived re-selection now always expands (no-op when already expanded); a real user re-click still collapses.
- **Reference restore failed with `autoSelectFirstChildNode`.** `clearSelectedIndex` deleted deeper levels from the previous `_selectedIndex` object in place, so the `isEqual` check failed and a new object was written on every sync. `copyServoyMenu` now compares against a snapshot taken before re-deriving and puts the levels back before restoring the previous object.
- Three tests were added to `sidenav.spec.ts` (expanded parent stays expanded over repeated syncs, a user re-click still collapses, stable `_selectedIndex` reference with `autoSelectFirstChildNode`). The first and the third fail without their fix. Sidenav spec: 104 of 104 pass; ESLint clean on both files; `npm run build` passes.

## Still open (needs a real NGClient)
- **Original symptom.** Confirm the NG0100 is gone: form with a servoyMenu sidenav and `containedForm`, `setSelectedMenuItem('customers', false, false)` in `onShow`, watch `/servoy-admin/log` for about 30 s. The jsdom tests cannot reproduce the host-driven NG0100.
- **`servoyMenu.setSelectedItem(item.id)` still runs on every sync** (`sidenav.ts:585`) and is not gated by `applyingServerSelection`. If the runtime pushes an update back for it, a roughly 1 Hz round trip may remain.
- **Server `model.selectedIndex` can go stale.** The echo is gone, and `sidenav_server.js:1104` is the only server-side writer. After `menu.setSelectedItem(x)` from solution code, or an `autoSelectFirstChildNode` first-child pick, the server value may differ from the client. Unverified: whether the Servoy runtime mirrors the JSMenu selection itself.
- **`autoSelectFirstChildNode` with a server-selected parent:** the client selects the first child and the server is not told. Product decision: is that divergence acceptable?
- **`svyOnChanges` still resets `_selectedIndex` to `{}` on any falsy `selectedIndex` push** (`sidenav.ts:245-252`, same pattern for `expandedIndex`). The author's spec lists it as a possible second source and deferred it; look here first if the loop is not fully closed.
- **Fix Version `2026.12`** was not confirmed against master (Jira unreleased-version list could not be read).

## Manual test plan

**Verifying the fix**
1. Form with a sidenav that uses a servoyMenu and a `containedForm`; call `elements.sidenav_1.setSelectedMenuItem('customers', false, false)` in `onShow`.
2. Open the form and watch `/servoy-admin/log` for about 30 s: no NG0100.
3. `customers` shows as selected in the client.

**Regression checks**
1. Server-selected parent with children: no expand/collapse flicker over 10 s or more; clicking the selected, expanded parent yourself still collapses it.
2. Same with `autoSelectFirstChildNode=true`: the first child is selected and the selection does not churn; compare the client and server selection.
3. Item with a `formName`: the form loads once and does not reload every second.
4. Click another item: `onMenuItemSelected` fires and the selection reaches the server.
5. Select via `menu.setSelectedItem(x)` from solution code, then read `getSelectedIndex()` and compare with the pre-fix build.
6. Menu with no `isSelected` item and a preset `selectedIndex` (SVY-21634 / `a2d7abc`): the selection survives.
7. Handler returning `false` (SVY-21653): no repeating error.
8. Watch the network tab for about 10 s on a server-selected item with children: no repeating calls.

Automated (from `components/`): `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"`, `npm run lint`, `npm run build`.

## Possible improvements / follow-ups
- Gate the `expandedIndexChange` emit from the server-derived path as well; it converges after one round today because `expandItem` returns early when already expanded.
- In single-open mode a sync re-expands the server-selected parent even if the user expanded another node (not a regression, pre-fix behaved the same); only relevant if something else keeps changing `servoyMenu`.
- `.opencode/sdd/project-context.md` still says Cypress/`.cy.ts`; the repo uses Vitest `*.spec.ts`.
- The "expand the node if if the node is not expanded" comment at `sidenav.ts:591` has a duplicated "if".
