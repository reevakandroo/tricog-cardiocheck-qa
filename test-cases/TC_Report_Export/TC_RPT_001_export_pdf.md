---
id: TC_RPT_001
module: Report Export
title: Export PDF — click "Export PDF" → PDF downloaded or opened in browser
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_005, PC_012]
---

## Scenario
A clinician clicks the "Export PDF" button after a risk assessment has been completed. The system must generate and deliver a PDF report — either as a browser download or inline in a new tab — without errors.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) — Patient data has been saved and a risk assessment result is displayed
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) — Browser is configured to handle PDF downloads

## Test Data
| Field      | Value    |
|------------|----------|
| Patient ID | PAT00201 |
| Age        | 50       |
| Gender     | Male     |
| Mock Risk  | moderate |

## Steps
1. Confirm a completed risk assessment is displayed (risk label visible).
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Set up Playwright to capture downloads (or prepare the Downloads folder for manual verification):
   ```js
   const [download] = await Promise.all([
     page.waitForEvent('download'),
     page.locator('flt-semantics:has-text("Export PDF")').click()
   ]);
   ```
4. Locate and click the Export PDF button: `flt-semantics:has-text("Export PDF")`.
5. Wait for the download event or new tab to open.
6. Observe the downloaded/opened file.
7. Verify the file is a valid PDF by checking the first 4 bytes (`%PDF` magic bytes).
8. Confirm the file size is greater than 0 bytes.

## Expected Result
- Clicking "Export PDF" triggers a file download or opens a PDF in a new browser tab.
- The file is a valid PDF (starts with `%PDF` magic bytes).
- File size is greater than 0 bytes (non-empty, not a corrupt or truncated file).
- No error toast, network failure, or blank page is shown.
- The download completes within a reasonable timeout (e.g., 15 seconds on a normal connection).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is the baseline PDF export test. All other TC_RPT tests depend on a working export mechanism confirmed here.
- In Playwright: use `await download.path()` to get the local file path, then read and inspect the PDF content.
- For manual testing: check the browser's Downloads indicator or the Downloads folder (`~/Downloads/`) for the newly created file.
- Note the filename format used (e.g., `cardiocheck_PAT00201_report.pdf`) — document it for traceability.
