---
mode: agent
tools:
  - run_in_terminal
  - create_file
  - read_file
  - github_repo
description: Create and deploy a demo landing page to an Azure Static Web App showcasing the Agentic InfraOps project
---

# Deploy Demo App to Static Web App

Create a React (Vite) landing page for the Azure Static Web App that showcases the
**Agentic InfraOps** project from https://github.com/jonathan-vella/azure-agentic-infraops.

## Context

- **Static Web App**: `stapp-contoso-static-demo-prod`
- **Resource Group**: `rg-contoso-static-demo-prod`
- **URL**: https://nice-coast-0450ede03.1.azurestaticapps.net

## Requirements

### Content to Include

1. **Hero Section**
   - Project name: "Agentic InfraOps"
   - Tagline: "Azure infrastructure engineered by AI agents. Verified. Well-Architected. Deployable."
   - Link to GitHub repo

2. **7-Step Workflow Visualization**
   - Plan → Architect → Design → Bicep Plan → Implement → Deploy → Document
   - Show icons and brief descriptions for each step

3. **Agent Cards**
   - Project Planner
   - Azure Principal Architect
   - Diagram Generator
   - Bicep Plan
   - Bicep Implement
   - Workload Documentation Generator

4. **Features Section**
   - Well-Architected Framework aligned
   - Cost validated (Azure Pricing MCP)
   - AVM-first approach
   - End-to-end automation

5. **Demo Stats**
   - 7 workflow steps
   - 6 custom agents
   - ~$14/month cost
   - <30 minutes to deploy

6. **Footer**
   - Link to GitHub repo
   - Project/region info

### Technical Requirements

- React + Vite (simple, no TypeScript needed)
- Modern CSS (CSS variables, grid, flexbox)
- Azure-themed colors (#0078d4, #5c2d91, #107c10, etc.)
- Mobile responsive
- Include `staticwebapp.config.json` for SPA routing

## Steps

1. Fetch context from https://github.com/jonathan-vella/azure-agentic-infraops for accurate content
2. Create `demo-app/` folder with React + Vite project
3. Build the app (`npm run build`)
4. Get deployment token:
   `az staticwebapp secrets list --name stapp-contoso-static-demo-prod \
   --resource-group rg-contoso-static-demo-prod --query "properties.apiKey" -o tsv`
5. Deploy using SWA CLI: `swa deploy ./dist --deployment-token "<token>" --env production`
6. Verify deployment at the Static Web App URL

## Output

- `demo-app/` folder with complete React application
- Built and deployed to Azure Static Web App
- Live site accessible at the Static Web App URL
