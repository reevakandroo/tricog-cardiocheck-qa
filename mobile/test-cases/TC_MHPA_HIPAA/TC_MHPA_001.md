---
id: TC_MHPA_001
module: Mobile HIPAA Compliance
title: PHI is not stored unencrypted in browser storage
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Protected Health Information (PHI) — including patient names, ages, ECG data, and risk results — must not be stored in plain text in browser localStorage or sessionStorage, as this constitutes an unencrypted PHI exposure risk under HIPAA.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and has viewed patient ECG data

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate through patient ECG data
3. Execute: `JSON.stringify(Object.entries(localStorage))` — inspect all keys/values
4. Execute: `JSON.stringify(Object.entries(sessionStorage))` — inspect all keys/values
5. Search for PHI indicators: patient names, age, ecg, risk, diagnosis, phi
6. Document any PHI found in storage

## Expected Result
No unencrypted PHI is stored in localStorage or sessionStorage. If any patient data is cached, it must be encrypted or stored only in secure, HttpOnly cookies.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
