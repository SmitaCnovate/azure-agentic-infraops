# Operations Runbook - infraops-static-demo

> **Version**: 1.0  
> **Date**: 2026-01-20  
> **Status**: As-Built  
> **Classification**: Operational

---

## Quick Reference

| Property               | Value                                            |
| ---------------------- | ------------------------------------------------ |
| **Workload**           | infraops-static-demo                             |
| **Environment**        | Production                                       |
| **Region**             | West Europe                                      |
| **Resource Group**     | rg-infraops-static-demo-prod                     |
| **Static Web App URL** | https://blue-sky-09ca1ff03.4.azurestaticapps.net |
| **Owner**              | infraops-team                                    |
| **Cost Center**        | demo                                             |

## 1. Daily Operations

### Key Resources

| Resource             | Name                               | Portal Link                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static Web App       | stapp-infraops-static-demo-prod    | [Azure Portal](https://portal.azure.com/#@/resource/subscriptions/00858ffc-dded-4f0f-8bbf-e17fff0d47d9/resourceGroups/rg-infraops-static-demo-prod/providers/Microsoft.Web/staticSites/stapp-infraops-static-demo-prod)                  |
| Application Insights | appi-infraops-static-demo-prod-weu | [Azure Portal](https://portal.azure.com/#@/resource/subscriptions/00858ffc-dded-4f0f-8bbf-e17fff0d47d9/resourceGroups/rg-infraops-static-demo-prod/providers/Microsoft.Insights/components/appi-infraops-static-demo-prod-weu)           |
| Log Analytics        | log-infraops-static-demo-prod-weu  | [Azure Portal](https://portal.azure.com/#@/resource/subscriptions/00858ffc-dded-4f0f-8bbf-e17fff0d47d9/resourceGroups/rg-infraops-static-demo-prod/providers/Microsoft.OperationalInsights/workspaces/log-infraops-static-demo-prod-weu) |

---

## 2. Incident Response

### Morning Health Check (5 minutes)

**Objective**: Verify workload health and identify overnight issues.

| Step | Action                              | Expected Result           |
| ---- | ----------------------------------- | ------------------------- |
| 1    | Open Static Web App URL             | Page loads successfully   |
| 2    | Check Application Insights overview | No spike in errors        |
| 3    | Review failures blade               | <1% error rate            |
| 4    | Check deployment history            | No unexpected deployments |

#### Health Check Commands

```bash
# Check Static Web App status
az staticwebapp show \
  --name stapp-infraops-static-demo-prod \
  --resource-group rg-infraops-static-demo-prod \
  --query "{Name:name, DefaultHostname:defaultHostname}" \
  --output table

# Quick HTTP check
curl -s -o /dev/null -w "%{http_code}" \
  https://blue-sky-09ca1ff03.4.azurestaticapps.net
```

#### Application Insights Health Query

```kusto
// Last 24 hours error summary
requests
| where timestamp > ago(24h)
| summarize
    TotalRequests = count(),
    FailedRequests = countif(success == false),
    ErrorRate = round(100.0 * countif(success == false) / count(), 2)
| project TotalRequests, FailedRequests, ErrorRate
```

---

## 3. Common Procedures

### Week Review Tasks (30 minutes)

| Task                                | Frequency | Owner       |
| ----------------------------------- | --------- | ----------- |
| Review Application Insights metrics | Weekly    | Operations  |
| Check for security advisories       | Weekly    | Operations  |
| Review staging environments         | Weekly    | Development |
| Validate SSL certificate status     | Weekly    | Operations  |

#### Performance Review Query

```kusto
// Weekly performance summary
pageViews
| where timestamp > ago(7d)
| summarize
    AvgDuration = avg(duration),
    P95Duration = percentile(duration, 95),
    TotalViews = count()
    by bin(timestamp, 1d)
| order by timestamp asc
```

---

## 4. Maintenance Windows

### Monthly Tasks (1 hour)

| Task                 | Description                     | Owner       |
| -------------------- | ------------------------------- | ----------- |
| Cost review          | Review Azure Cost Management    | Finance     |
| Capacity planning    | Review traffic growth trends    | Operations  |
| Security review      | Check for outdated dependencies | Development |
| Documentation update | Update runbook if needed        | Operations  |

#### Cost Review Command

```bash
# Get cost for resource group (requires Cost Management access)
az consumption usage list \
  --start-date $(date -d "-30 days" +%Y-%m-%d) \
  --end-date $(date +%Y-%m-%d) \
  --query "[?contains(instanceId, 'rg-infraops-static-demo-prod')].{Resource:instanceName, Cost:pretaxCost}" \
  --output table
```

---

## 5. Contacts & Escalation

### Emergency Contacts

| Role            | Contact       | Escalation        |
| --------------- | ------------- | ----------------- |
| Primary On-Call | infraops-team | Email/Teams       |
| Azure Support   | Azure Portal  | P1 for production |

## 2. Incident Response

### Severity Definitions

| Severity          | Definition                   | Response Time | Examples                      |
| ----------------- | ---------------------------- | ------------- | ----------------------------- |
| **P1 - Critical** | Site completely unavailable  | 15 minutes    | HTTP 500/503 for all users    |
| **P2 - High**     | Major functionality impaired | 1 hour        | Partial outage, slow response |
| **P3 - Medium**   | Minor issues                 | 4 hours       | Specific pages slow           |
| **P4 - Low**      | Cosmetic/informational       | 24 hours      | Minor UI issues               |

### Incident Response Procedure

#### P1 - Site Unavailable

```
┌─────────────────────────────────────────────────────────────────┐
│  P1 INCIDENT RESPONSE FLOWCHART                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DETECT                                                       │
│     └─▶ Alert received OR user report                           │
│                                                                  │
│  2. TRIAGE (5 min)                                               │
│     └─▶ Confirm outage: curl -I <site-url>                      │
│     └─▶ Check Azure Status: https://status.azure.com            │
│                                                                  │
│  3. DIAGNOSE (10 min)                                            │
│     └─▶ Check SWA status in portal                               │
│     └─▶ Review recent deployments                                │
│     └─▶ Check Application Insights for errors                   │
│                                                                  │
│  4. RESOLVE                                                      │
│     └─▶ If deployment issue: Rollback (see below)               │
│     └─▶ If Azure issue: Open support ticket                     │
│     └─▶ If CDN issue: Wait for Azure auto-recovery              │
│                                                                  │
│  5. COMMUNICATE                                                  │
│     └─▶ Update stakeholders                                     │
│     └─▶ Post incident review within 24h                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Diagnostic Commands

```bash
# Check deployment history
az staticwebapp environment list \
  --name stapp-infraops-static-demo-prod \
  --resource-group rg-infraops-static-demo-prod \
  --output table

# View recent deployments
az staticwebapp builds list \
  --name stapp-infraops-static-demo-prod \
  --resource-group rg-infraops-static-demo-prod \
  --output table

# Check Application Insights for errors
az monitor app-insights query \
  --app appi-infraops-static-demo-prod-weu \
  --resource-group rg-infraops-static-demo-prod \
  --analytics-query "exceptions | where timestamp > ago(1h) | take 10"
```

---

## 3. Common Procedures

### Scale Up (Vertical Scaling)

**When**: High traffic expected or performance issues observed.

**Static Web Apps Note**: Static Web Apps Standard tier auto-scales automatically. No manual scaling required.

| Scenario                 | Action                                       |
| ------------------------ | -------------------------------------------- |
| Traffic surge            | No action needed (CDN handles automatically) |
| Need more staging slots  | Already have 10 slots (Standard tier max)    |
| Need enterprise features | Consider Azure Front Door integration        |

### Scale Down (Cost Reduction)

| Scenario             | Action                        | Savings  |
| -------------------- | ----------------------------- | -------- |
| Dev/Test only needed | Switch to Free tier           | $9/month |
| Reduce monitoring    | Reduce App Insights sampling  | Variable |
| Reduce retention     | Lower Log Analytics retention | Variable |

---

## 3. Common Procedures

### Standard Deployment (GitHub Actions)

**Trigger**: Push to main branch  
**Duration**: 2-5 minutes  
**Rollback Time**: < 5 minutes

```
GitHub Push ──▶ GitHub Actions ──▶ Build ──▶ Deploy ──▶ Live
```

#### Verify Deployment

```bash
# Check latest build
az staticwebapp builds list \
  --name stapp-infraops-static-demo-prod \
  --resource-group rg-infraops-static-demo-prod \
  --query "[0].{Status:status, CreatedOn:createdTimeUtc}" \
  --output table
```

### Emergency Rollback

**When**: Production issue detected after deployment.

#### Option 1: Revert Git Commit

```bash
# In your Git repository
git revert HEAD
git push origin main
# GitHub Actions will automatically redeploy previous version
```

#### Option 2: Redeploy Previous Build

```bash
# List recent builds
az staticwebapp builds list \
  --name stapp-infraops-static-demo-prod \
  --resource-group rg-infraops-static-demo-prod \
  --output table

# Note: SWA doesn't support direct rollback to previous build
# Use Git revert instead
```

### Infrastructure Rollback

```bash
# Redeploy entire infrastructure from Bicep
cd infra/bicep/infraops-static-demo
./deploy.ps1 -Environment prod

# Or nuclear option: delete and recreate
az group delete --name rg-infraops-static-demo-prod --yes
./deploy.ps1 -Environment prod
```

---

## 3. Common Procedures

### Key Metrics to Watch

| Metric              | Source               | Threshold         |
| ------------------- | -------------------- | ----------------- |
| Availability        | Application Insights | > 99%             |
| Error Rate          | Application Insights | < 5%              |
| Response Time (P95) | Application Insights | < 500ms           |
| Page Views          | Application Insights | Baseline variance |

### Recommended Alert Rules

```bash
# Create availability alert (example)
az monitor metrics alert create \
  --name "SWA-Availability-Alert" \
  --resource-group rg-infraops-static-demo-prod \
  --scopes "/subscriptions/00858ffc-dded-4f0f-8bbf-e17fff0d47d9/resourceGroups/rg-infraops-static-demo-prod/providers/Microsoft.Insights/components/appi-infraops-static-demo-prod-weu" \
  --condition "avg availabilityResults/availabilityPercentage < 99" \
  --description "Site availability below 99%"
```

### Useful KQL Queries

#### Error Investigation

```kusto
// Top errors in last hour
exceptions
| where timestamp > ago(1h)
| summarize count() by type, outerMessage
| order by count_ desc
| take 10
```

#### Performance Analysis

```kusto
// Slow page loads
pageViews
| where timestamp > ago(1h)
| where duration > 3000
| project timestamp, name, duration, client_City, client_Browser
| order by duration desc
| take 20
```

#### User Analytics

```kusto
// Active users by geography
pageViews
| where timestamp > ago(24h)
| summarize Users = dcount(user_Id) by client_CountryOrRegion
| order by Users desc
| take 10
```

---

### Troubleshooting Guide

### Common Issues

| Issue            | Symptoms                     | Resolution                                           |
| ---------------- | ---------------------------- | ---------------------------------------------------- |
| Site not loading | HTTP 404/500                 | Check deployment status, verify build succeeded      |
| Slow page loads  | High TTFB                    | Check CDN, review bundle size, enable caching        |
| No telemetry     | Missing data in App Insights | Verify instrumentation key, check SDK initialization |
| Deployment fails | GitHub Action errors         | Review build logs, check npm/build errors            |
| SSL errors       | Certificate warnings         | Wait for auto-renewal, check custom domain config    |

### Diagnostic Tools

| Tool                 | Purpose                 | Access                           |
| -------------------- | ----------------------- | -------------------------------- |
| Azure Portal         | Resource management     | portal.azure.com                 |
| Application Insights | Telemetry & diagnostics | Portal > App Insights            |
| SWA CLI              | Local development       | `npx @azure/static-web-apps-cli` |
| Azure CLI            | Command-line management | Terminal                         |

---

## 6. Change Log

### Change Request Process

1. **Request**: Submit change via GitHub Issue
2. **Review**: Technical review by operations team
3. **Approve**: Owner approval for production changes
4. **Implement**: Deploy via GitHub Actions
5. **Verify**: Confirm deployment success
6. **Document**: Update runbook if needed

### Emergency Change Process

1. **Assess**: Determine severity and impact
2. **Execute**: Implement fix immediately
3. **Notify**: Inform stakeholders
4. **Document**: Post-incident review within 24 hours

---

### Appendix

### Useful Links

| Resource                   | URL                                                                         |
| -------------------------- | --------------------------------------------------------------------------- |
| Azure Status               | https://status.azure.com                                                    |
| SWA Documentation          | https://docs.microsoft.com/azure/static-web-apps                            |
| App Insights Documentation | https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview    |
| Azure Support              | https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade |

### CLI Quick Reference

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "noalz"

# List SWA environments
az staticwebapp environment list --name stapp-infraops-static-demo-prod -g rg-infraops-static-demo-prod

# Show SWA details
az staticwebapp show --name stapp-infraops-static-demo-prod -g rg-infraops-static-demo-prod

# Query App Insights
az monitor app-insights query --app appi-infraops-static-demo-prod-weu -g rg-infraops-static-demo-prod --analytics-query "requests | take 10"
```

---

_Runbook generated for infraops-static-demo workload._
_Last updated: 2026-01-20_
