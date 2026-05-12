---
id: TC_MLGN_007
module: Mobile Authentication
title: SQL injection in email field does not cause server error
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002]
---

## Scenario
An attacker submits a classic SQL injection payload in the email field; the application must handle it safely without exposing a server error, database error, or unintended authentication.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | `' OR '1'='1' --`              |
| Password | anything                       |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email field and enter `' OR '1'='1' --`
4. Tap the password field and enter `anything`
5. Tap the Login button
6. Open browser DevTools (Network and Console tabs) and observe responses
7. Note the HTTP response status code

## Expected Result
The application returns a 400 Bad Request or a generic "Invalid credentials" error. No 500 server error is returned. No database error message or stack trace is exposed. The user is not authenticated.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
