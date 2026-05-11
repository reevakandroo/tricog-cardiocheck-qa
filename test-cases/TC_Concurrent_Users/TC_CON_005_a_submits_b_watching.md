---
id: TC_CON_005
module: Concurrent Users
title: Account A submits patient form while Account B has the same ECG open — document B's state
type: Edge
severity: Medium
preconditions: [PC_001, PC_004, PC_005, PC_003]
---

## Scenario
Verify and document what Account B sees on their view of an ECG record when Account A fills in and submits the patient data form for that same ECG. The system should handle this gracefully — either updating B's view, showing a staleness warning, or maintaining B's current view without crashing.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) logged in
- [PC_005](../preconditions/PC_005_account_b_ready.md) - Account B (reeva.kandroo+16@tricog.com) logged in
- [PC_003](../preconditions/PC_003_ecg_available.md) - An ECG with a fillable patient form is available

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Account B Email | reeva.kandroo+16@tricog.com |
| Target ECG | Same ECG record ID (noted before test) |
| Form Fields | Patient name, age, gender (test values) |

## Steps
1. Log in with Account A (Context 1) and Account B (Context 2).
2. Both users navigate to and open the same ECG record.
3. Account B stays on the ECG view without interacting.
4. Account A navigates to the patient data form for that ECG.
5. Account A fills in patient details: name = "Test Patient", age = 45, gender = Male (or applicable fields).
6. Account A submits the form.
7. Observe Account B's view — note any real-time update, stale data indicator, or no change.
8. Account B manually refreshes the page — confirm the submitted data is now visible.

## Expected Result
- Account A's submission succeeds without error.
- Account B's view does not crash when Account A submits.
- After Account B refreshes, the data submitted by Account A is visible.
- No data loss or corruption occurs.
- If the system supports real-time updates, Account B's view should reflect the change automatically.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This tests the absence of optimistic locking conflicts and real-time update behavior.
- Document whether Account B's view auto-refreshes or remains stale — this informs future real-time collaboration requirements.
- A silent data loss (A's submission not reflected even after B refreshes) is a High severity bug.
