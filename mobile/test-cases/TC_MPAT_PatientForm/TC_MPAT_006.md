---
id: TC_MPAT_006
module: Mobile Patient Form
title: Empty patient name field prevents form submission
type: Negative
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A clinician attempts to submit the patient form without entering a patient name; the form must block submission and indicate the name field is required.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Patient Name | (empty)                        |
| Age          | 45                             |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Leave the patient name field empty
4. Enter `45` in the age field
5. Fill any other required fields
6. Tap the Submit / Next button
7. Observe validation behavior

## Expected Result
The form does not submit. A validation error is displayed indicating the patient name is required (e.g., "Patient name is required"). The Submit button stays disabled or an error tooltip appears.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
