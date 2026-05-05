---
id: TC_LGN_004
module: Authentication
title: Empty Email Field - Login Blocked with Validation Error
type: Negative
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
A user attempts to log in leaving the email field blank; the system must prevent the login attempt and prompt the user to fill in the email.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field    | Value       |
|----------|------------|
| Email    | _(empty)_  |
| Password | Tricog@1234 |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Leave the email field untouched (do not click or type in it)
5. Locate the password input (`aria-label="Enter your password"`) and type `Tricog@1234`
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Observe the response from the app

## Expected Result
- The login attempt is blocked before any network call is made (client-side or server-side validation)
- An inline validation error or dialog is shown near the email field indicating it is required (e.g., "Email is required" or "Please enter your email")
- The app remains on the login screen
- No Cognito API call is initiated for an empty email (verified via network tab / no outbound auth request)
- No session or token is stored

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Per the source code review, the login form has **no explicit client-side length validation**. It is possible validation is handled server-side only.
- If the form submits with an empty email and the server returns an error, verify:
  1. The error is displayed to the user (not silently swallowed)
  2. The error message is meaningful (not a raw exception/stack trace)
- If client-side validation exists, confirm it fires on submit (not only on blur), as some Flutter form implementations only validate on field interaction.
- Also test with a whitespace-only email (a single space) to check trim handling — see TC_LGN_006 for combined empty fields.
