---
id: TC_SAUD_006
module: Storage API Audit
title: axe-core accessibility scan on the login page returns zero critical violations
type: Positive
severity: High
preconditions: [PC_001]
---

## Scenario
Run an automated axe-core accessibility scan on the CardioCheck login page and verify that it returns zero critical or serious WCAG violations. This ensures the login page is usable by clinicians relying on assistive technologies such as screen readers.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open

## Test Data
| Field | Value |
|-------|-------|
| Target Page | CardioCheck login page |
| Tool | axe-core via browser extension, Playwright + axe-playwright, or @axe-core/cli |
| WCAG Standard | WCAG 2.1 Level AA |

## Steps
1. Navigate to the CardioCheck login page.
2. Open the axe DevTools browser extension (or run `axe()` in the browser console via axe-core).
3. Run the full accessibility scan on the login page.
4. Review the scan results — record all violations by impact level: Critical, Serious, Moderate, Minor.
5. Document each Critical violation: rule ID, element affected, description.
6. Document each Serious violation.
7. Check specifically for: missing form labels, insufficient color contrast, missing alt text on images, missing landmark roles.
8. Record the total violation count and impact breakdown.

## Expected Result
- Zero Critical accessibility violations.
- Zero Serious accessibility violations (or document any found for prioritized remediation).
- All form inputs have associated labels (either visible or aria-label).
- Color contrast ratio meets WCAG AA (4.5:1 for normal text, 3:1 for large text).
- Any decorative images have `alt=""`.
- Page has appropriate landmark roles (main, form, etc.).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web renders content in a canvas element — axe-core may detect the canvas-based rendering as an accessibility gap.
- If Flutter's `Semantics` widget is properly configured, aria labels should be present.
- High severity: healthcare applications are expected to meet WCAG 2.1 AA for compliance.
- Document the axe-core version used for reproducibility.
