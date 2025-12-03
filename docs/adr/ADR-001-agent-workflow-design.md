# ADR-001: Four-Step Agent Workflow Design

## Status

Accepted

## Date

2024-01-15

## Context

This repository demonstrates GitHub Copilot's capabilities for Azure infrastructure development. We needed to
design a workflow that:

1. Showcases the full spectrum of Copilot capabilities (planning, architecture, code generation)
2. Provides clear separation of concerns between different phases
3. Allows for human approval gates between major decisions
4. Teaches best practices through the agent prompts themselves
5. Handles the token limit constraints of AI responses

### Considered Alternatives

1. **Single monolithic agent** - One agent handles everything from requirements to deployment
2. **Two-step workflow** - Architecture → Implementation only
3. **Six-step workflow** - Finer granularity with separate agents for each phase
4. **No custom agents** - Rely entirely on Copilot Chat without custom prompts

## Decision

We adopted a **four-step workflow** with approval gates:

```
@plan → azure-principal-architect → bicep-plan → bicep-implement
```

With two optional supporting agents:

- `diagram-generator` - Python architecture diagrams
- `adr-generator` - Architecture Decision Records

### Workflow Steps

| Step | Agent                       | Purpose                           | Creates Code? |
| ---- | --------------------------- | --------------------------------- | ------------- |
| 1    | `@plan`                     | Requirements gathering, cost est. | No            |
| 2    | `azure-principal-architect` | WAF assessment, recommendations   | No            |
| 3    | `bicep-plan`                | Implementation planning with AVM  | Planning docs |
| 4    | `bicep-implement`           | Bicep code generation             | Yes           |

### Why Four Steps?

1. **Matches real-world workflow** - Architects don't write code, developers don't set requirements
2. **Prevents token limit issues** - Splitting planning from implementation keeps responses focused
3. **Enables approval gates** - Each step requires human confirmation before proceeding
4. **Supports iterative refinement** - Can re-run any step without starting over

## Consequences

### Positive

- Clear separation between architecture decisions and implementation details
- Human remains in control with explicit approval gates
- Easier to debug issues (which step failed?)
- Supports phased demos (can show just architecture, or full workflow)
- Token limits are manageable with scoped agent responsibilities

### Negative

- More complex than single-agent approach
- Requires user to understand workflow sequence
- Context must be passed between steps (sometimes manually)
- New users may be confused by agent selection

### Mitigations

- Created `docs/workflow/WORKFLOW.md` with detailed workflow documentation
- Added workflow diagrams to agent prompts
- Agents prompt for approval before major actions
- `copilot-instructions.md` includes workflow quick reference

## References

- [docs/workflow/WORKFLOW.md](../workflow/WORKFLOW.md) - Full workflow documentation
- [.github/agents/](../../.github/agents/) - Agent definitions
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md) - Copilot guidance
