---
id: TC_CON_008
module: Concurrent Users
title: Account A seeds a new ECG — Account B refreshes and sees the new record
type: Edge
severity: Medium
preconditions: [PC_001, PC_004, PC_005]
---

## Scenario
Verify that when Account A causes a new ECG record to appear in the center's queue (by seeding test data or performing an action that adds a record), Account B can see the new record after refreshing the dashboard. This validates that center-level data updates are shared across concurrent user sessions.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) logged in
- [PC_005](../preconditions/PC_005_account_b_ready.md) - Account B (reeva.kandroo+16@tricog.com) logged in

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Account B Email | reeva.kandroo+16@tricog.com |
| New ECG | Seeded via test data script or manual upload |

## Steps
1. Log in with Account A (Context 1) and Account B (Context 2) concurrently.
2. Record the current ECG count visible to Account B.
3. Using Account A (or via test data seeding), add a new ECG record to the center.
4. Confirm the new ECG is visible on Account A's dashboard (refresh if needed).
5. Note the new ECG's identifier or key detail.
6. In Context 2, have Account B refresh the dashboard page.
7. Verify Account B now sees the new ECG record.
8. Confirm the new ECG's data matches what was seeded.

## Expected Result
- Account B sees the new ECG after refreshing.
- The new ECG's data is correct and matches what Account A's view shows.
- No duplicate entries appear.
- Account B's ECG count increases by the number of new records added.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This confirms that ECG data is stored at the center level and not cached per-user in a way that blocks new records from appearing.
- If the new ECG does not appear for Account B after refresh, check API query parameters for user-scoped vs. center-scoped filtering.
- Document the delay (if any) between Account A seeing the record and Account B seeing it after refresh.
