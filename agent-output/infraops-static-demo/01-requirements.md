# Static Web App Demo - Requirements

Fast-track requirements for a Static Web App demo with Application Insights.
All values are pre-filled for quick live demonstration.

## Project Overview

| Field                   | Value                                      |
| ----------------------- | ------------------------------------------ |
| **Project**             | `infraops-static-demo`                     |
| **Project Type**        | Static Web Application                     |
| **Timeline**            | Quick demo (days)                          |
| **Primary Stakeholder** | demo-team                                  |
| **Business Context**    | Demo to showcase Agentic InfraOps patterns |

### Project Details

| Field           | Value                                        |
| --------------- | -------------------------------------------- |
| **Project**     | `infraops-static-demo`                       |
| **Type**        | Static Web Application                       |
| **Region**      | `westeurope` (Static Web App supported)      |
| **Environment** | Production                                   |
| **Framework**   | React (Vite)                                 |
| **Repo**        | `https://github.com/contoso/static-web-demo` |

## Functional Requirements

- Host a single-page application (SPA) with client-side routing
- Serve static assets (HTML, CSS, JS, images) globally via CDN
- Support staging environments via preview branches

## Non-Functional Requirements (NFRs)

### Availability & Reliability

| Metric  | Target | Justification             |
| ------- | ------ | ------------------------- |
| **SLA** | 99.9%  | Demo-grade SLA suffices   |
| **RTO** | 1 hour | Demo recovery target      |
| **RPO** | 1 hour | Demo data recovery target |

### Performance

| Metric | Target                |
| ------ | --------------------- |
| TTFB   | < 200ms (global edge) |

### Scalability

Auto-scales using Static Web App platform and CDN.

### Security

- HTTPS only
- Managed SSL certificate

### Observability

Application Insights for telemetry and Log Analytics integration.

### Azure Resources

| Resource             | SKU/Tier | Purpose                    |
| -------------------- | -------- | -------------------------- |
| Static Web App       | Standard | Hosting with staging slots |
| Application Insights | -        | Telemetry and monitoring   |

### Tags

```yaml
Environment: prod
Project: contoso-static-demo
ManagedBy: Bicep
Owner: demo-team
```

## Compliance & Security Requirements

### Regulatory Frameworks

No specific regulatory frameworks for demo (None).

### Data Residency

- Primary Region: westeurope
- Data residency: demo data only

### Authentication & Authorization

- Identity Provider: None (demo)
- MFA: Not required for demo

## Budget

| Field              | Value      |
| ------------------ | ---------- |
| **Monthly Budget** | ~$15/month |

> The Azure Pricing MCP server will generate detailed cost estimates during
> architecture assessment (Step 2).

## Operational Requirements

### Monitoring & Alerting

Use Application Insights and Log Analytics with demo alerts.

### Support & Maintenance

Support Hours: Standard business hours for demo maintenance.

### Backup & Disaster Recovery

Backup frequency: Not required for demo; manual backups possible.

## Regional Preferences

| Preference         | Value         |
| ------------------ | ------------- |
| Primary Region     | westeurope    |
| Failover Region    | swedencentral |
| Availability Zones | Not required  |
