---
id: TC_MNET_002
module: Mobile Network
title: App loads on simulated 4G network (10 Mbps)
type: Positive
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
The application must load and be usable on a 4G mobile network simulation (10 Mbps download, ~50ms latency).

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Network      | 4G: 10 Mbps down, 5 Mbps up, 50ms RTT |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Launch Playwright with network throttle set to 4G profile (10 Mbps, 50ms latency)
2. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
3. Record the time for login page to fully render
4. Log in with valid credentials and record dashboard load time
5. Interact with the ECG list (tap, scroll)

## Expected Result
Login page renders within 10s. Dashboard loads within 20s. App is usable. No console errors. ECG list is interactive.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
