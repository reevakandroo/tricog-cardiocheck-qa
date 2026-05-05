---
id: TC_NET_005
module: Network
title: Load More ECGs While Offline — Graceful Error on Pagination
type: Negative
severity: Medium
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user is on the ECG dashboard with a list already loaded. The network is then disabled. When the user scrolls to the bottom of the list or triggers pagination to load more records, the app must handle the failure gracefully — showing an error or empty state without crashing, and without clearing the already-loaded records.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and the ECG dashboard is fully loaded with at least one page of records visible

## Test Data
| Field             | Value                          |
|-------------------|-------------------------------|
| Network condition | Offline (DevTools throttling)  |
| Trigger           | Scroll to bottom / "Load more" |

## Steps

### Phase 1 — Confirm Loaded State
1. Confirm the ECG dashboard at `/ecgs` is fully loaded with at least a few ECG records visible
2. Note the number of records currently displayed on screen (for reference after going offline)

### Phase 2 — Go Offline
3. Open DevTools → **Network** tab
4. Set throttling to **Offline**
5. Confirm the offline state (the offline banner from TC_NET_001 may appear)

### Phase 3 — Trigger Load More
6. Scroll to the **bottom** of the ECG list to trigger pagination (infinite scroll) or locate and click a **"Load More"** or **"Next Page"** button if one exists
7. Wait up to 10 seconds for the app to respond

### Phase 4 — Observe the Error Handling
8. Observe what happens when the pagination/load-more request fails due to offline state:
   - Is an error message shown (e.g., "Failed to load more records", "No internet connection")?
   - Do the previously loaded ECG records remain visible?
   - Does the app crash or show a blank screen?
9. Check the DevTools Console for any unhandled JavaScript errors

## Expected Result
- When load-more fails due to offline state, the app displays a **graceful error** (snackbar, inline message, or retry prompt) — not a crash or blank screen
- The ECG records that were **already loaded** remain visible on screen — they are not cleared by the failed request
- The error message is user-friendly, not a raw HTTP error code
- A retry mechanism (button or auto-retry on connectivity restore) is available
- No unhandled exceptions are thrown in the browser console

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- This test verifies that already-cached/rendered data is not wiped by a failed API call — a common Flutter state management bug where an error state replaces the existing list state instead of appending to it.
- If the entire ECG list disappears when the load-more fails, log as a **High** defect — loss of already-displayed clinical data disrupts the workflow and may force a full page reload.
- After restoring network (set throttling back to No Throttling), verify that load-more works again without a full page reload.
- The behavior of the offline banner alongside a load-more error should be consistent — both should be visible if the user is already on the ECG list when going offline.
