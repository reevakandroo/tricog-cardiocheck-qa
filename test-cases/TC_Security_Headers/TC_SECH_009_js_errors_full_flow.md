---
id: TC_SECH_009
module: Security Headers
title: No unhandled JavaScript errors occur during normal application use
type: Positive
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that a complete normal user flow through CardioCheck — from login through ECG review to logout — produces no unhandled JavaScript errors or uncaught promise rejections in the browser console. Unhandled errors can indicate unstable code paths, expose internal stack traces, or degrade user experience silently.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Flow Coverage | Login → Dashboard → ECG Detail → Patient Form → Submit → Logout |

## Steps
1. Open the browser DevTools (Console tab) and set the filter to show Errors only.
2. Navigate to the CardioCheck login page — note any errors on page load.
3. Log in with valid credentials — check for errors after login.
4. Navigate through the dashboard ECG list — check for errors.
5. Open an ECG detail view — check for errors.
6. Navigate to the patient form and fill it in — check for errors.
7. Submit the patient form — check for errors post-submission.
8. Initiate logout — check for errors. Record any errors found at each step.

## Expected Result
- Zero unhandled JavaScript errors throughout the entire flow.
- Zero uncaught promise rejections in the console.
- The Console tab shows no red error entries during the full navigation flow.
- Any expected errors (e.g., intentional 401 on token check) are handled gracefully and do not surface as uncaught exceptions.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Also check for any `console.error` calls that may reveal internal implementation details.
- Unhandled errors exposing file paths, API structures, or library versions should be flagged as Medium (information disclosure).
- This test should be repeated in all major supported browsers (Chrome, Firefox, Safari, Edge).
