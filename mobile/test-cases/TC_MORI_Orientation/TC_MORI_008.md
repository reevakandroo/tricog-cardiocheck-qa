---
id: TC_MORI_008
module: Mobile Orientation
title: ECG detail / waveform is visible in landscape orientation
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
ECG waveform data displayed in the ECG detail view must be visible and not clipped when viewed in landscape orientation, where the wider aspect ratio may better suit waveform display.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and an ECG entry with waveform data is available

## Test Data
| Field       | Value                    |
|-------------|--------------------------|
| Orientation | Landscape (851×393 px)   |
| Device      | Pixel 5 emulation        |

## Steps
1. Log in and navigate to an ECG entry detail page (portrait)
2. Switch viewport to landscape (851×393)
3. Observe whether the ECG waveform/chart section is visible
4. Check that the waveform is not clipped or hidden
5. Verify no horizontal overflow beyond 851px

## Expected Result
The ECG waveform or data section is visible in landscape orientation. The content adapts to the wider viewport. No horizontal overflow. Scrolling may be needed vertically but not horizontally.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
