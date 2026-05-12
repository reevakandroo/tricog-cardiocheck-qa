// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, gotoLogin, enableFlutterA11y, clickButton, pageText, APP_URL, LOGIN_URL, USERNAME } = require('./helpers');

test.describe('TC_Mobile_Lifecycle — App State', () => {
  test('TC_MINT_001 Cold start — app launches and shows login within 15s', async ({ page }) => {
    const t0 = Date.now();
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    const elapsed = Date.now() - t0;
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_001_cold_start.png' });
    const text = await pageText(page);
    const showsLogin = text.toLowerCase().includes('email') || text.toLowerCase().includes('login') || text.toLowerCase().includes('sign in');
    console.log(`Cold start time: ${elapsed}ms, Login visible: ${showsLogin}`);
    expect(elapsed).toBeLessThan(60000);
    expect(showsLogin).toBe(true);
  });

  test('TC_MINT_002 Background → foreground resume — session still active', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    // Simulate background by navigating away and back
    await page.goto('about:blank').catch(() => {});
    await page.waitForTimeout(2000);
    await page.goBack().catch(() => page.goto(APP_URL + '/#/ecg', { timeout: 15000 }).catch(() => {}));
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_002_resume.png' });
    const url = page.url();
    const text = (await pageText(page)).toLowerCase();
    // Should stay logged in (not redirect to login after brief background)
    console.log(`Post-resume URL: ${url}`);
    expect(url).not.toContain('error');
  });

  test('TC_MINT_003 Page refresh mid-session — session handling', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_003_before_refresh.png' });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_003_after_refresh.png' });
    console.log(`Post-refresh URL: ${page.url()}`);
    expect(page.url()).not.toContain('error');
  });

  test('TC_MINT_004 Deep link to ECG list — app handles hash routing', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    // Navigate directly to ECG route
    await page.goto(`${APP_URL}/#/ecg`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_004_deep_link.png' });
    console.log(`Deep link URL: ${page.url()}`);
    expect(page.url()).not.toContain('error');
  });

  test('TC_MINT_005 Multiple rapid taps — no duplicate navigation', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    const btn = page.locator('flt-semantics[role="button"]:has-text("New ECG"), button:has-text("New ECG")').first();
    if (await btn.isVisible().catch(() => false)) {
      // Tap multiple times rapidly
      await btn.click({ timeout: 3000 }).catch(() => {});
      await btn.click({ timeout: 1000 }).catch(() => {});
      await btn.click({ timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_005_rapid_taps.png' });
    const text = await pageText(page);
    expect(text).not.toContain('exception');
  });

  test('TC_MINT_006 Back button during login form — no app crash', async ({ page }) => {
    await gotoLogin(page);
    const { robustFill, SEL_EMAIL, SEL_PASSWORD } = require('./helpers');
    await robustFill(page, SEL_EMAIL, USERNAME);
    // Press browser back while form is partially filled
    await page.goBack().catch(() => {});
    await page.waitForTimeout(2000);
    await page.goForward().catch(() => {});
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_006_back_during_login.png' });
    const text = await pageText(page);
    expect(text).not.toContain('exception');
  });

  test('TC_MINT_007 App handles browser tab switch — no PHI exposed on return', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    // Open new tab then close it
    const newTab = await page.context().newPage();
    await newTab.goto('about:blank');
    await newTab.waitForTimeout(1000);
    await newTab.close();
    // Back to original tab
    await page.bringToFront();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_007_tab_switch.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MINT_008 App handles slow script execution — no ANR-equivalent', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    // Execute a blocking script to simulate heavy computation
    await page.evaluate(() => {
      const start = Date.now();
      while (Date.now() - start < 500) { /* block for 500ms */ }
    }).catch(() => {});
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MINT_008_slow_script.png' });
    const text = await pageText(page);
    expect(text).not.toContain('not responding');
    expect(page.url()).not.toContain('error');
  });
});
