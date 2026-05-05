---
id: TC_SRC_007
module: Search Bar
title: XSS payload in search bar is sanitised and not executed
type: Security
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
An attacker may inject Cross-Site Scripting (XSS) payloads through the search bar. If the app renders search input unsanitised in the DOM (e.g., in search result labels, "You searched for: <input>" echoes, or error messages), a script can execute in the victim's browser. In a Flutter Web SPA, XSS risk exists in any HTML-rendered text node or API error responses displayed to the user. This test confirms all user input is properly escaped before display.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Payload Label | Input Value | Attack Vector |
|---------------|-------------|---------------|
| Basic script tag | `<script>alert(1)</script>` | Inline script injection |
| IMG onerror | `<img src=x onerror=alert(1)>` | Event handler injection |
| SVG onload | `<svg onload=alert(1)>` | SVG-based XSS |
| JavaScript URI | `javascript:alert(1)` | Protocol handler |
| HTML entity bypass | `&lt;script&gt;alert(1)&lt;/script&gt;` | HTML entity encoding bypass |
| Double-encoded | `%3Cscript%3Ealert(1)%3C%2Fscript%3E` | URL double-encoding |
| DOM clobbering | `<input id="search" value="xss">` | DOM structure manipulation |
| Mutation XSS | `<noscript><p title="</noscript><script>alert(1)</script>">` | Parser mutation |
| Template literal | `${alert(1)}` | Template injection |
| Angular/Vue template | `{{constructor.constructor('alert(1)')()}}` | Client-side template injection |

## Steps

For each payload in the Test Data table:
1. Clear the search bar.
2. Type or paste the XSS payload into the search bar.
3. Submit the search (wait for debounce / press Enter).
4. **Watch for immediate signs of execution:**
   - An `alert()` dialog appearing — this is an immediate FAIL.
   - Any popup, dialog, or confirmation box that was not expected.
   - Any network request to an unexpected external domain (data exfiltration).
5. Open DevTools → Console tab:
   - Confirm no `alert()` was called.
   - Confirm no unexpected JavaScript executed.
   - Note any Content Security Policy (CSP) violation messages — these are expected and indicate the CSP is working.
6. Inspect the DOM (Elements tab):
   - Find any text node where the search query might be echoed (e.g., "No results for '<query>'").
   - Verify the payload is HTML-escaped in the DOM (e.g., `&lt;script&gt;alert(1)&lt;/script&gt;`), not rendered as a live HTML element.
7. Check the Network tab response bodies — confirm the backend does not echo the raw payload in API error messages.
8. After each test, clear the search and confirm the app is still functional.

### Sub-scenario — Stored XSS check
1. Search for a payload and note whether the search is persisted anywhere (search history, recent searches).
2. If search history is displayed, confirm stored payloads are escaped when re-rendered.
3. Navigate away and return to the dashboard — confirm no deferred XSS executes on re-render.

### Sub-scenario — CSP verification
1. Open DevTools → Application → Security.
2. Confirm the app is served with a `Content-Security-Policy` header.
3. Note the CSP directives — `script-src` should not include `unsafe-inline` or `unsafe-eval`.
4. A missing or weak CSP is a Medium severity finding independent of whether the XSS executes.

## Expected Result

- No `alert()` dialog or unexpected script execution occurs for any payload.
- All payloads are either rejected (HTTP 400), ignored (empty results), or HTML-escaped before display.
- DOM inspection shows escaped entities (`&lt;`, `&gt;`), not live HTML tags.
- CSP header is present and restricts `unsafe-inline` / `unsafe-eval`.
- No exfiltration requests to external domains in the Network tab.
- App remains fully functional after all payloads.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter Web compiles to WebAssembly/JavaScript and renders to a canvas element, which significantly reduces traditional DOM-based XSS surface. However, any HTML rendering layer (error messages, tooltips rendered as HTML, API error strings injected into innerHTML) remains at risk.
- If `alert(1)` fires during this test, stop immediately — treat as a Critical security incident. Do not continue testing the same environment.
- Check the `Content-Security-Policy` response header in DevTools. A missing CSP on a healthcare application is a High severity finding even if no XSS currently executes.
- HIPAA: A successful XSS attack could enable session hijacking, allowing an attacker to access all PHI visible to the victim user.
