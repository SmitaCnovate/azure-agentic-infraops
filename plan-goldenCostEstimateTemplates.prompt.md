## Plan: Golden Cost-Estimate Templates + Drift Guard

Centralize the full cost-estimate structure into two canonical templates under a GitHub/automation-friendly path,
then have agents link to them (no more long embedded skeletons).

Keep the instruction file as “rules + required sections,” and add a dedicated drift-prevention workflow that
enforces template linkage and structure.

Include phase-specific differences (design emphasizes assumptions/deferrals; as-built emphasizes IaC coverage +
variance) and a warning-only signal if no as-built examples exist yet.

### Steps {6}

1. Create `.github/templates/` and add:
   - `.github/templates/03-des-cost-estimate.template.md`
   - `.github/templates/07-ab-cost-estimate.template.md`
2. Define the shared “core spine” (6–10 major headings) identical in both templates, sourced from `.github/instructions/cost-estimate.instructions.md`.
3. Add minimal phase-specific sections:
   - Design (03-des): emphasize “What We Are Not Paying For (Yet)” and assumptions/uncertainty drivers.
   - As-built (07-ab): add “IaC/Pricing Coverage” + “Design vs As-Built Summary” (drift and delta summary).
4. Update agents to reference templates and remove embedded skeletons, keeping only the short headings checklist:
   - `.github/agents/azure-principal-architect.agent.md` → link `../templates/03-des-cost-estimate.template.md`
   - `.github/agents/workload-documentation-generator.agent.md` → link `../templates/07-ab-cost-estimate.template.md`
5. Update standards doc to avoid duplication and declare templates as canonical structure:
   - `.github/instructions/cost-estimate.instructions.md`
6. Add dedicated drift-guard workflow `.github/workflows/cost-estimate-template-drift-guard.yml`:
   - Trigger paths: `.github/templates/**`, `.github/agents/**`, and `.github/instructions/cost-estimate.instructions.md`
   - Hard-fail checks: templates contain required headings + colored Mermaid init; agents include correct template
     links and do not re-embed large templates.
   - Warning-only check: if no `agent-output/**/07-ab-cost-estimate.md` exists yet, emit a warning but don’t fail.

### Core headings (stable 10) to enforce

Enforce these as exact H2 headings (`##`) in both templates, in this order:

1. `## 💰 Cost At-a-Glance`
2. `## ✅ Decision Summary`
3. `## 🔁 Requirements → Cost Mapping`
4. `## 📊 Top 5 Cost Drivers`
5. `## Architecture Overview`
6. `## 🧾 What We Are Not Paying For (Yet)`
7. `## ⚠️ Cost Risk Indicators`
8. `## 🎯 Quick Decision Matrix`
9. `## 💰 Savings Opportunities`
10. `## Detailed Cost Breakdown`

Normalization:

- Enforce emoji + spacing exactly.
- Enforce the unicode arrow `→` (not `->`) in the Requirements heading.
- Enforce capitalization/parentheses in “(Yet)” exactly.

### Drift-check pass/fail criteria

#### Hard fail (exit code 1)

1. Missing template files.
2. Core headings missing, not H2, or out of order in either template.
3. Mandatory colored Mermaid pie init missing in either template:
   - Must use `theme: base` and define `pie1..pie5` with exact colors:
     - `#0078D4`, `#107C10`, `#5C2D91`, `#D83B01`, `#FFB900`.
4. Template linkage missing in agents:
   - `azure-principal-architect.agent.md` links `../templates/03-des-cost-estimate.template.md`.
   - `workload-documentation-generator.agent.md` links `../templates/07-ab-cost-estimate.template.md`.
5. Embedded “large skeleton” reintroduced in agent files:
   - Fail on embedding signals like `Cost Estimate File Structure`.
   - Or fenced markdown blocks containing `# Azure Cost Estimate:` or any of the core headings.
6. Standards doc does not reference the golden templates at all.

#### Warning-only (exit code still 0)

1. Extra H2 headings beyond the core list exist in either template (warn, do not fail).
2. No `agent-output/**/07-ab-cost-estimate.md` examples exist yet (warn, do not fail).

### GitHub Actions warning annotations

- Emit warnings using workflow commands so they appear in PR UI:
  - `::warning file=PATH,line=LINE,title=TITLE::MESSAGE`
  - Escape `%`→`%25`, `\n`→`%0A`, `\r`→`%0D`.

Canonical titles (keep unchanged long-term):

- `Cost Estimate Drift`
- `Missing As-Built Examples`

Title mapping:

- Extra headings warnings → `Cost Estimate Drift`
- No `07-ab` examples warning → `Missing As-Built Examples`
- Hard-fail errors → `Cost Estimate Drift`
