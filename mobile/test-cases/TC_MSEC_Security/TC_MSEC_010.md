---
id: TC_MSEC_010
module: Mobile Security
title: Session expires and protected URL redirects to login after logout
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After a user logs out, their session must be invalidated. Attempting to access a protected URL (dashboard, ECG detail) must redirect to the login page, not serve cached authenticated content.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User has been logged in and has the dashboard URL

## Test Data
| Field         | Value                                      |
|---------------|--------------------------------------------|
| Protected URL | https://cardiocheck-releasev140.up.railway.app/#/dashboard (or equivalent) |
| Device        | Pixel 5 (393×851, Android emu)             |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and note the dashboard URL
3. Log out from the profile page
4. Confirm login page is displayed after logout
5. Directly navigate to the previously noted dashboard URL
6. Observe whether the dashboard is accessible or redirected to login
7. Check network requests — confirm no protected API data is returned

## Expected Result
After logout, navigating to a protected URL redirects to the login page. No dashboard content or patient data is accessible. The session token is invalidated server-side.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
