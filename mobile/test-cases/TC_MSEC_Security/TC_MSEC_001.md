---
id: TC_MSEC_001
module: Mobile Security
title: JWT token is not stored in browser localStorage or sessionStorage
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
JWT authentication tokens must not be stored in browser localStorage or sessionStorage, as these are accessible to JavaScript and vulnerable to XSS attacks. This is a critical OWASP Top 10 concern.

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
3. Execute `JSON.stringify(Object.entries(localStorage))` in browser console and inspect output
4. Execute `JSON.stringify(Object.entries(sessionStorage))` in browser console and inspect output
5. Check for any key containing: `token`, `jwt`, `auth`, `bearer`, `access_token`, `refresh_token`

## Expected Result
No JWT or authentication token is found in localStorage or sessionStorage. Tokens should be stored in HttpOnly cookies (not accessible to JavaScript) or in memory only.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
