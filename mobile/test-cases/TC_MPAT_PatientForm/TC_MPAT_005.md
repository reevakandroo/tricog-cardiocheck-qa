---
id: TC_MPAT_005
module: Mobile Patient Form
title: Age value of -1 is rejected as below minimum boundary
type: Negative
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A clinician enters a negative age value (-1), which is clearly below the minimum; the form must reject this input and prevent submission.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Patient Name | Test Patient Negative Age      |
| Age          | -1                             |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Enter `Test Patient Negative Age` in the patient name field
4. Attempt to enter `-1` in the age field (test if field accepts negative input)
5. Tap the Submit / Next button
6. Observe validation behavior

## Expected Result
Age value of -1 is either blocked by the input field (numeric field prevents negative entry) or triggers a validation error on submit. The form does not proceed. No server request is made with a negative age value.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
