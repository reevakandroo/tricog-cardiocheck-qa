---
id: TC_PAT_008
module: Patient Information
title: Missing Age — empty age field → validation error shown, cannot submit
type: Negative
severity: Critical
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician attempts to submit the patient information form with the Age field left blank. Because Age is a required field, the system must block submission and display a validation error.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value      | Notes              |
|------------|------------|--------------------|
| Patient ID | PAT00099   | Valid 8-char ID    |
| Age        | _(empty)_  | Required — omitted |
| Gender     | Female     | Valid               |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Fill in Patient ID (`aria-label="Patient ID *"`) with `PAT00099`.
4. Leave the Age field (`aria-label="Age *"`) completely empty — do not click or type anything in it.
5. Select Gender: `flt-semantics[role="button"][aria-label^="Gender"]` → `flt-semantics[role="menuitem"][aria-label="Female"]`.
6. Click or tab through the Age field without entering a value to ensure the field registers as touched.
7. Click the Save / Submit button to attempt form submission.
8. Observe the Age field and any validation error or hint text that appears.
9. Verify the form has not navigated away or shown a success state.

## Expected Result
- A validation error is displayed on or near the Age field (e.g., "Value must be between 18 and 150" or "Age is required").
- The form is **not** submitted.
- The "Get Risk Assessment" button remains **disabled**.
- No patient data API call is made (verify in Network tab — no POST/PUT with patient data).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Age is explicitly marked as required in the source code. An empty integer field must fail validation.
- The hint text associated with Age in the source is "Value must be between 18 and 150" — this hint may serve double duty for both empty and out-of-range values.
- Cross-check: confirm the asterisk (`*`) is visible in the Age label in the UI, communicating the required state.
- If a "required" error is distinct from the range error, document both messages.
