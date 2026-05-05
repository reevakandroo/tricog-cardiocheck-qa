---
id: TC_PAT_010
module: Patient Information
title: Age Boundary Minimum — Age=18 → valid, accepted
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters age 18 — the exact minimum allowed value. The system must accept this value without any validation error, confirming the lower boundary is inclusive.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value    | Notes                        |
|------------|----------|------------------------------|
| Patient ID | PAT00099 | Valid 8-char ID              |
| Age        | 18       | Exactly the minimum — valid  |
| Gender     | Male     | Valid, not under test        |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Age field (`aria-label="Age *"`).
5. Type `18`.
6. Tab out of the field or click elsewhere to trigger validation.
7. Observe whether any error/hint text appears for the Age field.
8. Select Gender: Male.
9. Click the Save / Submit button.
10. Observe the form state and the "Get Risk Assessment" button.

## Expected Result
- **No** validation error or hint text is displayed for the Age field after entering `18`.
- The form submits successfully.
- The "Get Risk Assessment" button becomes **enabled** after a successful save.
- The saved patient record reflects age 18.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is the lower-boundary inclusive test (min = 18). Compare with TC_PAT_009 (Age=17 = invalid) to confirm the exact boundary.
- Also confirm the saved age is exactly `18` and not rounded or modified by the backend.
