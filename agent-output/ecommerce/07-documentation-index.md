# Ecommerce Platform - Workload Documentation

**Generated**: December 17, 2025
**Version**: 1.0
**Status**: Draft

## Document Package Contents

| Document                                         | Description                                  | Status      |
| ------------------------------------------------ | -------------------------------------------- | ----------- |
| [Design Document](./07-design-document.md)       | Comprehensive 10-section architecture design | ✅          |
| [Operations Runbook](./07-operations-runbook.md) | Day-2 operational procedures                 | ✅          |
| [Resource Inventory](./07-resource-inventory.md) | Complete resource listing from IaC           | ✅          |
| [Compliance Matrix](./07-compliance-matrix.md)   | PCI-DSS security controls mapping            | ✅          |
| [Backup & DR Plan](./07-backup-dr-plan.md)       | Recovery procedures and failover             | ✅          |

## Source Artifacts

These documents were generated from the following agentic workflow outputs:

| Artifact             | Source                                                           | Generated |
| -------------------- | ---------------------------------------------------------------- | --------- |
| WAF Assessment       | [01-architecture-assessment.md](./01-architecture-assessment.md) | Dec 2025  |
| Cost Estimate        | [01-cost-estimate.md](./01-cost-estimate.md)                     | Dec 2025  |
| Implementation Plan  | [04-implementation-plan.md](./04-implementation-plan.md)         | Dec 2025  |
| Architecture Diagram | [06-asbuilt-diagram.png](./06-asbuilt-diagram.png)               | Dec 2025  |
| Bicep Code           | [`infra/bicep/ecommerce/`](../../infra/bicep/ecommerce/)         | Dec 2025  |

## Project Summary

| Attribute          | Value              |
| ------------------ | ------------------ |
| **Project Name**   | Ecommerce Platform |
| **Environment**    | Production         |
| **Primary Region** | swedencentral      |
| **Compliance**     | PCI-DSS aligned    |
| **WAF Score**      | 8.0/10             |
| **Monthly Cost**   | ~$1,595            |
| **Target Users**   | 10,000 concurrent  |

## Related Resources

- **Infrastructure Code**: [`infra/bicep/ecommerce/`](../../infra/bicep/ecommerce/)
- **Legacy Outputs**: [`scenarios/scenario-output/ecommerce/`](../../scenarios/scenario-output/ecommerce/)
- **ADRs**: See `*-adr-*.md` files in this folder (if generated)

## Quick Links

- [Deployment Script](../../infra/bicep/ecommerce/deploy.ps1)
- [Main Bicep Template](../../infra/bicep/ecommerce/main.bicep)
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)
