---
id: TC_OMR_001
module: Omron Integration
title: Seed mock ECG with low risk — verify in list
type: Positive
severity: Critical
preconditions: [PC_001, PC_002]
---
## Scenario
POST to mock ingest API with risk=low and verify ECG appears with correct low risk result.
## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser ready
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated on dashboard
## Test Data
| Field | Value |
|-------|-------|
| omronConnectId | 86f66e18-494a-4232-8f76-530276b38d3c |
| risk | low |
| mock-token | mock-ingest-s3cr3t |
## Steps
1. Run: curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" -H "x-mock-token: mock-ingest-s3cr3t" -H "content-type: application/json" -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"low"}'
2. Wait up to 30 seconds and refresh ECG dashboard
3. Verify a "New ECG" entry appears at top of list
4. Click it → fill patient details → click Get Risk Assessment
5. Verify risk result shows low with correct color (green
amber/yellow)
## Expected Result
ECG appears within 30s. Risk assessment result is low (color: green
amber/yellow).
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
