---
id: TC_MPER_004
module: Mobile Performance
title: Search response is under 3 seconds on mobile
type: Performance
severity: Medium
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
Search results must appear within 3 seconds of the user typing a search query, to provide a responsive filtering experience on mobile.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and on the dashboard with multiple ECG entries

## Test Data
| Field        | Value                          |
|--------------|--------------------------------|
| Search Term  | First 3 chars of a patient name |
| Device       | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and navigate to dashboard
3. Record timestamp before typing in search bar
4. Enter a 3-character search term
5. Record timestamp when filtered results appear (or loading state ends)
6. Calculate search response time

## Expected Result
Search results (or "no results" state) appear within 3 seconds of input. If search is server-side, the API response must arrive within 3 seconds. If client-side filtering, it must be near-instant (<500ms).

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
