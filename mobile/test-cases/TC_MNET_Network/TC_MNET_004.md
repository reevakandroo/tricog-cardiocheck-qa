---
id: TC_MNET_004
module: Mobile Network
title: App goes offline after login without crashing
type: Negative
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After a successful login, the device goes offline; the application must not crash or throw unhandled exceptions when network connectivity is lost.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Network  | Offline (simulated)            |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and confirm dashboard is loaded
3. Use Playwright `context.setOffline(true)` to simulate going offline
4. Attempt to tap an ECG entry
5. Attempt to scroll the list
6. Check browser console for unhandled errors

## Expected Result
The app does not crash when going offline. Either cached content is shown or a "No internet connection" message appears. No unhandled JavaScript exceptions or blank page. The UI remains interactive (back, retry).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
