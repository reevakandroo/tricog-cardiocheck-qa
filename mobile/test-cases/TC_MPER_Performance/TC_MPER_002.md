---
id: TC_MPER_002
module: Mobile Performance
title: Dashboard load time is under 15 seconds after login
type: Performance
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After login, the dashboard with the ECG list must become fully interactive within 15 seconds on a stable network connection.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User has just logged in

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Network  | Unthrottled                    |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Record the timestamp when the login button is tapped
4. Use `page.waitForLoadState('networkidle')` to detect when dashboard finishes loading
5. Record the total time from login to dashboard idle

## Expected Result
Dashboard reaches `networkidle` state within 15 seconds of login. ECG list is visible and interactive within that time.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
