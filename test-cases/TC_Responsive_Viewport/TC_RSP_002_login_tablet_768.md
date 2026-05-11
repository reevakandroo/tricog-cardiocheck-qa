---
id: TC_RSP_002
module: Responsive Viewport
title: Login page renders correctly at tablet viewport (768x1024)
type: Positive
severity: Medium
preconditions: [PC_001]
---

## Scenario
Verify that the CardioCheck login page renders correctly at a standard tablet viewport of 768x1024 (iPad). The layout should make use of the wider screen — inputs should not stretch awkwardly, and the design should appear balanced and usable.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and pointed at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 768px |
| Viewport Height | 1024px |
| Device Reference | iPad (standard) |
| URL | https://cardiocheck.tricog.com (or staging equivalent) |

## Steps
1. Open the browser and set the viewport to 768x1024 using DevTools or Playwright.
2. Navigate to the CardioCheck login URL.
3. Wait for the page to fully load (network idle).
4. Confirm the login form is centered or properly laid out within the viewport.
5. Verify the email field, password field, and Login button are all visible and properly sized.
6. Check that there is no horizontal scrollbar.
7. Verify that font sizes and spacing appear appropriate for a tablet display.
8. Confirm logo and branding elements are visible and not distorted.

## Expected Result
- Login page loads without errors.
- All form elements are visible and properly aligned within the 768px width.
- No horizontal scrollbar or content overflow.
- Layout appears appropriate for a tablet — not stretched to full width or awkwardly narrow.
- Branding/logo is visible.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Compare layout against mobile (TC_RSP_001) to confirm responsive breakpoints are functioning.
- Check if the form uses a max-width container — this is expected at tablet size.
- Capture a full-page screenshot.
