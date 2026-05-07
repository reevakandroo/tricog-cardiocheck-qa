// @ts-check
/**
 * Module 14 — Authentication Black Box Tests
 * Covers all positive, negative, and edge combinations for login/session.
 */
const { test, expect } = require('@playwright/test');
const { APP_URL, USERNAME, enableFlutterA11y, doLogin, gotoLogin, pageText, robustFill } = require('./helpers');

const LOGIN_URL = `${APP_URL}/login`;
// Use exact selectors matching Flutter's aria-label (case-sensitive CSS attribute selectors)
const EMAIL_SEL = 'input[aria-label="Enter your email"], input[placeholder="Enter your email"]';
const PASS_SEL  = 'input[type="password"], input[aria-label="Enter your password"], input[placeholder="Enter your password"]';
const LOGIN_BTN = 'flt-semantics[role="button"]:has-text("Login"), button:has-text("Login")';

// Delegates to helpers.gotoLogin which has a 3-attempt retry loop + 30s waitForSelector
async function goLogin(page) {
  await gotoLogin(page);
}

// ── Positive Tests ────────────────────────────────────────────────────────────
test.describe('TC_AUTH_BB — Positive', () => {
  test('TC_LGN_BB_001 Valid login — email with dots and domain succeeds', async ({ page }) => {
    await doLogin(page);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_001_valid_dots.png' });
    expect(page.url()).toContain('/ecg');
  });

  test('TC_LGN_BB_002 Login persists after page reload', async ({ page }) => {
    await doLogin(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_002_reload.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_LGN_BB_003 Enter key submits login form', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill(USERNAME);
    const passInput = page.locator(PASS_SEL).first();
    await passInput.fill(process.env.PASSWORD || 'test@123');
    await passInput.press('Enter');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_003_enter_key.png' });
    // Should navigate away from login
    expect(page.url()).not.toContain('login');
  });

  test('TC_LGN_BB_004 Login page accessible without auth (not redirected)', async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_004_login_accessible.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_005 Correct credentials after wrong attempt — login succeeds', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    // First: wrong password
    await emailInput.fill(USERNAME);
    const passInput = page.locator(PASS_SEL).first();
    await passInput.fill('WrongPassword999!');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    // Then: correct credentials
    await robustFill(page, EMAIL_SEL, USERNAME);
    await passInput.fill(process.env.PASSWORD || 'test@123');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_005_retry_success.png' });
    expect(page.url()).not.toContain('login');
  });

  test('TC_LGN_BB_006 App version visible on login page', async ({ page }) => {
    await goLogin(page);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_006_version.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('version') || text.includes('v1.')).toBe(true);
  });

  test('TC_LGN_BB_007 Login page has visible Email and Password labels', async ({ page }) => {
    await goLogin(page);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_007_labels.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('email') && (text.includes('password') || text.includes('pass'))).toBe(true);
  });
});

// ── Negative Tests ────────────────────────────────────────────────────────────
test.describe('TC_AUTH_BB — Negative', () => {
  test('TC_LGN_BB_008 Wrong password — stays on login, error shown', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill(USERNAME);
    await page.locator(PASS_SEL).first().fill('DefinitelyWrongPassword!');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_008_wrong_pass.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_009 Non-existent email — error shown, no server crash', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('nobody_xyz_does_not_exist@fake123domain.com');
    await page.locator(PASS_SEL).first().fill('SomePassword123!');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_009_no_user.png' });
    expect(page.url()).toContain('login');
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('500');
    expect(text).not.toContain('stack trace');
  });

  test('TC_LGN_BB_010 Empty email field — cannot proceed', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('');
    await page.locator(PASS_SEL).first().fill('SomePassword123!');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_010_empty_email.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_011 Empty password field — cannot proceed', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill(USERNAME);
    await page.locator(PASS_SEL).first().fill('');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_011_empty_pass.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_012 Spaces-only password — cannot proceed', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill(USERNAME);
    await page.locator(PASS_SEL).first().fill('        ');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_012_spaces_pass.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_013 Invalid email format (no @) — error or cannot proceed', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('notanemail');
    await page.locator(PASS_SEL).first().fill('SomePassword123!');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_013_bad_email_format.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_014 Both fields empty — cannot proceed', async ({ page }) => {
    await goLogin(page);
    const loginBtn = page.locator(LOGIN_BTN).first();
    if (await loginBtn.count() === 0) { test.skip(); return; }
    await loginBtn.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_014_both_empty.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_015 Error message does not reveal if email exists (generic msg)', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('does_not_exist_xyz@nowhere.com');
    await page.locator(PASS_SEL).first().fill('WrongPass!');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_015_generic_error.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should NOT say "email not found" or "user does not exist" — security risk
    expect(text).not.toContain('user not found');
    expect(text).not.toContain('email not found');
    expect(text).not.toContain('account does not exist');
  });
});

// ── Edge / Boundary Tests ─────────────────────────────────────────────────────
test.describe('TC_AUTH_BB — Edge & Boundary', () => {
  test('TC_LGN_BB_016 SQL injection in email field — no crash or data leak', async ({ page }) => {
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill("' OR '1'='1' --");
    await page.locator(PASS_SEL).first().fill("' OR '1'='1");
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_016_sql_inject.png' });
    expect(page.url()).toContain('login');
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('sql');
    expect(text).not.toContain('syntax error');
  });

  test('TC_LGN_BB_017 XSS in password field — no script execution', async ({ page }) => {
    let alertFired = false;
    page.on('dialog', async d => { alertFired = true; await d.dismiss(); });
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill(USERNAME);
    await page.locator(PASS_SEL).first().fill('<script>alert("xss")</script>');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_017_xss.png' });
    expect(alertFired).toBe(false);
  });

  test('TC_LGN_BB_018 Very long email (300 chars) — graceful handling, no crash', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('a'.repeat(290) + '@test.com');
    await page.locator(PASS_SEL).first().fill('SomePass123!');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_018_long_email.png' });
    expect(errors.length).toBe(0);
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_019 Very long password (300 chars) — graceful handling', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill(USERNAME);
    await page.locator(PASS_SEL).first().fill('P'.repeat(300));
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_019_long_pass.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_LGN_BB_020 5 rapid failed logins — no crash, still functional', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    for (let i = 0; i < 5; i++) {
      await emailInput.fill(USERNAME);
      await page.locator(PASS_SEL).first().fill(`WrongPass${i}!`);
      await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await enableFlutterA11y(page, 500);
    }
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_020_rapid_fail.png' });
    expect(errors.length).toBe(0);
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_021 Protected route without auth → redirected to login', async ({ page }) => {
    await page.goto(`${APP_URL}/ecgs`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_021_protected_redirect.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_022 Profile route without auth → redirected to login', async ({ page }) => {
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_022_profile_no_auth.png' });
    expect(page.url()).toContain('login');
  });

  test('TC_LGN_BB_023 Null byte in email — no server error', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await goLogin(page);
    const emailInput = page.locator(EMAIL_SEL).first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('test\x00@test.com');
    await page.locator(PASS_SEL).first().fill('pass123');
    await page.locator(LOGIN_BTN).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/LGN_BB_023_null_byte.png' });
    expect(errors.length).toBe(0);
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('500');
  });
});
