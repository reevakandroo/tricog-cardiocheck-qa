---
id: TC_MSRC_005
module: Mobile Search
title: Special characters in search do not cause server error
type: Security
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A user types special characters and SQL/XSS payloads into the search bar; the application must handle these inputs without server errors or script execution.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field        | Value                                  |
|--------------|----------------------------------------|
| Search Term  | `'; DROP TABLE patients; --`           |
| Search Term 2 | `<img src=x onerror=alert(1)>`        |
| Device       | Pixel 5 (393×851, Android emu)         |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Tap the search bar and enter `'; DROP TABLE patients; --`
4. Observe the response (no 5xx, no script execution)
5. Clear and enter `<img src=x onerror=alert(1)>`
6. Observe whether any JavaScript alert fires or console error appears

## Expected Result
No server error (5xx) is returned. No JavaScript executes. The search returns an empty result or a graceful "no results" state. The page remains stable.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
