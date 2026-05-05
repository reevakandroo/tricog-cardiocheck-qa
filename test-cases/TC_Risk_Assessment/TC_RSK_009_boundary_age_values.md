---
id: TC_RSK_009
module: Risk Assessment
title: Boundary Age Values — Age=18 and Age=150 → risk assessment works at both boundaries
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_007]
---

## Scenario
The risk assessment is triggered for patients at the minimum (Age=18) and maximum (Age=150) allowed age boundaries. The system must complete the risk assessment successfully for both boundary values — the age bounds apply to data entry but must not silently break the downstream risk computation.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — Two separate mock ECGs seeded (one for each age boundary test), both with `risk=moderate`

## Test Data
### Run A — Minimum Age
| Field      | Value    |
|------------|----------|
| Patient ID | BNDA0018 |
| Age        | 18       |
| Gender     | Male     |
| Mock Risk  | moderate |

### Run B — Maximum Age
| Field      | Value    |
|------------|----------|
| Patient ID | BNDB0150 |
| Age        | 150      |
| Gender     | Female   |
| Mock Risk  | moderate |

## Steps

### Run A (Age = 18)
1. Seed a fresh mock ECG with `risk=moderate`.
2. Open the unprocessed ECG from the dashboard.
3. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
4. Fill in Patient ID: `BNDA0018`, Age: `18`, Gender: `Male`.
5. Save patient data — confirm no validation error for Age=18.
6. Click "Get Risk Assessment".
7. Observe the result — confirm a risk label (Low/Moderate/High) is displayed, not an error.

### Run B (Age = 150)
8. Seed another fresh mock ECG with `risk=moderate`.
9. Open the unprocessed ECG from the dashboard.
10. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
11. Fill in Patient ID: `BNDB0150`, Age: `150`, Gender: `Female`.
12. Save patient data — confirm no validation error for Age=150.
13. Click "Get Risk Assessment".
14. Observe the result — confirm a risk label is displayed, not an error.

## Expected Result
- **Run A (Age=18):** Patient data saves successfully, risk assessment runs, a "Moderate" risk label is displayed.
- **Run B (Age=150):** Patient data saves successfully, risk assessment runs, a "Moderate" risk label is displayed.
- No errors are thrown for either boundary age during the risk computation phase.
- Both ECG entries in the dashboard list update to show a completed status.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This test chains the age boundary validation (TC_PAT_010, TC_PAT_011) into the full risk assessment flow to confirm the boundary ages don't cause issues downstream (e.g., in the ML model, risk algorithm, or API serialization).
- If the risk model internally operates on an age range and fails silently for extreme values, this test will catch it.
- Check the network request payload for both runs to confirm Age is serialized as an integer (not a float or string) in the API call.
