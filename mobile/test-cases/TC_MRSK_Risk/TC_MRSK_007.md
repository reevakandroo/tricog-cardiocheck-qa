---
id: TC_MRSK_007
module: Mobile Risk Assessment
title: Network timeout on risk result request does not cause JS crash
type: Negative
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When the network times out while loading a risk result, the application must show a graceful error state instead of throwing an unhandled JavaScript exception.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Device       | Pixel 5 (393×851, Android emu) |
| Network Sim  | Playwright route abort / timeout |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Use Playwright `page.route()` to intercept and abort the risk result API call
4. Navigate to a risk result page (tap on a completed ECG entry)
5. Observe the error handling behavior
6. Check browser console for unhandled promise rejections or JS errors

## Expected Result
A user-friendly error message is displayed (e.g., "Failed to load result, please try again"). No unhandled JavaScript exception appears in the console. The page remains interactive (user can retry or navigate back).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
