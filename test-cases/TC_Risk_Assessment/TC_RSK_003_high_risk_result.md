---
id: TC_RSK_003
module: Risk Assessment
title: High Risk Result — mock risk=high → red color, "High" label displayed
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician seeds a mock ECG with `risk=high`, enters valid patient data, triggers the risk assessment, and verifies the result displays the "High" risk label with a red color indicator. This is a safety-critical scenario — the system must clearly and unambiguously communicate high cardiac risk.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated with `risk=high` via:
  ```bash
  curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
    -H "x-mock-token: mock-ingest-s3cr3t" \
    -H "content-type: application/json" \
    -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"high"}'
  ```

## Test Data
| Field      | Value    |
|------------|----------|
| Patient ID | PAT00103 |
| Age        | 65       |
| Gender     | Male     |
| Mock Risk  | high     |

## Steps
1. Confirm the mock ECG with `risk=high` is visible in the ECG dashboard list.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Open the unprocessed ECG by clicking its entry in the dashboard list.
4. Fill in Patient ID (`PAT00103`), Age (`65`), and Gender (`Male`).
5. Save the patient data.
6. Confirm the "Get Risk Assessment" button is enabled.
7. Click the "Get Risk Assessment" button.
8. Wait for the loading/processing indicator to complete.
9. Observe the risk result label, color indicator, and any additional warnings or clinical guidance displayed.
10. Note the exact text, color, and any supplementary messages on screen.

## Expected Result
- The risk assessment result displays a **"High"** risk label (or "High Risk").
- The color indicator is **red** (a danger/alert color).
- The risk score (0.0–1.0) is displayed alongside the label and falls in the expected high-risk numeric range (approximately 0.66–1.0).
- Any additional clinical guidance or urgent action recommendation is displayed (if the app supports it).
- No error messages or failure banners are shown.
- The ECG entry in the dashboard list updates to show a processed/completed status.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Severity is Critical**: misrepresenting a High risk result as Moderate or Low would be a patient safety failure with potential life-threatening consequences.
- WCAG 1.4.1 applies: the "High" label text must be present alongside the color — red alone cannot be the sole indicator.
- Also verify the exported PDF for a high-risk result prominently displays the risk level (see TC_RPT_006).
- Risk score for high should fall in approximately `0.66–1.0` if a numeric score is displayed.
