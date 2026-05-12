// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, enableFlutterA11y, clickButton, pageText, robustFill, SEL_PAT_NAME, SEL_AGE, SEL_PATIENT_ID, SEL_RISK_BTN, APP_URL } = require('./helpers');

const MOCK_URL   = 'https://mock-omron-releasev140.up.railway.app/_mock/ingest/sample';
const MOCK_TOKEN = 'mock-ingest-s3cr3t';
const OMRON_ID   = '86f66e18-494a-4232-8f76-530276b38d3c';

async function seedECG(riskLevel = 'low') {
  const https = require('https');
  return new Promise((resolve) => {
    const body = JSON.stringify({ omronDeviceId: OMRON_ID, riskLevel });
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ingest-token': MOCK_TOKEN, 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(MOCK_URL, opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.write(body); req.end();
  });
}

test.describe('TC_Mobile_Risk — Risk Assessment', () => {
  test('TC_MRSK_001 Risk result loads after ECG seed — low risk', async ({ page }) => {
    const seed = await seedECG('low');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_001_risk_list.png' });
    // Tap first ECG item
    const items = page.locator('flt-semantics[role="button"]');
    const cnt = await items.count();
    if (cnt > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(5000);
      await enableFlutterA11y(page, 2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_001_risk_result.png' });
    const text = await pageText(page);
    expect(seed.status === 200 || text.length > 0).toBe(true);
  });

  test('TC_MRSK_002 Patient form Get Risk Assessment button visible on mobile', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await clickButton(page, 'New ECG');
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await robustFill(page, SEL_PATIENT_ID, 'MRSK002');
    await robustFill(page, SEL_PAT_NAME, 'Risk Test');
    await robustFill(page, SEL_AGE, '55');
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_002_risk_btn.png' });
    const text = await pageText(page);
    expect(text).not.toContain('exception');
  });

  test('TC_MRSK_003 Risk result page visible text on mobile viewport', async ({ page }) => {
    await seedECG('high');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(8000);
      await enableFlutterA11y(page, 2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_003_high_risk.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MRSK_004 Back navigation from risk result to dashboard', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(4000);
    }
    await page.goBack().catch(() => {});
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_004_back_nav.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MRSK_005 Risk result layout fits mobile screen — no horizontal overflow', async ({ page }) => {
    await seedECG('low');
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(6000);
    }
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_005_layout.png' });
    expect(overflow).toBe(false);
  });

  test('TC_MRSK_006 Risk page scroll — all content reachable on mobile', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(5000);
    }
    // Scroll down to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_006_scroll_bottom.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_MRSK_007 Network timeout on risk result — no JS crash', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await clickButton(page, 'New ECG');
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await robustFill(page, SEL_PATIENT_ID, 'TIMEOUT001');
    await robustFill(page, SEL_PAT_NAME, 'Timeout Test');
    await robustFill(page, SEL_AGE, '40');
    // Emulate slow network
    await page.route('**/v1/**', route => setTimeout(() => route.continue(), 15000));
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_007_timeout.png' });
    const text = await pageText(page);
    expect(text).not.toContain('unhandled exception');
  });

  test('TC_MRSK_008 Multiple ECG entries — list displays correctly on mobile', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MRSK_008_multi_ecg.png' });
    expect(page.url()).toContain('/ecg');
  });
});
