---
id: TC_MHPA_003
module: Mobile HIPAA Compliance
title: Minimum necessary PHI is displayed to logged-in users
type: Security
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
The HIPAA Minimum Necessary Standard requires that only the PHI needed to accomplish the intended purpose is disclosed. The application must not display PHI fields beyond what is clinically necessary for the current view.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the ECG list / risk result pages

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the ECG list
3. Document all PHI fields visible on the ECG list view (patient name, age, diagnosis, etc.)
4. Navigate to the ECG detail / risk result page
5. Document all PHI fields visible
6. Assess whether any displayed PHI appears unnecessary for the clinical workflow

## Expected Result
Only clinically necessary PHI is displayed on each screen. Sensitive fields like full DOB, national ID, address, or insurance info are not exposed unless strictly required. Findings of excessive PHI exposure are documented.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
