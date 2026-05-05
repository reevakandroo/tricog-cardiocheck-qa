---
id: PC_006
title: Browser DevTools or Playwright CDP is available for network throttling and inspection
---

## Description
The browser DevTools are accessible, or a Playwright script has established a Chrome DevTools Protocol (CDP) session, enabling network condition simulation (throttling, offline mode, request interception) and console/network inspection. This is required for network resilience and performance test cases.

## Setup Steps

### For Manual Testing (DevTools)
1. Confirm PC_001 is met.
2. Open the CardioCheck app in Chromium.
3. Press `F12` (or `Ctrl+Shift+I` / `Cmd+Option+I`) to open DevTools.
4. Navigate to the **Network** tab.
5. Confirm the Network tab is recording (red record button or traffic is appearing).
6. To enable throttling: click the **No throttling** dropdown and select a preset (e.g., "Slow 3G", "Fast 3G") or define a custom profile.
7. To simulate offline: check the **Offline** checkbox in the Network tab.

### For Automated Testing (Playwright CDP)
1. In the Playwright test, create a CDP session:
   ```js
   const client = await page.context().newCDPSession(page);
   ```
2. Apply network throttling:
   ```js
   await client.send('Network.emulateNetworkConditions', {
     offline: false,
     downloadThroughput: 500 * 1024 / 8,  // 500 kbps
     uploadThroughput: 500 * 1024 / 8,
     latency: 400
   });
   ```
3. To simulate offline:
   ```js
   await client.send('Network.emulateNetworkConditions', {
     offline: true,
     downloadThroughput: -1,
     uploadThroughput: -1,
     latency: 0
   });
   ```
4. Confirm CDP session is established without error before proceeding.

## Verification
- Manual: DevTools Network tab is open and showing traffic; throttle dropdown is accessible.
- Automated: CDP `send` call returns without error; a subsequent network request visibly takes longer than baseline.

## Teardown
- Reset network conditions to "No throttling" / online after each test:
  ```js
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0
  });
  ```
- Close DevTools panel if it was opened manually and is no longer needed.

## Referenced By
- TC_Network
- TC_Risk_Assessment (timeout scenarios)
- TC_Omron_Integration (timeout scenarios)
