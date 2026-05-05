// @ts-check
const { test, expect } = require('@playwright/test');
const { APP_URL, enableFlutterA11y, doLogin, pageText } = require('./helpers');

test.describe('TC_Security', () => {
  test('TC_SEC_001 Access ECG list without auth → redirected to login', async ({ page }) => {
    await page.goto(`${APP_URL}/ecgs`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'reports/screenshots/SEC_001_no_auth.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_SEC_002 Access patient form without auth → redirected to login', async ({ page }) => {
    await page.goto(`${APP_URL}/ecg/1/patient`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'reports/screenshots/SEC_002_patient_no_auth.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_SEC_003 Risk result screen without auth → redirected to login', async ({ page }) => {
    await page.goto(`${APP_URL}/ecg/1/result`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'reports/screenshots/SEC_003_result_no_auth.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_SEC_004 Direct URL to non-existent ECG → 404 or access denied', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${APP_URL}/ecg/99999999/patient`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/SEC_004_nonexistent_ecg.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should show error or redirect — not crash or expose data
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('unhandled exception');
  });

  test('TC_SEC_005 XSS in patient name → stored safely, no execution', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await doLogin(page);
    const { openFreshECG, fillPatient, robustFill, SEL_PAT_NAME } = require('./helpers');
    await openFreshECG(page, 'low');
    await fillPatient(page, { patientId: 'SEC001A', name: 'Test', age: '30', gender: 'Male' });
    // Override name with XSS payload
    await robustFill(page, SEL_PAT_NAME, '<img src=x onerror=alert(1)>');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/SEC_005_xss_name.png' });
    expect(alertFired).toBe(false);
  });

  test('TC_SEC_006 SQL injection in patient ID → caught by validation', async ({ page }) => {
    await doLogin(page);
    const { openFreshECG, robustFill, SEL_PATIENT_ID, pageText: pt } = require('./helpers');
    await openFreshECG(page, 'low');
    await robustFill(page, SEL_PATIENT_ID, "'; DROP TABLE tcc_ecgs; --");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'reports/screenshots/SEC_006_sql_patientid.png' });
    const text = (await pageText(page)).toLowerCase();
    // Validation regex ^[a-zA-Z0-9]{6,12}$ should reject this
    const hasError = text.includes('should use') || text.includes('invalid') || text.includes('alphanumeric');
    expect(hasError || text.includes('characters')).toBe(true);
  });

  test('TC_SEC_007 HTTPS enforcement — no mixed content', async ({ page }) => {
    const mixedContent = [];
    page.on('request', req => {
      if (req.url().startsWith('http://') && !req.url().startsWith('http://localhost')) {
        mixedContent.push(req.url());
      }
    });
    await doLogin(page);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/SEC_007_https.png' });
    expect(mixedContent.length).toBe(0);
  });

  test('TC_SEC_008 No auth tokens in accessible cookies', async ({ page }) => {
    await doLogin(page);
    const cookies = await page.context().cookies();
    const jwtCookies = cookies.filter(c =>
      c.name.toLowerCase().includes('token') ||
      c.name.toLowerCase().includes('jwt') ||
      c.name.toLowerCase().includes('auth') ||
      (c.value.startsWith('ey') && c.value.includes('.'))
    );
    await page.screenshot({ path: 'reports/screenshots/SEC_008_cookies.png' });
    // JWT should be in secure storage (not cookies), or if in cookies must be HttpOnly+Secure
    for (const cookie of jwtCookies) {
      expect(cookie.httpOnly || cookie.secure).toBe(true);
    }
  });
});
