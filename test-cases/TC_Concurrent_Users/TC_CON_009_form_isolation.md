---
id: TC_CON_009
module: Concurrent Users
title: Account A on patient form and Account B on login page — A's form state is unaffected
type: Negative
severity: Medium
preconditions: [PC_001, PC_004, PC_005]
---

## Scenario
Verify that Account A's in-progress patient form state is completely isolated from Account B's login activity happening concurrently. This tests that there is no shared global state between different user contexts that could cause Account A's form to reset, lose data, or behave unexpectedly when Account B logs in simultaneously.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) is logged in and on a patient form
- [PC_005](../preconditions/PC_005_account_b_ready.md) - Account B (reeva.kandroo+16@tricog.com) has valid credentials

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Account B Email | reeva.kandroo+16@tricog.com |
| Form Values | Patient name: "Isolation Test", Age: 55 |

## Steps
1. Log in with Account A in Context 1 and navigate to the patient form for an ECG.
2. Fill in the form fields: patient name = "Isolation Test", age = 55 (or applicable fields).
3. Do NOT submit — leave the form in an unsaved state.
4. Open Context 2 and navigate to the CardioCheck login page (Account B is not yet logged in).
5. In Context 2, submit Account B's login credentials.
6. Confirm Account B successfully logs in.
7. Switch back to Context 1 (Account A) — verify the form still contains the entered data.
8. Verify Account A's form can still be submitted normally.

## Expected Result
- Account A's form data ("Isolation Test", 55) is preserved after Account B logs in.
- Account A's session is still active and functional.
- No form reset, data loss, or unexpected navigation occurred in Context 1.
- Account B's dashboard loads independently without affecting Account A's state.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If Account A's form resets or data disappears, there may be a shared localStorage or sessionStorage conflict between contexts.
- Two separate browser contexts (incognito vs. standard) do not share storage — this is expected behavior.
- If testing same-browser tabs, shared storage can cause interference — document carefully.
