---
id: TC_MLGN_001
module: Mobile Authentication
title: Valid login with correct credentials navigates to dashboard
type: Positive
severity: Critical
preconditions: [MPC_001, MPC_002]
---

## Scenario
A registered user enters valid credentials on the mobile login screen and is redirected to the main dashboard after successful authentication.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                            |
|----------|----------------------------------|
| Email    | reeva.kandroo+8@tricog.com       |
| Password | Tricog@1234                      |
| Device   | Pixel 5 (393×851, Android emu)   |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Confirm the login page is displayed with email and password fields
3. Tap the email input field and enter `reeva.kandroo+8@tricog.com`
4. Tap the password input field and enter `Tricog@1234`
5. Tap the Login button
6. Wait for navigation to complete (max 30s)

## Expected Result
User is authenticated and redirected to the dashboard. The ECG list or main dashboard view is visible. No error messages are displayed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
