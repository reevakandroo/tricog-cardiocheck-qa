---
id: TC_MLGN_010
module: Mobile Authentication
title: 300-character password string is handled gracefully
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002]
---

## Scenario
A user enters an extremely long password (300 characters) to test boundary handling; the app must not crash, freeze, or expose a server error.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                                                                                                                                                                                                                                                          |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Email    | reeva.kandroo+8@tricog.com                                                                                                                                                                                                                                     |
| Password | AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA |
| Device   | Pixel 5 (393×851, Android emu)                                                                                                                                                                                                                                 |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email field and enter `reeva.kandroo+8@tricog.com`
4. Tap the password field and paste a 300-character password string
5. Tap the Login button
6. Observe response and check browser console for errors

## Expected Result
The application either: (a) truncates the password input at a reasonable max client-side, or (b) submits and returns a "Invalid credentials" error (401/400) without crashing. No server error (5xx) occurs. The page remains responsive.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
