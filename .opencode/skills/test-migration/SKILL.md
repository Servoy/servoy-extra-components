---
name: test-migration
description: "Use when the user wants to migrate component tests from Cypress to Vitest, or clean up legacy test infrastructure (Cypress, Karma, Jasmine). Triggered by 'test migration', 'migrate tests', 'cypress to vitest', 'convert tests', 'remove cypress', or 'clean up test framework'."
---

# Test Migration — Cypress to Angular Vitest

You are a **test framework migration agent** for the Servoy Extra Components project. Your job is
to convert Cypress component tests (`.cy.ts`) to Angular Vitest tests (`.spec.ts`) and clean up
all legacy test infrastructure.

## Context

This project has 16 Cypress component test files that can no longer run because Cypress's
`@cypress/webpack-dev-server` requires `@angular-devkit/build-angular` (webpack-based), which
this project no longer uses — it uses `@angular/build` (esbuild-based).

Angular 22 uses Vitest as the official test framework via `@angular/build:unit-test` builder.
Tests use Angular's `TestBed` with jsdom (or optionally real browsers via `--browsers`).

## Infrastructure Setup

Check whether the Vitest infrastructure is already configured by looking for:
- A `test` target in `angular.json` using `@angular/build:unit-test`
- `vitest` in `package.json` devDependencies
- A `vitest-base.config.ts` file

If any of these are missing, run the full setup below. If all are present, skip to Phase 2.

### Phase 1 — Infrastructure Setup

#### 1.1 Install Vitest dependencies

```bash
npm install --save-dev vitest jsdom @types/luxon
```

`@types/luxon` is required by `@servoy/public` type definitions.

#### 1.2 Add test target to angular.json

Add a `test` architect target to the library project:

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "projects/<library>/tsconfig.spec.json",
    "buildTarget": "<app-project>:build",
    "runnerConfig": "vitest-base.config.ts"
  }
}
```

**Important:** Libraries need a `buildTarget` pointing to an application project since
`@angular/build:unit-test` needs an application build context. Use the `dummy` project
or whichever application project exists in the workspace.

#### 1.3 Create or update tsconfig.spec.json

The tsconfig for tests should extend the root tsconfig and include `.spec.ts` files:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/spec",
    "types": []
  },
  "files": [],
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.ts",
    "src/**/*.d.ts"
  ],
  "exclude": [
    "src/**/*.cy.ts"
  ]
}
```

The `exclude` for `*.cy.ts` is only needed while old Cypress files still exist.

#### 1.4 Create vitest-base.config.ts

This handles CommonJS module compatibility issues. `@servoy/ngx-lightbox` depends on
`ngx-filesaver` which imports `file-saver` as a named ESM export, but `file-saver` is
CommonJS. The `deps.inline` setting fixes this:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      inline: ['file-saver', 'ngx-filesaver', '@servoy/ngx-lightbox']
    }
  }
});
```

Add any other problematic CommonJS packages to `deps.inline` as you encounter them.

#### 1.5 Add test scripts to package.json

```json
"test": "ng test <project-name> --no-watch",
"test:watch": "ng test <project-name>",
"test:ui": "ng test <project-name> --ui"
```

Replace `<project-name>` with the Angular project name from `angular.json`
(e.g., `@servoy/servoyextracomponents`).

#### 1.6 Verify infrastructure

Run the test command. It should either pass with 0 tests or fail only because no
`.spec.ts` files exist yet (not because of config errors):

```bash
npx ng test <project-name> --no-watch
```

## Input

The user provides:
- A specific component name (e.g., `spinner`, `sidenav`) OR `all` to migrate everything
- Optionally `setup` to only configure the infrastructure without converting tests
- Optionally `cleanup` to only remove Cypress/Karma/Jasmine remnants

## Process

### Phase 2 — Convert Test Files

For each `.cy.ts` file, create a corresponding `.spec.ts` file with equivalent test coverage.

#### CRITICAL: Proven working pattern (Direct Component Testing)

**DO NOT use a WrapperComponent pattern.** It causes module resolution issues with
`standalone: false` components in the `ServoyExtraComponentsModule`.

**DO use direct component instantiation with `fixture.componentRef.setInput()`:**

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule, IValuelist } from '@servoy/public';
import { ServoyExtraSpinner } from './spinner';

describe('ServoyExtraSpinner', () => {
    let fixture: ComponentFixture<ServoyExtraSpinner>;
    let component: ServoyExtraSpinner;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServoyExtraSpinner],
            imports: [ServoyPublicTestingModule, FormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraSpinner);
        component = fixture.componentInstance;

        // Set inputs via componentRef.setInput() — this works with signal inputs
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('editable', true);
        // ... other inputs

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
```

#### Why this pattern works

1. **`fixture.componentRef.setInput()`** — sets signal inputs properly via the Angular
   framework's input binding mechanism. Direct property access doesn't work because
   signal inputs are readonly.

2. **`declarations: [TheComponent]`** — declare only the component under test. Since
   `ServoyExtraComponentsModule` already declares it, you CANNOT import the full module
   AND declare the component (double declaration error).

3. **`schemas: [NO_ERRORS_SCHEMA]`** — suppresses unknown element/attribute errors for
   child components in templates (like `[sabloTabseq]`, custom directives from ServoyPublicModule).

4. **`ServoyPublicTestingModule`** — provides mock implementations of Servoy services
   (`ServoyApi`, `FormattingService`, etc.).

5. **No `ServoyExtraComponentsModule` import** — avoids pulling in all 16 components and
   their heavy dependencies (TinyMCE, Uppy, tree components, etc.), AND avoids the
   `file-saver` CommonJS issue at the module import level.

#### Conversion mapping

| Cypress | Vitest + TestBed |
|---------|-----------------|
| `import { MountConfig } from 'cypress/angular'` | `import { TestBed, ComponentFixture } from '@angular/core/testing'` |
| `cy.mount(Wrapper, { declarations: [Comp], imports: [...] })` | `TestBed.configureTestingModule({ declarations: [Comp], imports: [...], schemas: [NO_ERRORS_SCHEMA] })` |
| `cy.mount(...).then(wrapper => { ... })` | Sequential async code after `TestBed.createComponent()` |
| Setting wrapper signals: `wrapper.component.prop.set(val)` | `fixture.componentRef.setInput('prop', val)` |
| Handler stubs: `defaultValues.onAction = cy.stub()` | `fixture.componentRef.setInput('onActionMethodID', vi.fn())` |
| `cy.get('selector')` | `fixture.nativeElement.querySelector('selector')` |
| `cy.get('selector').should('exist')` | `expect(el).not.toBeNull()` |
| `cy.get('selector').should('have.value', x)` | `expect((el as HTMLInputElement).value).toBe(x)` |
| `cy.get('selector').should('have.class', x)` | `expect(el.classList.contains(x)).toBe(true)` |
| `cy.get('selector').should('have.attr', a, v)` | `expect(el.getAttribute(a)).toBe(v)` |
| `cy.get('selector').should('not.have.class', x)` | `expect(el.classList.contains(x)).toBe(false)` |
| `cy.get('selector').should('contain', text)` | `expect(el.textContent).toContain(text)` |
| `cy.get('selector').click()` | `el.click(); fixture.detectChanges(); await fixture.whenStable()` |
| `cy.get('selector').rightclick()` | `el.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true})); fixture.detectChanges()` |
| `cy.get('selector').blur()` | `el.dispatchEvent(new FocusEvent('blur', {bubbles: true})); fixture.detectChanges()` |
| `cy.get('selector').trigger('keydown', {which: 38})` | `el.dispatchEvent(new KeyboardEvent('keydown', {which: 38, bubbles: true})); fixture.detectChanges()` |
| `cy.get('selector').trigger('pointerenter')` | `el.dispatchEvent(new PointerEvent('pointerenter', {bubbles: true})); fixture.detectChanges()` |
| `cy.get('selector').trigger('focus')` | `el.dispatchEvent(new FocusEvent('focus', {bubbles: true})); fixture.detectChanges()` |
| `cy.stub()` | `vi.fn()` |
| `cy.wrap(stub).should('be.called')` | `expect(spy).toHaveBeenCalled()` |
| `cy.wrap(stub).should('have.been.calledWith', x)` | `expect(spy).toHaveBeenCalledWith(x)` |
| `cy.wrap(stub).should('not.have.been.called')` | `expect(spy).not.toHaveBeenCalled()` |
| `expect(stub).to.have.been.called` | `expect(spy).toHaveBeenCalled()` |
| `.then(() => { ... })` | Sequential code (Vitest is synchronous/async, not chained) |

#### Handler and output testing

**Handlers (input functions):** Set via `setInput` and check with `expect`:
```typescript
fixture.componentRef.setInput('onActionMethodID', vi.fn());
// ... trigger action ...
expect(component.onActionMethodID()).toHaveBeenCalled();
```

**Outputs (EventEmitter/output):** Subscribe to the output:
```typescript
const changeSpy = vi.fn();
component.dataProviderIDChange.subscribe(changeSpy);
// ... trigger change ...
expect(changeSpy).toHaveBeenCalledWith(expectedValue);
```

#### Tooltip testing

Tooltips in Servoy use a custom `[svyTooltip]` directive that renders on pointer events with
delays. In jsdom this doesn't fully work. Instead, verify the tooltip value is set:
```typescript
expect(component.toolTipText()).toBe('Expected tooltip');
```

#### Focus events in jsdom

jsdom doesn't fully simulate focus/blur via `.click()`. To test focus handlers,
dispatch the focus event directly:
```typescript
el.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
```

#### Per-component verification

After converting each test file:
```bash
npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/<name>/<name>.spec.ts"
```

Fix any failures before moving to the next component.

---

### Phase 3 — Cleanup

After all tests are converted and passing:

#### 3.1 Remove Cypress files

```
DELETE: cypress.config.ts
DELETE: cypress/ (entire directory)
DELETE: all *.cy.ts files (16 files)
```

#### 3.2 Remove Cypress dependencies from package.json

Remove from `devDependencies`:
- `cypress`

Remove scripts:
- `cy:open`
- `cy:run`

#### 3.3 Remove Karma/Jasmine residuals from package.json

Remove from `devDependencies`:
- `@types/jasmine` (leftover, not used)

#### 3.4 Update tsconfig.spec.json

Remove the `"exclude": ["src/**/*.cy.ts"]` entry (no longer needed after .cy.ts files are deleted).

#### 3.5 Run npm install

```bash
npm install
```

This removes the unused packages from `node_modules` and updates `package-lock.json`.

#### 3.6 Final verification

```bash
npm run build
npx ng lint
npx ng test @servoy/servoyextracomponents --no-watch
```

All three must pass.

---

### Phase 4 — Update AGENTS.md

After migration, update the `AGENTS.md` documentation to reflect the new test setup:

- Change test framework from "Cypress 15.x" to "Vitest (via @angular/build:unit-test)"
- Update test commands table
- Update test conventions section
- Update test file pattern from `**/*.cy.ts` to `**/*.spec.ts`
- Remove Cypress-specific instructions
- Update the "Post-edit checklist" section
- Document the direct component testing pattern (no WrapperComponent)

---

### Phase 5 — Update GitHub Actions workflow

Check for a `.github/workflows/runTest.yml` (or similar) that runs Cypress tests.
Replace it with a Vitest-based workflow:

```yaml
name: Run the vitest component tests

on:
  push:
    branches:
      - master
      - 20**
      - v20**
  workflow_dispatch:
  workflow_call:

jobs:
  build:

      runs-on: ubuntu-latest

      steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Find component directory
        id: find_component_dir
        run: echo "COMPONENT_DIR=$(find . -type d -name 'META-INF' -exec dirname {} \;)" >> $GITHUB_ENV

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.x'

      - name: Cache + Restore node_modules
        uses: actions/cache@v4
        with:
          path: |
              ${{ env.COMPONENT_DIR }}/.angular
              ${{ env.COMPONENT_DIR }}/node_modules
          key: ${{ runner.os }}-node_modules-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node_modules-

      - name: Install and run the vitest component tests
        working-directory: ${{ env.COMPONENT_DIR }}
        run: |
          npm install
          npm run test
```

Key differences from the old Cypress workflow:
- No `~/.cache` in cache paths (Cypress binary cache no longer needed)
- `npm run test` instead of `npm run cy:run`
- No screenshot upload artifact step (Vitest doesn't produce screenshots)
- No Chrome/browser dependency needed (tests run in jsdom on Node.js)

---

## Execution strategy

When converting `all` components, process them in this order (simplest first):

1. `spinner` — simple form component, good to validate the setup (DONE)
2. `textfieldgroup` — simple UI component
3. `imagelabel` — simple display component
4. `youtubevideoembedder` — simple embed
5. `collapse` — basic interaction
6. `gauge` — canvas-based (may need browser mode)
7. `slider` — third-party lib integration
8. `fileupload` — form interaction
9. `multifileupload` — complex upload UI
10. `select2tokenizer` — third-party lib integration
11. `lightboxgallery` — overlay/modal
12. `htmlarea` — TinyMCE integration (may need special mocking)
13. `splitpane` — resize interactions
14. `treeview` — tree component
15. `dbtreeview` — tree with data binding
16. `sidenav` — most complex component

This order ensures quick wins early to validate the setup, with complex components last.

## Important notes & lessons learned

- **This is a library project.** The `@angular/build:unit-test` builder needs a `buildTarget`
  pointing to an application (`dummy:build`). This is how Angular CLI handles library testing.
- **jsdom is usually sufficient.** Most component tests check DOM state and events — they
  don't need real CSS rendering. Only use `--browsers` for layout-dependent tests.
- **DO NOT import `ServoyExtraComponentsModule` in tests.** It pulls in all dependencies
  including `@servoy/ngx-lightbox` → `ngx-filesaver` → `file-saver` (CommonJS). Even with
  `deps.inline` in vitest config, the module resolution is fragile. Instead, declare only
  the component under test.
- **DO NOT use a WrapperComponent.** It causes "not a known element" errors because
  `standalone: false` components need to be in the same NgModule as the wrapper, and
  you can't double-declare them. Use direct `TestBed.createComponent(TheComponent)` instead.
- **Use `fixture.componentRef.setInput('name', value)`** to set signal inputs. This is
  the Angular-approved way to set inputs programmatically in tests.
- **Use `NO_ERRORS_SCHEMA`** to suppress unknown element/attribute warnings from child
  directives (like `[sabloTabseq]`, `[svyTooltip]`) that come from `ServoyPublicModule`.
- **`ServoyPublicTestingModule`** provides mock Servoy services. Always import it.
- **`file-saver` CommonJS issue:** `@servoy/ngx-lightbox` depends on `ngx-filesaver` which
  does `import { saveAs } from 'file-saver'`. This fails in ESM/Vitest. The `vitest-base.config.ts`
  has `deps.inline` to handle this, but the safest approach is to not import modules that
  transitively pull in `@servoy/ngx-lightbox` (i.e., avoid `ServoyExtraComponentsModule`).
- **The `.spec` JSON files are NOT test files.** Don't confuse Servoy `.spec` files with
  test `.spec.ts` files. The Vitest include pattern `**/*.spec.ts` only matches TypeScript files.
- **Tooltip testing:** The `[svyTooltip]` directive uses delayed DOM manipulation that doesn't
  work in jsdom. Test that the tooltip value is set on the component rather than checking
  DOM rendering.
- **Focus/blur in jsdom:** `.click()` doesn't trigger focus events. Dispatch `FocusEvent`
  directly to test focus handlers.
- **Outputs use `.subscribe()`:** Since `output()` returns an `OutputEmitterRef`, use
  `component.outputName.subscribe(spy)` to listen for emissions.

## Reference: Working spinner test

See `projects/servoyextracomponents/src/spinner/spinner.spec.ts` for the proven pattern
that passes all 14 tests.
