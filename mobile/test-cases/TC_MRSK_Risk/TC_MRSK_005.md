---
id: TC_MRSK_005
module: Mobile Risk Assessment
title: Risk result layout fits mobile screen with no horizontal overflow
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The risk result page must render all content within the 393px wide mobile viewport without requiring horizontal scrolling.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and a risk result is available

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Viewport | 393×851 px                     |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and open a completed risk result page
3. Execute `document.body.scrollWidth` in console and compare against 393
4. Visually inspect each section: risk level banner, patient info, waveform preview, action buttons
5. Confirm no element protrudes beyond 393px
6. Take a screenshot for baseline comparison

## Expected Result
`document.body.scrollWidth <= 393`. No horizontal scrollbar appears. All content sections are visible and fit within the viewport width.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
