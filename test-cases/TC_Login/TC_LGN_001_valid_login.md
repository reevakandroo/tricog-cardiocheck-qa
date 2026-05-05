---
id: TC_LGN_001
module: Authentication
title: Valid Email and Password - Successful Login to Dashboard
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
A registered user logs in with valid Cognito credentials and is redirected to the dashboard (or EULA if first login).

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL
- [PC_003](../preconditions/PC_003_user_account_active.md) - Test user account exists in Cognito and is active/confirmed

## Test Data
| Field    | Value                          |
|----------|-------------------------------|
| Email    | reeva.kandroo+8@tricog.com    |
| Password | Tricog@1234                   |

## Steps
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load (canvas renders login UI)
3. Click the `flt-semantics-placeholder` element to enable Flutter accessibility
4. Locate the email input using `aria-label="Enter your email"` and click it
5. Type `reeva.kandroo+8@tricog.com`
6. Locate the password input using `aria-label="Enter your password"` and click it
7. Type `Tricog@1234`
8. Click the Login button: `flt-semantics[role="button"]:has-text("Login")`
9. Wait for navigation / loading indicator to complete
10. If the EULA screen appears, click `flt-semantics-placeholder` again to enable accessibility, then click the `flt-semantics[role="button"]:has-text("I Agree")` button
11. Observe the resulting screen

## Expected Result
- Login request is sent to AWS Cognito; a valid ID token is returned
- A JWT exchange is performed with the UMS (User Management Service)
- The app navigates to the main dashboard / home screen
- No error messages or banners are displayed
- The session is persisted in secure storage (verifiable by refreshing the page and confirming the user remains logged in)
- If this is the user's first login, the EULA screen is shown before the dashboard; clicking "I Agree" dismisses it and proceeds to the dashboard

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter Web uses CanvasKit — all UI elements are rendered on a `<canvas>`. Standard DOM selectors do not work; Flutter accessibility semantics must be activated before interacting with widgets.
- The `flt-semantics-placeholder` click must be repeated after each full-page navigation because Flutter rebuilds the semantic tree.
- Auth flow: Cognito authentication → UMS JWT exchange. Both steps must succeed for a complete login.
- If the test account has never accepted the EULA, step 10 is mandatory; otherwise the app skips straight to the dashboard.
