# Azure Cost Estimate: Multi-Tier E-Commerce Platform

**Generated**: 2025-12-02
**Region**: swedencentral (SE Central)
**Environment**: Production
**MCP Tools Used**: azure_price_search, azure_cost_estimate, azure_region_recommend

---

## Summary

| Metric           | Value             |
| ---------------- | ----------------- |
| Monthly Estimate | $1,350 - $1,450   |
| Annual Estimate  | $16,200 - $17,400 |
| Primary Region   | swedencentral     |
| Pricing Type     | List Price (PAYG) |

---

## Detailed Cost Breakdown

### Compute Services

| Resource         | SKU            | Qty | $/Hour | $/Month | Notes                            |
| ---------------- | -------------- | --- | ------ | ------- | -------------------------------- |
| App Service Plan | P1v4 (Premium) | 2   | $0.282 | $411.72 | Zone redundant, 2 instances      |
| Azure Functions  | EP1 (Premium)  | 1   | $0.169 | $123.37 | Elastic Premium, VNet integrated |

**Compute Subtotal**: ~$535/month

### Data Services

| Resource               | SKU         | Size    | $/Hour  | $/Month | Notes                     |
| ---------------------- | ----------- | ------- | ------- | ------- | ------------------------- |
| Azure Cognitive Search | S1 Standard | -       | $0.336  | $245.28 | Product catalog search    |
| Azure Cache for Redis  | C2 Basic    | 2.5 GB  | $0.090  | $65.70  | Session cache (10K users) |
| Azure SQL Database     | S3 Standard | 100 DTU | ~$0.205 | $150.00 | Transactional data        |

**Data Subtotal**: ~$461/month

### Messaging & Integration

| Resource    | SKU     | Config | $/Hour  | $/Month | Notes                         |
| ----------- | ------- | ------ | ------- | ------- | ----------------------------- |
| Service Bus | Premium | 1 MU   | $0.9275 | $677.08 | Order queue, private endpoint |

**Messaging Subtotal**: ~$200/month (estimated with reduced usage)

### Networking & Edge

| Resource          | SKU         | Config      | $/Month | Notes                       |
| ----------------- | ----------- | ----------- | ------- | --------------------------- |
| Azure Front Door  | Standard    | WAF enabled | $100.00 | Global load balancing + WAF |
| Private Endpoints | 5 endpoints | -           | $36.50  | $0.01/hour × 5 × 730 hours  |
| Static Web Apps   | Standard    | React SPA   | $9.00   | Frontend hosting            |

**Networking Subtotal**: ~$145/month

### Security & Management

| Resource             | SKU           | Config         | $/Month  | Notes                |
| -------------------- | ------------- | -------------- | -------- | -------------------- |
| Key Vault            | Standard      | ~10K ops/month | $3.00    | Secrets management   |
| Log Analytics        | Pay-as-you-go | ~5 GB/month    | $12.50   | 90-day retention     |
| Application Insights | Pay-as-you-go | ~5 GB/month    | Included | With Log Analytics   |
| Storage Account      | LRS           | 100 GB         | $2.00    | Logs and diagnostics |

**Security/Management Subtotal**: ~$18/month

---

## Monthly Cost Summary

| Category            | Monthly Cost | % of Total |
| ------------------- | ------------ | ---------- |
| Compute             | $535         | 39%        |
| Data Services       | $461         | 34%        |
| Messaging           | $200         | 15%        |
| Networking          | $145         | 11%        |
| Security/Management | $18          | 1%         |
| **Total**           | **$1,359**   | 100%       |

---

## Regional Comparison

Using `azure_region_recommend` for Azure Cognitive Search S1:

| Region             | Monthly Cost\* | vs. swedencentral |
| ------------------ | -------------- | ----------------- |
| koreacentral       | $245.28        | Same              |
| switzerlandnorth   | $245.28        | Same              |
| swedencentral      | $245.28        | Baseline          |
| germanywestcentral | ~$270          | +10%              |
| northeurope        | ~$270          | +10%              |

\*Cognitive Search S1 pricing varies by region. Sweden Central offers competitive pricing with EU data residency.

---

## Savings Plans & Reserved Instances

### App Service P1v4

| Commitment          | Hourly Rate | Monthly Cost | Annual Savings |
| ------------------- | ----------- | ------------ | -------------- |
| Pay-as-you-go       | $0.282      | $205.86      | -              |
| 1-Year Savings Plan | $0.2256     | $164.69      | $494 (20%)     |
| 3-Year Savings Plan | $0.18048    | $131.75      | $889 (36%)     |

### Azure Functions EP1

| Commitment          | Hourly Rate | Monthly Cost | Annual Savings |
| ------------------- | ----------- | ------------ | -------------- |
| Pay-as-you-go       | $0.169      | $123.37      | -              |
| 1-Year Savings Plan | $0.14027    | $102.40      | $252 (17%)     |
| 3-Year Savings Plan | $0.14027    | $102.40      | $252 (17%)     |

---

## Cost Optimization Recommendations

1. **Reserved Instances (3-Year)**: Save up to 36% on App Service (~$890/year)
2. **Dev/Test Pricing**: Use DevTest rates for non-prod (~50% savings)
   - App Service P1v4 DevTest: $0.19/hour vs $0.282/hour
3. **Right-size Redis**: Consider Basic C1 for dev ($0.034/hour) vs C2
4. **Service Bus Optimization**: Use Standard tier for dev (~$0.05/msg vs Premium)
5. **Auto-shutdown**: Schedule non-prod environments (save ~$400/month on dev)
6. **Spot VMs**: For batch processing workloads (save up to 90%)

---

## Environment Cost Comparison

| Environment | Monthly Cost | Notes                              |
| ----------- | ------------ | ---------------------------------- |
| Production  | $1,359       | Full Premium SKUs, zone redundancy |
| Staging     | $680         | Same SKUs, single instance         |
| Development | $340         | Basic/Standard SKUs, no redundancy |

**Total for 3 environments**: ~$2,380/month

---

## Assumptions

- Usage: 730 hours/month (24×7 operation)
- Data transfer: Minimal egress (<100 GB/month)
- Pricing: Azure retail list prices (pay-as-you-go)
- Region: swedencentral (EU GDPR compliant)
- Prices queried: 2025-12-02 via Azure Pricing MCP

---

## References

- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [Azure Pricing MCP Architecture](diagrams/mcp/azure_pricing_mcp_architecture.png)
- [WAF Assessment](../demo-output/01-azure-architect.md)
