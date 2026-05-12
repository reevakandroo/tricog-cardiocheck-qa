---
id: TC_MORI_001
module: Mobile Orientation
title: Login screen in portrait orientation shows no overflow
type: Positive
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
The login screen must render correctly in portrait orientation (393×851) without any horizontal overflow or clipped elements.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field       | Value                    |
|-------------|--------------------------|
| Orientation | Portrait (393×851 px)    |
| Device      | Pixel 5 emulation        |

## Steps
1. Set viewport to 393×851 (portrait) on Pixel 5 emulation
2. Navigate to https://cardiocheck-releasev140.up.railway.app
3. Check `document.body.scrollWidth <= 393`
4. Verify email field, password field, and Login button are all visible
5. Take a screenshot

## Expected Result
No horizontal overflow (`scrollWidth <= 393`). All login form elements are visible and properly laid out. Text is legible.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
