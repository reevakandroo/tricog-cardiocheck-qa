---
id: TC_MSEC_006
module: Mobile Security
title: SQL injection in search field does not cause server error
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
An SQL injection payload entered in the search bar must not cause a server error or expose database information.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Search Input | `1' OR '1'='1`                 |
| Search Input 2 | `'; DROP TABLE ecg_records; --` |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Enter `1' OR '1'='1` in the search field
4. Observe the search results and network response status code
5. Clear and enter `'; DROP TABLE ecg_records; --`
6. Observe the network response and check for server errors

## Expected Result
No server error (5xx) is returned for SQL injection inputs. The search returns an empty result or a graceful "no results" state. The database is not affected. No error details or stack traces are exposed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
