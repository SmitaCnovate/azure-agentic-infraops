#!/usr/bin/env node

/**
 * Validates agent output in agent-output/simple-web-api for template compliance.
 * This is a focused validation for the branch validation workflow.
 */

import fs from "node:fs";
import path from "node:path";

const PROJECT = "simple-web-api";
const PROJECT_DIR = path.resolve(process.cwd(), "agent-output", PROJECT);

// Expected artifacts for simple-web-api project
const EXPECTED_ARTIFACTS = {
  "01-requirements.md": {
    agent: "@plan",
    template: ".github/templates/01-requirements.template.md",
  },
  "02-architecture-assessment.md": {
    agent: "azure-principal-architect",
    template: ".github/templates/02-architecture-assessment.template.md",
  },
  "03-des-cost-estimate.md": {
    agent: "azure-principal-architect", // via handoff after Step 2
    template: ".github/templates/cost-estimate.template.md",
  },
  "03-des-diagram.py": {
    agent: "diagram-generator",
    template: null, // Python diagram - validated separately
  },
  "03-des-diagram.png": {
    agent: "diagram-generator",
    template: null, // Generated from .py
  },
  "04-governance-constraints.md": {
    agent: "bicep-plan",
    template: null, // Policy discovery output
  },
  "04-governance-constraints.json": {
    agent: "bicep-plan",
    template: null, // Machine-readable format
  },
  "04-implementation-plan.md": {
    agent: "bicep-plan",
    template: ".github/templates/04-implementation-plan.template.md",
  },
};

// Required H2 headings per artifact type
const REQUIRED_HEADINGS = {
  "01-requirements.md": [
    "## Project Overview",
    "## Functional Requirements",
    "## Non-Functional Requirements (NFRs)",
    "## Compliance & Security Requirements",
    "## Cost Constraints",
    "## Operational Requirements",
    "## Regional Preferences",
  ],
  "02-architecture-assessment.md": [
    "## Requirements Validation ✅",
    "## Executive Summary",
    "## WAF Pillar Assessment",
    "## Resource SKU Recommendations",
    "## Architecture Decision Summary",
    "## Implementation Handoff",
    "## Approval Gate",
  ],
  "04-implementation-plan.md": [
    "## Overview",
    "## Resource Inventory",
    "## Module Structure",
    "## Implementation Tasks",
    "## Dependency Graph",
    "## Naming Conventions",
    "## Security Configuration",
    "## Estimated Implementation Time",
    "## Approval Gate",
  ],
};

let passed = 0;
let failed = 0;
let warnings = 0;

function log(icon, message) {
  console.log(`${icon} ${message}`);
}

function pass(message) {
  log("✅", message);
  passed++;
}

function fail(message) {
  log("❌", message);
  failed++;
}

function warn(message) {
  log("⚠️ ", message);
  warnings++;
}

function info(message) {
  log("ℹ️ ", message);
}

function exists(filePath) {
  return fs.existsSync(path.resolve(PROJECT_DIR, filePath));
}

function readFile(filePath) {
  return fs.readFileSync(path.resolve(PROJECT_DIR, filePath), "utf8");
}

function extractH2Headings(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.startsWith("## "));
}

function validateFileExists(filename) {
  if (exists(filename)) {
    pass(`${filename} exists`);
    return true;
  } else {
    fail(`${filename} is missing`);
    return false;
  }
}

function validateHeadingStructure(filename) {
  const required = REQUIRED_HEADINGS[filename];
  if (!required) {
    info(`${filename} - no heading validation defined (skipped)`);
    return;
  }

  if (!exists(filename)) {
    return; // Already reported as missing
  }

  const content = readFile(filename);
  const headings = extractH2Headings(content);

  // Check all required headings are present
  const missing = required.filter((h) => !headings.includes(h));
  if (missing.length > 0) {
    fail(
      `${filename} - Missing required headings: ${missing
        .map((h) => `'${h}'`)
        .join(", ")}`
    );
    return;
  }

  // Check heading order
  let lastIndex = -1;
  let orderCorrect = true;
  for (const reqHeading of required) {
    const index = headings.indexOf(reqHeading);
    if (index < lastIndex) {
      fail(
        `${filename} - Heading '${reqHeading}' is out of order (should come before earlier heading)`
      );
      orderCorrect = false;
      break;
    }
    lastIndex = index;
  }

  if (orderCorrect && missing.length === 0) {
    pass(`${filename} - All required headings present and in correct order`);
  }
}

function validateDiagram() {
  const pyFile = "03-des-diagram.py";
  const pngFile = "03-des-diagram.png";

  if (!exists(pyFile)) {
    fail(`${pyFile} is missing`);
    return;
  }

  const content = readFile(pyFile);

  // Check for required imports
  if (!content.includes("from diagrams import")) {
    warn(`${pyFile} - Missing diagrams library import`);
  }

  // Check for show=False (required for auto-generation)
  if (!content.includes("show=False")) {
    fail(`${pyFile} - Missing 'show=False' parameter (PNG auto-generation)`);
  } else {
    pass(`${pyFile} - Contains 'show=False' for auto-generation`);
  }

  // Check PNG file exists
  if (exists(pngFile)) {
    pass(`${pngFile} - PNG diagram generated`);
  } else {
    fail(`${pngFile} - PNG diagram not generated (run: python ${pyFile})`);
  }

  // Check for proper Azure imports
  if (!content.includes("from diagrams.azure.")) {
    warn(`${pyFile} - No Azure resource imports found`);
  } else {
    pass(`${pyFile} - Contains Azure resource imports`);
  }
}

function validateGovernanceConstraints() {
  const mdFile = "04-governance-constraints.md";
  const jsonFile = "04-governance-constraints.json";

  // Check markdown file
  if (exists(mdFile)) {
    const content = readFile(mdFile);

    // Check for required sections
    const requiredSections = [
      "## Active Policy Assignments",
      "## Resource-Specific Constraints",
      "## Compliance Summary",
    ];

    let allPresent = true;
    for (const section of requiredSections) {
      if (!content.includes(section)) {
        warn(`${mdFile} - Missing section: '${section}'`);
        allPresent = false;
      }
    }

    if (allPresent) {
      pass(`${mdFile} - Contains all required sections`);
    }
  } else {
    fail(`${mdFile} is missing`);
  }

  // Check JSON file
  if (exists(jsonFile)) {
    try {
      const content = readFile(jsonFile);
      const data = JSON.parse(content);

      // Validate structure
      if (!data.subscription) {
        warn(`${jsonFile} - Missing 'subscription' field`);
      }
      if (!data.policies || !Array.isArray(data.policies)) {
        warn(`${jsonFile} - Missing or invalid 'policies' array`);
      }
      if (!data.constraints) {
        warn(`${jsonFile} - Missing 'constraints' object`);
      }

      if (data.subscription && data.policies && data.constraints) {
        pass(`${jsonFile} - Valid JSON structure`);
      }
    } catch (err) {
      fail(`${jsonFile} - Invalid JSON: ${err.message}`);
    }
  } else {
    fail(`${jsonFile} is missing`);
  }
}

function validateAgentOutputMetadata() {
  for (const [filename, meta] of Object.entries(EXPECTED_ARTIFACTS)) {
    if (!exists(filename)) continue;

    const content = readFile(filename);
    const firstLines = content.split("\n").slice(0, 10).join("\n");

    // Check for agent attribution
    if (meta.agent && !firstLines.includes(meta.agent)) {
      warn(`${filename} - Missing agent attribution (expected: ${meta.agent})`);
    }

    // Check for date
    if (!firstLines.match(/202[0-9]-[0-1][0-9]-[0-3][0-9]/)) {
      warn(`${filename} - Missing or invalid date in header`);
    }
  }
}

function main() {
  console.log("🔍 Validating agent output: agent-output/simple-web-api\n");

  if (!fs.existsSync(PROJECT_DIR)) {
    console.log(`❌ Project directory not found: ${PROJECT_DIR}`);
    process.exit(1);
  }

  console.log("📋 Step 1: Checking file existence\n");
  for (const filename of Object.keys(EXPECTED_ARTIFACTS)) {
    validateFileExists(filename);
  }

  console.log("\n📐 Step 2: Validating heading structure\n");
  for (const filename of Object.keys(REQUIRED_HEADINGS)) {
    validateHeadingStructure(filename);
  }

  console.log("\n🎨 Step 3: Validating diagram generation\n");
  validateDiagram();

  console.log("\n🔐 Step 4: Validating governance constraints\n");
  validateGovernanceConstraints();

  console.log("\n📝 Step 5: Checking agent attribution\n");
  validateAgentOutputMetadata();

  console.log("\n" + "=".repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("=".repeat(60));

  if (failed > 0) {
    console.log("\n❌ Validation FAILED");
    process.exit(1);
  } else if (warnings > 0) {
    console.log("\n⚠️  Validation passed with warnings");
    process.exit(0);
  } else {
    console.log("\n✅ Validation PASSED - all checks successful!");
    process.exit(0);
  }
}

main();
