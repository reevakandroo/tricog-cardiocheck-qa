---
id: TC_MPAT_010
module: Mobile Patient Form
title: Age field triggers numeric keyboard on mobile
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a mobile user taps the age input field, the device's numeric keyboard (not full QWERTY) should appear to make age entry faster and less error-prone.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the New ECG / patient form
3. Tap the age input field
4. Inspect the `inputmode` or `type` attribute of the age input element
5. Verify the attribute is `type="number"` or `inputmode="numeric"` or `inputmode="decimal"`

## Expected Result
The age field has `type="number"` or `inputmode="numeric"` set, which triggers a numeric keypad on mobile devices. Non-numeric characters are not accepted or are filtered out.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
