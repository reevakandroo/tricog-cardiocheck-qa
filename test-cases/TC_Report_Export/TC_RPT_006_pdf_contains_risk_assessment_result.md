---
id: TC_RPT_006
module: Report Export
title: PDF contains risk assessment result
type: Positive
severity: Critical
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
PDF contains risk assessment result
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | riskCategory and riskScore |
## Steps
1. Export PDF from ECG with known risk (e.g., High)
2. Verify PDF shows risk category and score matching what's shown on screen
## Expected Result
Risk category and score in PDF match on-screen values exactly.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
