---
id: TC_PAT_020
module: Patient Information
title: Patient ID Alphanumeric Mix — "PT1001" (letters + numbers) → valid, accepted
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a Patient ID that contains both letters and numbers (`PT1001`) — an alphanumeric mix that is a common real-world ID format. The system must accept this input because the validation rule allows `[a-zA-Z0-9]` and the length (6 chars) is within the 6–12 range.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value  | Notes                                   |
|------------|--------|-----------------------------------------|
| Patient ID | PT1001 | 6 chars, mixed letters and digits       |
| Age        | 35     | Valid, not under test                   |
| Gender     | Male   | Valid, not under test                   |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Click the Patient ID field (`aria-label="Patient ID *"`).
4. Type `PT1001`.
5. Tab out of the field or click elsewhere to trigger validation.
6. Observe whether any error/hint text appears for the Patient ID field.
7. Fill in Age (`35`) and Gender (`Male`).
8. Click the Save / Submit button.
9. Observe the form state and the "Get Risk Assessment" button.

## Expected Result
- **No** validation error or hint text is displayed for the Patient ID field.
- The form submits successfully.
- The "Get Risk Assessment" button becomes **enabled** after a successful save.
- The saved patient record reflects the Patient ID `PT1001` exactly as entered.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- `PT1001` represents the most natural real-world hospital patient ID format (prefix + number). This test confirms the system supports standard clinical ID patterns.
- The regex `^[a-zA-Z0-9]{6,12}$` explicitly allows mixed case with digits. Both letters-only (TC_PAT_006) and digits-only IDs are valid; this test covers the mixed case.
- Cross-check: `PT1001` is exactly 6 characters (at the lower boundary). This makes it a compound positive test: valid format AND valid minimum length.
