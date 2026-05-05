---
id: TC_MCT_003
module: Multi-Center
title: ECGs from other centers not visible when center is switched
type: Security
severity: Critical
preconditions: [PC_002, PC_010]
---
## Scenario
Verify center data isolation — switching centers must not leak ECGs from the previous center (HIPAA §164.308(a)(3)).
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
- [PC_010](../preconditions/PC_010_multi_center_access.md) - Multi-center access
## Steps
1. On center A, note 3 specific patient IDs visible in the list
2. Switch to center B
3. Search for each of those patient IDs from center A
4. Verify none of them appear in center B's list
5. Also check browser DevTools: no cached API responses showing center A data
## Expected Result
Zero cross-center data leakage. Search returns empty for center A patient IDs when on center B.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
