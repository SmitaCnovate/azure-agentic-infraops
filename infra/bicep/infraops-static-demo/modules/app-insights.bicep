// ============================================================================
// app-insights.bicep - Application Insights Module
// Workspace-based Application Insights for SPA telemetry
// Uses Azure Verified Module (AVM) - avm/res/insights/component:0.7.1
// ============================================================================

// ============================================================================
// Parameters
// ============================================================================

@description('Application Insights name following CAF convention')
param name string

@description('Azure region for deployment')
param location string

@description('Resource tags')
param tags object

@description('Log Analytics Workspace resource ID for workspace-based App Insights (recommended model)')
param workspaceResourceId string

@description('Application type for telemetry schema')
@allowed([
  'web'
  'other'
])
param applicationType string = 'web'

// ============================================================================
// Resources - Using Azure Verified Module
// ============================================================================

module appInsights 'br/public:avm/res/insights/component:0.7.1' = {
  name: 'app-insights-avm'
  params: {
    name: name
    location: location
    tags: tags
    workspaceResourceId: workspaceResourceId
    kind: 'web'
    applicationType: applicationType
    // WAF Performance: Sampling configuration
    // samplingPercentage: 100 (default - consider reducing for high-traffic apps)
    // WAF Security: IP masking for GDPR compliance
    // disableIpMasking: false (default - masks last octet of IP)
  }
}

// ============================================================================
// Outputs
// ============================================================================

@description('Application Insights resource ID')
output resourceId string = appInsights.outputs.resourceId

@description('Application Insights name')
output name string = appInsights.outputs.name

@description('Application Insights instrumentation key (legacy - prefer connection string)')
output instrumentationKey string = appInsights.outputs.instrumentationKey

@description('Application Insights connection string (recommended for SDK configuration)')
output connectionString string = appInsights.outputs.connectionString

@description('Application Insights application ID')
output applicationId string = appInsights.outputs.applicationId
