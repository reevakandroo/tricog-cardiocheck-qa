---
id: TC_MPER_001
module: Mobile Performance
title: Login response time is under 30 seconds on mobile
type: Performance
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
The login request (from button tap to dashboard navigation) must complete within 30 seconds on mobile to meet usability standards in clinical settings.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | Tricog@1234                    |
| Device   | Pixel 5 (393×851, Android emu) |
| Network  | Unthrottled                    |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Enter valid credentials
3. Record `Date.now()` before tapping Login
4. Tap the Login button
5. Wait for navigation to dashboard
6. Record `Date.now()` after dashboard is visible
7. Calculate total login duration

## Expected Result
Total login time (from button tap to dashboard visible) is under 30 seconds on unthrottled network. If >30s, this is a performance regression to flag.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
