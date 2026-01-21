// ============================================================================
// static-web-app.bicep - Static Web App Module
// Azure Static Web Apps Standard tier for React SPA hosting
// Uses Azure Verified Module (AVM) - avm/res/web/static-site:0.9.3
// ============================================================================

// ============================================================================
// Parameters
// ============================================================================

@description('Static Web App name following CAF convention')
param name string

@description('Azure region for deployment')
param location string

@description('Resource tags')
param tags object

@description('Application Insights connection string for telemetry')
@secure()
param appInsightsConnectionString string

@description('Application Insights instrumentation key for legacy SDK')
@secure()
param appInsightsInstrumentationKey string

@description('Static Web App SKU tier (Standard for 99.9% SLA)')
@allowed([
  'Free'
  'Standard'
])
param sku string = 'Standard'

@description('Enable staging environments for preview branches (WAF: Reliability)')
@allowed([
  'Enabled'
  'Disabled'
])
param stagingEnvironmentPolicy string = 'Enabled'

@description('Allow configuration file updates (staticwebapp.config.json)')
param allowConfigFileUpdates bool = true

// ============================================================================
// Resources - Using Azure Verified Module
// ============================================================================

module staticWebApp 'br/public:avm/res/web/static-site:0.9.3' = {
  name: 'static-web-app-avm'
  params: {
    name: name
    location: location
    tags: tags
    sku: sku
    stagingEnvironmentPolicy: stagingEnvironmentPolicy
    allowConfigFileUpdates: allowConfigFileUpdates
    // App settings for Application Insights integration
    appSettings: {
      APPLICATIONINSIGHTS_CONNECTION_STRING: appInsightsConnectionString
      APPINSIGHTS_INSTRUMENTATIONKEY: appInsightsInstrumentationKey
    }
    // WAF Security: Enterprise-grade auth (optional - requires custom provider)
    // provider: 'Custom'
    // WAF Performance: Enterprise CDN (optional - additional cost)
    // enterpriseGradeCdnStatus: 'Disabled'
  }
}

// ============================================================================
// Outputs
// ============================================================================

@description('Static Web App resource ID')
output resourceId string = staticWebApp.outputs.resourceId

@description('Static Web App name')
output name string = staticWebApp.outputs.name

@description('Static Web App default hostname (*.azurestaticapps.net)')
output defaultHostname string = staticWebApp.outputs.defaultHostname
