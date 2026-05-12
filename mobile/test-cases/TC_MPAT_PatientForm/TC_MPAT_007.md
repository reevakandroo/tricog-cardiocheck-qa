---
id: TC_MPAT_007
module: Mobile Patient Form
title: Patient name with special characters and XSS payload is handled safely
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A patient name containing special characters and an XSS script tag is entered; the application must sanitize the input and not execute any injected JavaScript.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                                    |
|--------------|------------------------------------------|
| Patient Name | `<script>alert('XSS')</script> O'Brien`  |
| Age          | 40                                       |
| Device       | Pixel 5 (393×851, Android emu)           |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Enter `<script>alert('XSS')</script> O'Brien` in the patient name field
4. Enter `40` in the age field
5. Tap the Submit / Next button
6. Observe whether a JavaScript alert fires
7. If submission succeeds, navigate back to the ECG list and find the created entry
8. Confirm the name is displayed as escaped text, not executed JavaScript

## Expected Result
No JavaScript alert dialog fires. The input is either rejected with a validation error or stored and displayed as sanitized/escaped text. No server error (5xx) is returned.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
