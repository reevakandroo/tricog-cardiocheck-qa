---
id: TC_NET_006
module: Network
title: PDF Export While Offline — Error Shown, No Silent Failure
type: Negative
severity: Medium
preconditions: [PC_001, PC_002, PC_005, PC_012]
---

## Scenario
A user navigates to an ECG report that has a completed risk assessment and attempts to export/download the PDF report while the device is offline. The app must show a clear error and must not silently fail (e.g., show a download button that does nothing, or produce a corrupted/empty PDF).

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) - At least one ECG record has a completed risk assessment (required for PDF export to be available)
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) - The browser can open/download PDF files

## Test Data
| Field             | Value                          |
|-------------------|-------------------------------|
| Network condition | Offline (DevTools throttling)  |
| Export format     | PDF report                     |

## Steps

### Phase 1 — Navigate to Exportable ECG
1. From the ECG dashboard, locate an ECG record that has a completed risk assessment
2. Click the record to open its detail or report view
3. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree
4. Confirm the **Export PDF** or **Download Report** button is visible and enabled

### Phase 2 — Go Offline
5. Open DevTools → **Network** tab
6. Set throttling to **Offline**
7. Wait for the offline banner to appear (if applicable)

### Phase 3 — Attempt PDF Export
8. Click the **Export PDF** / **Download Report** button
9. Observe the app's response

### Phase 4 — Verify Error Handling
10. Confirm whether an error message is displayed to the user
11. Confirm no corrupted or empty PDF file is downloaded to the browser's download folder
12. Confirm the Export button remains accessible for retry once connectivity is restored
13. Check the DevTools Console for any unhandled JavaScript errors

## Expected Result
- Clicking Export PDF while offline triggers a visible, user-friendly error message (e.g., "Unable to generate report. Please check your internet connection.")
- No file download is initiated — the browser does not receive a corrupted, empty, or partial PDF
- The error is displayed as a snackbar, dialog, or inline message — not a silent failure where nothing happens
- The export button does not remain in a permanently disabled or loading state after the error
- No unhandled exceptions are logged in the browser console

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Silent failure risk:** a common defect is the Export button appearing to "work" (briefly shows loading) but no file is downloaded and no error is shown. This is a **High** UX defect in a clinical context — staff may believe the report was generated and proceed without it.
- **HIPAA note:** if PDF generation is done client-side (embedded in the app), the export may succeed offline using cached data. If so, verify the PDF still contains all required PHI fields accurately and log this as a positive observation.
- After restoring network (set throttling to No Throttling), verify the export succeeds and produces a valid, non-empty PDF with correct patient data and risk assessment results.
- Record the exact error message text in Actual Result for documentation purposes.
