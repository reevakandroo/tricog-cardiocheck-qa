---
id: TC_MSEC_008
module: Mobile Security
title: Authentication cookies have HttpOnly and Secure flags set
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Any authentication or session cookies set by the application must have both the `HttpOnly` flag (not accessible to JavaScript) and `Secure` flag (only sent over HTTPS) to protect against XSS and network interception attacks.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User has successfully logged in

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Use Playwright `context.cookies()` to retrieve all cookies after login
4. For each cookie, check the `httpOnly` and `secure` properties
5. Identify any authentication-related cookies (by name: `session`, `auth`, `token`, etc.)

## Expected Result
All authentication/session cookies have `httpOnly: true` and `secure: true`. No authentication cookie is accessible via `document.cookie` in JavaScript. Cookies are only transmitted over HTTPS connections.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
