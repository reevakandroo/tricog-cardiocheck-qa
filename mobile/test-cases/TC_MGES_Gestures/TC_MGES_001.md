---
id: TC_MGES_001
module: Mobile Gestures
title: Single tap opens an ECG item from the list
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A single tap on an ECG list item must navigate to the ECG detail or risk result page.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard with at least one ECG entry

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Gesture  | Single tap (touchstart+touchend) |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Perform a single tap (`page.tap()`) on the first ECG list item
4. Wait for navigation (max 10s)
5. Confirm the ECG detail/result page is displayed

## Expected Result
A single tap on an ECG list item navigates to the ECG detail or risk result page. The correct patient's data is displayed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
