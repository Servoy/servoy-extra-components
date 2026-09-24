# Triage Report — SVY-21433

**Verdict:** PROCEED (fix belongs entirely in the `servoy-extra-components` repo, not `servoy-eclipse`)

## Reported problem

Jira summary: "TextBoxGroup component lacks stable IDs / data attributes for E2E
testing" (component: NGClient, priority: Minor, no description/comments — the ticket
body itself is empty; only a screenshot attachment and the user context supplied for
this investigation carry the actual detail).

Confirmed from the user-supplied Cypress Studio screenshot and by reproducing the
recorded scenario locally: in `textboxGr.cy.js` (test solution
`E:\ServoyInstalls\...\workspace\textboxGr`, form `main`, containing one
`servoyextra-textfieldgroup` element named `textboxgroup_1`), the recorded Cypress
step that types into/clears the group's text input generated the selector
`cy.get('#s5df533e02496d72a0e79c8c4067cef17')` — a raw, deterministic-but-unreadable
MD5-hash-based DOM id — instead of a `[data-cy="..."]` selector. Other interactions in
the same recording target the wrapper via `[data-cy="main.textboxgroup_1"]`
successfully. The `servoy.ngclient.testingMode` admin setting was confirmed enabled by
the user via screenshot, and `main.textboxgroup_1` resolving via `data-cy` at all
proves testing mode is active and working for this form/component.

So the symptom is precise and narrower than the ticket's title suggests: it is not
that the component "lacks" `data-cy` — the component's outer element **does** get
`data-cy="main.textboxgroup_1"` — it is that the **inner `<input>` element** (the
actual focusable/typeable target) inside the `textfieldgroup` composite component
does not carry any `data-cy`, forcing Cypress (via its Studio/selector-recording
feature) to fall back to the raw generated `id`.

The ticket's title implicitly proposes the fix ("component lacks stable IDs / data
attributes") without specifying where or how; no explicit approach is stated beyond
"add stable selectors to the component."

## Root-cause assessment

The underlying mismatch (a wrapper `#element` that receives `servoyAttributes`, and a
distinct interactive inner element returned by `getFocusElement()` that does not) is
a generic limitation in how `ServoyBaseComponent.addAttributes()` (`@servoy/public`,
`servoy-eclipse`) applies attributes — it always targets `getNativeElement()`
(`#element`), never `getFocusElement()`. This is true for every NG2 component with
that wrapper/inner-control shape, not something specific to `textfieldgroup`.

However, **after investigation and human decision, the approved fix does not touch
this shared base-class behavior.** It is deliberately scoped to a single component,
`servoyextra-textfieldgroup`, patched directly in its own file
(`textfieldgroup.ts`, `servoy-extra-components` repo) by having the component itself
copy `servoyAttributes` onto its focus element in `svyOnInit()`/`svyOnChanges()`,
suffixing the `data-cy` value so it stays a distinct, unique selector from the
wrapper's. See "Approaches considered" and "Recommendation" below for why the
base-class approach (originally recommended by this triage) was superseded.

Chain of evidence:

1. **Server side (`servoy-eclipse`'s companion runtime, `servoy-client`) is correct
   and unrelated to the bug.** `ServoyAttributesPropertyType.toJSON()`
   (`servoy_ngclient/src/com/servoy/j2db/server/ngclient/property/types/ServoyAttributesPropertyType.java:64-80`)
   and `ChildrenJSONGenerator` (`ChildrenJSONGenerator.java:459-491`) both correctly
   inject `data-cy = "<formName>.<elementName>"` into the `servoyAttributes`/
   `attributes` property payload sent to the client whenever
   `Utils.isInTestingMode(...)` is true — i.e. only when `servoy.ngclient.testingMode`
   is enabled. This is single-sourced, well-guarded, and is exactly what produced the
   working `data-cy="main.textboxgroup_1"` selector seen on the wrapper in the
   screenshot. No bug here, and no change needed here.

2. **Client side, the attribute is applied to the wrong DOM node for composite
   components.** In `com.servoy.eclipse.ngclient.ui/node/projects/servoy-public/src/lib/basecomponent.ts`,
   `ServoyBaseComponent.addAttributes()` does:
   ```ts
   protected addAttributes() {
       if (!this.servoyAttributes()) return;
       for (const key of Object.keys(this.servoyAttributes())) {
           this.renderer.setAttribute(this.getNativeElement(), key, this.servoyAttributes()[key]);
       }
   }
   ```
   `getNativeElement()` always resolves to the template node marked `#element` — the
   component's single outermost element, by design ("this should return the main
   native element (like the first div) which is marked as #element in the main
   div", per the class's own doc comment). `data-cy` is therefore *only ever* placed
   on that one outer element, and this has been true since the method's introduction
   in commit `d65079746` ("SVY-13034 ... extracted base class for all components",
   2018-12-06) — confirmed by a dedicated follow-up regression investigation (see
   "Git history findings") that this is original, longstanding behavior, never a
   regression.

3. **`textfieldgroup` (the actual spec/component behind the on-screen "textboxgroup"
   label) is a composite/wrapper component whose real interactive target is a
   *different*, inner element.** Source:
   `D:\GitSourcesComponents\servoy-extra-components\components\projects\servoyextracomponents\src\textfieldgroup\textfieldgroup.html`:
   ```html
   <div class="input-group form-group" #element>
     <div class="input-group-prepend">...</div>
     <input class='form-control' [id]="servoyApi().getMarkupId()" ... #input />
   </div>
   ```
   `#element` is the outer Bootstrap `input-group` wrapper — this is what gets
   `data-cy`. `#input` is the actual `<input>` a test needs to `.type()`/`.clear()`
   on, and it only ever gets `[id]="servoyApi().getMarkupId()"` — a hash-based id
   (`ComponentFactory.getMarkupId`,
   `servoy_ngclient/src/com/servoy/j2db/server/ngclient/ComponentFactory.java:207-210`:
   `'s' + calculateMD5HashBase16(formName + '.' + elementName)`), which is exactly the
   `#s5df533e02496d72a0e79c8c4067cef17`-shaped selector seen in the screenshot. This
   id is deterministic/unique (same form+element name always hashes the same), just
   not human-readable — so the component was never missing a *unique* identifier on
   the input, only a *readable, `data-cy`-based* one.

4. **This shape (wrapper `#element` + distinct inner control via `getFocusElement()`)
   recurs across other composite components** (`spinner`, `combobox`, etc.), but not
   all of them are actually affected the same way — see "Scope narrowing" below,
   added after deeper investigation of `spinner.ts`.

5. **`textfieldgroup` vs `textboxgroup` naming is resolved.** The component's spec
   name is `servoyextra-textfieldgroup` (confirmed in the generated `main.frm`:
   `"typeName":"servoyextra-textfieldgroup"`); "TextBoxGroup"/`textboxgroup_1` is just
   the element instance name the test-solution author chose in the form editor, and
   the palette icon file is literally named `textbox_group.png`. There is no separate
   `textboxgroup` component — the ticket title and the `textfieldgroup` source are
   the same component.

6. **Repository boundary.** `servoyextra-textfieldgroup`'s source lives in
   `D:\GitSourcesComponents\servoy-extra-components\components` — a **separate git
   repository** from `servoy-eclipse`. The approved fix is entirely contained there;
   `servoy-eclipse` requires **no code change** for this ticket.

7. **"servoyTestingServer" / e2e tooling awareness of testing mode — already handled
   correctly, no gap in `servoy-eclipse`.** `com.servoy.eclipse.cypress` (a
   `servoy-eclipse` plugin, née "extract Cypress testing into standalone plugin",
   `f51f46bf4`) *unconditionally* forces `servoy.ngclient.testingMode=true` for every
   one of its automated flows before running: `CypressFormTestRunner.enableTestingMode()`
   (headless CI runner), and the same one-line `Settings.getInstance().setProperty(...)`
   call is duplicated in `RunSingleTestHandler`, `RunCypressFormTestHandler`,
   `RunAllE2ETestsHandler`, and twice in `RunAllCypressFormTestsHandler`. So the
   tooling never silently produces brittle raw-id tests due to a missing admin
   setting when it drives the test itself. The underlying user-authored
   `textboxGr.cy.js` test (hand-recorded via Cypress Studio, not generated through
   `FormSpecGenerator`) is not itself part of this repo's generator output —
   `FormSpecGenerator` already always emits `[data-cy=...]` selectors
   (`FormSpecGenerator.java:248,260,271`) and never generates a fallback to raw ids.

## Scope narrowing: not every composite component has this bug

A follow-up check of `spinner.ts`/`spinner.html` (`servoy-extra-components`) — which
has the same wrapper-`#element`-plus-inner-`<input>` template shape as
`textfieldgroup` — found that `spinner.ts`'s `getFocusElement()` override returns
`this.getNativeElement()` (the wrapper), **not** the inner `<input>`:
```ts
getFocusElement(): HTMLElement {
    return this.getNativeElement();
}
```
So `spinner` has no `getFocusElement()`/`data-cy` divergence: whatever it considers
"the focus element" is the same node that already receives `data-cy`. `spinner`'s
inner `<input>` still has no `data-cy` of its own if a test needs to target it
specifically, but that is a softer, separate ergonomics gap, not the same
mismatch bug reported here, and was left out of scope for this ticket.

The bug reported here specifically requires **both**: (a) a wrapper `#element`
distinct from (b) an inner node that `getFocusElement()` deliberately returns instead.
`textfieldgroup` is confirmed to have both; `spinner` (as currently written) does not.
`imagelabel.ts` and `fileupload.ts` were also checked and both simply return
`getNativeElement()` from `getFocusElement()` — no divergence, unaffected.

## Ticket premise check

The ticket's title asserts the component "lacks stable IDs / data attributes"
altogether, which is not accurate — the wrapper element does get a stable, correct
`data-cy`, and the inner `<input>` already has a stable (if unreadable) id via
`getMarkupId()`. The real gap is one level more specific: the *inner interactive
element* of this one composite component doesn't get its own `data-cy`, which is
what Cypress Studio's auto-recording needs to produce a human-readable selector. The
ticket proposes no concrete implementation approach, so there's nothing to validate
there beyond confirming the general direction ("give it a stable, readable selector")
is right.

## Approaches considered

1. **Fix in `textfieldgroup.ts` only (targeted, single-component patch,
   `servoy-extra-components` repo) — SELECTED.** The component's `svyOnInit()`/
   `svyOnChanges()` copy `servoyAttributes()` onto `getFocusElement()` (the `<input>`)
   directly, suffixing the copied `data-cy` value (e.g. `-input`) so it remains a
   distinct, unique selector from the wrapper's `data-cy`. Pros: small, self-contained,
   no changes to shared infrastructure, ships independently in the components repo's
   own release cadence, no risk to any other component. Cons: doesn't fix the same
   latent mismatch in other composite components that do have it (none currently
   confirmed besides `textfieldgroup`); if another component is later found with the
   same `getFocusElement()`/`#element` divergence, it needs its own equivalent patch.

2. **Fix at the base-class level (`ServoyBaseComponent.addAttributes()` in
   `@servoy/public`, `servoy-eclipse`) — CONSIDERED, THEN REJECTED as the delivered
   approach.** Originally recommended by this triage: let subclasses declare an
   optional "attributes target" element (defaulting to `#element`), and have
   `addAttributes()`/`svyOnChanges()` apply `servoyAttributes` to that node instead
   when overridden. A working implementation was prototyped
   (`getAttributesTargetElement()`) and then explicitly reverted at the human's
   direction in favor of approach 1. Pros (for the record): fixes the general defect
   once, in one shared place; every composite component benefits without a
   component-repo release. Cons: touches a core, widely-used base class for a
   currently single-component-confirmed problem; still would have needed a
   companion `textfieldgroup.ts` change in the other repo to have any visible
   effect, making it a two-repo-coordinated change for a one-repo problem.

3. **Add `data-cy` to `#input` inside `textfieldgroup` with the exact same value as
   the wrapper (two identical `data-cy` values) — TRIED, THEN CORRECTED.** An initial
   version of approach 1 copied `servoyAttributes` verbatim, giving both the wrapper
   and the input the identical `data-cy="main.textboxgroup_1"`. This was caught by
   manually re-running the reporter's Cypress test: `cy.get('[data-cy="main.textboxgroup_1"]').click()`
   failed with `CypressError: cy.click() can only be called on a single element. Your
   subject contained 2 elements.` — confirming duplicate `data-cy` values break the
   "unique selector" contract the feature exists for. Fixed by suffixing the input's
   copy (`-input`), which was verified to resolve the ambiguity and pass the test.

4. **No code change — document/train users to hand-pick the `getMarkupId()`-based
   raw id in Cypress tests for composite components, or use
   `cy.get('[data-cy="..."]').find('input')`** — Pros: zero engineering cost, the id
   is already deterministic. Cons: doesn't fix the actual E2E ergonomics problem the
   ticket is about (Cypress Studio can't auto-record a friendly selector for the
   inner input); pushes complexity onto every test author; defeats the point of the
   `data-cy`/testing-mode feature for this component.

## Recommendation

**PROCEED, entirely within `servoy-extra-components`.** `servoy-eclipse` requires
**no code change** for this ticket.

- Fix `servoyextra-textfieldgroup` (`textfieldgroup.ts`, `servoy-extra-components`
  repo) directly: in `svyOnInit()`, after the existing `attachHandlers()` call, copy
  `servoyAttributes()` onto `getFocusElement()` (the `<input>`), and mirror the same
  add/remove logic in `svyOnChanges()`'s `servoyAttributes` case for changes after
  init. Suffix the `data-cy` value specifically (e.g. append `-input`) so the input's
  selector stays distinct and unique from the wrapper's `data-cy`, avoiding the
  duplicate-selector failure found during manual verification (see approach 3 above).
- This is a self-contained change to one file in one component, verified end-to-end:
  typecheck clean, all 19 pre-existing unit tests for `textfieldgroup` still pass,
  and the reporter's own Cypress test (`textboxGr.cy.js`) was re-run against a live
  build and now passes (previously failed with the 2-element ambiguity error before
  the suffix fix, and would have failed with a missing-selector error before any fix
  at all).
- Approach 2 (base-class hook in `servoy-eclipse`) was prototyped and found to work
  technically, but was explicitly superseded by human direction in favor of the
  narrower, single-repo fix, since only one component (`textfieldgroup`) is currently
  confirmed to need it — `spinner` was checked and does not have the same
  `getFocusElement()`/`#element` divergence (see "Scope narrowing"). If a second
  affected component is found later, approach 2 remains a reasonable escalation, but
  is not needed now.
- Approach 4 (no code change) is rejected: it doesn't solve the ticket's actual
  ergonomics complaint and defeats the purpose of `data-cy`/testing mode for this
  component.

No gap was found in `servoy-eclipse`'s Cypress/e2e tooling (`com.servoy.eclipse.cypress`)
itself — it already force-enables testing mode for every run and its generator
(`FormSpecGenerator`) already emits only `data-cy`-based selectors, so there is
nothing to add there for this issue.

## Git history findings

- A dedicated regression investigation (separate follow-up task, full findings
  preserved here) confirmed **this is not a regression**:
  `ServoyBaseComponent.addAttributes()` has applied `servoyAttributes`/`data-cy`
  exclusively to `getNativeElement()`/`#element` since the method's introduction in
  commit `d65079746` (emera, 2018-12-06, "SVY-13034 ... extracted base class for all
  components"), by explicit design (the class's own doc comment). No commit in
  `servoy-eclipse` ever changed this to target something broader before narrowing it
  back down. `textfieldgroup`'s `#element`/`#input` split with its own
  `getFocusElement()` returning the inner `<input>` has existed since the earliest
  visible commit in `servoy-extra-components`'s history (`3253d8d`, lvostinar,
  2021-05-31, the repo-split commit — the split itself predates this repo and was
  carried over intact). No code path in either repo ever connected
  `data-cy`/`servoyAttributes` to `getFocusElement()` before this fix. Server-side
  `data-cy` generation (`ChildrenJSONGenerator.java`, introduced as a rename of
  `data-svy-name` in commit `f05de5c13`, 2021-12-24) has always produced exactly one
  `data-cy` value per element/persist, never per-sub-element — consistent with why the
  fix needed to introduce a distinct suffixed value itself, rather than relying on
  the server to send two.
- `servoy-eclipse` commit `528fc33ea` ("SVY-18893 Missing data-cy attribute in
  popupMenu", Feb 2024) previously fixed a related but distinct problem — a
  *dynamically created* DOM node (a menu item) with no `data-cy` at all, because it
  exists outside anything `ServoyBaseComponent` manages — by manually calling
  `isInTestingMode()` and `setAttribute('data-cy', ...)` inside
  `popupmenu.service.ts` at the point that node is created. That is precedent for
  "a component/service must add `data-cy` to a node itself when the base class's
  single-`#element` assumption doesn't cover it" — the same style of self-contained,
  component-side fix ultimately used here for `textfieldgroup`.
- `servoy-extra-components` commit `f1086475a` ("SVY-19023 migrate to @servoy/public
  2026.9.2 signal-based base class", Aug 2026) and earlier `0d16291`/`4a006d3` (signal
  refactors) confirm the `#element`-on-wrapper / `#input`-on-inner-control shape in
  `textfieldgroup.html` predates all recent refactors — original component
  architecture, not a regression introduced recently.
- `servoy-eclipse` commits `f51f46bf4` ("SVY-21296 extract Cypress testing into
  standalone plugin") and `9149bbb68` ("SVY-21323 shutdown formpreview clients after
  tests and fix form name collisions") show `com.servoy.eclipse.cypress` is itself
  new/actively developed — consistent with the ticket being filed by someone actively
  building out the new Cypress/testing-mode tooling with this exact test solution and
  hitting a real component gap while dogfooding it.
