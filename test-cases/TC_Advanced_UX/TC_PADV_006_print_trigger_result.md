---
id: TC_PADV_006
module: Advanced UX
title: Triggering window.print() on a result screen does not crash the application
type: Positive
severity: Low
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that triggering the browser's print function (via the Print button, keyboard shortcut Ctrl+P, or `window.print()` in the console) on the ECG result or risk assessment screen does not cause the application to crash, freeze, or produce an error. The print preview should load without issue.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - A completed ECG with a result/risk assessment page is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Target Page | ECG result screen or risk assessment output |
| Print Method | Ctrl+P keyboard shortcut or in-app Print button |

## Steps
1. Log in and navigate to the dashboard.
2. Open a completed ECG record that has a result or risk assessment view.
3. Navigate to the result/risk assessment screen.
4. Press Ctrl+P (or Cmd+P on Mac) to trigger the print dialog.
5. Observe whether the print preview loads correctly.
6. Cancel the print dialog without printing.
7. Confirm the application is still functional after canceling the print dialog.
8. Check the browser console for any errors triggered by the print event.

## Expected Result
- Print dialog opens without crash or error.
- Print preview shows a reasonable rendering of the result screen.
- Canceling the print dialog returns the user to the normal application view without issues.
- No JavaScript errors appear in the console during or after the print trigger.
- The application remains fully functional post-print-cancel.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web canvas rendering may produce a blank or incorrect print preview — document this if observed.
- If a `@media print` CSS stylesheet is present, note whether it improves the print output.
- Low severity: print is a secondary workflow but used by clinicians sharing results.
