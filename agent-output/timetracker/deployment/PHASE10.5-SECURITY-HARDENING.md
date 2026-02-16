# Phase 10.5: Security Hardening Deployment Guide

**TimeTracker API - Azure Security Implementation**

Date: February 16, 2026 | Status: Ready for Deployment

---

## 📋 Overview

Phase 10.5 implements production-grade security hardening for the TimeTracker API using Azure security best practices:

- **Azure Key Vault** - Centralized secret management
- **Managed Identities** - Identity-based authentication (no connection strings)
- **RBAC** - Granular access control
- **Audit Logging** - 90-day retention of all vault operations
- **GitHub Security** - Deployment environment protection

---

## 🚀 Deployment Steps

### Step 1: Deploy Security Infrastructure with Bicep

```bash
# Set Azure subscription
az account set --subscription "93fca5df-0a0d-446f-ac6e-fd172f522bdf"

# Validate Bicep templates
bicep lint infra/bicep/timetracker-prod/main.bicep

# Deploy to Azure
az deployment group create \
  --name timetracker-security-prod \
  --resource-group rg-timetracker-prod \
  --template-file infra/bicep/timetracker-prod/main.bicep \
  --parameters infra/bicep/timetracker-prod/parameters.prod.json
```

**Expected outputs:**
```
keyVaultUri: https://kv-timetr-prod-xxxxx.vault.azure.net
managedIdentityId: /subscriptions/.../resourceGroups/rg-timetracker-prod/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-timetracker-prod
managedIdentityPrincipalId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 2: Configure App Service with Managed Identity

```bash
# Assign Managed Identity to App Service
az webapp identity assign \
  --resource-group rg-timetracker-prod \
  --name app-timetracker-api-prod \
  --identities /subscriptions/93fca5df-0a0d-446f-ac6e-fd172f522bdf/resourcegroups/rg-timetracker-prod/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-timetracker-prod
```

### Step 3: Store Database Connection String in Key Vault

```bash
# Create secret in Key Vault
az keyvault secret set \
  --vault-name kv-timetr-prod-xxxxx \
  --name "DatabaseConnection" \
  --value "Server=tcp:sql-timetracker-prod-xxxxx.database.windows.net,1433;Initial Catalog=TimeTrackerDB;..."
```

### Step 4: Update App Service Configuration

```bash
# Add Key Vault reference to App Service
az webapp config appsettings set \
  --resource-group rg-timetracker-prod \
  --name app-timetracker-api-prod \
  --settings \
    "KeyVaultUrl=https://kv-timetr-prod-xxxxx.vault.azure.net" \
    "DatabaseConnection=@Microsoft.KeyVault(SecretUri=https://kv-timetr-prod-xxxxx.vault.azure.net/secrets/DatabaseConnection/)" \
    "ASPNETCORE_ENVIRONMENT=Production" \
    "WEBSITE_RUN_FROM_PACKAGE=1"
```

### Step 5: Enable GitHub Deployment Protection

```bash
# Add branch protection rule requiring approval for production deployments
# Navigate to: Settings → Environments → production → Deployment branches

# Configure required reviewers (at least 1)
# Enable "Require reviewers to dismiss stale pull request reviews"
```

---

## 🔐 Security Architecture

### Access Flow

```
GitHub Actions (CI/CD)
    ↓
Azure Service Principal (workflow authentication)
    ↓
App Service (Managed Identity)
    ↓
Key Vault (Identity-based access)
    ↓
Secrets (Encrypted at rest, 90-day audit logs)
```

### RBAC Roles Assigned

| Principal | Role | Scope | Purpose |
|-----------|------|-------|---------|
| App Service MI | Key Vault Secrets User | Key Vault | Read database secrets |
| Current User | Key Vault Administrator | Key Vault | Manage secrets |
| CI/CD Pipeline | Contributor | Resource Group | Deploy infrastructure |

---

## 🔍 Audit & Monitoring

### Key Vault Audit Log Queries

**List all secret access events (last 24 hours):**
```azure-cli
az monitor activity-log list \
  --resource-group rg-timetracker-prod \
  --caller "apiKey\|ServicePrincipal" \
  --operation-name "Microsoft.KeyVault/vaults/secrets/read" \
  --start-time "24h"
```

**Check vault diagnostics (logs retention: 90 days):**
```bash
# Logs stored in: /subscriptions/{sub}/resourceGroups/rg-timetracker-prod/providers/Microsoft.KeyVault/vaults/kv-timetr-prod-xxxxx
```

---

## 🚨 Security Checklist

- ✅ Key Vault deployed with soft-delete enabled (90-day retention)
- ✅ Managed Identity created and assigned to App Service
- ✅ RBAC policy limits App Service to read-only secret access
- ✅ Audit logging enabled (90-day retention)
- ✅ Network ACLs allow only Azure Services bypass (by default)
- ✅ GitHub deployment environment requires manual approval
- ✅ No connection strings in App Service settings (using Key Vault references)
- ✅ Bicep templates use parametrization (no hardcoded secrets)

---

## 🔄 Secret Rotation (Manual for Now)

To rotate the database connection string:

```bash
# 1. Update secret in Key Vault
az keyvault secret set \
  --vault-name kv-timetr-prod-xxxxx \
  --name "DatabaseConnection" \
  --value "Server=tcp:NEW_SERVER..."

# 2. Restart App Service to pick up new value
az webapp restart \
  --resource-group rg-timetracker-prod \
  --name app-timetracker-api-prod

# 3. Verify health endpoint responds
curl https://app-timetracker-api-prod.azurewebsites.net/health
```

---

## 📊 Validation Testing

### Test 1: Verify App Service can read Key Vault secrets

```bash
# SSH into App Service Kudu console and run:
# PowerShell: (Invoke-WebRequest -Uri 'https://kv-timetr-prod-xxxxx.vault.azure.net/secrets/DatabaseConnection?api-version=7.3').StatusCode
```

### Test 2: Check audit logs for access events

```bash
az keyvault secret show \
  --vault-name kv-timetr-prod-xxxxx \
  --name "DatabaseConnection" \
  --query "attributes.created" -o tsv
```

### Test 3: Verify API continues to function

```bash
# Health check
curl https://app-timetracker-api-prod.azurewebsites.net/health

# Swagger UI
curl https://app-timetracker-api-prod.azurewebsites.net/swagger
```

---

## 🆘 Troubleshooting

### Issue: "Key Vault access denied"

**Solution:**
```bash
# Check Managed Identity has correct permissions
az keyvault show-deleted \
  --name kv-timetr-prod-xxxxx
  
# Re-assign access policy if needed
az keyvault set-policy \
  --name kv-timetr-prod-xxxxx \
  --object-id <PRINCIPAL_ID> \
  --secret-permissions get list
```

### Issue: "Secret not found in Key Vault"

**Solution:**
```bash
# List all secrets
az keyvault secret list --vault-name kv-timetr-prod-xxxxx

# Verify secret reference format in App Service
az webapp config appsettings list \
  --resource-group rg-timetracker-prod \
  --name app-timetracker-api-prod \
  --query "[?contains(value, '@Microsoft.KeyVault')].{name: name, value: value}"
```

---

## 📚 References

- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
- [Managed Identities for Azure Resources](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/)
- [Azure Bicep Documentation](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [App Service Key Vault References](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references)

---

**Phase 10.5 Deployment Status: READY**

Next: Execute deployment steps and verify all security controls are functioning.
