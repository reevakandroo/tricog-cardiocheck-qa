---
id: TC_MHPA_006
module: Mobile HIPAA Compliance
title: Session timeout makes PHI inaccessible after token expiry
type: Security
severity: Critical
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
After a session token expires or a session timeout occurs, PHI must no longer be accessible. The application must enforce session expiry server-side and redirect expired sessions to the login page.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User has a valid session with a known token

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Log in with valid credentials and capture the session/auth cookie or token
2. Modify the token value to simulate expiry (alter a character) or wait for natural expiry
3. With the expired/invalid token, attempt to make a direct API request to list ECG data
4. Navigate to the dashboard with the expired session
5. Observe whether PHI is returned or the session redirects to login

## Expected Result
API requests with an expired or invalid token return HTTP 401 Unauthorized. The application redirects to the login page. No PHI is returned after token expiry. The session is validated server-side.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
