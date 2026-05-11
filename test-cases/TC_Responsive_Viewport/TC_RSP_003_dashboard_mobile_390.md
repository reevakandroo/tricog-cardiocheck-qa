---
id: TC_RSP_003
module: Responsive Viewport
title: Dashboard ECG list is visible and usable at 390px viewport
type: Positive
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that after login on a 390px mobile viewport, the dashboard ECG list is fully visible. ECG entries must be readable and tappable. No key content should be hidden behind horizontal overflow or clipped by viewport edges.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials for reeva.kandroo@tricog.com are available

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 390px |
| Viewport Height | 844px |
| Device Reference | iPhone 12 Pro |
| Test Account | reeva.kandroo@tricog.com |

## Steps
1. Set the browser viewport to 390x844.
2. Navigate to the CardioCheck login page and log in with valid credentials.
3. Wait for the dashboard to fully load.
4. Confirm the ECG list is visible on screen without horizontal scrolling.
5. Verify each ECG list item shows key fields (e.g., patient name or ID, date, status) without truncation that would hide critical info.
6. Tap or click one ECG entry and confirm the detail view loads.
7. Navigate back to the dashboard — confirm the list reloads without errors.
8. Verify no horizontal scrollbar appears at any point.

## Expected Result
- Dashboard loads and displays the ECG list at 390px.
- ECG list items are visible and at minimum show a patient identifier, date, and status.
- Tapping an ECG entry navigates to the detail view without error.
- No horizontal overflow or scrollbar.
- Back navigation returns to the dashboard list.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is the primary clinical workflow screen — failures here are High severity.
- If column headers are present, verify they do not collapse in a way that makes rows ambiguous.
- Capture a screenshot of the ECG list at 390px.
