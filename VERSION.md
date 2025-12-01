# GitHub Copilot Azure Infrastructure Workflow - Version History

## Semantic Versioning

This repository follows [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR**: Breaking changes to workflow or agents
- **MINOR**: New agents, significant features
- **PATCH**: Bug fixes, documentation updates

---

## Version 2.0.0 (2025-12-01) - Workflow Focus 🔄

### Summary

Repository restructured to focus exclusively on the 4-step agent workflow for Azure infrastructure development. Removed legacy scenarios and resources to provide a clean, focused experience.

### Changed

- **Repository Focus**: Now centered on the 4-step agent workflow
- **Simplified Structure**: Removed scenarios, resources folders
- **Clean Slate**: Empty `demos/`, `infra/bicep/`, `docs/adr/`, `docs/diagrams/` ready for generated content

### Core Components

#### Custom Agents (6 agents)

- **azure-principal-architect** - WAF assessment (NO CODE)
- **bicep-plan** - Implementation planning with AVM modules
- **bicep-implement** - Bicep code generation
- **diagram-generator** - Python architecture diagrams
- **adr-generator** - Architecture Decision Records
- **infrastructure-specialist** - Unified agent (optional)

#### Documentation

- `docs/WORKFLOW.md` - Complete workflow guide
- `.github/copilot-instructions.md` - AI agent guidance
- `README.md` - Quick start and overview

### Workflow

```mermaid
%%{init: {'theme':'neutral'}}%%
graph LR
    P["@plan"] --> A[azure-principal-architect]
    A --> B[bicep-plan]
    B --> I[bicep-implement]
```

---

## Version Schema

```text
MAJOR.MINOR.PATCH

MAJOR (Breaking Changes):
- Workflow architecture changes
- Agent API changes

MINOR (New Features):
- New agents
- Significant documentation additions

PATCH (Improvements):
- Bug fixes
- Documentation updates
```

---

**Current Version**: **2.0.0**
**Release Date**: December 1, 2025
**Status**: Production Ready ✅
