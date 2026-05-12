---
id: TC_MORI_007
module: Mobile Orientation
title: Rotating device mid-form retains entered data
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a user has partially filled in the patient form and the device orientation changes, the entered data must be preserved and not reset.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is on the patient form with some fields filled in

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Patient Name | Orientation Test Patient       |
| Age          | 55                             |
| Device       | Pixel 5 emulation              |

## Steps
1. Log in and navigate to the patient form (portrait, 393×851)
2. Enter `Orientation Test Patient` in the name field
3. Enter `55` in the age field
4. Switch viewport to landscape (851×393) to simulate rotation
5. Verify the name and age fields still contain the entered values
6. Switch back to portrait (393×851)
7. Verify data is still present

## Expected Result
All previously entered form data is retained after orientation change. No fields are cleared or reset. The form remains in a valid state.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
