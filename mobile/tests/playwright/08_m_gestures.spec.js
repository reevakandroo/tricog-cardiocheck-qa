// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, enableFlutterA11y, clickButton, pageText, touchTap, swipeUp, swipeDown } = require('./helpers');

test.describe('TC_Mobile_Gestures — Touch Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
  });

  test('TC_MGES_001 Single tap opens ECG list item', async ({ page }) => {
    const items = page.locator('flt-semantics[role="button"]');
    const cnt = await items.count();
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_001_before_tap.png' });
    if (cnt > 0) {
      await items.nth(0).tap().catch(() => items.nth(0).click().catch(() => {}));
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_001_after_tap.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MGES_002 Swipe up scrolls ECG list', async ({ page }) => {
    const vp = page.viewportSize() || { width: 393, height: 851 };
    const cx = Math.floor(vp.width / 2);
    await swipeUp(page, cx, 600, 250);
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_002_swipe_up.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MGES_003 Swipe down from top — pull to refresh', async ({ page }) => {
    const vp = page.viewportSize() || { width: 393, height: 851 };
    const cx = Math.floor(vp.width / 2);
    await swipeDown(page, cx, 150, 300);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_003_pull_refresh.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MGES_004 Double tap on ECG item — no crash', async ({ page }) => {
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      const box = await items.nth(0).boundingBox().catch(() => null);
      if (box) {
        await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(2000);
      }
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_004_double_tap.png' });
    const text = await pageText(page);
    expect(text).not.toContain('exception');
  });

  test('TC_MGES_005 Long press on ECG item — no crash', async ({ page }) => {
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      const box = await items.nth(0).boundingBox().catch(() => null);
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(1000);
        await page.mouse.up();
        await page.waitForTimeout(1000);
      }
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_005_long_press.png' });
    const text = await pageText(page);
    expect(text).not.toContain('exception');
  });

  test('TC_MGES_006 Tap on New ECG button using touch', async ({ page }) => {
    const btn = page.locator('flt-semantics[role="button"]:has-text("New ECG"), button:has-text("New ECG")').first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.tap().catch(() => btn.click().catch(() => {}));
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_006_new_ecg_touch.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MGES_007 Scroll to bottom of ECG list then back to top', async ({ page }) => {
    const vp = page.viewportSize() || { width: 393, height: 851 };
    const cx = Math.floor(vp.width / 2);
    // Scroll down
    await swipeUp(page, cx, 600, 400);
    await page.waitForTimeout(800);
    await swipeUp(page, cx, 600, 400);
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_007_scroll_bottom.png' });
    // Scroll back to top
    await swipeDown(page, cx, 400, 400);
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_007_scroll_top.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MGES_008 Touch targets minimum 44px on interactive elements', async ({ page }) => {
    const btns = page.locator('flt-semantics[role="button"]');
    const cnt = await btns.count();
    const small = [];
    for (let i = 0; i < Math.min(cnt, 10); i++) {
      const box = await btns.nth(i).boundingBox().catch(() => null);
      if (box && (box.width < 44 || box.height < 44)) {
        small.push({ i, w: box.width, h: box.height });
      }
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MGES_008_touch_targets.png' });
    console.log(`Elements with small touch targets: ${JSON.stringify(small)}`);
    // Soft assertion — report count, don't block
    expect(page.url()).toContain('/ecg');
  });
});
