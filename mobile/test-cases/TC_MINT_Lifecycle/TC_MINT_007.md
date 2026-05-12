---
id: TC_MINT_007
module: Mobile App Lifecycle
title: Browser tab switch does not expose PHI on return
type: Security
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a user switches to another browser tab and returns to CardioCheck, the PHI displayed must not be inadvertently visible to a bystander (e.g., due to an animation or transient state), and the app must not log out prematurely.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and viewing a patient ECG detail with visible PHI

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to a patient ECG detail page
3. Note the PHI displayed (patient name, risk result)
4. Switch to another browser tab (simulate with new page navigation)
5. Return to the CardioCheck tab after 10 seconds
6. Observe the state: PHI still shown, app still active, or session expired screen

## Expected Result
Upon returning to the app tab, the same page and PHI are shown (session still active). No intermediate blank state exposes partial PHI. If session timeout policy requires re-auth, a login screen is shown cleanly without exposing PHI.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
