---
id: TC_PAT_018
module: Patient Information
title: Patient Name Exceeds Max — 101 chars → "Must be 100 characters or less" error
type: Negative
severity: Medium
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a patient name of 101 characters (one character over the 100-character maximum). The system must reject this input and display the "Must be 100 characters or less" hint text.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field        | Value                                                                                                 | Notes                       |
|--------------|-------------------------------------------------------------------------------------------------------|-----------------------------|
| Patient ID   | PAT00099                                                                                              | Valid 8-char ID             |
| Patient Name | Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghijklm | Exactly 101 characters      |
| Age          | 40                                                                                                    | Valid, not under test       |
| Gender       | Male                                                                                                  | Valid, not under test       |

> **Note:** Verify the Patient Name string above is exactly 101 characters before execution. Use: `echo -n "<string>" | wc -c`

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Patient Name field (`aria-label="Patient Name"`).
5. Paste or type the 101-character name string.
6. Tab out of the field or click elsewhere to trigger validation.
7. Observe the Patient Name field and any error/hint text displayed near it.
8. Fill in Age (`40`) and Gender (`Male`).
9. Click the Save / Submit button to attempt form submission.
10. Verify the form has not been submitted successfully.

## Expected Result
- The hint text **"Must be 100 characters or less"** is displayed on or below the Patient Name field.
- The form is **not** submitted.
- The "Get Risk Assessment" button remains **disabled**.
- No patient data API call is fired with the oversized name.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is the max + 1 = 101 character test for Patient Name. Compare with TC_PAT_017 (100 chars = valid).
- Secondary check: does the field hard-cap input at 100 characters (preventing the 101st character from being typed)? If so, document as "Input cap enforced at 100 chars."
- Overly long values in patient names could cause layout issues in the exported PDF — flag if the report export does not handle them gracefully.
