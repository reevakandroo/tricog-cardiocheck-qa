---
id: TC_MHPA_004
module: Mobile HIPAA Compliance
title: TLS is in use and all requests are transmitted over HTTPS
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
HIPAA requires encryption of PHI in transit. All network requests containing PHI must be transmitted over TLS/HTTPS, not plain HTTP.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Set up network interception to capture all requests: `page.on('request')`
3. Log in and navigate through all major pages
4. For each captured request, check that the URL begins with `https://`
5. Check for any `http://` requests (mixed content)
6. Verify the TLS certificate is valid (no certificate errors)

## Expected Result
100% of network requests use HTTPS. No HTTP (unencrypted) requests are made. No mixed-content warnings appear in the browser console. The TLS certificate is valid and not expired.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
