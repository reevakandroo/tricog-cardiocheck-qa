// @ts-check
const { test, expect } = require('@playwright/test');
const {
  APP_URL, USERNAME, PASSWORD,
  SEL_EMAIL, SEL_PASSWORD, SEL_ECG_ITEM, SEL_NEW_ECG, SEL_EXPORT_PDF,
  enableFlutterA11y, robustFill, clickButton, gotoLogin,
  doLogin, ensureDashboard, openFreshECG, fillPatient,
  generateECG, pageText,
} = require('./helpers');

test.describe('TC_Performance — Response Time Benchmarks', () => {
  test('TC_PERF_001 Login completes within 10 seconds (network round-trip)', async ({ page }) => {
    await gotoLogin(page);
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    const start = Date.now();
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    const elapsed = Date.now() - start;
    await page.screenshot({ path: 'reports/screenshots/PERF_001_login_time.png' });
    // Railway.app cold start can be slow — allow 10s
    expect(elapsed).toBeLessThan(10000);
  });

  test('TC_PERF_002 ECG list loads within 5 seconds after login', async ({ page }) => {
    await doLogin(page);
    const start = Date.now();
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 20000 }).catch(() => {});
    const elapsed = Date.now() - start;
    await page.screenshot({ path: 'reports/screenshots/PERF_002_list_load.png' });
    expect(elapsed).toBeLessThan(5000);
  });

  test('TC_PERF_003 ECG detail view opens within 5 seconds', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    const start = Date.now();
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForURL(url => /\/(patient|result)/.test(url.href), { timeout: 15000 }).catch(() => {});
    const elapsed = Date.now() - start;
    await page.screenshot({ path: 'reports/screenshots/PERF_003_detail_load.png' });
    expect(elapsed).toBeLessThan(5000);
  });

  test('TC_PERF_004 Risk assessment result appears within 60 seconds', async ({ page }) => {
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `PF${Date.now().toString().slice(-5)}`, name: 'Perf Test', age: '45', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator('flt-semantics[role="button"]:has-text("Get Risk Assessment")');
    if (await riskBtn.count() === 0) { test.skip(); return; }
    const start = Date.now();
    await riskBtn.click({ timeout: 8000 });
    await page.waitForFunction(
      () => ['low', 'moderate', 'high'].some(v =>
        Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
      ),
      { timeout: 60000 }
    ).catch(() => {});
    const elapsed = Date.now() - start;
    await page.screenshot({ path: 'reports/screenshots/PERF_004_risk_time.png' });
    // Risk result must appear within 60 seconds
    expect(elapsed).toBeLessThan(60000);
  });

  test('TC_PERF_005 PDF export initiates within 10 seconds', async ({ page }) => {
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `PX${Date.now().toString().slice(-5)}`, name: 'PDF Perf', age: '50', gender: 'Female' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1500);
    const riskBtn = page.locator('flt-semantics[role="button"]:has-text("Get Risk Assessment")');
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 });
      await page.waitForFunction(
        () => ['low', 'moderate', 'high'].some(v =>
          Array.from(document.querySelectorAll('flt-semantics')).map(e => e.innerText || '').join(' ').toLowerCase().includes(v)
        ),
        { timeout: 45000 }
      ).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    const exportBtn = page.locator(SEL_EXPORT_PDF);
    if (await exportBtn.count() === 0) { test.skip(); return; }
    const start = Date.now();
    await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
      exportBtn.first().click({ timeout: 5000 }).catch(() => {}),
    ]);
    const elapsed = Date.now() - start;
    await page.screenshot({ path: 'reports/screenshots/PERF_005_pdf_time.png' });
    expect(elapsed).toBeLessThan(10000);
  });

  test('TC_PERF_006 Mock ECG appears in dashboard within 35 seconds of seeding', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const res = await generateECG('high');
    expect(res.status).toBe(200);
    const t0 = Date.now();
    let elapsed = 0;
    let appeared = false;
    while (elapsed < 35000) {
      await page.waitForTimeout(5000);
      elapsed = Date.now() - t0;
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await enableFlutterA11y(page, 1500);
      if ((await page.locator(SEL_NEW_ECG).count()) > 0) {
        appeared = true;
        break;
      }
    }
    await page.screenshot({ path: 'reports/screenshots/PERF_006_ecg_appear.png' });
    expect(appeared).toBe(true);
    expect(elapsed).toBeLessThan(35000);
  });

  test('TC_PERF_007 Profile page loads within 4 seconds', async ({ page }) => {
    await doLogin(page);
    const start = Date.now();
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);
    await enableFlutterA11y(page, 1000);
    const elapsed = Date.now() - start;
    await page.screenshot({ path: 'reports/screenshots/PERF_007_profile_load.png' });
    expect(elapsed).toBeLessThan(4000);
  });
});
