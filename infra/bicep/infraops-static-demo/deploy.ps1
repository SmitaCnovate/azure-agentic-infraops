<#
.SYNOPSIS
    Deploys the infraops-static-demo infrastructure to Azure.

.DESCRIPTION
    This script deploys a Static Web App with Application Insights telemetry
    using Bicep templates and Azure Verified Modules.

    Features:
    - Pre-flight validation (Azure CLI, Bicep CLI, authentication)
    - Bicep build and lint validation
    - What-If preview before deployment
    - User confirmation before actual deployment
    - Resource endpoint display after deployment

.PARAMETER Environment
    Target environment (dev, staging, prod). Default: prod

.PARAMETER ResourceGroupName
    Name of the resource group. Default: rg-infraops-static-demo-{environment}

.PARAMETER Location
    Azure region for deployment. Default: westeurope

.PARAMETER WhatIf
    Preview changes without deploying (automatic with -WhatIf switch)

.EXAMPLE
    # Preview deployment
    ./deploy.ps1 -WhatIf

.EXAMPLE
    # Deploy to production
    ./deploy.ps1 -Environment prod

.EXAMPLE
    # Deploy with custom resource group
    ./deploy.ps1 -ResourceGroupName my-custom-rg -Location westeurope
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [ValidateSet('dev', 'staging', 'prod')]
    [string]$Environment = 'prod',

    [Parameter()]
    [string]$ResourceGroupName,

    [Parameter()]
    [ValidateSet('westeurope', 'swedencentral', 'germanywestcentral', 'northeurope')]
    [string]$Location = 'westeurope',

    [Parameter()]
    [string]$ProjectName = 'infraops-static-demo',

    [Parameter()]
    [string]$Owner = 'infraops-team'
)

# ============================================================================
# Configuration
# ============================================================================

$ErrorActionPreference = 'Stop'
$InformationPreference = 'Continue'

$ScriptRoot = $PSScriptRoot
$MainBicepFile = Join-Path $ScriptRoot 'main.bicep'
$ParamFile = Join-Path $ScriptRoot 'main.bicepparam'

# Default resource group name if not provided
if (-not $ResourceGroupName) {
    $ResourceGroupName = "rg-$ProjectName-$Environment"
}

# ============================================================================
# Helper Functions
# ============================================================================

function Write-Banner {
    param([string]$Title)
    $line = '=' * 70
    Write-Host ""
    Write-Host $line -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host $line -ForegroundColor Cyan
    Write-Host ""
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "┌$('─' * 68)┐" -ForegroundColor DarkGray
    Write-Host "│  $Title$(' ' * (66 - $Title.Length))│" -ForegroundColor DarkGray
    Write-Host "└$('─' * 68)┘" -ForegroundColor DarkGray
}

function Write-Step {
    param(
        [int]$Number,
        [int]$Total,
        [string]$Message
    )
    Write-Host "  [$Number/$Total] $Message" -ForegroundColor White
}

function Write-SubStep {
    param([string]$Message)
    Write-Host "      └─ $Message" -ForegroundColor DarkGray
}

function Write-Success {
    param([string]$Message)
    Write-Host "  ✓ $Message" -ForegroundColor Green
}

function Write-WarningMessage {
    param([string]$Message)
    Write-Host "  ⚠ $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host "  ✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Label, [string]$Value)
    Write-Host "      • $Label" -NoNewline -ForegroundColor DarkGray
    Write-Host ": $Value" -ForegroundColor White
}

# ============================================================================
# Banner
# ============================================================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   INFRAOPS STATIC DEMO - Azure Infrastructure Deployment              ║" -ForegroundColor Cyan
Write-Host "║   Static Web App + Application Insights (Agentic InfraOps)            ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Deployment Configuration Summary
# ============================================================================

Write-Section "DEPLOYMENT CONFIGURATION"
Write-Host ""
Write-Info "Environment" $Environment
Write-Info "Resource Group" $ResourceGroupName
Write-Info "Location" $Location
Write-Info "Project" $ProjectName
Write-Info "Owner" $Owner
Write-Info "WhatIf Mode" $(if ($WhatIfPreference) { "Yes (preview only)" } else { "No (actual deployment)" })
Write-Host ""

# ============================================================================
# Pre-flight Checks
# ============================================================================

Write-Section "PRE-FLIGHT CHECKS"
Write-Host ""

$totalSteps = 5
$currentStep = 0

# Check Azure CLI
$currentStep++
Write-Step $currentStep $totalSteps "Checking Azure CLI..."
$azVersion = az version --output json 2>$null | ConvertFrom-Json
if (-not $azVersion) {
    Write-ErrorMessage "Azure CLI not found. Install from https://aka.ms/installazurecli"
    exit 1
}
Write-SubStep "Azure CLI version: $($azVersion.'azure-cli')"

# Check Bicep CLI
$currentStep++
Write-Step $currentStep $totalSteps "Checking Bicep CLI..."
$bicepVersion = az bicep version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-WarningMessage "Bicep CLI not installed. Installing..."
    az bicep install
}
$bicepVersion = az bicep version 2>&1
Write-SubStep "Bicep version: $($bicepVersion -replace 'Bicep CLI version ', '')"

# Check Azure authentication
$currentStep++
Write-Step $currentStep $totalSteps "Checking Azure authentication..."
$account = az account show --output json 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-ErrorMessage "Not logged in to Azure. Run 'az login' first."
    exit 1
}
Write-SubStep "Subscription: $($account.name)"
Write-SubStep "Tenant: $($account.tenantId)"

# Validate Bicep template
$currentStep++
Write-Step $currentStep $totalSteps "Validating Bicep template (bicep build)..."
$buildOutput = az bicep build --file $MainBicepFile 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-ErrorMessage "Bicep build failed:"
    Write-Host $buildOutput -ForegroundColor Red
    exit 1
}
Write-SubStep "Build successful"

# Lint Bicep template
$currentStep++
Write-Step $currentStep $totalSteps "Linting Bicep template..."
$lintOutput = az bicep lint --file $MainBicepFile 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-WarningMessage "Bicep lint warnings:"
    Write-Host $lintOutput -ForegroundColor Yellow
} else {
    Write-SubStep "Lint passed"
}

Write-Host ""
Write-Success "Pre-flight checks completed"

# ============================================================================
# Resource Group
# ============================================================================

Write-Section "RESOURCE GROUP"
Write-Host ""

$rgExists = az group exists --name $ResourceGroupName 2>$null
if ($rgExists -eq 'false') {
    Write-Step 1 1 "Creating resource group '$ResourceGroupName'..."
    if ($PSCmdlet.ShouldProcess($ResourceGroupName, "Create Resource Group")) {
        az group create --name $ResourceGroupName --location $Location --tags "Environment=$Environment" "ManagedBy=Bicep" "Project=$ProjectName" --output none
        Write-SubStep "Resource group created"
    }
} else {
    Write-SubStep "Resource group already exists"
}

# ============================================================================
# What-If Analysis
# ============================================================================

Write-Section "WHAT-IF ANALYSIS"
Write-Host ""

Write-Step 1 1 "Running what-if analysis..."
Write-Host ""

$whatIfResult = az deployment group what-if `
    --resource-group $ResourceGroupName `
    --template-file $MainBicepFile `
    --parameters environment=$Environment location=$Location projectName=$ProjectName owner=$Owner `
    --result-format FullResourcePayloads `
    --output json 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-ErrorMessage "What-if analysis failed:"
    Write-Host $whatIfResult -ForegroundColor Red
    exit 1
}

# Parse what-if results
$whatIfJson = $whatIfResult | ConvertFrom-Json -ErrorAction SilentlyContinue
$changes = @{
    Create = 0
    Modify = 0
    Delete = 0
    NoChange = 0
    Ignore = 0
}

if ($whatIfJson -and $whatIfJson.changes) {
    foreach ($change in $whatIfJson.changes) {
        switch ($change.changeType) {
            'Create' { $changes.Create++ }
            'Modify' { $changes.Modify++ }
            'Delete' { $changes.Delete++ }
            'NoChange' { $changes.NoChange++ }
            'Ignore' { $changes.Ignore++ }
        }
    }
}

# Display change summary
Write-Host ""
Write-Host "┌─────────────────────────────────────┐" -ForegroundColor White
Write-Host "│  CHANGE SUMMARY                     │" -ForegroundColor White
Write-Host "│  + Create: $($changes.Create) resources$(' ' * (21 - $changes.Create.ToString().Length))│" -ForegroundColor Green
Write-Host "│  ~ Modify: $($changes.Modify) resources$(' ' * (21 - $changes.Modify.ToString().Length))│" -ForegroundColor Yellow
Write-Host "│  - Delete: $($changes.Delete) resources$(' ' * (21 - $changes.Delete.ToString().Length))│" -ForegroundColor Red
Write-Host "└─────────────────────────────────────┘" -ForegroundColor White
Write-Host ""

# If WhatIf mode, stop here
if ($WhatIfPreference) {
    Write-Success "What-if analysis complete. No changes were made."
    Write-Host ""
    Write-Host "  To deploy, run without -WhatIf:" -ForegroundColor DarkGray
    Write-Host "  ./deploy.ps1 -Environment $Environment" -ForegroundColor White
    Write-Host ""
    exit 0
}

# ============================================================================
# Confirmation
# ============================================================================

Write-Host ""
Write-Host "  Do you want to proceed with deployment? " -NoNewline -ForegroundColor Yellow
$confirmation = Read-Host "(yes/no)"

if ($confirmation -ne 'yes' -and $confirmation -ne 'y') {
    Write-Host ""
    Write-WarningMessage "Deployment cancelled by user."
    exit 0
}

# ============================================================================
# Deployment
# ============================================================================

Write-Section "DEPLOYING RESOURCES"
Write-Host ""

Write-Step 1 1 "Deploying Bicep template..."
Write-Host ""

$deploymentName = "infraops-static-demo-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

$deployResult = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file $MainBicepFile `
    --parameters environment=$Environment location=$Location projectName=$ProjectName owner=$Owner `
    --name $deploymentName `
    --output json 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-ErrorMessage "Deployment failed:"
    Write-Host $deployResult -ForegroundColor Red
    exit 1
}

$deployment = $deployResult | ConvertFrom-Json

# ============================================================================
# Deployment Results
# ============================================================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✓ DEPLOYMENT SUCCESSFUL                                             ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Section "DEPLOYED RESOURCES"
Write-Host ""

if ($deployment.properties.outputs) {
    $outputs = $deployment.properties.outputs

    Write-Info "Log Analytics Workspace" $outputs.logAnalyticsWorkspaceName.value
    Write-Info "Application Insights" $outputs.appInsightsName.value
    Write-Info "Static Web App" $outputs.staticWebAppName.value
    Write-Host ""
    Write-Info "Static Web App URL" $outputs.staticWebAppUrl.value
}

# ============================================================================
# Next Steps
# ============================================================================

Write-Section "NEXT STEPS"
Write-Host ""
Write-Host "  1. Connect your GitHub repository to the Static Web App:" -ForegroundColor White
Write-Host "     az staticwebapp users invite --name $($outputs.staticWebAppName.value) --roles admin --invitation-expiration-in-hours 24" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  2. Configure Application Insights in your React app:" -ForegroundColor White
Write-Host "     npm install @microsoft/applicationinsights-web" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  3. View your static web app:" -ForegroundColor White
Write-Host "     $($outputs.staticWebAppUrl.value)" -ForegroundColor Cyan
Write-Host ""

# Cleanup ARM JSON if generated
$armJsonPath = Join-Path $ScriptRoot 'main.json'
if (Test-Path $armJsonPath) {
    Remove-Item $armJsonPath -Force
    Write-SubStep "Cleaned up generated ARM template"
}

Write-Host ""
