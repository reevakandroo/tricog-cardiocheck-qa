---
id: TC_SECH_005
module: Security Headers
title: All state-changing API requests include a valid Bearer token in the Authorization header
type: Positive
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that every state-changing API request (POST, PUT, PATCH, DELETE) made by the CardioCheck application includes a valid `Authorization: Bearer <token>` header. This ensures that no sensitive operation can be performed without authentication.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Methods to Check | POST, PUT, PATCH, DELETE |
| Expected Header | Authorization: Bearer <token> |

## Steps
1. Open the browser DevTools (Network tab) and enable "Preserve log".
2. Log in with valid credentials and observe the login POST request.
3. Confirm the login response returns a Bearer token.
4. Navigate to the dashboard and perform an ECG-related action (e.g., submit patient form).
5. In the Network tab, filter for XHR/Fetch requests.
6. Inspect each POST/PUT/PATCH/DELETE request — verify the `Authorization: Bearer` header is present.
7. Check that the token value is non-empty and appears to be a JWT or similar structured token.
8. Repeat for at least 3 different state-changing operations across the application flow.

## Expected Result
- Every state-changing API request includes `Authorization: Bearer <token>`.
- The token is consistent within the session and rotates on re-login.
- No POST/PUT/PATCH/DELETE request is sent without the Authorization header.
- The token appears well-formed (e.g., JWT format with three base64 segments).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Any state-changing request missing the Authorization header is a Critical security bug — it means the endpoint may be unprotected.
- Also check GET requests for sensitive data (e.g., GET /v1/ecgs) to confirm they also require auth.
- Cross-reference with TC_SAUD_008 (unauthenticated API rejection) for full coverage.
