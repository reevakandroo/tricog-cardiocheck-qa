---
id: TC_PADV_005
module: Advanced UX
title: Browser forward navigation after going back does not crash the application
type: Edge
severity: Medium
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that using the browser's forward button after navigating back does not crash the CardioCheck application or produce an invalid application state. This tests the app's handling of forward history traversal, which is less common but can expose router state management bugs.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - ECG with a patient form is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Navigation Flow | Dashboard → ECG Detail → Patient Form → Back → Forward |

## Steps
1. Log in and navigate to the dashboard.
2. Open an ECG record (Dashboard → ECG Detail).
3. Navigate to the patient form within the ECG (ECG Detail → Patient Form).
4. Press the browser back button — confirm you land on the ECG Detail page.
5. Press the browser back button again — confirm you land on the Dashboard.
6. Press the browser forward button once — observe what page loads.
7. Press the browser forward button again — observe the second forward navigation.
8. Confirm no crash, blank screen, or JavaScript error at any step.

## Expected Result
- Forward navigation does not crash the application.
- Each forward press loads the correct next page in the history stack.
- No white screen or infinite loader appears.
- The application remains functional after both back and forward navigations.
- No duplicate API calls or double rendering on forward navigation.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Forward navigation is often untested and can expose router bugs in single-page apps.
- Flutter web with `path_url_strategy` sometimes does not support forward navigation correctly — document any deviation.
- A crash on forward navigation is Medium severity; incorrect page loading is Low severity but should be documented.
