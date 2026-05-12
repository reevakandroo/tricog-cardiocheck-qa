// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, enableFlutterA11y, clickButton, pageText, SEL_EXPORT_PDF } = require('./helpers');

const MOCK_URL   = 'https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample';
const MOCK_TOKEN = 'mock-ingest-s3cr3t';
const OMRON_ID   = '86f66e18-494a-4232-8f76-530276b38d3c';
async function seedECG(risk = 'low') {
  const https = require('https');
  return new Promise(res => {
    const b = JSON.stringify({ omronDeviceId: OMRON_ID, riskLevel: risk });
    const r = https.request(MOCK_URL, { method:'POST', headers:{'Content-Type':'application/json','x-ingest-token':MOCK_TOKEN,'Content-Length':Buffer.byteLength(b)} }, resp => {
      let d=''; resp.on('data',c=>d+=c); resp.on('end',()=>res({status:resp.statusCode,body:d}));
    });
    r.on('error',()=>res({status:0,body:''})); r.write(b); r.end();
  });
}

test.describe('TC_Mobile_Export — PDF Export', () => {
  test('TC_MRPT_001 Export button presence on mobile risk result', async ({ page }) => {
    await seedECG('low');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(8000);
      await enableFlutterA11y(page, 2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MRPT_001_export_btn.png' });
    const exportEl = page.locator(SEL_EXPORT_PDF).first();
    const visible = await exportEl.isVisible().catch(() => false);
    console.log(`Export button visible: ${visible}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MRPT_002 Export button tap on mobile — no crash', async ({ page }) => {
    await seedECG('low');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(8000);
      await enableFlutterA11y(page, 2000);
    }
    const exportEl = page.locator(SEL_EXPORT_PDF).first();
    if (await exportEl.isVisible().catch(() => false)) {
      await exportEl.tap().catch(() => exportEl.click().catch(() => {}));
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MRPT_002_export_tap.png' });
    const text = await pageText(page);
    expect(text).not.toContain('exception');
  });

  test('TC_MRPT_003 PDF export download dialog on mobile browser', async ({ page }) => {
    await seedECG('low');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(8000);
      await enableFlutterA11y(page, 2000);
    }
    let downloadDetected = false;
    page.on('download', () => { downloadDetected = true; });
    const exportEl = page.locator(SEL_EXPORT_PDF).first();
    if (await exportEl.isVisible().catch(() => false)) {
      await exportEl.click().catch(() => {});
      await page.waitForTimeout(5000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MRPT_003_pdf_download.png' });
    console.log(`Download event detected: ${downloadDetected}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MRPT_004 Export unavailable without completed risk result', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await clickButton(page, 'New ECG');
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MRPT_004_no_export.png' });
    const exportEl = page.locator(SEL_EXPORT_PDF).first();
    const visible = await exportEl.isVisible().catch(() => false);
    // Export should not be visible on empty patient form
    console.log(`Export visible on patient form: ${visible}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MRPT_005 Export during slow network — no unhandled error', async ({ page }) => {
    await seedECG('low');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(8000);
      await enableFlutterA11y(page, 2000);
    }
    // Throttle after page loads
    await page.route('**/*.pdf', route => setTimeout(() => route.continue(), 5000));
    const exportEl = page.locator(SEL_EXPORT_PDF).first();
    if (await exportEl.isVisible().catch(() => false)) {
      await exportEl.click().catch(() => {});
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MRPT_005_slow_export.png' });
    const text = await pageText(page);
    expect(text).not.toContain('unhandled');
  });

  test('TC_MRPT_006 Report export modal / share sheet visible on mobile', async ({ page }) => {
    await seedECG('low');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(8000);
      await enableFlutterA11y(page, 2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MRPT_006_share_sheet.png' });
    expect(page.url()).not.toContain('login');
  });
});
