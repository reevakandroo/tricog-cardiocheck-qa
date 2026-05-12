---
id: TC_MRPT_002
module: Mobile Export/Report
title: Export button tap on mobile does not cause a crash
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Tapping the Export PDF button on a mobile device must not cause a JavaScript crash, unhandled exception, or application freeze.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and a completed risk result is available

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Open a completed risk result page
4. Tap the Export PDF button using a touch event
5. Monitor the browser console for JavaScript errors
6. Observe whether the page remains interactive after the tap

## Expected Result
No JavaScript crash or unhandled exception occurs when tapping the Export button. The page remains interactive. The app either initiates a download or shows a loading state.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
