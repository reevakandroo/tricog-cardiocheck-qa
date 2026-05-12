---
id: TC_MRPT_003
module: Mobile Export/Report
title: PDF download is triggered on mobile browser
type: Positive
severity: High
preconditions: [MPC_001, MPC_002, MPC_003]
---

## Scenario
When a user taps the Export PDF button, the browser must initiate a PDF file download (or open it in a new tab) on the mobile browser.

## Preconditions
- MPC_001 — Mobile browser open, network available
- MPC_002 — CardioCheck app accessible at https://cardiocheck-releasev140.up.railway.app
- MPC_003 — User is logged in and a completed risk result is available

## Test Data
| Field    | Value                          |
|----------|--------------------------------|
| Device   | Pixel 5 (393×851, Android emu) |

## Steps
1. Navigate to https://cardiocheck-releasev140.up.railway.app on Pixel 5 emulation
2. Log in and open a completed risk result page
3. Intercept network requests using Playwright `page.waitForResponse`
4. Tap the Export PDF button
5. Observe whether a response with `Content-Type: application/pdf` is received
6. Confirm the download is initiated or a PDF opens in a new browser tab

## Expected Result
A PDF file is generated and downloaded or displayed. The response Content-Type is `application/pdf`. The file is not empty. No server error occurs during PDF generation.

## Actual Result
_To be filled during execution_

## Status
_To be filled during execution_
