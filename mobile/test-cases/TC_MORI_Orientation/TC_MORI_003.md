---
id: TC_MORI_003
module: Mobile Orientation
title: Dashboard renders correctly in portrait orientation
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The dashboard with the ECG list must render correctly in portrait orientation, with all elements visible and no layout breaks.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in

## Test Data
| Field       | Value                    |
|-------------|--------------------------|
| Orientation | Portrait (393×851 px)    |
| Device      | Pixel 5 emulation        |

## Steps
1. Set viewport to 393×851 (portrait)
2. Log in with valid credentials
3. Wait for dashboard to load
4. Verify ECG list, navigation elements, and New ECG button are all visible
5. Check for horizontal overflow

## Expected Result
Dashboard renders fully in portrait orientation. ECG list items, navigation, and action buttons are visible. No horizontal overflow.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
