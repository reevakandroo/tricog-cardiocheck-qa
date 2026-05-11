---
id: TC_CON_002
module: Concurrent Users
title: Same account logged in from two browser contexts — document session behavior
type: Positive/Edge
severity: Medium
preconditions: [PC_001, PC_004]
---

## Scenario
Verify and document the behavior when the same CardioCheck account (Account A) is logged in simultaneously from two separate browser contexts. The goal is to characterize whether the system allows concurrent sessions, silently revokes the first session, shows a warning, or enforces single-session policy.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) is active

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Context 1 | Standard browser window |
| Context 2 | Incognito window |

## Steps
1. Open Context 1 and log in with Account A credentials.
2. Confirm the dashboard loads and the session is active in Context 1.
3. Open Context 2 (incognito) and log in with the same Account A credentials.
4. Confirm whether Context 2 successfully loads the dashboard.
5. Return to Context 1 and attempt an action (e.g., refresh the page or navigate).
6. Document whether Context 1 session is still active or has been invalidated.
7. Note any warnings, error messages, or forced logout in either context.
8. Document the final state of both sessions.

## Expected Result
- Behavior is documented — one of the following outcomes is acceptable:
  - Both sessions allowed concurrently (multi-session policy).
  - Second login invalidates the first session with a clear notification.
  - System warns the user that another session is active.
- No silent data corruption or mixed session data between the two contexts.
- No security-relevant cross-session data leakage.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This test is primarily a documentation/characterization test — document the actual behavior regardless of outcome.
- A system that silently shares session tokens between contexts without warning is a security concern — flag as Medium.
- For HIPAA compliance, concurrent access from unknown devices should ideally generate an audit log entry.
