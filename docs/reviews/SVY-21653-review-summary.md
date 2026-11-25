# SVY-21653 review summary: sidenav `onMenuItemSelected` return semantics

**Risk: LOW.** Only documentation changed. The worst finding is one clause, "a group is not expanded or collapsed". It holds when the item label is clicked, but the expand caret never runs the handler, so it still opens the group.

**Reviewed scope:** servoy-extra-components `65feb4f` and `f12b7d7` on `master`. Use `git show 65feb4f f12b7d7`, because the range `65feb4f~1..f12b7d7` also holds commits for SVY-21654, SVY-21634 and SVY-21666.

**Release target: INDETERMINATE.** The Jira Fix Version is `2026.12`, which is a core version. The fix is an extension-package change that is already in tag `v2026.9.1` (master is now 2026.9.2-pre). No issue comment names an extension version.

## Manual test plan

**Verifying the fix**
1. In Servoy Developer, open a form with a sidenav. In the Properties view, hover over `onMenuItemSelected` and check that the tooltip shows "Return false to cancel the selection…".
2. Check code completion and the JSDoc of an attached handler for the same `@return` text.
3. Check that the Problems view has no spec-schema markers for `servoyextra-sidenav`. The intermediate commit `65feb4f` caused such markers.

**Regression checks**
4. In the NG (Titanium) client, use a sidenav with a group that has children.
   - If the handler returns `false`, clicking the group label does not select it, does not expand it and does not switch the form.
   - If the handler returns `true` or nothing, the behaviour is normal.
5. With the handler returning `false`, click the group's expand caret. With the current code the group opens.
6. Repeat step 4 in the legacy (AngularJS) NG client, if that runtime is still supported.
7. On the server, call `setSelectedMenuItem(id, true)` while the handler returns `false`. The selection must not change, and the call must return `false`.
8. Create a new `onMenuItemSelected` method from the Properties view. Today the generated body is `return false;`.

## Possible improvements / follow-ups
- Make the doc say that the cancel only applies to clicks on the item itself, not to the expand caret.
- Mention that a handler that throws, or whose promise rejects, also cancels the selection.
- `docs/SVY-21653-onmenuitemselected-return-docs.spec.md` still prescribes the invalid handler-level `tags.doc` form. Update it to the `doc` field.
- Pre-existing issue: `NewMethodAction` generates `return false;` for this handler (`"returns": "boolean"` has no default). A `"returns": {"type": "boolean", "default": true}` or a `"code"` entry in `sidenav.spec` would avoid the same trap.
- The issue's optional suggestions were not implemented: a developer-mode warning when an enabled item's selection is cancelled, and a "handled but still select" convention. A follow-up case could cover the warning.
