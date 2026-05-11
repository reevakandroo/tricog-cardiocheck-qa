---
id: TC_SAUD_005
module: Storage API Audit
title: ECG list API response does not include SSN, insurance, or other non-essential PHI fields
type: Positive
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that the API response for the ECG list endpoint (and other data list endpoints) does not return excessive PHI fields beyond what is necessary to render the dashboard. HIPAA's minimum necessary standard requires that only the minimum PHI needed for a given purpose is transmitted. SSN, insurance numbers, and other sensitive identifiers should never appear in a list-level API response.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| Target Endpoint | GET /v1/ecgs (or equivalent ECG list endpoint) |
| Fields to Check | SSN, insurance_number, credit_card, full address, phone, email beyond login email |

## Steps
1. Log in and open Chrome DevTools → Network tab.
2. Navigate to the dashboard to trigger the ECG list API call.
3. Locate the GET request to `/v1/ecgs` (or equivalent) in the Network tab.
4. Open the response body — inspect the JSON payload.
5. Search the JSON for sensitive field names: `ssn`, `social_security`, `insurance`, `credit_card`, `phone`.
6. Check if the patient's full address is returned in the list response.
7. Verify that only fields necessary for the list view (ID, date, status, maybe patient name) are present.
8. Document all PHI fields found in the response and assess whether they are necessary.

## Expected Result
- No SSN or social security number fields in the ECG list response.
- No insurance number or policy ID fields.
- No credit card or financial data.
- Patient data in the list is limited to identifiers necessary for display (name, ID, date).
- Sensitive fields are present only in detail-level API calls, not in list responses.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Over-returning PHI in list APIs is a HIPAA "minimum necessary" violation — High severity.
- Even if no UI element displays a field, if it's in the API response it's transmitted and logged — that counts as exposure.
- Check both the response body and any embedded metadata/pagination objects.
