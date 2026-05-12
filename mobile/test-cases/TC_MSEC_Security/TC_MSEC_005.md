---
id: TC_MSEC_005
module: Mobile Security
title: XSS payload in patient name field does not execute
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A patient name containing an XSS payload must be sanitized before storage and display; no JavaScript must execute when the name is rendered back in the ECG list or detail view.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                                             |
|--------------|---------------------------------------------------|
| Patient Name | `<img src=x onerror="alert('XSS_PATIENT')">`     |
| Age          | 30                                                |
| Device       | Pixel 5 (393×851, Android emu)                    |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the patient form
3. Enter `<img src=x onerror="alert('XSS_PATIENT')">` as the patient name
4. Submit the form
5. Navigate to the ECG list where the created entry should appear
6. Check whether an alert fires or any JS executes
7. Inspect browser console for errors

## Expected Result
No JavaScript alert fires. The patient name is displayed as escaped/sanitized text in the ECG list. No unhandled errors in console. The stored name is either rejected or rendered as plain text.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
