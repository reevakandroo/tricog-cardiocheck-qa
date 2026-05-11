---
id: TC_SECH_010
module: Security Headers
title: SQL injection payload in login email field — application handles gracefully
type: Negative
severity: Critical
preconditions: [PC_001]
---

## Scenario
Verify that the CardioCheck login email field is resistant to SQL injection attacks. Submitting a classic SQL injection payload should not result in authentication bypass, database errors being surfaced, or any unexpected application behavior beyond a standard "invalid credentials" response.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open

## Test Data
| Field | Value |
|-------|-------|
| SQL Injection Payloads (Email) | `' OR '1'='1` |
| | `' OR 1=1--` |
| | `admin'--` |
| | `'; DROP TABLE users;--` |
| Password | Any value |

## Steps
1. Navigate to the CardioCheck login page.
2. In the email field, enter: `' OR '1'='1`
3. In the password field, enter any value (e.g., "test").
4. Submit the form.
5. Observe and record the response — check for authentication bypass, database error messages, or unexpected behavior.
6. Repeat with: `' OR 1=1--` in the email field.
7. Repeat with: `'; DROP TABLE users;--` in the email field.
8. Check the browser console and network tab for any database error responses.

## Expected Result
- All SQL injection payloads are rejected with a standard "Invalid email or password" error.
- No authentication bypass occurs (user is not logged in with these payloads).
- No database error messages are surfaced in the UI or API response body.
- The application returns a consistent error response regardless of the payload.
- No 500 Internal Server Error or database stack trace is returned.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- SQL injection bypass is a Critical severity finding — it would allow unauthorized access to all patient PHI.
- Also check the API response body for any SQL error fragments (e.g., "syntax error", "mysql", "postgres").
- Modern backends using parameterized queries or ORMs should be inherently protected — this test confirms that protection.
- Document the exact HTTP response code and body for each payload.
