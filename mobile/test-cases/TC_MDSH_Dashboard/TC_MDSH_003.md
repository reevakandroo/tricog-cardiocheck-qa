---
id: TC_MDSH_003
module: Mobile Dashboard
title: Pull-to-refresh gesture refreshes the ECG list
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A mobile user performs a downward swipe from the top of the ECG list to trigger a pull-to-refresh; the list must reload and display updated data.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Gesture  | Swipe down from top of list    |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials and wait for dashboard to load
3. Scroll the ECG list to the top position
4. Perform a downward swipe gesture from top of the list (simulate touchstart at y=100, drag to y=300)
5. Observe whether a loading indicator appears
6. Wait for the list to reload (max 10s)

## Expected Result
A loading/refresh indicator appears during the pull gesture. The ECG list reloads successfully. No crash or JavaScript error occurs. Data displayed is current.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
