---
id: TC_PADV_004
module: Advanced UX
title: Pressing browser Back from a patient form loads the dashboard without crash
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that pressing the browser back button while a patient form is open navigates the user back to the dashboard (or the ECG detail view) without any crash, unhandled error, or broken application state. This is a standard navigation pattern that the app must handle gracefully.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - ECG with a patient form is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Navigation Flow | Login → Dashboard → ECG Detail → Patient Form → Back |

## Steps
1. Log in and navigate to the dashboard.
2. Open an ECG record.
3. Navigate to the patient data form within the ECG.
4. Partially fill in the form (do not submit).
5. Press the browser back button (or `history.back()` in the console).
6. Observe the resulting page — confirm it loads without a crash or white screen.
7. Verify the page shown is the previous route (ECG detail or dashboard).
8. Confirm the application remains usable — navigate back to the form to verify the flow is intact.

## Expected Result
- Browser back navigation from the form does not crash the application.
- The previous route (dashboard or ECG detail) loads correctly.
- No JavaScript errors appear in the console.
- The application remains fully functional after the back navigation.
- No infinite loading spinners or blank screens.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web has historically had issues with browser history management — this is a known risk area.
- If the back navigation shows a blank screen or a router error, this is a High severity navigation bug.
- Also test: back navigation from the ECG detail to the dashboard list.
