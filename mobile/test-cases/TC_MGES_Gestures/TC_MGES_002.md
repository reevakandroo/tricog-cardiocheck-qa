---
id: TC_MGES_002
module: Mobile Gestures
title: Swipe up scrolls the ECG list
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A swipe-up gesture on the ECG list should scroll the content downward, revealing additional entries below the visible area.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and ECG list has more entries than fit in one screen

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Gesture  | Swipe up (scroll down content) |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Note the last visible ECG entry in the viewport
4. Simulate an upward swipe using touch events (touchstart at y=600, move to y=200, touchend)
5. Observe whether the list scrolls to reveal more entries

## Expected Result
The list scrolls down, revealing additional ECG entries that were below the viewport. The previously last-visible entry is now higher in the list. No JS errors occur.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
