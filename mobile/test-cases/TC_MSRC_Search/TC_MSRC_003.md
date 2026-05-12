---
id: TC_MSRC_003
module: Mobile Search
title: No-match search shows empty state message
type: Negative
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a search term matches no ECG entries, the list area must display a meaningful empty state rather than a blank or broken layout.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Search Term  | zzz_no_match_xyz               |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Tap the search bar
4. Enter `zzz_no_match_xyz`
5. Observe the ECG list area

## Expected Result
An empty state is displayed with a user-friendly message (e.g., "No results found" or "No matching patients"). The list area is not blank or broken. No JavaScript error occurs in the console.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
