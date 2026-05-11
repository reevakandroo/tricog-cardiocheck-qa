---
id: TC_CON_001
module: Concurrent Users
title: Account A and Account B can log in simultaneously without interference
type: Positive
severity: High
preconditions: [PC_001, PC_004, PC_005]
---

## Scenario
Verify that two distinct user accounts from the same diagnostic center can log in simultaneously without interfering with each other's sessions. Both accounts should land on the dashboard with their own authenticated session context after concurrent login.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) is active and not currently logged in
- [PC_005](../preconditions/PC_005_account_b_ready.md) - Account B (reeva.kandroo+16@tricog.com) is active and not currently logged in

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Account B Email | reeva.kandroo+16@tricog.com |
| Center | Same diagnostic center |
| Method | Two separate browser contexts (incognito or separate browser profiles) |

## Steps
1. Open Browser Context 1 (standard window) and navigate to the CardioCheck login URL.
2. Open Browser Context 2 (incognito window or separate profile) and navigate to the CardioCheck login URL.
3. In Context 1, begin entering Account A credentials (email field filled).
4. In Context 2, simultaneously begin entering Account B credentials (email field filled).
5. Submit login for Account A in Context 1.
6. Submit login for Account B in Context 2 within 2 seconds of step 5.
7. Verify Account A lands on the dashboard in Context 1 with Account A's identity.
8. Verify Account B lands on the dashboard in Context 2 with Account B's identity.

## Expected Result
- Both accounts successfully authenticate simultaneously.
- Context 1 shows Account A's session (correct name/email displayed).
- Context 2 shows Account B's session (correct name/email displayed).
- Neither session is corrupted by the concurrent login.
- No error messages or authentication failures.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Use two completely separate browser contexts to avoid shared cookie state.
- Check the identity indicator (username/email displayed in the header) in each context to confirm correct session.
- A session cross-contamination failure here would be a Critical security bug.
