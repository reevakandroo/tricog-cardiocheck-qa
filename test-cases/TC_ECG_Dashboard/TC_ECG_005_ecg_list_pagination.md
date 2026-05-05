---
id: TC_ECG_005
module: ECG Dashboard
title: Load additional ECGs via pagination (scroll or next page)
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_003]
---

## Scenario
The ECG list is paginated server-side (`GET /v1/ecgs?skip=0&perPage=10`). When the user scrolls to the bottom of the list or clicks a "load more" / "next page" control, the next batch of ECGs must be fetched and appended or shown. This test validates correct `skip` offset increments, no duplicate records, and no data skipping between pages.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated with valid credentials | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |
| PC_003 | At least 11 ECG records exist for this center (to have a second page) | [PC_003_ecg_available.md](../preconditions/PC_003_ecg_available.md) |

## Test Data

| Field | Value |
|-------|-------|
| Page size | 10 (default `perPage`) |
| First page request | `GET /v1/ecgs?skip=0&perPage=10` |
| Second page request | `GET /v1/ecgs?skip=10&perPage=10` |
| Third page request | `GET /v1/ecgs?skip=20&perPage=10` |
| Required minimum records | 11 (seed multiple ECGs via TC_ECG_003 if needed) |

## Steps

1. Open the ECG Dashboard and confirm 10 ECG cards are shown (first page).
2. Record the `id` / `patientId` values of all 10 visible cards.
3. Open DevTools → Network tab.
4. Trigger the next page:
   - **If infinite scroll:** scroll to the very bottom of the list.
   - **If explicit pagination control:** click "Next" / "Load More" / page 2 button.
5. Observe the network call and confirm it is `GET /v1/ecgs?skip=10&perPage=10`.
6. Verify the next batch of ECG cards is displayed:
   - **Infinite scroll:** new cards are appended below the existing 10.
   - **Page navigation:** the view shows a new set of up to 10 cards.
7. Confirm **no duplicates** exist between page 1 and page 2 — compare `id` values.
8. Confirm **no records are skipped** — if the backend total is, e.g., 15, pages 1+2 together should contain exactly 15 unique records.
9. If a third page is available (`total > 20`), trigger it and repeat steps 5–8.
10. Navigate to the last page and confirm:
    - The pagination control indicates it is the last page (disabled "Next", no more scroll trigger).
    - No empty placeholders or ghost cards are rendered.
11. Navigate back to page 1 (if paginated) and confirm the first page data is restored correctly.

## Expected Result

- Second-page API call uses `skip=10&perPage=10` — returns HTTP 200.
- New records are displayed without duplicating or omitting any.
- Each page transition completes within 3 seconds under normal network conditions.
- On the last page, the pagination control is clearly disabled or absent.
- No console errors during any page transition.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- If the app uses cursor-based pagination instead of offset, adjust the expected query parameters accordingly and document the actual scheme.
- Test with a slow network (Chrome DevTools → Network throttle "Slow 3G") to ensure loading indicators appear during the fetch.
- Cross-check the `total` field in the API response against the actual number of pages rendered in the UI.
- Concurrent pagination edge case: seed a new ECG while navigating to page 2 — verify the new record appears correctly without shifting existing pages incorrectly.
