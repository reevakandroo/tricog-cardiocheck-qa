---
id: TC_SRC_004
module: Search Bar
title: Clearing the search bar restores the full ECG list
type: Edge
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
After the operator types a search query and receives filtered results, clearing the search bar (via backspace, the clear ✕ button, or selecting-all + delete) must restore the complete, unfiltered ECG list. Failure to restore the full list would leave the operator unable to see all ECGs without a full page reload, impacting clinical workflow.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record exists in the list | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Field | Value |
|-------|-------|
| Initial search input | Any valid or invalid patient ID (e.g., `ABC123`) |
| Clear action | Backspace all characters, or click the ✕ / clear button |
| Expected API call after clear | `GET /v1/ecgs?skip=0&perPage=10` (no `patientId` parameter) |

## Steps

### Sub-scenario A — Clear by backspace
1. Open the ECG Dashboard and note the total number of ECG cards visible (baseline count = N).
2. Type a valid or invalid patient ID in the search bar (e.g., `ABC123`).
3. Wait for filtered results to load.
4. Place the cursor at the end of the search input.
5. Press **Backspace** repeatedly until the input is completely empty.
6. Open DevTools → Network tab and confirm a new request fires: `GET /v1/ecgs?skip=0&perPage=10` (no `patientId` query param).
7. Confirm the full ECG list is restored — card count returns to N (or reflects any new ECGs added since the initial load).
8. Confirm no ghost / stale filtered results remain.

### Sub-scenario B — Clear via ✕ button (if present)
1. Type any search query in the search bar.
2. Wait for filtered results.
3. Click the clear (✕) button inside the search bar.
4. Confirm the input is emptied and the full list is restored.
5. Confirm the ✕ button disappears (or is disabled) after the field is cleared.

### Sub-scenario C — Select-all + Delete
1. Type a search query.
2. Press **Ctrl+A** to select all text in the search bar, then press **Delete**.
3. Confirm the input is cleared and the full list is restored.

### Sub-scenario D — Clear from no-results state
1. Type a non-existent patient ID so the empty-state ("No results") is shown.
2. Clear the search bar using any method above.
3. Confirm the full ECG list is restored — the empty state must not persist.

### Sub-scenario E — Pagination state after clear
1. Navigate to page 2 of the ECG list.
2. Type a search query (results will reset to page 1).
3. Clear the search bar.
4. Confirm the user is returned to **page 1** of the unfiltered list (or wherever the default view should be).

## Expected Result

- Clearing the search bar fires `GET /v1/ecgs?skip=0&perPage=10` with no `patientId` parameter.
- The full unfiltered ECG list is rendered after clearing.
- No stale filtered results remain.
- Works consistently across all three clear methods (backspace, ✕ button, select+delete).
- From an empty-results state, clearing restores the full list (not another empty state).
- Pagination resets to page 1 after clearing.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If clearing the search triggers multiple redundant API calls (one per backspace character), check whether debouncing is implemented — excessive calls could cause backend rate limiting.
- UX check: the ✕ clear button should only be visible when there is text in the search bar. If it appears when the bar is empty, flag as Low severity UX issue.
- Cross-test with TC_SRC_009 (whitespace-only search) — entering only spaces and then "clearing" by deleting them should behave the same as this test.
