---
id: TC_MPAT_008
module: Mobile Patient Form
title: Patient name with emoji and unicode characters is handled gracefully
type: Edge
severity: Low
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A patient name containing emoji and non-ASCII unicode characters is entered; the app must either accept and display the name correctly or reject it gracefully without crashing.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field        | Value                              |
|--------------|------------------------------------|
| Patient Name | 李明 😊 Müller Иванов               |
| Age          | 35                                 |
| Device       | Pixel 5 (393×851, Android emu)     |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Enter `李明 😊 Müller Иванов` in the patient name field
4. Enter `35` in the age field
5. Fill other required fields
6. Tap the Submit / Next button
7. Observe whether the form accepts, rejects, or crashes

## Expected Result
The application either: (a) accepts the unicode/emoji name and stores/displays it correctly, or (b) shows a clear validation error indicating unsupported characters. No crash, no server error (5xx), no garbled display of characters.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
