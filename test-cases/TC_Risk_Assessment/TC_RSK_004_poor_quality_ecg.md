---
id: TC_RSK_004
module: Risk Assessment
title: Poor Quality ECG — POOR_QUALITY_ECG error code → error state shown, not a risk score
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_004, PC_007]
---

## Scenario
The ECG data received by the system contains a `POOR_QUALITY_ECG` error code, indicating that the signal quality is insufficient for reliable risk analysis. The system must display an appropriate error state rather than a risk score or a misleading result.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_004](../preconditions/PC_004_ecg_detail_open.md) — An ECG detail / patient data form is open for an unprocessed ECG
- [PC_007](../preconditions/PC_007_mock_ecg_seeded.md) — A mock ECG has been seeded. Coordinate with the backend/mock team to inject a `POOR_QUALITY_ECG` error in the ECG processing result, OR use the mock API with an error payload if supported.

## Test Data
| Field      | Value             |
|------------|-------------------|
| Patient ID | PAT00104          |
| Age        | 55                |
| Gender     | Female            |
| ECG Status | POOR_QUALITY_ECG  |

> **Setup Note:** Confirm the method to seed a POOR_QUALITY_ECG scenario with the development team. Options may include: a dedicated mock endpoint parameter, a specific `omronConnectId` that maps to a poor-quality fixture, or intercepting the ECG processing response via Playwright to inject the error code.

## Steps
1. Seed or configure the ECG record to return `POOR_QUALITY_ECG` during processing.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Open the unprocessed ECG from the dashboard list.
4. Fill in Patient ID (`PAT00104`), Age (`55`), and Gender (`Female`).
5. Save the patient data.
6. Confirm the "Get Risk Assessment" button is enabled.
7. Click the "Get Risk Assessment" button.
8. Wait for the processing indicator to complete.
9. Observe the result area — specifically check whether a risk score/label is displayed or an error state is shown.
10. Note the exact error message or UI state presented to the user.

## Expected Result
- The app displays an **error state** indicating poor ECG quality (e.g., "ECG signal quality is insufficient", "Poor quality ECG detected", or a `POOR_QUALITY_ECG` error message).
- **No risk score or risk label** (Low/Moderate/High) is displayed.
- The error message is clear, actionable, and advises the clinician to retake the ECG.
- The Export PDF button is disabled or produces a report that clearly marks the ECG as unanalyzable (not a blank/corrupt report).
- No silent failure — the app does not show "Low Risk" or any misleading result.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- **Patient safety impact is Critical**: displaying any risk level when the ECG cannot be reliably analyzed could lead to clinical misinterpretation.
- The `POOR_QUALITY_ECG` error code is identified in the source code as a known error state — the app must have a dedicated handling path for it.
- Verify the error message is user-friendly (appropriate for a clinical audience, not a raw error code string like "ERR_POOR_QUALITY_ECG").
- Also check: does the ECG waveform preview in the detail view visually reflect poor quality (e.g., noisy signal) or does it look normal?
