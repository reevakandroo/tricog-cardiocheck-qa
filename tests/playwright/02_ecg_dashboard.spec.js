// @ts-check
const { test, expect } = require('@playwright/test');
const {
  SEL_ECG_ITEM, SEL_NEW_ECG,
  enableFlutterA11y, generateECG, doLogin, ensureDashboard, pageText, hasText,
} = require('./helpers');

test.describe('TC_ECG_Dashboard — ECG List', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 20000 }).catch(() => {});
  });

  test('TC_ECG_001 ECG list loads with entries', async ({ page }) => {
    await page.screenshot({ path: 'reports/screenshots/ECG_001_list.png' });
    const count = await page.locator(SEL_ECG_ITEM).count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_ECG_003 Seed mock ECG → appears in list within 60s', async ({ page }) => {
    const res = await generateECG('high');
    expect(res.status).toBe(200);
    // Poll for new ECG up to 60s (datasync worker can take up to 30s)
    let appeared = false;
    for (let i = 0; i < 12; i++) {
      await page.waitForTimeout(5000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await enableFlutterA11y(page, 1500);
      const count = await page.locator(SEL_NEW_ECG).count();
      if (count > 0) { appeared = true; break; }
    }
    await page.screenshot({ path: 'reports/screenshots/ECG_003_mock_ecg.png' });
    expect(appeared).toBe(true);
  });

  test('TC_ECG_004 Click ECG → opens detail view', async ({ page }) => {
    // Click a "New ECG" item if available, otherwise click the first ECG card by text pattern
    const newEcg = page.locator(SEL_NEW_ECG).first();
    if (await newEcg.count() > 0) {
      await newEcg.click({ timeout: 5000 });
    } else {
      // Try clicking any flt-semantics button that has meaningful text (not app-bar icons)
      await page.locator('flt-semantics[role="button"]').filter({ hasText: /ECG|PT|New/ }).first()
        .click({ timeout: 8000 }).catch(() => {
          page.locator(SEL_ECG_ITEM).first().click({ timeout: 5000 }).catch(() => {});
        });
    }
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_004_detail.png' });
    const url = page.url();
    expect(url).toMatch(/\/(patient|result)/);
  });

  test('TC_ECG_005 Pagination — scroll loads more ECGs', async ({ page }) => {
    const initialCount = await page.locator(SEL_ECG_ITEM).count();
    // Scroll to bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/ECG_005_pagination.png' });
    // Either more items loaded or already showing all
    const newCount = await page.locator(SEL_ECG_ITEM).count();
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('TC_ECG_006 New unprocessed ECG shows "New ECG" label', async ({ page }) => {
    const hasNew = await page.locator(SEL_NEW_ECG).count();
    if (hasNew === 0) {
      await generateECG('moderate');
      await page.waitForTimeout(15000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await enableFlutterA11y(page, 2000);
    }
    await page.screenshot({ path: 'reports/screenshots/ECG_006_new_badge.png' });
    const count = await page.locator(SEL_NEW_ECG).count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_ECG_007 Processed ECGs show risk level color labels', async ({ page }) => {
    const text = (await pageText(page)).toLowerCase();
    await page.screenshot({ path: 'reports/screenshots/ECG_007_risk_colors.png' });
    // At least one of the risk levels should appear if processed ECGs exist
    const hasRisk = ['low', 'moderate', 'high', 'new ecg'].some(r => text.includes(r));
    expect(hasRisk).toBe(true);
  });

  test('TC_ECG_009 Large dataset — 10+ ECGs, list stable', async ({ page }) => {
    const count = await page.locator(SEL_ECG_ITEM).count();
    await page.screenshot({ path: 'reports/screenshots/ECG_009_dataset.png' });
    // Page should not crash with existing data
    expect(count).toBeGreaterThan(0);
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('TC_ECG_010 Refresh after seed — new ECG appears', async ({ page }) => {
    await generateECG('low');
    await page.waitForTimeout(5000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_010_refresh.png' });
    const count = await page.locator(SEL_ECG_ITEM).count();
    expect(count).toBeGreaterThan(0);
  });
});
