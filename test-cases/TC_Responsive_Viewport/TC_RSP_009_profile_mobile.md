---
id: TC_RSP_009
module: Responsive Viewport
title: Profile page renders correctly at 390px mobile viewport
type: Positive
severity: Low
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that the user profile page (account settings or profile section) renders correctly on a 390px mobile viewport. All profile fields, labels, and action buttons should be visible and accessible without horizontal scrolling.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 390px |
| Viewport Height | 844px |
| Device Reference | iPhone 12 Pro |
| Test Account | reeva.kandroo@tricog.com |

## Steps
1. Set the viewport to 390x844.
2. Log in with valid credentials.
3. Navigate to the profile or account settings page.
4. Verify the page loads without errors.
5. Scroll through all profile fields — confirm each label and input/display value is visible.
6. Check that any action buttons (e.g., Edit, Save, Logout) are visible and tappable.
7. If the profile displays user account details or center name, confirm these are readable.
8. Verify no horizontal scrollbar is present.

## Expected Result
- Profile page loads successfully at 390px.
- All profile information fields and labels are visible.
- Action buttons are accessible and tappable.
- No horizontal scrollbar or overflow.
- Text does not overflow its containers.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the app does not have a distinct profile page, document which route/view is used for account info.
- Capture a screenshot for visual comparison with the desktop layout.
- Low severity unless critical account actions (e.g., password change) are inaccessible.
