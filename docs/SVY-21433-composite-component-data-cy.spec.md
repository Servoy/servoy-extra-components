# Spec: SVY-21433 — `data-cy` missing on textfieldgroup's inner input

## 1. Goal

Give `servoyextra-textfieldgroup`'s actual interactive `<input>` a stable,
human-readable `data-cy` selector (when `servoy.ngclient.testingMode` is enabled),
so Cypress tests — including Cypress Studio's auto-recording feature — can target it
directly instead of falling back to the auto-generated, unreadable MD5-hash-based
DOM `id`.

**Repository:** this fix lives entirely in `servoy-extra-components`
(`D:\GitSourcesComponents\servoy-extra-components\components`), a separate git
repository from `servoy-eclipse`. **No code change is needed in `servoy-eclipse`**
for this ticket — see §2.4 and §6 for why a base-class approach in `servoy-eclipse`
was considered and explicitly not taken.

## 2. Background

### 2.1 How `data-cy` reaches the client today

When `servoy.ngclient.testingMode` is enabled, the server injects
`data-cy = "<formName>.<elementName>"` into the `servoyAttributes` property payload
sent to the client for every element (`ServoyAttributesPropertyType.toJSON()` and
`ChildrenJSONGenerator.java`, in the `servoy-client` runtime). This is correct and
unrelated to this bug — it already produces exactly one `data-cy` value per
element/persist.

### 2.2 Where the client applies it, and the gap

`ServoyBaseComponent.addAttributes()` (`@servoy/public`, `servoy-eclipse`) applies
`servoyAttributes` — including `data-cy` — to `getNativeElement()`, i.e. the
template node marked `#element`, by design. For a simple component (a single
`<input>` marked `#element`) this is correct. `servoyextra-textfieldgroup` is a
**composite** component:

```html
<!-- textfieldgroup.html -->
<div class="input-group form-group" #element>
  <div class="input-group-prepend">...</div>
  <input class='form-control' [id]="servoyApi().getMarkupId()" ... #input />
</div>
```

`#element` (the Bootstrap wrapper `<div>`) receives `data-cy` from the base class.
`#input` — the actual `<input>` a test needs to `.type()`/`.clear()` on, and the
node `getFocusElement()` deliberately returns instead of the wrapper:

```ts
getFocusElement() {
    return this.input()!.nativeElement;
}
```

— never receives `data-cy`. It only ever gets `[id]="servoyApi().getMarkupId()"`,
a deterministic but unreadable MD5-hash-based id (`'s' + md5(formName + '.' +
elementName)`), which is exactly the `#s5df533e02496d72a0e79c8c4067cef17`-style
selector Cypress Studio falls back to when recording a click/type interaction.

### 2.3 Scope: this is confirmed for `textfieldgroup` only

The wrapper-`#element`-plus-inner-control shape recurs in other composite
components, but the *specific* mismatch — `getFocusElement()` returning a node
different from `#element` — was checked and confirmed **not** present in
`spinner.ts` (its `getFocusElement()` returns `getNativeElement()`, i.e. the
wrapper itself, so no divergence), nor in `imagelabel.ts`/`fileupload.ts` (same:
`getFocusElement()` just returns `getNativeElement()`). `textfieldgroup` is the
only component currently confirmed to have this specific bug. If another
component is found later with the same divergence, it needs its own equivalent fix
(see §6).

### 2.4 Why not a shared base-class hook

A base-class approach (a new overridable `getAttributesTargetElement()` hook in
`ServoyBaseComponent`, `servoy-eclipse`) was prototyped and confirmed to work
technically. It was explicitly not taken as the delivered fix because:

- It would still require a companion change in `textfieldgroup.ts` (in the other
  repo) to have any visible effect — i.e. it does not, by itself, close this ticket.
- It touches a shared, widely-used base class for a problem currently confirmed in
  exactly one component.
- The single-component fix is smaller, self-contained, ships independently in
  `servoy-extra-components`'s own release cadence, and carries no risk to any other
  component.

This may be revisited if a second component is found with the same
`getFocusElement()`/`#element` divergence (see §6, Out of scope).

### 2.5 Not a regression

A dedicated git-history investigation confirmed this is a longstanding
architectural gap, not a regression: `ServoyBaseComponent.addAttributes()` has only
ever targeted `#element`/`getNativeElement()` since its introduction (commit
`d65079746`, 2018-12-06), and `textfieldgroup`'s `#element`/`#input` split with its
own `getFocusElement()` has existed since the earliest visible commit of the file in
`servoy-extra-components` (`3253d8d`, 2021-05-31). No code path in either repo ever
connected `data-cy`/`servoyAttributes` to `getFocusElement()` before this fix.

## 3. Design

### 3.1 `applyAttributesToFocusElement()` in `textfieldgroup.ts`

Add a new protected method to `ServoyExtraTextfieldGroup`
(`projects/servoyextracomponents/src/textfieldgroup/textfieldgroup.ts`):

```ts
/**
 * servoyAttributes (including data-cy, when servoy.ngclient.testingMode is
 * enabled) is applied by the base class to #element (the wrapper div), which
 * is not the element a test needs to interact with. Copy the same attributes
 * onto the actual focusable <input> as well, so it also gets a stable, unique
 * data-cy selector instead of only the auto-generated markup id.
 * data-cy is suffixed with "-input" on the inner element so it stays a
 * distinct, unique selector from the wrapper's data-cy (which a test may
 * still use to target the group as a whole).
 */
protected applyAttributesToFocusElement() {
    const attributes = this.servoyAttributes();
    if (!attributes) return;
    for (const key of Object.keys(attributes)) {
        const value = key === 'data-cy' ? attributes[key] + '-input' : attributes[key];
        this.renderer.setAttribute(this.getFocusElement(), key, value);
    }
}
```

Called once from `svyOnInit()` (after the existing `attachHandlers()` call), and
again from `svyOnChanges()` whenever `servoyAttributes` itself changes after init
(removing the previous copy first, then reapplying):

```ts
svyOnInit() {
    super.svyOnInit();
    this.attachHandlers();
    this.applyAttributesToFocusElement();
}
```

```ts
// inside the existing svyOnChanges() switch on `property`:
case 'servoyAttributes':
    if (change.previousValue) {
        for (const key of Object.keys(change.previousValue)) {
            this.renderer.removeAttribute(this.getFocusElement(), key);
        }
    }
    this.applyAttributesToFocusElement();
    break;
```

### 3.2 Why suffix `data-cy` specifically

An initial version copied `servoyAttributes` verbatim, giving the wrapper and the
input the identical `data-cy="main.textboxgroup_1"`. Manually re-running the
reporter's Cypress test caught this immediately:
`cy.get('[data-cy="main.textboxgroup_1"]').click()` failed with
`CypressError: cy.click() can only be called on a single element. Your subject
contained 2 elements.` Two elements sharing one `data-cy` value breaks the
"unique selector" contract the whole feature exists for.

The fix: only the `data-cy` key gets a distinct value on the input (append
`-input`); every other attribute is copied unchanged. Result:

```html
<div class="input-group form-group" data-cy="main.textboxgroup_1">
  ...
  <input class="form-control" data-cy="main.textboxgroup_1-input"
         id="s5df533e02496d72a0e79c8c4067cef17" ...>
</div>
```

Both `data-cy` values are now unique. The wrapper's selector still targets the
group as a whole; the new `-input`-suffixed one targets the actual field.

### 3.3 Testing-mode gating — no new gate needed

`applyAttributesToFocusElement()` reads `this.servoyAttributes()` and returns early
if it's falsy — the exact same signal `addAttributes()` (base class) already uses.
The server only ever includes `data-cy` in that payload when
`servoy.ngclient.testingMode` is enabled (`Utils.isInTestingMode(...)`, server
side). So with testing mode off, `data-cy` is simply absent from
`servoyAttributes()` on both elements, exactly as before this fix — no new gating
logic was added or is needed.

### 3.4 Backward compatibility

- No change to `basecomponent.ts` (`@servoy/public`, `servoy-eclipse`) — reverted
  after being prototyped; zero risk to any other component.
- No change to `textfieldgroup.html` — the `#element`/`#input` template structure
  is unchanged.
- Any other `servoyAttributes` key the designer sets on this component (not just
  `data-cy`) is now also copied onto the input unchanged — this is new behavior for
  those keys but matches the intent of "the input should reflect the same custom
  attributes as before, just also on itself," and no existing test/behavior relied
  on the input *not* having them.

## 4. Implementation plan

1. In `D:\GitSourcesComponents\servoy-extra-components\components\projects\servoyextracomponents\src\textfieldgroup\textfieldgroup.ts`:
   - Add `applyAttributesToFocusElement()` as described in §3.1, with the `data-cy`
     suffix logic from §3.2.
   - Call it from `svyOnInit()` after `attachHandlers()`.
   - Add a `case 'servoyAttributes':` branch to the existing `svyOnChanges()`
     switch, removing the previous attributes from the focus element and
     reapplying via `applyAttributesToFocusElement()`.
2. Typecheck: `npx tsc --noEmit -p projects/servoyextracomponents/tsconfig.lib.json`
   (run from `D:\GitSourcesComponents\servoy-extra-components\components`).
3. Run the existing unit tests: `npx ng test @servoy/servoyextracomponents --include="**/textfieldgroup.spec.ts" --no-watch`.
4. Manual end-to-end verification: build/serve the `textboxGr` test solution with
   `servoy.ngclient.testingMode=true`, inspect the DOM to confirm both `data-cy`
   values are present and distinct, and re-run the reporter's
   `textboxGr.cy.js` Cypress test to confirm it passes.

Note: `node_modules` was not initially installed in `servoy-extra-components`
(separate repo, independent dependency tree from `servoy-eclipse`); running
`npm install --legacy-peer-deps` (and, separately, `npm install @popperjs/core
--legacy-peer-deps` to resolve a missing transitive peer dependency of
`@ng-bootstrap/ng-bootstrap` needed for the full `ng test` build) was required
before typecheck/test/build verification could run.

## 5. Acceptance criteria

- [x] `servoyextra-textfieldgroup`'s inner `<input>` receives a `data-cy` attribute
  (suffixed `-input`) whenever `servoy.ngclient.testingMode` is enabled, distinct
  from the wrapper's `data-cy`.
- [x] With testing mode disabled, no `data-cy` is applied to either element (no
  change from current behavior).
- [x] The wrapper's existing `data-cy="<formName>.<elementName>"` is unchanged.
- [x] `servoyAttributes` changes after init (`svyOnChanges`) keep the input's copy
  in sync (old removed, new applied with the same suffix rule).
- [x] No change to any other component or to `servoy-eclipse`.
- [x] Existing `textfieldgroup.spec.ts` unit tests (19) still pass.
- [x] Typecheck passes clean.
- [x] The reporter's `textboxGr.cy.js` Cypress test passes against a live build
  (manually verified; previously failed with a 2-element ambiguity error on an
  intermediate, unsuffixed version of this fix, and would fail with a
  missing-selector fallback before any fix).

## 6. Out of scope

- Any change to `servoy-eclipse` (`ServoyBaseComponent`, `basecomponent.ts`,
  `@servoy/public`). A base-class hook (`getAttributesTargetElement()`) was
  prototyped and works, but was explicitly not taken — see §2.4. Revisit only if a
  second component is confirmed to have the same `getFocusElement()`/`#element`
  divergence.
- `spinner.ts`, `combobox.ts`, or any other `servoy-extra-components`/`servoydefault`
  component. `spinner.ts` was checked and does **not** have this bug (its
  `getFocusElement()` returns the wrapper itself); it does have a separate, milder
  ergonomics gap (its own inner `<input>` has no `data-cy` at all), left unaddressed
  here as a distinct, lower-priority issue not reported in this ticket.
- Any change to server-side `data-cy` generation
  (`ServoyAttributesPropertyType`, `ChildrenJSONGenerator`) — already correct.
- Any change to `com.servoy.eclipse.cypress` (`CypressFormTestRunner`,
  `RunSingleTestHandler`, `RunCypressFormTestHandler`, `RunAllE2ETestsHandler`,
  `RunAllCypressFormTestsHandler`, `FormSpecGenerator`) — confirmed already correct;
  it force-enables testing mode for every automated run and its generator already
  only emits `data-cy`-based selectors.
- The hand-recorded `textboxGr.cy.js` / `cypress.config.js` reproduction test
  (Cypress Studio output, not generated by `servoy-eclipse` tooling) — used purely
  as evidence/verification, not a deliverable of this fix.
- `textfieldgroup.html` — no template changes; the fix is entirely in
  `textfieldgroup.ts`.

## 7. Open questions

| Question | Owner | Status |
|----------|-------|--------|
| Should `spinner.ts`'s inner `<input>` also get a `data-cy` (even though it doesn't have the `getFocusElement()`/`#element` divergence that makes this a "bug" there) for the same E2E ergonomics reason? | dev team | open |
| Is `-input` the desired, permanent suffix convention for any future component needing the same treatment, or should a shared naming convention be documented somewhere (e.g. component README or a Servoy docs page on testing mode)? | dev team | open |
| Commit convention/target branch for this change in `servoy-extra-components` — confirm before committing, since this pipeline's usual conventions (`AGENTS.md`) are written for `servoy-eclipse`. | implementer | open |
