---
id: TC_MNET_005
module: Mobile Network
title: App recovers correctly after network is restored
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After a period of being offline, the application must recover and resume normal functionality when network connectivity is restored.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and confirm dashboard is loaded
3. Use `context.setOffline(true)` to go offline
4. Wait 5 seconds
5. Use `context.setOffline(false)` to restore network
6. Attempt to refresh the ECG list or tap a list item
7. Observe whether the app resumes normal behavior

## Expected Result
After network is restored, the app resumes fetching data correctly. The ECG list reloads or becomes interactive again. No permanent error state persists after recovery.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
