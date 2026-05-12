---
id: TC_MINT_004
module: Mobile App Lifecycle
title: Deep link to ECG list via hash routing works correctly
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Flutter Web apps typically use hash-based routing (`/#/route`). Navigating directly to a deep-linked route must load the correct page (assuming the user is authenticated).

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is authenticated (cookie session exists)

## Test Data
| Field    | Value                                              |
|----------|----------------------------------------------------|
| Deep URL | https://cardiocheck-releasev140.up.railway.app/#/  |
| Device   | Pixel 5 (393×851, Android emu)                     |

## Steps
1. Log in to https://cardiocheck-releasev140.up.railway.app
2. Note the dashboard route URL (e.g., `/#/` or `/#/dashboard`)
3. Copy the full URL
4. Open a new page/tab and navigate directly to the noted URL
5. Observe whether the correct page loads or if the app redirects to login

## Expected Result
Direct navigation to the deep-linked URL loads the correct page (dashboard/ECG list) if the session is active. If not authenticated, the app redirects to login without a crash or blank screen.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
