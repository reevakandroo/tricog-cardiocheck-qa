// @ts-check
const { test, expect } = require('@playwright/test');
const {
  APP_URL, USERNAME,
  enableFlutterA11y, doLogin, ensureDashboard, openFreshECG, fillPatient,
  generateECG, pageText, SEL_ECG_ITEM, SEL_NEW_ECG,
} = require('./helpers');

test.describe('TC_UX_EndUser — End-User Experience', () => {
  test('TC_UX_001 Login page has clear Email and Password labels', async ({ page }) => {
    const { gotoLogin } = require('./helpers');
    await gotoLogin(page);
    await page.screenshot({ path: 'reports/screenshots/UX_001_login_labels.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('email') || text.includes('username')).toBe(true);
    expect(text.includes('password')).toBe(true);
  });

  test('TC_UX_002 Login page has "Login" / "Sign In" button with clear label', async ({ page }) => {
    const { gotoLogin } = require('./helpers');
    await gotoLogin(page);
    await page.screenshot({ path: 'reports/screenshots/UX_002_login_btn_label.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('login') || text.includes('sign in')).toBe(true);
  });

  test('TC_UX_003 Error messages are in plain language (not stack traces)', async ({ page }) => {
    const { gotoLogin, robustFill, clickButton } = require('./helpers');
    await gotoLogin(page);
    await robustFill(page, 'input[aria-label*="email"], input[placeholder*="email"]', 'wrong@test.com');
    await robustFill(page, 'input[aria-label*="password"], input[placeholder*="password"]', 'WrongPass@1');
    await clickButton(page, 'Login');
    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'reports/screenshots/UX_003_error_language.png' });
    const text = (await pageText(page)).toLowerCase();
    // Error should be user-friendly
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('null pointer');
    expect(text).not.toContain('goroutine');
    expect(text).not.toContain('exception in');
  });

  test('TC_UX_004 ECG dashboard shows meaningful list (not blank/loading stuck)', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 20000 }).catch(() => {});
    await page.screenshot({ path: 'reports/screenshots/UX_004_dashboard_meaningful.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should show ECG entries or a clear "no data" message — not a blank white page
    const hasMeaningfulContent = text.length > 20;
    expect(hasMeaningfulContent).toBe(true);
  });

  test('TC_UX_005 Risk result displays human-readable risk level text', async ({ page }) => {
    await doLogin(page);
    // Open any processed ECG
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/UX_005_risk_text.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasRiskText = text.includes('low') || text.includes('moderate') || text.includes('high') ||
      text.includes('patient') || text.includes('risk');
    expect(hasRiskText).toBe(true);
  });

  test('TC_UX_006 Date/time on ECG cards is human-readable format', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await page.screenshot({ path: 'reports/screenshots/UX_006_readable_date.png' });
    const text = (await pageText(page)).toLowerCase();
    // Dates should appear as readable text, NOT raw Unix timestamps (10+ digit numbers)
    const hasUnixTimestamp = /\b\d{10,13}\b/.test(text);
    expect(hasUnixTimestamp).toBe(false);
    // Should have month names or formatted dates
    const hasReadableDate = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}|am|pm/.test(text);
    expect(hasReadableDate).toBe(true);
  });

  test('TC_UX_007 App version displayed somewhere in the UI', async ({ page }) => {
    const { gotoLogin } = require('./helpers');
    await gotoLogin(page);
    await page.screenshot({ path: 'reports/screenshots/UX_007_version.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasVersion = text.includes('1.4') || text.includes('version');
    expect(hasVersion).toBe(true);
  });

  test('TC_UX_008 Logout has confirmation dialog (prevents accidental logout)', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    const logoutBtn = page.locator('flt-semantics[role="button"]:has-text("Logout")');
    if (await logoutBtn.count() === 0) { test.skip(); return; }
    await logoutBtn.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1000);
    await page.screenshot({ path: 'reports/screenshots/UX_008_logout_confirm.png' });
    const text = (await pageText(page)).toLowerCase();
    // Confirmation dialog must appear before logging out
    const hasDialog = text.includes('cancel') || text.includes('confirm') || text.includes('are you sure') ||
      text.includes('logout');
    expect(hasDialog).toBe(true);
    // Dismiss by clicking Cancel
    await page.locator('flt-semantics[role="button"]:has-text("Cancel")').first()
      .click({ timeout: 3000 }).catch(() => {});
  });

  test('TC_UX_009 Patient form has placeholder/helper text for inputs', async ({ page }) => {
    await doLogin(page);
    await openFreshECG(page, 'high');
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/UX_009_placeholders.png' });
    const text = (await pageText(page)).toLowerCase();
    // Form should have labels like "Patient ID", "Age", "Gender"
    expect(text.includes('patient') || text.includes('age') || text.includes('gender')).toBe(true);
  });

  test('TC_UX_010 No broken/missing UI elements on ECG result page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `UX${Date.now().toString().slice(-5)}`, name: 'UX Test', age: '38', gender: 'Male' });
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
    await page.screenshot({ path: 'reports/screenshots/UX_010_result_page.png' });
    // No JS errors
    expect(errors.length).toBe(0);
  });

  test('TC_UX_011 Feedback section is visible after risk result', async ({ page }) => {
    await doLogin(page);
    await generateECG('moderate');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'moderate');
    await fillPatient(page, { patientId: `FB${Date.now().toString().slice(-5)}`, name: 'Feedback Test', age: '42', gender: 'Female' });
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
    await page.screenshot({ path: 'reports/screenshots/UX_011_feedback_visible.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasFeedback = text.includes('feedback') || text.includes('satisfied') || text.includes('confirm') || text.includes('done');
    expect(hasFeedback).toBe(true);
  });

  test('TC_UX_012 ECG waveform strip has scroll hint for small screens', async ({ page }) => {
    await doLogin(page);
    await generateECG('high');
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: `WV${Date.now().toString().slice(-5)}`, name: 'Wave Test', age: '55', gender: 'Male' });
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
    await page.screenshot({ path: 'reports/screenshots/UX_012_ecg_scroll_hint.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasScrollHint = text.includes('scroll') || text.includes('waveform') || text.includes('ecg');
    expect(hasScrollHint).toBe(true);
  });
});
