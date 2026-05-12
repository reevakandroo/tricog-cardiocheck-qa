---
id: TC_MLGN_009
module: Mobile Authentication
title: 300-character email string is handled gracefully
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002]
---

## Scenario
A user enters an extremely long email address (300 characters) to test boundary handling; the app must not crash, freeze, or expose a server error.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                                                                                                                                                                                                                                                          |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Email    | aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@test.com |
| Password | Tricog@1234                                                                                                                                                                                                                                                    |
| Device   | Pixel 5 (393×851, Android emu)                                                                                                                                                                                                                                 |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email field and paste a 300-character email string (291 'a' chars + `@test.com`)
4. Tap the password field and enter `Tricog@1234`
5. Tap the Login button
6. Observe response and check browser console for errors

## Expected Result
The application either: (a) truncates the input at a reasonable max length client-side, or (b) submits and returns a validation error (400) without crashing. No server error (5xx) occurs. The page does not freeze or become unresponsive.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
