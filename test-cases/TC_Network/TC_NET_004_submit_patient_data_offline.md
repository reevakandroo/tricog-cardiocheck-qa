---
id: TC_NET_004
module: Network
title: Submit Patient Data Offline — Error Shown and Form Data Not Lost
type: Negative
severity: High
preconditions: [PC_001, PC_002, PC_003, PC_007]
---

## Scenario
A user fills out the patient data form for an ECG record, then the network is disabled before submission. When the user taps Submit, the app must show a clear error indicating the submission failed — and critically, must not discard the data the user has entered, allowing them to retry once connectivity is restored.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard
- [PC_003](../preconditions/PC_003_ecg_available.md) - At least one ECG record is present in the list (new/unprocessed, awaiting patient data)
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) - A mock ECG has been seeded if no existing unprocessed ECG is available

## Test Data
| Field           | Value                             |
|-----------------|----------------------------------|
| Patient Name    | Test Patient Offline              |
| Patient ID      | TST-OFFLINE-001                   |
| Age             | 45                                |
| Gender          | Male                              |
| Network state   | Offline (DevTools throttling)     |

## Steps

### Phase 1 — Open Patient Form
1. From the ECG dashboard, locate a new/unprocessed ECG record in the list
2. Click the ECG record to open its detail view or patient data entry screen
3. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree

### Phase 2 — Fill in the Form
4. Fill in all required patient data fields with the test data above:
   - Patient Name: `Test Patient Offline`
   - Patient ID: `TST-OFFLINE-001`
   - Age: `45`
   - Any other required fields (gender, date of birth, etc.)
5. Do NOT submit yet — keep the form filled and visible

### Phase 3 — Go Offline
6. Open DevTools → **Network** tab
7. Set throttling to **Offline**
8. Confirm the offline state is active

### Phase 4 — Submit While Offline
9. Click the **Submit** or **Save** button on the patient form
10. Observe the app's response

### Phase 5 — Verify Error and Data Preservation
11. Confirm an error message appears informing the user that submission failed due to no network
12. Confirm the form is still visible and all the data entered in Phase 2 is **still populated** in the form fields — not cleared
13. Note any retry mechanism or guidance provided to the user

## Expected Result
- After clicking Submit while offline, the app displays a clear **user-friendly error** (e.g., "No internet connection. Please check your network and try again.") — not a raw HTTP error or stack trace
- The patient form remains visible with all previously entered data **intact** — the app must not clear the form on submission failure
- No partial submission occurs (no record is created server-side with incomplete data)
- The Submit button is re-enabled after the error so the user can retry once connectivity returns
- Optionally: the app queues the submission for retry when connectivity is restored (preferred but not required)

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Data loss risk:** clearing the form on a failed offline submission forces clinical staff to re-enter patient data — a significant UX defect in a medical workflow. If data is cleared, log as **High** defect.
- **HIPAA note:** no partial PHI should be persisted to any unprotected storage (localStorage, URL params) as part of a failed submission attempt.
- After restoring connectivity (DevTools back to No Throttling), test that the preserved form data can be successfully submitted as a follow-up step. Document the outcome in Notes.
- If the app has offline queuing/caching, verify that the queued submission is sent only when the user is authenticated (to avoid sending PHI without a valid session).
