# Triage Report — SVY-21634

**Verdict:** NEEDS_INPUT

## Reported problem
`ServoyAI - Sidenav selected item and expanded groups set from onLoad are not reflected
when the form first shows`.

An AI agent rebuilds an HTML mockup as Servoy forms. In the mockup "Customers" is selected
on load and groups are expanded. In the running NG client (reported on 2026.9) the first
render is wrong:

- **nav_shell** — `onLoad` calls `setMenuItemExpanded('sales_group'|'catalog_group'|
  'people_group'|'reference_group', true)` then `setSelectedMenuItem('customers')`. After
  load there are **0** elements with a `svy-navitem-selected` class, and only the "Sales"
  group is open (the other three expand calls are not reflected).
- **nav_nested** — `onLoad` expands "Sales" and selects Customers. Sales is open, but **no**
  item has the selected class.
- **nav_states** — `onLoad` selects Customers. No selected class.

Clicking an item at runtime *does* apply `svy-navitem-selected`. So the API runs but the
initial state is not applied, or is applied before the component can render it.

The reporter asks primarily for **documentation** of how to set the initial selected item
and expanded groups so they work on first render, says to document it if `onLoad` is not
supported for this, and suggests *considering* a model property for the initial selection.
The reporter explicitly lists as **Not tested**: calling the same API from a later event
(e.g. after the form is shown), and setting state through the menu items instead of from
`onLoad`.

The ticket is linked in its sibling reports to **SVY-21654** (the repeating NG0100 on the
same `setSelectedMenuItem('customers')` flow) and **SVY-21653** (the `onMenuItemSelected`
returning `false` cancel hook). The attached `nav_shell` form is the *same* form family used
in SVY-21654: it uses a `.mnu` menu (so the **servoyMenu** path), its `onMenuItemSelected`
does `return false;`, and it sets `containedForm` in the handler.

## Root-cause assessment

### How first-show selection is supposed to reach the DOM
The template never reads the `selectedIndex`/`expandedIndex` inputs; it reads the internal
signals `_selectedIndex()` / `_expandedIndex()` (`components/projects/servoyextracomponents/
src/sidenav/sidenav.html:31,47,53,55,60,76,82,83,88,104,110,111,116`). Those signals are
seeded two ways:

1. **Plain-menu path** (`menu` input, no `servoyMenu`). The server's `onLoad`
   `setSelectedMenuItem`/`setMenuItemExpanded` update `$scope.model.selectedIndex` /
   `expandedIndex` (`components/sidenav/sidenav_server.js:939-975`, `819-846`) and push them
   down. The client copies them into the signals in `svyOnChanges`
   (`components/projects/servoyextracomponents/src/sidenav/sidenav.ts:220-235`): on a falsy
   value it resets to `{}`, otherwise `JSON.parse`s the string, then `markForCheck()`.
2. **servoyMenu path** (`.mnu`, as in `nav_shell`). `copyServoyMenu`
   (`sidenav.ts:1055-1097`) re-derives the selection from `source.isSelected`
   (`sidenav.ts:1114-1116`) and applies it via `updateSelectedNode → selectItem`.

So on first show the server-set selection *should* arrive as a `selectedIndex`/`servoyMenu`
change and be copied into the rendered signals.

### What the just-committed SVY-21654 fix changed (verified against current source)
Commit `82aeb4e` ("SVY-21654 fix repeating NG0100 …", lvostinar, 2026-10-27) rewrote
`copyServoyMenu` (`sidenav.ts:1055-1097`) and gated the emit in `setSelectedIndex`
(`sidenav.ts:828-830`) behind a new `applyingServerSelection` flag (`sidenav.ts:71,
1078-1083`). Crucially, after the fix `copyServoyMenu` now **sets the derived server
selection once** and the SVY-21654 regression test asserts it is actually reflected:
`sidenav.spec.ts:589-590` — `expect(component['_selectedIndex']()).toEqual({ 1: 'customers' })`
after a single `servoyMenu` sync, and stays stable across repeated syncs
(`sidenav.spec.ts:597`). The spec doc for that fix states explicitly (`docs/
SVY-21654-sidenav-ng0100-expressionchanged.spec.md:24,202,282,330`) that "SVY-21634
(code-set selection reflected on first show) is not regressed" and that the final rendered
value is "identical to today".

**This is the load-bearing ambiguity.** The SVY-21654 work *claims and tests* that the
server-derived selection is now reflected on the `servoyMenu` path — i.e. the very symptom
SVY-21634 reports for `nav_shell` (a `.mnu`/servoyMenu form). If 21654's fix now causes
`{1:'customers'}` to render on first show, then for the servoyMenu case **SVY-21634 may be
substantially or fully resolved by `82aeb4e`**. But the SVY-21654 test only exercises
`copyServoyMenu` by directly invoking `svyOnChanges({servoyMenu})` and a microtask — it does
**not** reproduce the real first-show lifecycle (the `ngAfterViewInit → svyOnChanges →
detectChanges` ordering, the `onLoad`-pushed `selectedIndex` arriving as its own change, and
the `return false` handler interaction). So the test passing does not prove the running-
client first-show symptom is gone.

### The three forms do not share one path
- `nav_shell` uses a `.mnu` (servoyMenu path) → touched by 21654's `copyServoyMenu` rewrite.
- `nav_nested` / `nav_states` — the ticket describes them as plain-menu forms (select/expand
  from `onLoad`). Those go through the **plain-menu `svyOnChanges` copy**
  (`sidenav.ts:220-235`), which `82aeb4e` did **not** touch. If the first-show failure there
  is the `change.currentValue` falsy-reset or the after-view-init timing, 21654 did nothing
  for it.

I could **not** reproduce the first-show symptom from source alone: whether the selection
renders depends on the running NG-client lifecycle (order of the `onLoad` model push vs
`ngAfterViewInit`, whether `selectedIndex` arrives as `firstChange`, and — on `nav_shell` —
the `return false` handler). Those live in the Servoy runtime, not this repo, and the
attachments are the AI agent traces, not an NG-client render/timing trace.

## Ticket premise check
The *symptom* premise is credible — three independent forms showed no selected class on
first render, and click-time selection works, which is a classic "state applied before the
view can show it / reset by an inbound change" shape. But two things make it unsafe to act
on now:

1. **The decisive overlap with SVY-21654 is untested against this ticket.** The 21654 fix
   landed on master on 2026-10-27 and explicitly targets the `servoyMenu` first-show
   selection for the *same* `nav_shell` form, claiming SVY-21634 is "not regressed" and the
   selection is reflected. Nobody has re-measured SVY-21634 in a client built from `82aeb4e`.
   It is entirely possible the `nav_shell` case is already fixed and only the plain-menu
   forms remain — or vice versa.
2. **The reporter's ask is documentation-first**, and they left the two most decisive
   variables untested (calling the API after first show, and using menu-item properties
   instead of `onLoad`). Those are exactly the facts needed to decide between "document a
   supported pattern", "fix a first-show timing/reset bug", and "already fixed by 21654".

### Divergence test
Candidate scenarios and the materially different root causes / fix sites they imply:

1. **`nav_shell` (servoyMenu + `return false` handler), re-measured on `82aeb4e`.** If the
   selection now renders → SVY-21634's `nav_shell` case is **resolved by the SVY-21654 fix**;
   remaining work is docs only. If it still does not render → a servoyMenu first-show
   timing/handler bug the 21654 fix did not cover.
2. **Plain-menu forms (`nav_nested`, `nav_states`).** Not touched by 21654. If they still
   fail → the fix site is the plain-menu `svyOnChanges` copy (`sidenav.ts:220-235`): the
   falsy-`change.currentValue` reset-to-`{}` (`sidenav.ts:221-222,229-230`) and/or the
   after-view-init copy timing. Different code, different fix than #1.
3. **"Not supported from `onLoad`, use a later event".** If calling the same API after first
   show works (reporter's untested case), the root cause is purely first-show sequencing and
   the primary deliverable is documentation (+ possibly moving/guarding the copy), not a deep
   behavioural change.
4. **New model property for initial selection** (reporter's "consider"). A feature, not a
   bug fix; only warranted if 1-3 show the lifecycle genuinely cannot carry an `onLoad`
   selection reliably.

At least #1 vs #2 vs #3 lead to materially different root causes and fix locations, and the
single fact that would collapse them — **does the symptom still reproduce in a client built
from the current master (post-`82aeb4e`), per form** — is exactly what is missing. The
reporter also left "call the API after first show" and "set via menu-item properties"
untested. The divergence test trips → **NEEDS_INPUT**.

## Approaches considered
1. **Re-measure on current master first, per form (recommended).** Rebuild/rerun the three
   attached forms against a client built from `82aeb4e` (the SVY-21654 fix) and report, per
   form, whether the selected class and expanded groups now appear on first show. Cheap and
   decisive; tells us whether this is already (partly) fixed, a plain-menu-only bug, or a
   docs issue.
   - Pros: avoids re-fixing what SVY-21654 already fixed; isolates servoyMenu vs plain-menu.
   - Cons: a round-trip before code.
2. **Fix first-show reflection on the plain-menu `svyOnChanges` copy.** If scenario #2 is
   confirmed, scope a fix to `sidenav.ts:220-235`: do not reset `_selectedIndex`/
   `_expandedIndex` to `{}` on a falsy inbound value when a non-empty selection is in flight,
   and ensure the first (buffered, after-view-init) copy renders. Mirrors the SVY-21654
   reasoning for the servoyMenu path.
   - Pros: fixes a real first-show reset at the source.
   - Cons: premature until #1 confirms the plain-menu forms still fail; risks re-introducing
     an NG0100 if done carelessly (the SVY-21654 investigation flagged this exact branch).
3. **Documentation-only (the reporter's primary ask).** Document in `sidenav_doc.js` /
   `sidenav.spec` how to set the initial selected item and expanded groups so they render on
   first show (which event, or via menu-item `isSelected`), and note any `onLoad` caveat.
   - Pros: directly satisfies the stated request; zero runtime risk; pairs well with #1.
   - Cons: insufficient on its own if #1 shows a genuine first-show bug remains.
4. **No code change / close as resolved by SVY-21654.** Possible if #1 shows all three forms
   now render correctly on master.
   - Pros: avoids duplicate work.
   - Cons: cannot be asserted without the re-measurement; the plain-menu path was not touched
     by 21654, so a blanket "resolved" is unlikely to be correct for all three forms.

## Recommendation
**NEEDS_INPUT.** Do not spec a fix yet. The SVY-21654 fix (`82aeb4e`, committed to master
2026-10-27) deliberately reworked the **servoyMenu** first-show selection for the *same*
`nav_shell` form and ships a regression test asserting the server selection
(`{1:'customers'}`) is reflected and stable — so SVY-21634's `nav_shell` case may already be
(fully or partly) resolved, while the **plain-menu** forms (`nav_nested`, `nav_states`) were
not touched by that fix and could still fail. The one measurement that disambiguates this —
re-running the three attached forms against current master, per form — has not been done, and
the reporter also left "call the API after first show" and "select via menu-item properties"
untested (approach 1). That single result routes the work to: close/trim as resolved by
SVY-21654 (approach 4), a plain-menu-path first-show fix (approach 2), or the documentation
the ticket primarily asks for (approach 3). Proceeding now would likely either re-fix the
servoyMenu path 21654 already addressed or miss the plain-menu path entirely.

## Git history findings
- **Relation to SVY-21654:** the sidenav NG0100 fix is `82aeb4e` (lvostinar, 2026-10-27),
  the most recent change on `components/projects/servoyextracomponents/src/sidenav`. It
  rewrote `copyServoyMenu` (`sidenav.ts:1055-1097`), added `applyingServerSelection`
  (`sidenav.ts:71`) and gated the `setSelectedIndex` emit (`sidenav.ts:828-830`). Its own
  spec doc (`docs/SVY-21654-sidenav-ng0100-expressionchanged.spec.md:24,202,282,330`) states
  SVY-21634 is "not regressed" and the server selection is reflected on first show
  (regression test `sidenav.spec.ts:589-590,597`). So for the **servoyMenu** path SVY-21634
  is plausibly addressed by this fix; for the **plain-menu** path it is **orthogonal** — the
  `svyOnChanges` copy at `sidenav.ts:220-235` was not changed by `82aeb4e`.
- The plain-menu copy branch (`sidenav.ts:220-235`), including the falsy-`change.currentValue`
  reset-to-`{}` and the trailing `markForCheck()`, is **original to the signals migration**
  (`0d16291`, cPecican, 2026-02-04, "SVY-20819 use signals instead of @input"), not a recent
  regression. This is the same branch the SVY-21654 investigation
  (`docs/SVY-21654-ng0100-investigation.md:87-92,179-185`) flagged as the primary latent
  source for both `selectedIndex` and `expandedIndex`.
- No Angular/@servoy/public dependency bump in the window changed the first-show copy path;
  this is not a library-upgrade regression as far as the component source shows.
- Sibling triage reports already exist and are consistent with the above:
  `docs/SVY-21654-triage.md` (NEEDS_INPUT on the same flow) and `docs/SVY-21653-triage.md`
  (the `return false` cancel hook used by `nav_shell`'s handler).

## Questions for the reporter (NEEDS_INPUT)
1. **Decisive:** Re-run the three attached forms against a client built from current master
   (which includes the SVY-21654 fix `82aeb4e`). Per form (`nav_shell`, `nav_nested`,
   `nav_states`): does the selected item now show `svy-navitem-selected` and are all the
   expanded groups open on first render?
2. Does the selection/expansion render correctly if the same `setSelectedMenuItem` /
   `setMenuItemExpanded` calls are made from a **later event** (e.g. a button after the form
   is shown) instead of `onLoad`? (Isolates first-show sequencing from a general API bug.)
3. For `nav_shell` specifically: does the result change if `onMenuItemSelected` returns
   `true`/nothing instead of `false` (SVY-21653 interaction), given `setSelectedMenuItem`
   is called with `mustExecuteOnMenuItemSelect = false`?
4. Should SVY-21634 be scoped to the **plain-menu** forms only (treating the `nav_shell`/
   servoyMenu case as covered by SVY-21654), or tracked as the single first-show reflection
   issue across both menu modes?
5. Is the desired outcome primarily **documentation** of the supported first-show pattern, or
   a **behavioural fix** so `onLoad` selection/expansion always renders (and, if so, is a new
   "initial selected item" model property wanted)?
