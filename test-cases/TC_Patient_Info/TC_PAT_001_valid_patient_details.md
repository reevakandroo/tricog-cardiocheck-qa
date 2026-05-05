---
id: TC_PAT_001
module: Patient Information
title: Valid Patient Details — PT ID 8 chars, name, age 45, gender Male → saved, risk button enabled
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician opens an unprocessed ECG, fills in all patient fields with valid data — a valid 8-character alphanumeric Patient ID, an optional name, age 45, and gender Male — saves the form, and confirms the "Get Risk Assessment" button becomes enabled.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API with `risk=moderate`

## Test Data
| Field       | Value        |
|-------------|--------------|
| Patient ID  | PAT00045     |
| Patient Name| John Smith   |
| Age         | 45           |
| Gender      | Male         |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Locate the Patient ID field using `aria-label="Patient ID *"` and click it.
4. Type `PAT00045`.
5. Locate the Patient Name field using `aria-label="Patient Name"` and click it.
6. Type `John Smith`.
7. Locate the Age field using `aria-label="Age *"` and click it.
8. Type `45`.
9. Locate the Gender dropdown using `flt-semantics[role="button"][aria-label^="Gender"]` and click it.
10. From the opened dropdown, click `flt-semantics[role="menuitem"][aria-label="Male"]`.
11. Observe the form state — no validation error hints should appear.
12. Click the Save / Submit button to persist the patient data.
13. Wait for any loading indicator to complete.
14. Observe the state of the `flt-semantics[role="button"]:has-text("Get Risk Assessment")` button.

## Expected Result
- All four fields accept the input without triggering any validation error hints.
- The hint text "Should use 6-12 characters", "Value must be between 18 and 150", and "Must be 100 characters or less" are NOT displayed.
- Patient data is saved successfully (confirmation toast or UI state change indicating success).
- The "Get Risk Assessment" button is **enabled** and clickable after the patient data is saved.
- The ECG entry in the dashboard list reflects the attached patient name (PAT00045 / John Smith).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is the primary happy-path test for the Patient Info module. All downstream risk and export tests depend on this flow succeeding.
- Patient ID `PAT00045` is 8 characters, comfortably within the 6–12 alphanumeric range.
- If the form auto-saves on blur (rather than requiring an explicit Save button click), steps 12–13 may be replaced by verifying the saved state after tabbing out of the last field.
- Flutter accessibility must be re-activated after any page transition by clicking `flt-semantics-placeholder` again.
