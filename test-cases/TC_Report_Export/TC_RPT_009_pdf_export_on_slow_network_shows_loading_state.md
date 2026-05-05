---
id: TC_RPT_009
module: Report Export
title: PDF export on slow network shows loading state
type: Negative
severity: Medium
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
PDF export on slow network shows loading state
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | 3G throttle |
## Steps
1. Open DevTools → Network → set throttling to Slow 3G
2. Click Export PDF
3. Verify loading indicator appears during generation
4. Verify export completes (may be slow) or shows error without crashing
## Expected Result
Loading state shown. Export either succeeds on slow network or shows a clear timeout error.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
