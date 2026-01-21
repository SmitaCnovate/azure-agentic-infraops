# Terraform Extension Guide

> **Guide for extending Agentic InfraOps to support Terraform alongside Bicep**

This guide outlines the components and configuration needed to add Terraform support to the
Agentic InfraOps workflow. The project currently focuses on Bicep as the primary IaC language,
but organizations requiring multi-cloud or existing Terraform investments can extend it.

---

## Overview

Adding Terraform support requires changes to:

1. Dev container configuration
2. Git configuration files
3. VS Code extensions
4. Custom Copilot agents
5. Instruction files
6. Scenarios and documentation

---

## 1. Dev Container Features

Add these features to `.devcontainer/devcontainer.json`:

```jsonc
"features": {
  // Existing features...
  "ghcr.io/devcontainers/features/terraform:1": {
    "installTFsec": true,
    "installTerragrunt": false,
    "version": "latest"
  },
  "ghcr.io/devcontainers/features/go:1": {
    "version": "latest"
  }
}
```

Add container environment variable:

```jsonc
"containerEnv": {
  "TF_PLUGIN_CACHE_DIR": "/home/vscode/.terraform-cache"
}
```

Update post-create.sh to create the cache directory:

```bash
mkdir -p "${HOME}/.terraform-cache"
chmod 755 "${HOME}/.terraform-cache"
```

---

## 2. VS Code Extensions

Add to the extensions array in `devcontainer.json`:

```jsonc
"extensions": [
  // Existing extensions...
  "HashiCorp.terraform",
  "ms-azuretools.vscode-azureterraform",
  "golang.go"
]
```

Add editor settings:

```jsonc
"settings": {
  "[terraform]": {
    "editor.tabSize": 2,
    "editor.formatOnSave": true
  }
}
```

---

## 3. Git Configuration

### .gitignore additions

```gitignore
# Terraform
*.tfstate
*.tfstate.backup
.terraform/
*.tfvars
.terraform.lock.hcl
crash.log
override.tf
override.tf.json
*_override.tf
*_override.tf.json
```

### .gitattributes additions

```properties
*.tf text eol=lf
*.tfvars text eol=lf
*.go text eol=lf
```

---

## 4. Custom Copilot Agents

Create new agent files in `.github/agents/`:

### terraform-plan.agent.md

```markdown
---
name: Terraform Planning Agent
description: Creates Terraform implementation plans from architecture designs
tools: ["semantic_search", "read_file", "list_dir"]
---

# Terraform Planning Agent

## Role

You are a Terraform planning specialist who creates detailed implementation
plans for Azure infrastructure based on architecture assessments.

## Responsibilities

1. Analyze 02-architecture-assessment.md for infrastructure requirements
2. Map requirements to Terraform resources and modules
3. Create modular Terraform structure with clear separation
4. Reference Azure Verified Modules for Terraform where available
5. Generate 04-implementation-plan.md with Terraform-specific guidance

## Output Format

Generate implementation plans that specify:

- Required Terraform providers (azurerm, azuread, etc.)
- Module structure and dependencies
- Variable definitions and validation
- State management recommendations
- Deployment pipeline considerations
```

### terraform-implement.agent.md

```markdown
---
name: Terraform Implementation Agent
description: Implements Terraform configurations from implementation plans
tools: ["semantic_search", "read_file", "create_file", "replace_string_in_file"]
---

# Terraform Implementation Agent

## Role

You are a Terraform implementation expert who creates production-ready
Azure infrastructure configurations.

## Responsibilities

1. Follow 04-implementation-plan.md specifications exactly
2. Use Azure Verified Modules for Terraform where available
3. Implement proper variable validation
4. Create comprehensive outputs for module composition
5. Include resource tagging per organizational standards

## Code Standards

- Use Terraform 1.5+ features (check blocks, import blocks)
- Implement lifecycle rules appropriately
- Use data sources for existing resources
- Follow HashiCorp naming conventions
- Include inline documentation
```

---

## 5. Instruction Files

Create `.github/instructions/terraform-code-best-practices.instructions.md`:

```markdown
---
applyTo: "**/*.tf"
description: "Infrastructure as Code best practices for Terraform configurations"
---

# Terraform Code Best Practices

## Provider Configuration

- Pin provider versions with pessimistic constraint (~>)
- Configure backend for remote state
- Use provider aliases for multi-region deployments

## Module Structure

- One resource type per file (main.tf, variables.tf, outputs.tf)
- Use locals for computed values
- Implement variable validation blocks
- Document with README.md per module

## Security Requirements

- Never hardcode secrets
- Use Azure Key Vault data sources
- Enable diagnostic settings on all resources
- Implement network security by default

## Naming Conventions

Follow CAF naming: `{resource-type}-{workload}-{environment}-{region}-{instance}`
```

---

## 6. Update Shared Defaults

In `.github/agents/_shared/defaults.md`, update the ManagedBy tag:

```markdown
| `ManagedBy` | ✅ Yes | IaC tool used | `Bicep`, `Terraform`, `ARM` |
```

---

## 7. Scenarios to Create

Create a Terraform baseline scenario similar to S01:

### scenarios/S02-terraform-baseline/

```
S02-terraform-baseline/
├── README.md
├── DEMO-SCRIPT.md
├── prompts/
│   ├── 01-requirements.prompt.md
│   └── 02-architecture.prompt.md
├── solution/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── providers.tf
│   └── modules/
└── validation/
    └── validate.sh
```

---

## 8. Terratest Integration (Optional)

For infrastructure testing with Terratest:

1. Add Go feature to devcontainer (already included above)
2. Create test files in `infra/terraform/{project}/test/`

Example test structure:

```go
package test

import (
    "testing"
    "github.com/gruntwork-io/terratest/modules/terraform"
)

func TestTerraformBasicExample(t *testing.T) {
    terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
        TerraformDir: "../",
    })

    defer terraform.Destroy(t, terraformOptions)
    terraform.InitAndApply(t, terraformOptions)
}
```

---

## 9. Pipeline Integration

Add Terraform validation to CI/CD:

```yaml
# .github/workflows/terraform-validate.yml
name: Terraform Validation

on:
  pull_request:
    paths:
      - "infra/terraform/**"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.5.0

      - name: Terraform Format
        run: terraform fmt -check -recursive

      - name: Terraform Init
        run: terraform init -backend=false
        working-directory: infra/terraform

      - name: Terraform Validate
        run: terraform validate
        working-directory: infra/terraform

      - name: tfsec Security Scan
        uses: aquasecurity/tfsec-action@v1.0.0
        with:
          working_directory: infra/terraform
```

---

## 10. Documentation Updates

When adding Terraform support, update:

- [ ] `.github/copilot-instructions.md` - Add Terraform to Tech Stack
- [ ] `docs/GLOSSARY.md` - Add Terraform entry
- [ ] `docs/guides/prerequisites.md` - Add Terraform tools
- [ ] `docs/guides/dev-containers-setup.md` - Document Terraform tools
- [ ] `docs/reference/workflow.md` - Add Terraform workflow variant
- [ ] `README.md` - Update description to include Terraform

---

## Summary

| Component    | Files to Create/Modify                                    |
| ------------ | --------------------------------------------------------- |
| DevContainer | `devcontainer.json`, `post-create.sh`                     |
| VS Code      | Extensions and settings in `devcontainer.json`            |
| Git Config   | `.gitignore`, `.gitattributes`                            |
| Agents       | `terraform-plan.agent.md`, `terraform-implement.agent.md` |
| Instructions | `terraform-code-best-practices.instructions.md`           |
| Scenarios    | `S02-terraform-baseline/`                                 |
| CI/CD        | `terraform-validate.yml`                                  |

This modular approach allows Terraform to coexist with Bicep while maintaining
the structured Agentic InfraOps workflow.
