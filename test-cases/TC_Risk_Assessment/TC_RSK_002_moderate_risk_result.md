---
id: TC_RSK_002
module: Risk Assessment
title: Moderate Risk Result — mock risk=moderate → amber/yellow color, "Moderate" label
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician seeds a mock ECG with `risk=moderate`, enters valid patient data, triggers the risk assessment, and verifies the result displays the "Moderate" risk label with an amber or yellow color indicator.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated with `risk=moderate` via:
  ```bash
  curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
    -H "x-mock-token: mock-ingest-s3cr3t" \
    -H "content-type: application/json" \
    -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'
  ```

## Test Data
| Field      | Value    |
|------------|----------|
| Patient ID | PAT00102 |
| Age        | 50       |
| Gender     | Female   |
| Mock Risk  | moderate |

## Steps
1. Confirm the mock ECG with `risk=moderate` is visible in the ECG dashboard list.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Open the unprocessed ECG by clicking its entry in the dashboard list.
4. Fill in Patient ID (`PAT00102`), Age (`50`), and Gender (`Female`).
5. Save the patient data.
6. Confirm the "Get Risk Assessment" button is enabled.
7. Click the "Get Risk Assessment" button.
8. Wait for the loading/processing indicator to complete.
9. Observe the risk result label and color indicator displayed on screen.
10. Note the exact text and color of the risk label.

## Expected Result
- The risk assessment result displays a **"Moderate"** risk label (or "Moderate Risk").
- The color indicator is **amber or yellow** (a caution/warning color tone).
- The risk score (0.0–1.0) is displayed alongside the label and falls in the expected moderate-risk numeric range.
- No error messages or failure banners are shown.
- The ECG entry in the dashboard list updates to show a processed/completed status.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Moderate risk is the default seed value used in most preconditions (PC_003, PC_005, PC_007). This test is therefore high-frequency and should be reliable.
- Amber vs. yellow vs. orange — document the exact color rendered. Accessibility requirement: the color must have sufficient contrast for clinicians with color vision deficiency (WCAG 1.4.1 — use of color alone must not be the only differentiator).
- Risk score for moderate should fall in approximately the `0.33–0.66` range if a numeric band is used.
