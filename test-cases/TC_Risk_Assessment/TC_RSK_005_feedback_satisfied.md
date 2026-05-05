---
id: TC_RSK_005
module: Risk Assessment
title: Feedback — Satisfied=Yes, 12-lead ECG taken=Yes → feedback saved successfully
type: Positive
severity: Medium
preconditions: [PC_001, PC_002, PC_005]
---

## Scenario
After a risk assessment result has been displayed, the clinician provides positive feedback: marking "Satisfied = Yes" and "12-lead ECG taken = Yes". The system must save this feedback without errors.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) — Patient data has been saved and a risk assessment result is currently displayed (any risk level is acceptable for this test)

## Test Data
| Field                | Value |
|----------------------|-------|
| Satisfied            | Yes   |
| 12-lead ECG taken    | Yes   |

## Steps
1. Verify the risk assessment result screen is displayed (risk label is visible).
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Locate the feedback section on the risk result screen.
4. Find the "Satisfied" feedback control and select **Yes**.
5. Find the "12-lead ECG taken" feedback control and select **Yes**.
6. Submit/save the feedback (click a Save/Submit button in the feedback section, or confirm it auto-saves on selection).
7. Observe any confirmation message or UI state change after feedback submission.
8. Check the browser Network tab for the feedback API call — confirm it returns a success (2xx) response.

## Expected Result
- Both feedback responses ("Satisfied = Yes" and "12-lead ECG taken = Yes") are saved.
- A success confirmation is shown (toast, checkmark, or the feedback section transitions to a "submitted" read-only state).
- No error message or API failure.
- The feedback values persist if the page is refreshed (verify by reloading and confirming the feedback fields show the submitted values).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Feedback data is clinically valuable for outcome tracking. Confirm the data is persisted and not just stored in-memory.
- The "12-lead ECG taken" field may conditionally appear only when "Satisfied = Yes" — document whether this conditional logic is present.
- Compare with TC_RSK_006 (Satisfied=No → unsatisfied reason field appears) for the alternate flow.
