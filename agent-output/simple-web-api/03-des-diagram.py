#!/usr/bin/env python3
"""
Step 3: Design Diagram - simple-web-api

Architecture diagram for Serverless Web API with Static Web Apps, 
Azure Functions, and Cosmos DB.
Design phase (-des suffix) showing proposed architecture.

Generated: 2025-01-13
Phase: Design (Step 3)
"""

from diagrams import Cluster, Diagram, Edge
from diagrams.azure.web import AppServices
from diagrams.azure.compute import FunctionApps
from diagrams.azure.database import CosmosDb
from diagrams.azure.devops import ApplicationInsights
from diagrams.azure.storage import StorageAccounts
from diagrams.onprem.client import Users

# Diagram configuration
graph_attr = {
    "fontsize": "14",
    "bgcolor": "white",
    "pad": "0.5",
    "splines": "ortho",
}

with Diagram(
    "Simple Web API - Serverless Architecture",
    filename="03-des-diagram",
    show=False,
    direction="LR",
    graph_attr=graph_attr,
    outformat="png",
):
    # External users
    users = Users("End Users\n(10 concurrent)")

    with Cluster("Resource Group: rg-simple-web-api-dev\n(swedencentral)"):

        with Cluster("Frontend"):
            swa = AppServices("Static Web Apps\n(Free Tier)")

        with Cluster("API Layer"):
            func = FunctionApps("Azure Functions\n(Consumption)")
            storage = StorageAccounts("Storage Account\n(Functions Host)")

        with Cluster("Data Tier"):
            cosmos = CosmosDb("Cosmos DB\n(Serverless)")

        with Cluster("Monitoring"):
            insights = ApplicationInsights("Application\nInsights")

    # User flow
    users >> Edge(label="HTTPS", color="darkgreen") >> swa
    swa >> Edge(label="API Calls", color="blue") >> func
    func >> Edge(label="Managed Identity", color="purple") >> cosmos

    # Function dependencies
    func >> Edge(style="dashed", color="gray") >> storage

    # Monitoring connections (dashed)
    swa >> Edge(style="dashed", color="orange") >> insights
    func >> Edge(style="dashed", color="orange") >> insights
