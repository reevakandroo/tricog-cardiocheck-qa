---
id: TC_MSEC_009
module: Mobile Security
title: No PHI is exposed in browser console error messages
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Protected Health Information (PHI) such as patient names, ages, diagnoses, or ECG data must never appear in browser console messages (log, warn, error) as these can be captured in monitoring tools or accessed by malicious scripts.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and navigating through patient data

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Capture all browser console messages using `page.on('console')`
3. Log in with valid credentials
4. Navigate through: dashboard, ECG list, ECG detail, risk result, patient form
5. Review all captured console messages for PHI content (patient names, ages, diagnoses, ECG values)

## Expected Result
No patient names, ages, diagnoses, ECG measurements, or other PHI appears in browser console messages (log, warn, error). Console messages are generic operational messages only.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
