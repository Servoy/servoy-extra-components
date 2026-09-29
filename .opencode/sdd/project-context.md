# Project Context — Servoy Extra Components (Angular)

This project is the **Servoy Extra Components** package — a set of specialized Angular
UI components for the Servoy NGClient runtime. It is built as an Angular library using
ng-packagr and deployed as a Servoy web package.

## Technology stack

| Aspect | Value |
|--------|-------|
| Angular version | 22.0.8 |
| TypeScript version | 6.0.3 |
| Build system | Angular CLI + ng-packagr 22.1.0 |
| Test framework | Cypress 15.x (component testing) |
| Linting | ESLint 10.x with @angular-eslint + @typescript-eslint |
| Module system | ES modules (moduleResolution: "bundler") |
| Package name | @servoy/servoyextracomponents |
| Version | 2026.6.0 |

## Architecture: Dual-Layer Component Structure

Each component exists in **two layers**:

### Layer 1: Servoy Component Spec (`components/<name>/`)
Top-level directories contain the **Servoy spec definition** and legacy assets:

| File | Purpose |
|------|---------|
| `<name>.spec` | Servoy component specification (JSON) — defines name, model properties, handlers, API methods, types |
| `<name>.js` | Legacy AngularJS client-side code |
| `<name>.html` | Legacy AngularJS template |
| `<name>.css` | Component styles |
| `<name>_server.js` | Server-side scripting (optional) |

### Layer 2: Angular Library (`components/projects/servoyextracomponents/src/<name>/`)
The modern Angular implementations:

| File | Purpose |
|------|---------|
| `<name>.ts` | Angular component class |
| `<name>.html` | Angular template |
| `<name>.cy.ts` | Cypress component test |

## Angular Component Pattern

Components follow these conventions:
- **Signal-based inputs** (`input<T>()`) and `output<T>()`
- **ChangeDetectionStrategy.OnPush**
- Extend `ServoyBaseComponent<HTMLDivElement>` from `@servoy/public`
- `standalone: false` — declared in `ServoyExtraComponentsModule`
- Selector prefix: `servoyextra-` (kebab-case, enforced by ESLint)
- Directive selector prefix: `servoyextra` (camelCase)

## Key project structure

```
servoy-extra-components/
├── components/                          # Main working directory
│   ├── angular.json                     # Angular workspace config
│   ├── package.json                     # Dependencies & scripts
│   ├── tsconfig.json                    # Root TypeScript config
│   ├── .eslintrc.json                   # ESLint config
│   ├── cypress.config.ts                # Cypress component testing config
│   ├── projects/
│   │   ├── servoyextracomponents/       # Angular library project
│   │   │   ├── ng-package.json
│   │   │   ├── src/
│   │   │   │   ├── public-api.ts        # Library exports
│   │   │   │   ├── servoyextra.module.ts # NgModule declarations
│   │   │   │   ├── testingutils.ts      # Test utilities
│   │   │   │   └── <component>/         # Per-component directory
│   │   └── dummy/                       # Dummy app for dev/testing
│   ├── <component>/                     # Servoy spec + legacy files per component
│   ├── cypress/support/                 # Cypress support files
│   └── scripts/build.js                 # Release packaging script
├── webpackage.json                      # Servoy package manifest
└── README.md
```

## Components in this package

collapse, dbtreeview, fileupload, gauge, htmlarea, imagelabel, lightboxgallery,
multifileupload, select2tokenizer, sidenav, slider, spinner, splitpane, table,
textfieldgroup, treeview, youtubevideoembedder

## Key dependencies

| Package | Purpose |
|---------|---------|
| `@servoy/public` | Servoy framework base classes and utilities |
| `@ng-bootstrap/ng-bootstrap` | Bootstrap widgets for Angular |
| `@angular/cdk` | Angular CDK utilities |
| `@ali-hm/angular-tree-component` | Tree component library |
| `@angular-slider/ngx-slider` | Slider component |
| `tinymce` / `@tinymce/tinymce-angular` | WYSIWYG editor (htmlarea) |
| `@uppy/*` | File upload (multifileupload) |
| `@servoy/canvas-gauges` | Gauge rendering |
| `ng-select2-component` | Select2 tokenizer |
| `angular-resizable-element` | Resizable panels (splitpane) |

## Build commands

| Command | Action |
|---------|--------|
| `npm run build` | Production build of the library |
| `npm run build_debug` | Build with watch mode |
| `npm run make_release` | Build + package into servoyextra.zip |

## Testing

- **Framework:** Cypress 15.x component testing
- **Commands:** `npm run cy:open` (interactive) / `npm run cy:run` (headless Chrome)
- **Pattern:** Each component has a `<name>.cy.ts` file alongside its implementation
- **Test utilities:** `testingutils.ts` provides `ServoyPublicTestingModule` and helpers
- Tests use a `WrapperComponent` pattern with signal-based properties

## Linting

- ESLint with `eslint:recommended`, `@typescript-eslint/recommended`, `@angular-eslint/recommended`
- All rules emit warnings (uses `eslint-plugin-only-warn`)
- Single quotes, max 200 char lines, 1TBS brace style
- Run: `npx ng lint` from the `components/` directory

## TypeScript strictness

- `strict: true`
- `strictTemplates: true` (Angular)
- `strictInjectionParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

## Code conventions

- Follow existing patterns in neighboring components — consistency over personal preference
- Use the `@servoy/public` base classes and utilities — never reinvent what's already provided
- Component selectors must use the `servoyextra-` prefix
- No console.log in production code
- Prefer existing utility functions from `@servoy/public` and `lodash-es`
- Always update `public-api.ts` when adding new exports
- Always update `servoyextra.module.ts` when adding new components/directives

## Gotchas

- **The .spec file is NOT a test file.** It's the Servoy component specification (JSON)
  that defines the component's contract — model properties, handlers, API methods, types.
  Changes to the component contract REQUIRE updating this file.

- **Dual-layer sync:** When changing component properties or API, both the `.spec` file
  (Layer 1) and the Angular component (Layer 2) must be updated in sync.

- **ng-packagr secondary entry points:** The library is built with ng-packagr. If adding
  a new component, it must be declared in `servoyextra.module.ts` and exported in
  `public-api.ts`.

- **@servoy/public version coupling:** This package is tightly coupled to a specific
  Servoy platform version. The `@servoy/public` version must match the target Servoy
  runtime version.

- **Legacy AngularJS files still exist:** The `.js` and `.html` files in the top-level
  component directories are legacy AngularJS implementations kept for older Servoy
  runtime compatibility. New features should focus on the Angular implementation in
  `projects/servoyextracomponents/src/`.

- **Signal-based inputs:** Components use Angular's new signal-based input/output API
  (`input<T>()`, `output<T>()`). Do NOT use the legacy `@Input()` / `@Output()` decorators.

- **OnPush change detection:** All components use `ChangeDetectionStrategy.OnPush`.
  Ensure proper change detection triggering when modifying state.
