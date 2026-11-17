# SVY-21634 - Peer Review Summary

**Risk: MODERATE.** The removed "clear selection to `{}`" branch in `copyServoyMenu` changes servoyMenu (.mnu) behaviour on every menu sync, not only on first show, and nothing was run in a real Servoy client.

Reviewed: `servoy-extra-components`, commit `b734d62` (master). Fix Version 2026.12, release-target check MATCH.

## Manual test plan

**Verifying the fix**
1. Plain menu: call `setSelectedMenuItem('customers')` in the form's `onLoad`. On first show `customers` must carry `svy-navitem-selected` (`nav_states`).
2. Plain nested menu: add `setMenuItemExpanded('sales', true)` in `onLoad`. The group must be open and the item selected (`nav_nested`).
3. servoyMenu (`.mnu`) with no default selected item: do the same in `onLoad` (`nav_shell`). `customers` must be selected. Only one group per level stays open until SVY-21635 (known gap).
4. Call `setSelectedMenuItem('customers', false, false)` from `onShow` with an `onMenuItemSelected` handler returning `true`. The issue never tested this case.

**Regression checks**
1. servoyMenu stale selection: select item A, call `clearMenuItems()`, re-add items including A. Check whether A is highlighted without being selected, then click A. In `selectItem` an item whose id is still in `_selectedIndex` counts as already selected, so the client skips the `showForm` call. Confirm whether its form is shown.
2. servoyMenu swap: replace `servoyMenu` with a JSMenu that has no selected item and check whether the old highlight remains.
3. `.mnu` with an item flagged `isSelected` plus an `onLoad` `setSelectedMenuItem` to a different item. Note which one wins (a single `isSelected` item still overrides the seeded selection).
4. Click an item whose `onMenuItemSelected` handler returns `false` (SVY-21653). It must not become selected.
5. Leave a servoyMenu sidenav open for a few minutes and watch the console for NG0100 (SVY-21654).
6. `autoSelectFirstChildNode` (SVY-21389): select a group and check the first child is auto-selected.
7. Plain menu with no `onLoad` selection: nothing selected on first show and no console errors.

**Automated:** from `components/`, `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"` and `npx ng lint`. Both new tests call `svyOnInit()` by hand, so they do not exercise the real first-show lifecycle.

## Possible improvements / follow-ups

- Clear the servoyMenu selection when the seeded id no longer exists in the rebuilt `_menu`, or only after first show, instead of never. This keeps the first-show fix and avoids a stale highlight. This is the main open item.
- Guard `parseIndex` (`sidenav.ts:247`) with try/catch and fall back to `{}` when the result is not a non-null object. This is low priority: the server only writes `JSON.stringify(<object>)`, and `svyOnChanges` already parses the same way unguarded.
- The commit message lists three tests including an "SVY-21654 no-NG0100 guard", but the diff adds two. The NG0100 test comes from `82aeb4e`. No test covers the stale-selection case.
- The reporter asked for docs, an API note or a model property. The triage returned NEEDS_INPUT and no answer is visible. The "four groups open" symptom stays unresolved until SVY-21635 (`aff2812`).
- Doc drift: `.opencode/sdd/project-context.md` still says Cypress / `.cy.ts` (the repo uses Vitest). `AGENTS.md` says version 2026.6.0 / npm, but git shows a 2026.9.2 bump and untracked pnpm files.
- Not verified: how the platform's JSMenu reports `isSelected` after a rebuild or whether a default ever sets it, and the fix in a running NG client with the attached `nav_shell`, `nav_nested` and `nav_states` forms.
