---
id: TC_PAT_004
module: Patient Information
title: Patient ID Too Long — 13 chars → "Should use 6-12 characters" validation error
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a 13-character Patient ID (one character above the maximum of 12). The system must reject this input and display the "Should use 6-12 characters" hint text.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value         | Notes                    |
|------------|---------------|--------------------------|
| Patient ID | ABCDEF1234567 | 13 characters — above max |
| Age        | 40            | Valid, not under test    |
| Gender     | Male          | Valid, not under test    |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Click the Patient ID field (`aria-label="Patient ID *"`).
4. Type `ABCDEF1234567` (exactly 13 characters).
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
- Boundary: max + 1 = 13 characters. This is the off-by-one test above the upper boundary.
- The source-code regex is `^[a-zA-Z0-9]{6,12}$`. Thirteen characters fail the `{6,12}` quantifier.
- Secondary check: does the field hard-cap input at 12 characters (preventing typing the 13th character), or does it allow typing and validate after? Document the observed behavior either way.
- Compare with TC_PAT_007 (exactly 12 chars = valid) to confirm the upper boundary is enforced correctly.
