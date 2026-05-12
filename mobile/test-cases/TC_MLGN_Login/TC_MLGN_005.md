---
id: TC_MLGN_005
module: Mobile Authentication
title: Empty password field prevents login form submission
type: Negative
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
A user fills in the email field but leaves the password field empty; the app must block submission and prompt the user to enter a password.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | (empty)                        |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email input field and enter `reeva.kandroo+8@tricog.com`
4. Leave the password field empty
5. Tap the Login button
6. Observe the response

## Expected Result
The form does not submit. An inline validation error or toast indicates the password field is required. The user remains on the login page. No network request is sent.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
