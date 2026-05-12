---
id: TC_MORI_004
module: Mobile Orientation
title: Dashboard renders correctly in landscape orientation
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The dashboard must adapt and render correctly when viewed in landscape orientation (851×393), with the ECG list accessible.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in

## Test Data
| Field       | Value                    |
|-------------|--------------------------|
| Orientation | Landscape (851×393 px)   |
| Device      | Pixel 5 emulation        |

## Steps
1. Log in with portrait viewport (393×851)
2. Switch viewport to landscape (851×393) using `page.setViewportSize`
3. Wait for any layout re-render
4. Verify the ECG list is still accessible (scroll if needed)
5. Check for horizontal overflow and layout breaks

## Expected Result
Dashboard adapts to landscape orientation. ECG list is accessible by vertical scrolling. No horizontal overflow. Navigation elements remain functional.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
