---
id: TC_MPAT_002
module: Mobile Patient Form
title: Age minimum value of 1 is accepted
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A clinician enters the minimum valid age of 1 year; the form must accept this value and allow submission without validation errors.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Patient Name | Test Patient Min Age           |
| Age          | 1                              |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Enter `Test Patient Min Age` in the patient name field
4. Enter `1` in the age field
5. Fill any other required fields
6. Tap the Submit / Next button

## Expected Result
Age value of 1 is accepted. No validation error is shown for the age field. The form submits successfully or advances to the next step.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
