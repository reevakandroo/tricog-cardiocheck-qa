---
id: TC_MRSK_002
module: Mobile Risk Assessment
title: Get Risk Assessment button is visible on mobile
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The "Get Risk Assessment" button must be visible and accessible within the mobile viewport after an ECG is recorded, without requiring horizontal scrolling.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and an ECG entry is open

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Open an ECG entry that has not yet had a risk assessment
4. Scroll through the page to locate the "Get Risk Assessment" button
5. Confirm the button is fully visible within the 393px viewport width
6. Check that no horizontal scrolling is needed to see the button

## Expected Result
The "Get Risk Assessment" button is visible and fully rendered within the 393×851 viewport. The button text is not truncated. No horizontal overflow required to reach it.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
