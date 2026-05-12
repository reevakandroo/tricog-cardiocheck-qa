---
id: TC_MDSH_006
module: Mobile Dashboard
title: Center isolation — Account B cannot see Account A center ECGs
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_004]
---

## Scenario
Two accounts belonging to different centers must not share ECG records. A user from Center B must only see their own center's ECG entries, not those belonging to Center A.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_004 — Two separate center accounts available for testing

## Test Data
| Field       | Value                              |
|-------------|------------------------------------|
| Account A   | reeva.kandroo+8@tricog.com / Tricog@1234 |
| Account B   | (second center account if available) |
| Device      | Pixel 5 (393×851, Android emu)    |

## Steps
1. Log in as Account A and note the ECG patient names/IDs visible on dashboard
2. Log out
3. Log in as Account B (different center)
4. Observe the ECG list on the dashboard
5. Verify no ECG entries from Account A's center appear in Account B's list

## Expected Result
Account B's ECG list contains only their own center's records. No records belonging to Account A's center are visible. The API response for Account B contains only center-scoped data.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
