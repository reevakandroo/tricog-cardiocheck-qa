---
id: TC_SEC_009
module: Security
title: HTTPS Enforcement — HTTP Redirects to HTTPS, No Mixed Content
type: Security
severity: High
preconditions: [PC_001, PC_006]
---

## Scenario
All traffic to the CardioCheck app must be served over HTTPS. Any HTTP request must be redirected to HTTPS automatically. Additionally, the app must not load any resources (scripts, styles, images, API calls) over HTTP while the page is served over HTTPS (mixed content), which would degrade the security of the encrypted connection.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_006](../preconditions/PC_006_devtools_available.md) - Chrome DevTools is accessible for network and security inspection

## Test Data
| Field          | Value                                                              |
|----------------|--------------------------------------------------------------------|
| HTTP URL       | http://cardiocheck-releasev140.up.railway.app                     |
| HTTPS URL      | https://cardiocheck-releasev140.up.railway.app                    |
| API base URL   | To be identified from DevTools Network tab during normal session   |

## Steps

### Phase 1 — HTTP to HTTPS Redirect
1. In a fresh browser tab, navigate to `http://cardiocheck-releasev140.up.railway.app` (HTTP, not HTTPS)
2. Open DevTools → **Network** tab before navigating (capture all requests from the start)
3. Observe whether the browser is automatically redirected to `https://`
4. Note the HTTP status code of the redirect (expected: 301 Moved Permanently or 302 Found)
5. Note the final URL after redirect (expected: `https://cardiocheck-releasev140.up.railway.app`)

### Phase 2 — Check HTTPS Certificate
6. Navigate to `https://cardiocheck-releasev140.up.railway.app`
7. Click the padlock icon in the browser address bar
8. Verify the certificate is valid (not expired, not self-signed, issued by a trusted CA)
9. Note the certificate expiry date and issuing authority

### Phase 3 — Mixed Content Check
10. Log in and navigate to the ECG dashboard
11. Open DevTools → **Console** tab
12. Look for any warnings starting with "Mixed Content:" — these indicate HTTP resources loaded on an HTTPS page
13. Open DevTools → **Network** tab
14. Filter requests by type (All) and look for any requests using the `http://` scheme (not `https://`)
15. Specifically check API calls: are all backend API endpoints using `https://`?

### Phase 4 — Security Headers Check
16. Open DevTools → Network tab
17. Click on the main document request for the app
18. In the response headers, look for:
    - `Strict-Transport-Security` (HSTS) header
    - `Content-Security-Policy` header
    - `X-Frame-Options` header
19. Note the values of any security headers present

## Expected Result
- Navigating to `http://` automatically redirects to `https://` with a 301 or 302 status code
- The SSL/TLS certificate is valid, not expired, and issued by a trusted Certificate Authority
- No mixed content warnings appear in the DevTools Console
- All API calls and resource loads (JS, CSS, fonts, images) use `https://`
- `Strict-Transport-Security` header is present in the response (HSTS enabled), ideally with `max-age ≥ 31536000`
- `Content-Security-Policy` header restricts resource origins appropriately

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Railway.app deployment note:** Railway automatically provisions TLS certificates via Let's Encrypt and enforces HTTPS. Verify this is active and not misconfigured for this specific deployment.
- **Mixed content impact:** if any API call is made over HTTP (even to the same domain), browsers will block it as mixed content in modern Chrome. If calls are being blocked, ECG data may silently fail to load — this would appear as API errors, not a security warning.
- **HSTS:** the Strict-Transport-Security header tells browsers to only ever connect to this domain over HTTPS in future. Once received, the browser will refuse HTTP connections and redirect internally before even sending a request. Document whether HSTS is configured.
- **Certificate expiry:** note the certificate expiry date in Actual Result. A lapsed certificate on a medical app is a **Critical** operational issue.
- `Content-Security-Policy` should ideally include `default-src 'self'` and explicitly allowlist Cognito and API domains. If no CSP is present, log as **Medium** security finding.
