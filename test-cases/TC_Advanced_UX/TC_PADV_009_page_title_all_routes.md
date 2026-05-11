---
id: TC_PADV_009
module: Advanced UX
title: Browser tab page title is meaningful and context-specific at all main routes
type: Positive
severity: Low
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that the browser tab title (`<title>` tag / `document.title`) is set to a meaningful, context-specific value at every major route in the CardioCheck application. Meaningful page titles improve usability, accessibility (screen readers announce page titles on navigation), and bookmarking.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Routes to Check | Login, Dashboard, ECG Detail, Patient Form, Result Screen |

## Steps
1. Navigate to the CardioCheck login page — observe and record the browser tab title.
2. Log in with valid credentials — observe and record the title on the dashboard.
3. Open an ECG record — observe and record the title on the ECG detail page.
4. Navigate to the patient form — observe and record the title.
5. Submit the form and navigate to the result/risk assessment screen — observe and record the title.
6. Navigate to the profile/settings page (if available) — observe and record the title.
7. Compare all titles — verify each one is unique and contextually meaningful.
8. Confirm no route has the title "Flutter" or a blank/undefined title.

## Expected Result
- Login page: title includes "Login" or "Sign In" and app name.
- Dashboard: title includes "Dashboard" or equivalent.
- ECG Detail: title includes ECG identifier or "ECG" context.
- Patient Form: title includes "Patient" or "Form" context.
- Result Screen: title includes "Result" or "Assessment".
- No page has a blank, "undefined", or generic "Flutter" title.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web often defaults to "Flutter" as the page title — this is a known accessibility gap.
- WCAG 2.4.2 requires pages to have descriptive titles — absence is an accessibility failure.
- Low severity for usability; Medium severity if it impacts WCAG compliance requirements.
