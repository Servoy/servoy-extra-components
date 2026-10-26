# Triage Report — SVY-21650

**Verdict:** PROCEED

## Reported problem

Nested `ServoyExtraSplitpane` calculates wrong pane widths during initialization after the
2026.6 → 2026.9 upgrade (Blocker, fix version 2026.9.0, follow-up from SERVOY-301).

Setup: an outer splitpane (divider 0.75) contains a form with an inner splitpane
(divider 0.65); further components are on the right.

Symptom: the inner left pane is too wide and the inner right pane is too narrow and
clipped by its own pane (it is *not* overlaid by a neighbouring component). The right pane
shows a horizontal scrollbar (`overflow-x: auto`), so content remains reachable.

The reporter measured (zoom 100%):

| Value | Measured | Expected |
|---|---|---|
| Own width of inner splitter | 1290 px | 1290 px |
| Reference width used | 1720 px | 1290 px |
| Inner left pane | 1118 px | ≈ 838 px |
| Inner right pane | 167 px | ≥ 250 px required |

A separate recording at zoom 0.904 showed the same shape (reference 1923.4 px used instead
of 1443 px → 1250/188 px split), and **no corrective recalculation happened in the following
15 s**. A fresh session with zoom forced to 1 before login still reproduced it.

The reporter also ran a controlled in-memory counter-test: deferring the splitpane
callbacks until `ngAfterViewInit` produced the correct reference width (1443 px → 938/500 px),
confirming the cause is a measurement-timing issue, not zoom, not neighbour overlay, not the
missing `divLocation` on the vertical splitters, and not zoneless mode.

## Root-cause assessment

This is a real bug in this package's splitpane, triggered by an initialization-timing change
introduced with the 2026.9 platform/base-class upgrade. The symptom is a one-shot width
measurement taken against the wrong reference element, with no recalculation afterwards.

The inner `BGSplitter` lays out its panes by measuring the splitter host once:

- `components/projects/servoyextracomponents/src/splitpane/bg_splitter/bg_splitter.component.ts`
  - `ngAfterContentInit()` (lines 92–100) assigns pane indices, inserts the handler, and
    calls `adjustLocation(undefined, this.divLocation())` **once**.
  - `adjustLocation()` (lines 103–133) reads `this.elementRef().nativeElement.getBoundingClientRect()`
    and sizes pane 1 (`width = pos`) and pane 2 (`left = pos + handlerWidth`).
  - `getPosition()` (lines 135–160) turns a 0–1 `divLocation` ratio into pixels via
    `Math.round(width * wantedPosition)`, where `width = bounds.right - bounds.left`.
  - There is **no** post-layout recalculation: `BGSplitter` has no `window:resize` handler and
    no re-measure after its ancestor panes are sized. Only the outer `ServoyExtraSplitpane`
    listens to `window:resize` (`splitpane.ts` line 14), so a settled nested layout is never
    re-measured.

The outer pane's width is supposed to constrain the inner splitter. Pane widths come from
`bg_splitter.css` via the class on each `bg-pane`:

- `components/projects/servoyextracomponents/src/splitpane/bg_splitter/bg_splitter.css`
  - `.split-panes` is `position: absolute` filling its parent (lines 1–8).
  - `.split-panes.horizontal > .split-pane1 { width: 50% }` and `.split-pane2 { left:50%; right:0 }`
    (lines 39–49) — the constraining widths only apply **once the `split-paneN` class exists**.
- The class is applied by a host binding on the `BGPane` directive:
  `components/projects/servoyextracomponents/src/splitpane/bg_splitter/bg_pane.component.ts`
  line 7 — `'[class]': '"split-pane"+index'` — and `index` is only set inside the outer
  `BGSplitter.ngAfterContentInit()` (lines 93–96).

The timing hinges on the base class. The installed `@servoy/public` base class
(`components/node_modules/@servoy/public/fesm2022/servoy-public.mjs`, `ServoyBaseComponent`)
drives Servoy lifecycle off Angular's:

- `ngOnChanges()` (lines 58–82) queues changes until `elementRef` exists, then calls
  `svyOnChanges`; `ngAfterViewInit()` (lines 42–54) calls `initializeComponent()` →
  `svyOnInit()` (lines 35–38, 188–193). In the new signal-based base class the first
  `svyOnInit`/`svyOnChanges` for the component (which builds the inner form) runs *before* the
  outer `BGSplitter.ngAfterContentInit` has assigned pane indices and the host binding has
  written the `.split-pane1` class.

Consequence: when the inner `BGSplitter` measures, the outer `bg-pane` wrapping its form does
not yet carry `.split-pane1`, so the `width: 50%` constraint is absent and the inner splitter
measures the full outer container (1720/1923 px) instead of the intended pane width
(1290/1443 px). The computed percentage split is therefore off, and because nothing
re-measures after the outer classes land, the wrong widths stick.

In 2026.6 the base-class lifecycle ordered these steps differently (the splitpane callbacks
effectively ran after the outer layout was in place), so the correct reference width was used.
The reporter's `ngAfterViewInit`-deferral counter-test reproduces exactly that ordering and
fixes the measurement — strong evidence the root cause is ordering, not geometry.

## Ticket premise check

The ticket does not demand a specific code change; it proposes the correct *direction*: "the
inner splitter should use the correct outer pane width during initialization (as in 2026.6),
**or recalculate once the outer pane classes are applied**." Both halves hold up against the
code:

- The regression boundary the ticket cites is accurate as a *trigger*: extra-components commit
  f1086475a7 (SVY-19023) is where this package adopted the new signal-based base class
  (`@servoy/public` 2026.9.2), and the servoy-client base-class change it references
  (`76d583cba5`, not resolvable in the local `servoy-client` checkout) changed the lifecycle
  ordering. Note: v2026.6.0 already ran Angular 21 and already used signal `input()`s, and the
  splitpane was module-declared, not standalone — so the trigger is the **base-class lifecycle
  ordering**, not the signals migration or the later standalone conversion (8e2e88c) by itself.
- The reporter's own counter-test (defer to `ngAfterViewInit`) confirms the mechanism.

One caveat the ticket leaves open and the implementer must decide: whether to fix this in the
shared `ServoyBaseComponent` (servoy-client / `@servoy/public`) or locally in this splitpane.
A base-class change would be high blast-radius across every component; the evidence points to a
targeted splitpane fix being sufficient and far safer.

## Approaches considered

1. **Re-measure the inner split after the outer layout settles (recommended).**
   Make `BGSplitter` recalculate its split once the pane classes/widths are actually applied —
   e.g. defer the initial `adjustLocation` to after view init / next animation frame, or react
   to the element's own size (a `ResizeObserver` on the splitter host, which also fixes the
   "no corrective recalculation" the reporter observed). Keep the deferral local to
   `BGSplitter`/`ServoyExtraSplitpane`.
   - Pros: targeted; fixes both the init race and the missing recalc; low blast radius; matches
     the reporter's verified counter-test; no risk to other components.
   - Cons: must avoid double layout / flicker and an extra change-detection pass; needs a guard
     so it runs once and on genuine size changes only.

2. **Fix the ordering in the shared base class (`ServoyBaseComponent` in servoy-client / @servoy/public).**
   Restore the 2026.6 ordering so `svyOnInit`/`svyOnChanges` run after ancestor content init.
   - Pros: would address any other component with the same latent assumption.
   - Cons: high blast radius across all Titanium components; changing lifecycle ordering risks
     regressing components that now rely on the new timing; lives in a different repo; hard to
     validate in isolation. Disproportionate for a single-component layout bug.

3. **CSS-only / structural guard** (ensure the pane has a width constraint before measurement,
   independent of the index-driven class).
   - Pros: no lifecycle changes.
   - Cons: the class and pixel widths are index-driven in TS; a pure-CSS fix can't guarantee the
     constraint exists at the measurement instant, and still leaves the "no recalc" gap. Fragile.

4. **No code change.**
   - Pros: none beyond zero effort.
   - Cons: Blocker-severity, reproducible regression with a clear root cause and a verified
     mechanism; the only workaround is per-form property edits (height → 100%) which the customer
     should not have to make. Not acceptable.

## Recommendation

**PROCEED** with approach 1: a targeted fix in the splitpane (`BGSplitter` /
`ServoyExtraSplitpane`) that re-measures the split after the outer pane layout is applied,
rather than on the first synchronous pass. Prefer a solution that both (a) defers/repeats the
initial `adjustLocation` until the splitter host has its real constrained width and (b) adds a
corrective recalculation when the splitter host size changes (addressing the reporter's "no
recalculation within 15 s"). This mirrors the reporter's verified `ngAfterViewInit` counter-test
while being robust against later reflows.

Alternatives: approach 2 (base-class ordering fix) only if other components prove to share the
same latent race — but it is high-risk and out of this repo; approach 3 is too fragile to rely
on alone.

Implementation notes for the next phase:
- Keep `OnPush`; any deferred DOM write will need an explicit `detectChanges()` / renderer path.
- Add a regression test in `splitpane.spec.ts` that asserts the inner split uses the pane's
  constrained width, not the full container, when initialized nested (the existing tests only
  check inputs/mount, not computed geometry).

## Git history findings

- `v2026.6.0` already runs Angular 21.2.7, `@servoy/public` 2026.3.0, TypeScript 5.9.3, and
  already uses signal `input()`s; `HEAD`/2026.9 runs Angular 22.1.4, `@servoy/public` 2026.9.4,
  TypeScript 6.0.3. So the regression window is 2026.6 → 2026.9, but the signals migration
  predates 2026.6 and is not the trigger.
- `f1086475a70814051fea691dcd4effa2330e0730` (SVY-19023, "migrate to @servoy/public 2026.9.2
  signal-based base class") is the extra-components commit that adopted the new base class — the
  package-side boundary of the regression. Its splitpane touch was mechanical
  (`servoyApi.` → `servoyApi().`, `elementRef.` → `elementRef()!.`).
- `8e2e88c` ("convert all components to standalone") converted splitpane/`BGSplitter`/`BGPane`
  to `standalone: true`; at v2026.6.0 they were declared together in
  `ServoyExtraComponentsModule`. Standalone conversion is not itself the cause but is part of the
  same migration window.
- The `diff v2026.6.0 HEAD` of the splitpane sources shows no change to the measurement logic
  itself (`adjustLocation` / `getPosition` / `resizeCalc` are behaviourally identical) — the
  only moving part is *when* initialization runs, confirming a timing (not geometry) regression.
- The servoy-client base-class commit `76d583cba5` cited in the ticket is **not resolvable** in
  the local `C:\Users\vosti\git_master\servoy-client` checkout (unknown revision, not fetched),
  so the exact base-class diff could not be inspected here; the behavioural proof comes from the
  installed `@servoy/public` `servoy-public.mjs` lifecycle and the reporter's counter-test.
