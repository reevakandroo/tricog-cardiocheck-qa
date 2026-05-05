---
id: TC_LGN_006
module: Authentication
title: Both Email and Password Empty - Login Blocked
type: Negative
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
A user opens the login screen and immediately clicks the Login button without entering any credentials; both fields are empty. The system must prevent submission and surface validation errors for both fields.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field    | Value     |
|----------|-----------|
| Email    | _(empty)_ |
| Password | _(empty)_ |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Do NOT interact with the email or password fields
5. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
6. Observe the response from the app

## Expected Result
- The login attempt is blocked; no network call to Cognito is made
- Validation errors are shown for **both** the email and password fields simultaneously
- The app remains on the login screen
- Error messages are clear and actionable (e.g., "Email is required", "Password is required")
- No session or token is stored

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the app only surfaces one validation error at a time (email first, then password on the next attempt), document this as a **UX deficiency** — users should see all errors in a single submit attempt.
- Per source code review, **no explicit client-side length validation** exists on the login form. If both fields are submitted empty to the server, verify that the server response is correctly surfaced to the user rather than causing a silent failure or crash.
- This test complements TC_LGN_004 (email only empty) and TC_LGN_005 (password only empty). A regression here may indicate that combined validation logic differs from individual field validation.
- Secondary check: After clicking Login with both fields empty, confirm the Login button is not permanently disabled or stuck in a loading state.
