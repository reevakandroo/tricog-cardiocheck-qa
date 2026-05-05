---
id: TC_SEC_007
module: Security
title: Insecure Direct Object Reference — Non-Existent or Unauthorized ECG Returns 403/404
type: Security
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user attempts to access a non-existent ECG record or an ECG belonging to another user/center by constructing a direct URL with a fabricated or enumerated ECG ID (e.g., `/ecg/999999/patient`). The backend must return an appropriate error (403 or 404) without leaking information about the existence of other records.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard

## Test Data
| Field            | Value                                                                           |
|------------------|---------------------------------------------------------------------------------|
| Non-existent ID  | 999999                                                                          |
| Attempt URL 1    | https://cardiocheck-releasev140.up.railway.app/ecg/999999/patient               |
| Sequential IDs   | Try IDs: 1, 2, 3, 100, 1000 (to detect sequential/guessable IDs)               |
| Auth state       | Logged in as `reeva.kandroo+8@tricog.com`                                       |

## Steps

### Phase 1 — Non-Existent ECG ID
1. While logged in, navigate to `https://cardiocheck-releasev140.up.railway.app/ecg/999999/patient`
2. Click `flt-semantics-placeholder` if the Flutter app reloads
3. Observe the rendered screen and note the URL
4. Open DevTools → Network tab and check the API response:
   - HTTP status code (expected: 404 or 403)
   - Response body (must not contain other users' data or system information)

### Phase 2 — Sequential ID Enumeration
5. Try navigating to the following URLs one at a time:
   - `/ecg/1/patient`
   - `/ecg/2/patient`
   - `/ecg/100/patient`
   - `/ecg/1000/patient`
6. For each, note the HTTP response code and whether any ECG data is rendered
7. Determine whether ECG IDs appear to be sequential integers (guessable) vs. random UUIDs (non-guessable)

### Phase 3 — Modified URL of a Known ECG
8. Obtain the ID of a valid ECG you have legitimate access to from the ECG list URL or Network requests
9. Increment the ID by 1 (or modify one digit) to construct a neighboring ID
10. Navigate to `/ecg/<modified-id>/patient`
11. Confirm the API returns 403 or 404 for records not owned by this user/center

## Expected Result
- `GET /ecg/999999/patient` returns **HTTP 404** (not found) or **403** (forbidden) — not 200 with empty data or a server error
- The response body does not contain information about other ECG records, user IDs, or system internals
- Sequential integer IDs (1, 2, 3...) should NOT resolve to real patient records owned by other users — ECG IDs should be UUIDs or obfuscated to prevent enumeration
- No patient data, risk levels, or PHI from records the authenticated user is not authorized to access is returned
- The frontend shows a graceful "not found" or "access denied" screen — not a crash or raw error

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **IDOR vulnerability definition:** if predictable/sequential resource IDs allow access to other users' records, this is a classic IDOR attack. Even with authentication in place, resource-level authorization must be enforced per record.
- **Best practice:** ECG IDs should be UUIDs (v4), not auto-incrementing integers. Sequential IDs allow an attacker to enumerate all records in the system. If integer IDs are observed, log as a **High** security finding.
- Returning a 404 instead of 403 for unauthorized (but existing) resources is acceptable — "security through obscurity" for resource existence is a valid pattern (does not reveal whether a resource exists).
- Returning 403 for non-existent resources is also acceptable — consistent error codes prevent enumeration via status code differences.
- Related to TC_SEC_004 (cross-center access) and TC_HIPAA_006 (access control per center).
