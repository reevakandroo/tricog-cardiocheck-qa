---
id: TC_MDSH_005
module: Mobile Dashboard
title: New ECG button is visible and tappable on mobile
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The "New ECG" (or equivalent) button must be visible within the mobile viewport and respond to a touch tap, initiating the patient/ECG creation flow.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials and wait for dashboard to load
3. Locate the New ECG button (FAB, header button, or bottom nav item)
4. Confirm it is visible within the 393×851 viewport without scrolling
5. Tap the button using a touch event
6. Observe navigation or modal opening

## Expected Result
The New ECG button is visible within the viewport. Tapping it navigates to the patient form or ECG creation flow without errors.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
