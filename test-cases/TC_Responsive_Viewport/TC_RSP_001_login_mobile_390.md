---
id: TC_RSP_001
module: Responsive Viewport
title: Login page renders correctly at mobile viewport (390x844)
type: Positive
severity: High
preconditions: [PC_001]
---

## Scenario
Verify that the CardioCheck login page renders correctly on a mobile viewport of 390x844 (iPhone 12 Pro). All form elements — email field, password field, and login button — must be fully visible with no horizontal overflow or clipped content.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open and pointed at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 390px |
| Viewport Height | 844px |
| Device Reference | iPhone 12 Pro |
| URL | https://cardiocheck.tricog.com (or staging equivalent) |

## Steps
1. Open the browser and set the viewport to 390x844 (use DevTools device emulation or Playwright `setViewportSize`).
2. Navigate to the CardioCheck login URL.
3. Wait for the page to fully load (network idle).
4. Inspect the email input field — confirm it is fully visible and not clipped.
5. Inspect the password input field — confirm it is fully visible and not clipped.
6. Inspect the Login button — confirm it is fully visible and tappable.
7. Scroll the page horizontally and verify no horizontal scrollbar exists.
8. Confirm no content overflows beyond the 390px boundary.

## Expected Result
- Login page loads without errors.
- Email field, password field, and Login button are all fully visible within 390px width.
- No horizontal scrollbar is present.
- No content is clipped or hidden behind viewport edges.
- Text is legible at mobile size (no overflow, no truncation of labels).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Use Chrome DevTools responsive mode or Playwright `page.setViewportSize({ width: 390, height: 844 })`.
- Capture a full-page screenshot for visual record.
- If a horizontal scrollbar appears, this is a layout regression — flag as High severity.
