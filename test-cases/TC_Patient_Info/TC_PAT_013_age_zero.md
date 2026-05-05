---
id: TC_PAT_013
module: Patient Information
title: Age = Zero — Age=0 → "Value must be between 18 and 150" validation error
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician (or an automated test) enters age 0 in the Age field. Since 0 is far below the minimum of 18, the system must reject it and display a validation error.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value    | Notes                                 |
|------------|----------|---------------------------------------|
| Patient ID | PAT00099 | Valid 8-char ID                       |
| Age        | 0        | Zero — clearly below the minimum (18) |
| Gender     | Male     | Valid, not under test                 |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Age field (`aria-label="Age *"`).
5. Type `0`.
6. Tab out of the field or click elsewhere to trigger validation.
7. Observe the Age field and any error/hint text displayed near it.
8. Click the Save / Submit button to attempt submission.
9. Verify the form has not submitted successfully.

## Expected Result
- The hint text **"Value must be between 18 and 150"** is displayed on or below the Age field.
- The form is **not** submitted.
- The "Get Risk Assessment" button remains **disabled**.
- No patient data API call is fired.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Zero is a common edge case that can slip through if validation only checks for "not empty" rather than range.
- Additional related inputs worth exploring: `00`, `000` — ensure these do not bypass validation or get interpreted as valid by the parser.
- If the field is of type `number`, the browser may strip leading zeros — confirm the value submitted to validation is the integer `0`.
