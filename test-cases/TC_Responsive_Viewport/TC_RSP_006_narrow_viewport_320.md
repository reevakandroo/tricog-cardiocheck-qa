---
id: TC_RSP_006
module: Responsive Viewport
title: Login page at 320px width — no horizontal scrollbar
type: Negative
severity: Medium
preconditions: [PC_001]
---

## Scenario
Verify the behavior of the CardioCheck login page at a very narrow 320px viewport (the minimum width for older small-screen phones such as iPhone SE 1st gen). The app should not produce a horizontal scrollbar or force the user to scroll sideways to access the login form.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 320px |
| Viewport Height | 568px |
| Device Reference | iPhone SE (1st generation) |
| URL | https://cardiocheck.tricog.com (or staging equivalent) |

## Steps
1. Set the browser viewport to 320x568.
2. Navigate to the CardioCheck login URL.
3. Wait for the page to fully load.
4. Check for the presence of a horizontal scrollbar at the bottom of the viewport.
5. Scroll right to see if any content extends beyond 320px.
6. Verify the email and password fields are visible without horizontal scroll.
7. Verify the Login button is fully visible and reachable.
8. Document any elements that cause overflow.

## Expected Result
- No horizontal scrollbar is present at 320px.
- All login form elements are visible within the 320px boundary.
- User can interact with the form without scrolling horizontally.
- If any overflow occurs, it should be non-interactive overflow (e.g., decorative background) — not functional content.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- 320px is the minimum supported width per most modern responsive design standards.
- A horizontal scrollbar is a definitive layout failure — flag as Medium severity.
- Check `document.documentElement.scrollWidth > document.documentElement.clientWidth` programmatically to detect overflow.
