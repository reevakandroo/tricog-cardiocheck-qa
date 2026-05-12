---
id: TC_MPRF_004
module: Mobile Profile
title: Center name is displayed on the profile page
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The profile page must display the name of the medical center/clinic associated with the logged-in user's account.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the profile page

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Navigate to the Profile page
4. Locate the center name field
5. Confirm the center name is displayed and readable

## Expected Result
The center name associated with the user's account is displayed on the profile page. The text is readable and fits within the 393px viewport without overflow.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
