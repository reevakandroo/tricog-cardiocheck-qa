---
id: TC_MPRF_001
module: Mobile Profile
title: Profile page is accessible from the mobile dashboard
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A logged-in user must be able to navigate to the Profile page from the dashboard using a menu, avatar, or navigation item on the mobile viewport.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials and wait for the dashboard to load
3. Locate the Profile navigation element (hamburger menu, avatar icon, or bottom nav)
4. Tap the Profile navigation element
5. Confirm navigation to the Profile page

## Expected Result
The Profile page loads successfully. The user's profile information is displayed. No error states or blank pages appear.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
