---
id: TC_MORI_005
module: Mobile Orientation
title: Patient form in portrait orientation has all fields reachable
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
All input fields in the patient form must be reachable and interactable in portrait orientation without any field being hidden behind the keyboard or a fixed overlay.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field       | Value                    |
|-------------|--------------------------|
| Orientation | Portrait (393×851 px)    |
| Device      | Pixel 5 emulation        |

## Steps
1. Set viewport to 393×851 (portrait)
2. Log in and navigate to the New ECG patient form
3. Tap each input field in sequence (name, age, gender, other fields)
4. Verify all fields are reachable and tappable
5. Scroll to check if any fields are below the visible area

## Expected Result
All patient form fields are accessible by vertical scrolling in portrait orientation. No field is permanently hidden. The Submit button is reachable at the bottom.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
