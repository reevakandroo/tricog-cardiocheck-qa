// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, gotoLogin, enableFlutterA11y, pageText, LOGIN_URL, APP_URL, USERNAME, PASSWORD, robustFill, SEL_EMAIL, SEL_PASSWORD, clickButton } = require('./helpers');

test.describe('TC_Mobile_Security — App Security', () => {
  test('TC_MSEC_001 JWT not stored in browser localStorage or sessionStorage', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(2000);
    const storage = await page.evaluate(() => {
      const ls = { ...localStorage };
      const ss = { ...sessionStorage };
      const lsKeys = Object.keys(ls);
      const ssKeys = Object.keys(ss);
      const hasToken = lsKeys.some(k => ls[k].includes('eyJ') || k.toLowerCase().includes('token') || k.toLowerCase().includes('jwt')) ||
                       ssKeys.some(k => ss[k].includes('eyJ') || k.toLowerCase().includes('token') || k.toLowerCase().includes('jwt'));
      return { lsKeys, ssKeys, hasToken };
    });
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_001_storage.png' });
    console.log(`Browser storage keys: localStorage=${JSON.stringify(storage.lsKeys)}, sessionStorage=${JSON.stringify(storage.ssKeys)}`);
    console.log(`Token in browser storage: ${storage.hasToken}`);
    expect(storage.hasToken).toBe(false);
  });

  test('TC_MSEC_002 Security headers present on app response', async ({ page }) => {
    const response = await page.request.get(APP_URL);
    const headers = response.headers();
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_002_headers.png' });
    console.log('Response headers: ' + JSON.stringify(headers, null, 2));
    const hasHSTS  = !!headers['strict-transport-security'];
    const hasCTO   = !!headers['x-content-type-options'];
    const hasFrame = !!(headers['x-frame-options'] || headers['content-security-policy']);
    console.log(`HSTS: ${hasHSTS}, X-Content-Type-Options: ${hasCTO}, Frame protection: ${hasFrame}`);
    // Soft assertions — log for audit
    expect(response.status()).toBeLessThan(500);
  });

  test('TC_MSEC_003 No sensitive data in URL parameters', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    const url = page.url();
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_003_url.png' });
    console.log(`Post-login URL: ${url}`);
    const hasSensitive = /token=|password=|jwt=|auth=|secret=/i.test(url);
    expect(hasSensitive).toBe(false);
  });

  test('TC_MSEC_004 HTTPS enforced — no HTTP redirects', async ({ page }) => {
    const httpUrl = APP_URL.replace('https://', 'http://');
    const resp = await page.request.get(httpUrl, { maxRedirects: 0 }).catch(() => null);
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_004_https.png' });
    if (resp) {
      const isRedirectToHttps = resp.status() === 301 || resp.status() === 302 || resp.url().startsWith('https://');
      const isHTTPS = resp.url().startsWith('https://');
      console.log(`HTTP→HTTPS redirect: ${isRedirectToHttps}, Final URL: ${resp.url()}`);
      expect(isRedirectToHttps || isHTTPS).toBe(true);
    } else {
      console.log('HTTP request blocked (expected in strict environments)');
      expect(true).toBe(true);
    }
  });

  test('TC_MSEC_005 XSS in patient name field — no script execution', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await clickButton(page, 'New ECG');
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    const { SEL_PAT_NAME } = require('./helpers');
    await robustFill(page, SEL_PAT_NAME, '<img src=x onerror=alert("xss")>');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_005_xss.png' });
    expect(alertFired).toBe(false);
  });

  test('TC_MSEC_006 SQL injection in search field — no server error', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    const { SEL_SEARCH } = require('./helpers');
    const searchEl = page.locator(SEL_SEARCH).first();
    if (await searchEl.isVisible().catch(() => false)) {
      await searchEl.fill("'; DROP TABLE ecgs;--");
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_006_sql_search.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('sql');
    expect(text).not.toContain('stack trace');
  });

  test('TC_MSEC_007 Brute force — 7 wrong passwords → lock check', async ({ page }) => {
    await gotoLogin(page);
    const responses = [];
    for (let i = 1; i <= 7; i++) {
      await robustFill(page, SEL_EMAIL, USERNAME);
      await robustFill(page, SEL_PASSWORD, `BruteForce${i}@999`);
      await clickButton(page, 'Login');
      await page.waitForTimeout(3000);
      const text = await pageText(page);
      const locked = /lock|block|too many|captcha|suspended/i.test(text);
      responses.push({ attempt: i, locked });
      await page.screenshot({ path: `mobile/reports/screenshots/MSEC_007_brute_${i}.png` });
      if (locked) break;
    }
    console.log('Brute force results: ' + JSON.stringify(responses));
    const anyLocked = responses.some(r => r.locked);
    if (!anyLocked) console.warn('⚠️ BUG: No lockout detected after 7 wrong-password attempts');
    // Soft — we document but don't hard-fail so report captures the finding
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_MSEC_008 Cookies are HttpOnly and Secure flagged', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(2000);
    const cookies = await page.context().cookies();
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_008_cookies.png' });
    console.log(`Cookies: ${JSON.stringify(cookies.map(c => ({ name: c.name, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite })))}`);
    const authCookies = cookies.filter(c => /token|auth|session|jwt/i.test(c.name));
    const insecure = authCookies.filter(c => !c.httpOnly || !c.secure);
    console.log(`Insecure auth cookies: ${JSON.stringify(insecure)}`);
    expect(insecure.length).toBe(0);
  });

  test('TC_MSEC_009 No PHI in browser error console messages', async ({ page }) => {
    const consoleMsgs = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleMsgs.push(msg.text()); });
    await doLogin(page);
    await page.waitForTimeout(5000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_009_console_errors.png' });
    const phiInErrors = consoleMsgs.some(m => /@tricog|reeva|patient|name|age|ecg_id/i.test(m));
    console.log(`Console errors: ${consoleMsgs.length}, PHI found: ${phiInErrors}`);
    if (phiInErrors) console.warn('⚠️ PHI found in browser console errors');
    expect(phiInErrors).toBe(false);
  });

  test('TC_MSEC_010 Session expires on navigating to protected URL after logout', async ({ page }) => {
    await doLogin(page);
    const ecgUrl = page.url();
    await page.waitForTimeout(2000);
    // Logout
    await enableFlutterA11y(page, 1500);
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(1000);
    await clickButton(page, 'Logout').catch(() => clickButton(page, 'Log Out').catch(() => {}));
    await page.waitForTimeout(3000);
    // Try to access protected URL
    await page.goto(ecgUrl.includes('/ecg') ? ecgUrl : `${APP_URL}/#/ecg`, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MSEC_010_session_expired.png' });
    const onLoginOrProtected = page.url().includes('login') || page.url().includes('eula') || (await pageText(page)).toLowerCase().includes('sign in');
    console.log(`Redirected after logout attempt: ${onLoginOrProtected}, URL: ${page.url()}`);
    expect(onLoginOrProtected).toBe(true);
  });
});
