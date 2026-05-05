---
id: TC_HIPAA_004
module: HIPAA Compliance
title: Patient data changes create audit log
type: HIPAA
severity: High
preconditions: [PC_002, PC_008]
---
## Scenario
Verify that patient data updates are audit-logged (HIPAA §164.312(b)).
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_008](../preconditions/PC_008_new_ecg_in_list.md) - New ECG available
## Steps
1. Open a new ECG and fill patient details (PT ID, age, gender)
2. Submit patient data
3. Via backend DB or API (if accessible): check tcc_ecg_audit_logs table for a new entry
4. Verify entry contains: ecg_id, user_id, old_value, new_value, timestamp
## Expected Result
Audit log entry exists for the patient data update with correct before/after values and timestamp.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
## Notes
White-box test — requires DB access or internal API. If not accessible, flag as Manual/Blocked.
