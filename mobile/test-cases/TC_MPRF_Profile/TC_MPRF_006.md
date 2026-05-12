---
id: TC_MPRF_006
module: Mobile Profile
title: Profile page layout fits mobile screen without overflow
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The profile page must render all sections within the 393px wide mobile viewport without horizontal overflow or cut-off content.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the profile page

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Viewport | 393×851 px                     |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Navigate to the Profile page
4. Execute `document.body.scrollWidth` in console and compare against 393
5. Scroll through the entire profile page from top to bottom
6. Inspect all text fields, buttons, and sections for overflow

## Expected Result
`document.body.scrollWidth <= 393`. No horizontal scrollbar appears. All profile sections (user info, center info, version, logout button) are visible and properly aligned within the viewport.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
