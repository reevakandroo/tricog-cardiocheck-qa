---
id: TC_MNET_006
module: Mobile Network
title: Slow network shows loading indicators during data fetch
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
On a slow network, the application must display loading indicators while data is being fetched so users know the app is working and haven't encountered a failure.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is on the login page

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Network  | Slow 3G or Playwright route delay (3s) |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Use Playwright `page.route()` to add a 3-second delay to API responses
3. Enter valid credentials and tap the Login button
4. Immediately observe the UI for a loading spinner or indicator
5. Check whether the Login button is disabled while loading

## Expected Result
A loading spinner, progress bar, or equivalent indicator appears immediately after tapping Login. The Login button is disabled to prevent double-submission. The indicator disappears once the response arrives.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
