---
id: TC_PAT_012
module: Patient Information
title: Age Above Maximum — Age=151 → "Value must be between 18 and 150" error
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters age 151 (one year above the maximum of 150). The system must reject this value and display the "Value must be between 18 and 150" hint text.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value    | Notes                        |
|------------|----------|------------------------------|
| Patient ID | PAT00099 | Valid 8-char ID              |
| Age        | 151      | max + 1 = 151, above maximum |
| Gender     | Male     | Valid, not under test        |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Age field (`aria-label="Age *"`).
5. Type `151`.
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
- Boundary: max + 1 = 151. This is the standard above-upper-bound test.
- Compare with TC_PAT_011 (Age=150 = valid) to confirm the boundary is exactly at 150.
- If the UI uses an integer spinner/number input with a max attribute, browsers may block values above max — but validate that the Flutter web implementation enforces this independently of native browser constraints.
