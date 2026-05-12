---
id: TC_MNET_009
module: Mobile Network
title: Airplane mode mid-ECG-list does not crash the app
type: Negative
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When the user is browsing the ECG list and suddenly loses network connectivity (airplane mode), the app must not crash or throw unhandled exceptions.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and actively scrolling the ECG list

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Begin scrolling the ECG list
4. While list is visible, use `context.setOffline(true)` mid-interaction
5. Continue attempting to interact (tap items, scroll)
6. Check browser console for unhandled errors

## Expected Result
The app does not crash when network is cut mid-interaction. Existing visible content remains. A connection error message may appear. No unhandled JavaScript exceptions in the console.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
