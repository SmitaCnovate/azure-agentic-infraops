# Compliance Matrix: static-webapp-test

**Generated**: December 17, 2025
**Environment**: Development
**Compliance Framework**: Azure Security Baseline (internal tool - no regulatory requirements)

---

## Compliance Summary

| Framework               | Required | Status      | Notes                  |
| ----------------------- | -------- | ----------- | ---------------------- |
| HIPAA                   | ❌       | N/A         | Not handling PHI       |
| PCI-DSS                 | ❌       | N/A         | No payment data        |
| GDPR                    | ❌       | N/A         | Internal tool, no PII  |
| SOC 2                   | ❌       | N/A         | Not required           |
| Azure Security Baseline | ✅       | Implemented | Best practices applied |

---

## Azure Security Baseline Controls

### Identity Management

| Control ID | Control                        | Status | Implementation                   |
| ---------- | ------------------------------ | ------ | -------------------------------- |
| IM-1       | Use centralized identity       | ✅     | Azure AD authentication          |
| IM-2       | Protect identity and auth      | ✅     | Azure AD with HTTPS              |
| IM-3       | Manage app identities securely | ✅     | Managed identity for SQL access  |
| IM-4       | Authenticate servers           | ✅     | Azure AD-only SQL authentication |

### Privileged Access

| Control ID | Control                  | Status | Implementation            |
| ---------- | ------------------------ | ------ | ------------------------- |
| PA-1       | Protect privileged users | ✅     | RBAC on resource group    |
| PA-2       | Avoid standing access    | ⚠️     | Not implemented (dev env) |
| PA-7       | Follow just enough admin | ✅     | Scoped to resource group  |

### Data Protection

| Control ID | Control                        | Status | Implementation               |
| ---------- | ------------------------------ | ------ | ---------------------------- |
| DP-1       | Discover and classify data     | ⚠️     | Manual (low data volume)     |
| DP-2       | Protect sensitive data         | ✅     | No sensitive data stored     |
| DP-3       | Encrypt sensitive data transit | ✅     | TLS 1.2 enforced             |
| DP-4       | Encrypt sensitive data at rest | ✅     | Azure-managed encryption     |
| DP-5       | Use customer-managed keys      | ❌     | Not required (internal tool) |

### Asset Management

| Control ID | Control                      | Status | Implementation       |
| ---------- | ---------------------------- | ------ | -------------------- |
| AM-1       | Track asset inventory        | ✅     | Azure Resource Graph |
| AM-2       | Use approved services only   | ✅     | PaaS services only   |
| AM-3       | Ensure security of lifecycle | ✅     | IaC (Bicep) managed  |

### Logging and Monitoring

| Control ID | Control                         | Status | Implementation                |
| ---------- | ------------------------------- | ------ | ----------------------------- |
| LT-1       | Enable threat detection         | ⚠️     | Basic (no Defender for Cloud) |
| LT-2       | Enable identity audit logging   | ✅     | Azure AD sign-in logs         |
| LT-3       | Enable logging for security     | ✅     | Application Insights          |
| LT-4       | Enable network logging          | ⚠️     | Limited (no VNet)             |
| LT-5       | Centralize security log mgmt    | ✅     | Log Analytics workspace       |
| LT-6       | Configure log storage retention | ✅     | 30-day retention              |

### Backup and Recovery

| Control ID | Control                         | Status | Implementation                |
| ---------- | ------------------------------- | ------ | ----------------------------- |
| BR-1       | Ensure regular automated backup | ✅     | SQL automated backup (7 days) |
| BR-2       | Protect backup and recovery     | ✅     | Azure-managed, role-protected |
| BR-3       | Monitor backups                 | ✅     | Azure Monitor                 |

### Network Security

| Control ID | Control                        | Status | Implementation             |
| ---------- | ------------------------------ | ------ | -------------------------- |
| NS-1       | Implement network segmentation | ❌     | PaaS-only, no VNet         |
| NS-2       | Connect networks with VPN      | N/A    | Not applicable             |
| NS-3       | Deploy firewall                | ⚠️     | SQL firewall only          |
| NS-4       | Deploy intrusion detection     | ❌     | Not implemented (budget)   |
| NS-5       | Deploy DDoS protection         | ⚠️     | Basic DDoS (Azure default) |

---

## Security Controls Summary

| Category          | Implemented | Partial | Not Implemented | N/A   |
| ----------------- | ----------- | ------- | --------------- | ----- |
| Identity          | 4           | 0       | 0               | 0     |
| Privileged Access | 2           | 1       | 0               | 0     |
| Data Protection   | 4           | 1       | 0               | 0     |
| Asset Management  | 3           | 0       | 0               | 0     |
| Logging           | 4           | 2       | 0               | 0     |
| Backup            | 3           | 0       | 0               | 0     |
| Network           | 0           | 3       | 1               | 1     |
| **Total**         | **20**      | **7**   | **1**           | **1** |

**Overall Compliance**: 69% Fully Implemented, 24% Partial, 3% Not Implemented

---

## Risk Acceptance

The following controls are intentionally not implemented due to cost/complexity trade-offs
for this internal development tool:

| Control           | Risk                   | Mitigation                 |
| ----------------- | ---------------------- | -------------------------- |
| Private endpoints | Public SQL endpoint    | Firewall, Azure AD auth    |
| WAF               | No WAF                 | SWA built-in protections   |
| DDoS Protection   | Basic DDoS only        | Acceptable for internal    |
| Network segment   | No VNet isolation      | Service firewalls          |

**Risk Owner**: DevOps Team
**Review Date**: Quarterly or upon scope change

---

## Recommendations for Production

If this workload moves to production or handles sensitive data:

1. ✅ Upgrade SQL to private endpoint
2. ✅ Enable Microsoft Defender for Cloud
3. ✅ Implement customer-managed keys
4. ✅ Add WAF via Front Door
5. ✅ Extend log retention to 90+ days
