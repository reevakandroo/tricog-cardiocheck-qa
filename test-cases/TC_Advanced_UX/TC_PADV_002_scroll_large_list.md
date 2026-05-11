---
id: TC_PADV_002
module: Advanced UX
title: Scrolling through 10+ ECG records is smooth and completes in under 10 seconds
type: Positive
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
Verify that scrolling through a dashboard list of 10 or more ECG records is smooth and responsive. The scroll operation — from the top to the bottom of the list — should complete in under 10 seconds with no visible jank, dropped frames, or long pauses. This validates rendering performance for typical clinical workloads.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| ECG List Size | 10+ records |
| Performance Threshold | Full scroll from top to bottom <= 10 seconds |
| Tool | Chrome DevTools Performance tab |

## Steps
1. Log in and navigate to the dashboard.
2. Confirm at least 10 ECG records are visible in the list.
3. Open Chrome DevTools → Performance tab → start recording.
4. Scroll from the top of the ECG list to the bottom slowly but continuously.
5. Stop the recording.
6. Analyze the performance recording — check for long tasks (> 50ms), dropped frames, or jank spikes.
7. Visually observe the scroll for any visible stutter or freezing.
8. Record the total time from scroll start to scroll end.

## Expected Result
- Scrolling through 10+ ECGs completes smoothly in under 10 seconds.
- No visible stutter or frame drops during the scroll.
- No long tasks > 200ms in the performance profile.
- All ECG list items render correctly as they scroll into view.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the list uses virtualization (only rendering visible items), performance should be excellent even with 100+ records.
- If all items are rendered in the DOM at once, a large list may cause performance issues — document this.
- A scroll that takes > 10 seconds or produces visible jank is a Medium UX issue.
