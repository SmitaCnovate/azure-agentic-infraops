# Strictness Ratcheting Tracker

> **Goal**: Upgrade validation from `STRICTNESS=relaxed` to `STRICTNESS=standard`
>
> **Trigger**: After 2 successful artifact regenerations with agents

## Current Status

- [x] Regeneration #1: `simple-web-api` (2025-01-13) - Commit: `08be373`
- [ ] Regeneration #2: Next project TBD
- [ ] Switch to `STRICTNESS=standard`

## Files to Update

When the 2nd regeneration is complete:

1. **`.husky/pre-commit`**

   - Change `STRICTNESS=relaxed` to `STRICTNESS=standard`

2. **`.github/workflows/wave1-artifact-drift-guard.yml`**
   - Remove the ratchet comment
   - Change `STRICTNESS: relaxed` to `STRICTNESS: standard`

## Validation Results History

### Regeneration #1: simple-web-api

| Check    | Result  |
| -------- | ------- |
| Failures | 0       |
| Warnings | 12      |
| Mode     | relaxed |

Warnings are expected for governance constraints schema differences
and optional attribution fields.

---

_Created by agent template compliance fix (branch: chore/templatize-artifacts)_
