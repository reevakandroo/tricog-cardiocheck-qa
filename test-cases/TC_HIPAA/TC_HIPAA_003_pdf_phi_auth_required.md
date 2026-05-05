---
id: TC_HIPAA_003
module: HIPAA Compliance
title: PDF report requires authentication to access
type: HIPAA
severity: Critical
preconditions: [PC_005, PC_012]
---
## Scenario
Verify PDF export is not accessible via direct unauthenticated URL (HIPAA §164.312(a)(1)).
## Preconditions
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - Risk assessment complete
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - PDF viewer available
## Steps
1. Export a PDF while authenticated — note the download URL or blob
2. Open a new incognito browser window (no session)
3. Attempt to navigate to the PDF URL directly
4. Also try: intercept the PDF network request, copy the request URL, replay it without auth headers
## Expected Result
PDF is either a local blob (not remotely accessible) or the API endpoint returns 401/403 for unauthenticated requests. PHI in PDF must not be accessible without valid session.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
