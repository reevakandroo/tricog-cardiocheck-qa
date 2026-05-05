---
id: TC_SEC_001
module: Security
title: Unauthenticated Access to /ecgs — Redirected to Login
type: Security
severity: Critical
preconditions: [PC_001]
---

## Scenario
Without any active session, a user attempts to directly navigate to the protected `/ecgs` route. The app must detect the absence of a valid auth token and immediately redirect to the login screen without rendering any ECG data or dashboard UI.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- No active session: the test must be performed in a fresh browser context (incognito window, cleared cookies/storage, or after explicit logout)

## Test Data
| Field           | Value                                                              |
|-----------------|--------------------------------------------------------------------|
| Target URL      | https://cardiocheck-releasev140.up.railway.app/ecgs               |
| Auth state      | Unauthenticated (no tokens in localStorage/sessionStorage/cookies) |

## Steps

### Phase 1 — Ensure No Active Session
1. Open a **new Incognito/Private window** in Chrome (or clear all cookies and localStorage for the CardioCheck domain)
2. Confirm DevTools → Application → Storage shows no CardioCheck-related tokens, cookies, or session data

### Phase 2 — Attempt Direct Navigation
3. In the address bar, type `https://cardiocheck-releasev140.up.railway.app/ecgs` and press Enter
4. Wait up to 5 seconds for the app to load and respond
5. Click `flt-semantics-placeholder` if the Flutter app loads, to activate the accessibility tree

### Phase 3 — Observe the Result
6. Note the final URL the browser lands on
7. Note the screen that is displayed (login form, dashboard, error page, etc.)
8. Check DevTools → Network tab for any API requests to `/ecgs` or protected endpoints that returned data before the redirect occurred

## Expected Result
- The browser is **redirected to the login screen** (URL contains `/login` or the root `/` shows the login form)
- The ECG dashboard, patient records, or any PHI are **not rendered** at any point — not even briefly before redirect
- No API calls to protected backend endpoints are made on behalf of an unauthenticated session (or if made, they return 401 and no data is rendered)
- The login screen prompts for credentials

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Critical HIPAA/security requirement:** any rendering of PHI before redirect (even a flash of ECG list content) is a **Critical** defect. Flutter Web single-page apps are particularly prone to "flash of unauthenticated content" if route guards are implemented incorrectly.
- The auth guard should check for a valid JWT in Flutter secure storage before rendering any protected widget tree. If the token check is async and the widget builds before the check completes, PHI may briefly appear.
- Check both the Flutter client-side route guard AND the backend API behavior independently:
  - Client-side: does the route guard redirect before rendering?
  - Backend: does the API return 401 for requests without a valid Bearer token?
- Document the exact redirect path (e.g., `/login` vs. `/`) in the Actual Result.
