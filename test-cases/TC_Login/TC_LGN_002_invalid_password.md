---
id: TC_LGN_002
module: Authentication
title: Valid Email with Wrong Password - Login Rejected
type: Negative
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
A registered user attempts to log in using a valid email but an incorrect password; the system must reject the attempt and display a meaningful error.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL
- [PC_003](../preconditions/PC_003_user_account_active.md) - Test user account exists in Cognito and is active/confirmed

## Test Data
| Field    | Value                          |
|----------|-------------------------------|
| Email    | reeva.kandroo+8@tricog.com    |
| Password | WrongPassword999!              |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Locate the email input (`aria-label="Enter your email"`) and type `reeva.kandroo+8@tricog.com`
5. Locate the password input (`aria-label="Enter your password"`) and type `WrongPassword999!`
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Observe the response from the app

## Expected Result
- Cognito returns an `NotAuthorizedException` or equivalent error
- The app remains on the login screen; it does NOT navigate to the dashboard
- An error message is displayed to the user — it should indicate incorrect credentials (e.g., "Incorrect username or password")
- The error message must NOT reveal whether the email exists in the system (to prevent user enumeration)
- The password field is cleared or the cursor is returned to the password field
- No session or token is stored

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Compare the error message wording against TC_LGN_003 (non-existent email). Both should display the same or equivalent generic message to prevent user enumeration attacks.
- This test is a prerequisite for TC_LGN_011 (account lockout after multiple failures); run this first to confirm single-failure behavior before escalating to repeated attempts.
- Cognito default behavior: after a configurable number of failed attempts, the account may be temporarily locked. A single failure should not trigger lockout.
