---
id: TC_SECH_012
module: Security Headers
title: 300-character string in email field — handled gracefully without crash
type: Edge
severity: Medium
preconditions: [PC_001]
---

## Scenario
Verify that submitting a 300-character string in the login email field does not cause the CardioCheck application to crash, produce a server error, or behave unexpectedly. The application should either enforce a client-side character limit, return a graceful validation error, or reject the input server-side without exposing error details.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open

## Test Data
| Field | Value |
|-------|-------|
| Long Email (300 chars) | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@test.com` |
| Password | Any value |
| Expected Max Length | 254 characters (RFC 5321 email max) |

## Steps
1. Navigate to the CardioCheck login page.
2. Click on the email input field.
3. Paste or type a 300-character email string.
4. Observe whether the input field enforces a character limit (maxlength attribute).
5. If the input is accepted, submit the form.
6. Observe the response — check for validation error, server error, or graceful rejection.
7. Inspect the network request to see if the full 300-char string was sent to the API.
8. Confirm the HTTP response is a 400/422 (validation error) and not a 500 (server crash).

## Expected Result
- Input is either truncated by a client-side `maxlength` attribute before submission.
- OR input is submitted and the server returns a 400/422 validation error with a clear message.
- No 500 Internal Server Error or database error is returned.
- No crash or white screen in the UI.
- The error message does not expose backend implementation details.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- RFC 5321 specifies a maximum email address length of 254 characters — anything above that should be rejected.
- A 500 response to an oversized input indicates missing server-side validation — Medium severity.
- Also check if an extremely long string causes UI layout issues (text overflow in error display).
- Combine with XSS payloads at max length to test boundary + injection simultaneously if applicable.
