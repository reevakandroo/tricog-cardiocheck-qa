---
id: TC_MPER_005
module: Mobile Performance
title: Page memory usage remains stable without major growth
type: Performance
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
As the user navigates through multiple pages (login → dashboard → ECG detail → back), JavaScript heap memory must not continuously grow, which would indicate a memory leak.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in

## Test Data
| Field      | Value                          |
|------------|--------------------------------|
| Iterations | 5 navigation cycles            |
| Device     | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and record initial memory: `performance.memory.usedJSHeapSize` (if available)
3. Navigate to an ECG detail page and back — record memory
4. Repeat 5 navigation cycles (dashboard → ECG detail → back)
5. Record memory after each cycle
6. Compare initial vs final memory usage

## Expected Result
JavaScript heap memory does not grow by more than 20% across 5 navigation cycles. Any consistent upward trend suggests a memory leak and should be flagged as a Medium bug.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
