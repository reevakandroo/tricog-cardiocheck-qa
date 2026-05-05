---
id: TC_ECG_002
module: ECG Dashboard
title: Empty state shown when no ECGs exist for this center
type: Edge
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
When the authenticated user's center has no ECG records ingested, the dashboard must display a meaningful empty-state UI instead of a blank or broken page. This confirms graceful handling of an empty API response and prevents user confusion.

## Preconditions

| ID | Description | File |
|----|-------------|------|
| PC_001 | Browser is open and app URL is loaded | [PC_001_browser_ready.md](../preconditions/PC_001_browser_ready.md) |
| PC_002 | User is authenticated — **use a fresh center account with zero ECGs** | [PC_002_authenticated_user.md](../preconditions/PC_002_authenticated_user.md) |

## Test Data

| Field | Value |
|-------|-------|
| App URL | https://cardiocheck-releasev140.up.railway.app |
| Condition | Zero ECG records ingested for the test center |
| Backend endpoint | GET /v1/ecgs?skip=0&perPage=10 |
| Expected API response | `{ "data": [], "total": 0 }` (or equivalent empty payload) |

> **Setup note:** If a dedicated empty-center account is unavailable, verify by inspecting the network response — `data` array must be empty. Alternatively, use the staging environment to create a fresh center.

## Steps

1. Log in with a center account that has **zero** ECG records.
2. Navigate to the ECG Dashboard.
3. Observe the main content area.
4. Open DevTools → Network tab and locate the `GET /v1/ecgs` request.
5. Confirm the response body contains an empty `data` array and a `total` of `0`.
6. Return to the UI and verify that an empty-state illustration, message, or call-to-action is rendered in place of a list.
7. Confirm the page does not show:
   - A spinner stuck indefinitely.
   - A raw `[]` or `null` rendered as text.
   - An uncaught JavaScript exception in the console.
   - A broken layout (overflowed elements, misaligned containers).
8. Verify the empty-state message is descriptive — e.g., "No ECG records found" or similar — and is legible across viewport sizes.

## Expected Result

- API returns HTTP 200 with `data: []`.
- Dashboard renders a non-empty, informative empty-state UI (illustration and/or explanatory text).
- No infinite loading spinner.
- No console errors.
- Page layout remains intact with correct spacing and alignment.
- HIPAA: No stale PHI from another center is accidentally surfaced due to a caching bug.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This is particularly important for brand-new customer onboarding — first impressions matter.
- Also test by temporarily filtering to a patient ID that has no ECGs (via search) to trigger the empty state without needing a separate account.
- Cross-check: after seeding a mock ECG (TC_ECG_003), this state should no longer appear for the same account.
