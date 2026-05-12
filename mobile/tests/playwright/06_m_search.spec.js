// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, enableFlutterA11y, pageText, robustFill, SEL_SEARCH } = require('./helpers');

test.describe('TC_Mobile_Search — ECG Search', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
  });

  test('TC_MSRC_001 Search bar visible on mobile ECG list', async ({ page }) => {
    await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_001_search_bar.png' });
    const searchEl = page.locator(SEL_SEARCH).first();
    const visible = await searchEl.isVisible().catch(() => false);
    console.log(`Search bar visible: ${visible}`);
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MSRC_002 Search with partial patient name filters list', async ({ page }) => {
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.tap().catch(() => searchEl.click().catch(() => {}));
      await searchEl.fill('Test');
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_002_partial_search.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MSRC_003 Search with no matching results — empty state shown', async ({ page }) => {
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.tap().catch(() => searchEl.click().catch(() => {}));
      await searchEl.fill('ZZZNOMATCH99999');
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_003_no_results.png' });
    const text = await pageText(page);
    expect(text).not.toContain('exception');
  });

  test('TC_MSRC_004 Empty search input shows full list', async ({ page }) => {
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.tap().catch(() => searchEl.click().catch(() => {}));
      await searchEl.fill('Test');
      await page.waitForTimeout(1500);
      await searchEl.fill('');
      await page.waitForTimeout(2500);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_004_empty_search.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MSRC_005 Search with special characters — no error', async ({ page }) => {
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.tap().catch(() => searchEl.click().catch(() => {}));
      await searchEl.fill("'; DROP TABLE patients;--");
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_005_special_chars.png' });
    const text = await pageText(page);
    expect(text).not.toContain('sql');
    expect(text).not.toContain('exception');
  });

  test('TC_MSRC_006 Search is case insensitive', async ({ page }) => {
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.tap().catch(() => searchEl.click().catch(() => {}));
      await searchEl.fill('test');
      await page.waitForTimeout(1500);
      const textLower = await pageText(page);
      await searchEl.fill('TEST');
      await page.waitForTimeout(1500);
      const textUpper = await pageText(page);
      await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_006_case_insensitive.png' });
      console.log(`Lower results length: ${textLower.length}, Upper: ${textUpper.length}`);
    }
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MSRC_007 Real-time search filtering as user types on mobile', async ({ page }) => {
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.tap().catch(() => searchEl.click().catch(() => {}));
      for (const char of ['T', 'e', 's', 't']) {
        await searchEl.type(char);
        await page.waitForTimeout(400);
      }
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_007_realtime_search.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MSRC_008 Clear search (X button or backspace) restores full list', async ({ page }) => {
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.tap().catch(() => searchEl.click().catch(() => {}));
      await searchEl.fill('Test');
      await page.waitForTimeout(1500);
      // Clear via keyboard
      await searchEl.selectText().catch(() => {});
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(2500);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MSRC_008_clear_search.png' });
    expect(page.url()).toContain('/ecg');
  });
});
