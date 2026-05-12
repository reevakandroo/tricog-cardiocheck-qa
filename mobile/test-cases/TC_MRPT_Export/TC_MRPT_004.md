---
id: TC_MRPT_004
module: Mobile Export/Report
title: Export is unavailable without a completed risk result
type: Negative
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The Export PDF button must not be available or functional for an ECG entry that does not yet have a completed risk assessment.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and an ECG entry without a risk result exists

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Open an ECG entry that does not have a completed risk assessment
4. Look for the Export PDF button
5. If the button is present, tap it and observe the behavior

## Expected Result
The Export PDF button is either absent or disabled for ECG entries without a completed risk result. If tapped, a meaningful error message is shown rather than an empty or corrupt PDF download.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
