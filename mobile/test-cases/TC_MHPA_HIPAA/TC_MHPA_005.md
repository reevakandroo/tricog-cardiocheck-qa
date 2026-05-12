---
id: TC_MHPA_005
module: Mobile HIPAA Compliance
title: Center isolation prevents cross-center data access
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_004]
---

## Scenario
HIPAA requires access controls to limit PHI access to authorized users only. Users from one medical center must not be able to access PHI belonging to patients of another center, even by manipulating API requests.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_004 — At least two center accounts are available; Center A ECG IDs are known

## Test Data
| Field     | Value                              |
|-----------|------------------------------------|
| Account A | reeva.kandroo+8@tricog.com         |
| Account B | Second center account              |
| Device    | Pixel 5 (393×851, Android emu)     |

## Steps
1. Log in as Account A and note ECG entry IDs visible in the list
2. Log out
3. Log in as Account B
4. Attempt to directly access Account A's ECG detail URL (using its ID)
5. Observe whether Account B can view Account A's patient data

## Expected Result
Account B receives a 403 Forbidden or 404 Not Found when attempting to access Account A's ECG records. No PHI from Account A is returned or displayed to Account B.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
