---
id: TC_MINT_002
module: Mobile App Lifecycle
title: Background-to-foreground resume keeps session active
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a user switches to another browser tab (background) and returns to the app (foreground), the session must still be active and the user must not be unexpectedly logged out.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| BG Time  | 30 seconds                     |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and confirm dashboard is loaded
3. Simulate tab backgrounding by navigating to a different URL in a new tab
4. Wait 30 seconds
5. Navigate back to the CardioCheck tab
6. Observe whether the session is maintained or the user is logged out

## Expected Result
The session remains active after 30 seconds in the background. The dashboard is still shown when returning. The user is not unexpectedly redirected to the login page.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
