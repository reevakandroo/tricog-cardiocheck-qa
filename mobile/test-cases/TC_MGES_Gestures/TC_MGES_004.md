---
id: TC_MGES_004
module: Mobile Gestures
title: Double tap on an ECG item does not cause a crash
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A user accidentally double-taps an ECG list item; the application must not crash or navigate to duplicate pages.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard with at least one ECG entry

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Gesture  | Double tap (two rapid taps)    |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Simulate a double tap on the first ECG list item (two rapid `page.tap()` calls within 300ms)
4. Observe navigation behavior
5. Check browser console for JavaScript errors

## Expected Result
The application navigates to the ECG detail page only once (or handles the double tap gracefully). No duplicate pages are pushed to history. No JavaScript crash or unhandled exception occurs.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
