---
id: TC_MRSK_001
module: Mobile Risk Assessment
title: Low risk result loads after ECG seed
type: Positive
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After an ECG is seeded for a patient, the risk assessment result with a low-risk classification must load and display correctly on the mobile viewport.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and a seeded ECG with low-risk result is available

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | Tricog@1234                    |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Select an ECG entry that has a low-risk seeded result
4. Navigate to the risk assessment result page
5. Observe the risk classification displayed

## Expected Result
The risk result page loads within 15s. A low-risk result is displayed with appropriate color coding and label. No error states or blank sections appear on the mobile viewport.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
