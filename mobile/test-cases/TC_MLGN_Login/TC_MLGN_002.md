---
id: TC_MLGN_002
module: Mobile Authentication
title: Invalid password displays error message
type: Negative
severity: Critical
preconditions: [MPC_001, MPC_002]
---

## Scenario
A registered user enters a valid email but incorrect password; the app must display a meaningful error and not proceed to the dashboard.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | WrongPassword99!               |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Tap the email input field and enter `reeva.kandroo+8@tricog.com`
4. Tap the password input field and enter `WrongPassword99!`
5. Tap the Login button
6. Observe the response

## Expected Result
An error message is displayed (e.g., "Invalid credentials" or "Incorrect password"). The user remains on the login page. No dashboard content is exposed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
