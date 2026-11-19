# Review Summary: SVY-21650

Nested ServoyExtraSplitpane calculates wrong widths during initialization after 2026.9 upgrade.

**Scope:** `servoy-extra-components`, commit `fd87869` on `master` (`bg_splitter.component.ts`, new spec file, two workflow docs, `.gitignore`).

**Risk: MODERATE.** The new window-resize recalculation in `BGSplitter` re-applies the raw `divLocation` input. That input may not match a position the user dragged to. This could not be confirmed from the code alone.

Security: no relevance (client-side layout timing, no new sinks, no dependency changes).

## Release target: MISMATCH

Fix Version `2026.9.0`: tag `v2026.9.0` (2026-09-03) does not contain `fd87869` (committed 2026-10-26). The fix is first in `v2026.9.1` (2026-11-09). The Fix Version is probably wrong, or a backport is expected. Confirm with the author.

## Manual test plan

**Verifying the fix**
1. Build a solution with an outer splitpane (divider 0.75) holding a form with an inner splitpane (divider 0.65) and other components to its right.
2. Load it in a fresh session at zoom 1. The inner panes should split at 65% of the outer pane width, with no horizontal scrollbar on the right pane.
3. Repeat with the inner splitpane as the outer pane's second pane, and with vertical splitters (`splitType` 1).

**Regression checks**
1. A single non-nested horizontal splitpane with `divLocation` 0.5 loads at the centre with no visible jump.
2. A pixel `divLocation` (e.g. 300) is placed at exactly 300 px on load.
3. Drag the divider, then resize the window. The divider should stay where it was dragged (try `divLocation` unset, a fraction, and a pixel value).
4. With `resizeWeight` 1 and `divLocation` 0.3, resize the window and look for a double move.
5. Splitpane in an inactive tab or hidden container: resize the window, then show it. Panes should not be collapsed.
6. With nested splitpanes open, resize the window. The inner divider should track the outer pane's new width.
7. Open the form in the designer. The splitpane should render with the correct split.
8. Drag a divider. `onChange` and `divLocationChange` should fire once per drag, not on resize.

Automated (from `components/`): `npm run build`, `npm run lint`, `npm run test`.

## Possible improvements / follow-ups

- The window-resize recalculation is not needed for the reported init bug. It applies to every splitpane. Consider whether it should be dropped, or should read the handler's current position rather than the raw `divLocation` input.
- `ServoyExtraSplitpane` already has its own debounced `window:resize` handler (`resizeWeight`). The inner and outer timers both fire at 50 ms. Consider reusing one mechanism to avoid a double move.
- `recalculate()` has no visibility guard. A `display:none` splitpane measures zeros on resize and collapses its panes. The initial layout had the same flaw before this commit.
- A nested splitter whose outer `divLocation` arrives late (for example set in `onShow`) is still not re-measured. This is pre-existing.
- Open question: was the nested SERVOY-301 case checked in a real browser, or only with the mocked-geometry unit tests?
- Documentation drift in `AGENTS.md`: version says 2026.6.0 (MANIFEST is 2026.9.2); components are described as `standalone: false` (converted to standalone in `8e2e88c`); `.opencode/skills` and `.opencode/plugins` are listed as project structure, but `.opencode/` is now git-ignored.
