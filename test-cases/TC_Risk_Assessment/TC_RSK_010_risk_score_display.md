---
id: TC_RSK_010
module: Risk Assessment
title: Risk Score Display — numeric score (0.0-1.0) displayed alongside risk category
type: Positive
severity: Medium
preconditions: [PC_001, PC_002, PC_005]
---

## Scenario
After a risk assessment is completed, the app displays both a categorical risk label (Low/Moderate/High) and a numeric risk score in the 0.0–1.0 range. This test verifies that the score is present, correctly formatted, and consistent with the displayed category.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) — Patient data has been saved and a risk assessment result is currently displayed. Use a `moderate` risk ECG for this test.

## Test Data
| Field      | Value    |
|------------|----------|
| Patient ID | PAT00110 |
| Age        | 50       |
| Gender     | Male     |
| Mock Risk  | moderate |

## Steps
1. Confirm the risk assessment result screen is displayed.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Locate the risk score display on the result screen.
4. Note the exact numeric value shown (e.g., `0.45`, `0.52`, etc.).
5. Note the risk category label shown alongside the score (e.g., "Moderate Risk").
6. Verify the numeric score is within the valid range (0.0 to 1.0).
7. Verify consistency: a "Moderate" category should correspond to a mid-range score (roughly 0.33–0.66).
8. Open the browser Network tab and inspect the risk assessment API response to confirm the raw score value matches what is displayed in the UI.

## Expected Result
- A numeric risk score between 0.0 and 1.0 (inclusive) is displayed on the result screen.
- The score is formatted consistently (e.g., one or two decimal places — document the actual format).
- The displayed category ("Moderate") is consistent with the numeric score range.
- The UI-displayed score matches the `score` or equivalent field in the API response (no rounding discrepancy beyond expected display precision).
- The score is visually co-located with the category label and color indicator.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Confirm the score is readable for all three risk levels: a low-risk ECG should show a low score (<0.33 approximately), and a high-risk ECG a high score (>0.66 approximately). Cross-reference TC_RSK_001, TC_RSK_002, and TC_RSK_003.
- If the score is displayed as a percentage (e.g., `45%`) rather than a decimal, document the format — both representations are valid if applied consistently.
- Accessibility: the numeric score must be present in the Flutter semantic tree (accessible to screen readers), not just rendered visually on the canvas.
- HIPAA consideration: the numeric score is sensitive clinical data — it must not appear in browser URL parameters, page titles, or other locations where it could be inadvertently logged.
