---
id: TC_CON_007
module: Concurrent Users
title: Same account opened in two browser tabs — session conflict check
type: Negative
severity: Medium
preconditions: [PC_001, PC_004]
---

## Scenario
Verify the behavior when the same user account (Account A) is open simultaneously in two tabs of the same browser (sharing the same cookie store). Document whether the system detects and handles the dual-tab scenario, whether state conflicts arise, and whether any security or data integrity issues result.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) is active

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Method | Two tabs in the same browser window (shared cookie store) |

## Steps
1. Log in with Account A in Tab 1 and confirm the dashboard loads.
2. Open Tab 2 in the same browser and navigate to the CardioCheck URL.
3. Confirm Tab 2 is also logged in (shared cookie session).
4. In Tab 1, open an ECG and begin filling in the patient form.
5. In Tab 2, navigate to the same ECG.
6. Submit the patient form from Tab 1.
7. In Tab 2, attempt to submit the same (or different) data for the same ECG.
8. Document the result — error message, silent overwrite, or duplicate submission.

## Expected Result
- The system should handle dual-tab usage gracefully.
- At minimum: the second submission should not silently overwrite the first without user warning.
- No crash in either tab.
- No duplicate records created from the dual submission.
- Ideally: a stale data warning or conflict resolution prompt is shown.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Two tabs in the same browser share cookies, so this is effectively one session used in two windows.
- Silent duplicate writes are a Medium severity data integrity issue.
- An unhandled exception in Tab 2 upon conflict is a UX bug.
- This scenario is common for clinical users who multi-task across tabs.
