---
id: TC_RPT_008
module: Report Export
title: Multiple consecutive PDF exports succeed
type: Edge
severity: Medium
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
Multiple consecutive PDF exports succeed
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | 3 rapid exports |
## Steps
1. From risk assessment screen, click Export PDF
2. Without waiting for download to complete, click again
3. Click a third time
4. Verify all 3 PDFs download correctly without errors
## Expected Result
All 3 exports succeed. No duplicate errors or crashes.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
