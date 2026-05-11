---
id: TC_SECH_008
module: Security Headers
title: Lockout or failed-login message does not reveal whether the email address exists
type: Edge
severity: Medium
preconditions: [PC_001]
---

## Scenario
Verify that the error messages returned by the CardioCheck login page for failed login attempts do not reveal whether a given email address is registered in the system. User enumeration via login error messages allows attackers to build a list of valid accounts before launching targeted attacks.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open

## Test Data
| Field | Value |
|-------|-------|
| Known Valid Email | reeva.kandroo@tricog.com (registered) |
| Known Invalid Email | nonexistent.user.xyz123@tricog.com (not registered) |
| Wrong Password | "WrongPassword123!" |

## Steps
1. Navigate to the CardioCheck login page.
2. Enter a known valid email with a wrong password. Submit.
3. Record the exact error message displayed (screenshot + text).
4. Navigate back to the login page (or clear the form).
5. Enter a known invalid email with any password. Submit.
6. Record the exact error message displayed.
7. Compare the two error messages — check if they are identical.
8. Also compare HTTP response codes for both attempts.

## Expected Result
- The error message for a valid email + wrong password is identical to the message for an invalid email + any password.
- Example acceptable message: "Invalid email or password."
- Unacceptable responses:
  - "No account found with this email." (reveals email does not exist)
  - "Incorrect password." (reveals email exists)
- HTTP response codes for both scenarios should be identical (both 401 or both 400).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Also check the lockout message (from TC_SECH_007) — a locked account revealing a different message than a non-existent account enables enumeration.
- Check the API response body (not just the UI) for enumeration signals in the JSON payload.
- Medium severity: not immediately exploitable but enables targeted brute force attacks.
