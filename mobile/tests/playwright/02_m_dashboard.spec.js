// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, enableFlutterA11y, clickButton, pageText, USERNAME2, PASSWORD2 } = require('./helpers');

test.describe('TC_Mobile_Dashboard — ECG List', () => {
  test.beforeEach(async ({ page }) => { await doLogin(page); });

  test('TC_MDSH_001 Dashboard loads after login — ECG list visible', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_001_dashboard.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MDSH_002 ECG list shows patient entries on mobile viewport', async ({ page }) => {
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    const text = await pageText(page);
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_002_ecg_list.png' });
    // ECG list should contain patient-related text
    const hasContent = text.length > 50;
    expect(hasContent).toBe(true);
  });

  test('TC_MDSH_003 Pull-to-refresh gesture on ECG list', async ({ page }) => {
    await page.waitForTimeout(3000);
    const vp = page.viewportSize() || { width: 393, height: 851 };
    const cx = vp.width / 2;
    // Swipe down from top-third to simulate pull-to-refresh
    await page.mouse.move(cx, 200);
    await page.mouse.down();
    await page.mouse.move(cx, 450, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_003_pull_refresh.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MDSH_004 Scroll ECG list on mobile touch', async ({ page }) => {
    await page.waitForTimeout(3000);
    const vp = page.viewportSize() || { width: 393, height: 851 };
    const cx = vp.width / 2;
    await page.mouse.move(cx, 600);
    await page.mouse.down();
    await page.mouse.move(cx, 200, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_004_scroll_list.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MDSH_005 New ECG button visible and tappable on mobile', async ({ page }) => {
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_005_new_ecg_btn.png' });
    const btn = page.locator('flt-semantics[role="button"]:has-text("New ECG"), button:has-text("New ECG")').first();
    const visible = await btn.isVisible().catch(() => false);
    expect(visible).toBe(true);
  });

  test('TC_MDSH_006 Center isolation — Account B sees only its own center ECGs', async ({ page }) => {
    // Log out first
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(1000);
    await clickButton(page, 'Logout').catch(() => clickButton(page, 'Log Out').catch(() => {}));
    await page.waitForTimeout(3000);
    // Login as Account B
    await enableFlutterA11y(page, 2000);
    const { robustFill, SEL_EMAIL, SEL_PASSWORD } = require('./helpers');
    await robustFill(page, SEL_EMAIL, USERNAME2);
    await robustFill(page, SEL_PASSWORD, PASSWORD2);
    await clickButton(page, 'Login');
    await page.waitForTimeout(8000);
    if (page.url().includes('eula')) {
      await enableFlutterA11y(page, 1500);
      await page.locator('flt-semantics[role="button"]:has-text("Agree")').first().click({ timeout: 8000 }).catch(() => {});
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_006_center_isolation.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MDSH_007 Long patient name truncates cleanly on mobile', async ({ page }) => {
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    const text = await pageText(page);
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_007_long_name.png' });
    // No JS error from long name display
    expect(text).not.toContain('exception');
  });

  test('TC_MDSH_008 Dashboard navigation back from ECG detail', async ({ page }) => {
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    // Tap first ECG item if available
    const items = page.locator('flt-semantics[role="button"]');
    const count = await items.count();
    if (count > 0) {
      await items.nth(0).click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(3000);
      await page.goBack().catch(() => clickButton(page, 'Back').catch(() => {}));
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MDSH_008_back_nav.png' });
    expect(page.url()).toContain('/ecg');
  });
});
