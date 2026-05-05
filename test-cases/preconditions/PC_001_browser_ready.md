---
id: PC_001
title: Browser is ready with JS enabled and network available
---

## Description
A Chromium-based browser (latest stable) is open, JavaScript is enabled, and the machine has an active network connection capable of reaching the CardioCheck application at `https://cardiocheck-releasev140.up.railway.app`. No browser extensions that interfere with Canvas rendering or network requests are active.

## Setup Steps
1. Launch Chromium (latest stable) or a Playwright-managed Chromium instance.
2. Confirm JavaScript is enabled: navigate to `chrome://settings/content/javascript` and verify it is set to "Sites can use JavaScript".
3. Confirm network connectivity: run `curl -I https://cardiocheck-releasev140.up.railway.app` and expect a 200 or 302 HTTP response.
4. Disable any browser extensions that block scripts, ads, or network requests (e.g. uBlock, ad-blockers) for the CardioCheck domain, or use a clean browser profile.
5. Verify the browser window is at a minimum resolution of 1280×800.

## Verification
- Navigating to `https://cardiocheck-releasev140.up.railway.app` loads a page without a blank screen or "JavaScript required" error.
- The Flutter CanvasKit loading spinner or login page is visible within 10 seconds.
- Browser DevTools Console shows no "net::ERR_" network failure messages on initial load.

## Teardown
- No teardown required; this is an environmental baseline.
- If a custom browser profile was created for testing, it can be left open for subsequent test cases.

## Referenced By
- All test modules (universal baseline precondition)
- TC_Login
- TC_Forgot_Password
- TC_Network
- TC_Security
