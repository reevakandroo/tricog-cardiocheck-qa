---
id: TC_PAT_005
module: Patient Information
title: Patient ID Special Characters — "PT-001!" → error (only alphanumeric allowed)
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician enters a Patient ID containing a hyphen and an exclamation mark (`PT-001!`). Because the validation rule permits only alphanumeric characters (`^[a-zA-Z0-9]{6,12}$`), this input must be rejected.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated via the mock Omron API

## Test Data
| Field      | Value   | Notes                              |
|------------|---------|-------------------------------------|
| Patient ID | PT-001! | 7 chars including `-` and `!`       |
| Age        | 40      | Valid, not under test               |
| Gender     | Male    | Valid, not under test               |

## Steps
1. Verify the patient information form is open and all fields are empty/editable.
2. Click the `flt-semantics-placeholder` to ensure the Flutter accessibility tree is active.
3. Click the Patient ID field (`aria-label="Patient ID *"`).
4. Type `PT-001!`.
5. Tab out of the field or click elsewhere to trigger validation.
6. Observe the field and any error/hint text displayed near it.
7. Attempt to click the Save / Submit button.
8. Observe whether the form is submitted or blocked.
9. Open browser DevTools → Network tab and confirm no patient save API request was sent.

## Expected Result
- A validation error is displayed for the Patient ID field (expected hint: "Should use 6-12 characters" or an equivalent "only alphanumeric" message).
- The form is **not** submitted.
- The "Get Risk Assessment" button remains disabled.
- No patient data API call is fired.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The regex `^[a-zA-Z0-9]{6,12}$` explicitly excludes `-`, `!`, `@`, `#`, `$`, `%`, spaces, and all other non-alphanumeric characters.
- This test also validates that the field does not silently strip special characters (e.g., saving `PT001` after removing `-!`) — the raw input must be rejected.
- Extended variants worth noting for exploratory testing: SQL injection (`' OR 1=1--`), XSS (`<script>alert(1)</script>`), and unicode (`PT©001`). Each should be blocked by the same regex rule.
- Document whether the field prevents typing special characters outright (input filter) or validates on blur/submit.
