---
id: TC_SAUD_003
module: Storage API Audit
title: Downloaded PDF report has a valid .pdf filename and is a readable PDF
type: Positive
severity: Medium
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that when a user downloads a report or risk assessment result as a PDF from CardioCheck, the downloaded file has a valid `.pdf` extension, a meaningful filename, and is a properly formatted, readable PDF document.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - A completed ECG with a downloadable result is available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Target | PDF download from a completed ECG result page |
| Expected Filename | Ends with `.pdf`, contains meaningful identifier |

## Steps
1. Log in and navigate to a completed ECG result or risk assessment page.
2. Locate and click the "Download" or "Export PDF" button.
3. Allow the file to download to the local machine.
4. Inspect the filename of the downloaded file — verify it ends with `.pdf`.
5. Verify the filename contains a meaningful identifier (e.g., patient ID, date, or ECG ID) — not a random hash or generic "download".
6. Open the downloaded file in a PDF viewer — confirm it renders correctly and is not corrupted.
7. Verify the PDF content matches the on-screen result (correct patient/ECG data).
8. Check the file size — confirm it is non-zero and reasonable for a report.

## Expected Result
- Downloaded file has a valid `.pdf` extension.
- Filename is meaningful and includes relevant identifiers (e.g., date, ECG ID).
- PDF opens without errors in a PDF viewer.
- PDF content matches the on-screen result data.
- File is not empty or corrupted.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- A file named "download" without extension is a UX failure — Low severity.
- A corrupt or empty PDF is Medium severity — it breaks the primary clinical reporting workflow.
- Check whether the PDF contains any inadvertent PHI beyond what is intended (e.g., full name when only ID was expected).
