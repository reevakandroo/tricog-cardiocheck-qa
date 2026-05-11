---
id: TC_PADV_007
module: Advanced UX
title: Double-clicking the Login button does not trigger duplicate authentication requests
type: Negative
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that rapidly double-clicking the Login button does not fire two authentication requests or cause the user to be logged in twice. Duplicate auth requests can cause race conditions, duplicate session tokens, or unexpected routing — especially problematic in a healthcare context.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Click Method | Double-click (two rapid clicks within 300ms) |

## Steps
1. Open the browser DevTools (Network tab) and enable "Preserve log".
2. Navigate to the CardioCheck login page.
3. Enter valid credentials (email and password).
4. Rapidly double-click the Login button (two clicks within ~300ms).
5. Observe the network requests — count how many login POST requests are fired.
6. Observe the UI response — confirm it navigates to the dashboard once, not twice.
7. Check whether the Login button is disabled after the first click (to prevent double submission).
8. Confirm the final session state is clean and functional.

## Expected Result
- Only one authentication request is sent to the server despite the double-click.
- The Login button is disabled or shows a loading state after the first click.
- The user is navigated to the dashboard exactly once.
- No duplicate session tokens are created.
- No error or crash from the second click being processed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If two login requests are fired and both succeed, document whether two separate sessions are created.
- A button that remains active after the first click is a UX bug at minimum, and a race condition risk.
- High severity if a duplicate login causes session corruption or two conflicting tokens to be stored.
