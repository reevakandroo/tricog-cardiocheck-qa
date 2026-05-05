---
id: TC_PAT_014
module: Patient Information
title: Age Negative — Age=-1 → "Value must be between 18 and 150" validation error
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician (or a malicious user) enters a negative age value (-1) in the Age field. The system must reject this input and display a validation error.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value    | Notes                            |
|------------|----------|----------------------------------|
| Patient ID | PAT00099 | Valid 8-char ID                  |
| Age        | -1       | Negative integer — clearly invalid |
| Gender     | Male     | Valid, not under test            |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Age field (`aria-label="Age *"`).
5. Type `-1` (hyphen-minus followed by digit 1).
6. Tab out of the field or click elsewhere to trigger validation.
7. Observe whether the field accepts the negative sign and the resulting value.
8. Observe any error/hint text displayed near the Age field.
9. Click the Save / Submit button to attempt submission.
10. Verify the form has not submitted successfully.

## Expected Result
- Either:
  a. The Age field rejects the `-` character at the input level (field only accepts digits), OR
  b. The value `-1` is accepted as input but triggers the validation hint **"Value must be between 18 and 150"**.
- In both cases, the form is **not** submitted with a negative age.
- The "Get Risk Assessment" button remains **disabled**.
- No patient data API call is fired with a negative age value.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Negative values are a common injection / boundary test for numeric fields. A backend that does not validate independently of the frontend could store negative ages, corrupting patient records.
- If the field blocks the `-` character outright, document this as "Input filter active — negative values not typeable" and note that the server-side validation should still be confirmed via a direct API call with `age: -1`.
- Extended variants: `-999`, `-18` — these should also be rejected.
