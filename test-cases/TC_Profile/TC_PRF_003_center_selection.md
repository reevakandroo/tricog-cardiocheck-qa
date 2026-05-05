---
id: TC_PRF_003
module: Profile
title: Center Selection — Selecting a Different Center Updates the ECG List
type: Positive
severity: High
preconditions: [PC_001, PC_002, PC_010]
---

## Scenario
A user with access to multiple diagnostic centers navigates to the center selection screen at `/profile/center-selection`, selects a different center from the one currently active, and confirms that the ECG dashboard list updates to show records scoped to the newly selected center.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard
- [PC_010](../preconditions/PC_010_multi_center_access.md) - The logged-in account has access to at least two diagnostic centers

## Test Data
| Field                | Value                          |
|----------------------|-------------------------------|
| Email                | reeva.kandroo+8@tricog.com    |
| Route                | /profile/center-selection      |
| Required centers     | At least 2 assigned to account |

## Steps

### Phase 1 — Record Current Center State
1. From the ECG dashboard, note the name of the **currently active center** displayed in the app header or profile area
2. Note the ECG records currently visible in the list (count and/or first few record IDs if visible)

### Phase 2 — Navigate to Center Selection
3. Navigate to `/profile` or click the profile icon in the navigation
4. Click `flt-semantics-placeholder` to re-activate the Flutter accessibility tree
5. Locate and click the **Center Selection** menu item (routes to `/profile/center-selection`)
6. Wait for the center selection screen to load

### Phase 3 — Select a Different Center
7. Click `flt-semantics-placeholder` again after route change
8. Observe the list of available centers — confirm at least two are shown
9. Click a center that is **different** from the currently active one
10. Confirm any selection dialog or confirmation prompt (if present) by clicking confirm/save

### Phase 4 — Verify ECG List Update
11. Navigate back to the ECG dashboard (via back navigation or the main nav icon)
12. Click `flt-semantics-placeholder` to re-activate accessibility
13. Observe the ECG list and the active center label in the header

## Expected Result
- The center selection screen at `/profile/center-selection` displays all centers the user has access to
- After selecting the new center, the app updates the active center context
- The ECG dashboard shows records scoped **only** to the newly selected center — the previous center's records are no longer visible
- The active center name displayed in the app header/navigation reflects the newly selected center
- No error banners or loading failures occur during the switch
- The center selection persists if the user refreshes the page or re-navigates to the dashboard

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Center selection state is stored in secure storage (Flutter FlutterSecureStorage). Verify that the stored value is updated after selection by checking DevTools → Application → Storage.
- If the ECG list does not change after center switch, check the Network tab for whether a new `GET /ecgs` or equivalent request was made with the updated center context (JWT claim or query param).
- Data isolation check: after switching centers, ECGs from the previous center must not appear in the list. Any leakage is a **High** security and HIPAA defect.
- This test is a prerequisite for TC_MCT_001 (multi-center switch) and TC_MCT_003 (ECG isolation).
