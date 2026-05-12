---
id: TC_MGES_005
module: Mobile Gestures
title: Long press on ECG item does not cause a crash
type: Edge
severity: Low
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A user performs a long-press (press and hold) gesture on an ECG list item; the application must not crash regardless of whether a long-press action is defined.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                            |
|----------|----------------------------------|
| Gesture  | Long press (hold for 800ms+)     |
| Device   | Pixel 5 (393×851, Android emu)   |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Simulate a long press on the first ECG list item (touchstart hold for 1000ms before touchend)
4. Observe whether a context menu, tooltip, or any action appears
5. Check browser console for JavaScript errors

## Expected Result
The application either shows a context menu (if long-press is a defined action) or does nothing beyond the default browser behavior. No crash, no unhandled exception, no page freeze occurs.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
