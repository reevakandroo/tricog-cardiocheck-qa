---
id: TC_LGN_005
module: Authentication
title: Empty Password Field - Login Blocked with Validation Error
type: Negative
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
A user attempts to log in leaving the password field blank; the system must prevent the login attempt and prompt the user to fill in the password.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field    | Value                       |
|----------|-----------------------------|
| Email    | reeva.kandroo+8@tricog.com  |
| Password | _(empty)_                   |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Locate the email input (`aria-label="Enter your email"`) and type `reeva.kandroo+8@tricog.com`
5. Leave the password field untouched (do not click or type in it)
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Observe the response from the app

## Expected Result
- The login attempt is blocked (client-side or server-side validation)
- An inline validation error or dialog is shown near the password field (e.g., "Password is required" or "Please enter your password")
- The app remains on the login screen
- No Cognito API call is initiated with an empty password (verified via network tab)
- No session or token is stored

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Per source code review, the login form has **no explicit client-side length validation**. Validation may be server-side only. If Cognito receives an empty string as the password, it will return an error — confirm this error surfaces correctly to the user.
- Also test with a whitespace-only password (a single space) to ensure the app trims inputs before submission.
- Cognito will reject an empty password with `AuthParameterUserNotProvidedException` or similar; verify the app translates this into a user-friendly message rather than exposing the raw exception name.
- Separately verify that the password field has `obscureText` / masked input enabled so typed characters are not visible on screen.
