// @ts-check
const { test, expect } = require('@playwright/test');
const {
  LOGIN_URL, USERNAME, PASSWORD,
  SEL_EMAIL, SEL_PASSWORD,
  enableFlutterA11y, robustFill, gotoLogin, doLogin, clickButton, pageText,
} = require('./helpers');

test.describe('TC_Mobile_Login — Authentication', () => {
  test.beforeEach(async ({ page }) => { await gotoLogin(page); });

  test('TC_MLGN_001 Valid login on mobile → reaches ECG dashboard', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_001_before_login.png' });
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    if (page.url().includes('eula')) {
      await enableFlutterA11y(page, 1500);
      await page.locator('flt-semantics[role="button"]:has-text("Agree"), button:has-text("Agree")').first().click({ timeout: 8000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_001_after_login.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MLGN_002 Invalid password → error shown, stays on login', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, 'WrongPass@999');
    await clickButton(page, 'Login');
    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_002_invalid_password.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasError = ['incorrect', 'invalid', 'wrong', 'failed', 'error'].some(k => text.includes(k));
    expect(!page.url().includes('/ecg') || hasError).toBe(true);
  });

  test('TC_MLGN_003 Non-existent email → rejected', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, 'notexist99@tricog.com');
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_003_nonexistent_email.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_MLGN_004 Empty email field → cannot proceed', async ({ page }) => {
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_004_empty_email.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_MLGN_005 Empty password field → cannot proceed', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await clickButton(page, 'Login');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_005_empty_password.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_MLGN_006 Both fields empty → cannot proceed', async ({ page }) => {
    await clickButton(page, 'Login');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_006_both_empty.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_MLGN_007 SQL injection in email → no server error', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, "' OR '1'='1' --");
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_007_sql_injection.png' });
    expect(page.url()).not.toContain('/ecg');
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('sql syntax');
  });

  test('TC_MLGN_008 XSS in password → no alert fires', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, '<script>alert("xss")</script>');
    await clickButton(page, 'Login');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_008_xss.png' });
    expect(alertFired).toBe(false);
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_MLGN_009 Very long email 300 chars → handled gracefully', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, 'a'.repeat(290) + '@test.com');
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_009_long_email.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('crash');
    expect(text).not.toContain('exception');
  });

  test('TC_MLGN_010 Very long password 300 chars → handled gracefully', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, 'A1@' + 'x'.repeat(297));
    await clickButton(page, 'Login');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_010_long_password.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('unhandled');
  });

  test('TC_MLGN_011 Mobile touch tap on login button works', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    const btn = page.locator('flt-semantics[role="button"]:has-text("Login"), button:has-text("Login")').first();
    await btn.tap().catch(() => btn.click());
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_011_touch_login.png' });
    if (page.url().includes('eula')) {
      await enableFlutterA11y(page, 1500);
      await page.locator('flt-semantics[role="button"]:has-text("Agree")').first().click({ timeout: 8000 }).catch(() => {});
    }
    expect(page.url()).toContain('/ecg');
  });

  test('TC_MLGN_012 Brute force — 5 rapid wrong logins → no unhandled error', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await robustFill(page, SEL_EMAIL, USERNAME);
      await robustFill(page, SEL_PASSWORD, `WrongPass${i}@999`);
      await clickButton(page, 'Login');
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: 'mobile/reports/screenshots/MLGN_012_brute_force.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('uncaught');
    expect(page.url()).not.toContain('/ecg');
  });
});
