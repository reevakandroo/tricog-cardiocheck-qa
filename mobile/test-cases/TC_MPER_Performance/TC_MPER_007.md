---
id: TC_MPER_007
module: Mobile Performance
title: App renders within 3 seconds on first paint (Time to Interactive)
type: Performance
severity: High
preconditions: [MPC_001, MPC_002]
---

## Scenario
The Time to Interactive (TTI) — when the app is fully visible and responsive — must be within 3 seconds on a fast network to meet mobile usability standards.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |
| Network  | Unthrottled                    |

## Steps
1. Clear browser cache and service workers
2. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
3. Capture performance metrics using `page.evaluate(() => performance.getEntriesByType('navigation')[0])`
4. Record: `domInteractive`, `domContentLoadedEventEnd`, `loadEventEnd`
5. Also record First Contentful Paint via `performance.getEntriesByName('first-contentful-paint')`

## Expected Result
First Contentful Paint (FCP) occurs within 3 seconds. `domInteractive` is within 5 seconds. The login form is visible and interactive within 3-5 seconds on a fast network. Note: Flutter WASM apps may have longer initial load times — document actual values.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
