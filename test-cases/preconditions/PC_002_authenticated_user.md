---
id: PC_002
title: User is logged in and on the ECG dashboard with Flutter accessibility enabled
---

## Description
The test user `reeva.kandroo+8@tricog.com` is authenticated in the CardioCheck app and the browser is on the ECG dashboard (`/ecgs`). The Flutter CanvasKit accessibility tree has been activated by clicking the `flt-semantics-placeholder` element, so that Playwright (or manual interaction) can locate and interact with Flutter widgets.

## Setup Steps
1. Confirm PC_001 is met (browser open, JS enabled, network available).
2. Navigate to `https://cardiocheck-releasev140.up.railway.app`.
3. Wait for the Flutter app to fully load (CanvasKit splash disappears, login form is visible).
4. Click the `flt-semantics-placeholder` element to activate the Flutter accessibility tree.
   - In Playwright: `await page.locator('flt-semantics-placeholder').click();`
5. Enter email: `reeva.kandroo+8@tricog.com`
6. Enter password: `Tricog@1234`
7. Click the **Login** / **Sign In** button.
8. Wait for navigation to `/ecgs` (ECG dashboard).
9. Confirm the ECG list page header or dashboard UI is visible.
10. After any subsequent navigation within the app, re-click `flt-semantics-placeholder` if the accessibility tree is reset by Flutter's route change.

## Verification
- The browser URL contains `/ecgs`.
- The ECG list or an empty state message is rendered on screen.
- No authentication error or redirect back to the login page.
- In Playwright: `await expect(page).toHaveURL(/\/ecgs/);`

## Teardown
- Log out via the app's logout option (Profile menu > Sign Out) after the test session is complete.
- Clear browser session storage/cookies if the next test requires a fresh unauthenticated state:
  `await context.clearCookies();`

## Referenced By
- TC_ECG_Dashboard
- TC_Patient_Info
- TC_Risk_Assessment
- TC_Report_Export
- TC_Search_Bar
- TC_Omron_Integration
- TC_Multi_Center
- TC_Profile
- TC_HIPAA
- TC_Security
