---
id: TC_MNET_007
module: Mobile Network
title: Login fails gracefully on server timeout
type: Negative
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
When the login API request times out (server unresponsive), the application must display a meaningful error message rather than hanging indefinitely.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Timeout  | Playwright route abort after 30s |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Use Playwright `page.route('**/auth/**', route => route.abort('timedout'))` to simulate timeout
3. Enter valid credentials and tap the Login button
4. Wait for the timeout to trigger
5. Observe the error handling behavior

## Expected Result
The application displays a user-friendly error message (e.g., "Request timed out. Please try again."). The Login button becomes re-enabled for retry. No unhandled JavaScript exception occurs.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
