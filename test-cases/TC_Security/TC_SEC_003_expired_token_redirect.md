---
id: TC_SEC_003
module: Security
title: Expired Token — API Call Fails Gracefully and Triggers Re-Authentication
type: Security
severity: Critical
preconditions: [PC_001, PC_002, PC_006]
---

## Scenario
A logged-in user's JWT is manually expired or deleted from storage to simulate a token expiry mid-session. The next API call triggered by any app action must fail with a 401, the app must handle this gracefully (no unhandled error), and the user must be redirected to login — or silently re-authenticated via refresh token if supported.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User is logged in and on the ECG dashboard
- [PC_006](../preconditions/PC_006_devtools_available.md) - Chrome DevTools is accessible for storage manipulation

## Test Data
| Field         | Value                          |
|---------------|-------------------------------|
| Email         | reeva.kandroo+8@tricog.com    |
| Manipulation  | Delete or corrupt JWT in browser storage via DevTools |
| Expected code | HTTP 401 Unauthorized on next API call |

## Steps

### Phase 1 — Identify Token Storage Location
1. From the ECG dashboard, open DevTools → Application → Storage
2. Inspect `localStorage`, `sessionStorage`, `IndexedDB`, and `Cookies` for Cognito token keys (e.g., `CognitoIdentityServiceProvider.*`, or Flutter secure storage equivalents)
3. Note the key name(s) where the auth tokens are stored

### Phase 2 — Invalidate the Token
**Option A — Delete the token:**
4a. Delete the `id_token` and `access_token` keys from their storage location using DevTools

**Option B — Corrupt the token:**
4b. Modify the stored token to an invalid value (e.g., replace the last 10 characters with `XXXXXXXXXX`)

**Option C — Wait for natural expiry (if test environment permits):**
4c. Wait until the Cognito ID token naturally expires (typically 1 hour) — then test the next API call

### Phase 3 — Trigger an API Call
5. With the token deleted/corrupted, interact with the app to trigger an API request:
   - Scroll the ECG list to trigger a load-more request
   - Or click on an ECG record to open its detail view
6. Observe the result

### Phase 4 — Verify Behavior
7. Confirm whether the app:
   a. Silently refreshes the token using the stored refresh token and retries the failed call (preferred for active sessions)
   b. Redirects to the login screen with a clear "session expired" message (acceptable)
8. Verify no unhandled JavaScript exceptions or raw 401 error details are displayed to the user
9. Verify no PHI is leaked in error messages or console output

## Expected Result
- The app does **not** crash or display a raw HTTP 401 error to the user
- The user is either:
  - **Silently re-authenticated** using the Cognito refresh token (if implemented), and the app continues without disruption, OR
  - **Redirected to the login screen** with a user-friendly message (e.g., "Your session has expired. Please log in again.")
- No PHI is exposed in error messages, console logs, or network responses that are shown to the user
- After re-authentication (if redirected to login), the user can log back in and return to the same context they were in

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Cognito token lifecycle:** the `access_token` and `id_token` expire after 1 hour by default. The `refresh_token` is valid for 30 days. The app should use the refresh token to silently renew the session before the access token expires (proactive refresh) or on the first 401 response (reactive refresh).
- If the app shows raw `401 Unauthorized` error text to the user, log as a **High** defect.
- If the app redirects to login but loses the user's current navigation context (e.g., drops them at `/ecgs` instead of returning to `/ecg/123/patient`), log as **Medium** UX defect.
- Flutter Web apps using Flutter Secure Storage may store tokens in `IndexedDB` under an encrypted key. Inspect the IndexedDB entries in DevTools for Flutter-specific storage patterns.
