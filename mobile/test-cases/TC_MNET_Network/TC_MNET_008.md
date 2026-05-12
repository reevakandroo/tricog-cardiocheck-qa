---
id: TC_MNET_008
module: Mobile Network
title: Server error 500 on login is handled gracefully
type: Negative
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
When the server returns a 500 Internal Server Error for a login request, the app must show a meaningful error and not expose internal server details to the user.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Response | HTTP 500 Internal Server Error |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Use Playwright `page.route('**/auth/**', route => route.fulfill({ status: 500, body: 'Internal Server Error' }))` to mock a 500 response
3. Enter valid credentials and tap the Login button
4. Observe the displayed error message
5. Check browser console for any exposed stack traces or server details

## Expected Result
A user-friendly error message is displayed (e.g., "Something went wrong. Please try again."). No server stack trace, raw JSON error, or sensitive details are shown to the user. The login form remains usable for retry.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
