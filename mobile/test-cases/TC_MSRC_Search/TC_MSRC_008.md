---
id: TC_MSRC_008
module: Mobile Search
title: Clearing search restores the full ECG list
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After searching and filtering the list, clearing the search bar (via the clear/X button or backspace) must restore the full unfiltered ECG list.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Search Term  | Known patient partial name     |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Note the total count of unfiltered ECG entries
4. Tap the search bar and enter a partial name to filter
5. Confirm the list is filtered to fewer entries
6. Tap the clear (×) button in the search bar or delete all characters
7. Observe the ECG list

## Expected Result
After clearing the search input, the ECG list returns to showing all entries. The count matches the pre-search count. No spinner is stuck or entries missing.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
