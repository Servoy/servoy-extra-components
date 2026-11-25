# SVY-21636 review summary — sidenav `isHeading`

**Risk at review: ELEVATED.** Nothing existing regressed (everything new is gated on `isHeading`), but in the Angular client the headings were likely unstyled and their children likely hidden by CSS. Both were found by reading the code, not by running a browser.

**Outcome:** the author fixed all four review points in `ec1bdeb` (2026-11-20). The issue was then resolved (Fixed) after a diff-only re-review. The suite, lint and a browser were not run during that re-review.

**Reviewed scope:** servoy-extra-components `09d1259` (original change) and `ec1bdeb` (follow-up fix); skill4servoy `a4853b7` (docs only). All on `master`.

**Release target:** confirmed by the author. Jira Fix Version `2026.12` is a core version. The change was released in extension tag v2026.9.1, which is the intended target. `ec1bdeb` is on master and was not checked against a release tag.

## What the follow-up fix changed (`ec1bdeb`)
- `isNodeExpanded()` returns `true` for a heading in both the Angular and legacy runtimes. The templates use it for both the `@if` and the collapsed class, so heading children are visible and no longer depend on `expandedIndex`. This also covers `allowMultipleExpanded` off.
- `.svy-sidenav-heading` was added to `components/projects/servoyextracomponents/assets/sidenav/svy-sidenav.css`, the file the NG client bundles.
- `autoSelectFirstChildNode` skips a heading in first-child position (`getFirstNonHeadingChild()`), in both runtimes.
- About 100 lines of Vitest were added, including a check that the collapsed class is present without `expandedIndex`.

## Manual test plan
**Verifying the fix**
1. From `components/`, run `npm run build` and deploy to `servoyExtraComponentExample`.
2. Build a menu with two headings (SALES, CATALOG), each with two leaf children. Set the flag through `jsMenuItem.putExtraProperty('Sidenav','isHeading',true)` or `extraProperties.Sidenav.isHeading` in the `.mnu`. Also test plain `MenuItem[]` through `setRootMenuItems` with `isHeading: true`.
3. In the NG client, check that:
   - the heading is an uppercase, muted label with no caret and a default cursor;
   - all children are visible on first load, without any click;
   - clicking a heading does nothing (no collapse, no `onMenuItemSelected`);
   - several sections are visible at once.
4. Repeat in the legacy AngularJS client.
5. Nest a heading at level 2 and level 3 and repeat step 3.

**Regression checks**
- A menu with no `isHeading` behaves as before: carets, expand/collapse, single-open accordion.
- `allowMultipleExpanded` on and off, with two headings: selecting a leaf under one must not hide the other heading's children.
- `autoSelectFirstChildNode` on, with a parent whose first child is a leaf, then a heading (the heading should be skipped).
- Select a leaf under a heading and check the heading `<li>` styling.
- `isDivider` items still render and style as before.
- A heading with `enabled: false`, and a heading with no children.
- `setSelectedMenuItem(<headingId>)` from a script, then check `selectedIndex`.
- Collapsed and slide-out sidenav modes (not assessed).

**Automated checks:** from `components/`, run `npm run build`, `npm run lint` and `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"`.

## Possible improvements / follow-ups
- **Performance (unmeasured):** `isNodeExpanded()` now calls `getNodeById` and walks the whole menu tree on every call, and the template calls it several times per item on each render. Large menus may render slower.
- **Items without an id (untraced, low risk):** `getNodeById` matches on `id === nodeId`. A heading with no id could make `isNodeExpanded(undefined)` match it, so other id-less items might report as expanded.
- **Medium:** `selectItem`, `expandItem` and `collapseItem` return `false` silently for headings, including the server selection sync and scripted calls. This is undocumented.
- **Medium (product call):** selecting a leaf marks its heading ancestor as selected (left border and colour at level 1).
- **Low:** heading and `isDivider` branches are not mutually exclusive. `tooltip`, `badgeText` and `iconStyleClass` are dropped silently on headings. The heading `<span>` has no role or aria label. Tests mostly cover level-1 headings.
- **Docs:** skill4servoy `servoyextra-sidenav.md` says "recent build" and could name v2026.9.1 or later. Its "always shown" and "muted label" claims depended on the two High items, which the follow-up addressed.
- **Docs:** `AGENTS.md` says "Current version: 2026.6.0", but master is 2026.9.2.
- **Security:** none found.
