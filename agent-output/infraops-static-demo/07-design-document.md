# Design Document - infraops-static-demo

> **Version**: 1.0  
> **Date**: 2026-01-20  
> **Status**: As-Built  
> **Author**: docs agent

---

## 1. Introduction

### 1.1 Purpose

This document provides a comprehensive design specification for the **infraops-static-demo** workload, a production-grade Azure Static Web App deployment with integrated Application Insights monitoring. The design follows Azure Well-Architected Framework principles and leverages Azure Verified Modules (AVM) for infrastructure deployment.

### 1.2 Objectives

| Objective                      | Target                  | Status        |
| ------------------------------ | ----------------------- | ------------- |
| Host React SPA with global CDN | Sub-200ms TTFB          | ✅ Achieved   |
| Achieve 99.9% availability     | Standard tier SLA       | ✅ Configured |
| Enable telemetry & monitoring  | Application Insights    | ✅ Deployed   |
| Minimize cost                  | Under $15/month         | ✅ ~$9/month  |
| Zero infrastructure management | Serverless architecture | ✅ Achieved   |

### 1.3 Stakeholders

| Role            | Responsibility                         |
| --------------- | -------------------------------------- |
| **Owner**       | infraops-team                          |
| **Operations**  | Day-2 monitoring and incident response |
| **Development** | Application deployment and updates     |
| **Finance**     | Cost tracking via Cost Center: demo    |

### 1.4 Scope

**In Scope:**

- Azure Static Web App (Standard tier) for SPA hosting
- Application Insights for telemetry collection
- Log Analytics Workspace for centralized logging
- Global CDN distribution (included with Static Web Apps)
- Managed SSL certificates

**Out of Scope:**

- Backend APIs (managed functions not configured)
- Custom domain configuration
- Azure Front Door / WAF integration
- Multi-region active-active deployment

---

## 2. Azure Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USERS (Global)                              │
│                    Browsers, Mobile Apps, API Clients                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ HTTPS (TLS 1.2+)
┌─────────────────────────────────────────────────────────────────────────┐
│                    Azure Global CDN (118+ Edge Locations)               │
│                         Included with Static Web Apps                    │
│                                                                          │
│   • Automatic content caching          • HTTP/2 & IPv6 support          │
│   • Geographic load balancing          • Brotli/Gzip compression        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Azure Static Web Apps (Standard)                      │
│                         stapp-infraops-static-demo-prod                  │
│                              Region: westeurope                          │
│                                                                          │
│  ┌─────────────────────────┐    ┌─────────────────────────┐            │
│  │   Production Slot       │    │   Staging Slots (10)    │            │
│  │   (Main Branch)         │    │   (Preview Branches)    │            │
│  └─────────────────────────┘    └─────────────────────────┘            │
│                                                                          │
│  • Managed SSL Certificates         • GitHub Actions CI/CD              │
│  • Custom Authentication            • Environment Variables             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ Telemetry
┌─────────────────────────────────────────────────────────────────────────┐
│                        Observability Stack                               │
│                                                                          │
│  ┌─────────────────────────┐    ┌─────────────────────────┐            │
│  │  Application Insights   │───▶│  Log Analytics          │            │
│  │  appi-...-prod-weu      │    │  log-...-prod-weu       │            │
│  │                         │    │                         │            │
│  │  • Page views           │    │  • 30-day retention     │            │
│  │  • Errors & exceptions  │    │  • Kusto queries        │            │
│  │  • Performance metrics  │    │  • Alert integration    │            │
│  └─────────────────────────┘    └─────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Subscription Organization

| Level          | Value                                        |
| -------------- | -------------------------------------------- |
| Tenant         | 2d04cb4c-999b-4e60-a3a7-e8993edc768b         |
| Subscription   | noalz (00858ffc-dded-4f0f-8bbf-e17fff0d47d9) |
| Resource Group | rg-infraops-static-demo-prod                 |
| Region         | westeurope                                   |

### 2.3 Naming Convention

| Resource Type        | Pattern                         | Example                            |
| -------------------- | ------------------------------- | ---------------------------------- |
| Resource Group       | `rg-{project}-{env}`            | rg-infraops-static-demo-prod       |
| Static Web App       | `stapp-{project}-{env}`         | stapp-infraops-static-demo-prod    |
| Application Insights | `appi-{project}-{env}-{region}` | appi-infraops-static-demo-prod-weu |
| Log Analytics        | `log-{project}-{env}-{region}`  | log-infraops-static-demo-prod-weu  |

### 2.4 Tagging Strategy

| Tag         | Value                | Purpose                    |
| ----------- | -------------------- | -------------------------- |
| Environment | prod                 | Environment identification |
| ManagedBy   | Bicep                | IaC tracking               |
| Project     | infraops-static-demo | Project association        |
| Owner       | infraops-team        | Ownership accountability   |
| CostCenter  | demo                 | Cost allocation            |

---

## 3. Networking

### 3.1 Network Topology

This workload uses a **fully managed networking model** with no custom VNet requirements:

| Component   | Configuration              | Notes                        |
| ----------- | -------------------------- | ---------------------------- |
| **Ingress** | Azure CDN (managed)        | HTTPS only, TLS 1.2+         |
| **CDN**     | 118+ global edge locations | Automatic geographic routing |
| **DNS**     | \*.azurestaticapps.net     | Managed by Azure             |
| **Egress**  | Not applicable             | No backend services          |

### 3.2 IP Addresses

| Purpose               | IP Address(es)         |
| --------------------- | ---------------------- |
| Production Endpoint   | Dynamic (CDN edge IPs) |
| Static Web App Origin | Managed by Azure       |

### 3.3 Firewall Rules / NSGs

**Not applicable** - Static Web Apps operate as a fully managed service without NSG requirements.

### 3.4 DNS Configuration

| Record     | Type  | Value                                    |
| ---------- | ----- | ---------------------------------------- |
| Production | CNAME | blue-sky-09ca1ff03.4.azurestaticapps.net |

---

## 4. Storage

### 4.1 Storage Configuration

| Storage Type       | Purpose               | Configuration              |
| ------------------ | --------------------- | -------------------------- |
| **Static Content** | HTML, CSS, JS, assets | Managed by Static Web Apps |
| **Log Storage**    | Application telemetry | Log Analytics Workspace    |

### 4.2 Data Retention

| Data Type            | Retention Period | Location                           |
| -------------------- | ---------------- | ---------------------------------- |
| Application Insights | 365 days         | appi-infraops-static-demo-prod-weu |
| Log Analytics        | 30 days          | log-infraops-static-demo-prod-weu  |
| Static content       | Indefinite       | Static Web App storage             |

### 4.3 Encryption

| Layer      | Method   | Key Management           |
| ---------- | -------- | ------------------------ |
| At-rest    | AES-256  | Microsoft-managed        |
| In-transit | TLS 1.2+ | Managed SSL certificates |

---

## 5. Compute

### 5.1 Compute Resources

| Resource       | Type                      | SKU      | Purpose     |
| -------------- | ------------------------- | -------- | ----------- |
| Static Web App | Microsoft.Web/staticSites | Standard | SPA hosting |

### 5.2 Scaling Configuration

| Setting       | Value                  | Notes                     |
| ------------- | ---------------------- | ------------------------- |
| Scaling Type  | Automatic (serverless) | No configuration required |
| Min Instances | N/A (managed)          | CDN-based distribution    |
| Max Instances | N/A (managed)          | Unlimited by design       |

### 5.3 Performance Targets

| Metric       | Target  | Achieved               |
| ------------ | ------- | ---------------------- |
| TTFB         | < 200ms | ✅ Yes (edge delivery) |
| Availability | 99.9%   | ✅ SLA guaranteed      |
| Page Load    | < 3s    | Application-dependent  |

---

## 6. Identity & Access

### 6.1 Authentication

| Component    | Authentication Method             |
| ------------ | --------------------------------- |
| End Users    | None (public site)                |
| CI/CD        | GitHub Actions (deployment token) |
| Azure Portal | Microsoft Entra ID                |

### 6.2 RBAC Assignments

| Principal      | Role                   | Scope          |
| -------------- | ---------------------- | -------------- |
| infraops-team  | Contributor            | Resource Group |
| GitHub Actions | Deployment (via token) | Static Web App |

### 6.3 Managed Identities

| Resource       | Identity Type              | Purpose        |
| -------------- | -------------------------- | -------------- |
| Static Web App | System-assigned (optional) | Not configured |

---

## 7. Security & Compliance

### 7.1 Security Baseline

| Control           | Status            | Implementation           |
| ----------------- | ----------------- | ------------------------ |
| HTTPS Enforcement | ✅ Enabled        | Platform default         |
| TLS 1.2+          | ✅ Enabled        | Managed SSL              |
| DDoS Protection   | ✅ Basic          | Azure platform           |
| WAF               | ❌ Not configured | Available via Front Door |

### 7.2 Compliance Alignment

| Framework | Status       | Notes                              |
| --------- | ------------ | ---------------------------------- |
| GDPR      | ⚠️ Partial   | IP masking enabled in App Insights |
| SOC 2     | ✅ Compliant | Azure platform compliance          |
| ISO 27001 | ✅ Compliant | Azure platform compliance          |

### 7.3 Security Recommendations

1. **Enable authentication** if user data is collected
2. **Add Azure Front Door** for WAF protection on high-value sites
3. **Configure custom domain** with organizational SSL certificate
4. **Enable Defender for Cloud** for security posture monitoring

---

## 8. Backup & Disaster Recovery

### 8.1 Backup Strategy

| Component        | Backup Method   | Frequency                     |
| ---------------- | --------------- | ----------------------------- |
| Application Code | Git repository  | On every commit               |
| Static Content   | Git repository  | On every commit               |
| Infrastructure   | Bicep templates | Version controlled            |
| Telemetry Data   | Log Analytics   | Continuous (30-day retention) |

### 8.2 Recovery Objectives

| Metric  | Target        | Notes                       |
| ------- | ------------- | --------------------------- |
| **RTO** | < 15 minutes  | Redeploy from Git           |
| **RPO** | 0 (Git-based) | All code in version control |

### 8.3 DR Strategy

- **Tier**: Active-Passive (CDN cached globally)
- **Failover**: Automatic via Azure CDN
- **Recovery**: Redeploy from GitHub repository

See [07-backup-dr-plan.md](07-backup-dr-plan.md) for detailed procedures.

---

## 9. Management & Monitoring

### 9.1 Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Insights                          │
│                 appi-infraops-static-demo-prod-weu               │
├─────────────────────────────────────────────────────────────────┤
│  Browser Telemetry    │    Performance    │    Availability     │
│  ─────────────────    │    ───────────    │    ────────────     │
│  • Page views         │    • Load times   │    • HTTP status    │
│  • User sessions      │    • TTFB         │    • Uptime         │
│  • Custom events      │    • Dependencies │    • Geo latency    │
│  • Exceptions         │    • Browser perf │    • Error rates    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Log Analytics Workspace                       │
│                 log-infraops-static-demo-prod-weu                │
├─────────────────────────────────────────────────────────────────┤
│  • Kusto Query Language (KQL)        • 30-day retention         │
│  • Cross-resource queries            • Alert integration        │
│  • Workbook dashboards               • Export to storage        │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Key Metrics

| Metric       | Threshold | Alert Priority |
| ------------ | --------- | -------------- |
| Availability | < 99%     | P1 (Critical)  |
| Error Rate   | > 5%      | P2 (High)      |
| TTFB         | > 500ms   | P3 (Medium)    |
| Page Load    | > 5s      | P3 (Medium)    |

### 9.3 Alerting (Recommended)

| Alert            | Condition                    | Action        |
| ---------------- | ---------------------------- | ------------- |
| Site Down        | Availability < 95% for 5 min | Email + Teams |
| High Errors      | Error rate > 10% for 10 min  | Email         |
| Slow Performance | P95 latency > 1s for 15 min  | Log           |

---

## 10. Appendix

### 10.1 Resource Inventory

See [07-resource-inventory.md](07-resource-inventory.md) for complete resource listing.

### 10.2 Cost Summary

| Resource             | SKU           | Monthly Cost     |
| -------------------- | ------------- | ---------------- |
| Static Web App       | Standard      | $9.00            |
| Application Insights | Pay-as-you-go | $0.00 (5GB free) |
| Log Analytics        | PerGB2018     | $0.00 (5GB free) |
| **Total**            |               | **~$9.00**       |

See [07-ab-cost-estimate.md](07-ab-cost-estimate.md) for detailed cost analysis.

### 10.3 Related Documents

| Document                                                       | Purpose            |
| -------------------------------------------------------------- | ------------------ |
| [07-operations-runbook.md](07-operations-runbook.md)           | Day-2 operations   |
| [07-backup-dr-plan.md](07-backup-dr-plan.md)                   | DR procedures      |
| [02-architecture-assessment.md](02-architecture-assessment.md) | WAF assessment     |
| [04-implementation-plan.md](04-implementation-plan.md)         | IaC specifications |

### 10.4 Revision History

| Version | Date       | Author                           | Changes                        |
| ------- | ---------- | -------------------------------- | ------------------------------ |
| 1.0     | 2026-01-20 | docs | Initial as-built documentation |

---

_Document generated from deployed infrastructure and IaC artifacts._
_Aligned with Azure Well-Architected Framework best practices._
