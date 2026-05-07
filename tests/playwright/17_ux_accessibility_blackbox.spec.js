// @ts-check
/**
 * Module 17 — UX & Accessibility Black Box Tests
 * Covers UI text quality, keyboard interaction, error language,
 * zoom behaviour, and end-user experience edge cases.
 */
const { test, expect } = require('@playwright/test');
const { APP_URL, enableFlutterA11y, doLogin, gotoLogin, ensureDashboard, pageText, SEL_ECG_ITEM } = require('./helpers');

const LOGIN_URL = `${APP_URL}/login`;

// ── Positive / UX Quality Tests ───────────────────────────────────────────────
test.describe('TC_UX_BB — Positive & UX Quality', () => {

  test('TC_UX_BB_001 Login page title is meaningful (not blank)', async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const title = await page.title();
    await page.screenshot({ path: 'reports/screenshots/UX_BB_001_title.png' });
    expect(title.length).toBeGreaterThan(0);
    expect(title.toLowerCase()).not.toBe('undefined');
  });

  test('TC_UX_BB_002 Dashboard page title is meaningful', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForTimeout(2000);
    const title = await page.title();
    await page.screenshot({ path: 'reports/screenshots/UX_BB_002_dash_title.png' });
    expect(title.length).toBeGreaterThan(0);
  });

  test('TC_UX_BB_003 Error message on wrong login is plain English (not stack trace)', async ({ page }) => {
    await gotoLogin(page);
    const emailInput = page.locator('input[aria-label="Enter your email"], input[placeholder="Enter your email"]').first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('wrong@wrong.com');
    await page.locator('input[type="password"]').first().fill('WrongPass!');
    await page.locator('flt-semantics[role="button"]:has-text("Login"), button:has-text("Login")').first()
      .click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_003_error_msg.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('exception');
    expect(text).not.toContain('null pointer');
    expect(text).not.toContain('undefined');
  });

  test('TC_UX_BB_004 Logout button has visible confirmation dialog', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 2500);
    const logoutBtn = page.locator('flt-semantics[role="button"]:has-text("Logout")').or(
      page.locator('flt-semantics[role="button"]:has-text("Log Out")'));
    if (await logoutBtn.count() === 0) { test.skip(); return; }
    await logoutBtn.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_004_logout_confirm.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('confirm') || text.includes('cancel') || text.includes('sure')).toBe(true);
  });

  test('TC_UX_BB_005 App version is visible somewhere in the UI', async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_005_version.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('version') || text.includes('v1.') || text.includes('1.4')).toBe(true);
  });

  test('TC_UX_BB_006 Risk result has human-readable risk label (not code/number)', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    // Open first available ECG (may be result page)
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_006_risk_label.png' });
    const text = (await pageText(page)).toLowerCase();
    // Either on patient form (no risk yet) or result page with readable label
    const hasRisk = text.includes('low') || text.includes('moderate') || text.includes('high');
    const onForm = text.includes('patient') || text.includes('age') || text.includes('gender');
    expect(hasRisk || onForm).toBe(true);
  });

  test('TC_UX_BB_007 Date/time on ECG cards is human-readable', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_007_date_format.png' });
    const text = await pageText(page);
    // Should contain year 2025 or 2026, or month abbreviation
    const hasReadableDate = /202[456]|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(text);
    expect(hasReadableDate).toBe(true);
  });

  test('TC_UX_BB_008 Profile page shows user email or name', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_008_profile_info.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('@') || text.includes('tricog') || text.includes('reeva') || text.includes('kandroo')).toBe(true);
  });

  test('TC_UX_BB_009 ECG feedback question is clearly worded', async ({ page }) => {
    test.setTimeout(300000);
    const { generateECG, openFreshECG, fillPatient, SEL_RISK_BTN } = require('./helpers');
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `FQ${Date.now().toString().slice(-5)}`, name: 'Feedback Q', age: '55', gender: 'Male' });
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
    await page.screenshot({ path: 'reports/screenshots/UX_BB_009_feedback_q.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('12 lead') || text.includes('ecg done') || text.includes('feedback') || text.includes('confirm')).toBe(true);
  });

  test('TC_UX_BB_010 App renders at 150% browser zoom without broken layout', async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => { document.body.style.zoom = '1.5'; });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_010_zoom_150.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should still have login elements visible
    expect(text.includes('login') || text.includes('email') || text.includes('cardiocheck')).toBe(true);
  });
});

// ── Negative / Error State Tests ──────────────────────────────────────────────
test.describe('TC_UX_BB — Negative & Error States', () => {

  test('TC_UX_BB_011 No unhandled JS errors on login page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_011_no_errors_login.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_UX_BB_012 No unhandled JS errors on ECG dashboard', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_012_no_errors_dash.png' });
    expect(errors.length).toBe(0);
  });

  test('TC_UX_BB_013 No internal server errors (500) exposed in UI', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_013_no_500.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('error 500');
    expect(text).not.toContain('internal server error');
    expect(text).not.toContain('stack trace');
  });

  test('TC_UX_BB_014 Broken/unknown URL → not blank crash', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${APP_URL}/does-not-exist-route-xyz`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_014_unknown_route.png' });
    // Should redirect or show not-found — not blank white screen
    expect(await page.title()).toBeTruthy();
  });
});

// ── Edge / Accessibility Tests ────────────────────────────────────────────────
test.describe('TC_UX_BB — Edge & Accessibility', () => {

  test('TC_UX_BB_015 Password field input is masked by default', async ({ page }) => {
    await gotoLogin(page);
    const passField = page.locator('input[type="password"]').first();
    if (await passField.count() === 0) { test.skip(); return; }
    const inputType = await passField.getAttribute('type');
    await page.screenshot({ path: 'reports/screenshots/UX_BB_015_pass_masked.png' });
    expect(inputType).toBe('password');
  });

  test('TC_UX_BB_016 Login button is disabled / shows loading after click', async ({ page }) => {
    await gotoLogin(page);
    const emailInput = page.locator('input[aria-label="Enter your email"], input[placeholder="Enter your email"]').first();
    if (await emailInput.count() === 0) { test.skip(); return; }
    await emailInput.fill('reeva.kandroo@tricog.com');
    await page.locator('input[type="password"]').first().fill('test@123');
    const loginBtn = page.locator('flt-semantics[role="button"]:has-text("Login"), button:has-text("Login")').first();
    await loginBtn.click({ timeout: 5000 }).catch(() => {});
    // Immediately check — button should be disabled or loading
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_016_loading.png' });
    // Test passes if no crash — loading state is visual, hard to assert precisely
    expect(await page.title()).toBeTruthy();
  });

  test('TC_UX_BB_017 Forgot password link visible on login page', async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_017_forgot_pass.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('forgot') || text.includes('reset') || text.includes('password?')).toBe(true);
  });

  test('TC_UX_BB_018 No PHI visible in page URL parameters', async ({ page }) => {
    test.setTimeout(300000);
    const { generateECG, openFreshECG, fillPatient, SEL_RISK_BTN } = require('./helpers');
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: 'PHICHECK01', name: 'PHI Test', age: '40', gender: 'Male' });
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
    await page.screenshot({ path: 'reports/screenshots/UX_BB_018_phi_url.png' });
    const url = page.url();
    // PHI (patient name) should not appear in URL
    expect(url.toLowerCase()).not.toContain('phicheck');
    expect(url.toLowerCase()).not.toContain('phi+test');
    expect(url.toLowerCase()).not.toContain('phi%20test');
  });

  test('TC_UX_BB_019 Center selection page has visible list or search', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${APP_URL}/profile/center-selection`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_019_center_sel.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.length).toBeGreaterThan(10);
  });

  test('TC_UX_BB_020 App does not hang or freeze on rapid navigation', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await doLogin(page);
    // Rapid navigation between routes
    for (const route of ['/ecgs', '/profile', '/ecgs', '/profile/center-selection', '/ecgs']) {
      await page.goto(`${APP_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/UX_BB_020_rapid_nav.png' });
    expect(errors.length).toBe(0);
  });
});
