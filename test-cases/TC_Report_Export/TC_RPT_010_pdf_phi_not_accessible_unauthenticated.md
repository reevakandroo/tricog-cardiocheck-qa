---
id: TC_RPT_010
module: Report Export
title: PDF PHI not accessible unauthenticated
type: Security
severity: Critical
preconditions: [PC_002, PC_005, PC_012]
---
## Scenario
PDF PHI not accessible unauthenticated
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Test Data
| Field | Value |
|-------|-------|
| Target field | unauthenticated PDF access |
## Steps
1. Export a PDF while authenticated
2. Intercept the network request in DevTools to find the generation endpoint
3. Copy the request and replay it in a new incognito window without auth
4. Verify 401/403 response — PDF data not returned
## Expected Result
HTTP 401 or 403 — PDF data protected behind authentication.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
