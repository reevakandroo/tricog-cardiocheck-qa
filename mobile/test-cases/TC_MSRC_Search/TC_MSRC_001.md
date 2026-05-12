---
id: TC_MSRC_001
module: Mobile Search
title: Search bar is visible on mobile ECG list
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
A search bar or search icon must be accessible within the mobile ECG list view without requiring horizontal scrolling.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in with valid credentials and wait for dashboard to load
3. Inspect the ECG list view for a search bar or search icon
4. Confirm the search element is within the 393px viewport width

## Expected Result
A search bar or search icon is visible on the ECG list view within the mobile viewport. No horizontal scrolling is needed to access it.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
