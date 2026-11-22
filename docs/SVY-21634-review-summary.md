# SVY-21634 - Peer Review Summary

**Risk: LOW to MODERATE.** The first review rated this MODERATE because the removed "clear selection to `{}`" branch in `copyServoyMenu` could leave a stale selection after a servoyMenu rebuild. Follow-up commit `a2d7abc` fixes that. What remains is that nothing was run in a real Servoy client.

Reviewed: `servoy-extra-components`, `b734d62` (first review) and `a2d7abc` (follow-up re-review), both on master. Fix Version 2026.12, release-target check MATCH. The sidenav spec passes on `master` (`ec1bdeb`): 110 tests. That is the combined state, not each commit alone.

## Follow-up re-review (`a2d7abc`)

- `copyServoyMenu` now keeps the seeded selection when no item is flagged `isSelected`, but only if every id in it still exists in the rebuilt menu (`isSelectionInMenu`). Otherwise it resets to `{}`. This closes the stale-highlight and skipped-`showForm` case from the first review.
- First-show behaviour is unchanged: an onLoad-seeded id that is in the menu survives.
- Three tests were added: cleared when the item is gone, kept when still present, and `showForm` requested for a re-added item.
- Interaction with `6f792f9` (SVY-21686, the `svyOnInit` seed is now conditional) and `2cd6c49` (SVY-21654, previous-selection snapshot): no conflict found. The `{}` reset runs before the snapshot comparison.

## Manual test plan

**Verifying the fix**
1. Plain menu: call `setSelectedMenuItem('customers')` in the form's `onLoad`. On first show `customers` must carry `svy-navitem-selected` (`nav_states`).
2. Plain nested menu: add `setMenuItemExpanded('sales', true)` in `onLoad`. The group must be open and the item selected (`nav_nested`).
3. servoyMenu (`.mnu`) with no default selected item: do the same in `onLoad` (`nav_shell`). `customers` must be selected. Only one group per level stays open without `allowMultipleExpanded` (SVY-21635).
4. Call `setSelectedMenuItem('customers', false, false)` from `onShow` with an `onMenuItemSelected` handler returning `true`. The issue never tested this case.

**Regression checks**
1. servoyMenu rebuild, separate calls: select item A, call `clearMenuItems()`, let the client sync, then re-add A in a later server call. The highlight must clear, and clicking A must show its form.
2. servoyMenu rebuild, same call: `clearMenuItems()` and the re-add of A in one server call. The client sees a single sync that still contains A. Check the highlight and whether the contained form stays correct.
3. Client/server divergence: after the reset in check 1, call `setSelectedMenuItem('A')` from a script. A must highlight again and its form must show. The client reset emits no `selectedIndexChange`, so the server model may still hold the old selection. Confirm the new value reaches the client.
4. servoyMenu swap: replace `servoyMenu` with a JSMenu that has no selected item. The old highlight must clear.
5. `.mnu` with an item flagged `isSelected` plus an `onLoad` `setSelectedMenuItem` to a different item. Note which one wins (a single `isSelected` item still overrides the seeded selection).
6. Click an item whose `onMenuItemSelected` handler returns `false` (SVY-21653). It must not become selected.
7. Leave a servoyMenu sidenav open for a few minutes and watch the console for NG0100 (SVY-21654, SVY-21686). Also check the first show for a single NG0100.
8. `autoSelectFirstChildNode` (SVY-21389): select a group and check the first child is auto-selected.
9. Plain menu with no `onLoad` selection: nothing selected on first show and no console errors.

**Automated:** from `components/`, `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"` and `npx ng lint`. The first-show tests call `svyOnInit()` by hand, so they do not exercise the real first-show lifecycle.

## Possible improvements / follow-ups

- Resolved by `a2d7abc`: clearing the servoyMenu selection when its id is gone from the rebuilt menu.
- Open: the reset is client-only and emits no `selectedIndexChange`. Confirm with regression check 3 that a later server-side `setSelectedMenuItem` of the same id still reaches the client.
- Guard `parseIndex` (`sidenav.ts`) with try/catch and fall back to `{}` when the result is not a non-null object. Low priority: the server only writes `JSON.stringify(<object>)`, and `svyOnChanges` already parses the same way unguarded.
- The commit message of `b734d62` lists three tests including an "SVY-21654 no-NG0100 guard", but the diff added two. The NG0100 test comes from `82aeb4e`.
- The reporter asked for docs, an API note or a model property. The triage returned NEEDS_INPUT and no answer is visible. The "four groups open" symptom depends on SVY-21635 (`aff2812`).
- Doc drift: `.opencode/sdd/project-context.md` still says Cypress / `.cy.ts` (the repo uses Vitest). `AGENTS.md` says version 2026.6.0 / npm, but git shows a 2026.9.2 bump and untracked pnpm files.
- Not verified: how the platform's JSMenu reports `isSelected` after a rebuild or whether a default ever sets it, and the fix in a running NG client with the attached `nav_shell`, `nav_nested` and `nav_states` forms.
