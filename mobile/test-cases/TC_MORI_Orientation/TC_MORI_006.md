---
id: TC_MORI_006
module: Mobile Orientation
title: Patient form in landscape orientation is scrollable
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
In landscape orientation (reduced vertical height), the patient form must be vertically scrollable so all fields and the Submit button are reachable.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the patient form

## Test Data
| Field       | Value                    |
|-------------|--------------------------|
| Orientation | Landscape (851×393 px)   |
| Device      | Pixel 5 emulation        |

## Steps
1. Log in and navigate to the patient form
2. Switch viewport to landscape (851×393)
3. Scroll through the form from top to bottom
4. Confirm all fields are reachable
5. Confirm the Submit button is accessible at the bottom

## Expected Result
The patient form is vertically scrollable in landscape orientation. All fields and the Submit button are reachable. No fields are permanently hidden.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
