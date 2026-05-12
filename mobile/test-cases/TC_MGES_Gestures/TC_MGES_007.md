---
id: TC_MGES_007
module: Mobile Gestures
title: Scroll to bottom then back to top works correctly
type: Positive
severity: Low
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A user scrolls the ECG list all the way to the bottom and then back to the top; navigation must remain stable and all entries must remain visible.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and ECG list has multiple entries

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Use `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` to scroll to bottom
4. Confirm the last ECG entry is visible
5. Use `page.evaluate(() => window.scrollTo(0, 0))` to scroll back to top
6. Confirm the first ECG entry is visible again
7. Check console for any errors during the scroll cycle

## Expected Result
The list scrolls to the bottom and back to the top without layout breaks, missing entries, or JavaScript errors. All entries remain intact after the scroll cycle.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
