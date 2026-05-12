---
id: TC_MINT_008
module: Mobile App Lifecycle
title: Heavy script execution does not cause ANR-equivalent freeze
type: Performance
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Simulating heavy CPU load (analogous to an Android ANR — Application Not Responding) must not cause the app to freeze for more than 5 seconds or become unresponsive to user interactions.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| CPU      | Playwright 4x CPU slowdown     |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Enable 4x CPU throttle using Chrome DevTools via Playwright CDP
3. Log in and navigate to the dashboard
4. Scroll the ECG list and tap list items while under CPU throttle
5. Observe responsiveness (tap-to-response time)
6. Check whether the page freezes for >5 seconds at any point

## Expected Result
Under 4x CPU throttle, the app remains responsive to user interactions. Touch events are processed within 5 seconds. No "Page Unresponsive" dialog appears. The app degrades gracefully rather than freezing.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
