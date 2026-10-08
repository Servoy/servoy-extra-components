# Spec: SVY-21367 — Lightbox Gallery not visible in form editor

## 1. Goal

Fix the Lightbox Gallery component so it can be instantiated in the Servoy form editor
(CSS-positioned forms). The component was crashing with `NG0201: No provider found for
_Lightbox` because the `@servoy/ngx-lightbox` services were not available in the
designer's injector hierarchy.

## 2. Background

### 2.1 The problem

The `Lightbox`, `LightboxConfig`, `LightboxEvent`, and `LightboxWindowRef` services from
`@servoy/ngx-lightbox` were declared as `@Injectable()` without `providedIn: 'root'`.
They relied on `LightboxModule` to register them in a module-scoped injector.

The Servoy form designer instantiates components in a standalone context
(`_ServoyDesignerComponent`) that does not include `LightboxModule` in its injector chain.
This caused the component to crash on instantiation, making it invisible.

### 2.2 Why module-level providers didn't help

The `ServoyExtraLightboxGallery` component is `standalone: true`. Even when
`LightboxModule` was added to `ServoyExtraComponentsModule` imports, the providers
were not reachable from the designer's injector hierarchy.

### 2.3 Root cause, revised

The first attempt at this fix (recorded below in §3.1-superseded) made all four services
`@Injectable({ providedIn: 'root' })`. That worked in principle but was reverted: a
root-level singleton means every `lightboxgallery` instance on every form shares one
`Lightbox`/`LightboxConfig`/`LightboxEvent`, so one gallery's `open()` call (which mutates
`LightboxConfig` fields such as `albumLabel`/`fadeDuration` and broadcasts on a single
shared `LightboxEvent` bus) can bleed into or cross-talk with another gallery instance on
the same form. That is a correctness regression severe enough to reject the root-singleton
approach, even though it did fix the designer crash.

The actual root cause is narrower than "needs root scope": `Lightbox.open()` creates its
overlay/content components (`LightboxOverlayComponent`, `LightboxComponent`) via
`createComponent()`, and before this fix that call only passed `environmentInjector:
this._applicationRef.injector` — never the injector of whoever constructed the `Lightbox`
service. So even a component-level `providers: [...]` array on `ServoyExtraLightboxGallery`
alone would not have helped: `Lightbox.open()`'s dynamically created components still only
saw the environment injector, found no provider there, and still threw `NG0201`.

## 3. Design (as shipped)

### 3.1 Superseded — root-provided services

*(First attempt, commit `0966042`/`5e6d39c`. Reverted in `29d3868` for the state-isolation
reason in §2.3. Kept here for history; do not reintroduce without re-litigating that
isolation concern.)*

~~Change all 4 services in `@servoy/ngx-lightbox` from `@Injectable()` to
`@Injectable({ providedIn: 'root' })`.~~

### 3.2 Shipped fix — component-scoped providers + forwarded elementInjector

Two coordinated changes, in two repositories, neither sufficient alone:

**`@servoy/ngx-lightbox` (`29d3868`):**
- `Lightbox`, `LightboxConfig`, `LightboxEvent`, `LightboxWindowRef` stay plain
  `@Injectable()` (no `providedIn`) — no app-wide singleton.
- `Lightbox`'s constructor additionally injects Angular's `Injector` (the injector of
  whoever constructed `Lightbox` — in practice, the consuming component's own element
  injector, because `Lightbox` is listed in that component's `providers: [...]`).
- `Lightbox._createComponent()` now passes **both**
  `environmentInjector: this._applicationRef.injector` **and**
  `elementInjector: this._injector` to `createComponent()`. The `elementInjector` is what
  lets the dynamically created `LightboxComponent`/`LightboxOverlayComponent` resolve
  `LightboxEvent`/`LightboxWindowRef`/`FileSaverService` from the *caller's* injector
  instead of failing to find them on the environment injector.
- `LightboxWindowRef` is now exported from the package's public `src/index.ts` (previously
  internal) — a direct, minimal consequence of the consumer needing to reference the real
  class in its own `providers: [...]` array.

**`servoy-extra-components` (`20fe44e`):**
- `ServoyExtraLightboxGallery` declares
  `providers: [Lightbox, LightboxConfig, LightboxEvent, LightboxWindowRef]` at the
  component level (`@Component({ ..., providers: [...] })`).
- Each `lightboxgallery` instance — whether constructed by the running NGClient or by the
  form designer — gets its own `Lightbox`/`LightboxConfig`/`LightboxEvent`/
  `LightboxWindowRef` instances in its own element injector, and that same injector is what
  `Lightbox._createComponent()` forwards to its dynamically created overlay components.

### 3.3 Net effect

No module import (`LightboxModule`) is required anywhere in the final fix. No root-level
singletons are introduced. Each `lightboxgallery` component is fully self-contained for DI
purposes — this both fixes the designer crash (the component carries its own providers, so
it does not depend on being inside a tree that imported `LightboxModule`) and avoids the
cross-instance state bleed that the superseded `providedIn: 'root'` approach would have
reintroduced.

### 3.4 No changes needed to component sizing

The component already has a default size that works in the designer once instantiation
succeeds. No `designsize` property or layout/CSS changes were needed — this was purely a
dependency-injection wiring bug, not a styling or sizing one.

## 4. Implementation (as shipped)

1. `ngx-lightbox/src/lightbox.service.ts` — inject `Injector`, pass `elementInjector:
   this._injector` in `_createComponent()`.
2. `ngx-lightbox/src/lightbox-config.service.ts`,
   `ngx-lightbox/src/lightbox-event.service.ts` — revert `providedIn: 'root'` back to plain
   `@Injectable()`.
3. `ngx-lightbox/src/index.ts` — export `LightboxWindowRef`.
4. Publish `@servoy/ngx-lightbox@4.0.1`.
5. `servoy-extra-components/.../lightboxgallery/lightboxgallery.ts` — import
   `LightboxEvent`/`LightboxWindowRef`; add
   `providers: [Lightbox, LightboxConfig, LightboxEvent, LightboxWindowRef]`.
6. `servoy-extra-components/components/package.json` — bump `@servoy/ngx-lightbox` to
   `^4.0.1`.
7. `servoy-extra-components/.../lightboxgallery/lightboxgallery.spec.ts` — add
   `MockLightboxEvent`/`MockLightboxWindowRef` to the existing mock factory so the test
   module still resolves the component's (now longer) `providers` list.
8. `ngx-lightbox/src/lightbox.service.spec.ts` (added during peer review, see §6) — direct
   regression test for the `elementInjector` forwarding, since neither repo's existing test
   suite exercised the real `Lightbox.open()` → `createComponent()` → `elementInjector`
   path (both mocked around it).

## 5. Acceptance criteria

- [x] `Lightbox`/`LightboxConfig`/`LightboxEvent`/`LightboxWindowRef` are provided at the
      `ServoyExtraLightboxGallery` component level, not at root
- [x] `Lightbox._createComponent()` forwards the component's own injector as
      `elementInjector`
- [ ] The Lightbox Gallery component is visible in the Servoy form editor on
      CSS-positioned forms (no `NG0201` error) — **requires manual verification in the
      actual form editor**; not confirmed by source inspection or by the automated tests
      added in §6, since the designer's component-hosting mechanism isn't present in either
      of this issue's two repositories.
- [x] The lightbox opens correctly at runtime when clicking images (covered by
      `lightbox.service.spec.ts`'s `open()` test and `lightboxgallery.spec.ts`)
- [x] No `designsize`/CSS changes required

## 6. Test coverage added during peer review

A peer review of this fix (see case-review summary on SVY-21367) found that both repos'
existing tests mock around the exact mechanism this fix relies on:
`lightboxgallery.spec.ts` mocks `@servoy/ngx-lightbox` entirely, and
`lightbox.component.spec.ts`/`lightbox-overlay.component.spec.ts` register
`LightboxEvent`/`LightboxWindowRef` directly at the TestBed module level — a different
injector topology than the real `createComponent({ elementInjector })` production path.

Added `ngx-lightbox/src/lightbox.service.spec.ts`, which builds a real host component with
`providers: [Lightbox, LightboxConfig, LightboxEvent, LightboxWindowRef]` (mirroring
`ServoyExtraLightboxGallery`'s own setup) and exercises the real, unmocked
`Lightbox._createComponent()` / `Lightbox.open()` path. It asserts:

- `Lightbox` is resolvable from the host component's injector but *not* from the root
  injector (confirms there is no accidental root singleton).
- The dynamically created `LightboxComponent`/`LightboxOverlayComponent` successfully
  inject `LightboxEvent`/`LightboxWindowRef` via the forwarded `elementInjector`, and that
  they resolve to the *same* instances the host's `Lightbox` holds (not some unrelated
  instance) — this is the one assertion that fails if the `elementInjector` forwarding
  regresses.
- `open()` runs end-to-end without throwing and attaches both the lightbox and overlay
  elements to the DOM.
- Two independently created host components get fully isolated `Lightbox`/`LightboxEvent`
  instances (confirms the per-instance scoping behavior change is real and intentional).

Verified: `npx ng test --no-watch` in `ngx-lightbox` → 3 test files, 15 tests, all passing
(4 new + 11 pre-existing).

## 7. Out of scope

- Changes to the Servoy form designer (rfb) — manual verification there is still required
  per §5.

## 8. Open questions

| Question | Owner | Status |
|----------|-------|--------|
| Why was `providedIn: 'root'` reverted — was it purely the multi-instance state-isolation concern described in §2.3, or something else observed in the designer? | Author | Open — not recorded in the `29d3868` commit message |
| Was the fix manually verified in the actual Servoy form editor before this went to review? | Author | Open |
