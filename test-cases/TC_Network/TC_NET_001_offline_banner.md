---
id: TC_NET_001
module: Network
title: Offline Banner — Disabling Network Shows Connectivity Warning
type: Negative
severity: High
preconditions: [PC_001, PC_002]
---

## Scenario
A logged-in user is on the ECG dashboard. The network connection is disabled (simulated via browser DevTools or OS-level). The app must detect the loss of connectivity and display a clear offline/no-network banner or indicator without crashing.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_002](../preconditions/PC_002_authenticated_user.md) - User `reeva.kandroo+8@tricog.com` is logged in and on the ECG dashboard

## Test Data
| Field              | Value                          |
|--------------------|-------------------------------|
| Network condition  | Offline (0 kbps)               |
| Method             | DevTools → Network → Offline   |

## Steps
1. Confirm the app is loaded and the ECG dashboard is visible at `/ecgs`
2. Click `flt-semantics-placeholder` to ensure the accessibility tree is active
3. Open Chrome DevTools → **Network** tab
4. In the throttling dropdown, select **Offline**
5. Wait 2–5 seconds for the app to detect the connectivity change
6. Observe the UI for any offline indicator, banner, snackbar, or status message
7. Attempt to interact with the app (e.g., scroll the ECG list or click a filter) to trigger any network-dependent action
8. Observe whether the offline state is communicated to the user

## Expected Result
- Within a reasonable time (≤ 10 seconds) of going offline, the app displays a visible **offline/no-network banner** or equivalent indicator (snackbar, status bar, overlay message)
- The banner text is user-friendly (e.g., "No internet connection", "You're offline", or similar) — not a raw technical error
- The app does not crash, display a blank white screen, or throw unhandled exceptions in the console
- Cached/previously loaded data (e.g., already-rendered ECG list items) may remain visible — this is acceptable
- The offline indicator is persistent and does not disappear until connectivity is restored

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Flutter Web can detect connectivity changes via `dart:html`'s `window.onOnline`/`window.onOffline` events or a connectivity plugin. Verify the implementation is active in the browser environment (some Flutter connectivity plugins behave differently on Web vs. native).
- If no offline banner appears, check the DevTools console for JavaScript errors. Absence of any user feedback when offline is a **High** UX defect for a clinical app where staff need to know if data is not syncing.
- This test is a prerequisite for TC_NET_002 (online recovery). Keep DevTools open for the follow-up test.
- DevTools throttling to "Offline" affects only the browser-level network stack, not WebSockets that may already be connected. Confirm the banner also appears for persistent connections that are dropped.
