---
id: TC_MDSH_002
module: Mobile Dashboard
title: ECG list shows patient entries within mobile viewport
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The ECG list must render patient entries correctly within the 393px wide mobile viewport, with no horizontal overflow or cut-off content.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User account has at least one ECG entry

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | Tricog@1234                    |
| Device   | Pixel 5 (393×851, Android emu) |
| Viewport | 393×851 px                     |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Wait for the dashboard to load
4. Inspect the ECG list for horizontal overflow (check `document.body.scrollWidth > 393`)
5. Verify each list entry shows patient name, date, or other relevant fields without truncation issues
6. Take a screenshot for layout verification

## Expected Result
All ECG list entries are fully visible within 393px width. No horizontal scrollbar appears. Patient name and date fields are readable. Content is not clipped at the right edge.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
