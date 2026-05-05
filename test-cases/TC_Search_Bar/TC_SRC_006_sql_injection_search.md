---
id: TC_SRC_006
module: Search Bar
title: SQL injection in search bar does not return all records or expose data
type: Security
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
An attacker or malicious insider may attempt SQL injection through the search bar to bypass query filters and return all patient records, extract sensitive data, or corrupt the database. The application must sanitise or parameterise all search inputs so that SQL injection payloads are treated as literal strings — not executed as SQL. A successful injection in a HIPAA-regulated cardiac data system is a Critical security and compliance failure.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record exists (to differentiate "all records returned" from "empty") | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Payload Label | Input Value | Attack Intent |
|---------------|-------------|---------------|
| Classic tautology | `' OR '1'='1` | Return all rows |
| Comment bypass | `' OR 1=1--` | Comment out WHERE clause |
| Union-based extraction | `' UNION SELECT id,patientId,patientName,age,gender,riskCategory,deviceAcquisitionTime,createdAt FROM ecgs--` | Dump table |
| Stacked query (drop) | `'; DROP TABLE ecgs;--` | Destructive DDL |
| Boolean blind | `' AND 1=1--` | Infer data via true/false |
| Error-based | `' AND 1=CONVERT(int,'a')--` | Trigger SQL error for info disclosure |
| Second-order | `admin'--` | Stored injection |
| Null terminator | `'\0OR 1=1` | Bypass null-aware filters |

## Steps

For each payload in the Test Data table:
1. Clear the search bar completely.
2. Type or paste the SQL injection payload into the search bar.
3. Submit the search (wait for debounce or press Enter).
4. Open DevTools → Network tab and observe:
   a. The exact URL and `patientId` query parameter sent to the API — confirm the payload is URL-encoded and treated as a literal string.
   b. The HTTP response status code.
   c. The response body — count the number of records returned.
5. Observe the UI:
   - **FAIL condition:** More ECG records are displayed than would match a literal search for the injection string (i.e., if any records appear, the injection may have been executed).
   - **FAIL condition:** API returns HTTP 500 (error-based information disclosure).
   - **PASS condition:** API returns HTTP 200 with 0 results (injection treated as a literal non-matching string) or HTTP 400 (rejected input).
6. Open the DevTools Console tab and check for any SQL error messages echoed back to the frontend.
7. After each test, clear the search and verify the full list is still intact (no records dropped).

### Post-test verification — data integrity
1. After running all payloads, navigate to the full ECG list (clear search).
2. Confirm all ECG records that existed before the tests are still present (the stacked DROP TABLE payload did not succeed).
3. Verify the total record count matches the pre-test count.

## Expected Result

- Every payload is transmitted URL-encoded to the backend as a literal string parameter.
- API returns HTTP 200 with `data: []` (no match for injection strings) or HTTP 400 (rejected).
- API **never** returns HTTP 500 with SQL error details.
- The number of ECG records returned does **not** increase due to a tautology payload (`OR 1=1`).
- No records are dropped or corrupted by the DROP TABLE payload.
- No SQL error messages appear in the browser console or response body.
- HIPAA: No PHI from other patients is returned as a result of the injection attempt.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Any successful SQL injection (tautology returns records, union dumps data, or 500 error leaks schema info) is a **Critical** defect. Escalate to the security team immediately.
- The backend must use parameterised queries or an ORM with prepared statements — raw string concatenation into SQL is unacceptable.
- If the API returns HTTP 400 with a message like "Invalid characters in patientId", that is an acceptable (and preferable) defence-in-depth response.
- Run these tests in a staging environment — the `'; DROP TABLE ecgs;--` payload is destructive if the backend is vulnerable. Confirm with the engineering team that staging is isolated from production data before running.
- HIPAA breach implication: unauthorised access to all patient ECG records via SQL injection constitutes a reportable data breach under 45 CFR § 164.402.
