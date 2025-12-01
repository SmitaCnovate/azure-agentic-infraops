# GitHub Copilot Azure Infrastructure Workflow

[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Powered-8957e5?style=for-the-badge&logo=github)](https://github.com/features/copilot)
[![Azure](https://img.shields.io/badge/Azure-Infrastructure-0078D4?style=for-the-badge&logo=microsoftazure)](https://azure.microsoft.com)
[![Bicep](https://img.shields.io/badge/Bicep-IaC-00B4AB?style=for-the-badge&logo=microsoftazure)](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Dev Container](https://img.shields.io/badge/Dev%20Container-Ready-blue?style=flat-square&logo=docker)](https://code.visualstudio.com/docs/devcontainers/containers)

---

> **Build Azure infrastructure with AI-powered agents.** A 4-step workflow that takes you from
> requirements to deployed Bicep templates—with architecture guidance, validation, and best
> practices built in.

## The Workflow

```mermaid
%%{init: {'theme':'neutral'}}%%
graph LR
    subgraph Step 1
        P["@plan<br/>(built-in)"]
    end
    subgraph Step 2
        A["azure-principal-architect<br/>(NO CODE)"]
    end
    subgraph Step 3
        B["bicep-plan<br/>(plan only)"]
    end
    subgraph Step 4
        I["bicep-implement<br/>(code generation)"]
    end

    P -->|"requirements"| A
    A -->|"architecture"| B
    B -->|"plan"| I

    style P fill:#e1f5fe
    style A fill:#fff3e0
    style B fill:#e8f5e9
    style I fill:#fce4ec
```

| Step | Agent                       | What It Does                                                           |
| ---- | --------------------------- | ---------------------------------------------------------------------- |
| 1    | `@plan`                     | Gather requirements and create implementation plan with cost estimates |
| 2    | `azure-principal-architect` | Azure Well-Architected Framework assessment (NO code)                  |
| 3    | `bicep-plan`                | Create detailed implementation plan with AVM modules                   |
| 4    | `bicep-implement`           | Generate and validate Bicep templates                                  |

**Optional agents:** `diagram-generator` (architecture diagrams) and `adr-generator` (decision records)

---

## Quick Start

### 1. Open in Dev Container

```bash
git clone https://github.com/jonathan-vella/github-copilot-demo.git
code github-copilot-demo
# F1 → "Dev Containers: Reopen in Container"
```

### 2. Start the Workflow

1. Open GitHub Copilot Chat (`Ctrl+Alt+I`)
2. Click the **Agent** button or press `Ctrl+Shift+A`
3. Select `@plan` and describe your infrastructure

### 3. Example Conversation

```
You: @plan Create a HIPAA-compliant patient portal with Azure App Service and SQL Database

Plan Agent: [Generates requirements plan]
            Do you approve this plan?

You: yes

[Handoff to azure-principal-architect]

Architect: [Provides WAF assessment - Security, Reliability, Performance scores]
           Do you approve this architecture?

You: approve

[Handoff to bicep-plan]

Planner: [Creates implementation plan]
         Do you approve this plan?

You: yes

[Handoff to bicep-implement]

Implementer: [Generates Bicep templates]
             ✅ bicep build passed
             ✅ bicep lint passed
             Ready to deploy?
```

---

## Workflow Details

Each step requires your approval before proceeding:

| Your Response     | What Happens             |
| ----------------- | ------------------------ |
| `yes` / `approve` | Continue to next step    |
| Feedback text     | Agent refines its output |
| `no`              | Return to previous step  |

📖 **[Full Workflow Documentation](docs/WORKFLOW.md)**

---

## Project Structure

```
github-copilot-demo/
├── .github/agents/              # Agent definitions
│   ├── azure-principal-architect.agent.md
│   ├── bicep-plan.agent.md
│   ├── bicep-implement.agent.md
│   ├── diagram-generator.agent.md
│   └── adr-generator.agent.md
├── .bicep-planning-files/       # Generated implementation plans
├── infra/bicep/                 # Generated Bicep templates
├── docs/
│   ├── WORKFLOW.md              # Workflow documentation
│   ├── adr/                     # Architecture Decision Records
│   └── diagrams/                # Generated architecture diagrams
└── demos/                       # Demo scenarios
```

---

## Requirements

- **VS Code** with GitHub Copilot extension
- **Azure subscription** (for deployments)
- **Dev Container** support (Docker Desktop or GitHub Codespaces)

The Dev Container includes: Azure CLI, Bicep CLI, PowerShell 7, and all required VS Code extensions.

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License — see [LICENSE](LICENSE).
