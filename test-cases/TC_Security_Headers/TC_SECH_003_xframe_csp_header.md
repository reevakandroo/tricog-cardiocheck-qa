---
id: TC_SECH_003
module: Security Headers
title: X-Frame-Options or CSP frame-ancestors header is present to prevent clickjacking
type: Positive
severity: High
preconditions: [PC_001]
---

## Scenario
Verify that the CardioCheck application implements clickjacking protection via either the `X-Frame-Options` response header or a `Content-Security-Policy` header with a `frame-ancestors` directive. This prevents the application from being embedded in a malicious iframe on a third-party site.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and pointed at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Target URL | https://cardiocheck.tricog.com |
| Accepted Header Option 1 | X-Frame-Options: DENY or SAMEORIGIN |
| Accepted Header Option 2 | Content-Security-Policy: frame-ancestors 'none' or 'self' |

## Steps
1. Open the browser DevTools (Network tab).
2. Navigate to the CardioCheck login page.
3. Inspect the HTTP response headers for the main HTML document.
4. Search for `X-Frame-Options` — record its value.
5. Search for `Content-Security-Policy` — check for a `frame-ancestors` directive.
6. Verify at least one of the two mechanisms is present and set to DENY or 'none' (preferred), or SAMEORIGIN/'self'.
7. Attempt to embed the CardioCheck URL in a test iframe page — confirm the browser blocks the embedding.
8. Document which mechanism is implemented.

## Expected Result
- At least one of the following is present:
  - `X-Frame-Options: DENY` (preferred) or `X-Frame-Options: SAMEORIGIN`
  - `Content-Security-Policy` containing `frame-ancestors 'none'` or `frame-ancestors 'self'`
- Attempting to embed the app in an iframe results in a browser-blocked load.
- The protection is present on the login page (highest-value target for clickjacking).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- `X-Frame-Options` is the older but widely supported mechanism. CSP `frame-ancestors` is more modern and takes precedence when both are present.
- Absence of both is a High severity clickjacking vulnerability — especially critical for a login page.
- HIPAA: clickjacking on a healthcare login page is a patient safety risk.
