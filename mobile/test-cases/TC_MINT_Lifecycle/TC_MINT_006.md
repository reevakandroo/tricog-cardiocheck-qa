---
id: TC_MINT_006
module: Mobile App Lifecycle
title: Back button during login form does not crash the app
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002]
---

## Scenario
Pressing the browser back button while filling in the login form must not crash the app or produce an error state.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email field and enter a partial email
4. Before submitting, press the browser back button
5. Observe whether the app navigates away, shows an error, or stays on login
6. Check browser console for errors

## Expected Result
Pressing back during login form fill either navigates away from the app (to the browser's previous page) or stays on the login page. No crash, no JavaScript error, no blank screen.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
