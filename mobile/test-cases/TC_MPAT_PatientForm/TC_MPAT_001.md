---
id: TC_MPAT_001
module: Mobile Patient Form
title: Valid patient form submission completes successfully
type: Positive
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A clinician fills in all required patient form fields with valid data on a mobile device and successfully submits the form to create a new patient/ECG record.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Patient Name | John Test Patient              |
| Age          | 45                             |
| Gender       | Male                           |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials and navigate to the dashboard
3. Tap "New ECG" to open the patient form
4. Enter `John Test Patient` in the patient name field
5. Enter `45` in the age field
6. Select appropriate gender option
7. Fill any other required fields with valid data
8. Tap the Submit / Next button

## Expected Result
The form is submitted successfully. The user is navigated to the next step (ECG recording or result page). No validation errors are shown. A new patient/ECG record is created.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
