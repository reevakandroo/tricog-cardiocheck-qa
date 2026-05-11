---
id: TC_SAUD_009
module: Storage API Audit
title: All authentication cookies have HttpOnly and Secure flags set
type: Edge
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that any authentication-related cookies set by CardioCheck include the `HttpOnly` flag (preventing JavaScript access) and the `Secure` flag (ensuring transmission only over HTTPS). These flags are mandatory security controls for session cookies under HIPAA and general web security standards.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Tool | Chrome DevTools → Application → Cookies |
| Expected Flags | HttpOnly: ✓, Secure: ✓ |

## Steps
1. Open Chrome DevTools → Application tab → Cookies.
2. Navigate to the CardioCheck login page — note any pre-login cookies.
3. Log in with valid credentials.
4. After login, inspect all cookies set by the CardioCheck domain.
5. For each auth-related cookie (session token, auth token, refresh token), check the `HttpOnly` column.
6. Check the `Secure` column for each auth-related cookie.
7. Verify the `SameSite` attribute is set to `Strict` or `Lax` (not `None` without justification).
8. Document any auth cookie missing one or more of these flags.

## Expected Result
- All authentication cookies have `HttpOnly` flag set — not accessible via JavaScript.
- All authentication cookies have `Secure` flag set — only transmitted over HTTPS.
- `SameSite` is set to `Strict` or `Lax` to prevent CSRF.
- No auth cookies are visible via `document.cookie` in the browser console.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- An auth cookie without `HttpOnly` is readable by JavaScript — any XSS vulnerability would expose the session token.
- An auth cookie without `Secure` can be transmitted over HTTP — a man-in-the-middle could steal it.
- Note: If the app uses localStorage/sessionStorage for tokens instead of cookies, document this and cross-reference TC_SAUD_001.
- High severity: missing cookie security flags in a HIPAA application is a significant compliance gap.
