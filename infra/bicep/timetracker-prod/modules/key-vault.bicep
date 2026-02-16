// Key Vault Module for TimeTracker API
// Securely stores secrets, certificates, and keys

param location string
param environment string
param uniqueSuffix string
param projectName string
param tags object

var keyVaultName = 'kv-${take(projectName, 8)}-${environment}-${take(uniqueSuffix, 6)}'

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    accessPolicies: []
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
  tags: union(tags, {
    Purpose: 'Secrets Management'
    SecurityLevel: 'Sensitive'
  })
}

@description('Key Vault resource ID')
output keyVaultId string = keyVault.id

@description('Key Vault name')
output keyVaultName string = keyVault.name

@description('Key Vault URI')
output keyVaultUri string = keyVault.properties.vaultUri
