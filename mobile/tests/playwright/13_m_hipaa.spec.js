// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, gotoLogin, enableFlutterA11y, clickButton, pageText, APP_URL, USERNAME } = require('./helpers');

test.describe('TC_Mobile_HIPAA — Compliance', () => {
  test('TC_MHPA_001 PHI not stored unencrypted in browser storage', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    // Navigate to ECG list and open an entry
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(4000);
    }
    const storage = await page.evaluate(() => {
      const allData = { ...localStorage, ...sessionStorage };
      const keys = Object.keys(allData);
      const phiPatterns = keys.filter(k => /patient|name|age|ecg|phi|health/i.test(k) || /patient|name|age/i.test(allData[k]));
      return { totalKeys: keys.length, phiPatterns, values: keys.slice(0,10).map(k => ({ k, v: allData[k].substring(0, 50) })) };
    });
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_001_phi_storage.png' });
    console.log(`Browser storage PHI check: ${JSON.stringify(storage)}`);
    expect(storage.phiPatterns.length).toBe(0);
  });

  test('TC_MHPA_002 PHI not present in URL path or query parameters', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    const urls = [];
    page.on('response', resp => urls.push(resp.url()));
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(4000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_002_url_phi.png' });
    const phiUrls = urls.filter(u => /name=|age=|patient=|dob=|ssn=/i.test(u));
    console.log(`URLs with PHI in params: ${phiUrls}`);
    expect(phiUrls.length).toBe(0);
  });

  test('TC_MHPA_003 Minimum necessary PHI — only required fields shown', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_003_minimum_phi.png' });
    const text = await pageText(page);
    // SSN, date of birth, address should not appear
    const hasExcessPHI = /social security|ssn|\bssn\b|date of birth|home address|phone number/i.test(text);
    console.log(`Excess PHI fields visible: ${hasExcessPHI}`);
    expect(hasExcessPHI).toBe(false);
  });

  test('TC_MHPA_004 TLS in use — all requests go over HTTPS', async ({ page }) => {
    const httpRequests = [];
    page.on('request', req => { if (req.url().startsWith('http://')) httpRequests.push(req.url()); });
    await doLogin(page);
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_004_tls.png' });
    console.log(`HTTP (non-TLS) requests: ${httpRequests}`);
    expect(httpRequests.length).toBe(0);
  });

  test('TC_MHPA_005 Center isolation — cross-center data not accessible', async ({ page }) => {
    // Account B logs in — different center
    const { robustFill, SEL_EMAIL, SEL_PASSWORD, USERNAME2, PASSWORD2 } = require('./helpers');
    await gotoLogin(page);
    await robustFill(page, SEL_EMAIL, USERNAME2);
    await robustFill(page, SEL_PASSWORD, PASSWORD2);
    await clickButton(page, 'Login');
    await page.waitForTimeout(10000);
    if (page.url().includes('eula')) {
      await enableFlutterA11y(page, 1500);
      await page.locator('flt-semantics[role="button"]:has-text("Agree")').first().click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }
    await enableFlutterA11y(page, 2000);
    const text = await pageText(page);
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_005_center_isolation.png' });
    // Should not see Account A's data
    const hasCrossData = text.includes(USERNAME) && !text.includes(USERNAME2);
    console.log(`Cross-center data leak: ${hasCrossData}`);
    expect(hasCrossData).toBe(false);
  });

  test('TC_MHPA_006 Session timeout — PHI not accessible after token expiry', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    // Invalidate session by clearing cookies
    await page.context().clearCookies();
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    // Try to access protected route
    await page.goto(`${APP_URL}/#/ecg`, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_006_session_timeout.png' });
    const redirectedToLogin = page.url().includes('login') || (await pageText(page)).toLowerCase().includes('email');
    console.log(`Redirected after session clear: ${redirectedToLogin}`);
    expect(redirectedToLogin).toBe(true);
  });

  test('TC_MHPA_007 No PHI in network request URL params', async ({ page }) => {
    const apiUrls = [];
    page.on('request', req => { if (req.url().includes('/v1/')) apiUrls.push(req.url()); });
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_007_api_urls.png' });
    const phiInUrls = apiUrls.filter(u => /name=|dob=|ssn=|patient_name=/i.test(u));
    console.log(`API URLs captured: ${apiUrls.length}, PHI in URLs: ${phiInUrls}`);
    expect(phiInUrls.length).toBe(0);
  });

  test('TC_MHPA_008 No PHI in browser history / browser back reveals no raw PHI', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    const items = page.locator('flt-semantics[role="button"]');
    if (await items.count() > 0) {
      await items.nth(0).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(4000);
    }
    // Navigate away
    await page.goto('about:blank').catch(() => {});
    await page.goBack().catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MHPA_008_back_history.png' });
    const urlAfterBack = page.url();
    console.log(`URL after back navigation: ${urlAfterBack}`);
    // URL should not expose raw patient identifiers
    expect(urlAfterBack).not.toMatch(/patient_name=|dob=|ssn=/i);
  });
});
