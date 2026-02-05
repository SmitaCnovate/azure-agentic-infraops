// ============================================================================
// E-Commerce Platform - Parameters File
// ============================================================================
// Environment: Production
// Region: swedencentral
// ============================================================================

using 'main.bicep'

// ============================================================================
// Core Parameters
// ============================================================================

param location = 'swedencentral'
param environment = 'staging'
param projectName = 'ecommerce'
param owner = 'platform-team'
param costCenter = 'CC-ECOM-001'

// ============================================================================
// SQL Server Azure AD Admin
// ============================================================================
param sqlAdminGroupObjectId = '2bffaba4-2c0c-4358-9be1-a12b406a9a40'  // Projects team
param sqlAdminGroupName = 'sql-admins'
