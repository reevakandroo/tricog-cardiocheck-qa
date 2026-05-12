---
id: TC_MPER_008
module: Mobile Performance
title: Scroll performance maintains smooth rendering during list scroll
type: Performance
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Scrolling the ECG list must be smooth with no visible jank (dropped frames). The target is 60fps rendering during scroll interactions.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard with multiple ECG entries

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| FPS Goal | 60fps                          |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and wait for dashboard to load with multiple ECG entries
3. Start a Chrome DevTools performance trace (or use Playwright `page.evaluate` to measure rAF timing)
4. Scroll the ECG list from top to bottom continuously for 3 seconds
5. Measure frame rate during the scroll using `requestAnimationFrame` timing
6. Note any frame drops below 30fps

## Expected Result
Scroll renders at a consistent 60fps (or close to it). No visible jank or freeze during continuous scrolling. Frame drops below 30fps are flagged as a performance issue.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
