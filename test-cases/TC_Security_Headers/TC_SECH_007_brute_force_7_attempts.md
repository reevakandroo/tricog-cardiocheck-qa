---
id: TC_SECH_007
module: Security Headers
title: 7 consecutive wrong password attempts — observe lockout or rate-limit behavior
type: Negative
severity: High
preconditions: [PC_001, PC_006]
---

## Scenario
Verify that the CardioCheck application responds to repeated failed login attempts with some form of rate limiting, account lockout, or CAPTCHA challenge. An attacker attempting a brute force attack against a known email should be blocked or significantly slowed after 7 consecutive failures.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_006](../preconditions/PC_006_test_lockout_account.md) - A dedicated test account that can be safely locked out is available

## Test Data
| Field | Value |
|-------|-------|
| Test Email | A designated test lockout account (NOT a production account) |
| Wrong Password | "WrongPassword123!" (repeated) |
| Attempt Count | 7 |

## Steps
1. Navigate to the CardioCheck login page.
2. Enter the test account email and an incorrect password.
3. Submit the login form — observe the error message. Record attempt #1.
4. Repeat the failed login attempt — record attempt #2.
5. Continue submitting wrong passwords — record attempts #3 through #7.
6. On attempt #7, observe the response: does the account lock, CAPTCHA appear, or error message change?
7. Note the exact error message displayed (check for email enumeration — see TC_SECH_008).
8. Attempt to log in with the correct password after the 7 failures — document whether access is blocked.

## Expected Result
- By attempt 5-7, one of the following protections activates:
  - Account lockout: login rejected even with correct password.
  - Rate limiting: submission is throttled or introduces a delay.
  - CAPTCHA: challenge appears before further attempts are allowed.
- Error messages do not change in a way that reveals whether the email exists (consistent message).
- The protection persists for a reasonable lockout period.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Use a test account specifically set aside for lockout testing — do not use production accounts.
- If there is no lockout or rate limiting after 7 attempts, this is a High severity security gap.
- For HIPAA: unauthorized access to PHI via brute force is a reportable breach risk.
- Document the exact lockout behavior and when the account recovers (time-based or manual unlock).
