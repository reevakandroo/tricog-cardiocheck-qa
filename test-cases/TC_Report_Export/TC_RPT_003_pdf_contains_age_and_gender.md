---
id: TC_RPT_003
module: Report Export
title: PDF contains age and gender
type: Positive
severity: High
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
PDF contains age and gender
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | age/gender |
## Steps
1. Export PDF from a processed ECG with known age and gender
2. Open PDF
3. Verify both age (numeric) and gender (Male/Female/Other) are visible in the report
## Expected Result
Age and gender are present and correctly formatted in the PDF.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
