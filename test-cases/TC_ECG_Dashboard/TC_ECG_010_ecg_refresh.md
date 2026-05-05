---
id: TC_ECG_010
module: ECG Dashboard
title: Pull-to-refresh / page reload causes newly seeded ECG to appear in the list
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
After a new ECG is seeded via the mock API, a manual page refresh (F5 / Ctrl+R) or an in-app pull-to-refresh gesture must bring the new record into view. This test complements TC_ECG_003 (real-time appearance) by validating that the fallback manual refresh mechanism is also reliable — critical in environments where WebSocket/polling may be blocked or delayed.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record exists in the list (baseline) | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Field | Value |
|-------|-------|
| Mock ingest URL | https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample |
| Mock ingest token | `mock-ingest-s3cr3t` |
| Omron Connect ID | `86f66e18-494a-4232-8f76-530276b38d3c` |
| Risk | `moderate` |
| Curl command | `curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" -H "x-mock-token: mock-ingest-s3cr3t" -H "content-type: application/json" -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'` |

## Steps

### Sub-scenario A — Hard browser refresh (F5 / Ctrl+R)
1. Open the ECG Dashboard and note the current ECG count (N).
2. Note the `id` / acquisition time of the top card.
3. From a terminal, execute the mock ingest curl command and confirm HTTP 200/201.
4. **Before** the new ECG appears automatically (within 30s), immediately press **F5** (or Ctrl+R) to hard-reload the page.
5. Log in again if the session was cleared by the reload.
6. Confirm the newly seeded ECG now appears in the list (count = N+1).
7. Confirm the new ECG is at position 1 (most recent first).
8. Confirm no duplicate records appear.

### Sub-scenario B — Soft in-app refresh (if available)
1. Identify whether the app has a dedicated **Refresh** button or a pull-to-refresh gesture on the list.
2. Seed a new ECG as above (step 3).
3. Trigger the in-app refresh (click Refresh button or pull down on the list on touch-enabled device).
4. Confirm the new ECG appears without a full page reload.
5. Confirm the user's scroll position and app state (e.g., any open filters) are preserved after the in-app refresh.

### Sub-scenario C — Refresh without new data
1. Open the dashboard with the current list loaded.
2. Do **not** seed any new ECG.
3. Trigger a page refresh.
4. Confirm the list reloads correctly and shows the same records as before.
5. Confirm no duplicate records appear and no records disappear.

### Sub-scenario D — Refresh mid-pagination
1. Navigate to page 2 of the ECG list.
2. Seed a new ECG from a terminal.
3. Trigger a page refresh (F5).
4. Confirm the user is returned to page 1 (or the beginning of the list) after the refresh.
5. Confirm the newly seeded ECG is visible at the top of page 1.

### Sub-scenario E — Offline then back online
1. Open the ECG Dashboard normally.
2. Disable the network in DevTools (Network → Throttle → Offline).
3. Trigger a refresh.
4. Confirm the app shows an appropriate error state or cached data — it must **not** crash or show a blank white screen.
5. Re-enable the network.
6. Confirm the app recovers and loads the list correctly (with or without a manual retry).

## Expected Result

- Sub-scenario A: New ECG appears at top of list after hard refresh; count increases by 1.
- Sub-scenario B: In-app refresh loads new ECG without full reload; app state preserved.
- Sub-scenario C: Refresh without new data results in identical list — no phantoms or missing records.
- Sub-scenario D: After refresh from page 2, user is on page 1 and new ECG is visible at top.
- Sub-scenario E: App handles offline gracefully with an informative error state; recovers on reconnect.
- No console errors in any sub-scenario.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the app does not have an in-app refresh control, document this as a UX gap — users in clinical settings benefit from an explicit refresh action.
- Sub-scenario E tests a realistic ward environment where Wi-Fi drops momentarily.
- Compare refresh behaviour across Chrome, Firefox, and Safari (if supported) — caching policies differ by browser.
