---
id: TC_MSEC_007
module: Mobile Security
title: Seven wrong password attempts trigger lockout check
type: Security
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
After 7 consecutive failed login attempts with wrong passwords, the application should either lock the account temporarily or rate-limit further attempts to mitigate brute-force attacks.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | WrongPass1 through WrongPass7  |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Enter valid email and submit 7 consecutive wrong passwords (WrongPass1 through WrongPass7)
3. After each attempt, note the HTTP response code and error message
4. After the 7th attempt, check if:
   - The response changes to a lockout message
   - A CAPTCHA appears
   - The response time increases (rate limiting)
5. Attempt login with the correct password on attempt 8 and observe behavior

## Expected Result
After multiple failed attempts, the application either: (a) locks the account with a clear message, (b) presents a CAPTCHA, or (c) rate-limits with increasing delays. Brute-force is not freely permitted without any mitigation.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
