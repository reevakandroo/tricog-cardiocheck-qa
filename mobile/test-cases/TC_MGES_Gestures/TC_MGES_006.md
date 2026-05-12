---
id: TC_MGES_006
module: Mobile Gestures
title: Tap on New ECG button works using touch event
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The New ECG button must respond correctly to a touch event, not just a mouse click, on mobile emulation.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Gesture  | Touch tap via page.tap()       |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Locate the New ECG button (FAB, header button, or bottom nav item)
4. Use Playwright `page.tap()` (touch event) on the New ECG button
5. Observe navigation or modal opening behavior

## Expected Result
The New ECG button responds to the touch event and opens the patient form or ECG creation flow. No JS errors occur. The button does not require a mouse click to activate.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
