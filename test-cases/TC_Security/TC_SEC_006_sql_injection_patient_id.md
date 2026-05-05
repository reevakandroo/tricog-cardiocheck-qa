---
id: TC_SEC_006
module: Security
title: SQL Injection in Patient ID — Caught by Validation or Sanitized by Backend
type: Security
severity: Critical
preconditions: [PC_001, PC_002, PC_003, PC_007]
---

## Scenario
A tester submits SQL injection payloads in the Patient ID field of the patient data entry form. The app must either reject the payload at the client-side validation layer (preferred for UX) or sanitize/parameterize it at the backend so that no SQL commands are executed. Evidence of injection success (e.g., error messages exposing DB structure, unexpected data in responses, or data deletion) must not occur.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User is logged in and on the ECG dashboard
- [PC_003](../preconditions/PC_003_ecg_available.md) - At least one ECG record is available and awaiting patient data
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) - A mock ECG has been seeded if no unprocessed ECG is available

## Test Data
| Field            | Value                                  |
|------------------|----------------------------------------|
| SQL Payload 1    | `' OR '1'='1`                          |
| SQL Payload 2    | `'; DROP TABLE patients; --`           |
| SQL Payload 3    | `1' UNION SELECT * FROM users --`      |
| SQL Payload 4    | `' OR 1=1--`                           |
| SQL Payload 5    | `admin'--`                             |
| Other fields     | Fill with valid data to allow submission attempt |

## Steps

### Phase 1 — Open Patient Form
1. From the ECG dashboard, open an unprocessed ECG record
2. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree
3. Navigate to the patient data entry form

### Phase 2 — Submit SQL Payloads
4. In the **Patient ID** field, enter Payload 1: `' OR '1'='1`
5. Fill all other required fields with valid data
6. Click **Submit** / **Save**
7. Observe the result: form validation error, success, or unexpected behavior

### Phase 3 — Inspect Response
8. Open DevTools → Network tab
9. Find the POST request for patient data submission
10. Note the HTTP response status and response body:
    - If 400/422: note the validation error message (does it expose SQL details?)
    - If 200: check if the data was accepted and rendered correctly (no injection evidence)
    - If 500: note the error — a 500 with SQL error details in the body is a **Critical** finding
11. Repeat steps 4–10 for each payload (use fresh ECG records or retry on the same one if edits are allowed)

### Phase 4 — Verify Data Integrity
12. After all payloads are submitted, navigate back to the ECG list
13. Confirm the app is still functional (no data was corrupted or deleted)
14. Confirm only legitimate ECG records are visible (no extra records injected via UNION attacks)

## Expected Result
- **Client-side validation** rejects SQL injection payloads in the Patient ID field with a user-friendly error (e.g., "Patient ID can only contain alphanumeric characters and hyphens")
  - OR —
- If the payload passes client-side validation, the **backend returns a 400/422** with a sanitized error message — not a database error, SQL exception, or stack trace
- No SQL commands are executed (no table drops, unexpected records, or unauthorized data returned)
- No database schema information (table names, column names, error messages from the SQL engine) is exposed in API responses
- The app remains stable and functional after all injection attempts

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Regex validation check:** Patient ID fields typically enforce a format like `[A-Za-z0-9\-]{1,20}`. If such a regex is applied, payloads containing `'`, `"`, `;`, and `--` will be rejected at input. Document the exact validation rule observed.
- **Backend parameterization:** even if client-side validation is absent or bypassed (e.g., via direct API calls), the backend must use parameterized queries or an ORM to prevent SQL injection. Direct URL manipulation bypassing the Flutter client is a valid attack surface.
- If a 500 Internal Server Error with SQL error details is returned, this is **Critical** — it both confirms injection is possible and leaks database structure.
- Test the backend API directly using a tool like `curl` with the injection payload to bypass any Flutter client-side validation:
  ```bash
  curl -X POST "<api-endpoint>/patient" \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"patientId": "'\'' OR 1=1--", "patientName": "Test"}'
  ```
