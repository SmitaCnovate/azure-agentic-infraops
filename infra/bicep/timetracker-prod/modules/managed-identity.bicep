// Managed Identity Module for TimeTracker API
// Provides identity-based authentication for Azure services

param location string
param environment string
param projectName string
param tags object

var identityName = 'id-${projectName}-${environment}'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
  tags: tags
}

@description('Managed Identity resource ID')
output identityId string = managedIdentity.id

@description('Managed Identity principal ID (for role assignments)')
output principalId string = managedIdentity.properties.principalId

@description('Managed Identity client ID')
output clientId string = managedIdentity.properties.clientId
