---
id: TC_MRSK_003
module: Mobile Risk Assessment
title: High risk result displays correctly on mobile viewport
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A high-risk ECG result must display with appropriate visual emphasis (color, icon, label) on the mobile viewport without layout breakage or cut-off content.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and a seeded high-risk ECG result is available

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Navigate to an ECG entry with a seeded high-risk classification
4. Open the risk result page
5. Verify the high-risk label, color indicator, and any associated warning text are visible
6. Check for horizontal overflow (`document.body.scrollWidth <= 393`)
7. Take a screenshot for layout verification

## Expected Result
High-risk result is displayed prominently with appropriate visual indicators (red color or warning icon). All content fits within the 393px viewport. No horizontal overflow. Risk level label is clearly legible.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
