---
id: TC_MRSK_008
module: Mobile Risk Assessment
title: Multiple ECG entries are listed correctly on risk overview
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When multiple ECG entries exist for a patient or center, all entries must be listed correctly without duplication, ordering issues, or missing records.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and ≥3 ECG entries exist

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Device       | Pixel 5 (393×851, Android emu) |
| ECG Count    | 3 or more                      |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Navigate to the ECG list / dashboard
4. Count the visible ECG entries and compare to known data count
5. Verify each entry shows a distinct patient name and date
6. Tap each entry and confirm it opens the correct risk result
7. Navigate back between entries

## Expected Result
All ECG entries are listed without duplication. Each entry opens its correct risk result. No entry is missing or replaced by another. The list count matches the expected number of records.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
