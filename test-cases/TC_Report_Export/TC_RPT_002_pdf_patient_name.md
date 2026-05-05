---
id: TC_RPT_002
module: Report Export
title: PDF Contains Correct Patient Name — exported PDF includes the entered patient name
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_005, PC_012]
---

## Scenario
A clinician exports a PDF report after completing a risk assessment. The exported PDF must contain the patient's name exactly as entered during patient data entry. This validates that PHI is correctly embedded in the report.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) — Patient data has been saved (including a patient name) and risk assessment is displayed
- [PC_012](../preconditions/PC_012_pdf_viewer_available.md) — Browser is configured to handle PDF downloads

## Test Data
| Field        | Value          |
|--------------|----------------|
| Patient ID   | PAT00202       |
| Patient Name | Alice Johnson  |
| Age          | 42             |
| Gender       | Female         |
| Mock Risk    | low            |

## Steps
1. Confirm a risk assessment has been completed with patient name `Alice Johnson`.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Click the Export PDF button: `flt-semantics:has-text("Export PDF")`.
4. Wait for the PDF to download or open.
5. Open the PDF in a viewer (browser PDF viewer, or use a PDF parsing tool in automated tests).
6. Search the PDF content for the text `Alice Johnson`.
7. Verify the name appears in the patient information section of the report.

## Expected Result
- The exported PDF contains the text `Alice Johnson` in the patient information section.
- The name is spelled correctly — no truncation, corruption, or encoding issue.
- The name is associated with the correct patient section (not appearing in a footer or unrelated section by error).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- In automated testing, extract PDF text using a library like `pdf-parse` (Node.js) or `PyPDF2` (Python), then assert the presence of `Alice Johnson`.
- HIPAA consideration: the presence of the patient name in the PDF confirms PHI is included — this is expected for clinical reports. Ensure the PDF itself is not publicly accessible without authentication (see TC_RPT_010).
- Also verify: if the patient name was entered with mixed case (`alice johnson` vs `Alice Johnson`), the PDF preserves the entered casing rather than normalizing it.
