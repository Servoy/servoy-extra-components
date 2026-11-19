# SVY-21636 review summary — sidenav `isHeading`

**Risk: ELEVATED.** Nothing existing regresses (everything new is gated on `isHeading`), but in the Angular client the headings are likely unstyled and their children likely hidden by CSS. Both were found by reading the code, not by running a browser.

**Reviewed scope:** servoy-extra-components `09d1259`; skill4servoy `a4853b7` (docs only). Both on `master`.

**Release target:** INDETERMINATE. Jira Fix Version is `2026.12` (a core version). The fix is an extension-package change already in tag v2026.9.1 (master is now 2026.9.2), and Jira names no extension version.

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
- `allowMultipleExpanded` on and off, with ordinary parents next to headings.
- `autoSelectFirstChildNode` on, with a parent whose first child is a leaf, then a heading.
- Select a leaf under a heading and check the heading `<li>` styling.
- `isDivider` items still render and style as before.
- A heading with `enabled: false`, and a heading with no children.
- `setSelectedMenuItem(<headingId>)` from a script, then check `selectedIndex`.
- Collapsed and slide-out sidenav modes (not assessed).

**Automated checks:** from `components/`, run `npm run build`, `npm run lint` and `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/sidenav/sidenav.spec.ts"`. These cannot catch the two High risks below, because jsdom does not load the component CSS.

## Possible improvements / follow-ups
- **High, unverified in a browser:** the heading's child `<ul>` keeps `[class.svy-sidenav-collapsed]="isNodeExpanded(item.id, N)"` (`src/sidenav/sidenav.html:55, 83, 111`). `.svy-sidenav-menu` is `display:none` unless it has that class (`assets/sidenav/svy-sidenav.css:85-92`). Heading children are therefore probably hidden. The likely fix is `|| item.isHeading` in the class binding. The legacy template follows the same pattern.
- **High, unverified in a browser:** `.svy-sidenav-heading` exists only in `components/sidenav/svy-sidenav.css:160`. It is missing from `components/projects/servoyextracomponents/assets/sidenav/svy-sidenav.css`, which the NG client imports through `assets/servoyextra.css:3`.
- **Medium:** with `autoSelectFirstChildNode` on, `sidenav.ts:868-870` and `sidenav_server.js:1043-1045, 1099-1101` can select a heading that is first child.
- **Medium:** `selectItem`, `expandItem` and `collapseItem` return `false` silently for headings, including the server selection sync and scripted calls.
- **Medium (product call):** selecting a leaf marks its heading ancestor as selected (left border and colour at level 1).
- **Low:** heading and `isDivider` branches are not mutually exclusive. `tooltip`, `badgeText` and `iconStyleClass` are dropped silently on headings. The heading `<span>` has no role or aria label. Tests cover level-1 headings only.
- **Docs:** skill4servoy `servoyextra-sidenav.md` says children are "always shown" and headings are muted labels. Both depend on the two High items. It also says "recent build" and could name v2026.9.1 or later.
- **Docs:** `AGENTS.md` says "Current version: 2026.6.0", but master is 2026.9.2.
- **Security:** none found.
