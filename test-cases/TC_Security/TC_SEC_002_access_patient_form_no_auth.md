---
id: TC_SEC_002
module: Security
title: Unauthenticated Access to Patient Form — Redirect to Login
type: Security
severity: Critical
preconditions: [PC_001]
---

## Scenario
Without any active session, a user directly navigates to a patient data entry URL such as `/ecg/1/patient`. The app must redirect to login without rendering the patient form or any PHI. This tests that deep-linked protected routes enforce authentication independently of the root route guard.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- No active session: test in a fresh incognito window or with all CardioCheck storage cleared

## Test Data
| Field           | Value                                                                      |
|-----------------|----------------------------------------------------------------------------|
| Target URL 1    | https://cardiocheck-releasev140.up.railway.app/ecg/1/patient               |
| Target URL 2    | https://cardiocheck-releasev140.up.railway.app/ecg/999/patient             |
| Auth state      | Unauthenticated (no tokens in any browser storage)                         |

## Steps

### Phase 1 — Ensure No Active Session
1. Open a **new Incognito/Private window** (or clear all storage for the CardioCheck domain)
2. Confirm DevTools → Application → Storage is empty for the CardioCheck domain

### Phase 2 — Attempt Navigation to Patient Form
3. Navigate to `https://cardiocheck-releasev140.up.railway.app/ecg/1/patient`
4. Wait up to 5 seconds
5. Click `flt-semantics-placeholder` if the Flutter app loads
6. Note the URL and rendered screen
7. Check DevTools Network tab for any API requests (e.g., `GET /ecg/1/patient` or `GET /ecg/1`) that returned patient data

### Phase 3 — Attempt with Non-Existent ECG ID
8. Navigate to `https://cardiocheck-releasev140.up.railway.app/ecg/999/patient`
9. Observe the result — must still redirect to login (not to a 404 or error screen that leaks route structure)

## Expected Result
- Both URLs redirect to the **login screen** immediately
- Patient data, form fields pre-populated with PHI, or any ECG-linked information are **never rendered**
- The backend does not return ECG or patient data in response to unauthenticated API requests (API returns 401)
- The route guard applies to all nested routes under `/ecg/`, not only the root `/ecgs` path
- The redirect destination is the login screen, not a generic 404 or error page that leaks route information

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This test specifically validates that **nested/deep-linked routes** are protected, not just the root dashboard. A common vulnerability is implementing the auth guard only at the top-level route and failing to protect child routes.
- Even a momentary render of the patient form (field labels, patient name, etc.) before redirect is a **Critical** HIPAA defect.
- Also test `/profile/omron-credentials` and `/profile/center-selection` with the same approach — these routes should also redirect to login when accessed without auth.
- Document whether the app redirects to login with a `?redirect=/ecg/1/patient` query param (deep-link preservation after auth), as this is good UX but the param must not expose sensitive context information.
