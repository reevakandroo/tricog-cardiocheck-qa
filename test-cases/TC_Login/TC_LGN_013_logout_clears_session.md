---
id: TC_LGN_013
module: Authentication
title: Logout Clears Session and Redirects to Login Screen
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
A logged-in user explicitly logs out. The session must be fully cleared from secure storage, all tokens revoked or invalidated, and the user redirected to the login screen. Navigating back (browser back button) or directly visiting a protected route must not bypass the logout.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL
- [PC_003](../preconditions/PC_003_user_account_active.md) - Test user is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|-------------------------------|
| Email    | reeva.kandroo+8@tricog.com    |
| Password | Tricog@1234                   |

## Steps

### Phase 1 — Login
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Log in with valid credentials and reach the dashboard
5. Note the session token key/location in DevTools → Application → Storage (mask the actual token value)

### Phase 2 — Logout
6. Locate and click the logout option (menu, profile icon, or dedicated logout button within the app)
7. Click `flt-semantics-placeholder` if navigation occurs to maintain accessibility context
8. Observe the navigation result

### Phase 3 — Verify Session Cleared
9. Open DevTools → Application → Storage
10. Confirm that all session-related keys in `localStorage`, `sessionStorage`, `IndexedDB`, and `Cookies` have been cleared or deleted
11. Confirm no Cognito tokens (ID token, access token, refresh token) remain in any storage

### Phase 4 — Attempt Post-Logout Access
12. Press the browser **Back** button to attempt returning to the dashboard
13. Observe: Is the dashboard shown, or is the user redirected to login?
14. Manually navigate to `https://cardiocheck-releasev140.up.railway.app` (direct URL entry)
15. Observe: Is the login screen shown, or does the app auto-authenticate?

### Phase 5 — Attempt Token Reuse
16. Copy the session token noted in step 5 (before logout)
17. Manually inject it back into `localStorage` using the DevTools console
18. Reload the page
19. Observe: Does the app accept the previously revoked token and log the user in?

## Expected Result
- After clicking logout, the app navigates to the login screen
- **All tokens** (Cognito ID, access, and refresh tokens) are removed from all browser storage mechanisms
- Pressing the back button or navigating directly to the app URL after logout shows the **login screen**, not the dashboard
- **Token reuse (step 16–19):** The app does NOT re-authenticate with a revoked/cleared token. The app detects the token is no longer valid and remains on or redirects back to the login screen
- Cognito sign-out is called globally (revoking refresh tokens server-side) not just a local token deletion

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Critical security check:** If the back button after logout reveals the dashboard (even a cached view), this is a **Critical** security defect. On a medical device application with PHI, a shared computer scenario (hospital workstation) means another user could access the previous user's patient data.
- **HIPAA requirement:** The Security Rule requires that electronic PHI is accessible only by authenticated and authorized users. Incomplete logout violates this requirement.
- **Cognito global sign-out:** There are two types of logout in Cognito: (1) local sign-out (clears tokens from the device only) and (2) global sign-out (revokes all refresh tokens for the user across all devices). Verify which is implemented. Global sign-out is the more secure option.
- **Token revocation:** Cognito ID tokens are not revocable (they are valid until expiry — typically 1 hour). However, refresh tokens ARE revocable. Confirm that at minimum the refresh token is revoked on logout so the session cannot be silently renewed.
- If logout does not call Cognito's global sign-out, document this as a **High** security finding.
