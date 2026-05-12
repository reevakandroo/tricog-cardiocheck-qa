---
id: TC_MRPT_005
module: Mobile Export/Report
title: Export during slow network does not produce an unhandled error
type: Negative
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When the user taps the Export button under a slow network condition (3G simulation), the application must display a loading state and not throw an unhandled error if the request is slow or times out.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on a completed risk result page

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Device       | Pixel 5 (393×851, Android emu) |
| Network Sim  | Playwright throttle 3G (1.6 Mbps, 300ms latency) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and open a completed risk result page
3. Use Playwright `page.route()` to delay the PDF export API response by 8 seconds
4. Tap the Export PDF button
5. Observe whether a loading indicator appears during the delay
6. Wait for the response and check for unhandled errors in the console

## Expected Result
A loading/spinner indicator appears after tapping the Export button. No unhandled JavaScript error is thrown during the wait. Either the PDF eventually downloads or a timeout error message is shown gracefully.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
