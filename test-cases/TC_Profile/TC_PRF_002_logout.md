---
id: TC_PRF_002
module: Profile
title: Logout — Session Cleared and Back Button Does Not Access Dashboard
type: Positive
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user opens the profile screen, triggers logout, and is redirected to the login screen. After logout, using the browser back button or navigating directly to a protected route must not grant access to the dashboard or any patient data.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard

## Test Data
| Field          | Value                          |
|----------------|-------------------------------|
| Email          | reeva.kandroo+8@tricog.com    |
| Password       | Tricog@1234                   |
| Protected URL  | https://cardiocheck-releasev140.up.railway.app/ecgs |

## Steps

### Phase 1 — Record Pre-Logout Session State
1. Open DevTools → Application → Storage
2. Note the presence of Cognito tokens (ID token, access token, refresh token) in `localStorage`, `sessionStorage`, `IndexedDB`, or Flutter secure storage keys
3. Note any session-related cookies set for the app domain

### Phase 2 — Logout
4. From the ECG dashboard, click the profile icon or navigate to `/profile`
5. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree
6. Locate the **Logout** option (may be labeled "Sign Out", "Log Out", or similar)
7. Click the **Logout** button
8. Observe the screen transition

### Phase 3 — Verify Login Screen
9. Confirm the app navigates to the login screen
10. Confirm no user name, email, or patient data is visible on the login screen

### Phase 4 — Verify Storage Cleared
11. Open DevTools → Application → Storage
12. Verify that all Cognito tokens have been removed from every storage mechanism (localStorage, sessionStorage, IndexedDB, Cookies)
13. Verify no session-related Flutter secure storage keys remain populated

### Phase 5 — Back Button Test
14. Press the browser **Back** button one or more times
15. Observe the resulting screen — it must remain on or redirect back to login, not show the dashboard

### Phase 6 — Direct URL Test
16. Manually type `https://cardiocheck-releasev140.up.railway.app/ecgs` in the browser address bar and press Enter
17. Observe: the app must redirect to login, not render the ECG dashboard

## Expected Result
- After clicking Logout, the app immediately navigates to the login screen
- All Cognito tokens (ID, access, refresh) are removed from all browser storage mechanisms
- No session cookies remain that could silently re-authenticate the user
- Pressing the **back button** shows the login screen, not the dashboard or any patient-facing screen
- Directly navigating to `/ecgs` after logout redirects to the login screen
- The Cognito global sign-out call is made (refresh token revoked server-side), not merely a local token deletion

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Critical HIPAA/security check:** A hospital workstation is shared by multiple clinical staff. If back navigation after logout reveals the previous user's dashboard or patient ECGs, this is a **Critical** defect — a different user could access PHI without authentication.
- Cognito offers two logout modes: (1) local sign-out (clears tokens on the device only) and (2) global sign-out (revokes refresh tokens across all devices/sessions). CardioCheck must use global sign-out or at minimum revoke the refresh token so the session cannot be silently renewed.
- Cognito ID tokens are short-lived (~1 hour) and cannot be revoked, but the refresh token must be revoked. Document which mode is implemented.
- If back navigation shows a cached Flutter canvas rendering of the dashboard without making new API calls, this is still a **High** defect — PHI may be cached and visible without authentication.
