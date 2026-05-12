---
id: TC_MRSK_006
module: Mobile Risk Assessment
title: Risk result page is scrollable and all content is reachable
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The risk result page may contain more content than fits in the 851px tall mobile viewport; the page must be vertically scrollable so all content is reachable.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on a risk result page

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and open a completed risk result page
3. Scroll to the bottom of the page using a touch swipe gesture
4. Confirm all content sections are accessible (risk level, patient details, ECG data, action buttons)
5. Scroll back to the top
6. Confirm no content is inaccessible due to fixed elements overlapping scrollable content

## Expected Result
All content on the risk result page is reachable by vertical scrolling. No section is permanently hidden behind a fixed overlay. Action buttons (Export, Back) are accessible.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
