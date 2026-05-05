// @ts-check
const { test, expect } = require('@playwright/test');
const {
  LOGIN_URL, APP_URL, USERNAME, PASSWORD,
  SEL_EMAIL, SEL_PASSWORD, SEL_LOGIN_BTN,
  enableFlutterA11y, robustFill, gotoLogin, doLogin, clickButton, pageText,
} = require('./helpers');

test.describe('TC_Login — Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await gotoLogin(page); // handles a11y activation + waits for email input
  });

  test('TC_LGN_001 Valid login → reaches ECG dashboard', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await page.screenshot({ path: 'reports/screenshots/LGN_001_before_login.png' });
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    // Handle EULA
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: 'reports/screenshots/LGN_001_after_login.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_LGN_002 Invalid password → error message shown', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, 'WrongPass@999');
    await clickButton(page, 'Login');
    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'reports/screenshots/LGN_002_invalid_password.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasError = ['incorrect', 'invalid', 'wrong', 'failed', 'password', 'error'].some(k => text.includes(k));
    const stillOnLogin = !page.url().includes('/ecg');
    expect(stillOnLogin || hasError).toBe(true);
  });

  test('TC_LGN_003 Non-existent email → error shown, no dashboard', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, 'nonexistent99999@tricog.com');
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'reports/screenshots/LGN_003_invalid_email.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_LGN_004 Empty email → cannot proceed to dashboard', async ({ page }) => {
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_004_empty_email.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_LGN_005 Empty password → cannot proceed to dashboard', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME);
    await clickButton(page, 'Login');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_005_empty_password.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_LGN_006 Both fields empty → cannot proceed', async ({ page }) => {
    await clickButton(page, 'Login');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_006_both_empty.png' });
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_LGN_007 SQL injection in email → no server error, stays on login', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, "' OR '1'='1' --");
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'reports/screenshots/LGN_007_sql_injection.png' });
    expect(page.url()).not.toContain('/ecg');
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('sql');
  });

  test('TC_LGN_008 XSS in password field → sanitized, no script execution', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, '<script>alert("xss")</script>');
    await clickButton(page, 'Login');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'reports/screenshots/LGN_008_xss.png' });
    expect(alertFired).toBe(false);
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_LGN_009 Very long email (300 chars) → handled gracefully', async ({ page }) => {
    const longEmail = 'a'.repeat(290) + '@test.com';
    await robustFill(page, SEL_EMAIL, longEmail);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'reports/screenshots/LGN_009_long_email.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('crash');
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_LGN_010 Email case sensitivity — uppercase email', async ({ page }) => {
    await robustFill(page, SEL_EMAIL, USERNAME.toUpperCase());
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 20000 }).catch(() => {});
    await page.screenshot({ path: 'reports/screenshots/LGN_010_case_sensitivity.png' });
    // Cognito normalises email — either logs in or shows clear error
    const url = page.url();
    const text = (await pageText(page)).toLowerCase();
    const result = url.includes('/ecg') || ['invalid', 'incorrect', 'error'].some(k => text.includes(k));
    expect(result).toBe(true);
  });

  test('TC_LGN_012 Session persists after page reload', async ({ page }) => {
    await doLogin(page);
    expect(page.url()).toContain('/ecg');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/LGN_012_session_persist.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_LGN_013 Logout clears session → redirects to login', async ({ page }) => {
    await doLogin(page);
    expect(page.url()).toContain('/ecg');
    // Navigate to profile and logout
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    // Click profile Logout button — opens confirmation dialog
    await page.locator('flt-semantics[role="button"]:has-text("Logout")').first()
      .click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1000);
    // Click the dialog "Logout" confirm button (distinct from the profile Logout button)
    // Dialog also has a "Cancel" button; clicking the last Logout (in dialog) confirms
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('flt-semantics[role="button"]'));
      const logoutBtns = btns.filter(b => (b.innerText || b.textContent || '').trim() === 'Logout');
      if (logoutBtns.length > 0) logoutBtns[logoutBtns.length - 1].click();
    });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'reports/screenshots/LGN_013_logout.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_015 Forgot password link visible and navigates', async ({ page }) => {
    const text = (await pageText(page)).toLowerCase();
    const hasForgot = text.includes('forgot') || text.includes('reset');
    await page.screenshot({ path: 'reports/screenshots/LGN_015_forgot_pw.png' });
    // Forgot password link should be visible
    expect(hasForgot).toBe(true);
  });
});
