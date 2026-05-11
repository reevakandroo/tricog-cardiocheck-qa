---
id: TC_RSP_007
module: Responsive Viewport
title: Application does not crash in mobile landscape orientation (844x390)
type: Negative
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that rotating a mobile device to landscape orientation (844x390) does not crash or break the CardioCheck application. The layout should reflow gracefully, and all interactive elements should remain accessible. This covers both the login page and the dashboard.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 844px (landscape) |
| Viewport Height | 390px (landscape) |
| Device Reference | iPhone 12 Pro landscape |

## Steps
1. Set the browser viewport to 390x844 (portrait) and navigate to the login page.
2. Switch the viewport to 844x390 (landscape) while the login page is loaded.
3. Verify the login page renders without crash and the form is visible.
4. Log in with valid credentials while in landscape mode.
5. Verify the dashboard loads and displays ECG content in landscape orientation.
6. Navigate to an ECG detail view — confirm it loads without error.
7. Switch back to portrait (390x844) during the session — confirm no crash or state loss.
8. Verify no JavaScript console errors appear during orientation changes.

## Expected Result
- The app does not crash or throw unhandled errors during orientation change.
- Login form is usable in landscape mode.
- Dashboard is accessible in landscape mode with key content visible.
- Rotating back to portrait does not break the session.
- No JavaScript errors in the console.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web apps can have layout issues with fixed-height containers in landscape — watch for this.
- Check if viewport meta tag sets `user-scalable=no` which could indicate forced layout assumptions.
- A crash in landscape is Medium severity; hidden/unusable content is Low severity.
