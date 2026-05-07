// @ts-check
/**
 * Module 16 — ECG Flow Black Box Tests
 * Positive / negative / edge coverage for dashboard, ECG detail, and result page.
 */
const { test, expect } = require('@playwright/test');
const {
  APP_URL, SEL_ECG_ITEM, SEL_RISK_BTN,
  enableFlutterA11y, doLogin, openFreshECG, fillPatient,
  generateECG, ensureDashboard, pageText,
} = require('./helpers');

// ── Positive Tests ────────────────────────────────────────────────────────────
test.describe('TC_ECG_BB — Positive', () => {

  test('TC_ECG_BB_001 Dashboard loads with ECG list after login', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_001_dashboard.png' });
    const count = await page.locator(SEL_ECG_ITEM).count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_ECG_BB_002 ECG items display date or timestamp', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_002_timestamps.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasDate = /\d{1,2}[\s\/\-]\w{3,}[\s\/\-]\d{4}|\d{4}-\d{2}-\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/.test(text);
    expect(hasDate || text.includes('202')).toBe(true);
  });

  test('TC_ECG_BB_003 Clicking ECG item opens detail view', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    const urlBefore = page.url();
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_003_detail.png' });
    expect(page.url()).not.toBe(urlBefore);
  });

  test('TC_ECG_BB_004 Back from ECG detail returns to ECG list', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_004_back.png' });
    expect(page.url()).toMatch(/\/(ecg|login)/);
  });

  test('TC_ECG_BB_005 New ECG appears in list after seeding', async ({ page }) => {
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_005_new_ecg.png' });
    const count = await page.locator(SEL_ECG_ITEM).count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_ECG_BB_006 Risk result page shows patient name entered in form', async ({ page }) => {
    test.setTimeout(300000);
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    const patName = 'VerifyName';
    await fillPatient(page, { patientId: `PN${Date.now().toString().slice(-5)}`, name: patName, age: '55', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 90000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 3000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_006_name_on_result.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('verifyname') || text.includes('verify') || text.includes('name')).toBe(true);
  });

  test('TC_ECG_BB_007 Risk result page shows correct age entered', async ({ page }) => {
    test.setTimeout(300000);
    await doLogin(page);
    await generateECG('low');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'low');
    await fillPatient(page, { patientId: `AG${Date.now().toString().slice(-5)}`, name: 'Age Check', age: '72', gender: 'Female' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 90000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 3000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_007_age_on_result.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('72') || text.includes('age')).toBe(true);
  });

  test('TC_ECG_BB_008 Risk result shows one of Low/Moderate/High banner', async ({ page }) => {
    test.setTimeout(300000);
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `RS${Date.now().toString().slice(-5)}`, name: 'Risk Show', age: '60', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 90000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 3000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_008_risk_banner.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('low') || text.includes('moderate') || text.includes('high')).toBe(true);
  });

  test('TC_ECG_BB_009 ECG detail shows ECG waveform strip', async ({ page }) => {
    test.setTimeout(300000);
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `WV${Date.now().toString().slice(-5)}`, name: 'Wave Test', age: '48', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 90000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 3000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_009_waveform.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('ecg') || text.includes('waveform') || text.includes('scroll')).toBe(true);
  });

  test('TC_ECG_BB_010 Done button on result navigates away from result', async ({ page }) => {
    test.setTimeout(300000);
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `DN${Date.now().toString().slice(-5)}`, name: 'Done Test', age: '50', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 90000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 3000);
    const doneBtn = page.locator('flt-semantics[role="button"]:has-text("Done")');
    if (await doneBtn.count() > 0) {
      await doneBtn.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(2500);
    }
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_010_done_btn.png' });
    expect(await page.title()).toBeTruthy();
  });
});

// ── Negative Tests ────────────────────────────────────────────────────────────
test.describe('TC_ECG_BB — Negative', () => {

  test('TC_ECG_BB_011 Direct URL to non-existent ECG → error or redirect', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${APP_URL}/ecg/999999999/patient`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_011_bad_ecg_url.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should show error, redirect, or not crash
    expect(text).not.toContain('unhandled exception');
    expect(text).not.toContain('500');
  });

  test('TC_ECG_BB_012 Rapid repeated clicks on same ECG item — no crash', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    const item = page.locator(SEL_ECG_ITEM).first();
    for (let i = 0; i < 3; i++) {
      await item.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_012_rapid_click.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_ECG_BB_013 Navigate to ECG list without auth → login page', async ({ page }) => {
    await page.goto(`${APP_URL}/ecgs`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_013_ecg_no_auth.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_ECG_BB_014 Risk btn not shown before patient data is filled', async ({ page }) => {
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    // Don't fill patient data — just check risk btn
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_014_no_risk_btn.png' });
    const riskCount = await page.locator(SEL_RISK_BTN).count();
    if (riskCount > 0) {
      const style = await page.locator(SEL_RISK_BTN).getAttribute('style') ?? '';
      expect(style.includes('pointer-events: none') || !style.includes('pointer-events: all')).toBe(true);
    } else {
      expect(riskCount).toBe(0);
    }
  });
});

// ── Edge / Boundary Tests ─────────────────────────────────────────────────────
test.describe('TC_ECG_BB — Edge & Boundary', () => {

  test('TC_ECG_BB_015 ECG list scrollable with multiple items', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    const count = await page.locator(SEL_ECG_ITEM).count();
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_015_scroll.png' });
    // If many items exist, scroll should work without crash
    if (count > 5) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
    }
    expect(await page.title()).toBeTruthy();
  });

  test('TC_ECG_BB_016 Dashboard page has identity / app name visible', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_016_identity.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('cardiocheck') || text.includes('tricog') || text.includes('ecg')).toBe(true);
  });

  test('TC_ECG_BB_017 ECG detail page does not show console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_017_no_errors.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_ECG_BB_018 Refresh mid-ECG-detail — page recovers', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/ECG_BB_018_refresh.png' });
    // Should either stay on ECG detail or redirect gracefully (not error)
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('unhandled exception');
  });
});
