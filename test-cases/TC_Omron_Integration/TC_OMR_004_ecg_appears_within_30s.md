---
id: TC_OMR_004
module: Omron Integration
title: Seeded ECG appears in list within 30 seconds
type: Positive
severity: High
preconditions: [PC_001, PC_002]
---
## Scenario
Verify the datasync worker picks up a mock-seeded ECG and it surfaces in the UI within 30 seconds.
## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser ready
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated
## Steps
1. Note timestamp T0
2. POST to mock ingest API (any risk level)
3. Poll/refresh ECG list every 5 seconds
4. Measure time T1 when new ECG appears
5. Verify T1 - T0 ≤ 30 seconds
## Expected Result
New ECG visible within 30s of seeding. Backend datasync interval is 15s (SYNC_INTERVAL=15000ms).
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
