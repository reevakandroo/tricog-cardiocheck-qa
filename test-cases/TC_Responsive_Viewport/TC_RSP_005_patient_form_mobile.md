---
id: TC_RSP_005
module: Responsive Viewport
title: All patient form fields are accessible and functional at 390px
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that all fields on the patient data entry form are accessible, visible, and interactive on a 390px mobile viewport. Users must be able to fill in every required field without needing to scroll horizontally or zoom in to reach any input.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - At least one ECG available on the dashboard

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 390px |
| Viewport Height | 844px |
| Device Reference | iPhone 12 Pro |
| Test Account | reeva.kandroo@tricog.com |

## Steps
1. Set the browser viewport to 390x844.
2. Log in and navigate to the dashboard.
3. Open an ECG entry that requires patient data input.
4. Navigate to the patient form.
5. Scroll through all form fields vertically — confirm every input field is visible.
6. Tap each required field and enter test data — confirm the mobile keyboard does not obscure the active field permanently.
7. Confirm dropdown or select inputs open and display options correctly.
8. Attempt to submit the form and verify the submit button is tappable without zooming.

## Expected Result
- All form fields are visible and accessible without horizontal scrolling.
- Each field can be tapped and filled without obstruction.
- Dropdowns and selectors open and display options correctly at 390px.
- Submit button is visible and tappable.
- No fields are clipped or hidden behind the viewport.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Pay close attention to date pickers and dropdown menus — these are common breakpoints on mobile.
- If any field requires horizontal scrolling to reach, flag as High severity.
- This is a HIPAA-adjacent flow (patient data) — usability failures may lead to data entry errors.
