---
id: TC_MINT_005
module: Mobile App Lifecycle
title: Multiple rapid taps do not cause duplicate navigation
type: Edge
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a user taps the same navigation element multiple times rapidly, the app must not push duplicate routes onto the history stack or navigate to the same page twice.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field      | Value                          |
|------------|--------------------------------|
| Taps       | 5 rapid taps within 500ms      |
| Device     | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Rapidly tap the same ECG list item 5 times within 500ms using `page.tap()` in a loop
4. Observe how many pages are pushed to browser history
5. Press the back button multiple times and note the navigation stack

## Expected Result
Only one navigation event occurs despite multiple rapid taps. The browser history stack does not contain duplicate entries. The back button returns to the expected previous page, not the same detail page multiple times.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
