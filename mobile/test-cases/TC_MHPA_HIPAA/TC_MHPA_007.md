---
id: TC_MHPA_007
module: Mobile HIPAA Compliance
title: No PHI is present in network request URL parameters
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
API requests made by the application must not include PHI (patient names, ages, diagnoses) in URL query parameters, as these would be logged in server and proxy access logs.

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
2. Set up request interception: `page.on('request', req => log(req.url()))`
3. Log in and navigate through all major pages (dashboard, ECG detail, risk result, search)
4. Capture all API request URLs
5. Inspect query parameters of each request for PHI content

## Expected Result
No API request URL contains PHI in query parameters. Search queries may contain partial patient names but must be treated with care. Patient lookups use opaque IDs in path parameters, not names or DOBs.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
