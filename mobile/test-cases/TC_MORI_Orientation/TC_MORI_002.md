---
id: TC_MORI_002
module: Mobile Orientation
title: Login screen in landscape orientation shows no overflow
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002]
---

## Scenario
The login screen must render correctly in landscape orientation (851×393) without horizontal overflow or inaccessible form elements.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field       | Value                    |
|-------------|--------------------------|
| Orientation | Landscape (851×393 px)   |
| Device      | Pixel 5 emulation        |

## Steps
1. Set viewport to 851×393 (landscape) using `page.setViewportSize({ width: 851, height: 393 })`
2. Navigate to https://cardiocheck-releasev140.up.railway.app
3. Check `document.body.scrollWidth <= 851`
4. Verify all login elements are visible or reachable by vertical scroll
5. Take a screenshot

## Expected Result
No horizontal overflow. Login form elements are accessible by vertical scrolling if needed. The Login button is not hidden or cut off.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
