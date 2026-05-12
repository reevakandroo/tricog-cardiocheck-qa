---
id: TC_MPER_006
module: Mobile Performance
title: Rapid navigation through 5 login cycles shows no memory leak
type: Performance
severity: Medium
preconditions: [MPC_001, MPC_002]
---

## Scenario
Performing 5 complete login→dashboard→logout cycles must not cause continuous JavaScript heap memory growth, which would indicate a memory leak across sessions.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field      | Value                          |
|------------|--------------------------------|
| Cycles     | 5 login→dashboard→logout       |
| Device     | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Record initial memory: `performance.memory.usedJSHeapSize`
3. Log in, navigate to dashboard (wait for load), log out — record memory (cycle 1)
4. Repeat for cycles 2-5
5. Compare memory after each cycle to the initial baseline

## Expected Result
Memory usage does not grow by more than 30% cumulatively across 5 login cycles. Significant consistent growth (>50MB across 5 cycles) indicates a session-level memory leak.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
