---
id: TC_SAUD_008
module: Storage API Audit
title: Unauthenticated GET /v1/ecgs call returns 401 or 403
type: Negative
severity: Critical
preconditions: [PC_001]
---

## Scenario
Verify that calling the `/v1/ecgs` API endpoint (or equivalent ECG list endpoint) without an Authorization header is rejected by the server with a 401 Unauthorized or 403 Forbidden response. This confirms that the backend enforces authentication and does not allow unauthenticated access to patient ECG data.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open or curl/Postman is available

## Test Data
| Field | Value |
|-------|-------|
| Target Endpoint | GET /v1/ecgs (or equivalent) |
| Method | cURL, Postman, or browser Fetch API in DevTools console |
| Authorization | None (no header) |

## Steps
1. Open the browser DevTools console (or use curl/Postman).
2. Craft a GET request to `/v1/ecgs` with no Authorization header.
   Example: `fetch('https://cardiocheck.tricog.com/v1/ecgs').then(r => console.log(r.status))`
3. Submit the unauthenticated request.
4. Record the HTTP response status code.
5. Inspect the response body — confirm it does not contain ECG data.
6. Verify the response body contains an appropriate error message (e.g., "Unauthorized", "Authentication required").
7. Repeat for at least one other sensitive endpoint (e.g., `/v1/patients` or `/v1/ecgs/:id`).
8. Confirm none of the tested endpoints return data without authentication.

## Expected Result
- HTTP 401 (Unauthorized) or 403 (Forbidden) is returned for all unauthenticated requests.
- Response body does not contain any ECG records, patient data, or PHI.
- A clear error message is returned (no stack trace or internal details exposed).
- The behavior is consistent across all tested PHI-related endpoints.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- A 200 response with ECG data to an unauthenticated request is a Critical HIPAA data breach.
- A 200 empty response is also a failure — the server must reject, not silently return nothing.
- Cross-reference with TC_SECH_005 to confirm auth headers are always sent from the client.
