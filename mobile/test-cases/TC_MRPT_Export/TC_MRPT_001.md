---
id: TC_MRPT_001
module: Mobile Export/Report
title: Export PDF button is present on risk result page
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After a risk assessment is completed, an Export PDF button must be visible on the risk result page on the mobile viewport.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and a completed risk result is available

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Open a completed risk result page
4. Scroll through the page to locate the Export PDF button
5. Confirm the button is fully visible and its label is legible

## Expected Result
An Export PDF button (or equivalent download button) is present and visible on the risk result page within the mobile viewport. The button is not hidden, disabled, or cut off.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
