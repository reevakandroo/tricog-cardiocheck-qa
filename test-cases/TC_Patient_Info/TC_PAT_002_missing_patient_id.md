---
id: TC_PAT_002
module: Patient Information
title: Missing Patient ID — empty field → validation error shown, cannot submit
type: Negative
severity: Critical
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician attempts to submit the patient information form without entering a Patient ID. The system must block the submission and display a validation error, because Patient ID is a required field.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field        | Value       |
|--------------|-------------|
| Patient ID   | _(empty)_   |
| Patient Name | Test User   |
| Age          | 40          |
| Gender       | Female      |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Leave the Patient ID field (`aria-label="Patient ID *"`) completely empty — do not type anything.
4. Fill in Patient Name: `Test User`.
5. Fill in Age: `40`.
6. Select Gender: `flt-semantics[role="button"][aria-label^="Gender"]` → `flt-semantics[role="menuitem"][aria-label="Female"]`.
7. Click the Save / Submit button to attempt submission.
8. Observe the Patient ID field and any error messages displayed.
9. Check whether the form was submitted (i.e., did the app navigate away or display a success state?).
10. Observe the state of the "Get Risk Assessment" button.

## Expected Result
- The form is **not** submitted. The app remains on the patient data entry form.
- A validation error is displayed on or near the Patient ID field indicating it is required (e.g., "Patient ID is required" or equivalent hint text).
- The "Should use 6-12 characters" hint may also appear.
- The "Get Risk Assessment" button remains **disabled**.
- No API call to save patient data is made (verifiable via browser Network tab — no POST/PUT request with patient data).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Patient ID is marked as required in the source code (regex: `^[a-zA-Z0-9]{6,12}$`). An empty value does not match this pattern, so validation must fail.
- Cross-check: also verify the field asterisk (`*`) is visible in the label, confirming the UI communicates the required state to the user.
- If the app shows "Should use 6-12 characters" rather than "required field" as the error, that is acceptable — document the actual wording.
