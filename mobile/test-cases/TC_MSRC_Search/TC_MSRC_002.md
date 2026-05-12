---
id: TC_MSRC_002
module: Mobile Search
title: Partial name search filters the ECG list
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A user types a partial patient name in the search bar; the ECG list must filter to show only entries that match the partial name.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and ECG list has ≥2 entries with different patient names

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Search Term  | First 3-4 chars of a known patient name |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Tap the search bar
4. Enter the first 3 characters of a known patient name
5. Observe the ECG list below the search bar

## Expected Result
The ECG list updates to show only entries matching the partial search term. Non-matching entries are hidden. At least one matching entry is displayed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
