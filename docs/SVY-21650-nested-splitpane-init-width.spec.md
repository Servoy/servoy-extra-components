# Spec: SVY-21650 — Nested ServoyExtraSplitpane calculates wrong widths during initialization after 2026.9 upgrade

## 1. Goal

Make a nested `ServoyExtraSplitpane` (`BGSplitter`) size its panes against the *constrained*
width of its outer pane during initialization, instead of against the full container width it
measures on the first synchronous pass after the 2026.9 base-class upgrade. The inner splitter
must defer its initial `adjustLocation` until its host has its real constrained width
(mirroring the reporter's verified `ngAfterViewInit`-deferral counter-test), and must
recompute on later layout changes by reusing the **existing `window:resize` event** that the
outer `ServoyExtraSplitpane` already handles — propagating a recalc down to the inner splitter
— rather than installing a per-splitter `ResizeObserver`. The fix is kept strictly local to
`BGSplitter` / `ServoyExtraSplitpane`, leaving the shared `@servoy/public`
`ServoyBaseComponent` untouched.

## 2. Background

### 2.1 Reported regression

Follow-up from SERVOY-301, "Multiple regression bugs after upgrading to 2026.9 from 2026.6"
(Blocker, fix version 2026.9.0). Setup: an outer splitpane (divider 0.75) contains a form that
hosts an inner splitpane (divider 0.65); further components sit on the right. After the upgrade
the inner left pane is too wide and the inner right pane is too narrow and clipped by its own
pane (an `overflow-x: auto` scrollbar keeps the content reachable, so it is not overlaid by a
neighbour). The reporter measured (zoom 100%):

| Value | Measured | Expected |
|---|---|---|
| Own width of inner splitter | 1290 px | 1290 px |
| Reference width used | 1720 px | 1290 px |
| Inner left pane | 1118 px | ≈ 838 px |
| Inner right pane | 167 px | ≥ 250 px required |

A second recording at zoom 0.904 showed the same shape (reference 1923.4 px used instead of
1443 px → 1250/188 px split) and **no corrective recalculation happened within the following
15 s**. A fresh session with zoom forced to 1 before login still reproduced it. The reporter's
controlled counter-test — deferring the splitpane callbacks until `ngAfterViewInit` — produced
the correct reference width (1443 px → 938/500 px), confirming the cause is a measurement-timing
issue, not zoom, not neighbour overlay, not a missing `divLocation`, and not zoneless mode.

### 2.2 Regression root cause — base-class lifecycle ordering (user-confirmed)

This is a real bug in this package's splitpane, triggered by an initialization-*timing* change
introduced with the 2026.9 platform / base-class upgrade. It is **not** a geometry change: a
`diff v2026.6.0 HEAD` of the splitpane sources shows `adjustLocation` / `getPosition` /
`resizeCalc` are behaviourally identical — the only moving part is *when* initialization runs.

The installed `@servoy/public` `ServoyBaseComponent` drives the Servoy lifecycle off Angular's:
`ngOnChanges` queues changes until `elementRef` exists then calls `svyOnChanges`;
`ngAfterViewInit` calls `initializeComponent()` → `svyOnInit`. With the new signal-based base
class, the component's first `svyOnInit` / `svyOnChanges` (which builds the inner form) runs
*before* the outer `BGSplitter.ngAfterContentInit` has assigned pane indices and the host
binding has written the `.split-pane1` class on the outer `bg-pane`. In 2026.6 the ordering was
effectively the reverse, so the correct reference width was used. The reporter's
`ngAfterViewInit`-deferral counter-test reproduces the old ordering and fixes the measurement —
strong evidence the root cause is ordering, not geometry.

### 2.3 How the inner splitter measures, and why the race bites

- `bg_splitter/bg_splitter.component.ts`
  - `ngAfterContentInit()` (lines 92–100) assigns pane indices, inserts the handler, and calls
    `adjustLocation(undefined, this.divLocation())` **once**.
  - `adjustLocation()` (lines 103–133) reads
    `this.elementRef().nativeElement.getBoundingClientRect()` and sizes pane 1 (`width = pos`)
    and pane 2 (`left = pos + handlerWidth`).
  - `getPosition()` (lines 135–160) turns a 0–1 `divLocation` ratio into pixels via
    `Math.round(width * wantedPosition)`, where `width = bounds.right - bounds.left`.
  - There is **no** post-layout recalculation: `BGSplitter` has no `window:resize` handler and
    no re-measure after its ancestor panes are sized. Only the outer `ServoyExtraSplitpane`
    listens to `window:resize` (`splitpane.ts` line 14), so a settled nested layout is never
    re-measured.
- The pane width constraint comes from `bg_splitter.css`: `.split-panes.horizontal > .split-pane1 { width: 50% }`
  and `.split-pane2 { left: 50%; right: 0 }` (lines 39–49). These only apply once the
  `split-paneN` class exists.
- That class is a host binding on the `BGPane` directive — `bg_pane.component.ts` line 7,
  `'[class]': '"split-pane"+index'` — and `index` is only set inside the outer
  `BGSplitter.ngAfterContentInit()` (lines 93–96).

Consequence: when the inner `BGSplitter` measures, the outer `bg-pane` wrapping its form does
not yet carry `.split-pane1`, so the `width: 50%` constraint is absent and the inner splitter
measures the full outer container (1720 / 1923 px) instead of the intended pane width
(1290 / 1443 px). The computed percentage split is wrong, and because nothing re-measures after
the outer classes land, the wrong widths stick.

### 2.4 Approved approach

The triage (`docs/SVY-21650-triage.md`) evaluated four options and a human approved **approach 1**:
a targeted fix in the splitpane that re-measures the split *after* the outer pane layout is
applied, rather than on the first synchronous pass. Explicitly rejected: changing the shared
`ServoyBaseComponent` / `@servoy/public` base class (approach 2, high blast radius, different
repo) and a CSS-only guard (approach 3, too fragile to guarantee the constraint at the
measurement instant). The fix must:

1. defer the initial `adjustLocation` until the splitter host has its real constrained
   width (mirroring the reporter's verified `ngAfterViewInit`-deferral counter-test), and
2. recompute on later layout changes by reusing the **existing `window:resize` event** already
   handled by the outer `ServoyExtraSplitpane`, propagated down to the inner `BGSplitter`.

**A `ResizeObserver` is explicitly rejected** (the original draft's mechanism): it adds
continuous per-splitter observation overhead and introduces a feedback-loop risk (its own
pane-style writes re-trigger the observer), which then needs a tolerance guard. An event-based
recalc driven by the resize event the component already listens to is cheaper and has no
self-trigger loop.

## 3. Design

The fix has two parts: a **deferred initial measurement** in `BGSplitter`, and an **event-based
corrective recalc** that reuses the `window:resize` event the outer `ServoyExtraSplitpane`
already handles, propagated down to the inner `BGSplitter`. No `ResizeObserver` is introduced.
All DOM writes route through the existing `renderer` and respect `OnPush`.

### 3.1 Deferred initial measurement (`BGSplitter`)

`ngAfterContentInit()` currently assigns pane indices, inserts the handler, then immediately
calls `adjustLocation(undefined, this.divLocation())`. The index assignment is what eventually
produces the `.split-paneN` classes (via the `BGPane` host binding), and those classes carry the
constraining `width: 50%` the measurement depends on. On the first synchronous pass the class has
not yet been written to the DOM, so the host still measures the full container.

Keep assigning indices and inserting the handler synchronously, but **defer the initial
`adjustLocation`** to after Angular has applied the host-binding classes and laid out the
constrained host. Use Angular's `afterNextRender` (injected in the constructor / field
initializer) so the callback runs once, after the DOM render that writes the `.split-paneN`
classes, at which point the host's `getBoundingClientRect()` returns the constrained pane width
rather than the full container. This is the direct, robust analogue of the reporter's
`ngAfterViewInit`-deferral counter-test, and `afterNextRender` is the OnPush/zoneless-correct
scheduling primitive for post-render DOM reads.

- The deferred callback must re-check preconditions (`panes().length === 2`, host still
  attached) because it runs asynchronously.
- It is a no-event, `wantedPosition = divLocation()` call, so pane-1 width and pane-2 left are
  recomputed from the *correct* reference width.
- Because the write happens via `renderer` directly on native elements (not via bindings), no
  template re-render is needed.
- Schedule it **once** (a run-once guard flag), so there is no double initial layout / flicker.

### 3.2 Corrective recalc via the existing `window:resize` event (no ResizeObserver)

The outer `ServoyExtraSplitpane` already listens for `window:resize`
(`splitpane.ts` host binding → `onResize()` → debounced `resizeCalc()`). The inner `BGSplitter`
currently has **no** resize handling at all, so after the window resizes (or anything that
re-flows the outer pane width) the inner split keeps its stale reference. The fix adds a
**lightweight recalc entry point** on `BGSplitter` and drives it from this already-present
event, instead of each splitter independently observing its own box:

- Add a public method on `BGSplitter`, e.g. `recalculate()`, that calls
  `adjustLocation(undefined, this.divLocation())` (re-applying the stored ratio against the
  current reference box). It does **not** emit `onDividerChange` — the divider ratio did not
  change, only the reference box; emitting would spuriously push a new `divLocation` to the
  server.
- Give `BGSplitter` its own `host: { '(window:resize)': 'recalculate()' }` binding **or** have
  the outer `ServoyExtraSplitpane.onResize()` call into the inner splitter. Prefer the direct
  host binding on `BGSplitter`: it is self-contained, needs no `@ViewChild` plumbing from the
  outer component, and reuses the same browser resize event (no new observation mechanism).
  Debounce consistently with the outer component's existing 50 ms `setTimeout` pattern so a
  burst of resize events coalesces into one recalc.
- This reuses an event the app already dispatches; it adds no continuous observation overhead and
  cannot feedback-loop off its own pane-style writes (a style write does not fire
  `window:resize`).

### 3.3 Coverage note — the init race vs. later resizes

The two parts cover different triggers:

- **3.1 (deferred init)** fixes the *reported* bug: the first measurement now happens after the
  `.split-paneN` classes land, so the nested splitter uses the constrained pane width from the
  start. This alone resolves SVY-21650's symptom.
- **3.2 (window:resize)** keeps the nested split correct through later window/layout resizes,
  which the inner splitter previously ignored entirely.

If, in the real runtime, the outer pane classes land *after* `afterNextRender` fires (so even the
deferred initial read is still too early), the implementer should confirm the deferred read
observes the constrained width; if a single `afterNextRender` proves insufficient, fall back to
reading after the outer layout settles (still event/render-driven, not a polling observer). The
regression test (§5) must assert the constrained width is used at init to pin this down.

### 3.4 OnPush / change-detection correctness

Both components are `ChangeDetectionStrategy.OnPush`. The deferred init and the resize handler
write via `renderer.setStyle(...)` on native elements, so they take effect regardless of CD and
need no extra CD pass. Only if some bound/signal state must reflect the recomputed layout should
an explicit `ChangeDetectorRef.detectChanges()` be added on that path — keep this minimal and do
not rely on zone ticks (consistent with the project's zoneless-readiness and OnPush rules).

### 3.5 What stays unchanged

- No change to `getPosition` / the geometry math — it was never wrong.
- No change to `ServoyExtraSplitpane`'s own `resizeCalc`, `onChange`, or `divLocationChange`
  emission semantics.
- No change to `bg_splitter.css` or the `.split-paneN` host binding.
- No change to the shared `@servoy/public` `ServoyBaseComponent`.
- **No `ResizeObserver`** anywhere in the splitpane.
- Legacy top-level AngularJS splitpane files are untouched.

## 4. Implementation plan

1. `bg_splitter/bg_splitter.component.ts`:
   - In `ngAfterContentInit()`, keep the synchronous index assignment and handler insertion, but
     replace the immediate `adjustLocation(undefined, this.divLocation())` with a **deferred,
     run-once** initial measurement using `afterNextRender` (so it runs after the `.split-paneN`
     host-binding classes are applied and the host has its constrained box). Re-check
     preconditions (`panes().length === 2`, host attached) inside the callback. Add a run-once
     guard flag.
   - Add a public `recalculate()` method that calls `adjustLocation(undefined, this.divLocation())`
     (re-apply stored ratio against the current reference box) and does **not** emit
     `onDividerChange`.
   - Add a `host: { '(window:resize)': 'onResize()' }` binding (or extend the existing host
     block) with a debounced `onResize()` (same 50 ms `setTimeout` pattern as
     `ServoyExtraSplitpane.onResize`) that calls `recalculate()`. Clear the pending timeout on
     destroy — add `OnDestroy` to the `implements` clause and a `ngOnDestroy()` that clears it.
   - If (and only if) some bound/signal state must flush after a recalc, inject
     `ChangeDetectorRef` and call `detectChanges()` on that path — keep minimal.
   - **Do not** add a `ResizeObserver`.
2. `splitpane/splitpane.ts`: leave as-is unless an OnPush CD flush must be coordinated from the
   outer component. (Its own `window:resize` handling is unchanged.)
3. `splitpane/<test file>`: add a regression test (see §5) asserting the inner split uses the
   pane's constrained width, not the full container, when initialized nested, plus a recalc on a
   simulated `window:resize`. **First verify the live test framework and file name**: AGENTS.md
   says Vitest with `splitpane.spec.ts`; project-context.md says Cypress with `splitpane.cy.ts`.
   Check `components/package.json` scripts and `angular.json` test target, then follow the actual
   convention and the existing test file's patterns.
4. Verify per AGENTS.md from the `components/` directory: `npm run build` (type-check),
   `npx ng lint`, and the targeted splitpane test run.

## 5. Acceptance criteria

- [ ] A nested `ServoyExtraSplitpane` sizes pane 1 and pane 2 from the splitter host's
      *constrained* width (the outer pane width), not the full outer container width, at
      initialization — reproducing the triage's expected split (e.g. the 1290 px host yields
      ≈ 838 px / ≥ 250 px panes for a 0.65 divider, not 1118 px / 167 px).
- [ ] The initial `adjustLocation` is deferred (via `afterNextRender`) until after the
      `.split-paneN` host-binding classes are applied and the host has its real constrained box
      (mirroring the reporter's `ngAfterViewInit`-deferral counter-test), and runs **exactly once**.
- [ ] After init, a `window:resize` recomputes the inner split against the current reference width,
      reusing the browser resize event already handled by the outer splitpane (no new observation
      mechanism). The handler is debounced consistently with `ServoyExtraSplitpane.onResize`.
- [ ] The corrective recalc (`recalculate()`) does not emit `divLocation` / `onDividerChange` (the
      ratio did not change).
- [ ] **No `ResizeObserver` is introduced** anywhere in the splitpane.
- [ ] Any resize-debounce timeout is cleared on destroy (`ngOnDestroy`); no dangling timers.
- [ ] The fix is confined to `BGSplitter` / `ServoyExtraSplitpane`; `ServoyBaseComponent` /
      `@servoy/public` and `bg_splitter.css` / the `BGPane` host binding are unchanged.
- [ ] Both components remain `ChangeDetectionStrategy.OnPush`; deferred/resize DOM writes use the
      `renderer` and an explicit `detectChanges()` only where bound state must flush — no reliance
      on a zone tick.
- [ ] A regression test in the splitpane test file asserts the inner split uses the pane's
      constrained width (not the full container) when initialized nested, and that a simulated
      `window:resize` triggers a corrective recalculation. The init-width assertion fails against
      the current (pre-fix) code.
- [ ] `npm run build` compiles with no errors; `npx ng lint` shows no new warnings; the splitpane
      tests pass.

## 6. Out of scope

- A `ResizeObserver`-based corrective recalc (rejected per reviewer: continuous observation
  overhead + self-trigger feedback-loop risk). The corrective recalc reuses the existing
  `window:resize` event instead.
- Any change to the shared `@servoy/public` `ServoyBaseComponent` lifecycle ordering (approach 2 —
  rejected; different repo, high blast radius).
- A CSS-only / structural width-constraint guard (approach 3 — rejected as fragile).
- Changes to the splitpane geometry math (`getPosition`), which the triage confirmed is unchanged
  and correct.
- The legacy top-level AngularJS splitpane files.
- The sibling SERVOY-301 regressions other than the nested-splitpane width (this spec addresses
  only the `BGSplitter` initialization-width bug tracked by SVY-21650).

## 7. Open questions

| Question | Owner | Status |
|----------|-------|--------|
| Confirm `afterNextRender` reliably runs after the `.split-paneN` classes are applied and the host is laid out, in both the real runtime and the test environment. If a single `afterNextRender` is too early, fall back to a render/event-driven re-read after the outer layout settles (still not a polling observer). | implementer | open |
| Whether any `ServoyExtraSplitpane`-bound state actually needs an explicit `detectChanges()` after the recalc, or whether the direct `renderer` writes are fully sufficient (keep the CD flush minimal). | implementer | open |
| SERVOY-301 screenshots/measurements live on the linked parent issue; no attachments are on SVY-21650 itself. Confirm the expected split figures above match the latest SERVOY-301 evidence if more precise numbers are needed for the test fixture. | reporter | open |
