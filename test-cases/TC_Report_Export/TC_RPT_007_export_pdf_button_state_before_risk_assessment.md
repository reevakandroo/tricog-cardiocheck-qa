---
id: TC_RPT_007
module: Report Export
title: Export PDF button state before risk assessment
type: Edge
severity: Medium
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
Export PDF button state before risk assessment
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | Export button disabled/enabled |
## Steps
1. Open a new ECG (patient data not yet submitted)
2. Verify Export PDF button is disabled or absent
3. Submit patient data and get risk assessment
4. Verify Export PDF button becomes active
## Expected Result
Export PDF button disabled before risk assessment; enabled after.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
