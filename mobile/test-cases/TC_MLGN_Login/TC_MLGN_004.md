---
id: TC_MLGN_004
module: Mobile Authentication
title: Empty email field prevents login form submission
type: Negative
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
A user leaves the email field empty and attempts to submit the login form; the app must block submission and indicate the field is required.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | (empty)                        |
| Password | Tricog@1234                    |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Leave the email input field empty
4. Tap the password input field and enter `Tricog@1234`
5. Tap the Login button
6. Observe the response

## Expected Result
The form does not submit. An inline validation error or toast indicates the email field is required. The user remains on the login page. No network request is made with an empty email.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
