---
id: TC_MHPA_008
module: Mobile HIPAA Compliance
title: No PHI is exposed via browser back history after logout
type: Security
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After logging out, the browser back button must not allow the user to navigate back to a cached page containing PHI. This prevents shoulder-surfing and unauthorized access in shared device scenarios.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User has been logged in and has viewed patient data

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to a patient ECG detail page with visible PHI
3. Note the current URL and patient data displayed
4. Log out from the profile page
5. Confirm redirect to the login page
6. Press the browser back button
7. Observe whether the previously viewed PHI page is shown or if a redirect/blank occurs

## Expected Result
After logout, pressing the back button does not show the previously viewed patient data page. The app either redirects to login again or shows a session-expired screen. No PHI is displayed to an unauthenticated state.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
