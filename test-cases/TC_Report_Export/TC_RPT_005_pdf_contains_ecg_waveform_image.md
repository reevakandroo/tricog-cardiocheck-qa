---
id: TC_RPT_005
module: Report Export
title: PDF contains ECG waveform image
type: Positive
severity: High
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
PDF contains ECG waveform image
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | ECG waveform strip |
## Steps
1. Export PDF
2. Open and scroll through PDF
3. Verify ECG waveform strip image is embedded and visible (not a broken image)
## Expected Result
ECG waveform strip renders as a readable image in the PDF.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
