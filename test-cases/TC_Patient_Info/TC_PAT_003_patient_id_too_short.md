---
id: TC_PAT_003
module: Patient Information
title: Patient ID Too Short — 5 chars (ABCDE) → "Should use 6-12 characters" error
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a 5-character Patient ID (one character below the minimum of 6). The system must reject this input and display the "Should use 6-12 characters" hint text.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value   | Notes                    |
|------------|---------|--------------------------|
| Patient ID | ABCDE   | 5 characters — below min |
| Age        | 40      | Valid, not under test    |
| Gender     | Male    | Valid, not under test    |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Click the Patient ID field (`aria-label="Patient ID *"`).
4. Type `ABCDE` (exactly 5 characters).
5. Tab out of the field or click elsewhere to trigger validation.
6. Observe the field and any error/hint text displayed near it.
7. Attempt to click the Save / Submit button.
8. Observe whether the form is submitted or blocked.

## Expected Result
- The hint text **"Should use 6-12 characters"** is displayed on or below the Patient ID field.
- The form is **not** submitted.
- The "Get Risk Assessment" button remains disabled.
- No patient data API call is fired.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Boundary: min − 1 = 5 characters. This is the classic off-by-one test below the lower boundary.
- The source-code regex is `^[a-zA-Z0-9]{6,12}$`. Five characters fail the `{6,12}` quantifier.
- Validation may trigger on blur (focus-out) or on submit — both behaviors are acceptable, but document which one fires.
- Compare with TC_PAT_006 (exactly 6 chars = valid) to confirm the boundary is enforced correctly.
