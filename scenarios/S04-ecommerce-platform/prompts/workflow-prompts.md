# E-Commerce Platform Workflow Prompts

> **Copy-paste prompts for each step of the demo**
>
> **Tip**: Use `Ctrl+Alt+I` to open agent selector

---

## Step 1: Plan Agent (Project Planner)

**Agent**: Select **Plan** from agents dropdown (custom)

```text
Create a deployment plan for a multi-tier e-commerce platform on Azure with:

Business Requirements:
- 99.9% SLA for European retail customers
- Handle 10,000 concurrent users during peak sales
- PCI-DSS compliance for payment processing
- Sub-100ms product catalog queries

Technical Requirements:
- React SPA frontend
- .NET 8 REST API backend
- Product catalog with full-text search
- User session caching (10K sessions)
- Async order processing
- CDN and WAF for edge security

Constraints:
- Region: swedencentral (GDPR)
- Budget: Mid-tier (cost-conscious but reliable)
- Team has Azure PaaS experience
```

---

## Step 2: Azure Principal Architect

**Agent**: `azure-principal-architect` (Ctrl+Alt+I → Select)

```text
Assess this e-commerce platform architecture for Azure Well-Architected Framework alignment:

Requirements:
- 99.9% SLA, 10K concurrent users
- PCI-DSS compliance for payments
- Sub-100ms catalog queries
- swedencentral region (GDPR)

Services being considered:
- App Service P1v4 (zone redundant)
- Azure SQL S3 (100 DTU)
- Azure Cognitive Search S1
- Azure Cache for Redis C2
- Service Bus Premium (private endpoints)
- Azure Front Door Premium (WAF)
- Azure Functions EP1 (order processing)

Provide WAF scores and any compliance gaps.
```

---

## Step 3a: Azure Pricing MCP

**Tools**: MCP server auto-available in chat

```text
Use the Azure Pricing MCP tools to get real-time pricing for our e-commerce platform:
- App Service P1v4 (Linux, zone-redundant) in swedencentral
- Azure Functions EP1
- Azure SQL S3 (100 DTU)
- Azure Cache for Redis C2
- Azure Cognitive Search S1
- Service Bus Premium
- Azure Front Door Premium (PCI-DSS WAF)
```

---

## Step 3b: Diagram Generator

**Agent**: `diagram-generator` (Ctrl+Alt+I → Select)

```text
Generate a Python architecture diagram for our e-commerce platform:

Components:
- Azure Front Door Premium with WAF (edge)
- Static Web App for React SPA
- App Service P1v4 for .NET API (web tier)
- Azure SQL, Redis, Cognitive Search, Key Vault (data tier)
- Azure Functions EP1 + Service Bus Premium (integration tier)
- VNet with 3 subnets (web, data, integration)
- Log Analytics + App Insights (monitoring)

Use the diagrams library. Show the 3-tier network architecture with private endpoints.
Save to scenarios/scenario-output/ecommerce/architecture.py
```

---

## Step 4: Bicep Planning Specialist

**Agent**: `bicep-plan` (Ctrl+Alt+I → Select)

```text
Create an implementation plan for the e-commerce platform Bicep templates.

Resources to deploy:
- VNet with 3 subnets (web 10.0.1.0/24, data 10.0.2.0/24, integration 10.0.3.0/24)
- 3 NSGs with PCI-DSS compliant rules (deny-by-default)
- Private DNS zones for all private endpoints
- Key Vault with private endpoint
- App Service Plan P1v4 (zone redundant)
- App Service with VNet integration
- Azure SQL with Azure AD-only auth
- Redis Cache with private endpoint
- Cognitive Search with private endpoint
- Service Bus Premium with private endpoint
- Azure Functions EP1 with VNet integration
- Front Door Premium with WAF policy
- Static Web App
- Log Analytics + App Insights
- RBAC role assignments

Use 4 deployment phases. Output to agent-output/ecommerce/
```

---

## Step 5: Bicep Implementation Specialist

**Agent**: `bicep-implement` (Ctrl+Alt+I → Select)

```text
Generate Bicep templates from the e-commerce implementation plan.

Key requirements:
- Subscription scope for main.bicep
- Generate uniqueSuffix in main.bicep, pass to all modules
- Key Vault names ≤24 chars
- P1v4 App Service Plan (Linux, zone redundant)
- Front Door Premium (PCI-DSS WAF)
- Azure AD-only SQL auth
- Private endpoints for all data services
- Output to infra/bicep/ecommerce/

Include deploy.ps1 with:
- What-if support
- Bicep validation (build + lint)
- Auto-detect SQL admin identity
- Professional output formatting
```

---

## Step 6: Deployment

### What-If Preview

```powershell
cd infra/bicep/ecommerce
.\deploy.ps1 -WhatIf
```

### Deploy

```powershell
.\deploy.ps1
```

---

## Optional: ADR Generator

**Agent**: `adr-generator` (Ctrl+Alt+I → Select)

```text
Create an ADR documenting the decision to use Front Door Premium instead of Standard for the e-commerce platform.

Context:
- PCI-DSS compliance requires WAF with managed rule sets
- Standard tier has WAF but limited rule customization
- Premium tier costs $330/month vs $100/month for Standard
- Premium provides Bot protection, DDoS protection, private link origins

Decision needed: Premium tier for PCI-DSS compliance

Save to: scenarios/scenario-output/ecommerce/adr/
```

---

## Quick Reference: Agent Keyboard Shortcuts

| Action              | Shortcut       |
| ------------------- | -------------- |
| Open Copilot Chat   | `Ctrl+Alt+I`   |
| Open Agent Selector | `Ctrl+Alt+I` |
| Submit prompt       | `Enter`        |
| New line in prompt  | `Shift+Enter`  |
