---
id: TC_SRC_001
module: Search Bar
title: Search by exact patient ID returns the correct ECG record
type: Positive
severity: Critical
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
The operator enters a full, exact patient ID into the search bar. The dashboard must filter the ECG list and display only the records that match this patient ID. This is the primary workflow for looking up a specific patient's ECG, making it the most critical search path.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least one ECG record with a known patient ID exists in the list | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Field | Value |
|-------|-------|
| Known patient ID | Retrieve from an existing ECG card visible in the unfiltered list |
| Search input selector | `input[aria-label*="Search" i]` or `input[aria-label*="search" i]` |
| Backend query | `GET /v1/ecgs?skip=0&perPage=10&patientId=<exact_value>` |
| Expected result count | ≥ 1 (all ECGs for this patient) |

## Steps

1. Open the ECG Dashboard and confirm the full unfiltered list is visible.
2. Note an existing ECG card and record its exact `patientId` value (e.g., read from the card or from the API response in DevTools).
3. Locate the search bar (use selector `input[aria-label*="Search" i]` if scripting).
4. Click into the search bar and type the **exact, full patient ID** (e.g., `ABC123`).
5. Wait for the search to execute (observe debounce or press Enter if required).
6. Open DevTools → Network tab and verify the request fired is: `GET /v1/ecgs?skip=0&perPage=10&patientId=ABC123` (using the actual patient ID).
7. Confirm the API returns HTTP 200 with one or more records where every `patientId` matches the searched value.
8. Confirm the UI renders only the matching cards — no records with different patient IDs are shown.
9. Verify each displayed card shows the correct `patientId` matching the search term.
10. Confirm the result count indicator (if present) reflects the number of matches.

## Expected Result

- The search bar accepts text input without errors.
- API call includes `patientId=<searched_value>` query parameter.
- API returns HTTP 200 with matching records only.
- UI displays only ECG cards whose `patientId` matches the search input exactly.
- No records from other patients are shown.
- The search completes within 3 seconds of input.
- No console errors during the search.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- The backend endpoint signature is `GET /v1/ecgs?skip=0&perPage=10&patientId=<value>` — confirm the query parameter name is exactly `patientId` (case-sensitive).
- If the app uses a debounce timer (e.g., 300ms), wait for it to expire before checking the network call.
- HIPAA: Confirm the `patientId` in the URL is transmitted only over HTTPS and is not logged in plain-text server access logs.
- If the center has multiple ECGs for the same patient, all should appear — verify the result count matches the backend `total`.
