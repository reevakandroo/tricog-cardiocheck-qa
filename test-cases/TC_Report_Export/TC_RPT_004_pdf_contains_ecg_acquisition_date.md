---
id: TC_RPT_004
module: Report Export
title: PDF contains ECG acquisition date
type: Positive
severity: High
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
PDF contains ECG acquisition date
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | deviceAcquisitionTime |
## Steps
1. Export PDF
2. Verify acquisition date/time is shown in the report (format: YYYY-MM-DD HH:MM)
## Expected Result
Acquisition date/time is correct and formatted.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
