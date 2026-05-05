---
id: TC_MCT_002
module: Multi-Center
title: Center selection persists across browser restart
type: Positive
severity: Medium
preconditions: [PC_002, PC_010]
---
## Scenario
Active center choice is saved to SharedPreferences and survives browser close/reopen.
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_010](../preconditions/PC_010_multi_center_access.md) - Multi-center access
## Steps
1. Switch to center B via profile
2. Close the browser completely
3. Reopen and navigate to the app URL
4. After auto-login (session still valid), check which center is active
## Expected Result
Center B remains active. ECG list shows center B data without requiring user to re-select.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
