---
id: TC_MSEC_003
module: Mobile Security
title: No sensitive data is present in URL parameters
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Sensitive data such as patient IDs, session tokens, PHI, or authentication credentials must never appear in URL query parameters, as URLs are logged in browser history, server logs, and referrer headers.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and navigating through the app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and monitor all URL changes during navigation
3. Navigate to dashboard, ECG detail, risk result, and profile pages
4. Capture all URLs visited using Playwright `page.on('framenavigated')`
5. Inspect each URL for: token, jwt, password, email, patient_id, phi, name, dob

## Expected Result
No sensitive data (tokens, credentials, PHI) appears in URL parameters or fragments. Patient identifiers in URLs use opaque IDs (e.g., UUIDs) not PII like names or DOBs.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
