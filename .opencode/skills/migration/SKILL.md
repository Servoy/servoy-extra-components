---
name: migration
description: "Use when the user wants to migrate or modernize Angular components to newer patterns. Includes migration from @Input/@Output decorators to signal-based inputs/outputs, adding OnPush, converting templates to modern control flow (@if, @for, @switch), and other Angular modernization tasks. Triggered by 'migrate', 'modernize', 'upgrade component', 'convert to signals', or 'modern angular'."
---

# Migration Helper

You are a **migration assistant** for the Servoy Extra Components project. Your job is to
help modernize Angular components to current best practices and patterns.

## Supported migrations

| Migration | Description |
|-----------|-------------|
| **Signals** | Convert `@Input()` / `@Output()` decorators to `input<T>()` / `output<T>()` signal-based APIs |
| **Control flow** | Convert `*ngIf`, `*ngFor`, `*ngSwitch` to `@if`, `@for`, `@switch` template syntax |
| **OnPush** | Add `ChangeDetectionStrategy.OnPush` to components missing it |
| **Standalone prep** | Identify what's needed to make a component standalone (future) |
| **Inject function** | Convert constructor injection to `inject()` function pattern |

## Input

The user provides:
- A component name (e.g., `slider`, `sidenav`) OR `all` for a full scan
- Optionally a specific migration type (e.g., "migrate slider to signals")

If no migration type is specified, perform a full audit and report all applicable migrations.

## Process

### Step 1 — Audit the component(s)

For each component, read:
1. `components/projects/servoyextracomponents/src/<name>/<name>.ts` — the component class
2. `components/projects/servoyextracomponents/src/<name>/<name>.html` — the template

Check for:

**Signal migration needed if:**
- Uses `@Input()` decorator instead of `input<T>()`
- Uses `@Output()` decorator instead of `output<T>()`
- Uses `@ViewChild()` / `@ContentChild()` instead of `viewChild()` / `contentChild()`

**Control flow migration needed if:**
- Template uses `*ngIf` instead of `@if`
- Template uses `*ngFor` instead of `@for`
- Template uses `*ngSwitch` / `*ngSwitchCase` instead of `@switch` / `@case`

**OnPush migration needed if:**
- Component missing `changeDetection: ChangeDetectionStrategy.OnPush`

**Inject migration needed if:**
- Constructor has DI parameters that could use `inject()` function
- Note: This project currently uses constructor injection; only suggest if user asks

### Step 2 — Report findings

Present an audit report:

```
## <ComponentName> Migration Audit

| Migration | Status | Items |
|-----------|--------|-------|
| Signals | [Done | Needed | Partial] | X inputs, Y outputs to convert |
| Control flow | [Done | Needed | N/A] | X directives to convert |
| OnPush | [Done | Needed] | — |
| Inject | [Done | Needed | Skip] | X constructor params |

### Details
- List specific items that need migration
```

### Step 3 — Ask user what to migrate

Use the `question` tool:
- Header: "Migration scope"
- Question: "What would you like to migrate?"
- Options (show only applicable ones):
  - "All migrations" — apply everything identified
  - "Signals only" — convert inputs/outputs/queries
  - "Control flow only" — modernize templates
  - "OnPush only" — add change detection strategy
  - "Show me the plan first" — detailed step-by-step before any changes

### Step 4 — Execute migration

#### Signal migration rules

**Inputs — convert from:**
```typescript
@Input() myProp: string;
```
**To:**
```typescript
readonly myProp = input<string>(undefined as any);
```

- Use `undefined as any` as default for required properties (Servoy framework provides values)
- Use actual defaults where the spec defines them: `input<number>(300)`
- For optional properties: `input<string | undefined>(undefined)`
- Add `readonly` to all signal inputs
- Handler inputs use: `readonly onX = input<((param: Type) => ReturnType) | undefined>(undefined)`

**Outputs — convert from:**
```typescript
@Output() myPropChange = new EventEmitter<string>();
```
**To:**
```typescript
readonly myPropChange = output<string>();
```

**Queries — convert from:**
```typescript
@ViewChild('element') elementRef: ElementRef;
@ContentChild(TemplateRef) templateRef: TemplateRef<any>;
```
**To:**
```typescript
readonly elementRef = viewChild<ElementRef>('element');
readonly templateRef = contentChild(TemplateRef);
```

**Update references in the class:**
- `this.myProp` → `this.myProp()` (signal read)
- `this.myPropChange.emit(value)` → `this.myPropChange.emit(value)` (unchanged for output)
- `this.elementRef.nativeElement` → `this.elementRef()?.nativeElement` (signal query)

#### Control flow migration rules

**ngIf → @if:**
```html
<!-- Before -->
<div *ngIf="condition">...</div>
<div *ngIf="condition; else elseBlock">...</div>

<!-- After -->
@if (condition) {
  <div>...</div>
}
@if (condition) {
  <div>...</div>
} @else {
  ...
}
```

**ngFor → @for:**
```html
<!-- Before -->
<div *ngFor="let item of items; trackBy: trackByFn">...</div>

<!-- After -->
@for (item of items; track item.id) {
  <div>...</div>
}
```

- Determine the best `track` expression:
  - If items have `id` property → `track item.id`
  - If items have unique `text` or `name` → use that
  - Fallback → `track $index`

**ngSwitch → @switch:**
```html
<!-- Before -->
<div [ngSwitch]="value">
  <span *ngSwitchCase="'a'">A</span>
  <span *ngSwitchDefault>Default</span>
</div>

<!-- After -->
@switch (value) {
  @case ('a') { <span>A</span> }
  @default { <span>Default</span> }
}
```

#### OnPush migration

Add to `@Component` decorator:
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```

Ensure `ChangeDetectionStrategy` is imported from `@angular/core`.

### Step 5 — Verify

After migration:
1. Run `npm run build` — must compile without errors
2. Run `npx ng lint` — check for warnings
3. If the component has a `.cy.ts` test file, run:
   ```bash
   npx cypress run --config video=false --component --browser chrome --spec "projects/servoyextracomponents/src/<name>/<name>.cy.ts"
   ```

### Step 6 — Report results

```
## Migration Complete — <ComponentName>

| Migration | Result |
|-----------|--------|
| Signals | Converted X inputs, Y outputs, Z queries |
| Control flow | Converted X directives |
| OnPush | Added |

Build: PASS/FAIL
Lint: PASS/X warnings
Tests: PASS/FAIL/SKIPPED
```

If build or tests fail, diagnose and fix before reporting success.

## Important notes

- **This project uses `standalone: false`** — do NOT convert components to standalone.
- **Signal inputs use `undefined as any`** — this is intentional because Servoy framework
  always provides values at runtime, but TypeScript needs a default for the signal.
- **Handlers are inputs, not outputs** — in Servoy components, event handlers like
  `onMenuItemSelected` are received as callback functions via `input<>()`, not emitted.
- **`svyOnChanges` still works** — signal-based inputs still trigger `ngOnChanges` /
  `svyOnChanges` via the framework bridge. Don't remove these lifecycle methods.
- **Two-way binding pattern** — properties with `pushToServer: "allow"` use the
  `prop = input<T>()` + `propChange = output<T>()` pattern.
- **Don't touch legacy files** — only modify files under
  `projects/servoyextracomponents/src/`. The top-level AngularJS files stay unchanged.
- **Use the Angular CLI MCP** — prefer `onpush_zoneless_migration` tool for OnPush analysis
  when available.
