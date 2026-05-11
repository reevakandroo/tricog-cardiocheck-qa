---
id: TC_PADV_010
module: Advanced UX
title: Tab key navigation through the application does not cause a crash
type: Edge
severity: Medium
preconditions: [PC_001]
---

## Scenario
Verify that using the Tab key to navigate through focusable elements on the CardioCheck login page and dashboard does not crash the application or produce JavaScript errors. This is a basic keyboard accessibility test and also an edge case for focus management — some apps break when Tab is pressed unexpectedly.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open

## Test Data
| Field | Value |
|-------|-------|
| Input Method | Keyboard Tab key |
| Pages | Login page, Dashboard (if reachable via Tab) |
| Tool | Browser with keyboard focus visible |

## Steps
1. Navigate to the CardioCheck login page.
2. Click once on the page body to ensure focus is in the document.
3. Press Tab repeatedly — observe each focused element.
4. Confirm focus moves through the email field, password field, and Login button in logical order.
5. Press Tab beyond the last focusable element — confirm focus cycles or moves to browser chrome without crashing.
6. Use Shift+Tab to navigate backwards — confirm reverse tab order works.
7. Log in using only the keyboard (Tab to email, type, Tab to password, type, Tab to Login button, press Enter).
8. Check the console for any JavaScript errors during keyboard navigation.

## Expected Result
- Tab key moves focus through all interactive elements in a logical order.
- No JavaScript crash or unhandled exception occurs during keyboard navigation.
- Focus is visually indicated on each element (focus ring or equivalent visible indicator).
- Keyboard-only login (Tab + Enter) succeeds.
- Shift+Tab works for reverse navigation.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web uses a custom focus management system — tab navigation may not follow standard DOM tab order.
- Visible focus indicators are required by WCAG 2.4.7 — absence is an accessibility finding.
- A crash on Tab press is Medium severity; invisible focus ring is a WCAG compliance gap.
- This test feeds into accessibility audit coverage alongside TC_SAUD_006 (axe-core).
