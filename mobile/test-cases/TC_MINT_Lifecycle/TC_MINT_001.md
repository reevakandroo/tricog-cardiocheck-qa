---
id: TC_MINT_001
module: Mobile App Lifecycle
title: Cold start shows login page within 15 seconds
type: Performance
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
On a cold start (fresh browser tab, no cache), the application must present the login page within 15 seconds, including loading the Flutter WASM/JS bundle and initializing the app.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Cache    | Cleared (cold start)           |

## Steps
1. Clear browser cache, cookies, and service workers
2. Record start time
3. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
4. Wait for the login form (email and password fields) to appear
5. Record the time when login form is interactive
6. Calculate total cold start time

## Expected Result
The login page appears and is interactive within 15 seconds of navigation on unthrottled network. The Flutter engine initializes without errors.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
