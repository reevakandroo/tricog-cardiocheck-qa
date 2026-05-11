---
id: TC_CON_010
module: Concurrent Users
title: Login → logout → login again rapidly — no crash or session corruption
type: Edge
severity: Medium
preconditions: [PC_001, PC_004]
---

## Scenario
Verify that rapidly cycling through login, logout, and login again with the same account does not cause a crash, session corruption, or abnormal application state. This simulates a user who quickly logs out and back in, which can expose race conditions in session token management.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_004](../preconditions/PC_004_account_a_ready.md) - Account A (reeva.kandroo+8@tricog.com) credentials available

## Test Data
| Field | Value |
|-------|-------|
| Account A Email | reeva.kandroo+8@tricog.com |
| Cycle Count | 3 rapid login/logout cycles |
| Timing | Each cycle under 5 seconds |

## Steps
1. Navigate to the CardioCheck login page.
2. Log in with Account A credentials — confirm the dashboard loads.
3. Immediately initiate logout (within 3 seconds of landing on the dashboard).
4. Confirm the logout redirects to the login page.
5. Immediately log in again with Account A credentials.
6. Confirm the dashboard loads on the second login.
7. Log out again and log in a third time within 5 seconds.
8. Confirm the final session is stable — navigate through the app for 30 seconds without issues.

## Expected Result
- All three login cycles succeed without error.
- Each logout cleanly clears the session.
- Each login produces a fresh, valid session.
- The final session is fully functional — dashboard loads, ECG list visible.
- No JavaScript errors or white screens after rapid cycling.
- No old session token is reused (verify new token issued on each login).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Rapid login/logout can expose race conditions in token refresh, state cleanup, or router navigation.
- Check the network tab for any 401 errors or duplicate auth requests during the rapid cycling.
- If a session from a previous login is accidentally reused, flag as a security bug (session fixation risk).
