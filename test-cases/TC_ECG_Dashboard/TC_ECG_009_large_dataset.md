---
id: TC_ECG_009
module: ECG Dashboard
title: Dashboard loads and scrolls without crash or degradation with 100+ ECGs
type: Scalability
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
Under realistic production volume (100+ ECG records for a center), the dashboard must load within an acceptable time window, pagination must function correctly, and scrolling through the list must not cause memory leaks, UI freezes, or JavaScript errors. This test validates the frontend and backend under moderate data load.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Field | Value |
|-------|-------|
| Target ECG count | 100+ records in the center |
| Page size | 10 per page (default) |
| Expected pages | 10+ pages |
| Seed command (repeat 100×) | `curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" -H "x-mock-token: mock-ingest-s3cr3t" -H "content-type: application/json" -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'` |
| Max acceptable initial load time | 5 seconds |
| Max per-page load time | 3 seconds |

**Seeding script (bash) — seed 100 ECGs in sequence:**
```bash
for i in $(seq 1 100); do
  curl -s -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
    -H "x-mock-token: mock-ingest-s3cr3t" \
    -H "content-type: application/json" \
    -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}' \
    > /dev/null
  echo "Seeded ECG $i"
  sleep 0.5
done
```

## Steps

### Sub-scenario A — Initial load with 100+ records
1. Ensure 100+ ECG records exist for the test center (seed if needed).
2. Open browser DevTools → Performance tab. Start recording.
3. Navigate to the ECG Dashboard (hard reload: Ctrl+Shift+R).
4. Stop the performance recording once the list is visible.
5. Measure time from navigation start to first ECG card rendered (First Contentful Paint + list render).
6. Verify the initial load time is within **5 seconds** on a standard broadband connection.

### Sub-scenario B — Pagination through all 100+ records
1. Starting from page 1, navigate through each page using the pagination control.
2. For each page transition, measure the load time (target: <3 seconds per page).
3. Confirm each page shows exactly 10 cards (or fewer on the last page).
4. Confirm no duplicate or missing records across pages (compare total unique IDs vs. reported `total` from API).

### Sub-scenario C — Scroll performance (infinite scroll mode)
_Only applicable if the app uses infinite scroll instead of paginated controls._
1. Open DevTools → Performance → Memory tab. Note initial heap size.
2. Scroll from the top to the bottom of the entire list, triggering all page loads.
3. After loading all records, check the JS heap size — confirm it has not grown unboundedly (potential memory leak).
4. Scroll back to the top and confirm cards render without visual artifacts.

### Sub-scenario D — Simultaneous list load under concurrent users
1. Open 3 separate browser tabs, all logged into the same account.
2. Navigate all 3 tabs to the ECG Dashboard simultaneously.
3. Confirm all 3 tabs load the list correctly within the 5-second threshold.
4. Confirm no race conditions cause duplicate or missing records in any tab.

### Sub-scenario E — API response time
1. In DevTools → Network, filter for `GET /v1/ecgs` requests.
2. Check the **TTFB (Time To First Byte)** for each paginated request.
3. Flag any request where TTFB exceeds 2 seconds as a performance concern.

## Expected Result

- Initial load with 100+ records: ≤5 seconds.
- Per-page load time: ≤3 seconds.
- No JavaScript errors or stack overflows during extended scrolling/pagination.
- Memory heap growth is bounded — no runaway memory leak after loading all pages.
- All 100+ records are accessible across pages with no duplicates or gaps.
- API TTFB for paginated calls: ≤2 seconds.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the test environment limits ECG count, document the maximum tested and extrapolate projections.
- A real production center may have thousands of ECGs — flag if pagination becomes unreliable beyond 100 records.
- Use Chrome's built-in Lighthouse performance audit for supplementary scoring.
- HIPAA: Verify that bulk record loading does not inadvertently cache PHI in browser storage (localStorage, sessionStorage, IndexedDB).
