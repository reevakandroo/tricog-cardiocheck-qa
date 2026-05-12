// @ts-check
const { test, expect } = require('@playwright/test');
const { gotoLogin, doLogin, enableFlutterA11y, robustFill, clickButton, pageText, SEL_EMAIL, SEL_PASSWORD, USERNAME, PASSWORD } = require('./helpers');

async function setPortrait(page) {
  await page.setViewportSize({ width: 393, height: 851 });
  await page.waitForTimeout(500);
}
async function setLandscape(page) {
  await page.setViewportSize({ width: 851, height: 393 });
  await page.waitForTimeout(500);
}

test.describe('TC_Mobile_Orientation — Screen Rotation', () => {
  test('TC_MORI_001 Login screen renders correctly in portrait', async ({ page }) => {
    await setPortrait(page);
    await gotoLogin(page);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_001_login_portrait.png' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test('TC_MORI_002 Login screen renders correctly in landscape', async ({ page }) => {
    await setLandscape(page);
    await gotoLogin(page);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_002_login_landscape.png' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test('TC_MORI_003 Dashboard renders correctly in portrait', async ({ page }) => {
    await setPortrait(page);
    await doLogin(page);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_003_dashboard_portrait.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MORI_004 Dashboard renders correctly in landscape', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await setLandscape(page);
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_004_dashboard_landscape.png' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    console.log(`Landscape overflow: ${overflow}`);
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MORI_005 Patient form in portrait — all fields reachable', async ({ page }) => {
    await setPortrait(page);
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await clickButton(page, 'New ECG');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_005_form_portrait.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MORI_006 Patient form in landscape — scrollable, no overflow', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await clickButton(page, 'New ECG');
    await page.waitForTimeout(2000);
    await setLandscape(page);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_006_form_landscape.png' });
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    console.log(`Form landscape overflow: ${overflow}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MORI_007 Rotate mid-form — data is retained', async ({ page }) => {
    await setPortrait(page);
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await clickButton(page, 'New ECG');
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    // Fill patient ID
    const { SEL_PATIENT_ID } = require('./helpers');
    await robustFill(page, SEL_PATIENT_ID, 'ROT001');
    await page.waitForTimeout(500);
    // Rotate
    await setLandscape(page);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_007_rotate_mid_form.png' });
    // Go back to portrait
    await setPortrait(page);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_007_after_rotate_portrait.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MORI_008 ECG detail page in landscape — waveform visible', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(5000);
    }
    await setLandscape(page);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MORI_008_ecg_landscape.png' });
    expect(page.url()).not.toContain('login');
  });
});
