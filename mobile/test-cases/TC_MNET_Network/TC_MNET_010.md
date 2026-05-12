---
id: TC_MNET_010
module: Mobile Network
title: App loads from cache when offline on second visit
type: Edge
severity: Low
preconditions: [MPC_001, MPC_002]
---

## Scenario
On a second visit when the device is offline, the application should serve cached assets (if a service worker or cache strategy is implemented) and show a meaningful offline state.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation (first visit — online)
2. Wait for the app to fully load and cache assets
3. Go offline using `context.setOffline(true)`
4. Reload the page
5. Observe whether the app loads from cache or shows a browser offline error

## Expected Result
The app either: (a) loads from service worker cache and shows a meaningful offline state, or (b) shows the browser's default offline page. If a service worker is registered, cached assets are served and a user-friendly "offline" message is displayed.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
