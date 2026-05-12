---
id: TC_MSEC_004
module: Mobile Security
title: HTTPS is enforced and HTTP requests are redirected
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002]
---

## Scenario
All traffic to the application must use HTTPS. Any HTTP request must be automatically redirected to HTTPS with a 301/302 redirect.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field     | Value                                   |
|-----------|-----------------------------------------|
| HTTP URL  | http://cardiocheck-releasev140.up.railway.app |
| HTTPS URL | https://cardiocheck-releasev140.up.railway.app |
| Device    | Pixel 5 (393×851, Android emu)          |

## Steps
1. Attempt to navigate to the HTTP version: `http://cardiocheck-releasev140.up.railway.app`
2. Intercept the response and check the status code and `Location` header
3. Verify all subsequent requests use HTTPS
4. Check that the app URL in the address bar shows `https://`

## Expected Result
HTTP requests are redirected (301 or 302) to the HTTPS URL. All loaded resources (JS, CSS, API calls) use `https://`. No mixed content warnings in the console.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
