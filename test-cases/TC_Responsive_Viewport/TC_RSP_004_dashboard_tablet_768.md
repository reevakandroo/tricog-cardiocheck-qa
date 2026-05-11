---
id: TC_RSP_004
module: Responsive Viewport
title: Dashboard renders correctly at tablet viewport (768x1024)
type: Positive
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that the CardioCheck dashboard renders correctly at 768x1024 (tablet). At this width, the layout may shift to a wider grid or table view. All ECG list columns should be visible without horizontal scrolling.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open at the CardioCheck base URL
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Viewport Width | 768px |
| Viewport Height | 1024px |
| Device Reference | iPad (standard) |
| Test Account | reeva.kandroo@tricog.com |

## Steps
1. Set the browser viewport to 768x1024.
2. Navigate to the login page and authenticate with valid credentials.
3. Wait for the dashboard to load completely.
4. Inspect the ECG list — confirm all columns are visible within the 768px viewport.
5. Verify navigation elements (menu, header) are visible and functional.
6. Click on one ECG entry and confirm the detail view opens correctly.
7. Return to the dashboard and confirm no layout breakage.
8. Check for absence of horizontal scrollbar.

## Expected Result
- Dashboard loads and the ECG list is fully visible at 768px.
- All expected table columns or list fields are visible without horizontal scrolling.
- Navigation elements are fully visible and functional.
- No horizontal overflow.
- Transitioning to ECG detail and back works without layout errors.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- At 768px some apps switch from card layout to table layout — document which layout is used.
- Compare with TC_RSP_003 (390px) to confirm breakpoint behavior.
- Capture a full screenshot of the dashboard.
