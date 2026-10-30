# Triage Report — SVY-21635

**Verdict:** PROCEED

## Reported problem
Expanding a group in `servoyextra-sidenav` collapses whichever group was previously open —
the component behaves as a single-open accordion. A navigation design that shows several
sections open at the same time cannot be built, and there is no property to change the
behaviour. The single-open default is also undocumented in the component properties.

Observed in the running NG client (2026.9): on a form with groups Sales (open) and Catalog,
People & Logistics, Reference (closed), clicking "Catalog" opens Catalog and closes Sales.
An agent's `onLoad` that called `setMenuItemExpanded(..., true)` for four groups ended with
only one group open.

**Proposed solution (to be challenged):** add a model property (e.g.
`allowMultipleExpanded`, default `false`) so several groups can stay open, and document the
single-open default.

## Root-cause assessment
The accordion behaviour is not an incidental side effect — it is baked into the component's
**data model**. The expanded state is stored as a flat `{ level → id }` map that holds at
most **one** expanded node per level.

Client — `components/projects/servoyextracomponents/src/sidenav/sidenav.ts`:
- `_expandedIndex = signal<any>({})` (line 59) — keyed by level, value is a single node id.
- `setExpandedIndex()` (lines 852–877) rebuilds `newExpandedIndex` from the clicked node's
  ancestors plus `newExpandedIndex[level] = item.id`, then **replaces** the whole map
  (`this._expandedIndex.set(newExpandedIndex)`). Any sibling previously at that level is
  dropped — that is the collapse-the-other-group behaviour.
- `isNodeExpanded(nodeId, level)` (lines 929–941) returns `levels[level] === nodeId`, i.e.
  only the one id stored for that level is considered expanded.
- The template (`sidenav.html`) renders a sublist only when `_expandedIndex()[level] === item.id`
  (e.g. line 53 for level 1, line 82 for level 2), so structurally only one branch per level
  can be open.

Server — `components/sidenav/sidenav_server.js` — mirrors the same shape:
- `setExpandedIndex()` (lines 819–846) builds `newExpandedIndex` the same way and assigns
  `$scope.model.expandedIndex = JSON.stringify(newExpandedIndex)`, overwriting siblings.

The ticket's own quote — the `sidenav.js` comment "call onMenuItemCollapse when another node
is expanded" (`components/sidenav/sidenav.js` line 24) — documents this as intended legacy
behaviour.

The symptom therefore maps to exactly one root cause: a single-slot-per-level expansion
model. There is no second divergent scenario to disambiguate, so this is a convergent
investigation (no NEEDS_INPUT).

This is **not a regression.** The single-open model predates the recent sidenav work; the
flat `{level → id}` map and the overwrite in `setExpandedIndex` are long-standing. The
`git log -S "newExpandedIndex"` first touch is `0d16291` "SVY-20819 use signals instead of
@input in our components" (a mechanical signals migration, not a behaviour change). The most
recent sidenav commit, `b734d62` (SVY-21634), explicitly called this out as a known
limitation and out of scope:

> "expandedIndex holds one group per level, so multiple sibling groups expanded at the same
> level from onLoad is a separate data-shape change."

SVY-21635 is that separate data-shape change.

## Ticket premise check
The premise holds. The reporter correctly identified that (a) the behaviour is single-open,
(b) it is by design in the component, and (c) there is no property to turn it off. The
proposed `allowMultipleExpanded` property is the right shape of fix.

One refinement the ticket under-states: a property flag alone is not enough. Allowing
multiple open groups requires changing the expanded-state representation from "one id per
level" to "a set of expanded ids" (at least when the flag is on). This touches:
- the `_expandedIndex` shape and `setExpandedIndex` / `clearExpandedIndex` /
  `isNodeExpanded` logic in `sidenav.ts`,
- the parallel functions in `sidenav_server.js`,
- the template predicates in `sidenav.html` that assume `[level] === id`,
- the `expandedIndex` private model property's serialized form (must stay backward
  compatible when the flag is off),
- the `.spec` model (new `allowMultipleExpanded` property) and `sidenav_doc.js`.

So the ticket's approach is correct but the work is larger than "add a boolean" — it is a
guarded data-model extension.

## Approaches considered
1. **Add `allowMultipleExpanded` (default `false`) + extend the expansion model to a set of
   ids when enabled** — pros: matches the request; default-off keeps the existing accordion
   behaviour and serialized `expandedIndex` format intact (no behaviour change for existing
   solutions); covers both the plain-`menu` and `servoyMenu` paths and the server API. Cons:
   touches client + server + template + spec + docs and both must stay in sync; the
   `{level → id}` → "set of ids" change needs care so `isNodeExpanded`, caret icons and
   ancestor-expansion still work per level; needs tests for both flag states.

2. **Only document the single-open default (no code change)** — pros: zero risk, closes the
   "undocumented" half of the ticket. Cons: does not deliver the requested capability; the
   stated navigation pattern (several sections open at once) remains impossible; the agent
   workaround (flattening / hiding entries) stays.

3. **No code change** — pros: none beyond avoiding work. Cons: leaves a real, reproducible
   gap; the behaviour is genuinely a missing feature, not user error or expected behaviour;
   explicitly deferred here from SVY-21634.

## Recommendation
**PROCEED** with **Approach 1**: add an `allowMultipleExpanded` boolean model property
(default `false`) and, when enabled, change the expanded-state tracking from a single id per
level to a set of expanded ids, so sibling groups can be open simultaneously. Keep the
default-off path byte-for-byte compatible with today's accordion behaviour and the existing
serialized `expandedIndex` format. Apply the change symmetrically in the Angular component
(`sidenav.ts` + `sidenav.html`) and the server script (`sidenav_server.js`), update the
`.spec` model and `sidenav_doc.js`, and add tests for both flag states. Also fulfil the
documentation half of the ticket (Approach 2) by documenting the single-open default on the
property.

Alternatives for the human: Approach 2 (docs-only) if the capability is judged not worth the
cross-layer change for a Minor ticket; Approach 3 (no action) is not recommended because the
gap is real and already deferred once.

## Git history findings
- `setExpandedIndex` / `newExpandedIndex` first appears via `0d16291` "SVY-20819 use signals
  instead of @input" (cPecican, 2026-02-04) — a signals migration, so the single-open model
  is older than this and was not changed by it. **Not a regression.**
- Most recent sidenav commit `b734d62` "SVY-21634 reflect onLoad-set sidenav
  selection/expansion on first show" (lvostinar, 2026-10-27) explicitly records the
  one-group-per-level limitation as a separate, out-of-scope data-shape change — i.e. this
  ticket. Prior related work: `82aeb4e` (SVY-21654 NG0100 guard), `b734d62` (SVY-21634 first
  show). Any fix must preserve those guards (`applyingServerSelection`, `markForCheck`).
- No dependency/Angular version bump is implicated; the behaviour is intrinsic to the
  component's own code.
