---
id: TC_MDSH_008
module: Mobile Dashboard
title: Back navigation from ECG detail returns to ECG list
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After navigating into an ECG detail view, the user must be able to return to the ECG list on the dashboard using the browser back button or in-app back navigation.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and ECG list has at least one entry

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials and wait for dashboard to load
3. Tap an ECG entry to open the detail view
4. Confirm the ECG detail view has loaded
5. Tap the browser back button or in-app back arrow
6. Observe whether the ECG list is restored

## Expected Result
The user is returned to the ECG list on the dashboard. The list is in the same state as before (scroll position preserved if possible). No blank page, error state, or infinite loading spinner appears.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
