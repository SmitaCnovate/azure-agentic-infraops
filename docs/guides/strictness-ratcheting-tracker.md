# Strictness Ratcheting Tracker

> **Goal**: Upgrade all artifact validation from `relaxed` to `standard` strictness
>
> **Status**: 🔄 **IN PROGRESS** - 4 artifacts at standard, 8 artifacts at relaxed

## Strictness Configuration

The artifact template validator uses per-artifact strictness:

| Artifact Category  | Artifacts                                                                                                                                     | Strictness | Status      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| Core (established) | `01-requirements`, `04-implementation-plan`, `06-deployment-summary`, `04-governance-constraints`                                             | `standard` | ✅ Complete |
| Legacy artifacts   | `02-architecture-assessment`                                                                                                                  | `relaxed`  | ⏳ Pending  |
| Wave 2 (05)        | `05-implementation-reference`                                                                                                                 | `relaxed`  | ⏳ Pending  |
| Wave 2 (07-\*)     | `07-design-document`, `07-operations-runbook`, `07-resource-inventory`, `07-backup-dr-plan`, `07-compliance-matrix`, `07-documentation-index` | `relaxed`  | ⏳ Pending  |

Override with environment variable: `STRICTNESS=standard npm run lint:artifact-templates`

## Ratcheting Plan

### Phase 1: Established Core Artifacts ✅ Complete

- [x] `01-requirements.md` - standard
- [x] `04-implementation-plan.md` - standard
- [x] `06-deployment-summary.md` - standard

### Phase 2: Newly Templatized Artifacts ✅ Partial

- [ ] `02-architecture-assessment.md` - relaxed → standard
  - [ ] Update ecommerce artifact to match template (legacy v3.0 format)
  - [ ] Upgrade strictness
- [x] `04-governance-constraints.md` - relaxed → **standard** ✅
  - [x] Update static-webapp artifact to match template
  - [x] Update simple-web-api artifact to match template
  - [x] Upgrade strictness

### Phase 3: Implementation Reference ⏳ Pending

- [ ] `05-implementation-reference.md` - relaxed → standard
  - [ ] Regenerate static-webapp artifact
  - [ ] Regenerate ecommerce artifact
  - [ ] Upgrade strictness

### Phase 4: Workload Documentation ⏳ Pending

- [ ] `07-design-document.md` - relaxed → standard
- [ ] `07-operations-runbook.md` - relaxed → standard
- [ ] `07-resource-inventory.md` - relaxed → standard
- [ ] `07-backup-dr-plan.md` - relaxed → standard
- [ ] `07-compliance-matrix.md` - relaxed → standard
- [ ] `07-documentation-index.md` - relaxed → standard

## History

### v3.8.0 - Core Artifacts (2026-01-13)

| Check    | Result   |
| -------- | -------- |
| Failures | 0        |
| Warnings | 0        |
| Mode     | standard |

### v3.8.1 - Generalized Validation (2026-01-14)

- Expanded from 4 core artifacts to 12 total
- Added per-artifact strictness configuration
- Created 8 new templates for Wave 2 artifacts
- Renamed `validate-wave1-artifacts.mjs` → `validate-artifact-templates.mjs`
- Moved `02-architecture-assessment` and `04-governance-constraints` to relaxed
  (existing artifacts predate templates)

---

_Last updated: 2026-01-14 (branch: chore/generalize-artifact-validation)_
