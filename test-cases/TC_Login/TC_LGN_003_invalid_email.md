---
id: TC_LGN_003
module: Authentication
title: Non-Existent Email - Login Rejected
type: Negative
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
A user attempts to log in with an email address that does not exist in Cognito; the system must reject the attempt without revealing that the email is unregistered.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL

## Test Data
| Field    | Value                                 |
|----------|--------------------------------------|
| Email    | nonexistent.user.xyz@tricog-test.com |
| Password | AnyPassword@123                      |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Locate the email input (`aria-label="Enter your email"`) and type `nonexistent.user.xyz@tricog-test.com`
5. Locate the password input (`aria-label="Enter your password"`) and type `AnyPassword@123`
6. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
7. Observe the response from the app

## Expected Result
- Cognito returns a `UserNotFoundException` or equivalent; the app handles this gracefully
- The app remains on the login screen; it does NOT navigate to any authenticated screen
- An error message is displayed — it must be generic (e.g., "Incorrect username or password") and must NOT state "user does not exist" or "email not found"
- The error message must be identical or functionally equivalent to the message shown in TC_LGN_002 (wrong password for a valid email) — this prevents user enumeration
- No session or token is stored

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Security — User Enumeration Risk:** If the error message for a non-existent email differs from the error for a wrong password, an attacker can enumerate valid accounts. Both TC_LGN_002 and TC_LGN_003 error strings must be compared side-by-side.
- **HIPAA relevance:** Patient email addresses are PHI. Confirming existence of an email in the system via distinct error messages constitutes an information disclosure risk.
- Ensure the test email address is one that is genuinely not registered. Avoid using format variations of a real account (e.g., `reeva+test@`) to reduce ambiguity.
