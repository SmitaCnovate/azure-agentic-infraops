# Implementation Reference: Ecommerce Platform

**Generated**: December 17, 2025
**Status**: Implemented

## Bicep Code Location

The infrastructure code for this project is located at:

📁 **[`infra/bicep/ecommerce/`](../../infra/bicep/ecommerce/)**

## File Structure

```text
infra/bicep/ecommerce/
├── main.bicep           # Main orchestration template
├── main.bicepparam      # Parameter file
├── main.json            # Compiled ARM template
├── deploy.ps1           # Deployment script
├── README.md            # Deployment documentation
└── modules/             # Resource modules
    ├── network.bicep
    ├── keyvault.bicep
    ├── sql.bicep
    ├── redis.bicep
    ├── appservice.bicep
    ├── search.bicep
    ├── servicebus.bicep
    ├── functions.bicep
    ├── frontdoor.bicep
    └── monitoring.bicep
```

## Deployment

### Prerequisites

- Azure CLI 2.50+
- Bicep CLI 0.20+
- PowerShell 7+
- Azure subscription with Contributor access

### Quick Deploy

```powershell
cd infra/bicep/ecommerce
./deploy.ps1 -ResourceGroupName "rg-ecommerce-prod" -Location "swedencentral"
```

### What-If Preview

```powershell
./deploy.ps1 -ResourceGroupName "rg-ecommerce-prod" -Location "swedencentral" -WhatIf
```

## Key Resources

| Resource                | Type             | SKU         | Purpose                      |
| ----------------------- | ---------------- | ----------- | ---------------------------- |
| vnet-ecommerce-prod     | Virtual Network  | -           | Network isolation            |
| kv-ecom-prod-\*         | Key Vault        | Standard    | Secrets management           |
| asp-ecommerce-prod      | App Service Plan | P1v4        | Web hosting (zone-redundant) |
| sql-ecommerce-prod-\*   | SQL Server       | -           | Database server              |
| redis-ecommerce-prod-\* | Redis Cache      | Standard C2 | Session/cache                |
| srch-ecommerce-prod-\*  | Cognitive Search | Standard    | Product search               |
| sb-ecommerce-prod-\*    | Service Bus      | Premium     | Order messaging              |
| afd-ecommerce-prod      | Front Door       | Standard    | Global load balancing        |

## Validation

```bash
# Validate Bicep syntax
bicep build main.bicep

# Lint for best practices
bicep lint main.bicep
```

## Related Documentation

- [WAF Assessment](./01-architecture-assessment.md)
- [Cost Estimate](./01-cost-estimate.md)
- [Implementation Plan](./04-implementation-plan.md)
- [Architecture Diagram](./06-asbuilt-diagram.png)
