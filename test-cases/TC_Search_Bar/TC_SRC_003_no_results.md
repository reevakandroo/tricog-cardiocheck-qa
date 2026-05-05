---
id: TC_SRC_003
module: Search Bar
title: Searching a non-existent patient ID shows "No results" empty state
type: Negative
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
When an operator searches for a patient ID that does not exist in the system, the dashboard must display a clear "no results" empty state. The UI must never show a broken layout, a spinner stuck indefinitely, or results from a different patient. This prevents misdiagnosis or confusion from silent search failures.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Field | Value |
|-------|-------|
| Non-existent patient ID (numeric) | `9999999999` |
| Non-existent patient ID (alpha) | `ZZZNOMATCH` |
| Non-existent patient ID (mixed) | `XYZ-000-NONEXISTENT` |
| Expected API response | HTTP 200 with `data: []` and `total: 0` |

## Steps

1. Open the ECG Dashboard and confirm the full ECG list is visible.
2. Click the search bar and type a patient ID that is **guaranteed not to exist**: `ZZZNOMATCH`.
3. Wait for the search to execute (debounce / Enter).
4. Open DevTools → Network tab and verify:
   - Request: `GET /v1/ecgs?skip=0&perPage=10&patientId=ZZZNOMATCH`
   - Response: HTTP 200 with `data: []`, `total: 0`.
5. Observe the UI in the main content area.
6. Confirm an empty-state UI is rendered — must include at minimum a message such as "No results found", "No ECGs match your search", or similar.
7. Confirm the following are **absent**:
   - Any ECG cards from other patients.
   - An infinite loading spinner.
   - A raw `null`, `undefined`, or `[]` string rendered in the UI.
   - A JavaScript error or white screen.
8. Repeat steps 2–7 using:
   - `9999999999` (numeric string)
   - `XYZ-000-NONEXISTENT` (long mixed string)

### Sub-scenario — No results followed by valid search
1. Type `ZZZNOMATCH` → confirm empty state.
2. Clear the search bar and type a valid patient ID.
3. Confirm the list switches from empty state back to showing the correct matching records.
4. Confirm no stale "no results" UI lingers after valid results are loaded.

## Expected Result

- API returns HTTP 200 with empty `data` array.
- A non-empty, descriptive "no results" empty-state is displayed.
- No ECG cards from unrelated patients are shown.
- No spinner stuck indefinitely.
- No JavaScript console errors.
- Subsequent valid search after a no-results state renders correct results without requiring a full page reload.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Showing results from a different patient when none match the query is a Critical data integrity and HIPAA violation — flag immediately if observed.
- The empty-state message should be actionable where possible (e.g., "No ECGs found for 'ZZZNOMATCH'. Check the patient ID and try again.").
- Confirm the API does **not** return HTTP 404 for an empty patient search — 404 is for missing resources, not empty result sets. HTTP 200 with empty array is correct.
