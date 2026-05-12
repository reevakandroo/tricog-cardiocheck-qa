---
id: TC_MPRF_005
module: Mobile Profile
title: Logout from profile page works correctly on mobile
type: Positive
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A user taps the Logout button on the profile page and is successfully logged out, with the session terminated and the login page displayed.

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
4. Tap the Logout button
5. Confirm any logout confirmation dialog if shown
6. Observe navigation after logout
7. Attempt to navigate to the dashboard URL directly and verify redirect to login

## Expected Result
The user is logged out and redirected to the login page. The session token is invalidated. Attempting to access the dashboard directly redirects back to login.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
