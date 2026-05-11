---
id: TC_SECH_004
module: Security Headers
title: Referrer-Policy header is present and configured to restrict referrer leakage
type: Positive
severity: Medium
preconditions: [PC_001]
---

## Scenario
Verify that the CardioCheck application sets a `Referrer-Policy` HTTP response header that restricts how much referrer information is sent when users navigate from the app to external links. This prevents PHI or session context from leaking in the `Referer` header to third-party services.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and pointed at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Target URL | https://cardiocheck.tricog.com |
| Expected Header | Referrer-Policy |
| Acceptable Values | no-referrer, strict-origin, strict-origin-when-cross-origin, same-origin |
| Unacceptable Values | unsafe-url, no-referrer-when-downgrade (leaks full URL) |

## Steps
1. Open the browser DevTools (Network tab).
2. Navigate to the CardioCheck login page.
3. Inspect the HTTP response headers for the main HTML document.
4. Search for the `Referrer-Policy` header.
5. Record its value.
6. Verify the value is one of the privacy-preserving options: `no-referrer`, `strict-origin`, `strict-origin-when-cross-origin`, or `same-origin`.
7. Confirm the value is NOT `unsafe-url` or missing entirely.
8. Check the same header on an authenticated dashboard page response.

## Expected Result
- `Referrer-Policy` header is present on all responses.
- The policy value restricts referrer leakage — acceptable values: `no-referrer`, `strict-origin`, `strict-origin-when-cross-origin`, or `same-origin`.
- The header is consistent across page and API responses.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- For a HIPAA application, `no-referrer` or `strict-origin` are the safest choices.
- An absent `Referrer-Policy` defaults to browser behavior, which may send full URLs as referrers — unacceptable for PHI context.
- Medium severity: not directly exploitable but contributes to data minimization compliance.
