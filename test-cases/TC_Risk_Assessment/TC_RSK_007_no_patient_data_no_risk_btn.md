---
id: TC_RSK_007
module: Risk Assessment
title: Risk Button Disabled — "Get Risk Assessment" button disabled until patient data submitted
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
Before any patient data has been entered and saved for an ECG, the "Get Risk Assessment" button must be in a disabled state. This test verifies that the risk assessment workflow enforces a strict dependency on completed patient data entry.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for a **fresh unprocessed ECG with no patient data yet entered**
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value            |
|------------|------------------|
| Patient ID | _(not entered)_  |
| Age        | _(not entered)_  |
| Gender     | _(not selected)_ |

## Steps
1. Confirm the ECG detail view is open with a fresh, unprocessed ECG — all patient fields are empty.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. **Do not fill in any patient data fields.**
4. Locate the "Get Risk Assessment" button: `flt-semantics[role="button"]:has-text("Get Risk Assessment")`.
5. Observe the button state (enabled/disabled, visual appearance).
6. Attempt to click the "Get Risk Assessment" button.
7. Observe whether anything happens — does an API call fire? Does the app navigate or show a result?
8. Open the browser Network tab and confirm no risk assessment API call was made.

## Expected Result
- The "Get Risk Assessment" button is **visibly disabled** (greyed out or non-interactive) before patient data is saved.
- Clicking the disabled button has **no effect** — no navigation, no API call, no risk result displayed.
- The button becomes enabled only after all required patient fields (Patient ID, Age, Gender) have been saved successfully.
- No error toast or modal is triggered by clicking the disabled button.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is a state-machine / workflow integrity test. The risk assessment must not be triggerable without valid patient context.
- Also test the partially-filled state: enter Patient ID and Age but not Gender, then check if the button remains disabled. Document the exact condition required to enable the button.
- From a security perspective, also verify that directly calling the risk assessment API endpoint without attached patient data returns an appropriate error (4xx), not a silent success — this validates server-side enforcement independent of the UI state.
