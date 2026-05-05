---
id: TC_HIPAA_005
module: HIPAA Compliance
title: App displays only minimum necessary PHI
type: HIPAA
severity: Medium
preconditions: [PC_002, PC_009]
---
## Scenario
Verify UI does not expose excessive PHI beyond clinical need (HIPAA §164.502(b)).
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_009](../preconditions/PC_009_processed_ecg_in_list.md) - Processed ECG exists
## Steps
1. Inspect ECG list — what PHI is visible per card (patient name, ID, DOB)?
2. Open ECG detail — verify only clinically necessary data is shown
3. Open browser DevTools Network tab — check API responses for unnecessary PHI fields
4. Verify no SSN, full DOB, insurance info, or demographic data beyond name/age/gender
## Expected Result
App shows only: patient ID, patient name, age, gender, ECG acquisition time, risk result. No excessive PHI fields in UI or API response.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
