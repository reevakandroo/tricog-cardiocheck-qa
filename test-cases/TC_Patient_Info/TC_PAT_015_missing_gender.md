---
id: TC_PAT_015
module: Patient Information
title: Missing Gender — no gender selected → form cannot be submitted (required)
type: Negative
severity: Critical
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician fills in all patient fields correctly except Gender, which is left unselected. Because Gender is a required dropdown field, the system must prevent form submission.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value     | Notes                    |
|------------|-----------|--------------------------|
| Patient ID | PAT00099  | Valid 8-char ID          |
| Age        | 40        | Valid                    |
| Gender     | _(none)_  | Required — not selected  |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Fill in Age with `40`.
5. **Do not interact with the Gender dropdown** — leave it in its default/unselected state.
6. Click the Save / Submit button to attempt form submission.
7. Observe the Gender field/dropdown and any error or validation message near it.
8. Verify the form has not navigated away or shown a success state.
9. Confirm the "Get Risk Assessment" button remains disabled.

## Expected Result
- A validation error or required-field indicator is displayed on or near the Gender dropdown (e.g., "Gender is required" or the dropdown is highlighted in error state).
- The form is **not** submitted.
- The "Get Risk Assessment" button remains **disabled**.
- No patient data API call is made.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The Gender dropdown selector is `flt-semantics[role="button"][aria-label^="Gender"]`. In the unselected state, the label may read "Gender" without a value appended.
- Valid options are Male / Female / Other. If the dropdown has a placeholder option (e.g., "Select Gender"), clicking away without choosing a real option should still fail validation.
- If the Submit button is disabled until all required fields are filled (rather than showing an error on click), document this as "Submit button disabled when Gender is empty" — both approaches are valid implementations.
