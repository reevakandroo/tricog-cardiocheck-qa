---
id: TC_SAUD_007
module: Storage API Audit
title: axe-core accessibility scan on the dashboard returns zero critical violations
type: Positive
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Run an automated axe-core accessibility scan on the CardioCheck dashboard (post-login ECG list view) and verify that it returns zero critical or serious WCAG violations. The dashboard is the primary clinical workspace — accessibility failures here impact all clinician users.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Target Page | CardioCheck dashboard (ECG list view) |
| Tool | axe-core via browser extension, Playwright + axe-playwright, or @axe-core/cli |
| WCAG Standard | WCAG 2.1 Level AA |

## Steps
1. Log in with valid credentials and wait for the dashboard to fully load.
2. Open the axe DevTools browser extension (or run `axe()` in the browser console).
3. Run the full accessibility scan on the dashboard page.
4. Review the results — record all violations by impact level.
5. Document each Critical violation: rule ID, element, description.
6. Document each Serious violation.
7. Check specifically for: table/list accessibility (th scope, aria-labelledby), interactive button labels, focus management.
8. Compare findings with TC_SAUD_006 (login page) — note if any violations are shared.

## Expected Result
- Zero Critical accessibility violations.
- Zero Serious violations (document if any exist for remediation).
- ECG list items have appropriate ARIA roles or semantic HTML.
- All interactive elements (buttons, links, filters) have accessible names.
- The page has proper heading hierarchy (h1, h2, etc.) or Flutter Semantics equivalent.
- Focus management after navigation to the dashboard is correct (focus on main content).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The dashboard is the most used screen — accessibility issues here affect all users daily.
- Flutter web canvas rendering is the primary challenge for axe-core — document if canvas-specific gaps are found.
- High severity: same rationale as TC_SAUD_006 — healthcare accessibility compliance.
- Record the number of passes (compliant rules) alongside violations to give a full picture.
