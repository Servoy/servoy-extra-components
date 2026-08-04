---
name: spec-sync
description: "Use when the user wants to verify that Servoy .spec JSON files and Angular component implementations are in sync. Checks that model properties, handlers, and API methods match between the two layers. Triggered by 'spec sync', 'check sync', 'verify spec', or 'are specs in sync'."
---

# Spec Sync Checker

You are a **sync verification agent** for the Servoy Extra Components project. Your job is to
compare the Servoy `.spec` JSON files (Layer 1) with the Angular component implementations
(Layer 2) and report any mismatches.

## Input

The user provides either:
- A specific component name (e.g., `sidenav`, `slider`)
- The word `all` to check every component

## Process

### Step 1 — Identify components to check

If a specific component is given, use that. If `all`, enumerate components by listing
directories under `components/projects/servoyextracomponents/src/` that also have a
matching directory under `components/` with a `.spec` file.

Known components: collapse, dbtreeview, fileupload, gauge, htmlarea, imagelabel,
lightboxgallery, multifileupload, select2tokenizer, sidenav, slider, spinner,
splitpane, table, textfieldgroup, treeview, youtubevideoembedder

### Step 2 — For each component, read both layers

1. **Spec file:** `components/<name>/<name>.spec` — parse the JSON
2. **Angular file:** `components/projects/servoyextracomponents/src/<name>/<name>.ts`

### Step 3 — Extract and compare

From the `.spec` JSON, extract:
- **Model properties:** all keys under `"model"` — note their types and defaults
- **Handlers:** all keys under `"handlers"` — note parameter names/types and return types
- **API methods:** all keys under `"api"` — note parameter names/types and return types

From the Angular `.ts` file, extract:
- **Inputs:** all `input<T>()` declarations (signal-based) or `@Input()` (legacy)
- **Handlers as inputs:** handler-style inputs like `readonly onAction = input<(...) => ...>()`
- **API methods:** public methods decorated or referenced as API (typically methods that match
  spec API names)
- **Outputs:** `output<T>()` declarations that correspond to pushToServer properties

### Step 4 — Report mismatches

For each component, report:

| Category | Issue type | Details |
|----------|-----------|---------|
| **Missing in Angular** | Model property in spec but no corresponding input in TS | Property name, spec type |
| **Missing in Spec** | Input in TS but no corresponding model property in spec | Input name |
| **Handler mismatch** | Handler in spec but missing/different signature in TS | Handler name, expected params |
| **API mismatch** | API method in spec but missing/different signature in TS | Method name, expected params |
| **Type mismatch** | Property exists in both but types are clearly incompatible | Property, spec type vs TS type |

### Step 5 — Ignore list

The following are framework-managed and should NOT be flagged as mismatches:
- `size`, `location`, `visible` — managed by ServoyBaseComponent
- Properties with `"tags": { "scope": "private" }` that have a corresponding signal + output
  pattern (e.g., `selectedIndex` with `selectedIndexChange` output) are valid
- `enabled` with type `"enabled"` maps to `input<boolean>()` — this is valid
- `tabSeq` with type `"tabseq"` — managed by framework, may or may not have a TS input

### Step 6 — Output format

Present results as a summary table per component:

```
## <ComponentName> — [IN SYNC | X issues found]

| Issue | Category | Spec | Angular |
|-------|----------|------|---------|
| ...   | ...      | ...  | ...     |
```

If checking all components, start with an overview:
```
## Summary
- X/Y components fully in sync
- Components with issues: <list>
```

Then detail only the components with issues.

### Step 7 — Optional fix mode

After reporting, ask the user:
- Header: "Fix mismatches?"
- Options:
  - "Auto-fix Angular" — add missing inputs/methods to the Angular component
  - "Auto-fix Spec" — add missing properties to the .spec file
  - "Show details only" — no changes, just the report
  - "Fix specific component" — pick one component to fix

When auto-fixing Angular:
- Add missing `input<T>()` declarations following the signal-based pattern
- Add missing handler inputs with proper function signature
- Add missing API method stubs
- Run `npm run build` to verify, then `npx ng lint`

When auto-fixing Spec:
- Add missing model properties with appropriate Servoy types
- Add missing handlers/API entries
- Maintain existing JSON formatting style

## Important notes

- The `.spec` file is the **source of truth** for the Servoy contract. The Angular
  implementation must satisfy it.
- Some Angular components have extra internal signals/properties that are NOT in the spec
  (e.g., `_selectedIndex`, `realContainedForm`). These are implementation details and
  should NOT be flagged.
- Properties with `pushToServer: "allow"` or `"deep"` that also have a `Change` output
  (e.g., `open` + `openChange`) are a valid pattern for two-way binding.
- Handler inputs in Angular use the pattern: `readonly onX = input<((params) => Promise<T>) | undefined>(undefined)`
