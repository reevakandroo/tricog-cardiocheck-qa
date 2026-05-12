---
id: TC_MRSK_004
module: Mobile Risk Assessment
title: Back navigation from risk result returns to dashboard
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After viewing a risk result, a user taps the back button; they must be returned to the dashboard or ECG list without errors or blank states.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and is on a risk result page

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to a risk result page
3. Confirm the risk result is displayed
4. Tap the browser back button or the in-app back arrow
5. Observe the navigation target

## Expected Result
The user is returned to the dashboard or ECG list page. The list loads without errors. No blank page or infinite spinner is shown.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
