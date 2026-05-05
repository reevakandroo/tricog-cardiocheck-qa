---
id: TC_SEC_008
module: Security
title: Auth Token Storage — Tokens in Secure Storage Only, Not Accessible Cookies
type: Security
severity: High
preconditions: [PC_001, PC_002, PC_006]
---

## Scenario
After a successful login, auth tokens (Cognito ID token, access token, refresh token) must be stored in Flutter's secure storage (not in plain cookies or plain localStorage accessible by JavaScript). This prevents token theft via XSS attacks. The tester verifies the storage location and accessibility of all session tokens.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard
- [PC_006](../preconditions/PC_006_devtools_available.md) - Chrome DevTools is accessible for storage inspection

## Test Data
| Field          | Value                           |
|----------------|---------------------------------|
| Email          | reeva.kandroo+8@tricog.com     |
| Tokens to find | Cognito ID token, access token, refresh token |
| JS test        | `document.cookie` — must not contain tokens |

## Steps

### Phase 1 — Inspect Cookie Storage
1. After successful login, open DevTools → Application → **Cookies**
2. Select the CardioCheck domain (`cardiocheck-releasev140.up.railway.app`)
3. List all cookies and their attributes:
   - Name and value
   - `HttpOnly` flag (is it checked?)
   - `Secure` flag (is it checked?)
   - `SameSite` attribute
4. Check if any cookie contains a JWT-formatted value (`xxxxx.yyyyy.zzzzz` pattern)

### Phase 2 — Inspect localStorage
5. Open DevTools → Application → **localStorage**
6. Select the CardioCheck domain
7. List all keys and check if any contain JWT-formatted values or Cognito token identifiers (e.g., `CognitoIdentityServiceProvider.*`)

### Phase 3 — Inspect sessionStorage
8. Open DevTools → Application → **sessionStorage**
9. Repeat the check — note any JWT-formatted values

### Phase 4 — Inspect IndexedDB
10. Open DevTools → Application → **IndexedDB**
11. Look for Flutter-specific databases (e.g., `flutter_secure_storage` or similar)
12. Note whether values are stored encrypted or as plain text

### Phase 5 — JavaScript Accessibility Test
13. Open DevTools → **Console**
14. Run `document.cookie` — confirm no auth tokens are returned
15. Run `Object.keys(localStorage)` — note any suspicious keys
16. Attempt to access a known storage key: `localStorage.getItem('CognitoIdentityServiceProvider...')` — should return null or an opaque/encrypted value

## Expected Result
- **No auth tokens are stored in accessible cookies** (no JWT in cookie values, or if cookies are used, they are marked `HttpOnly` and `Secure`)
- `document.cookie` run from JavaScript does not expose any auth tokens
- Auth tokens stored in `localStorage` should ideally be absent OR if present (less secure but common in Cognito Amplify SDK implementations), they should be noted as a finding
- **Preferred:** tokens stored only in Flutter's `FlutterSecureStorage` (`IndexedDB` with encryption) — inaccessible to JavaScript
- If the Cognito Amplify SDK is used, tokens in `localStorage` are a known design choice — document but note the XSS risk
- All cookies set by the app have `Secure` and `SameSite=Strict` or `SameSite=Lax` attributes at minimum

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Flutter Secure Storage on Web:** `flutter_secure_storage` on Flutter Web stores values in `localStorage` under encrypted keys by default (as of stable versions). The encryption is AES using a key derived from a password stored in session cookies. This is not fully immune to XSS, but it is better than plaintext. Document the exact behavior observed.
- **Cognito Amplify SDK:** if the app uses AWS Amplify, tokens are stored in `localStorage` by default (`CognitoIdentityServiceProvider.<clientId>.<username>.idToken`, etc.) — these ARE accessible via JavaScript and represent an XSS risk. Log as **High** finding if tokens are in plaintext localStorage.
- **Best practice for medical apps:** tokens should be in `HttpOnly` cookies or memory only (not persisted to any JS-accessible storage). This may conflict with the "persistent login" requirement — document the tradeoff.
- `HttpOnly` cookies cannot be read by JavaScript (`document.cookie` won't return them) but are automatically sent with requests — they are the most XSS-resistant storage mechanism.
