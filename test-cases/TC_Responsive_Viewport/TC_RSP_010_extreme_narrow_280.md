---
id: TC_RSP_010
module: Responsive Viewport
title: Application behavior at extreme narrow viewport of 280px — document outcome
type: Edge
severity: Low
preconditions: [PC_001]
---

## Scenario
Verify and document the behavior of the CardioCheck application at an extreme narrow viewport of 280px (below the typical minimum supported width). The goal is not to assert a specific pass/fail but to characterize what breaks, what survives, and whether any catastrophic failures (crash, data loss, security issue) occur. Results should inform whether a minimum viewport width guard is needed.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 280px |
| Viewport Height | 653px |
| Device Reference | Galaxy Fold (folded inner screen) |
| URL | https://cardiocheck.tricog.com (or staging equivalent) |

## Steps
1. Set the viewport to 280x653.
2. Navigate to the CardioCheck login URL.
3. Record whether the page loads without a JavaScript crash.
4. Identify which elements overflow or are hidden.
5. Attempt to interact with the email field — record if it is reachable.
6. Attempt to interact with the password field.
7. Attempt to click the Login button — record success or failure.
8. Document all findings with screenshots.

## Expected Result
- The application should not throw an unhandled JavaScript exception or white-screen at 280px.
- Overflow and layout breakage is expected and acceptable at this width.
- No security issues (e.g., unintended data exposure caused by collapsed UI) should appear.
- The page should not be completely non-functional (login must be achievable even if awkward).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is a documentation/characterization test — not a hard pass/fail.
- Flag any crash or security regression as High; layout issues alone are Low.
- Results feed into a recommendation on minimum supported viewport width.
- Devices under 320px are rare but exist (Galaxy Fold folded = 280px).
