---
id: TC_OMR_005
module: Omron Integration
title: Newly seeded ECG shows New ECG label before patient data entry
type: Positive
severity: Medium
preconditions: [PC_007, PC_002]
---
## Scenario
Verify an unprocessed ECG (no patient data) is labeled "New ECG" in the list.
## Preconditions
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) - Mock ECG seeded
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
## Steps
1. Seed mock ECG via API
2. Refresh dashboard within 30s
3. Locate the new ECG card in the list
4. Verify it shows "New ECG" label (not a patient name or ID)
5. Click it → verify it opens patient details form (not risk result)
6. Fill and submit patient data
7. Return to ECG list → verify the card now shows patient name instead of "New ECG"
## Expected Result
"New ECG" label present before patient data. Replaced by patient name after data submission.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
