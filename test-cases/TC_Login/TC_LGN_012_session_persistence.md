---
id: TC_LGN_012
module: Authentication
title: Session Persistence After Browser Close and Reopen
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
A user logs in successfully, closes the browser (or browser tab), then reopens the app URL. Because the session is persisted in secure storage, the user should be automatically re-authenticated and land on the dashboard without needing to log in again.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and network is available
- [PC_002](../preconditions/PC_002_app_accessible.md) - CardioCheck app is accessible at the target URL
- [PC_003](../preconditions/PC_003_user_account_active.md) - Test user account exists in Cognito and is active/confirmed

## Test Data
| Field    | Value                          |
|----------|-------------------------------|
| Email    | reeva.kandroo+8@tricog.com    |
| Password | Tricog@1234                   |

## Steps

### Phase 1 — Login and Verify Session Storage
1. Navigate to `https://cardiocheck-releasev140.up.railway.app`
2. Wait for the Flutter CanvasKit app to fully load
3. Click `flt-semantics-placeholder` to enable Flutter accessibility
4. Log in with valid credentials (`reeva.kandroo+8@tricog.com` / `Tricog@1234`)
5. Accept EULA if shown (click "I Agree")
6. Confirm successful navigation to the dashboard
7. Open browser DevTools → Application → Storage (localStorage / sessionStorage / IndexedDB / Cookies)
8. Record which storage mechanism holds the session token and note the token value structure (do not log actual token values in test results — mask them)
9. Confirm the storage key aligns with "secure storage" (e.g., `flutter_secure_storage`, encrypted entries)

### Phase 2 — Close and Reopen
10. Close the entire browser window (not just the tab — simulate a full browser restart)
11. Reopen the browser
12. Navigate to `https://cardiocheck-releasev140.up.railway.app`
13. Wait for the Flutter CanvasKit app to fully load
14. Click `flt-semantics-placeholder` to re-enable accessibility

### Phase 3 — Verify Auto-Authentication
15. Observe whether the app redirects to:
    - (a) The dashboard (session restored — expected behavior), or
    - (b) The login screen (session not persisted)
16. If redirected to the dashboard, confirm the correct user is loaded (no cross-session contamination)
17. Open network tab and verify that the app used the stored token to silently re-authenticate (token refresh call or UMS validation)

## Expected Result
- After reopening the browser and navigating to the app, the user is **automatically logged in** and lands on the dashboard
- The login screen is **not shown** again — no re-entry of credentials is required
- The session token in secure storage survives the browser close/reopen cycle
- The app silently validates or refreshes the token on startup (Cognito refresh token flow)
- If the stored token has expired (Cognito ID token TTL: 1 hour; refresh token TTL: configurable, typically 30 days), the app gracefully redirects to the login screen with a clear message (e.g., "Your session has expired. Please log in again")

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Source code confirmation:** Session is stored in secure storage and survives app restart. This test validates that implementation in the web environment (where "secure storage" maps to an encrypted browser storage mechanism).
- **Flutter Web secure storage:** On the web, `flutter_secure_storage` typically uses `localStorage` with AES encryption keyed to a per-session or per-device key. Verify that the stored value is encrypted (not plaintext JWT).
- **Token expiry edge case:** If testing more than 1 hour after initial login, the Cognito ID token will have expired. The app should use the Cognito refresh token to silently obtain a new ID token without prompting the user.
- **Security concern:** If the session token is stored in plaintext in `localStorage`, this is a **High** security finding — tokens are accessible to any JavaScript on the same origin (XSS risk).
- **HIPAA:** PHI access must be tied to authenticated sessions. Persistent sessions must implement appropriate timeout policies to prevent unauthorized access on shared devices.
