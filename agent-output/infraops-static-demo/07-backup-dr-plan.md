# Backup & Disaster Recovery Plan - infraops-static-demo

> **Version**: 1.0  
> **Date**: 2026-01-20  
> **Status**: As-Built  
> **Classification**: Operational

---

## Executive Summary

This document outlines the backup and disaster recovery (DR) strategy for the **infraops-static-demo** workload. As a serverless static web application, the architecture inherently provides high availability through Azure's global CDN. The primary DR strategy relies on Git-based version control and Infrastructure as Code (IaC) for rapid recovery.

## 1. Recovery Objectives

### 1.1 Recovery Time Objective (RTO)

| Tier      | RTO Target   | Services                                        |
| --------- | ------------ | ----------------------------------------------- |
| Critical  | < 15 minutes | Static Web App availability / Redeploy from Git |
| Important | < 30 minutes | App Insights, Log Analytics recovery            |
| Standard  | < 24 hours   | Non-critical artifacts                          |

### 1.2 Recovery Point Objective (RPO)

| Data Type        | RPO Target          | Backup Strategy           |
| ---------------- | ------------------- | ------------------------- |
| Application Code | 0 (version control) | GitHub repository backups |
| Static Assets    | 0 (version control) | GitHub repository backups |
| Telemetry        | 30 days             | Log Analytics retention   |

---

## 2. Backup Strategy

### 2.1 Azure SQL Database

| Setting             | Configuration  |
| ------------------- | -------------- |
| Backup Type         | N/A (not used) |
| Retention (PITR)    | N/A            |
| Long-Term Retention | N/A            |
| Geo-Redundancy      | N/A            |

**Point-in-Time Restore Command:**

```bash
az sql db restore \
  --resource-group {rg} \
  --server {server} \
  --name {db} \
  --dest-name {db}-restored \
  --time "{timestamp}"
```

### 2.2 Azure Key Vault

| Setting          | Configuration   |
| ---------------- | --------------- |
| Soft Delete      | Enabled         |
| Purge Protection | Disabled (demo) |

---

## 3. Disaster Recovery Procedures

### 3.1 Failover Procedure

Outlined in scenario sections below (e.g., redeploy from IaC, alternate region deploy).

### 3.2 Failback Procedure

Failback is performed by redeploying to primary region and reconfiguring DNS/aliases as necessary.

---

## 4. Testing Schedule

| Test Type  | Frequency | Last Test  | Next Test  |
| ---------- | --------- | ---------- | ---------- |
| IaC Deploy | Quarterly | 2026-01-20 | 2026-04-20 |

---

## 5. Communication Plan

| Audience | Channel | Template                       |
| -------- | ------- | ------------------------------ |
| Owner    | Email   | Incident notification template |

---

## 6. Roles and Responsibilities

| Role  | Team          | Responsibility                    |
| ----- | ------------- | --------------------------------- |
| Owner | infraops-team | Incident owner and decision maker |

---

## 7. Dependencies

| Dependency | Impact                  | Mitigation                               |
| ---------- | ----------------------- | ---------------------------------------- |
| GitHub     | Deploy pipeline reliant | Mirror repository or backup CI artifacts |

---

## 8. Recovery Runbooks

| Scenario        | Runbook           | Owner         |
| --------------- | ----------------- | ------------- |
| SWA Unavailable | Redeploy from IaC | infraops-team |

---

## 9. Appendix

Appendix content and quick commands are below.

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRIMARY: GitHub Repository                  │
│  github.com/contoso/static-web-demo                              │
│                                                                  │
│  ├── src/                    # Application source code           │
│  ├── public/                 # Static assets                     │
│  ├── staticwebapp.config.json # SWA configuration               │
│  └── package.json            # Dependencies                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE: This Repository             │
│  infra/bicep/infraops-static-demo/                               │
│                                                                  │
│  ├── main.bicep              # Main template                     │
│  ├── main.bicepparam         # Parameters                        │
│  ├── deploy.ps1              # Deployment script                 │
│  └── modules/                # AVM module wrappers               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TELEMETRY: Azure Log Analytics              │
│  log-infraops-static-demo-prod-weu                               │
│                                                                  │
│  • 30-day retention (configurable)                               │
│  • Export to Storage Account for longer retention (optional)     │
└─────────────────────────────────────────────────────────────────┘
```

---

### Disaster Recovery Scenarios

### Scenario 1: Static Web App Unavailable

**Symptoms:**

- HTTP 500/503 errors
- Site not loading
- Azure status page shows outage

**Impact:** Complete site outage

**Recovery Procedure:**

```
┌─────────────────────────────────────────────────────────────────┐
│  SCENARIO 1: SWA UNAVAILABLE                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. VERIFY OUTAGE                                                │
│     └─▶ curl -I https://blue-sky-09ca1ff03.4.azurestaticapps.net│
│     └─▶ Check https://status.azure.com                          │
│                                                                  │
│  2. IF AZURE-WIDE OUTAGE                                         │
│     └─▶ Wait for Azure to resolve                               │
│     └─▶ Monitor status.azure.com                                │
│     └─▶ Estimated recovery: Azure SLA (99.9%)                   │
│                                                                  │
│  3. IF RESOURCE-SPECIFIC ISSUE                                   │
│     └─▶ Delete and recreate resource group                      │
│         az group delete -n rg-infraops-static-demo-prod --yes   │
│         cd infra/bicep/infraops-static-demo                     │
│         ./deploy.ps1 -Environment prod                          │
│     └─▶ Trigger GitHub Actions to redeploy app                  │
│                                                                  │
│  4. VERIFY RECOVERY                                              │
│     └─▶ curl -I <new-hostname>                                  │
│     └─▶ Update DNS if custom domain configured                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**RTO:** 15-30 minutes  
**RPO:** 0 (all code in Git)

---

### Scenario 2: Corrupted Deployment

**Symptoms:**

- Application errors after deployment
- JavaScript errors in browser console
- Broken functionality

**Impact:** Degraded user experience

**Recovery Procedure:**

```bash
# Option 1: Revert via Git (Recommended)
cd /path/to/app-repository
git log --oneline -5                    # Find last good commit
git revert HEAD                         # Revert last commit
git push origin main                    # GitHub Actions auto-deploys

# Option 2: Deploy specific commit
git checkout <good-commit-hash>
git checkout -b hotfix/rollback
git push origin hotfix/rollback
# Manually trigger deployment from this branch

# Option 3: Reset to previous version
git reset --hard <good-commit-hash>
git push origin main --force            # CAUTION: Rewrites history
```

**RTO:** 5-10 minutes  
**RPO:** 0 (all code in Git)

---

### Scenario 3: Resource Group Deleted

**Symptoms:**

- All resources return 404
- Azure Portal shows empty resource group or not found

**Impact:** Complete loss of Azure resources

**Recovery Procedure:**

```bash
# 1. Recreate infrastructure from Bicep
cd /workspaces/azure-agentic-infraops-demo/infra/bicep/infraops-static-demo
./deploy.ps1 -Environment prod

# 2. Get new deployment token
az staticwebapp secrets list \
  --name stapp-infraops-static-demo-prod \
  --resource-group rg-infraops-static-demo-prod \
  --query "properties.apiKey" -o tsv

# 3. Update GitHub repository secret with new token
# Navigate to: Repository Settings > Secrets > AZURE_STATIC_WEB_APPS_API_TOKEN

# 4. Trigger application deployment
# Push any commit or manually trigger GitHub Action

# 5. Verify
curl -I https://<new-hostname>.azurestaticapps.net
```

**RTO:** 20-30 minutes  
**RPO:** 0 (all code in Git, telemetry may be lost)

---

### Scenario 4: Region Unavailable

**Symptoms:**

- Azure West Europe region outage
- All resources in region affected

**Impact:** Complete site outage

**Recovery Procedure:**

```bash
# 1. Deploy to alternate region
cd /workspaces/azure-agentic-infraops-demo/infra/bicep/infraops-static-demo

# Edit parameters for new region
./deploy.ps1 -Environment prod -Location swedencentral -ResourceGroupName rg-infraops-static-demo-prod-dr

# 2. Update DNS (if custom domain)
# Point to new Static Web App hostname

# 3. Update GitHub Actions deployment target
# Update repository secrets with new deployment token
```

**RTO:** 30-60 minutes  
**RPO:** 0 (all code in Git)

---

### Scenario 5: Lost Application Insights Data

**Symptoms:**

- No telemetry appearing
- Historical data missing

**Impact:** Loss of monitoring visibility

**Recovery Procedure:**

```bash
# Application Insights data is stored in Log Analytics
# 30-day retention by default - data older than 30 days is lost

# To export data before it expires:
az monitor app-insights query \
  --app appi-infraops-static-demo-prod-weu \
  --resource-group rg-infraops-static-demo-prod \
  --analytics-query "requests | where timestamp > ago(30d)" \
  --output json > backup-requests.json

# For ongoing backup, configure Continuous Export to Storage Account
# (Requires additional Azure Storage Account configuration)
```

**RTO:** Immediate (new data flows automatically)  
**RPO:** Up to 30 days of historical data may be available

---

### DR Testing Procedures

### Quarterly DR Test

| Test                     | Procedure                      | Success Criteria                     |
| ------------------------ | ------------------------------ | ------------------------------------ |
| **IaC Deployment**       | Deploy to test resource group  | All resources created successfully   |
| **Application Rollback** | Revert and redeploy            | Previous version deployed in <10 min |
| **Full Recovery**        | Delete and recreate everything | Site operational in <30 min          |

#### DR Test Script

```bash
#!/bin/bash
# DR Test - Full Recovery

# 1. Create test resource group
TEST_RG="rg-infraops-static-demo-dr-test"
az group create --name $TEST_RG --location westeurope

# 2. Deploy infrastructure
cd /workspaces/azure-agentic-infraops-demo/infra/bicep/infraops-static-demo
az deployment group create \
  --resource-group $TEST_RG \
  --template-file main.bicep \
  --parameters environment=dev location=westeurope projectName=infraops-static-demo-dr owner=infraops-team

# 3. Verify resources
az resource list --resource-group $TEST_RG --output table

# 4. Cleanup
az group delete --name $TEST_RG --yes --no-wait

echo "DR Test Complete - Review results"
```

---

### Communication Plan

### Escalation Matrix

| Severity       | Notify               | Method       | SLA     |
| -------------- | -------------------- | ------------ | ------- |
| P1 (Site Down) | Owner, Azure Support | Email, Phone | 15 min  |
| P2 (Degraded)  | Owner                | Email, Teams | 1 hour  |
| P3 (Minor)     | Owner                | Email        | 4 hours |

### Status Page Updates

| Event           | Update Frequency | Channel               |
| --------------- | ---------------- | --------------------- |
| Outage Detected | Immediately      | Email to stakeholders |
| Investigation   | Every 30 min     | Teams channel         |
| Resolution      | Upon resolution  | Email to stakeholders |
| Post-mortem     | Within 24 hours  | Documentation         |

---

### Recovery Checklist

### Pre-Recovery

- [ ] Confirm outage scope and impact
- [ ] Notify stakeholders
- [ ] Identify root cause if possible
- [ ] Determine recovery approach

### During Recovery

- [ ] Execute recovery procedure
- [ ] Monitor deployment progress
- [ ] Verify resource creation
- [ ] Test application functionality

### Post-Recovery

- [ ] Confirm all functionality restored
- [ ] Update DNS if needed
- [ ] Notify stakeholders of resolution
- [ ] Schedule post-incident review
- [ ] Update documentation if needed

---

### Data Protection Summary

| Data Type        | Protection Method   | Retention  | Recovery     |
| ---------------- | ------------------- | ---------- | ------------ |
| Application Code | Git version control | Indefinite | Git checkout |
| Static Assets    | Git version control | Indefinite | Git checkout |
| IaC Templates    | Git version control | Indefinite | Git checkout |
| Configuration    | Git version control | Indefinite | Git checkout |
| Telemetry        | Log Analytics       | 30 days    | KQL export   |
| User Data        | None (public site)  | N/A        | N/A          |

---

### Appendix: Quick Commands

### Infrastructure Recovery

```bash
# Full infrastructure redeploy
cd /workspaces/azure-agentic-infraops-demo/infra/bicep/infraops-static-demo
./deploy.ps1 -Environment prod
```

### Application Rollback

```bash
# Git revert last commit
git revert HEAD
git push origin main
```

### Get Deployment Token

```bash
az staticwebapp secrets list \
  --name stapp-infraops-static-demo-prod \
  --resource-group rg-infraops-static-demo-prod \
  --query "properties.apiKey" -o tsv
```

### Export Telemetry

```bash
az monitor app-insights query \
  --app appi-infraops-static-demo-prod-weu \
  --resource-group rg-infraops-static-demo-prod \
  --analytics-query "requests | where timestamp > ago(7d)" \
  --output json > telemetry-backup.json
```

---

### Document Control

| Version | Date       | Author                           | Changes                        |
| ------- | ---------- | -------------------------------- | ------------------------------ |
| 1.0     | 2026-01-20 | workload-documentation-generator | Initial as-built documentation |

---

_Backup & DR Plan generated for infraops-static-demo workload._
_Review and test quarterly to ensure procedures remain current._
