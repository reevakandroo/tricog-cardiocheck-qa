---
id: TC_MNET_001
module: Mobile Network
title: App loads normally on fast network (WiFi simulation)
type: Positive
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
The application must load and be fully interactive within acceptable time on a fast network connection simulating WiFi speeds.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Network      | No throttle (unthrottled / WiFi) |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Launch Playwright with no network throttling
2. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
3. Record the time from navigation start to login page fully rendered
4. Log in with valid credentials
5. Record the time from login submission to dashboard fully loaded

## Expected Result
Login page loads in <5s. Dashboard loads within 15s after login. All assets (fonts, images, Flutter WASM/JS) load without errors. No network errors in console.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
