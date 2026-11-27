# SVY-21687 review summary: keep component placeholders in the getFormLayout sample-data render

**Risk: MODERATE.** In the 2026.12 sample-data render, imagelabel now shows its `label.png` placeholder even when a real `media` is set. No touched component has been checked in a real getFormLayout render, only in unit tests that simulate the mode.

**Scope reviewed:**
- aggridcomponents `7db4164`
- bootstrapcomponents `92c3fa4`
- servoy-extra-components `f2abb80` and `f8da965` (line endings only)

All four commits are on `master`. This summary covers all three repos.

**What changed:** each repo gets a package-local helper, `isInDesignerOrSampleData(api)` in `src/sampledata.ts`. It returns true in the form editor, or when the core 2026.12 `ServoyApi.isInSampleDataMode()` exists and returns true. It looks the method up before calling it, so on a 2026.9 `@servoy/public` it behaves like `isInDesigner()`. The helper replaces `isInDesigner()` in these placeholder branches:
- extra: treeview, dbtreeview, youtubevideoembedder, imagelabel
- bootstrap: imagemedia, tablesspanel, accordion
- aggrid: `DataGrid.showEditorHint()`

The treeview placeholder also renders for real now. Before, it never set `isTreeReady`, so it never showed.

**Release target: INDETERMINATE.** The Fix Version 2026.12 is a core version, and no comment names a package release. Package versions on master:
- aggridcomponents `2026.9.3-pre`
- bootstrapcomponents `2026.9.2-pre`
- servoy-extra-components `2026.9.2-pre`

Confirm which package releases ship this alongside the 2026.12 core.

## Manual test plan

**Verifying the fix** (2026.12 core with the new package builds)
1. Create a form with these components:
   - treeview without a dataset
   - dbtreeview
   - youtubevideoembedder with `embeddedVideoURL` set
   - bootstrap imagemedia without a dataprovider
   - tablesspanel without a containedForm
   - an accordion without tabs
2. Call getFormLayout on it (sample data is on by default). Expect:
   - treeview shows 5 placeholder rows
   - dbtreeview shows node1..node3
   - youtube shows the placeholder icon and no `<iframe>`
   - imagemedia shows `media.png`
   - tablesspanel shows "Select contained form"
   - the accordion keeps its designed size
3. Check network or proxy logs while step 2 runs: there should be no request to youtube.com.
4. Repeat step 2 with the components inside a tabpanel and inside a list form component.

**Regression checks**
1. Add an imagelabel with `media` set to a real image and run getFormLayout. Note whether it shows the image or `label.png`.
2. Run getFormLayout with `sampleData=false` and note what the youtube embedder renders. It is expected to still emit the iframe; that behaviour existed before this change.
3. Open forms with a treeview in the form editor, on both 2026.12 and 2026.9, in absolute and responsive layout. The tree now renders, so check its size, selection, drag and resize. Then set a real dataset and confirm it replaces the placeholder.
4. In the runtime NG client, run a solution that uses treeview, dbtreeview, imagelabel with media, youtube, imagemedia, tablesspanel, accordion and a datagrid. For treeview, load a dataset and then clear it to empty. Everything should behave exactly as with the previous package build.
5. On a 2026.9 core, check that the form editor preview and the `/formtemplate` render are unchanged, and that choicegroup still shows Item1..3.

**Automated:** run `npm run test` in:
- `servoy-extra-components/components`
- `bootstrapcomponents/components`
- `aggridcomponents/aggrid`

These suites were not run during the review.

## Possible improvements / follow-ups
- **imagelabel:** consider matching bootstrap imagemedia, which shows a configured `media` when set and uses `label.png` only when it is missing (`imagelabel.ts:32,67`).
- **aggrid `showEditorHint()` has no Angular caller.** Only the legacy AngularJS `datasettable.html` and `groupingtable.html` call it, so the "drop columns here" hint does not appear in the NG client and `7db4164` has no visible effect. Either wire the hint into `datagrid.html` or treat the commit as a consistency-only change.
- **dbtreeview:** `initTree()` returns the placeholder nodes in sample mode whatever `foundsettree` holds. If the core ever supplies `foundsettree` sample data, the placeholder would hide it.
- **youtube with `sampleData=false`:** both flags are false in that mode, so the real iframe and its youtube.com request still happen. This existed before the change. Fixing it needs a core-side "design-time render" signal.
- **API direction:** Johan's 09/Nov comment (keep sample mode hidden from components) has no recorded reply after the 18/Nov implementer comment.
- **Cleanup:** the three identical copies of `sampledata.ts` can be replaced by a direct `isInSampleDataMode()` call once 2026.12 is the minimum `@servoy/public`.
- **Not verified:**
  - no real getFormLayout render
  - no visual check of the treeview in the editor
  - no network check of the youtube request
  - reference search was textual only
