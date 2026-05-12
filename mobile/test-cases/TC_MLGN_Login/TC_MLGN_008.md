---
id: TC_MLGN_008
module: Mobile Authentication
title: XSS payload in password field does not execute
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002]
---

## Scenario
An attacker submits a cross-site scripting payload in the password field; the app must sanitize or escape the input so no JavaScript executes in the browser.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                                    |
|----------|------------------------------------------|
| Email    | reeva.kandroo+8@tricog.com               |
| Password | `<script>alert('XSS')</script>`          |
| Device   | Pixel 5 (393×851, Android emu)           |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email field and enter `reeva.kandroo+8@tricog.com`
4. Tap the password field and enter `<script>alert('XSS')</script>`
5. Tap the Login button
6. Observe whether a JavaScript alert dialog fires
7. Check browser console for script execution errors or unexpected behavior

## Expected Result
No alert dialog appears. The browser console shows no JavaScript execution from injected code. The application returns a standard "Invalid credentials" error. The payload is treated as plain text.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
