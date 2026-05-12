---
id: TC_MGES_008
module: Mobile Gestures
title: All interactive touch targets meet minimum 44×44dp size requirement
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
All interactive elements (buttons, links, form inputs) must meet the minimum 44×44 CSS pixels touch target size required by WCAG 2.5.5 and Apple/Google HIG guidelines.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field          | Value                          |
|----------------|--------------------------------|
| Min Target     | 44×44 CSS pixels               |
| Device         | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Use `document.querySelectorAll('button, a, input, [role="button"]')` to collect all interactive elements
4. For each element, check `getBoundingClientRect()` and verify width ≥ 44 and height ≥ 44
5. Log any elements that fail the size check
6. Repeat on the patient form and profile pages

## Expected Result
All primary interactive elements (Login button, New ECG button, ECG list items, nav items) have touch targets of at least 44×44 CSS pixels. Any failing elements are flagged for remediation.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
