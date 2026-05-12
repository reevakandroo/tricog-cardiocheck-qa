---
id: TC_MSEC_002
module: Mobile Security
title: Security headers are present on app HTTP responses
type: Security
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
HTTP responses from the application must include essential security headers to protect against common web attacks (XSS, clickjacking, MIME sniffing, etc.).

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Intercept the main page response using Playwright `page.on('response')`
3. Check for the following headers in the response:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY` or `SAMEORIGIN`
   - `Content-Security-Policy` (any value)
   - `Strict-Transport-Security` (HSTS)
   - `Referrer-Policy`
4. Log any missing headers

## Expected Result
All critical security headers are present. At minimum: `X-Content-Type-Options`, `X-Frame-Options`, and `Strict-Transport-Security`. Missing headers are documented as Medium/High findings.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
