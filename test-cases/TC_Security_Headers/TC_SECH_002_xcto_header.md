---
id: TC_SECH_002
module: Security Headers
title: X-Content-Type-Options header is set to nosniff
type: Positive
severity: Medium
preconditions: [PC_001]
---

## Scenario
Verify that the CardioCheck application returns the `X-Content-Type-Options: nosniff` HTTP response header. This header prevents browsers from MIME-sniffing a response away from the declared Content-Type, which helps mitigate certain XSS and content injection attacks.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and pointed at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Target URL | https://cardiocheck.tricog.com |
| Expected Header | X-Content-Type-Options |
| Expected Value | nosniff |

## Steps
1. Open the browser DevTools (Network tab).
2. Navigate to the CardioCheck login page.
3. Inspect the response headers for the main HTML document.
4. Search for the `X-Content-Type-Options` header.
5. Verify its value is exactly `nosniff`.
6. Check a CSS or JavaScript asset response — confirm the header is also present there.
7. Check an API response (e.g., login POST response) for the same header.
8. Confirm the header is consistently present across resource types.

## Expected Result
- `X-Content-Type-Options: nosniff` is present on the HTML document response.
- Header is also present on static asset responses (JS, CSS).
- Header is present on API responses.
- Value is exactly `nosniff` — no other value is acceptable.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is a simple but widely required security header — absence indicates the server configuration was not hardened.
- Can be verified quickly via `curl -I https://cardiocheck.tricog.com`.
- Medium severity: not immediately exploitable but part of the security baseline for HIPAA environments.
