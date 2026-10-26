# Triage Report — SVY-21653

**Verdict:** PROCEED

## Reported problem
In the servoyextra **sidenav**, an `onMenuItemSelected` handler that returns `false`
silently cancels the entire selection action: the clicked item is not marked selected,
a group is not expanded/collapsed, and the contained form is not switched. The symptom
is that a navigation looks styled but does nothing, with no error to explain it.

The reporter separates this from any fix: the request is that the behaviour be
**documented**, and *ideally* made more explicit (the ticket proposes doc wording plus two
optional enhancements — a second return convention and a dev-mode warning).

## Root-cause assessment
The behaviour is **real and intentional**, not a bug in the selection logic.

- Angular implementation, `components/projects/servoyextracomponents/src/sidenav/sidenav.ts:585-598`:
  when a handler is bound, `selectItem` calls
  `onMenuItemSelected(...).then((result) => { if (result !== false) confirmSelection(); })`.
  `confirmSelection` (defined at `sidenav.ts:554-583`) is the function that calls
  `setSelectedIndex` (`sidenav.ts:795`), marks the Servoy menu item, expands/collapses the
  group (`sidenav.ts:561-574`) and switches the contained form via the `showForm`
  server-side API (`sidenav.ts:576-582`). So a `false` result skips **all** of selection,
  expansion and form switching in a single branch — exactly the reported symptom.
- Legacy AngularJS implementation, `components/sidenav/sidenav.js:162-175`, has the same
  shape (`onMenuItemSelected(...).then(result => { if (result !== false) confirmSelection(); })`),
  and the file even documents the intent in a design comment at
  `components/sidenav/sidenav.js:52`: *"Selection can be cancelled if onMenuItemSelected
  returns false"*. The behaviour is therefore a deliberate cancel hook, not an accident.

The actual defect is **documentation**. The handler JSDoc in
`components/sidenav/sidenav_doc.js:137-145` only states:
`@return {Boolean} True if the selection is handled successfully.` — it never says that
returning `false` cancels selection, expansion and the contained-form switch, nor that any
other value (including `undefined`) lets the action proceed. The Servoy spec contract
(`components/sidenav/sidenav.spec:49-55`) declares `"returns": "boolean"` with no doc tag at
all. A developer (or AI agent) reading either source cannot infer the cancel semantics; the
natural reading of "True if handled successfully" invites returning `false` to mean
"I handled this myself", which instead disables the navigation.

This is **not a regression** and **not user-side**: the code has behaved this way since the
component's selection logic was written, and the symptom follows directly from the
documented-in-code design.

## Ticket premise check
The premise holds. The ticket correctly identifies that:
1. the behaviour exists and is driven by the `result !== false` check (verified in both
   `sidenav.ts` and `sidenav.js`), and
2. the documentation does not describe it.

The ticket does not demand a behaviour change as the primary ask — it asks for
documentation first and lists the explicitness improvements as optional. That framing is
sound. Changing the *behaviour* (e.g. making `false` mean something else) would be a
breaking change to an intentional, long-standing cancel hook and should not be done.

## Approaches considered
1. **Document the return-value semantics (recommended).** Update the JSDoc in
   `components/sidenav/sidenav_doc.js` and add a matching `doc` tag to the
   `onMenuItemSelected` handler in `components/sidenav/sidenav.spec` so the generated
   component docs state: returning `false` cancels selection, group expansion/collapse and
   the contained-form switch; any other value (including `undefined`/no return) lets the
   action proceed.
   - Pros: fixes the actual gap, zero runtime/behaviour risk, keeps the intentional hook,
     dual-layer (spec + doc) stays in sync, directly satisfies the primary ask.
   - Cons: does not make the API more self-evident at call time (a `false` return is still
     easy to write by accident).
2. **Documentation + optional dev-mode warning.** In addition to (1), log a developer-mode
   warning when a handler cancels selection of a non-disabled item (the ticket's suggestion
   #3), so the silent no-op becomes visible during development.
   - Pros: catches the mistake at runtime without changing production behaviour; low risk.
   - Cons: more surface to implement and test; needs a dev-mode guard so it doesn't log in
     production; still leaves the `false` convention in place.
3. **Change the return convention / add a separate "handled but still select" property**
   (ticket suggestion #2).
   - Pros: could remove the foot-gun entirely.
   - Cons: breaking/behaviour change to a public, long-standing handler contract; risks
     every existing solution relying on `false` to cancel; disproportionate to a doc gap.
     Not recommended.
4. **No code change.**
   - Pros: behaviour is intentional and already hinted at in `sidenav.js:52`.
   - Cons: fails the ticket's explicit, reasonable request; the public-facing JSDoc/spec is
     genuinely misleading ("True if handled successfully" strongly implies `false` = "I
     handled it"), which is what tripped the evaluated agent. The documentation gap is a
     real defect worth fixing. Rejected.

## Recommendation
**PROCEED with approach 1** — document the `onMenuItemSelected` return semantics in both
dual layers (`components/sidenav/sidenav_doc.js:137-145` JSDoc and the
`onMenuItemSelected` handler entry in `components/sidenav/sidenav.spec:49-55` via a `doc`
tag), stating explicitly that `false` cancels selection, group expansion/collapse and the
contained-form switch while any other value lets it proceed. Approach 2 (adding a
developer-mode warning) is a reasonable, low-risk enhancement to bundle if the team wants
runtime visibility; approach 3 (changing the convention) should be avoided as a breaking
change to an intentional hook.

## Git history findings
- The handler JSDoc wording was introduced in commit `29309af`
  ("SVY-19926 SpecMarkdownGenerator - incomplete/missing documentation for handlers",
  mvid, 2025-03-27), which added the `@return {Boolean} True if the selection is handled
  successfully.` line to `sidenav_doc.js:143`. The surrounding handler block dates to
  `b62cdd1` (2025-03-04); `fd167e1` (Johan Compagner, 2025-10-02) only refined the
  `@param menuItem` wording. So the misleading return doc is the current, intentional text —
  updating it refines prior documentation work rather than reverting a design decision.
- No dependency/version regression is involved; the cancel-on-`false` behaviour is original
  selection logic present in both `sidenav.ts` and the legacy `sidenav.js`, not a product of
  an Angular/library upgrade.
