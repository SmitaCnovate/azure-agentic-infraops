// TimeTracker Production Infrastructure with Security Hardening
// Phase 10.5: Security Hardening

targetScope = 'resourceGroup'

param location string = 'swedencentral'
param environment string = 'prod'
param projectName string = 'timetracker'

var uniqueSuffix = uniqueString(resourceGroup().id)
var commonTags = {
  Environment: environment
  Project: projectName
  ManagedBy: 'Bicep'
  Phase: '10.5-SecurityHardening'
}

// Deploy Managed Identity
module managedIdentity './modules/managed-identity.bicep' = {
  name: 'managedIdentity-${uniqueString(deployment().name)}'
  params: {
    location: location
    environment: environment
    projectName: projectName
    tags: commonTags
  }
}

// Deploy Key Vault
module keyVault './modules/key-vault.bicep' = {
  name: 'keyVault-${uniqueString(deployment().name)}'
  params: {
    location: location
    environment: environment
    uniqueSuffix: uniqueSuffix
    projectName: projectName
    tags: commonTags
  }
}

// Grant Managed Identity access to Key Vault
module keyVaultAccessPolicy './modules/kv-access-policy.bicep' = {
  name: 'keyVaultAccessPolicy-${uniqueString(deployment().name)}'
  params: {
    keyVaultName: keyVault.outputs.keyVaultName
    principalId: managedIdentity.outputs.principalId
  }
}

// Output security endpoints
@description('Key Vault URI for app configuration')
output keyVaultUri string = keyVault.outputs.keyVaultUri

@description('Managed Identity ID for RBAC assignments')
output managedIdentityId string = managedIdentity.outputs.identityId

@description('Managed Identity Principal ID for role assignments')
output managedIdentityPrincipalId string = managedIdentity.outputs.principalId

@description('App Service connection string for Key Vault')
output appServiceKeyVaultConnection string = keyVault.outputs.keyVaultUri
