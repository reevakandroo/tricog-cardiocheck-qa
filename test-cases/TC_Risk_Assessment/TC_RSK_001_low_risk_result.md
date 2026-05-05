---
id: TC_RSK_001
module: Risk Assessment
title: Low Risk Result — mock risk=low → green color, "Low" label displayed
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
A clinician seeds a mock ECG with `risk=low`, enters valid patient data, triggers the risk assessment, and verifies the result displays the "Low" risk label with a green color indicator.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been generated with `risk=low` via:
  ```bash
  curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
    -H "x-mock-token: mock-ingest-s3cr3t" \
    -H "content-type: application/json" \
    -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"low"}'
  ```

## Test Data
| Field      | Value    |
|------------|----------|
| Patient ID | PAT00101 |
| Age        | 45       |
| Gender     | Male     |
| Mock Risk  | low      |

## Steps
1. Confirm the mock ECG with `risk=low` is visible in the ECG dashboard list.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Open the unprocessed ECG by clicking its entry in the dashboard list.
4. Fill in Patient ID (`PAT00101`), Age (`45`), and Gender (`Male`).
5. Save the patient data.
6. Confirm the "Get Risk Assessment" button (`flt-semantics[role="button"]:has-text("Get Risk Assessment")`) is enabled.
7. Click the "Get Risk Assessment" button.
8. Wait for the loading/processing indicator to complete.
9. Observe the risk result label and color indicator displayed on screen.
10. Note the exact text and color of the risk label.

## Expected Result
- The risk assessment result displays a **"Low"** risk label (or "Low Risk").
- The color indicator is **green** (or a clearly "safe/good" color like teal/green).
- The risk score (0.0–1.0) is displayed alongside the label and falls in the expected low-risk numeric range.
- No error messages or "failed to assess" banners are shown.
- The ECG entry in the dashboard list updates to show a processed/completed status.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The mock API determines the risk outcome (`risk=low`). The CardioCheck app should read and display this result from the processed ECG response.
- Color coding is a critical UX feature for clinicians making quick triage decisions. Document the exact hex color or CSS class if inspectable.
- Verify the risk score shown is in the `0.0–0.33` range (approximate low-risk band) if a numeric score is displayed.
