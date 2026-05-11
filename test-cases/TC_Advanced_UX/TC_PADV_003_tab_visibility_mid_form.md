---
id: TC_PADV_003
module: Advanced UX
title: Form field values are preserved after switching to another browser tab and returning
type: Positive
severity: Medium
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that data entered into the patient form is preserved when the user switches to another browser tab and then returns to the CardioCheck tab. This tests that tab visibility changes (Page Visibility API events) do not trigger unwanted state resets, re-renders, or data loss in the form.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - ECG with a patient form is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Form Values | Patient name: "Tab Switch Test", Age: 42, Gender: Female |
| Away Duration | ~10 seconds in another tab |

## Steps
1. Log in and navigate to the patient data form for an ECG.
2. Fill in the form fields: name = "Tab Switch Test", age = 42, gender = Female (or applicable fields).
3. Do NOT submit the form.
4. Open a new browser tab and navigate to any website (e.g., google.com) — spend ~10 seconds there.
5. Switch back to the CardioCheck tab.
6. Verify the form fields still contain the values entered in step 2.
7. Continue filling in any remaining fields.
8. Submit the form — confirm it submits successfully.

## Expected Result
- All entered form values persist after the tab switch.
- No form reset or partial data loss occurs.
- The application does not re-navigate to the dashboard or login page after the tab switch.
- Form submission after the tab switch completes successfully.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Some Flutter web apps reset state when the `document.visibilityState` changes to 'hidden' — this is a bug.
- If form data is lost, check if the app listens to `visibilitychange` events and clears state.
- Medium severity: data loss mid-form disrupts clinical workflow and may cause incomplete record submissions.
