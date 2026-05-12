---
id: TC_MLGN_011
module: Mobile Authentication
title: Mobile touch tap on login button works correctly
type: Positive
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
A mobile user interacts with the login button using touch events (not mouse click); the button must respond correctly to touch input and trigger the login flow.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field       | Value                          |
|-------------|--------------------------------|
| Email       | reeva.kandroo+8@tricog.com     |
| Password    | Tricog@1234                    |
| Device      | Pixel 5 (393×851, Android emu) |
| Input Type  | Touch event (touchstart/touchend) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed
3. Using Playwright touch emulation, tap the email input and enter `reeva.kandroo+8@tricog.com`
4. Tap the password input and enter `Tricog@1234`
5. Use `page.tap()` (touch event) rather than `page.click()` to activate the Login button
6. Wait for navigation (max 30s)
7. Observe whether the button responds and login proceeds

## Expected Result
The Login button responds to the touch event and triggers the authentication flow. The user is navigated to the dashboard. No JS errors appear in console related to touch event handling.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
