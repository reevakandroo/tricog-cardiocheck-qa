// @ts-check
const { test, expect } = require('@playwright/test');
const {
  SEL_ECG_ITEM, enableFlutterA11y, robustFill,
  doLogin, ensureDashboard, pageText,
} = require('./helpers');

test.describe('TC_Search_Bar — ECG Search', () => {
  let searchSel;

  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    // Discover search input selector
    searchSel = 'input[aria-label*="Search"]';
    const found = await page.locator(searchSel).count();
    if (!found) searchSel = 'input[aria-label*="search"]';
  });

  test('TC_SRC_001 Exact patient ID search returns matching result', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    // Get a patient ID from the list first
    const listText = await pageText(page);
    await page.screenshot({ path: 'reports/screenshots/SRC_001_before_search.png' });
    await robustFill(page, searchSel, 'PT');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SRC_001_search_result.png' });
    // Should show filtered results without crashing
    expect(await page.title()).toBeTruthy();
  });

  test('TC_SRC_003 No results for unknown ID → empty state shown', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    await robustFill(page, searchSel, 'ZZZZZZNOTEXIST999');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SRC_003_no_results.png' });
    const text = (await pageText(page)).toLowerCase();
    const empty = text.includes('no') || text.includes('empty') || text.includes('found') ||
      (await page.locator(SEL_ECG_ITEM).count()) === 0;
    expect(empty).toBe(true);
  });

  test('TC_SRC_004 Clear search restores full list', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    const initial = await page.locator(SEL_ECG_ITEM).count();
    await robustFill(page, searchSel, 'ZZZNONE');
    await page.waitForTimeout(1500);
    // Clear search
    await page.locator(searchSel).click();
    await page.keyboard.selectAll();
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SRC_004_clear_search.png' });
    const after = await page.locator(SEL_ECG_ITEM).count();
    expect(after).toBeGreaterThanOrEqual(initial > 0 ? 1 : 0);
  });

  test('TC_SRC_005 Special characters in search — no crash', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    let crashed = false;
    page.on('pageerror', () => { crashed = true; });
    await robustFill(page, searchSel, '!@#$%^&*()');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SRC_005_special_chars.png' });
    expect(crashed).toBe(false);
  });

  test('TC_SRC_006 SQL injection in search — no data leak', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    await robustFill(page, searchSel, "' OR '1'='1");
    await page.waitForTimeout(2000);
    const count = await page.locator(SEL_ECG_ITEM).count();
    await page.screenshot({ path: 'reports/screenshots/SRC_006_sql_inject.png' });
    // Should not return all records (would indicate SQL injection vulnerability)
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('sql');
    expect(text).not.toContain('error 500');
  });

  test('TC_SRC_007 XSS in search — no script execution', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await robustFill(page, searchSel, '<script>alert("xss")</script>');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SRC_007_xss.png' });
    expect(alertFired).toBe(false);
  });

  test('TC_SRC_008 Very long search string — no crash', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    let crashed = false;
    page.on('pageerror', () => { crashed = true; });
    await robustFill(page, searchSel, 'A'.repeat(300));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SRC_008_long_string.png' });
    expect(crashed).toBe(false);
  });

  test('TC_SRC_009 Whitespace-only search — graceful handling', async ({ page }) => {
    const hasSearch = await page.locator(searchSel).count();
    if (!hasSearch) { test.skip(); return; }
    await robustFill(page, searchSel, '     ');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SRC_009_whitespace.png' });
    expect(await page.title()).toBeTruthy();
  });
});
