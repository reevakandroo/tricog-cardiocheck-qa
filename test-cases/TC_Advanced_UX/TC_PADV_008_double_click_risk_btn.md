---
id: TC_PADV_008
module: Advanced UX
title: Double-clicking Get Risk Assessment button does not submit the form twice
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that rapidly double-clicking the "Get Risk Assessment" (or equivalent submission button) on the patient/ECG form does not submit the form twice or trigger duplicate API requests. A duplicate submission could create two risk assessment records for the same patient, leading to data integrity issues.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - An ECG with a completable patient form is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Click Method | Double-click (two rapid clicks within 300ms) |
| Form Fields | Filled with valid test patient data |

## Steps
1. Open the browser DevTools (Network tab) and enable "Preserve log".
2. Log in and navigate to the patient form for an ECG.
3. Fill in all required patient data fields with valid test values.
4. Rapidly double-click the "Get Risk Assessment" / submit button.
5. Count the number of POST/submission API requests fired in the Network tab.
6. Observe the UI — confirm only one result/confirmation screen is shown.
7. Check the backend or API response to confirm only one assessment record was created.
8. Confirm the submit button was disabled after the first click.

## Expected Result
- Only one API submission request is fired despite the double-click.
- The submission button is disabled or shows a loading state after the first click.
- Only one risk assessment result is created.
- No error or crash from the second click.
- The result screen loads once and displays correct data.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- A duplicate risk assessment submission is High severity — it creates false records in patient history.
- In a HIPAA context, duplicate PHI records must be avoided and corrected through an audited process.
- If two requests are fired and one returns an error, verify the error is handled gracefully.
