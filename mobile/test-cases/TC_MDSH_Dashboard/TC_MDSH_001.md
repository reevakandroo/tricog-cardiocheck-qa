---
id: TC_MDSH_001
module: Mobile Dashboard
title: Dashboard loads after login and ECG list is visible
type: Positive
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After a successful login, the dashboard must load and present the ECG list to the user within an acceptable timeframe on a mobile viewport.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User account reeva.kandroo+8@tricog.com has at least one ECG entry

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | Tricog@1234                    |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials
3. Wait for the dashboard page to load (max 15s)
4. Observe whether the ECG list section is visible within the 393px wide viewport
5. Confirm at least one patient ECG entry is rendered

## Expected Result
The dashboard loads within 15 seconds. The ECG list is visible and contains at least one entry. No error states or blank screens are shown.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
