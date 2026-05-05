---
id: TC_NET_002
module: Network
title: Online Recovery — App Resumes Normally After Reconnecting
type: Positive
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user's network is disabled (showing an offline banner per TC_NET_001), then restored. The app must detect the reconnection, dismiss or hide the offline banner, and resume normal operation — loading data and accepting interactions — without requiring a manual page refresh.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard

## Test Data
| Field               | Value                          |
|---------------------|-------------------------------|
| Offline method      | DevTools → Network → Offline   |
| Recovery action     | DevTools → Network → No throttling (restore) |
| Offline duration    | ~15 seconds                    |

## Steps

### Phase 1 — Go Offline
1. Confirm the ECG dashboard is fully loaded at `/ecgs`
2. Open DevTools → **Network** tab
3. Set throttling to **Offline**
4. Wait for the app's offline banner/indicator to appear (confirm TC_NET_001 behavior)

### Phase 2 — Restore Network
5. In DevTools Network throttling, change the setting from **Offline** back to **No throttling** (or the default "Online" option)
6. Wait up to 15 seconds for the app to detect connectivity restoration

### Phase 3 — Verify Recovery
7. Observe the offline banner — it should disappear or update to an "online" confirmation message
8. Attempt a normal app action: scroll the ECG list, or click on an ECG record to open its detail view
9. Verify the action completes without error
10. If the ECG list was showing stale/cached data while offline, verify it refreshes or provides a mechanism to reload
11. Check the DevTools Network tab to confirm new API requests are being made successfully (HTTP 200 responses)

## Expected Result
- Within a reasonable time (≤ 10 seconds) of network restoration, the offline banner dismisses automatically — **no manual page refresh required**
- The app resumes normal API communication; ECG list data loads or refreshes
- Clicking on ECG records or navigating within the app works without error
- No stale error states (e.g., a "failed to load" message that persists even after connectivity is restored)
- If an auto-retry mechanism exists, it fires within a reasonable delay after connectivity is detected

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Auto-recovery without a page reload is a **UX requirement** in a clinical workflow setting. Staff should not need to know to manually refresh a web page after a brief connectivity interruption.
- Verify the Flutter connectivity plugin fires an `onConnectivityChanged` event on the browser platform. Some packages that work on Android/iOS do not fire events on Flutter Web and may require a polling fallback.
- If the app requires a manual refresh to recover, log as a **Medium** defect (poor UX) rather than Critical, as data integrity is not compromised.
- If the auth token expires during the offline window (unlikely in ≤15 seconds but possible if offline for longer), verify the app handles silent token refresh upon reconnection rather than forcing a re-login.
