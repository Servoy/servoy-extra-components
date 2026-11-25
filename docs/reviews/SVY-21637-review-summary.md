# SVY-21637 review summary: sidenav `isDivider` placement docs

**Risk: LOW.** Only JSDoc comments changed. The worst finding is that the new `servoyMenu` doc sample calls `jsMenuItem.putExtraProperty(...)`, but the scripting `JSMenuItem` in servoy-client exposes `setExtraProperty` (`putExtraProperty` exists only on the persist `MenuItem`). Not confirmed in a running solution.

**Reviewed scope:** servoy-extra-components `d3f2232` on `master` (already in tag `v2026.9.1`). Sibling repo skill4servoy: `2ff321d`, `122f3d0` (agent context docs only, not deeply reviewed).

**Release target: INDETERMINATE.** The Jira Fix Version `2026.12` is a core version. This is an extension-package change and no issue comment names an extension version.

## Manual test plan

**Verifying the fix**
1. In Servoy Developer, hover the `servoyMenu` property of a sidenav and check that the tooltip and JSDoc show the new `isDivider` placement text.
2. In a solution script, run the doc's sample `jsMenuItem.putExtraProperty('Sidenav','isDivider',true)`. If the method does not exist, the doc should say `setExtraProperty`.
3. With a `.mnu` divider item: `isDivider` under `customProperties.extraProperties.Sidenav` renders a `.svy-sidenav-divider`. A top-level `isDivider` renders an empty row (the documented trap).

**Regression checks**
4. `setRootMenuItems([{id:'d', isDivider:true}])` must still render a divider (the plain MenuItem API keeps the top-level `isDivider`).
5. The Problems view shows no markers for `servoyextra-sidenav`.

## Possible improvements / follow-ups
- Fix the `putExtraProperty` vs `setExtraProperty` naming in `components/sidenav/sidenav_doc.js:14` if confirmed.
- A top-level `isDivider` on a `.mnu` item is still silently ignored at runtime. The reporter asked for the placement to be obvious (spec description, property sheet or warning), so a runtime or Developer-side warning could be its own case.
- Confirm that Fix Version `2026.12` is meant for this extension package.
