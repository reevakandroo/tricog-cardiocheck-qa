---
id: TC_MPRF_002
module: Mobile Profile
title: App version number is visible on the profile page
type: Positive
severity: Low
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The profile or settings page must display the application version number so users and support teams can identify which version is running.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the profile page

## Test Data
| Field           | Value                          |
|-----------------|--------------------------------|
| Expected Version | v1.4.0                        |
| Device          | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Navigate to the Profile page
4. Locate the app version field (often at the bottom of the profile/settings page)
5. Note the displayed version string

## Expected Result
A version string (e.g., "v1.4.0" or "Version 1.4.0") is visible on the Profile page. The version text is readable within the mobile viewport.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
