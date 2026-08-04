# AGENTS.md — Servoy Extra Components

## Project overview

This repository contains the **Servoy Extra Components** package — a set of specialized
Angular UI components for the Servoy NGClient runtime. Components are built as an
Angular library and deployed as a Servoy web package (`.zip`).

**Repository:** https://github.com/Servoy/servoy-extra-components
**Package name:** `@servoy/servoyextracomponents`
**Current version:** 2026.6.0

## Technology stack

| Aspect | Value |
|--------|-------|
| Angular | 22.0.8 |
| TypeScript | 6.0.3 |
| Build system | Angular CLI + ng-packagr 22.1.0 |
| Test framework | Vitest (via @angular/build:unit-test) |
| Linting | ESLint 10.x (@angular-eslint + @typescript-eslint) |
| Node package manager | npm |
| Servoy framework | @servoy/public 2026.3.0 |

## Working directory

All npm/ng commands must be run from the `components/` directory:
```
cd components
```

## Build commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build (`ng build --configuration production @servoy/servoyextracomponents`) |
| `npm run build_debug` | Build with file watching |
| `npm run build_debug_nowatch` | Build without watch (useful for one-shot verification) |
| `npm run make_release` | Production build + package into `servoyextra.zip` |

## Lint & typecheck

```bash
npx ng lint
```

This runs ESLint with the Angular and TypeScript plugins. All rules emit warnings
(via `eslint-plugin-only-warn`), but warnings should still be addressed.

The build (`npm run build`) performs full TypeScript type checking via ng-packagr.
A successful build confirms type correctness.

## Testing

| Command | Purpose |
|---------|---------|
| `npm run test` | Run all Vitest component tests (single run) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI for interactive test execution |

Run a specific component's tests:
```bash
npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/<component>/<component>.spec.ts"
```

### Test conventions
- Framework: Vitest (via `@angular/build:unit-test`)
- Config: `angular.json` test target + `vitest-base.config.ts`
- Pattern: `**/*.spec.ts`
- Each component has a test file alongside its implementation
- Tests use direct `TestBed.createComponent(TheComponent)` pattern
- Use `fixture.componentRef.setInput('name', value)` for signal inputs
- Use `NO_ERRORS_SCHEMA` to suppress unknown directive warnings
- Import `ServoyPublicTestingModule` from `@servoy/public`
- DO NOT import `ServoyExtraComponentsModule` in tests (causes dependency issues)

## Architecture

### Dual-layer component structure

Each component exists in **two layers** that must stay in sync:

**Layer 1 — Servoy Spec** (`components/<name>/`):
- `<name>.spec` — JSON file defining the Servoy component contract (model properties,
  handlers, API methods, custom types). This is NOT a test file.
- `<name>.js` / `<name>.html` / `<name>.css` — Legacy AngularJS implementation
- `<name>_server.js` — Optional server-side scripting
- Icons (`.png`, `@2x.png` variants)

**Layer 2 — Angular Implementation** (`components/projects/servoyextracomponents/src/<name>/`):
- `<name>.ts` — Angular component class
- `<name>.html` — Angular template
- `<name>.spec.ts` — Vitest component test

### Components

collapse, dbtreeview, fileupload, gauge, htmlarea, imagelabel, lightboxgallery,
multifileupload, select2tokenizer, sidenav, slider, spinner, splitpane, table,
textfieldgroup, treeview, youtubevideoembedder

### Angular component conventions

- **Signal-based inputs:** `myProp = input<string>()` — NOT `@Input()`
- **Signal-based outputs:** `onAction = output<Event>()` — NOT `@Output()`
- **Change detection:** `ChangeDetectionStrategy.OnPush` on every component
- **Base class:** Extend `ServoyBaseComponent<HTMLDivElement>` from `@servoy/public`
- **Standalone:** `false` — all components declared in `ServoyExtraComponentsModule`
- **Selector prefix:** `servoyextra-` (kebab-case, enforced by ESLint)
- **Directive selector prefix:** `servoyextra` (camelCase)

### Module registration

When adding a new component:
1. Declare in `servoyextra.module.ts`
2. Export in `public-api.ts`
3. Create Servoy `.spec` file in `components/<name>/`

## Code style

- Single quotes (enforced by `@stylistic/ts/quotes`)
- Max line length: 200 characters
- Brace style: 1TBS (`if (x) {`)
- Static readonly properties: UPPER_CASE
- No component class suffix required (`@angular-eslint/component-class-suffix: off`)
- No console.log in production code
- Use `@servoy/public` utilities and `lodash-es` — don't reinvent

## Key dependencies

| Package | Purpose |
|---------|---------|
| `@servoy/public` | Servoy framework base classes, utilities, API types |
| `@ng-bootstrap/ng-bootstrap` | Bootstrap widgets for Angular |
| `@angular/cdk` | Angular CDK (drag-drop, overlay, etc.) |
| `@ali-hm/angular-tree-component` | Tree component (dbtreeview, treeview) |
| `@angular-slider/ngx-slider` | Slider component |
| `tinymce` / `@tinymce/tinymce-angular` | WYSIWYG editor (htmlarea) |
| `@uppy/*` | File upload suite (multifileupload) |
| `@servoy/canvas-gauges` | Gauge rendering |
| `ng-select2-component` | Token/tag input (select2tokenizer) |
| `angular-resizable-element` | Resizable split panels (splitpane) |
| `@servoy/ngx-lightbox` | Image gallery (lightboxgallery) |

## Project structure

```
servoy-extra-components/
├── AGENTS.md                            # This file
├── README.md                            # Basic setup instructions
├── webpackage.json                      # Servoy package manifest & release history
├── components/                          # Main working directory
│   ├── opencode.json                    # opencode configuration
│   ├── angular.json                     # Angular workspace config
│   ├── package.json                     # npm dependencies & scripts
│   ├── tsconfig.json                    # Root TypeScript config (strict)
│   ├── .eslintrc.json                   # ESLint config
│   ├── vitest-base.config.ts            # Vitest configuration (deps.inline workarounds)
│   ├── scripts/build.js                 # Release packaging (creates .zip)
│   ├── projects/
│   │   ├── servoyextracomponents/       # Angular library
│   │   │   ├── ng-package.json          # ng-packagr config
│   │   │   ├── tsconfig.lib.json        # Library TS config
│   │   │   ├── tsconfig.lib.prod.json   # Production TS config
│   │   │   ├── tsconfig.spec.json       # Test TS config
│   │   │   └── src/
│   │   │       ├── public-api.ts        # Library exports
│   │   │       ├── servoyextra.module.ts # NgModule declarations
│   │   │       ├── testingutils.ts      # Test utilities
│   │   │       └── <component>/         # Angular component implementation
│   │   └── dummy/                       # Dummy app (dev/testing scaffold)
│   ├── <component>/                     # Servoy spec + legacy files (per component)
│   ├── dist/                            # Build output (gitignored)
│   └── node_modules/                    # Dependencies (gitignored)
├── servoyExtraComponentExample/         # Example Servoy solution
└── .opencode/                           # opencode skills & plugins
    ├── skills/sdd/                      # Spec-Driven Development pipeline
    └── plugins/commit-lint.ts           # Commit message validation
```

## Workflow

### Post-edit checklist

After making code changes, always verify:
1. `npm run build` — must compile without errors
2. `npm run lint` — check for lint warnings
3. Run relevant tests: `npm run test` or target a specific component
4. If `package.json` dependencies were changed, verify distribution package is in sync:
   compare `components/package.json` dependencies with
   `components/projects/servoyextracomponents/package.json` peer/dependencies

### Commit message format

```
<JIRA_KEY> <short description> [ai]

- bullet points summarising changes

Co-Authored-By: opencode <noreply@opencode.ai>
```

Example: `SVY-21080 add sidenav collapse animation support [ai]`

### Adding a new component

1. Create the Servoy spec directory: `components/<name>/`
   - `<name>.spec` (JSON component contract)
   - `<name>.js`, `<name>.html`, `<name>.css` (legacy implementation)
   - Icon files (`.png`, `@2x.png`)
2. Create Angular implementation: `components/projects/servoyextracomponents/src/<name>/`
   - `<name>.ts` (component class)
   - `<name>.html` (template)
3. Register in `servoyextra.module.ts` (declarations + exports)
4. Export in `public-api.ts`
5. Create Vitest test: `<name>.spec.ts`
6. Build and verify: `npm run build`

### Modifying a component

When changing component properties, handlers, or API:
1. Update the `.spec` file (JSON contract) in `components/<name>/`
2. Update the Angular component in `projects/servoyextracomponents/src/<name>/`
3. Both layers must stay in sync

## Gotchas

- **`.spec` files are NOT tests.** They're Servoy component specification JSON files.
- **Signal inputs, not decorators.** Use `input<T>()` / `output<T>()`, not `@Input()` / `@Output()`.
- **OnPush everywhere.** All components use `ChangeDetectionStrategy.OnPush`.
- **@servoy/public version coupling.** Must match the target Servoy runtime version.
- **Legacy files still active.** The AngularJS files in top-level dirs are still used by
  older Servoy runtimes. Don't delete them.
- **No standalone components.** All are `standalone: false`, declared in the shared module.
