---
id: TC_MLGN_006
module: Mobile Authentication
title: Both fields empty prevents login form submission
type: Negative
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
A user taps the Login button without entering any credentials; the app must block submission and highlight both required fields.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | (empty)                        |
| Password | (empty)                        |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed with both fields empty
3. Tap the Login button without entering any credentials
4. Observe the response

## Expected Result
The form does not submit. Validation errors are shown for both fields (or a general "Please fill in all required fields" message). No network request is sent. The user remains on the login page.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
