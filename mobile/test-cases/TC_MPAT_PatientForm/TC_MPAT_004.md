---
id: TC_MPAT_004
module: Mobile Patient Form
title: Age value of 0 is invalid and Submit button stays disabled
type: Negative
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A clinician enters age 0, which is below the minimum valid age; the form must reject this value and prevent submission.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Patient Name | Test Patient Zero Age          |
| Age          | 0                              |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Enter `Test Patient Zero Age` in the patient name field
4. Enter `0` in the age field
5. Attempt to tap the Submit / Next button
6. Observe whether the button is disabled or shows a validation error

## Expected Result
Age value of 0 is rejected. The Submit button remains disabled or a validation error message appears (e.g., "Age must be at least 1"). The form does not advance or submit.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
