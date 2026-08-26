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
were not reachable from the designer's injector hierarchy. Additionally,
component-level `providers` didn't work because `Lightbox.open()` creates overlay
components using `ApplicationRef.injector` (the environment injector), not the
component's own injector.

### 2.3 Root cause

The services needed to be available at the root injector level — `providedIn: 'root'`
is the standard Angular pattern for this.

## 3. Design

### 3.1 Make all ngx-lightbox services root-provided

Change all 4 services in `@servoy/ngx-lightbox` from `@Injectable()` to
`@Injectable({ providedIn: 'root' })`:

- `src/lightbox.service.ts` — `Lightbox`
- `src/lightbox-config.service.ts` — `LightboxConfig`
- `src/lightbox-event.service.ts` — `LightboxEvent`, `LightboxWindowRef`

This makes them tree-shakeable singletons available in any context (runtime, designer,
standalone components) without requiring `LightboxModule` imports.

### 3.2 No changes needed in servoy-extra-components

The component already has a default size that works in the designer once instantiation
succeeds. No `designsize` property or Angular code changes are needed.

## 4. Implementation plan

1. Edit `src/lightbox.service.ts` in `ngx-lightbox`: change `@Injectable()` to
   `@Injectable({ providedIn: 'root' })`
2. Edit `src/lightbox-config.service.ts`: same change for `LightboxConfig`
3. Edit `src/lightbox-event.service.ts`: same change for `LightboxEvent` and
   `LightboxWindowRef`
4. Publish new version of `@servoy/ngx-lightbox`

## 5. Acceptance criteria

- [ ] All 4 services use `@Injectable({ providedIn: 'root' })`
- [ ] The Lightbox Gallery component is visible in the Servoy form editor on
      CSS-positioned forms (no NG0201 error)
- [ ] The lightbox opens correctly at runtime when clicking images
- [ ] No Angular component code in servoy-extra-components is modified

## 6. Out of scope

- Adding `designsize` property (not needed — default dimensions are sufficient)
- Any changes to servoy-extra-components Angular code
- Changes to the Servoy form designer (rfb)

## 7. Open questions

| Question | Owner | Status |
|----------|-------|--------|
| None     | —     | —      |
