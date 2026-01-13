# Simple Web API - Phase 2 Template Validation

**Purpose**: Validate Wave 1 artifact templates with a minimal greenfield project.

**Status**: 🔄 In Progress

## Project Overview

A simple web API demonstrating Azure Static Web Apps, Functions, and Cosmos DB integration.

**Budget**: $100/month  
**Region**: swedencentral  
**Compliance**: None (simplifies testing)

## Artifacts

| Artifact                       | Status         | Notes                         |
| ------------------------------ | -------------- | ----------------------------- |
| 01-requirements.md             | ✅ Complete    | Generated via @plan           |
| 02-architecture-assessment.md  | ✅ Complete    | Via azure-principal-architect |
| 03-des-cost-estimate.md        | ✅ Complete    | Design phase cost estimate    |
| 03-des-diagram.py              | ✅ Complete    | Architecture diagram (Python) |
| 03-des-diagram.png             | ✅ Complete    | Architecture diagram (PNG)    |
| 04-governance-constraints.md   | ✅ Complete    | Azure Policy discovery        |
| 04-governance-constraints.json | ✅ Complete    | Machine-readable constraints  |
| 04-implementation-plan.md      | ✅ Complete    | Via bicep-plan                |
| 06-deployment-summary.md       | ⏸️ Not started | Manual/simulated              |

## Validation Results

**Automated validation** runs on every commit to ensure template compliance.

### Run Validation Locally

```bash
# Project-specific validation
npm run validate:simple-web-api

# Repository-wide Wave 1 validation
npm run lint:wave1-artifacts

# Markdown linting
npm run lint:md
```

### GitHub Actions

- ✅ **validate-simple-web-api.yml** - Runs on PR/push
- ✅ **wave1-artifact-drift-guard.yml** - Template synchronization

### Validation Coverage

| Category               | Status |
| ---------------------- | ------ |
| File existence         | ✅     |
| H2 heading structure   | ✅     |
| Diagram generation     | ✅     |
| Governance constraints | ✅     |
| Agent attribution      | ✅     |

**📖 Full validation guide**: [VALIDATION.md](VALIDATION.md)

**Expected**: ✅ No drift warnings, all invariant H2 sections present

---

_Phase 2 validation for Wave 1 templatization system_
