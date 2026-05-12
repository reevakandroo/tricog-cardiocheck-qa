---
id: TC_MSRC_004
module: Mobile Search
title: Empty search query shows full ECG list
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When the search bar is cleared or empty, the ECG list must display all entries without any filtering applied.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Search Term  | (empty)                        |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Note the total number of ECG entries in the unfiltered list
4. Tap the search bar and enter a search term to trigger filtering
5. Clear the search bar completely
6. Observe the ECG list

## Expected Result
After clearing the search bar, the full ECG list is restored to its original state, showing all entries. The entry count matches the pre-search count.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
