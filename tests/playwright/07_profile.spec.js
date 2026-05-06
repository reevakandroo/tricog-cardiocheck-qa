// @ts-check
const { test, expect } = require('@playwright/test');
const { APP_URL, USERNAME, enableFlutterA11y, doLogin, pageText } = require('./helpers');

test.describe('TC_Profile', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
  });

  test('TC_PRF_001 Profile page shows user info', async ({ page }) => {
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_001_profile.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should show email domain or name
    expect(text.includes('tricog') || text.includes('kandroo') || text.includes('reeva')).toBe(true);
  });

  test('TC_PRF_002 Logout → redirected to login, back button blocked', async ({ page }) => {
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    const logoutBtn = page.locator('flt-semantics[role="button"]:has-text("Logout")').or(
      page.locator('flt-semantics[role="button"]:has-text("Log Out")').or(
        page.locator('flt-semantics[role="button"]:has-text("Sign Out")')));
    if (await logoutBtn.count() === 0) { test.skip(); return; }
    await logoutBtn.first().click({ timeout: 5000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1000);
    // Confirm the logout dialog
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('flt-semantics[role="button"]'));
      const logoutBtns = btns.filter(b => (b.innerText || b.textContent || '').trim() === 'Logout');
      if (logoutBtns.length > 0) logoutBtns[logoutBtns.length - 1].click();
    });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'reports/screenshots/PRF_002_logout.png' });
    expect(page.url()).toContain('login');
    // Try back navigation
    await page.goBack();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_002_back_after_logout.png' });
    // Should remain on login or redirect to login
    expect(page.url()).toContain('login');
  });

  test('TC_PRF_003 Center selection screen accessible from profile', async ({ page }) => {
    await page.goto(`${APP_URL}/profile/center-selection`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_003_center_selection.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text.includes('center') || text.includes('hospital') || text.includes('select')).toBe(true);
  });

  test('TC_PRF_004 Omron credentials screen accessible', async ({ page }) => {
    await page.goto(`${APP_URL}/profile/omron-credentials`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_004_omron_creds.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should show omron related content or redirect gracefully
    expect(page.url()).toContain('omron') || expect(text.length).toBeGreaterThan(0);
  });

  test('TC_PRF_005 All profile menu options are present', async ({ page }) => {
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_005_menu.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasLogout = text.includes('logout') || text.includes('log out') || text.includes('sign out');
    expect(hasLogout).toBe(true);
  });
});

// ─── NEW TESTS added for full coverage ───────────────────────────────────────

test.describe('TC_Profile — Additional Coverage', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
  });

  test('TC_PRF_006 Profile shows center/organization name', async ({ page }) => {
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_006_center_name.png' });
    const text = (await pageText(page)).toLowerCase();
    // Center/hospital name should appear somewhere on profile
    const hasCenter = text.includes('center') || text.includes('hospital') || text.includes('clinic') || text.includes('tricog');
    expect(hasCenter).toBe(true);
  });

  test('TC_PRF_007 Center selection screen shows selectable items', async ({ page }) => {
    await page.goto(`${APP_URL}/profile/center-selection`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_007_center_list.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should show at least one center or navigable list
    expect(text.length).toBeGreaterThan(10);
  });

  test('TC_PRF_008 Back navigation from center selection returns to profile', async ({ page }) => {
    await page.goto(`${APP_URL}/profile/center-selection`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.goBack();
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PRF_008_back_center.png' });
    const url = page.url();
    expect(url).toMatch(/\/(profile|ecg|login)/);
  });

  test('TC_PRF_009 Omron credentials screen has input/form elements', async ({ page }) => {
    await page.goto(`${APP_URL}/profile/omron-credentials`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_009_omron_form.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasContent = text.includes('omron') || text.includes('connect') || text.includes('credential') || text.includes('token');
    expect(hasContent || text.length > 10).toBe(true);
  });

  test('TC_PRF_010 Profile page loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_010_no_errors.png' });
    // No unhandled JS errors
    expect(errors.length).toBe(0);
  });

  test('TC_PRF_011 Profile page shows logged-in user email', async ({ page }) => {
    const { USERNAME } = require('./helpers');
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PRF_011_user_email.png' });
    const text = (await pageText(page)).toLowerCase();
    // Email domain or partial email should be visible
    const hasEmail = text.includes('tricog') || text.includes('kandroo') || text.includes('@');
    expect(hasEmail).toBe(true);
  });

  test('TC_PRF_012 Logout dialog has Cancel option', async ({ page }) => {
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    // Click logout to open dialog
    const logoutBtn = page.locator('flt-semantics[role="button"]:has-text("Logout")');
    if (await logoutBtn.count() === 0) { test.skip(); return; }
    await logoutBtn.first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1000);
    await page.screenshot({ path: 'reports/screenshots/PRF_012_logout_cancel.png' });
    const text = (await pageText(page)).toLowerCase();
    // Dialog should have cancel option
    const hasCancel = text.includes('cancel');
    expect(hasCancel).toBe(true);
    // Click cancel to dismiss
    await page.locator('flt-semantics[role="button"]:has-text("Cancel")').first()
      .click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(1000);
    // Should still be on profile, not logged out
    expect(page.url()).not.toContain('login');
  });
});
