---
id: TC_MDSH_007
module: Mobile Dashboard
title: Long patient name truncates cleanly in ECG list
type: Edge
severity: Low
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a patient has a very long name, the ECG list item must truncate the name cleanly with ellipsis or wrapping, without breaking the row layout or causing horizontal overflow.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — An ECG entry with a patient name of 80+ characters exists or can be created

## Test Data
| Field        | Value                                                                 |
|--------------|-----------------------------------------------------------------------|
| Patient Name | Bartholomew Alexander Konstantinopoulos-Weatherington III (63 chars) |
| Device       | Pixel 5 (393×851, Android emu)                                        |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Ensure or create an ECG entry with a long patient name
4. Navigate to the dashboard and locate the long-name entry in the ECG list
5. Inspect the row layout for overflow issues
6. Check that `document.body.scrollWidth <= 393`

## Expected Result
The long name is truncated with an ellipsis (…) or wraps to a second line cleanly. The list row does not overflow horizontally. Other row content (date, status) remains visible and properly aligned.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
