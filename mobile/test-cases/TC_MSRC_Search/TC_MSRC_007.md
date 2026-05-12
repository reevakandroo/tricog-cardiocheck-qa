---
id: TC_MSRC_007
module: Mobile Search
title: Search filters list in real-time as user types
type: Positive
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
As the user types each character in the search bar, the ECG list must update in real-time (no submit required), providing an instant-filter experience.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard with multiple ECG entries

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Search Input | Type one character at a time   |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to the dashboard
3. Tap the search bar
4. Type the letter `J` and observe the list immediately
5. Type `o` (making `Jo`) and observe the list again
6. Type `h` (making `Joh`) and observe the list again
7. Confirm the list narrows after each character is typed

## Expected Result
The ECG list updates after each character is typed, progressively narrowing the results without requiring a search button tap or Enter key press.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
