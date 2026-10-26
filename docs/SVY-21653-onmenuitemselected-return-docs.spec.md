# Spec: SVY-21653 — Document `onMenuItemSelected` return-value semantics (sidenav)

## 1. Goal

Document, in both dual layers of the servoyextra **sidenav** component, what the
`onMenuItemSelected` handler's return value does — specifically that returning `false`
cancels the whole selection action, while any other value (including `undefined`/no
return) lets it proceed.

This is a **documentation-only** change. No behaviour changes, no runtime logic, no tests.

## 2. Background

### The problem

A developer (or AI agent) binds an `onMenuItemSelected` handler and returns `false`,
reading it as "I handled this myself". In the running client, clicking a menu item then
does nothing: the item is not marked selected, a group is not expanded or collapsed, and
the contained form is not switched — with no error to explain it. The navigation looks
styled but is inert.

The current public documentation is misleading. The JSDoc in
`components/sidenav/sidenav_doc.js:143` says only:

```
@return {Boolean} True if the selection is handled successfully.
```

and the Servoy spec contract (`components/sidenav/sidenav.spec:49-55`) declares
`"returns" : "boolean"` with **no** `doc` tag. Neither source states that `false` aborts
selection, expansion/collapse and the contained-form switch, nor that any other value lets
the action proceed. "True if handled successfully" actively invites returning `false` to
mean "handled", which disables the navigation.

### The behaviour is real and intentional (not a bug)

Confirmed against the code (per the triage report, `docs/SVY-21653-triage.md`):

- Angular, `components/projects/servoyextracomponents/src/sidenav/sidenav.ts:585-598`: when
  a handler is bound, `selectItem` calls
  `onMenuItemSelected(...).then((result) => { if (result !== false) confirmSelection(); })`.
- `confirmSelection` (`sidenav.ts:554-583`) is the single branch that does **all** of:
  `setSelectedIndex` (marks the selected index), `servoyMenu.setSelectedItem(item.id)`
  (marks the Servoy menu item), expand/collapse of the group
  (`expandItem`/`collapseItem`, `sidenav.ts:561-574`), and the contained-form switch via
  the `showForm` server-side API (`sidenav.ts:576-582`).
- So a `false` result skips selection, group expand/collapse **and** form switching in one
  go — exactly the reported symptom. The `preventSelectHandler` path (no handler, or
  prevented) calls `confirmSelection()` directly.
- Legacy AngularJS `components/sidenav/sidenav.js:162-175` has the same
  `if (result !== false) confirmSelection()` shape, and the design comment at
  `components/sidenav/sidenav.js:52` already records the intent:
  *"Selection can be cancelled if onMenuItemSelected returns false"*.

The check is `result !== false`, so **only** a strict `false` cancels; `true`, `undefined`,
`null`, any object, or no return all let `confirmSelection()` run. This is the exact wording
to document.

### Git history

(From the triage report; not re-investigated.)

- The misleading `@return {Boolean} True if the selection is handled successfully.` line was
  introduced in commit `29309af` ("SVY-19926 SpecMarkdownGenerator - incomplete/missing
  documentation for handlers", 2025-03-27), which added the line to `sidenav_doc.js:143`.
- The surrounding handler block dates to `b62cdd1` (2025-03-04); `fd167e1` (2025-10-02) only
  refined the `@param menuItem` wording.
- So the misleading return doc is the current, intentional text — this change **refines
  prior documentation work**, it does not revert a design decision.
- The cancel-on-`false` behaviour is original selection logic present in both `sidenav.ts`
  and the legacy `sidenav.js`; it is not the product of an Angular/library upgrade. No
  dependency/version regression is involved.

## 3. Design

Document the same semantics in both layers. The doc tag in the `.spec` is the source of the
generated component documentation; the JSDoc in `sidenav_doc.js` is the source for the
developer-facing handler doc. Keep both consistent.

### Layer 1 — JSDoc: `components/sidenav/sidenav_doc.js`

Replace the single `@return` line (currently line 143) in the `onMenuItemSelected` handler
block. Keep the existing JSDoc style (leading ` * `, same indentation as the surrounding
block, `{Boolean}` type tag). Exact replacement text:

```js
    /**
     * Called when a menu item is selected.
     *
     * @param {Object} menuItem The unique identifier of the selected menu item.
     * @param {JSEvent} event The event object associated with the selection.
     *
     * @return {Boolean} Return false to cancel the selection: the clicked item is not marked selected, a group is not expanded or collapsed, and the contained form is not switched. Any other value (including undefined / no return) lets the selection proceed.
     */
    onMenuItemSelected: function() {},
```

Only the `@return` line changes; the `@param` lines and the rest of the block are left as
they are. (Note: line 142 currently has a trailing space after ` * ` — leave the block's
other lines untouched; only the `@return` line is edited.)

### Layer 2 — Spec doc tag: `components/sidenav/sidenav.spec`

Add a `doc` tag to the `onMenuItemSelected` handler entry. Match the existing tag shape used
elsewhere in this same `.spec` — model properties here carry documentation as
`"tags": { "doc" : "..." }` (see `sidenavWidth`, `responsiveHeight`,
`footerFormStickyBottom`, `autoSelectFirstChildNode` at lines 25, 26, 41, 42). Use the same
`"tags": { "doc" : "..." }` form on the handler object, alongside the existing `parameters`
and `returns`. Resulting entry (lines 49-55):

```json
	        "onMenuItemSelected" 		: {
										        "parameters" : [
										        	{ "name" : "menuItem", "type" : "object" },
										            { "name" : "event", "type" : "JSEvent" }
										        ],
										        "returns" : "boolean",
										        "tags": { "doc" : "Return false to cancel the selection: the clicked item is not marked selected, a group is not expanded or collapsed, and the contained form is not switched. Any other value (including undefined / no return) lets the selection proceed." }
										  },
```

The only change is the added `,` after `"returns" : "boolean"` and the new `"tags"` line.
Keep the file's existing tab indentation and brace layout. Verify the file is still valid
JSON after the edit.

## 4. Implementation plan

1. Edit `components/sidenav/sidenav_doc.js`: replace the `@return` line in the
   `onMenuItemSelected` JSDoc block (line 143) with the wording in §3, keeping `@param`
   lines and JSDoc style unchanged.
2. Edit `components/sidenav/sidenav.spec`: in the `onMenuItemSelected` handler entry
   (lines 49-55), add a comma after `"returns" : "boolean"` and add the
   `"tags": { "doc" : "..." }` line from §3, matching the existing doc-tag format in the
   same file.
3. Confirm `components/sidenav/sidenav.spec` is still valid JSON (e.g. parse it) and that the
   doc wording matches between the two layers.
4. No Angular `.ts`, `.html`, `.css`, legacy `.js` logic, or test files are changed.

## 5. Acceptance criteria

- [ ] `components/sidenav/sidenav_doc.js` `onMenuItemSelected` `@return` states that
      returning `false` cancels selection, group expand/collapse and the contained-form
      switch, and that any other value (including `undefined`/no return) lets it proceed.
- [ ] `components/sidenav/sidenav.spec` `onMenuItemSelected` has a `doc` tag describing the
      same semantics, in the same `"tags": { "doc" : "..." }` format used by other entries
      in that file.
- [ ] The two layers' wording is consistent.
- [ ] `sidenav.spec` remains valid JSON.
- [ ] No behaviour change: `sidenav.ts` and legacy `sidenav.js` selection logic is untouched;
      no test files are added or modified.

## 6. Out of scope

- Any behaviour change to the `result !== false` cancel hook (it is an intentional,
  long-standing, public contract).
- Approach 2: the dev-mode warning when a handler cancels selection of a non-disabled item.
- Approach 3: a second return convention or a separate "handled but still select" property —
  a breaking change to the handler contract.
- Angular `.ts` logic, template, or CSS changes.
- Test changes. This is documentation only; there is no new runtime behaviour to assert. The
  test-generation phase should confirm the doc/spec text is present (or be skipped), not add
  runtime assertions.

## 7. Open questions

| # | Question | Assumption |
|---|----------|------------|
| 1 | Should the generated docs also note the interaction with `preventSelectHandler` (no handler bound → selection always proceeds)? | No — the ticket's ask is specifically the `false` return semantics; keep the doc focused on the return value to avoid scope creep. |
| 2 | Should the wording mention the `enabled`/disabled-item nuance (the handler fires only for the clicked, non-disabled node)? | No — covered by the `enabled` property's own `blockingOn`/`for` and the `autoSelectFirstChildNode` doc; the return-value doc stays about the return value. |
