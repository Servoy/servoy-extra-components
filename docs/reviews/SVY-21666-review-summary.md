# SVY-21666 review summary: select2tokenizer onDataChange not firing on first change

**Risk: MODERATE.** The fix changes only which value is emitted. The real client flow was not run, so the effect on the displayed tokens after a pick is unverified.

**Scope reviewed:** servoy-extra-components, master `f23bf9f` (Fix Version 2026.12 targets master). The same one-line fix on `origin/2025.3` (`7970d4d`) was read for context but is not judged here.

**What changed:** in `updateValue()` of `select2tokenizer.ts`, the scalar branch (numeric, boolean, single value) emits `filteredDataProviderId()[length - 1]` instead of `[0]`. With a pre-set value, the widget reports `[1, 3]` after a pick. The old code emitted `1`, which the server already had, so `onDataChange` never fired.

## Manual test plan

**Verifying the fix**
1. Open `select2Tokenizer_smp.servoy` in a Servoy developer built from master. Use a numeric column with a valuelist, pre-set on `onShow`, and an `onDataChange` handler that logs.
2. Pick a different value. `onDataChange` should fire once with the new value, and the dataprovider should equal the picked value.
3. Note whether the field then shows one token or two.

**Regression checks**
1. TEXT dataprovider with a multi-value valuelist: picks are still `\n`-joined and fire `onDataChange`.
2. Empty numeric dataprovider: the first pick fires `onDataChange`.
3. Numeric dataprovider, remove the only token: it becomes `null` and `onDataChange` fires.
4. `closeOnSelect = false` and `maximumSelectionSize > 1` with a numeric dataprovider: pick two values in a row and watch the tokens and handler calls.
5. `onDataChange` returning false after a pick: the field and the dataprovider stay consistent.
6. Boolean dataprovider, if available (no test reaches `isTypeBoolean()`).

Automated, from `components/`: `npx ng test @servoy/servoyextracomponents --no-watch --include "projects/servoyextracomponents/src/select2tokenizer/select2tokenizer.spec.ts"`. During the review, 41 tests passed. With the line reverted to `[0]`, 2 failed (numeric pre-set and boolean).

## Possible improvements / follow-ups
- **Token display after a pick (unverified):** `updateValue()` stores the full list (`[1, 3]`) as the tokens. Only `setFilteredDataProviderId()` rebuilds them, and it runs only when the `dataProviderID` input changes. If the server does not echo the value back, the field may keep showing two tokens. The 2021 code (`6b7f5e4`) collapsed to a single token.
- **`onDataChange` frequency:** it now fires on every additional pick when a numeric value is pre-set, where before it did not fire at all. Check that this is intended for `maximumSelectionSize > 1` or `closeOnSelect = false`.
- **Tests:** all four master tests set `userChangedValue = true` by hand and call `updateValue()` directly. The "boolean" test sets `format.type = 'INTEGER'`, so it never reaches `isTypeBoolean()`.
- **Commit message accuracy:** both commits say "restoring the pre-signals-refactor semantics". The newest-to-oldest change was made earlier, in `1dc19d5` (SVYX-765, 2024-01). The master message also calls the change "hardening", but it fixes the same bug.
- **Docs drift:** `.opencode/sdd/project-context.md` still says Cypress. Master uses Vitest, as `AGENTS.md` says.
- **Not verified:** the attached sample was not run, and whether the server echoes the dataprovider back is unknown.
