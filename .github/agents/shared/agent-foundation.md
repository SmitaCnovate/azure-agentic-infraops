# Agent Shared Foundation

> **Version 3.6.0** | This file contains shared configuration and patterns for all Agentic InfraOps agents.

All agents in this repository MUST follow these standards.

---

## Repository Context

**Agentic InfraOps** - Azure infrastructure engineered by agents. Verified. Well-Architected. Deployable.

- **Target Audience**: System Integrator partners, IT Pros learning cloud/IaC
- **Primary IaC**: Bicep (Azure-native), Terraform (multi-cloud alternative)
- **Framework**: Azure Well-Architected Framework (WAF)
- **Modules**: Azure Verified Modules (AVM) first approach

---

## Regional Standards

### Default Region

**Always use `swedencentral`** unless explicitly specified otherwise.

- Sustainable operations with renewable energy
- Full Azure service availability
- Zone redundancy supported

### Alternative Region

**Use `germanywestcentral`** when encountering quota issues in swedencentral.

### When to Suggest Other Regions

| Scenario              | Recommended Region(s)                        |
| --------------------- | -------------------------------------------- |
| Americas latency      | `eastus`, `eastus2`, `westus2`, `centralus`  |
| APAC latency          | `southeastasia`, `eastasia`, `australiaeast` |
| German data residency | `germanywestcentral`                         |
| Swiss regulations     | `switzerlandnorth`                           |
| UK GDPR               | `uksouth`, `ukwest`                          |
| French sovereignty    | `francecentral`                              |

**Always document** the reason when deviating from `swedencentral`.

---

## Seven-Step Workflow

All agents participate in this workflow:

```text
Step 1: @plan              → 01-requirements.md
Step 2: architect          → 02-architecture-assessment.md
Step 3: Design Artifacts   → 03-des-* files (optional)
Step 4: bicep-plan         → 04-implementation-plan.md
Step 5: bicep-implement    → 05-* + Bicep code
Step 6: Deploy             → 06-deployment-summary.md
Step 7: As-Built Artifacts → 07-* files (optional)
```

### Approval Gate (MANDATORY)

**Every agent MUST pause for approval** before proceeding to the next step.

```markdown
---

## ✅ Ready for Next Step

I have completed [current step]. The deliverables are:

- [List outputs created]

**Shall I proceed to [next step]?**
Reply "yes" to continue, or provide feedback to refine.
```

### Artifact Suffix Convention

| Phase             | Suffix | Example             |
| ----------------- | ------ | ------------------- |
| Design (Step 3)   | `-des` | `03-des-diagram.py` |
| As-Built (Step 7) | `-ab`  | `07-ab-diagram.py`  |

---

## Output Directory

All agent outputs (except Bicep code) go to `agent-output/{project-name}/`.

- **Bicep code**: `infra/bicep/{project-name}/`
- **All other artifacts**: `agent-output/{project-name}/`

If no project folder exists, prompt the user for a project name.

---

## Resource Naming

### Unique Suffix Pattern (CRITICAL)

**Always generate unique suffix in main.bicep:**

```bicep
var uniqueSuffix = uniqueString(resourceGroup().id)
```

**Pass to ALL modules** - never let modules generate their own suffixes.

### Name Length Limits

| Resource        | Max Length | Pattern Example                         |
| --------------- | ---------- | --------------------------------------- |
| Key Vault       | 24 chars   | `kv-{short}-{env}-{suffix}`             |
| Storage Account | 24 chars   | `st{project}{env}{suffix}` (no hyphens) |
| SQL Server      | 63 chars   | `sql-{project}-{env}-{suffix}`          |

### CAF Naming Prefixes

| Resource Type          | Prefix    |
| ---------------------- | --------- |
| Resource Group         | `rg-`     |
| Virtual Network        | `vnet-`   |
| Subnet                 | `snet-`   |
| Network Security Group | `nsg-`    |
| Storage Account        | `st`      |
| Key Vault              | `kv-`     |
| App Service            | `app-`    |
| SQL Server             | `sql-`    |
| Cosmos DB              | `cosmos-` |

---

## Security Baseline

All resources MUST include:

- `supportsHttpsTrafficOnly: true`
- `minimumTlsVersion: 'TLS1_2'`
- `allowBlobPublicAccess: false` (storage)
- NSG deny rules at priority 4096
- Managed identities preferred over connection strings

---

## Common Anti-Patterns

| Anti-Pattern                      | Problem                  | Solution                              |
| --------------------------------- | ------------------------ | ------------------------------------- |
| Hardcoded resource names          | Deployment collisions    | Use `uniqueString()` suffix           |
| Missing `uniqueSuffix` in modules | Child modules conflict   | Pass suffix to ALL modules            |
| Resource IDs in diagnostic scope  | BCP036 error             | Use `existing` keyword + symbolic ref |
| S1/P1v2 for zone redundancy       | Deployment fails         | Use P1v4 or higher                    |
| SQL with local auth               | Policy blocks deployment | Use Azure AD-only auth                |

---

## References

- [defaults.md](../../docs/reference/defaults.md) - Full defaults reference
- [bicep-patterns.md](../../docs/reference/bicep-patterns.md) - Bicep patterns
- [workflow.md](../../docs/reference/workflow.md) - Complete workflow details
- [agents-overview.md](../../docs/reference/agents-overview.md) - Agent comparison

---

## Version History

| Version | Date    | Changes                   |
| ------- | ------- | ------------------------- |
| 3.6.0   | 2025-01 | Initial shared foundation |
