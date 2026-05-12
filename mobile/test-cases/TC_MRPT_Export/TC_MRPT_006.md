---
id: TC_MRPT_006
module: Mobile Export/Report
title: Report share sheet is accessible on mobile
type: Positive
severity: Low
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
On mobile, users may expect a native share sheet when exporting or sharing a report; the app must either trigger the Web Share API or provide an alternative sharing mechanism.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on a completed risk result page

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and open a completed risk result page
3. Look for a "Share" button or share icon
4. If present, tap the Share button
5. Check whether the Web Share API (`navigator.share`) is invoked
6. Observe the result in the emulation context

## Expected Result
If a share button is present, tapping it either: (a) invokes the mobile share sheet via Web Share API, or (b) copies a shareable link to clipboard with a confirmation message. No JavaScript crash occurs. If the feature is not implemented, the button is not shown (not broken).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
