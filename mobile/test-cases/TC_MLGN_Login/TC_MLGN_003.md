---
id: TC_MLGN_003
module: Mobile Authentication
title: Non-existent email is rejected with an appropriate error
type: Negative
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
A user attempts to log in with an email address that does not exist in the system; the app must reject the attempt without leaking whether the account exists.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                             |
|----------|-----------------------------------|
| Email    | nonexistent.user@tricog.com       |
| Password | Tricog@1234                       |
| Device   | Pixel 5 (393×851, Android emu)    |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email input field and enter `nonexistent.user@tricog.com`
4. Tap the password input field and enter `Tricog@1234`
5. Tap the Login button
6. Observe the response

## Expected Result
An error message is displayed. The user stays on the login page. The error message does not specifically confirm whether the email exists (to prevent account enumeration). No server error (5xx) is thrown.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
