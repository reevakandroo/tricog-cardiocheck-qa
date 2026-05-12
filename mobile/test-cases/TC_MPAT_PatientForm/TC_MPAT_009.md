---
id: TC_MPAT_009
module: Mobile Patient Form
title: Patient name with 200 characters is handled gracefully
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A patient name of 200 characters is entered to test the upper boundary of name field length; the app must handle this without crashing or producing a server error.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                                                                                                                                                                                                                                        |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Patient Name | AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA (200 chars) |
| Age          | 50                                                                                                                                                                                                                                           |
| Device       | Pixel 5 (393×851, Android emu)                                                                                                                                                                                                               |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Paste a 200-character string into the patient name field
4. Enter `50` in the age field
5. Tap the Submit / Next button
6. Observe response and check browser console for errors

## Expected Result
The application either: (a) truncates the name at a max length client-side, or (b) returns a clear validation error (400) indicating the name is too long. No server error (5xx). The page remains responsive. No layout breaks on the form.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
