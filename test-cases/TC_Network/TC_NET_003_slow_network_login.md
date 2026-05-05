---
id: TC_NET_003
module: Network
title: Slow Network Login — Login Completes on 2G with Loading State Shown
type: Edge
severity: Medium
preconditions: [PC_001, PC_006]
---

## Scenario
A user attempts to log in while the network is throttled to simulate a 2G/slow-2g connection (~40 kbps, high latency). The login flow must still complete successfully, and the UI must display a visible loading state throughout to prevent double-submission or user confusion.

## Preconditions
- [PC_001](../preconditions/PC_001_browser_ready.md) - Browser is open, JavaScript is enabled, and network is available
- [PC_006](../preconditions/PC_006_devtools_available.md) - Chrome DevTools is accessible for network throttling

## Test Data
| Field             | Value                          |
|-------------------|-------------------------------|
| Email             | reeva.kandroo+8@tricog.com    |
| Password          | Tricog@1234                   |
| Throttle profile  | Slow 3G / custom: 40 kbps down, 40 kbps up, 2000 ms latency |
| Expected timeout  | Login should complete within 60 seconds |

## Steps

### Phase 1 — Set Up Throttling Before Login
1. Navigate to `https://cardiocheck-releasev140.up.railway.app` (while network is still normal)
2. Wait for the Flutter CanvasKit app to load and the login form to be visible
3. Open DevTools → **Network** tab
4. Set throttling to **Slow 3G** or configure a custom profile:
   - Download: 40 kbps
   - Upload: 40 kbps
   - Latency: 2000 ms
5. Confirm throttling is active (the DevTools network tab shows the selected profile)

### Phase 2 — Perform Login
6. Click `flt-semantics-placeholder` to activate the Flutter accessibility tree
7. Click the email input (`aria-label="Enter your email"`) and type `reeva.kandroo+8@tricog.com`
8. Click the password input and type `Tricog@1234`
9. Click the **Login** button
10. Start a timer at the moment of button click

### Phase 3 — Observe Loading State
11. Observe the login button and the broader UI immediately after clicking:
    - Does the button show a loading/spinner state?
    - Is the button disabled to prevent double-click?
    - Is there any progress indicator or loading overlay on the screen?
12. Do NOT click the Login button again while waiting

### Phase 4 — Verify Completion
13. Wait for the login to complete (up to 60 seconds given the throttled connection)
14. Record the actual time taken from button click to dashboard load
15. Confirm the app navigates to `/ecgs` (the ECG dashboard)
16. Remove throttling (set back to No throttling) after the test

## Expected Result
- The login form remains responsive after clicking Login — inputs are not frozen
- A visible **loading indicator** (spinner on the button, full-screen overlay, or progress bar) appears immediately after clicking Login and persists until the auth response is received
- The Login button is **disabled** after the first click to prevent duplicate submission
- Login completes successfully within 60 seconds on 40 kbps / 2000 ms latency
- The app navigates to the ECG dashboard (`/ecgs`) after successful auth
- No timeout errors are shown to the user before 60 seconds have elapsed
- No JavaScript console errors indicating a request was sent twice (double-submission)

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_

## Notes
- Slow network conditions are realistic in rural or hospital network environments with congested Wi-Fi.
- **Double-submission risk:** if the Login button is not disabled after the first click, a slow network may cause users to click multiple times, potentially creating duplicate auth requests or race conditions.
- The Cognito auth flow involves multiple round trips (SRP auth challenge, respond to auth challenge, token exchange with UMS). Each round trip is impacted by high latency — expect the total flow to take 10–30 seconds on a 2G connection.
- If the app shows a timeout error before 60 seconds on 2G conditions, log the actual timeout threshold found and flag as a **Medium** defect (insufficient timeout for poor network environments).
- Record the exact elapsed time in the Actual Result for performance baselining.
