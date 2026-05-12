---
id: TC_MSRC_006
module: Mobile Search
title: Search is case-insensitive
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A user searches with different casing (all uppercase, all lowercase, mixed) for the same patient name; the search results must be the same regardless of case.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard with a known patient name entry

## Test Data
| Field         | Value                          |
|---------------|--------------------------------|
| Search Term 1 | john (lowercase)               |
| Search Term 2 | JOHN (uppercase)               |
| Search Term 3 | John (title case)              |
| Device        | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Search for `john` and note the result count
4. Clear and search for `JOHN`, note the result count
5. Clear and search for `John`, note the result count
6. Compare the three result sets

## Expected Result
All three searches (`john`, `JOHN`, `John`) return the same number of matching entries. Search behavior is case-insensitive.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
