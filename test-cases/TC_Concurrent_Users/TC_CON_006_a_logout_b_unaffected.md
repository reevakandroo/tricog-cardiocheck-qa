---
id: TC_CON_006
module: Concurrent Users
title: Account A logs out while Account B session continues unaffected
type: Positive
severity: High
preconditions: [PC_001, PC_004, PC_005]
---

## Scenario
Verify that when Account A logs out of the application, Account B's concurrent session is completely unaffected. Account B should remain authenticated and able to continue using the application without any session interruption or forced logout.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) logged in
- [PC_005](../preconditions/PC_005_account_b_ready.md) - Account B (reeva.kandroo+16@tricog.com) logged in

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Account B Email | reeva.kandroo+16@tricog.com |

## Steps
1. Log in with Account A in Context 1 and confirm dashboard is loaded.
2. Log in with Account B in Context 2 and confirm dashboard is loaded.
3. In Context 2 (Account B), navigate to an ECG detail view.
4. In Context 1 (Account A), initiate the logout flow.
5. Confirm Account A is logged out and redirected to the login page.
6. Immediately switch to Context 2 (Account B) and verify the session is still active.
7. Perform an action in Context 2 — navigate to another ECG or refresh the page.
8. Confirm Account B remains authenticated and the dashboard/ECG view loads normally.

## Expected Result
- Account A is successfully logged out and lands on the login page.
- Account B's session is not affected by Account A's logout.
- Account B can continue performing actions without being logged out.
- No error messages or authentication prompts appear for Account B.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is a server-side session isolation test — failure indicates sessions may be sharing a server-side token or cookie namespace.
- A failure here is a Critical security/stability bug.
- Verify using the network tab that Account B's subsequent requests still return 200 (not 401).
