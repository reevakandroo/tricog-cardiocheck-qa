---
id: TC_PAT_007
module: Patient Information
title: Patient ID Boundary — exactly 12 chars → valid, accepted
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a Patient ID of exactly 12 characters (the maximum allowed length). The system must accept this input without validation errors, confirming the upper boundary of the `{6,12}` rule is inclusive.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value        | Notes                         |
|------------|--------------|-------------------------------|
| Patient ID | ABCDEF123456 | Exactly 12 characters — max   |
| Age        | 40           | Valid, not under test         |
| Gender     | Male         | Valid, not under test         |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Click the Patient ID field (`aria-label="Patient ID *"`).
4. Type `ABCDEF123456` (exactly 12 characters — count carefully).
5. Tab out of the field or click elsewhere to trigger validation.
6. Observe whether any error/hint text appears for the Patient ID field.
7. Fill in Age (`40`) and Gender (`Male`) to complete the required fields.
8. Click the Save / Submit button.
9. Observe the form state and the "Get Risk Assessment" button.

## Expected Result
- **No** validation error or hint text is displayed for the Patient ID field after entering `ABCDEF123456`.
- The form submits successfully.
- The "Get Risk Assessment" button becomes **enabled** after a successful save.
- Confirm in the saved data (ECG detail or network response) that the Patient ID is stored as `ABCDEF123456` without truncation.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is the upper-boundary inclusive test (max = 12). Compare with TC_PAT_004 (13 chars = invalid) to confirm the boundary is exactly at 12.
- Secondary check: if the field enforces a character cap at the UI level, typing the 12th character should succeed without any visual rejection or truncation.
- The input `ABCDEF123456` mixes letters and digits — fully valid per `[a-zA-Z0-9]`.
