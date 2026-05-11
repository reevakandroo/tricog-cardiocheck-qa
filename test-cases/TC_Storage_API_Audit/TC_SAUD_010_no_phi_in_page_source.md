---
id: TC_SAUD_010
module: Storage API Audit
title: Dashboard HTML page source does not contain plaintext patient PHI
type: Edge
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that the raw HTML source of the CardioCheck dashboard page (View Source) does not contain plaintext Protected Health Information such as patient names, dates of birth, diagnoses, or ECG identifiers. PHI in the static HTML source can be cached by proxies, CDNs, browser cache, and browser history — all outside the application's control.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Target Page | Dashboard (post-login ECG list view) |
| Tool | View Source (Ctrl+U), Chrome DevTools Elements tab |

## Steps
1. Log in with valid credentials and wait for the dashboard to fully load.
2. Right-click and select "View Page Source" (Ctrl+U / Cmd+U).
3. Search the page source for known patient identifiers (patient names or IDs visible on screen).
4. Search for common PHI patterns: date of birth formats (DD/MM/YYYY), diagnosis terms.
5. Check if any data is server-side rendered (SSR) into the HTML vs. loaded dynamically via API.
6. In Chrome DevTools → Elements tab, inspect the DOM for patient data embedded in `data-*` attributes or hidden fields.
7. Check `<meta>` tags and `<script>` blocks for embedded PHI.
8. Document any PHI found in the static page source.

## Expected Result
- The raw HTML page source contains no plaintext patient names, dates of birth, diagnoses, or ECG data.
- All patient data is loaded dynamically via authenticated API calls — not embedded in the HTML.
- No PHI appears in `data-*` attributes, hidden inputs, or script tags within the HTML source.
- The page source contains only application structure (Flutter bootstrap JS) with no patient content.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web typically renders everything via JavaScript — SSR embedding of PHI is unlikely but worth confirming.
- High severity: PHI in HTML source can be indexed, cached, or logged by intermediate systems.
- Also check `Cache-Control` response headers on the dashboard to confirm it is not cached by CDNs or proxies.
- Cross-reference with TC_SAUD_001 and TC_SAUD_002 for complete client-side PHI audit coverage.
