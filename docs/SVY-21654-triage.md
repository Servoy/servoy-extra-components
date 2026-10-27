# Triage Report — SVY-21654

**Verdict:** NEEDS_INPUT

## Reported problem
A form with a servoyextra **sidenav** whose selected item is set from code — `onShow`
calls `elements.sidenav_1.setSelectedMenuItem('customers', false, false)` — makes the
Servoy Admin log (`/servoy-admin/log`) fill with a repeating Angular error roughly once
per second while the form is open:

> `NG0100 ExpressionChangedAfterItHasBeenChecked` — previous value `{"1":"customers"}`,
> current value `{}` for the sidenav's private `selectedIndex`.

The reporter's attached test form (`run-010.2_nav_shell.js`) also has an
`onMenuItemSelected` that unconditionally `return false;` (the SVY-21653 cancel hook), and
sets `containedForm` in `onShow`. The reporter explicitly flags the cause as **not yet
confirmed** and asks for investigation. They suggest (1) find why the client resets
`selectedIndex` to `{}` after the server pushed `{"1":"customers"}`, (2) make change
detection stable, (3) add a test asserting no NG0100.

The symptom is tied in the attachments to two sibling tickets: **SVY-21653** (handler
returning `false` cancels selection — suspected trigger) and **SVY-21634** (code-set
selection not reflected on first show — likely the same underlying state mismatch).

## Root-cause assessment
The report describes a **state disagreement on the two-way bound `selectedIndex`
property** between the server model and the component's internal signal, surfacing as a
repeating NG0100. The evidence I can confirm from the code:

- `selectedIndex` is a private, deep-pushed two-way property:
  `components/sidenav/sidenav.spec:18` —
  `"selectedIndex": {"type":"string","tags":{"scope":"private"},"pushToServer":"deep"}`.
  So the client's `selectedIndexChange` emissions and the server's pushes form a bidirectional
  channel.
- The Angular component keeps its own internal signal `_selectedIndex`
  (`components/projects/servoyextracomponents/src/sidenav/sidenav.ts:57`) and the template
  binds only that signal, never the `selectedIndex` input
  (`sidenav.html:31,60,88,116` all read `_selectedIndex()`; confirmed no template path reads
  the input). The input is copied into the signal in two places:
  - `svyOnInit` (`sidenav.ts:87`): `this._selectedIndex.set(this.selectedIndex() ?? {})`.
  - `svyOnChanges` `case 'selectedIndex'` (`sidenav.ts:224-231`): on an empty/falsy incoming
    value it sets `{}`; on a string it `JSON.parse`s it; **then calls
    `this.cdRef.markForCheck()` inside the change-handling loop**.
- The symptom's two values map cleanly onto these two states: `{"1":"customers"}` is what
  `setSelectedMenuItem('customers', …)` wrote on the server and pushed down; `{}` is the
  component's reset/empty state. A repeating flip between them means something keeps writing
  one value while the other side keeps asserting the opposite within/near the same change-
  detection pass — the classic NG0100 shape.

Why `{}` keeps being asserted on the client side is where the chain forks, and the ticket
does not give enough to pin it to one cause (see divergence test below). The most load-
bearing unknowns are:
- whether the NG0100 reproduces **with the SVY-21653 `return false` handler removed**
  (the reporter explicitly did *not* test the handler returning `true`), and
- the exact server push cadence for `selectedIndex` (the "about once per second" implies a
  periodic server→client push of `{"1":"customers"}` racing a client→server emit of `{}`).

I could not reproduce or confirm the loop from source alone: the error is logged by the
**running NG client / server bridge**, and the deciding factors (handler return value, the
deep-push echo timing, and whether `setContainedForm`/`showForm` re-entrancy re-triggers a
push) live in the Servoy runtime, not in this repository. The attached agent-trace zip
contains only the AI evaluation sessions, not an NG client CD trace, so it does not isolate
the writer of `{}`.

## Ticket premise check
The premise — "the sidenav keeps re-evaluating a changing value" — is directionally
plausible and matches an NG0100, but the **proposed framing is not yet safe to act on**:

- The reporter's own notes make the scenario ambiguous. The attached form combines three
  things that each independently could drive the symptom: a code-set selection pushed deep
  from the server, an `onMenuItemSelected` that always returns `false` (SVY-21653), and a
  `containedForm` set in `onShow`. The reporter has not isolated which one triggers the
  loop and has not tested the handler returning `true`.
- "Make change detection stable" could be read as adding another `markForCheck`/
  `detectChanges`, but the handler already calls `markForCheck()` inside the `svyOnChanges`
  loop (`sidenav.ts:222,230`) and `detectChanges()` in several branches. A naive fix here
  risks masking the loop rather than removing the source of the alternating value, or even
  making the NG0100 worse. The real fix depends on *which side* is wrong.

So the ticket is a genuine problem report, but its "find why the client resets to `{}`"
instruction presumes the client is the sole writer of `{}`, which the evidence does not yet
establish over the alternatives (server deep-push echo; the `false` handler leaving the
client at `{}` while the server holds `{"1":"customers"}`).

### Divergence test (why NEEDS_INPUT)
Candidate reproduction scenarios and the materially different root causes they point to:

1. **Handler returns `false` (as in the attached form).** Client `confirmSelection` never
   runs, so `_selectedIndex` stays `{}`, while the server pushed `{"1":"customers"}` →
   the two-way `selectedIndex` channel never converges. Root cause: *interaction of the
   SVY-21653 cancel hook with the deep-pushed server selection* — arguably a duplicate/child
   of SVY-21653, and the right fix might be in how selection-cancel interacts with a server-
   set index, not a CD tweak.
2. **Handler returns `true`/undefined (untested by reporter).** If the loop *disappears*,
   the root cause is #1 and this ticket largely folds into SVY-21653. If it *persists*, the
   root cause is instead the deep-push echo or first-show ordering.
3. **First-show ordering (SVY-21634 overlap).** `svyOnInit` sets `_selectedIndex` from the
   input, but `setSelectedMenuItem` runs in `onShow`; depending on ordering the server value
   may arrive as a `selectedIndex` change that the component resets, then re-pushes. Root
   cause: *init/first-show sequencing between `svyOnInit`, the deep-push, and
   `selectedIndexChange`* — a fix inside this component.
4. **`containedForm`-in-`onShow` re-entrancy.** Setting `containedForm` forces a
   form-will-show + `detectChanges()` cascade (`sidenav.ts:137-150,187-199`) that could
   re-run change detection while `selectedIndex` is mid-flight. Root cause: *CD re-entrancy*,
   again a different fix site.

At least two of these (notably #1 vs #3/#4) lead to materially different root causes and
fix locations, and the ticket lacks the detail to rule any out — in particular the untested
"handler returns `true`" case, which the reporter themselves listed under "Not tested". The
divergence test trips, so the verdict is **NEEDS_INPUT**: a single reproduction variable
(the handler return value) decides whether this is a duplicate of SVY-21653 or a distinct
first-show/deep-push defect, and that changes both the root cause and the correct fix.

## Approaches considered
1. **Get the missing reproduction detail first (recommended).** Ask the reporter to re-run
   with the `onMenuItemSelected` handler returning `true` (or unbound), and with
   `containedForm` *not* set in `onShow`, to isolate which input drives the NG0100. Cheap,
   decisive, and avoids a speculative fix.
   - Pros: turns a 4-way fork into one confirmed cause; prevents a CD-masking band-aid.
   - Cons: a round-trip to the reporter before any code change.
2. **Stabilise the server↔client `selectedIndex` convergence in the component.** Once the
   cause is confirmed to be first-show/deep-push (scenario #3), make `svyOnChanges`'
   `selectedIndex` handling not reset to `{}` when the server is asserting a non-empty value,
   and avoid emitting `selectedIndexChange` that echoes the server's own value back. Would be
   scoped to `sidenav.ts:224-231` plus the emit sites (`sidenav.ts:824,1069`).
   - Pros: fixes a real two-way-binding echo at the source.
   - Cons: premature until scenario is confirmed; risks regressing SVY-21634 / normal
     selection if the wrong side is "corrected".
3. **Treat as a duplicate/child of SVY-21653.** If scenario #1 is confirmed (the `false`
   handler is the sole trigger), the fix belongs with the cancel-hook semantics already being
   documented in SVY-21653, not here.
   - Pros: avoids double-fixing; keeps the cancel hook intentional.
   - Cons: only correct if the `true`-handler case is clean.
4. **No code change.**
   - Pros: valid if the NG0100 only appears with the always-`false` test harness, which is
     an artificial agent-evaluation form.
   - Cons: the reporter observed a real, repeating server-log flood; if it reproduces with a
     normal (`true`) handler it is a genuine defect. Cannot be ruled in or out without
     scenario #2 data. Not adoptable yet.

## Recommendation
**NEEDS_INPUT.** The problem is real (a repeating NG0100 over the two-way `selectedIndex`
property, flipping `{"1":"customers"}` ↔ `{}`), but the attached repro bundles three
independent potential triggers and the reporter left the single most decisive variable —
the `onMenuItemSelected` return value — untested. Confirm that first (approach 1). The
answer routes the work to one of: a component-side first-show/deep-push convergence fix
(approach 2), folding into SVY-21653 (approach 3), or no change (approach 4). Proceeding to
a spec now would almost certainly pick the wrong fix site or add a change-detection
band-aid that hides the loop instead of removing its source.

## Git history findings
- The `selectedIndex` deep two-way binding and the private internal signal predate this
  ticket. The `svyOnChanges` `selectedIndex` branch (`sidenav.ts:224-231`) with its trailing
  `markForCheck()` was shaped by the signals migration: `markForCheck()` was added in
  `475de68` ("SVY-20819 use signals instead of @input in our components") and only
  reformatted since (`0dc08ef`). So the reset-to-`{}` / markForCheck handling is original to
  the signals rewrite, not a recent regression.
- The most recent sidenav change, `09d1259` ("SVY-21636 add isHeading flag …", Gabi Boros,
  2026-10-21), touches rendering and selection guards but not the `selectedIndex` two-way
  handling, so it is unlikely to be the introducer of this loop.
- No Angular/@servoy/public dependency bump in the relevant window changed the
  `selectedIndex` binding; this is not a library-upgrade regression as far as the component
  source shows.
- Sibling triage reports exist: `docs/SVY-21653-triage.md` (the `return false` cancel hook,
  the suspected trigger here) — consistent with scenario #1 above.

## Questions for the reporter (NEEDS_INPUT)
1. **Decisive one:** Does the NG0100 still appear if `onMenuItemSelected` returns `true`
   (or the handler is unbound), with everything else unchanged? (This separates a
   SVY-21653-interaction cause from a first-show/deep-push cause.)
2. Does it still appear if `setSelectedMenuItem('customers', false, false)` is called in
   `onShow` but `containedForm` is **not** also set in `onShow`? (Isolates the
   `containedForm` re-entrancy path.)
3. Does it appear when the selection is set **after** first show (e.g. from a button) rather
   than in `onShow`? (Isolates first-show ordering vs steady-state.)
4. Is there an attachable NG-client console / change-detection trace (not the AI agent
   trace) showing which side writes `{}` — i.e. a `selectedIndexChange` emit of `{}` from the
   client, or a server push of `{}`?
5. Should this be treated as a child of SVY-21653 / SVY-21634 if those turn out to share the
   root cause, or tracked separately?
