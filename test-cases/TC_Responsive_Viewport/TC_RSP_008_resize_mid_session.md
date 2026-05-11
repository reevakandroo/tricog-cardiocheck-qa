---
id: TC_RSP_008
module: Responsive Viewport
title: Resizing from desktop to mobile during an active session does not break state
type: Edge
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that dynamically resizing the browser window from a desktop viewport (1280x800) down to a mobile viewport (390x844) during an active authenticated session does not cause the application to crash, log the user out, reload unexpectedly, or lose in-progress data.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Starting Viewport | 1280x800 (desktop) |
| End Viewport | 390x844 (mobile) |
| Test Account | reeva.kandroo@tricog.com |

## Steps
1. Set the viewport to 1280x800.
2. Log in with valid credentials.
3. Navigate to the dashboard and note the layout.
4. Begin filling out a patient form (enter at least one field of data).
5. While the form is open, gradually resize the viewport to 390x844.
6. Verify that no crash or page reload occurs.
7. Confirm the form data entered in step 4 is still present.
8. Confirm the layout reflows to mobile and all elements remain accessible.

## Expected Result
- No crash or unhandled exception during resize.
- Active session is maintained (user stays logged in).
- Any in-progress form data is preserved after resize.
- Layout reflows to mobile appropriately.
- No duplicate API calls or submissions triggered by the resize event.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is an edge case covering developer/clinical admin users who may use resizable browser windows.
- Watch the network tab for unexpected API calls triggered by the resize.
- Flutter web uses canvas rendering which may handle resize differently than DOM-based apps.
