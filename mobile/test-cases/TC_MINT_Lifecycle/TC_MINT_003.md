---
id: TC_MINT_003
module: Mobile App Lifecycle
title: Page refresh mid-session handles session correctly
type: Edge
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a user refreshes the page (F5/pull-to-refresh on address bar) while logged in, the app must either maintain the session or gracefully redirect to login, without crashing or showing a blank page.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load
3. Call `page.reload()` to simulate a hard refresh
4. Wait for the page to reload (max 30s)
5. Observe whether: (a) dashboard reloads with session intact, or (b) login page is shown

## Expected Result
After page refresh, either: (a) the session is preserved via cookie and the dashboard reloads correctly, or (b) the user is redirected to login (acceptable if no persistent session). No blank page, infinite spinner, or JavaScript error is shown.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
