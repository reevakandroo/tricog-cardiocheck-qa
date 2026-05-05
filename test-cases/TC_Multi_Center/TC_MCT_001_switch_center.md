---
id: TC_MCT_001
module: Multi-Center
title: Switch active center updates ECG list
type: Positive
severity: High
preconditions: [PC_002, PC_010]
---
## Scenario
Selecting a different center from Profile updates the ECG dashboard to show only that center's data.
## Preconditions
- [PC_002](../preconditions/PC_002_authenticated_user.md) - Authenticated on dashboard
- [PC_010](../preconditions/PC_010_multi_center_access.md) - User has multi-center access
## Steps
1. Note current ECG list (center A)
2. Navigate to /profile/center-selection
3. Select a different center (center B)
4. Navigate back to /ecgs
5. Verify ECG list now shows center B data only
## Expected Result
ECG list changes to reflect center B. activeCenterIdProvider updates → EcgListNotifier reloads with new center_id. No ECGs from center A appear.
## Actual Result
_To be filled during execution_
## Status
_To be filled during execution_
