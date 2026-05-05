---
id: TC_PAT_017
module: Patient Information
title: Patient Name Max Length — exactly 100 chars (letters) → valid, accepted
type: Edge
severity: Medium
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a patient name of exactly 100 characters (the maximum allowed length) composed only of letters and spaces. The system must accept this input without any validation error.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field        | Value                                                                                                | Notes                      |
|--------------|------------------------------------------------------------------------------------------------------|----------------------------|
| Patient ID   | PAT00099                                                                                             | Valid 8-char ID            |
| Patient Name | Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghijkl | Exactly 100 characters     |
| Age          | 40                                                                                                   | Valid, not under test      |
| Gender       | Male                                                                                                 | Valid, not under test      |

> **Note:** Verify the Patient Name string above is exactly 100 characters before execution. Use: `echo -n "Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghij Abcdefghijkl" | wc -c`

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID with `PAT00099`.
4. Click the Patient Name field (`aria-label="Patient Name"`).
5. Paste or type the 100-character name string.
6. Verify the character count is exactly 100 (count manually or use clipboard length check).
7. Tab out of the field or click elsewhere to trigger validation.
8. Observe whether any error/hint text appears for the Patient Name field.
9. Fill in Age (`40`) and Gender (`Male`).
10. Click the Save / Submit button.
11. Observe the form state and the "Get Risk Assessment" button.

## Expected Result
- **No** validation error or hint text is displayed for the Patient Name field.
- The hint "Must be 100 characters or less" does **not** appear.
- The form submits successfully.
- The "Get Risk Assessment" button becomes **enabled** after a successful save.
- The saved patient record stores the full 100-character name without truncation.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is the upper-boundary inclusive test (max = 100 chars). Compare with TC_PAT_018 (101 chars = invalid) to confirm the exact boundary.
- Confirm no truncation occurs at the backend — check the API response or view the saved patient record to verify the full name is stored.
- If using Playwright, paste via `page.locator('[aria-label="Patient Name"]').fill(nameString)` to avoid typing 100 characters one by one.
