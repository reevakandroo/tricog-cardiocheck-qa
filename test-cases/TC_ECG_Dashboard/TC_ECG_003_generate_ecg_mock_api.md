---
id: TC_ECG_003
module: ECG Dashboard
title: Seed mock ECG via API and verify it appears in the list within 30 seconds
type: Positive
severity: Critical
preconditions: [PC_001, PC_002]
---

## Scenario
A mock ECG is ingested through the Omron mock ingest endpoint. The dashboard must reflect the new record without requiring a hard page reload — either via real-time push (WebSocket / SSE) or a timed polling mechanism. This validates the end-to-end ingest pipeline: mock device → backend → dashboard UI.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Field | Value |
|-------|-------|
| Mock ingest URL | https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample |
| Mock ingest token | `mock-ingest-s3cr3t` |
| Omron Connect ID | `86f66e18-494a-4232-8f76-530276b38d3c` |
| Risk category seeded | `moderate` |
| Max appearance time | 30 seconds from POST response |
| curl command | `curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" -H "x-mock-token: mock-ingest-s3cr3t" -H "content-type: application/json" -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'` |

## Steps

1. Open the ECG Dashboard and note the current count of ECG records visible.
2. Open DevTools → Network tab. Filter by `ecgs` to watch for polling or push calls.
3. From a terminal (or DevTools Console), execute the mock ingest curl command:
   ```bash
   curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" \
     -H "x-mock-token: mock-ingest-s3cr3t" \
     -H "content-type: application/json" \
     -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'
   ```
4. Record the exact timestamp of the POST response (T₀).
5. Watch the dashboard without performing any manual refresh.
6. Verify the new ECG card appears in the list within **30 seconds** of T₀.
7. Confirm the new card displays:
   - The correct risk category badge: **Moderate** (amber).
   - A "New ECG" badge or unprocessed indicator (see TC_ECG_006).
   - A valid `deviceAcquisitionTime`.
8. Confirm the new ECG appears at the **top** of the list (most recent first — see TC_ECG_008).
9. Open DevTools → Console and confirm no errors were thrown during the update.
10. Verify the mock ingest endpoint itself does **not** accept requests without the `x-mock-token` header (test by removing the header — expect HTTP 401 or 403).

## Expected Result

- The curl POST returns HTTP 200/201 with a success response body.
- The new ECG card appears in the dashboard within 30 seconds, **without** a manual page reload.
- The card shows risk category `Moderate` with the correct amber colour.
- The record is positioned at the top of the list (sorted by `deviceAcquisitionTime` descending).
- No console errors or UI glitches occur during the live update.
- HIPAA: Ingest endpoint enforces token-based authentication; unauthenticated POST is rejected.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the dashboard uses polling, identify the poll interval from the Network tab. If polling > 30s, this test will fail by design — log as a defect.
- Run this test multiple times (at least 3) to rule out flakiness in the real-time pipeline.
- Record the exact elapsed time (T₀ → card appears) for performance benchmarking.
- Security check: confirm the `x-mock-token` is **not** the same credential used in production. If it is, flag as Critical.
