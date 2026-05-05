---
id: TC_HIPAA_006
module: HIPAA Compliance
title: Center-based access control enforced for all PHI
type: HIPAA
severity: Critical
preconditions: [PC_002]
---
## Scenario
Verify user cannot access PHI from centers they are not authorized for (HIPAA §164.308(a)(3)).
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated user
## Steps
1. Note the center ID visible in active session
2. Try GET /v1/ecgs with a manually crafted centerId that the user has no access to
3. Try to access an ECG UUID from another center via /ecg/:id/patient directly
4. Verify each attempt returns 403 or redirects to login
## Expected Result
All cross-center data access returns HTTP 403. Backend enforces: WHERE center_id IN (user's authorized centers) on every query.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
