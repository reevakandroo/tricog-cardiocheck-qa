---
id: TC_MLGN_012
module: Mobile Authentication
title: Five rapid wrong login attempts do not cause unhandled exception
type: Security
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
An attacker submits five consecutive wrong password attempts in rapid succession; the app must handle each attempt gracefully without crashing, exposing stack traces, or revealing server internals. This also validates basic brute-force resilience.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Email    | reeva.kandroo+8@tricog.com     |
| Password | WrongPass1, WrongPass2, WrongPass3, WrongPass4, WrongPass5 |
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Enter `reeva.kandroo+8@tricog.com` in the email field
3. Enter `WrongPass1` in the password field and tap Login
4. Without waiting, immediately enter `WrongPass2` and tap Login again
5. Repeat for `WrongPass3`, `WrongPass4`, `WrongPass5` in rapid succession
6. Monitor the browser console and network tab for errors after all 5 attempts

## Expected Result
All 5 attempts return graceful error messages (401/400). No unhandled JavaScript exceptions appear in the console. No server error (5xx) is returned. The app may optionally display a rate-limit or lockout warning after multiple failures.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
