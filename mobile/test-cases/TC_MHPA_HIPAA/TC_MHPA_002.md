---
id: TC_MHPA_002
module: Mobile HIPAA Compliance
title: PHI is not present in URL path or query parameters
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
PHI must not appear in URL path segments or query parameters, as URLs are logged in server access logs, browser history, CDN logs, and referrer headers — all of which would constitute PHI exposure under HIPAA.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and navigating patient data

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and capture all navigation URLs using `page.on('framenavigated')`
3. Navigate through: dashboard, ECG list, ECG detail, risk result, patient form
4. Inspect each captured URL for: patient names, age values, diagnosis keywords, DOB, any PHI identifiers
5. Document any PHI found in URLs

## Expected Result
No PHI appears in URL paths or query strings. Patient and ECG identifiers in URLs use opaque IDs (e.g., UUIDs like `/ecg/a1b2c3d4-...`), not PII such as patient names or dates of birth.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
