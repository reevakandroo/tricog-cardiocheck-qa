---
id: TC_MPER_003
module: Mobile Performance
title: ECG list renders within 5 seconds of page load
type: Performance
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The ECG list items must appear within 5 seconds of the dashboard page becoming visible, to ensure clinicians can immediately see patient records.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Network  | Unthrottled                    |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for the dashboard to appear
3. Record timestamp when the dashboard route is active
4. Use `page.waitForSelector('[data-testid="ecg-list-item"]')` or equivalent ECG list selector
5. Record the time when the first list item becomes visible
6. Calculate rendering time

## Expected Result
At least one ECG list item is visible within 5 seconds of the dashboard page loading. A skeleton or loading placeholder may show before the items appear.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
