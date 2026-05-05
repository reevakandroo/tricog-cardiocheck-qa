---
id: TC_HIPAA_002
module: HIPAA Compliance
title: Session auto-expiry after inactivity
type: HIPAA
severity: High
preconditions: [PC_002]
---
## Scenario
Verify session expires after prolonged inactivity (HIPAA §164.312(a)(2)(iii)).
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated user on dashboard
## Steps
1. Log in and reach ECG dashboard
2. Leave the browser idle for 60+ minutes (UMS JWT TTL = ~1h)
3. Attempt to click an ECG or navigate
## Expected Result
App either silently refreshes the session (if refresh token valid) OR redirects to /login with a timeout message. No PHI accessible after session expiry without re-authentication.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
## Notes
UMS JWT TTL is configurable via USER_SESSION_CACHE_TTL (default 300s for Redis cache). Full JWT expiry is ~1h from issuance. Test both cache miss and full expiry scenarios.
