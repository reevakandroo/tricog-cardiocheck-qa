---
id: TC_SECH_011
module: Security Headers
title: XSS payload in login email field — input is sanitized, no script execution
type: Negative
severity: Critical
preconditions: [PC_001]
---

## Scenario
Verify that entering an XSS (Cross-Site Scripting) payload into the CardioCheck login email field does not result in script execution. The application must sanitize or escape user input so that any injected script tags or event handlers are rendered harmless.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open

## Test Data
| Field | Value |
|-------|-------|
| XSS Payloads (Email) | `<script>alert('XSS')</script>` |
| | `"><img src=x onerror=alert('XSS')>` |
| | `javascript:alert('XSS')` |
| | `<svg onload=alert('XSS')>` |
| Password | Any value |

## Steps
1. Navigate to the CardioCheck login page.
2. In the email field, enter: `<script>alert('XSS')</script>`
3. In the password field, enter any value.
4. Submit the form.
5. Observe whether an alert dialog appears (indicates XSS execution).
6. Inspect the page HTML — confirm the script tag is escaped (e.g., rendered as `&lt;script&gt;`) not executed.
7. Repeat with: `"><img src=x onerror=alert('XSS')>`
8. Repeat with: `<svg onload=alert('XSS')>` — confirm no script execution.

## Expected Result
- No alert dialog or script execution occurs for any XSS payload.
- The submitted input is either rejected with a validation error or displayed as escaped text.
- The HTML source shows proper escaping of special characters (`<`, `>`, `"`, `'`).
- No DOM-based XSS via URL parameters or reflected values.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- XSS in a healthcare login page is Critical — an attacker can steal session tokens, redirect users, or capture credentials.
- Check both reflected XSS (input echoed back in error message) and stored XSS (if the email is stored and displayed).
- Use the browser console to look for any script execution side effects beyond visible alerts.
- A Content-Security-Policy (CSP) header with `script-src 'self'` provides a secondary layer of defense — check if it's present.
