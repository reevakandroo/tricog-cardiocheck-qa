---
id: TC_MGES_003
module: Mobile Gestures
title: Swipe down from top triggers pull-to-refresh
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A downward swipe from the top of the ECG list triggers the pull-to-refresh mechanism, reloading the list data.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in, ECG list is at the top position

## Test Data
| Field    | Value                              |
|----------|------------------------------------|
| Gesture  | Swipe down from top of list        |
| Device   | Pixel 5 (393×851, Android emu)     |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Ensure the ECG list is scrolled to the very top
4. Simulate a downward swipe from the top (touchstart y=100, drag to y=350, touchend)
5. Observe whether a refresh indicator appears
6. Wait for the list to reload (max 10s)

## Expected Result
A pull-to-refresh loading indicator appears during the gesture. The ECG list reloads with fresh data. No crash or JavaScript error occurs.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
