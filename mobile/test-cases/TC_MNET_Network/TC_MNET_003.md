---
id: TC_MNET_003
module: Mobile Network
title: App loads on simulated 3G network (1.6 Mbps)
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002]
---

## Scenario
The application must load and remain functional on a 3G mobile network simulation (1.6 Mbps download, ~300ms latency), reflecting real-world conditions for mobile users in lower-connectivity areas.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field        | Value                            |
|--------------|----------------------------------|
| Network      | 3G: 1.6 Mbps down, 768 Kbps up, 300ms RTT |
| Device       | Pixel 5 (393×851, Android emu)   |

## Steps
1. Launch Playwright with network throttle set to 3G profile (1.6 Mbps, 300ms latency)
2. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
3. Record the time for login page to fully render (Flutter WASM initial load)
4. Log in and record dashboard load time
5. Navigate to an ECG entry and check responsiveness

## Expected Result
App loads within 30s on 3G. Loading indicators are shown during slow network loads. App is functional once loaded. No unhandled timeout errors or blank screens.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
