---
id: TC_SECH_001
module: Security Headers
title: Strict-Transport-Security (HSTS) header is present on all responses
type: Positive
severity: High
preconditions: [PC_001]
---

## Scenario
Verify that the CardioCheck application returns a valid `Strict-Transport-Security` (HSTS) HTTP header on all responses, enforcing HTTPS connections and protecting against protocol downgrade attacks. HSTS is a mandatory security control for any application handling PHI under HIPAA.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and pointed at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Target URL | https://cardiocheck.tricog.com |
| Expected Header | Strict-Transport-Security |
| Expected Value | max-age >= 31536000 (1 year), ideally with includeSubDomains |

## Steps
1. Open the browser DevTools (Network tab).
2. Navigate to the CardioCheck login page over HTTPS.
3. Inspect the response headers for the initial HTML document request.
4. Search for the `Strict-Transport-Security` header.
5. Record the `max-age` value — verify it is at least 31536000 (1 year).
6. Check if `includeSubDomains` directive is present.
7. Check if `preload` directive is present (desirable but not mandatory).
8. Repeat check on a POST request (e.g., login submit) to confirm HSTS applies to API responses.

## Expected Result
- `Strict-Transport-Security` header is present on the login page response.
- `max-age` is >= 31536000 seconds (1 year minimum).
- `includeSubDomains` is present to protect all subdomains.
- Header is consistent across both page and API responses.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Absence of HSTS is a High severity finding for a HIPAA-governed application.
- Use `curl -I https://cardiocheck.tricog.com` or browser DevTools to verify.
- HSTS `preload` submission (hstspreload.org) is a best practice recommendation, not a test failure.
