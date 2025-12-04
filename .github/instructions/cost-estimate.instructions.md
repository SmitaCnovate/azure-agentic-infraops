---
description: "Standards for Azure cost estimate documentation with architecture and business context"
applyTo: "**/docs/*-cost-estimate.md"
---

# Azure Cost Estimate Documentation Standards

Guidelines for creating comprehensive Azure cost estimate documents that include architecture context,
business justification, visual diagrams, and impactful callouts. These documents serve as financial
planning artifacts for Azure infrastructure projects.

## Document Purpose

Cost estimate documents should provide:

- **Financial clarity** for stakeholders and budget approvals
- **Architecture context** linking costs to design decisions
- **Business justification** connecting technical choices to outcomes
- **Optimization guidance** for reducing costs without sacrificing quality
- **Visual impact** through callouts, charts, and progress indicators

---

## Visual Design Standards

### Color Palette (Azure/Microsoft Brand)

Use consistent colors throughout the document:

| Category            | Color  | Hex Code  | Emoji |
| ------------------- | ------ | --------- | ----- |
| Compute             | Blue   | `#0078D4` | 💻    |
| Data Services       | Green  | `#107C10` | 💾    |
| Networking          | Purple | `#5C2D91` | 🌐    |
| Messaging           | Orange | `#D83B01` | 📨    |
| Security/Management | Yellow | `#FFB900` | 🔐    |
| Monitoring          | Teal   | `#008272` | 📊    |

### Status Indicators

Use these indicators for quick visual scanning:

| Status         | Indicator | Usage                            |
| -------------- | --------- | -------------------------------- |
| Under budget   | ✅        | Budget utilization < 80%         |
| Near budget    | ⚠️        | Budget utilization 80-100%       |
| Over budget    | ❌        | Budget utilization > 100%        |
| Cost increase  | 📈        | Scaling or premium SKU decisions |
| Cost decrease  | 📉        | Optimization opportunities       |
| Stable         | ➡️        | No significant change            |
| Risk/Warning   | ⚠️        | Potential cost overruns          |
| Recommendation | 💡        | Optimization suggestions         |
| Savings        | 💰        | Money saved with commitments     |

---

## Required Sections

### 1. Header Block

Include metadata at the top of every cost estimate:

```markdown
# Azure Cost Estimate: {Project Name}

**Generated**: {YYYY-MM-DD}
**Region**: {primary-region} ({location-name})
**Environment**: {Production|Staging|Development}
**MCP Tools Used**: {list of azure-pricing/\* tools used}
**Architecture Reference**: {link to WAF assessment or architecture doc}
```

### 2. Cost At-a-Glance (High Impact Section)

Add a prominent callout box immediately after the header:

````markdown
---

## 💰 Cost At-a-Glance

> **Monthly Total: ~$X,XXX** | Annual: ~$XX,XXX
>
> ```
> Budget: ████████░░ 80% utilized ($X,XXX of $X,XXX)
> ```
>
> | Status            | Indicator                        |
> | ----------------- | -------------------------------- |
> | Budget Status     | ✅ Under Budget                  |
> | Cost Trend        | ➡️ Stable                        |
> | Savings Available | 💰 $X,XXX/year with reservations |
````

**Progress Bar Examples:**

```markdown
<!-- Under budget (green feel) -->

Budget: ███░░░░░░░ 27% utilized ($207 of $800) ✅

<!-- Near budget (caution) -->

Budget: ████████░░ 80% utilized ($640 of $800) ⚠️

<!-- Over budget (alert) -->

Budget: ██████████ 120% utilized ($960 of $800) ❌
```

### 3. Top Cost Drivers (Executive Summary)

Show the top 5 resources consuming budget:

```markdown
## 📊 Top 5 Cost Drivers

| Rank | Resource                 | Monthly Cost | % of Total | Trend |
| ---- | ------------------------ | ------------ | ---------- | ----- |
| 1️⃣   | Azure Front Door Premium | $330         | 21%        | ➡️    |
| 2️⃣   | App Service Plan (×2)    | $412         | 26%        | ➡️    |
| 3️⃣   | Cognitive Search S1      | $245         | 15%        | ➡️    |
| 4️⃣   | Service Bus Premium      | $200         | 13%        | 📈    |
| 5️⃣   | SQL Database S3          | $145         | 9%         | ➡️    |

> 💡 **Quick Win**: Switch to Service Bus Standard in dev/test to save $190/month
```

### 4. Executive Summary

Provide a quick overview for stakeholders:

```markdown
## Summary

| Metric                | Value             |
| --------------------- | ----------------- |
| 💵 Monthly Estimate   | $X,XXX - $X,XXX   |
| 📅 Annual Estimate    | $XX,XXX - $XX,XXX |
| 🌍 Primary Region     | {region}          |
| 💳 Pricing Type       | List Price (PAYG) |
| ⭐ WAF Score          | {X.X}/10          |
| 📊 Budget Utilization | XX%               |

### Business Context

{2-3 sentences explaining what this infrastructure supports and why these
investments are necessary. Link costs to business outcomes.}
```

### 5. Architecture Overview with Colored Charts

Include a visual diagram and brief description:

````markdown
## Architecture Overview

### Cost Distribution

​`mermaid
%%{init: {'theme':'base', 'themeVariables': {'pie1': '#0078D4', 'pie2': '#107C10', 'pie3': '#5C2D91', 'pie4': '#D83B01', 'pie5': '#FFB900', 'pie6': '#008272'}}}%%
pie showData
    title Monthly Cost Distribution ($)
    "💻 Compute" : 535
    "💾 Data Services" : 461
    "🌐 Networking" : 200
    "📨 Messaging" : 145
    "🔐 Security" : 18
​`

### Key Design Decisions Affecting Cost

| Decision          | Cost Impact  | Business Rationale       | Trend    |
| ----------------- | ------------ | ------------------------ | -------- |
| Zone redundancy   | +$X/month 📈 | 99.9% SLA requirement    | Required |
| Premium SKUs      | +$X/month 📈 | Performance requirements | Required |
| Private endpoints | +$X/month    | Security/compliance      | Required |
````

### 6. Risk Indicators

Flag services that could cause cost overruns:

```markdown
## ⚠️ Cost Risk Indicators

| Resource            | Risk Level | Issue                              | Mitigation             |
| ------------------- | ---------- | ---------------------------------- | ---------------------- |
| Service Bus Premium | 🔴 High    | $677 base vs $200 estimated usage  | Monitor MU utilization |
| Cognitive Search    | 🟡 Medium  | Query volume could increase costs  | Set query limits       |
| Data Transfer       | 🟡 Medium  | Egress charges not fully estimated | Monitor egress         |

> **⚠️ Watch Item**: Service Bus Premium has a base cost of $677/month for 1 MU.
> Actual usage may be lower ($200 estimate), but budgeting should account for full capacity.
```

### 7. Quick Decision Matrix

Help stakeholders understand trade-offs:

```markdown
## 🎯 Quick Decision Matrix

_"If you need X, expect to pay Y more"_

| Requirement            | Additional Cost | SKU Change    | Notes                    |
| ---------------------- | --------------- | ------------- | ------------------------ |
| Zone Redundancy        | +$206/month     | P1v4 required | P1v2/S1 don't support    |
| Private Endpoints      | +$7.30/endpoint | Any           | Required for compliance  |
| Geo-Replication (SQL)  | +$85/month      | Same tier     | Active geo-replication   |
| Multi-region DR        | +$800/month     | Full stack    | Secondary region         |
| WAF with managed rules | +$230/month     | Premium AFD   | Standard doesn't include |

> 💡 Use this matrix to quickly scope change requests
```

### 8. Savings Highlight Box

Make savings opportunities prominent:

```markdown
## 💰 Savings Opportunities

> ### Total Potential Savings: $2,030/year (32%)
>
> | Commitment                | Monthly Savings | Annual Savings |
> | ------------------------- | --------------- | -------------- |
> | 3-Year Reserved Instances | $169            | **$2,030**     |
> | 1-Year Reserved Instances | $85             | $1,020         |
>
> **Recommended**: Start with 1-year commitments, extend to 3-year after 6 months of stable usage.

### Detailed Savings by Resource

| Resource              | PAYG     | 1-Year     | 3-Year     | Max Savings   |
| --------------------- | -------- | ---------- | ---------- | ------------- |
| App Service P1v4 (×2) | $412     | $329 (20%) | $263 (36%) | 💰 $1,779/yr  |
| Azure Functions EP1   | $123     | $102 (17%) | $102 (17%) | 💰 $251/yr    |
| **Total**             | **$535** | **$431**   | **$365**   | **$2,030/yr** |
```

### 9. Detailed Cost Breakdown

Organize costs by category with clear subtotals and emoji prefixes:

```markdown
## Detailed Cost Breakdown

### 💻 Compute Services

| Resource         | SKU         | Qty | $/Hour | $/Month | Notes           |
| ---------------- | ----------- | --- | ------ | ------- | --------------- |
| App Service Plan | P1v4 Linux  | 2   | $0.282 | $411.72 | Zone redundant  |
| Azure Functions  | EP1 Premium | 1   | $0.169 | $123.37 | VNet integrated |

**💻 Compute Subtotal**: ~$535/month

### 💾 Data Services

| Resource     | SKU      | Config  | $/Month | Notes         |
| ------------ | -------- | ------- | ------- | ------------- |
| SQL Database | S3       | 100 DTU | $145.16 | Transactional |
| Redis Cache  | C2 Basic | 2.5 GB  | $65.70  | Session cache |

**💾 Data Subtotal**: ~$211/month
```

**Required categories with emoji:**

- 💻 Compute Services
- 💾 Data Services
- 🌐 Networking & Edge
- 🔐 Security & Management
- 📨 Messaging & Integration (optional)
- 📊 Monitoring (optional)

### 10. Monthly Cost Summary with Visual

````markdown
## 📋 Monthly Cost Summary

| Category         | Monthly Cost | % of Total | Trend |
| ---------------- | ------------ | ---------- | ----- |
| 💻 Compute       | $535         | 34%        | ➡️    |
| 💾 Data Services | $466         | 29%        | ➡️    |
| 🌐 Networking    | $376         | 24%        | ➡️    |
| 📨 Messaging     | $200         | 13%        | 📈    |
| 🔐 Security/Mgmt | $18          | 1%         | ➡️    |
| **Total**        | **~$1,595**  | 100%       |       |

​`
Cost Distribution:
💻 Compute      ████████████████░░░░░░░░░░░░░░ 34%
💾 Data         ██████████████░░░░░░░░░░░░░░░░ 29%
🌐 Networking   ████████████░░░░░░░░░░░░░░░░░░ 24%
📨 Messaging    ██████░░░░░░░░░░░░░░░░░░░░░░░░ 13%
🔐 Security     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  1%
​`
````

### 11. Regional Comparison

Compare costs across relevant regions:

```markdown
## 🌍 Regional Comparison

| Region             | Monthly Cost | vs. Primary | Data Residency | Recommendation |
| ------------------ | ------------ | ----------- | -------------- | -------------- |
| swedencentral      | $1,595       | Baseline    | EU (Sweden) ✅ | **Selected**   |
| germanywestcentral | $1,600       | +0.3%       | EU (Germany)   | Alternative    |
| northeurope        | $1,420       | -11%        | EU (Ireland)   | Lower cost     |
| eastus             | $1,150       | -28%        | US             | Lowest cost    |

> 💡 **Decision**: swedencentral selected for GDPR/EU data residency despite higher cost.
> Ireland (northeurope) is a valid EU alternative with 11% savings.
```

### 12. Environment Comparison

Show costs across environments:

```markdown
## 🔄 Environment Cost Comparison

| Environment | Monthly Cost | vs. Production | Notes                       |
| ----------- | ------------ | -------------- | --------------------------- |
| Production  | $1,595       | Baseline       | Full SKUs, zone redundancy  |
| Staging     | $800         | -50%           | Same SKUs, single instances |
| Development | $400         | -75%           | Basic SKUs, no redundancy   |

**Total for all environments**: ~$2,795/month

> 💡 **Tip**: Use Azure Dev/Test pricing for non-production environments to save additional 40-50%
```

### 13. Assumptions & References

Document pricing assumptions and link to sources:

```markdown
## 📝 Assumptions

- **Usage**: 730 hours/month (24×7 operation)
- **Data transfer**: Minimal egress (<100 GB/month)
- **Pricing**: Azure retail list prices (pay-as-you-go)
- **Region**: swedencentral (EU GDPR compliant)
- **Prices queried**: {date} via Azure Pricing MCP
- **Reserved instances**: Not included in base estimate

## 📊 Pricing Data Accuracy

> **📊 Data Source**: All prices queried in real-time from the
> [Azure Retail Prices API](https://learn.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices).
>
> ✅ **Included**: Retail list prices (PAYG), Savings Plan pricing, Spot pricing
>
> ❌ **Not Included**: EA discounts, CSP pricing, negotiated rates, Azure Hybrid Benefit
>
> 💡 For official quotes, verify with [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

## 🔗 References

- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [WAF Assessment]({link})
- [Architecture Diagram]({link})
- [Bicep Templates]({link})
```

---

## Best Practices

### DO ✅

- Use real-time pricing from Azure Pricing MCP tools
- Show list prices (PAYG) as the baseline
- Include savings plan options for significant resources
- Link costs to architecture decisions
- Provide business context for premium SKU choices
- Use emoji and visual indicators for quick scanning
- Include progress bars for budget utilization
- Highlight top cost drivers prominently
- Flag potential cost risks with warning indicators
- Update estimates when architecture changes

### DON'T ❌

- Include customer-specific discounts (these vary by agreement)
- Use outdated pricing data (re-query before publishing)
- Omit assumptions about usage patterns
- Forget to include all environments (dev/staging/prod)
- Skip the regional comparison for EU/compliance scenarios
- Ignore potential cost risks or overruns
- Use only text - add visual elements for impact

---

## Validation Checklist

Before finalizing a cost estimate document:

- [ ] All prices queried via Azure Pricing MCP (document date)
- [ ] "Cost At-a-Glance" section with budget utilization
- [ ] "Top 5 Cost Drivers" table included
- [ ] Subtotals match category totals
- [ ] Total matches sum of subtotals
- [ ] Colored pie chart with Azure brand colors
- [ ] ASCII progress bars for cost distribution
- [ ] Business context provided
- [ ] Risk indicators for potential overruns
- [ ] Savings opportunities with highlight box
- [ ] Regional alternatives analyzed
- [ ] All environments estimated
- [ ] Assumptions clearly stated
- [ ] References linked (WAF assessment, architecture docs)
- [ ] Emoji used consistently for categories

---

## File Naming Convention

Use the pattern: `{project-name}-cost-estimate.md`

Examples:

- `ecommerce-cost-estimate.md`
- `patient-portal-cost-estimate.md`
- `data-platform-cost-estimate.md`

Place in project's output directory or `docs/` alongside other project documentation.
