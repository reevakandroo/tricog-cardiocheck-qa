---
id: TC_RSK_006
module: Risk Assessment
title: Feedback — Satisfied=No → unsatisfied reason field appears
type: Positive
severity: Medium
preconditions: [PC_001, PC_002, PC_005]
---

## Scenario
After a risk assessment result is displayed, the clinician marks "Satisfied = No". The system must reveal an additional input for the clinician to provide the reason for dissatisfaction.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) — Patient data has been saved and a risk assessment result is currently displayed (any risk level is acceptable for this test)

## Test Data
| Field             | Value                        |
|-------------------|------------------------------|
| Satisfied         | No                           |
| Unsatisfied Reason| Result did not match clinical assessment |

## Steps
1. Verify the risk assessment result screen is displayed (risk label is visible).
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Locate the feedback section on the risk result screen.
4. Find the "Satisfied" feedback control and select **No**.
5. Observe the feedback section immediately after selecting "No".
6. Confirm a new input field or dropdown for "unsatisfied reason" appears.
7. Enter or select a reason (e.g., "Result did not match clinical assessment" or the available option closest to this).
8. Submit/save the feedback.
9. Observe any confirmation message or UI state change after feedback submission.
10. Check the Network tab for the feedback API call — confirm it carries the "No" satisfied status and the reason.

## Expected Result
- After selecting "Satisfied = No", an **unsatisfied reason field appears** (text input, dropdown, or radio buttons).
- The reason field is either required or optional — document which.
- Feedback is saved successfully with both the "No" satisfaction flag and the reason.
- No error message or API failure.
- The feedback persists if the page is refreshed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The conditional appearance of the reason field must be driven by client-side state — verify it appears without a page reload.
- If the reason field is required when "No" is selected, also test submitting without filling the reason to confirm a validation error is shown (this can be covered as a Note-level exploratory check).
- Compare with TC_RSK_005 (Satisfied=Yes — no reason field) to confirm the conditional display logic is symmetric.
- This feedback loop is important for Tricog's product improvement. Ensure the data is stored correctly and is accessible for analytics.
