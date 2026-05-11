---
id: TC_SECH_006
module: Security Headers
title: Session token changes after successful login — session fixation prevention
type: Positive
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that the session token (Bearer token or session cookie) issued after a successful login is different from any token that existed before login. This confirms that the application regenerates session identifiers on authentication, preventing session fixation attacks where an attacker pre-sets a known session ID.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Token Locations | Authorization Bearer token in localStorage, sessionStorage, or response headers |

## Steps
1. Open the browser DevTools (Application tab + Network tab).
2. Before logging in, check localStorage, sessionStorage, and cookies for any existing auth tokens — record their values (or confirm absence).
3. Open the Network tab and capture the login POST request.
4. Submit valid login credentials.
5. Capture the token returned in the login response.
6. Check localStorage and sessionStorage again — note the new token stored by the app.
7. Compare the token before login vs. the token after login.
8. Log out and log in again — confirm a new (different) token is issued on the second login.

## Expected Result
- No valid auth token exists before login.
- After login, a new token is issued that was not present before.
- Logging out and logging in again produces a different token each time.
- The old token (from a previous session) cannot be reused after logout.
- No predictable or static token is issued.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Session fixation is a High severity vulnerability — an attacker who can set a session cookie before the victim logs in can hijack the session.
- Check both JWT tokens (stateless) and session IDs (stateful) — different rotation expectations apply.
- For JWTs: verify the `iat` (issued at) and `jti` (JWT ID) claims change between logins.
