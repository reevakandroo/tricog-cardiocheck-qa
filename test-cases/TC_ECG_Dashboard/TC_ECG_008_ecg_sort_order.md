---
id: TC_ECG_008
module: ECG Dashboard
title: ECG list is sorted by acquisition time descending (most recent first)
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
The ECG list must display records sorted by `deviceAcquisitionTime` in descending order — i.e., the most recently acquired ECG appears at the top. Incorrect sort order could cause operators to miss the latest patient ECGs, directly impacting clinical workflow and patient safety.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least 3 ECG records exist, acquired at distinctly different times | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Field | Value |
|-------|-------|
| Sort field | `deviceAcquisitionTime` |
| Sort direction | Descending (newest first) |
| Minimum records required | 3 with distinct acquisition timestamps |
| Seed command | `curl -X POST "https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample" -H "x-mock-token: mock-ingest-s3cr3t" -H "content-type: application/json" -d '{"omronConnectId":"86f66e18-494a-4232-8f76-530276b38d3c","risk":"moderate"}'` |

## Steps

### Sub-scenario A — Visual sort verification
1. Open the ECG Dashboard with at least 3 ECG records visible.
2. Read the `deviceAcquisitionTime` displayed on each visible card.
3. Confirm the timestamps are in descending order: card 1 is the most recent, card 2 is next, and so on.
4. Open DevTools → Network tab and inspect the `GET /v1/ecgs` response.
5. Verify the `data` array in the API response is also ordered by `deviceAcquisitionTime` descending (or confirm the UI applies sorting client-side consistently).

### Sub-scenario B — New ECG appears at top
1. Note the current top card's `deviceAcquisitionTime` (T_existing).
2. Seed a new mock ECG using the curl command above. Record the time of seeding (T_new > T_existing).
3. Wait for the new ECG to appear in the list.
4. Confirm the new ECG card is now at position 1 (top of the list).
5. Confirm all previously existing cards have shifted down by one position.

### Sub-scenario C — Sort across pages
1. Navigate to page 2 of the ECG list.
2. Verify the timestamps on page 2 are all **older** than the timestamps on page 1.
3. Specifically: the timestamp of the last card on page 1 must be more recent than the timestamp of the first card on page 2.

### Sub-scenario D — Same-second timestamps
1. Seed two mock ECGs within the same second (or artificially set equal `deviceAcquisitionTime` if the test environment allows).
2. Confirm the app handles ties gracefully — e.g., uses `createdAt` as a secondary sort key — and does not crash or produce an indeterminate/random order on each refresh.

## Expected Result

- Cards in the list are always ordered newest → oldest by `deviceAcquisitionTime`.
- Newly seeded ECGs appear at the top of the list.
- Page 2 timestamps are strictly older than page 1 timestamps.
- Ties in `deviceAcquisitionTime` are handled deterministically (stable sort).
- No console errors or layout issues during sort verification.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Sort order is clinically critical: if an operator sees an outdated ECG first, they may process the wrong record.
- If the API does not guarantee sort order, flag as a High severity defect and request the backend to add `ORDER BY deviceAcquisitionTime DESC` to the query.
- Check whether the UI adds a visual sort indicator (e.g., a column header arrow) — absence of this is a UX issue (Low severity).
