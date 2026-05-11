---
id: TC_SAUD_004
module: Storage API Audit
title: All /v1/ API calls made during a session include the Authorization header
type: Positive
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that every API call made by CardioCheck to `/v1/` endpoints during an authenticated session includes a valid `Authorization` header. This is a comprehensive audit of the API surface to ensure no endpoint is accidentally called without authentication — a gap that would expose PHI without authorization.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| API Pattern | /v1/* |
| Required Header | Authorization: Bearer <token> |
| Flow | Login → Dashboard → ECG Detail → Patient Form → Submit → Logout |

## Steps
1. Open Chrome DevTools → Network tab. Enable "Preserve log" and filter by XHR/Fetch.
2. Log in with valid credentials and proceed through the full app flow.
3. Visit every major page: dashboard, ECG detail, patient form, result screen.
4. After completing the flow, export the network log or manually review all `/v1/` requests.
5. For each `/v1/` request, verify the `Authorization: Bearer` header is present.
6. Note any `/v1/` request that is missing the Authorization header.
7. Also verify that GET requests to `/v1/ecgs` and similar data endpoints include auth.
8. Document the total count of authenticated vs. unauthenticated API calls.

## Expected Result
- Every `/v1/` API request includes `Authorization: Bearer <token>`.
- Zero `/v1/` requests are made without the Authorization header.
- The token value is consistent within the session.
- No API endpoint is accidentally called as an anonymous request.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Any `/v1/` request without an Authorization header is a Critical finding — potential unauthenticated data exposure.
- Cross-reference with TC_SAUD_008 to confirm unauthenticated calls are rejected by the server.
- Also check if any calls go to non-`/v1/` paths (e.g., `/api/`, `/graphql/`) — audit those too.
