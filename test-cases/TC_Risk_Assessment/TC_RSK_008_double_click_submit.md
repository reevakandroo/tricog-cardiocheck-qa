---
id: TC_RSK_008
module: Risk Assessment
title: Double-Click "Get Risk Assessment" — should not submit twice
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_005]
---

## Scenario
A clinician double-clicks the "Get Risk Assessment" button (e.g., due to impatience or a slow response). The system must prevent duplicate submissions — only one risk assessment request should be sent, and the result should be consistent.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) — Browser is open and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) — User is logged in and on the ECG dashboard with Flutter accessibility enabled
- [PC_005](../preconditions/PC_005_risk_assessment_complete.md) — Patient data has been saved and the ECG is in a state where "Get Risk Assessment" is enabled

> **Note for this test:** Use a fresh unprocessed ECG (not already assessed) — the button must be in the enabled state at the point of double-clicking. Seed a new ECG via PC_007 if needed and complete patient data via TC_PAT_001.

## Test Data
| Field      | Value    |
|------------|----------|
| Patient ID | PAT00108 |
| Age        | 45       |
| Gender     | Male     |
| Mock Risk  | moderate |

## Steps
1. Ensure patient data is saved and "Get Risk Assessment" button is **enabled**.
2. Click the `flt-semantics-placeholder` to activate Flutter accessibility.
3. Open the browser Network tab to monitor outgoing API requests.
4. **Double-click** the "Get Risk Assessment" button (`flt-semantics[role="button"]:has-text("Get Risk Assessment")`) in rapid succession.
5. Observe the Network tab — count how many risk assessment API requests were sent.
6. Wait for the processing to complete.
7. Observe the resulting risk display — is it consistent, or are there duplicate/conflicting results?
8. Check whether the button was disabled immediately after the first click (preventing the second click from registering as another submission).

## Expected Result
- **Only one** risk assessment API request is sent, regardless of how many times the button is clicked.
- After the first click, the button is immediately disabled (or shows a loading state) to prevent subsequent clicks from triggering duplicate requests.
- A single, consistent risk result is displayed.
- No duplicate results, data inconsistency, or error due to concurrent requests.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Double-submission is a classic "outside the box" test. In Flutter Web, the button should be disabled in the `onPressed` handler immediately upon first tap to prevent repeat calls.
- If two requests do fire: check whether the backend handles idempotency (same ECG ID processed twice should return the same result, not create two records).
- In Playwright, simulate rapid double-click using: `await page.locator('...').dblclick()` or two rapid `click()` calls with minimal delay.
- Data integrity risk: if two risk records are created for the same ECG, the UI may show an inconsistent state or the audit log may show duplicate assessments.
