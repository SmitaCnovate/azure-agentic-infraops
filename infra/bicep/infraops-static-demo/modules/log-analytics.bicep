// ============================================================================
// log-analytics.bicep - Log Analytics Workspace Module
// Centralized log storage for Application Insights telemetry
// Uses Azure Verified Module (AVM) - avm/res/operational-insights/workspace:0.15.0
// ============================================================================

// ============================================================================
// Parameters
// ============================================================================

@description('Log Analytics Workspace name following CAF convention')
param name string

@description('Azure region for deployment')
param location string

@description('Resource tags')
param tags object

@description('Data retention period in days (WAF: Cost optimization - 30 days minimizes storage costs)')
@minValue(30)
@maxValue(730)
param retentionInDays int = 30

@description('Log Analytics pricing tier (PerGB2018 recommended for pay-as-you-go)')
@allowed([
  'PerGB2018'
  'Free'
  'Standalone'
  'PerNode'
  'Standard'
  'Premium'
])
param sku string = 'PerGB2018'

// ============================================================================
// Resources - Using Azure Verified Module
// ============================================================================

module logAnalyticsWorkspace 'br/public:avm/res/operational-insights/workspace:0.15.0' = {
  name: 'log-analytics-avm'
  params: {
    name: name
    location: location
    tags: tags
    skuName: sku
    dataRetention: retentionInDays
    // WAF Security: Network access settings
    // For production, consider restricting these:
    // publicNetworkAccessForIngestion: 'Disabled'
    // publicNetworkAccessForQuery: 'Disabled'
  }
}

// ============================================================================
// Outputs
// ============================================================================

@description('Log Analytics Workspace resource ID')
output resourceId string = logAnalyticsWorkspace.outputs.resourceId

@description('Log Analytics Workspace name')
output name string = logAnalyticsWorkspace.outputs.name

@description('Log Analytics Workspace Log Analytics Workspace ID (GUID)')
output logAnalyticsWorkspaceId string = logAnalyticsWorkspace.outputs.logAnalyticsWorkspaceId
