---
id: TC_MDSH_004
module: Mobile Dashboard
title: ECG list scrolls smoothly with touch gesture
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A mobile user swipes up on the ECG list to scroll through multiple entries; the scroll must be smooth, continuous, and not cause any layout breaks or JavaScript errors.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and ECG list has multiple entries (≥5)

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Gesture  | Swipe up (scroll down)         |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials and wait for dashboard to load
3. Confirm ECG list has multiple entries visible
4. Perform an upward swipe gesture to scroll the list down
5. Continue scrolling to mid-list
6. Scroll back to the top
7. Check browser console for any errors during scrolling

## Expected Result
The list scrolls fluidly up and down. New entries become visible as the user scrolls. No layout break, blank rows, or duplicate entries appear. No JavaScript errors occur in the console.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
