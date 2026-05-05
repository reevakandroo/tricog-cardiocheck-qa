---
id: TC_HIPAA_001
module: HIPAA
title: PHI in URL — Patient ID and Name Must Not Appear in URL Parameters
type: HIPAA
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
As a user navigates through patient-related screens (ECG detail, patient form, report), the browser URL must not contain patient identifiers (name, date of birth, patient ID, national ID) as query parameters or path segments. PHI in URLs is a HIPAA violation risk because URLs are logged in browser history, server logs, referrer headers, and proxy logs.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard
- [PC_003](../preconditions/PC_003_ecg_available.md) - At least one ECG record with patient data is available in the list

## Test Data
| Field               | Value                          |
|---------------------|-------------------------------|
| PHI types to check  | Patient name, patient ID, date of birth, national ID, phone number |
| Screens to check    | ECG list, ECG detail, patient form, PDF report |

## Steps

### Phase 1 — ECG Dashboard
1. From the ECG dashboard (`/ecgs`), note the URL structure
2. Check: does the URL contain patient names, IDs, or any PHI as query params?

### Phase 2 — ECG Detail View
3. Click on an ECG record that has patient data attached
4. Note the URL after navigation (e.g., `/ecg/<id>` or `/ecg/<id>/detail`)
5. Check: does the URL path or query string contain the patient's name, date of birth, or national ID?
6. The ECG's internal record ID in the URL is acceptable — it is an opaque system identifier, not PHI

### Phase 3 — Patient Data Form
7. Navigate to the patient data entry form (e.g., `/ecg/<id>/patient`)
8. Note the URL
9. If pre-populated fields exist, confirm patient name/ID does not appear in the URL

### Phase 4 — PDF Report Generation
10. Trigger a PDF report export for an ECG with patient data
11. Note the URL of the PDF download request in DevTools → Network tab
12. Check: does the PDF download URL contain patient name, patient ID, or other PHI as query parameters?

### Phase 5 — Search/Filter
13. If the ECG list has a search bar, search by patient name
14. Note the resulting URL — does the search term (patient name) appear in the URL as a query parameter (e.g., `?search=John+Doe`)?

## Expected Result
- All URLs across the app use **opaque system IDs** (e.g., ECG record UUID) in path segments — never patient names, national IDs, dates of birth, or other PHI
- Search queries, if any, do not append patient names to the URL (search state should be managed in app memory/state, not URL query params)
- PDF download URLs do not expose patient identifiers — the PDF is requested by opaque ECG ID and served with patient data embedded in the file only
- No PHI appears in browser history URLs, network request URLs, or referrer headers

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **HIPAA Technical Safeguard (§164.312):** access controls must ensure that PHI is not exposed through channels that bypass access controls. URLs are stored in browser history (accessible to anyone with device access), server access logs, CDN logs, and HTTP Referer headers sent to third-party analytics or CDN services.
- **Acceptable:** opaque record IDs (UUIDs, numeric IDs) in URL paths — these do not constitute PHI on their own.
- **Not acceptable:** `/ecg?patient=John+Doe`, `/report?dob=1990-01-01`, `/patient?name=Jane+Smith&id=12345`.
- If any PHI is found in URLs, log as **High** HIPAA finding — and confirm whether the app uses any third-party analytics (Google Analytics, Mixpanel, etc.) that would automatically log and transmit the full URL.
- Related to TC_HIPAA_005 (data minimization).
