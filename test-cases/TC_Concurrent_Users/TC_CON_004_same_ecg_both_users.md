---
id: TC_CON_004
module: Concurrent Users
title: Both users open the same ECG record simultaneously — no error
type: Positive
severity: High
preconditions: [PC_001, PC_004, PC_005, PC_003]
---

## Scenario
Verify that Account A and Account B can open and view the same ECG record at the same time without causing errors, data corruption, or session interference. This simulates a real-world scenario where two clinicians review the same ECG concurrently.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) logged in
- [PC_005](../preconditions/PC_005_account_b_ready.md) - Account B (reeva.kandroo+16@tricog.com) logged in
- [PC_003](../preconditions/PC_003_ecg_available.md) - At least one ECG record is available for both users

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Account B Email | reeva.kandroo+16@tricog.com |
| Target ECG | Same ECG record ID (noted before test) |

## Steps
1. Log in with Account A in Context 1 and navigate to the dashboard.
2. Log in with Account B in Context 2 and navigate to the dashboard.
3. Note a specific ECG record ID that is visible to both users.
4. In Context 1 (Account A), open the target ECG record.
5. Within 2 seconds, in Context 2 (Account B), open the same ECG record.
6. Verify Account A's view loads and displays the ECG correctly.
7. Verify Account B's view loads and displays the same ECG correctly.
8. Check the browser console in both contexts for any errors.

## Expected Result
- Both Account A and Account B can view the same ECG record simultaneously.
- ECG data displayed in both contexts is identical.
- No errors, crashes, or blank screens in either context.
- No session contamination (Account A does not see Account B's identity and vice versa).
- No locking mechanism prevents the second user from viewing the record.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Concurrent read access to the same record is expected to be safe — a failure here indicates a resource-locking or session bug.
- If the app applies optimistic locking, document whether the second user gets a warning or is silently blocked.
- Note the ECG record ID used for reproducibility.
