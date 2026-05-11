---
id: TC_CON_003
module: Concurrent Users
title: Account A and Account B see the same ECG list for their shared center
type: Positive
severity: High
preconditions: [PC_001, PC_004, PC_005]
---

## Scenario
Verify that two accounts belonging to the same diagnostic center see the same set of ECG records on their respective dashboards. This confirms that ECG data is correctly scoped to the center, not to the individual user, and that concurrent access doesn't cause data inconsistency.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) is active
- [PC_005](../preconditions/PC_005_account_b_ready.md) - Account B (reeva.kandroo+16@tricog.com) is active

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Account B Email | reeva.kandroo+16@tricog.com |
| Center | Same diagnostic center for both accounts |

## Steps
1. Log in with Account A in Browser Context 1.
2. Record the list of ECG entries visible on Account A's dashboard (count + identifiers).
3. Log in with Account B in Browser Context 2.
4. Record the list of ECG entries visible on Account B's dashboard (count + identifiers).
5. Compare the two lists — verify they contain the same ECG records.
6. Check the total ECG count matches between the two views.
7. Verify the sort order is consistent (or document if it differs).
8. Confirm neither user sees records from other centers.

## Expected Result
- Account A and Account B see the same set of ECG records.
- ECG count is identical between both sessions.
- Same ECG IDs/identifiers appear in both lists.
- No center data leakage (records from other centers are not visible).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the lists differ, check whether the API uses user-scoped vs. center-scoped queries.
- A discrepancy between the two lists is a data isolation bug — High severity.
- Check the API response payload for both accounts to compare at the data level, not just the UI.
