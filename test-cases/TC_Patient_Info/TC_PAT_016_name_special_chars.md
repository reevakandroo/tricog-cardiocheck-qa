---
id: TC_PAT_016
module: Patient Information
title: Patient Name Special Characters — Name="John123" (numbers) → error (letters+spaces only)
type: Negative
severity: Medium
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a patient name that contains numeric digits (`John123`). Because the Patient Name field allows only letters and spaces, this input must be rejected with a validation error.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field        | Value    | Notes                                     |
|--------------|----------|-------------------------------------------|
| Patient ID   | PAT00099 | Valid 8-char ID                           |
| Patient Name | John123  | Contains digits — invalid per rule        |
| Age          | 40       | Valid, not under test                     |
| Gender       | Male     | Valid, not under test                     |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Patient Name field (`aria-label="Patient Name"`).
5. Type `John123`.
6. Tab out of the field or click elsewhere to trigger validation.
7. Observe the Patient Name field and any error/hint text near it.
8. Fill in Age (`40`) and Gender (`Male`) to isolate the Patient Name validation.
9. Click the Save / Submit button to attempt form submission.
10. Verify the form has not been submitted successfully.

## Expected Result
- A validation error is displayed on or near the Patient Name field indicating that only letters and spaces are allowed (e.g., "Only letters and spaces are allowed" or equivalent).
- The form is **not** submitted.
- The "Get Risk Assessment" button remains **disabled**.
- No patient data API call is fired with an invalid name.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Patient Name is optional (not required), but when provided it must match the letters-and-spaces-only rule.
- Additional variants worth testing exploratorily: `John@Doe` (special characters), `John  Doe` (double space), `  ` (whitespace only), `<script>alert(1)</script>` (XSS), SQL injection `' OR 1=1--`.
- If the field uses an input filter that silently strips digits, document this behavior — silent stripping is a UX concern (user types `John123` but sees only `John`).
