# Validating Agent Output in `simple-web-api`

> **Branch**: `chore/templatize-artifacts`  
> **Purpose**: Validate that agents use templates correctly and produce compliant artifacts

---

## Overview

The `simple-web-api` project serves as a validation case for Wave 1 artifact templates.
This document explains how to automatically validate agent output to ensure template compliance.

## Validation Levels

### 1. Project-Specific Validation

**Command**: `npm run validate:simple-web-api`

Validates the `agent-output/simple-web-api` directory for:

| Check Category         | What It Validates                                          |
| ---------------------- | ---------------------------------------------------------- |
| File Existence         | All expected artifacts are present                         |
| Heading Structure      | Required H2 headings present and in correct order          |
| Diagram Generation     | Python script exists, contains `show=False`, PNG generated |
| Governance Constraints | JSON + Markdown format, required sections                  |
| Agent Attribution      | Metadata includes agent name and date                      |

**Expected Artifacts:**

```
agent-output/simple-web-api/
├── 01-requirements.md                  # @plan
├── 02-architecture-assessment.md       # azure-principal-architect
├── 03-des-cost-estimate.md             # azure-principal-architect
├── 03-des-diagram.py                   # diagram-generator
├── 03-des-diagram.png                  # diagram-generator (auto-generated)
├── 04-governance-constraints.md        # bicep-plan
├── 04-governance-constraints.json      # bicep-plan
└── 04-implementation-plan.md           # bicep-plan
```

### 2. Repository-Wide Validation

**Command**: `npm run lint:wave1-artifacts`

Validates **all** Wave 1 artifacts across the entire repository:

- Template structure correctness
- Agent → template references
- No embedded skeletons in agent definitions
- Artifact compliance in all `agent-output/*/` directories

**Strictness Modes:**

| Mode       | Behavior                                   | Use Case        |
| ---------- | ------------------------------------------ | --------------- |
| `relaxed`  | Warns on issues, only fails on hard errors | Development     |
| `standard` | Fails on any non-compliance                | Pre-merge gates |

Set via environment variable:

```bash
STRICTNESS=standard npm run lint:wave1-artifacts
```

---

## Running Validations Locally

### Quick Check (Project-Specific)

```bash
# From repository root
npm run validate:simple-web-api
```

**Output Example:**

```
🔍 Validating agent output: agent-output/simple-web-api

📋 Step 1: Checking file existence
✅ 01-requirements.md exists
✅ 02-architecture-assessment.md exists
...

📐 Step 2: Validating heading structure
✅ 01-requirements.md - All required headings present and in correct order
❌ 02-architecture-assessment.md - Missing required headings: '## Approval Gate'
...

✅ Passed: 14
⚠️  Warnings: 2
❌ Failed: 1
```

### Full Repository Check

```bash
npm run lint:wave1-artifacts
```

### Markdown Linting

```bash
# Check markdown syntax
npm run lint:md

# Auto-fix markdown issues
npm run lint:md:fix
```

### Combined Validation

```bash
# Run all validation checks
npm run lint:md && \
npm run validate:simple-web-api && \
npm run lint:wave1-artifacts
```

---

## GitHub Actions Integration

### Workflow: `validate-simple-web-api.yml`

**Triggers:**

- ✅ Push to `chore/templatize-artifacts` branch
- ✅ Pull requests to `chore/templatize-artifacts` or `main`
- ✅ Changes to `agent-output/simple-web-api/**`
- ✅ Changes to templates or agents
- ✅ Manual trigger (`workflow_dispatch`)

**What It Does:**

1. Runs `validate:simple-web-api` script
2. Runs `lint:wave1-artifacts` (relaxed mode)
3. Posts PR comment with results
4. **Blocks merge** if validation fails

**PR Comment Example:**

```markdown
## ✅ Agent Output Validation: PASSED

### simple-web-api Project: ✅ PASSED

**Template compliance check for `agent-output/simple-web-api`**

- File existence
- Required H2 heading structure
- Diagram generation (Python + PNG)
- Governance constraints format
- Agent attribution metadata

### Wave 1 Artifacts (Overall): ⚠️ WARNINGS

**All Wave 1 artifacts across the repository**

---

✨ All validation checks passed!
```

### Workflow: `wave1-artifact-drift-guard.yml`

**Triggers:**

- ✅ Changes to template files
- ✅ Changes to agent definitions
- ✅ Changes to validation scripts

**Purpose**: Ensures templates and agents remain synchronized.

---

## Validation Rules

### Required H2 Headings

Each artifact type has **mandatory** H2 headings that must appear **in order**:

#### `01-requirements.md`

```markdown
## Project Overview

## Functional Requirements

## Non-Functional Requirements (NFRs)

## Compliance & Security Requirements

## Cost Constraints

## Operational Requirements

## Regional Preferences
```

#### `02-architecture-assessment.md`

```markdown
## Requirements Validation ✅

## Executive Summary

## WAF Pillar Assessment

## Resource SKU Recommendations

## Architecture Decision Summary

## Implementation Handoff

## Approval Gate
```

#### `04-implementation-plan.md`

```markdown
## Overview

## Resource Inventory

## Module Structure

## Implementation Tasks

## Dependency Graph

## Naming Conventions

## Security Configuration

## Estimated Implementation Time

## Approval Gate
```

### Diagram Validation

**03-des-diagram.py** must contain:

```python
from diagrams import Diagram, Cluster, Edge
from diagrams.azure.* import ...

with Diagram("Name", show=False, direction="TB", filename="03-des-diagram"):
    # diagram code
```

Key requirements:

- ✅ `show=False` parameter (enables automatic PNG generation)
- ✅ `filename="03-des-diagram"` (consistent naming)
- ✅ Azure resource imports from `diagrams.azure.*`
- ✅ Corresponding PNG file (`03-des-diagram.png`)

### Governance Constraints

**04-governance-constraints.md** must include:

```markdown
## Active Policy Assignments

## Resource-Specific Constraints

## Compliance Summary
```

**04-governance-constraints.json** must be valid JSON with:

```json
{
  "subscription": { "name": "...", "id": "..." },
  "policies": [...],
  "constraints": {...}
}
```

---

## Common Validation Failures

### ❌ Missing Required Headings

**Error**: `Missing required headings: '## Approval Gate'`

**Fix**: Add the missing H2 heading in the correct position per the template.

**Example**:

```markdown
## Estimated Implementation Time

| Task | Duration |
| ---- | -------- |
| ...  | ...      |

---

## Approval Gate <-- ADD THIS

> **📋 Implementation Plan Ready**
> ...
```

### ❌ Headings Out of Order

**Error**: `Heading '## Dependency Graph' is out of order`

**Fix**: Reorder headings to match template sequence.

**Correct Order** for `04-implementation-plan.md`:

```markdown
## Implementation Tasks

## Dependency Graph <-- Must come after Tasks

## Naming Conventions
```

### ❌ Missing `show=False` in Diagram

**Error**: `Missing 'show=False' parameter (PNG auto-generation)`

**Fix**: Add `show=False` to Diagram constructor:

```python
with Diagram("Architecture", show=False, direction="TB"):
    # ...
```

### ⚠️ Missing Agent Attribution

**Warning**: `Missing agent attribution (expected: bicep-plan)`

**Fix**: Add frontmatter with agent name and date:

```markdown
# Step 4: Implementation Plan - simple-web-api

> Generated by bicep-plan agent | 2026-01-13
> **Confidence Level**: High (serverless architecture, well-defined requirements)
```

---

## Debugging Validation Failures

### Step 1: Run Local Validation

```bash
npm run validate:simple-web-api
```

Review output to identify specific failures.

### Step 2: Compare with Template

```bash
# View template structure
cat .github/templates/04-implementation-plan.template.md

# View your artifact
cat agent-output/simple-web-api/04-implementation-plan.md
```

### Step 3: Check Heading Order

Extract H2 headings:

```bash
grep '^## ' agent-output/simple-web-api/04-implementation-plan.md
```

Compare with expected order in `scripts/validate-simple-web-api.mjs`.

### Step 4: Validate JSON

```bash
cat agent-output/simple-web-api/04-governance-constraints.json | jq .
```

If `jq` fails, JSON is malformed.

---

## Agent-Specific Validation Notes

### @plan → 01-requirements.md

- ✅ Must capture all NFRs (SLA, RTO, RPO)
- ✅ Budget constraints clearly stated
- ✅ Regional preferences specified

### azure-principal-architect → 02-architecture-assessment.md

- ✅ WAF pillar scores (1-10 scale)
- ✅ Resource SKU recommendations with justification
- ✅ Architecture decision summary
- ✅ Handoff section for next agent

### diagram-generator → 03-des-diagram.py

- ✅ `show=False` for automatic PNG generation
- ✅ Azure resources from `diagrams.azure.*` modules
- ✅ PNG file generated successfully

### bicep-plan → 04-implementation-plan.md

- ✅ Resource inventory with AVM modules
- ✅ Dependency graph (Mermaid)
- ✅ Naming conventions table
- ✅ Security configuration table

---

## Continuous Improvement

### Ratcheting Strictness

Current mode: **relaxed** (warns on minor issues)

After 2 successful agent regenerations:

```yaml
# .github/workflows/wave1-artifact-drift-guard.yml
env:
  STRICTNESS: standard # Change from 'relaxed' to 'standard'
```

### Adding New Validations

Edit `scripts/validate-simple-web-api.mjs`:

```javascript
function validateNewCheck() {
  // Add custom validation logic
  if (someCondition) {
    pass("New check passed");
  } else {
    fail("New check failed");
  }
}

// Call in main()
validateNewCheck();
```

### Extending to Other Projects

Copy validation pattern:

```bash
cp scripts/validate-simple-web-api.mjs scripts/validate-ecommerce.mjs
```

Update PROJECT constant:

```javascript
const PROJECT = "ecommerce";
```

---

## FAQ

**Q: Can I skip validation locally?**  
A: Yes, but GitHub Actions will still enforce it. Use `git commit --no-verify` to bypass pre-commit hooks.

**Q: What if I disagree with a validation rule?**  
A: Discuss in PR comments or create an issue. Templates are designed for consistency, but can be updated if justified.

**Q: How do I fix "embedded skeleton" errors?**  
A: Remove large code blocks from agent definitions. Agents should **reference** templates, not **embed** them.

**Q: Can I add custom H2 headings?**  
A: Yes, but place them **after** all required headings. They'll trigger warnings in `standard` mode.

---

## Resources

| Resource           | Path                                               |
| ------------------ | -------------------------------------------------- |
| Validation Script  | `scripts/validate-simple-web-api.mjs`              |
| GitHub Workflow    | `.github/workflows/validate-simple-web-api.yml`    |
| Wave 1 Drift Guard | `.github/workflows/wave1-artifact-drift-guard.yml` |
| Templates          | `.github/templates/*.template.md`                  |
| Agent Definitions  | `.github/agents/*.agent.md`                        |
| Markdown Standards | `.github/instructions/markdown.instructions.md`    |

---

**Last Updated**: 2026-01-13  
**Branch**: chore/templatize-artifacts  
**Validation Version**: 1.0
