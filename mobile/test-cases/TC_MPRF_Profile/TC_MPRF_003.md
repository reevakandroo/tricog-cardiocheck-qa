---
id: TC_MPRF_003
module: Mobile Profile
title: User email is displayed on the profile page
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The profile page must display the currently logged-in user's email address so users can confirm the account identity.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the profile page

## Test Data
| Field         | Value                           |
|---------------|---------------------------------|
| Expected Email | reeva.kandroo+8@tricog.com     |
| Device        | Pixel 5 (393×851, Android emu)  |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with `reeva.kandroo+8@tricog.com`
3. Navigate to the Profile page
4. Locate the email field on the profile
5. Confirm the displayed email matches the logged-in account

## Expected Result
The email `reeva.kandroo+8@tricog.com` (or the logged-in user's email) is displayed on the profile page. The email is not truncated in a way that makes it unreadable on the mobile viewport.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
