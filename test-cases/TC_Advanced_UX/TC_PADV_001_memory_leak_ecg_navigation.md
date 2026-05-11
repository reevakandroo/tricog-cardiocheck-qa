---
id: TC_PADV_001
module: Advanced UX
title: Heap memory does not grow more than 50MB after navigating through 5 ECG records
type: Positive
severity: Medium
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
Verify that navigating through 5 different ECG records in sequence does not cause the JavaScript heap memory to grow by more than 50MB compared to the baseline. Excessive heap growth indicates a memory leak — typically from event listeners, observers, or component state not being cleaned up on navigation.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open
- [PC_002](../preconditions/PC_002_valid_credentials.md) - Valid credentials available
- [PC_003](../preconditions/PC_003_ecg_available.md) - At least 5 different ECG records are available

## Test Data
| Field | Value |
|-------|-------|
| Test Account | reeva.kandroo@tricog.com |
| ECG Count | 5 distinct ECG records |
| Memory Threshold | Heap growth <= 50MB |
| Tool | Chrome DevTools Memory tab or `performance.memory` API |

## Steps
1. Log in and navigate to the dashboard.
2. Open Chrome DevTools → Memory tab → take a baseline heap snapshot (Snapshot #1).
3. Record the baseline heap size in MB.
4. Open ECG Record #1 — wait for full load.
5. Navigate back to the dashboard. Open ECG Record #2. Navigate back.
6. Repeat for ECG Records #3, #4, and #5.
7. After completing all 5 navigations, take a second heap snapshot (Snapshot #2).
8. Compare heap sizes — confirm growth is under 50MB.

## Expected Result
- Heap size growth between Snapshot #1 and Snapshot #2 is <= 50MB.
- No continuously growing heap trend observable across all 5 navigations.
- No `OutOfMemory` or performance degradation warnings in the browser.
- The app remains responsive after all 5 navigations.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter web apps render to canvas — memory leaks may also manifest as growing GPU memory, not just JS heap.
- Use `performance.memory.usedJSHeapSize` before and after in the browser console for a quick programmatic check.
- If growth exceeds 50MB, use the Memory tab's object retainer tree to identify the leak source.
- A persistent >50MB growth is Medium severity; >200MB growth is High.
