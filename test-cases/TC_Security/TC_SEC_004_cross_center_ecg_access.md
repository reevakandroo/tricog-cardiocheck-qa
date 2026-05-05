---
id: TC_SEC_004
module: Security
title: Cross-Center ECG Access — Unauthorized Center's ECG Returns 403 or Redirects
type: Security
severity: Critical
preconditions: [PC_001, PC_002, PC_010]
---

## Scenario
A user authenticated to Center A attempts to directly access an ECG record that belongs to Center B by guessing or constructing a direct URL (e.g., `/ecg/<center-b-ecg-id>/patient`). The backend must reject the request with a 403 Forbidden, and the frontend must not render any ECG data from the unauthorized center.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User is logged in and on the ECG dashboard (currently scoped to Center A)
- [PC_010](../preconditions/PC_010_multi_center_access.md) - The account has access to multiple centers, or a known ECG ID from a different center/user is available for the test

## Test Data
| Field              | Value                                                         |
|--------------------|---------------------------------------------------------------|
| Active center      | Center A (current session center)                             |
| Target ECG ID      | An ECG ID belonging to Center B (obtain from backend/admin)   |
| Attempt URL        | https://cardiocheck-releasev140.up.railway.app/ecg/<center-b-ecg-id>/patient |
| Expected response  | 403 Forbidden or redirect to login/dashboard                  |

## Steps

### Phase 1 — Identify a Cross-Center ECG ID
1. Coordinate with the backend team or admin panel to obtain an ECG record ID that belongs to a center other than the user's currently active center (or a center the user has never selected)
2. Note the ECG ID to use in the direct URL

### Phase 2 — Attempt Cross-Center Access
3. While logged in and scoped to Center A, construct the URL:
   `https://cardiocheck-releasev140.up.railway.app/ecg/<center-b-ecg-id>/patient`
4. Navigate to this URL directly via the browser address bar
5. Click `flt-semantics-placeholder` if the Flutter app loads

### Phase 3 — Observe the Response
6. Note the rendered screen — does it show patient data, an error, or a redirect?
7. Open DevTools → Network tab and check the API response for the ECG fetch request:
   - What HTTP status code was returned? (Expected: 403 or 401)
   - Was any ECG or patient data included in the response body despite the error status?
8. If the app renders any data (even a flash before redirect), document it as a defect

## Expected Result
- The backend API returns **403 Forbidden** for the cross-center ECG access request
- The frontend renders **no ECG or patient data** from the unauthorized center
- The user is either redirected to the dashboard (Center A's ECG list) or shown a generic "access denied" / "not found" message
- No patient name, risk level, ECG trace, or other PHI from Center B is rendered on screen at any point
- The error handling is graceful — no raw HTTP status codes or server error messages exposed to the user

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Critical HIPAA/security requirement:** cross-center data exposure is an Insecure Direct Object Reference (IDOR) vulnerability. If Center B's patient ECG data renders for a Center A user, this is a **Critical** finding — reportable under HIPAA as unauthorized access to PHI.
- The authorization check must occur **server-side**. A frontend-only guard (e.g., hiding the record from the list) is not sufficient — the backend API must enforce center-scoped access control on every resource request.
- If the backend returns a 404 instead of 403 for cross-center access (to avoid leaking resource existence), this is also acceptable security practice — document the actual response code in Actual Result.
- This test is closely related to TC_HIPAA_006 (access control per center) and TC_MCT_003 (ECG isolation).
