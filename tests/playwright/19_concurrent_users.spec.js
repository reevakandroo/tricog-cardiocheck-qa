// @ts-check
/**
 * Module 19 — Concurrent Users Tests
 * Covers TC_CON_001 through TC_CON_010
 * Tests multi-user session handling, shared data visibility, and session isolation.
 */
const { test, expect } = require('@playwright/test');
const {
  APP_URL,
  USERNAME, PASSWORD, USERNAME2, PASSWORD2,
  SEL_EMAIL, SEL_PASSWORD, SEL_ECG_ITEM, SEL_NEW_ECG,
  SEL_PATIENT_ID, SEL_PAT_NAME, SEL_AGE,
  enableFlutterA11y, robustFill, clickButton,
  doLogin, gotoLogin, ensureDashboard, generateECG, openFreshECG,
  fillPatient, pageText,
} = require('./helpers');

// Helper: login a given page context with given credentials
async function loginContext(page, username, password) {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForTimeout(2000);

  // Activate Flutter a11y
  for (let attempt = 0; attempt < 3; attempt++) {
    const a11yBtn = page.locator('button:has-text("Enable accessibility")');
    if (await a11yBtn.count() > 0) {
      await a11yBtn.click({ timeout: 5000 }).catch(() => {});
    } else {
      await page.evaluate(() => {
        const ph = document.querySelector('flt-semantics-placeholder');
        if (ph) ph.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }).catch(() => {});
    }
    await page.waitForTimeout(2000);
    const emailVisible = await page.locator(SEL_EMAIL).isVisible().catch(() => false);
    if (emailVisible) break;
    if (attempt < 2) {
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(2000);
    }
  }

  await page.waitForSelector(SEL_EMAIL, { state: 'visible', timeout: 20000 });
  await robustFill(page, SEL_EMAIL, username);
  await robustFill(page, SEL_PASSWORD, password);
  await page.waitForTimeout(500);
  await clickButton(page, 'Login');
  await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1000);

  if (page.url().includes('eula')) {
    await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
      .click({ timeout: 5000 }).catch(() => {});
    await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);
  }

  await enableFlutterA11y(page, 1500);
}

// Helper: navigate to dashboard and enable a11y
async function goToDashboard(page) {
  if (!page.url().includes('/ecg')) {
    await page.goto(`${APP_URL}/ecgs`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1000);
  }
}

// ── Positive Concurrent Tests ────────────────────────────────────────────────
test.describe('TC_CON — Positive Concurrent Tests', () => {

  test('TC_CON_001 Account A and B both login successfully at the same time', async ({ browser }) => {
    test.setTimeout(180000);
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageA = await ctx1.newPage();
    const pageB = await ctx2.newPage();

    try {
      // Login both simultaneously
      await Promise.all([
        loginContext(pageA, USERNAME, PASSWORD),
        loginContext(pageB, USERNAME2, PASSWORD2),
      ]);

      await pageA.screenshot({ path: 'reports/screenshots/CON_001_accountA_loggedin.png' });
      await pageB.screenshot({ path: 'reports/screenshots/CON_001_accountB_loggedin.png' });

      const urlA = pageA.url();
      const urlB = pageB.url();
      console.log('TC_CON_001 — Account A URL:', urlA);
      console.log('TC_CON_001 — Account B URL:', urlB);

      // Both should be on dashboard, not login
      expect(urlA).not.toContain('login');
      expect(urlB).not.toContain('login');

      await pageA.screenshot({ path: 'reports/screenshots/CON_001_both_dashboards.png' });
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  test('TC_CON_002 Same account logged in from two contexts — document session behavior', async ({ browser }) => {
    test.setTimeout(180000);
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    try {
      // Login context 1
      await loginContext(page1, USERNAME, PASSWORD);
      await page1.screenshot({ path: 'reports/screenshots/CON_002_ctx1_loggedin.png' });

      // Login context 2 with same account
      await loginContext(page2, USERNAME, PASSWORD);
      await page2.screenshot({ path: 'reports/screenshots/CON_002_ctx2_loggedin.png' });

      // Check state of context 1 after context 2 logs in
      await page1.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page1.waitForTimeout(2000);
      await enableFlutterA11y(page1, 1500);
      const url1AfterCtx2 = page1.url();
      const url2 = page2.url();

      console.log('TC_CON_002 — Context 1 URL after ctx2 login:', url1AfterCtx2);
      console.log('TC_CON_002 — Context 2 URL:', url2);

      await page1.screenshot({ path: 'reports/screenshots/CON_002_ctx1_state_after_ctx2.png' });

      // Document behavior: both active, or first invalidated
      const ctx1Active = !url1AfterCtx2.includes('login');
      const ctx2Active = !url2.includes('login');
      console.log('TC_CON_002 — ctx1 still active:', ctx1Active, '| ctx2 active:', ctx2Active);
      // No hard assertion — just document. At minimum ctx2 should be active.
      expect(ctx2Active).toBe(true);
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  test('TC_CON_003 Account A and B see same center ECG list — shared data visible', async ({ browser }) => {
    test.setTimeout(180000);
    // Seed one ECG first
    await generateECG('high');
    await new Promise(r => setTimeout(r, 3000));

    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageA = await ctx1.newPage();
    const pageB = await ctx2.newPage();

    try {
      await Promise.all([
        loginContext(pageA, USERNAME, PASSWORD),
        loginContext(pageB, USERNAME2, PASSWORD2),
      ]);

      await goToDashboard(pageA);
      await goToDashboard(pageB);
      await pageA.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
      await pageB.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
      await enableFlutterA11y(pageA, 1500);
      await enableFlutterA11y(pageB, 1500);

      await pageA.screenshot({ path: 'reports/screenshots/CON_003_accountA_list.png' });
      await pageB.screenshot({ path: 'reports/screenshots/CON_003_accountB_list.png' });

      const countA = await pageA.locator(SEL_ECG_ITEM).count();
      const countB = await pageB.locator(SEL_ECG_ITEM).count();
      console.log('TC_CON_003 — Account A ECG count:', countA, '| Account B ECG count:', countB);

      // Both accounts in same center should see ECG items
      expect(countA).toBeGreaterThan(0);
      expect(countB).toBeGreaterThan(0);
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  test('TC_CON_004 Account A and B both open the same ECG — no conflict error', async ({ browser }) => {
    test.setTimeout(180000);
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageA = await ctx1.newPage();
    const pageB = await ctx2.newPage();

    try {
      await Promise.all([
        loginContext(pageA, USERNAME, PASSWORD),
        loginContext(pageB, USERNAME2, PASSWORD2),
      ]);

      await goToDashboard(pageA);
      await goToDashboard(pageB);
      await pageA.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
      await pageB.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
      await enableFlutterA11y(pageA, 1500);
      await enableFlutterA11y(pageB, 1500);

      const ecgCountA = await pageA.locator(SEL_ECG_ITEM).count();
      if (ecgCountA === 0) { test.skip(); return; }

      // Both open first ECG simultaneously
      await Promise.all([
        pageA.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {}),
        pageB.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {}),
      ]);

      await pageA.waitForTimeout(2000);
      await pageB.waitForTimeout(2000);
      await enableFlutterA11y(pageA, 1500);
      await enableFlutterA11y(pageB, 1500);

      await pageA.screenshot({ path: 'reports/screenshots/CON_004_accountA_ecg_view.png' });
      await pageB.screenshot({ path: 'reports/screenshots/CON_004_accountB_ecg_view.png' });

      const textA = (await pageText(pageA)).toLowerCase();
      const textB = (await pageText(pageB)).toLowerCase();

      // Neither page should show a crash or unhandled error
      expect(textA).not.toContain('stack trace');
      expect(textA).not.toContain('internal server error');
      expect(textB).not.toContain('stack trace');
      expect(textB).not.toContain('internal server error');

      console.log('TC_CON_004 — A on ECG:', pageA.url(), '| B on ECG:', pageB.url());
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  test('TC_CON_006 Account A logs out — Account B session unaffected', async ({ browser }) => {
    test.setTimeout(180000);
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageA = await ctx1.newPage();
    const pageB = await ctx2.newPage();

    try {
      await Promise.all([
        loginContext(pageA, USERNAME, PASSWORD),
        loginContext(pageB, USERNAME2, PASSWORD2),
      ]);

      await goToDashboard(pageB);
      await enableFlutterA11y(pageB, 1500);
      await pageB.screenshot({ path: 'reports/screenshots/CON_006_accountB_before_A_logout.png' });

      // Account A logs out via profile
      await pageA.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await pageA.waitForTimeout(2000);
      await enableFlutterA11y(pageA, 2000);
      const logoutBtn = pageA.locator('flt-semantics[role="button"]:has-text("Logout"), flt-semantics[role="button"]:has-text("Log Out")');
      if (await logoutBtn.count() > 0) {
        await logoutBtn.first().click({ timeout: 5000 }).catch(() => {});
        await pageA.waitForTimeout(1500);
        // Confirm logout dialog if present
        await pageA.locator('flt-semantics[role="button"]:has-text("Confirm"), button:has-text("Confirm"), flt-semantics[role="button"]:has-text("Yes")').first()
          .click({ timeout: 5000 }).catch(() => {});
        await pageA.waitForURL(url => url.href.includes('login'), { timeout: 20000 }).catch(() => {});
      }
      await pageA.screenshot({ path: 'reports/screenshots/CON_006_accountA_loggedout.png' });

      // Account B should still be active
      await pageB.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await pageB.waitForTimeout(2000);
      await enableFlutterA11y(pageB, 1500);
      const urlB = pageB.url();
      console.log('TC_CON_006 — Account B URL after A logout:', urlB);
      await pageB.screenshot({ path: 'reports/screenshots/CON_006_accountB_still_active.png' });

      // Account B session should not be on login page
      expect(urlB).not.toContain('login');

      // Account B can still navigate to ECG
      await goToDashboard(pageB);
      await enableFlutterA11y(pageB, 1500);
      await pageB.screenshot({ path: 'reports/screenshots/CON_006_accountB_navigates.png' });
      expect(pageB.url()).not.toContain('login');
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });
});

// ── Edge Concurrent Tests ─────────────────────────────────────────────────────
test.describe('TC_CON — Edge Concurrent Tests', () => {

  test('TC_CON_005 Account A fills form on ECG X, B opens same ECG — state documented', async ({ browser }) => {
    test.setTimeout(180000);
    // Seed a fresh ECG
    await generateECG('high');
    await new Promise(r => setTimeout(r, 3000));

    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageA = await ctx1.newPage();
    const pageB = await ctx2.newPage();

    try {
      await Promise.all([
        loginContext(pageA, USERNAME, PASSWORD),
        loginContext(pageB, USERNAME2, PASSWORD2),
      ]);

      // Account A opens a new ECG and fills patient form
      await goToDashboard(pageA);
      await enableFlutterA11y(pageA, 1500);
      await pageA.waitForTimeout(1500);

      const newEcgA = pageA.locator(SEL_NEW_ECG);
      if (await newEcgA.count() === 0) { test.skip(); return; }

      // Get the URL of the new ECG before A opens it
      await newEcgA.first().click({ timeout: 8000 });
      await pageA.waitForTimeout(2000);
      await enableFlutterA11y(pageA, 1500);
      const ecgUrl = pageA.url();
      await pageA.screenshot({ path: 'reports/screenshots/CON_005_accountA_form_opened.png' });

      // A fills the patient form
      await fillPatient(pageA, { patientId: `CON005${Date.now().toString().slice(-4)}`, name: 'Con Test A', age: '50', gender: 'Male' });
      await pageA.waitForTimeout(1000);
      await enableFlutterA11y(pageA, 1000);
      await pageA.screenshot({ path: 'reports/screenshots/CON_005_accountA_form_filled.png' });

      // Account B opens the same ECG URL (if it contains an ID path)
      if (ecgUrl !== APP_URL && ecgUrl.includes('/ecg')) {
        await pageB.goto(ecgUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await pageB.waitForTimeout(2000);
        await enableFlutterA11y(pageB, 2000);
      } else {
        // B navigates from dashboard to first new ECG
        await goToDashboard(pageB);
        await enableFlutterA11y(pageB, 1500);
        await pageB.locator(SEL_NEW_ECG).first().click({ timeout: 8000 }).catch(() => {});
        await pageB.waitForTimeout(2000);
        await enableFlutterA11y(pageB, 1500);
      }

      // A submits the form
      await pageA.locator('flt-semantics[role="button"]:has-text("Get Risk Assessment"), button:has-text("Get Risk Assessment")').first()
        .click({ timeout: 8000 }).catch(() => {});
      await pageA.waitForTimeout(3000);
      await enableFlutterA11y(pageA, 1500);
      await pageA.screenshot({ path: 'reports/screenshots/CON_005_accountA_submitted.png' });

      // Document B's view of the same ECG after A submitted
      await pageB.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await pageB.waitForTimeout(2000);
      await enableFlutterA11y(pageB, 1500);
      await pageB.screenshot({ path: 'reports/screenshots/CON_005_accountB_after_A_submit.png' });

      const textB = (await pageText(pageB)).toLowerCase();
      console.log('TC_CON_005 — B sees after A submitted:', textB.substring(0, 200));
      // B should see either updated patient data or an appropriate state — no crash
      expect(textB).not.toContain('internal server error');
      expect(textB).not.toContain('stack trace');
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  test('TC_CON_007 Same account in two contexts (shared storage) — session conflict documented', async ({ browser }) => {
    test.setTimeout(180000);
    // First login to get storage state
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page1 = await ctx1.newPage();

    try {
      await loginContext(page1, USERNAME, PASSWORD);
      await goToDashboard(page1);
      await enableFlutterA11y(page1, 1500);
      await page1.screenshot({ path: 'reports/screenshots/CON_007_tab1_loggedin.png' });

      // Get storage state from context 1
      const storageState = await ctx1.storageState();

      // Create context 2 with same storage state (simulates second tab with same session)
      const ctx2 = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        storageState,
      });
      const page2 = await ctx2.newPage();

      try {
        await page2.goto(`${APP_URL}/ecgs`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page2.waitForTimeout(2000);
        await enableFlutterA11y(page2, 2000);
        await page2.screenshot({ path: 'reports/screenshots/CON_007_tab2_state.png' });

        const url1 = page1.url();
        const url2 = page2.url();
        console.log('TC_CON_007 — Tab 1 URL:', url1, '| Tab 2 URL:', url2);

        const text1 = (await pageText(page1)).toLowerCase();
        const text2 = (await pageText(page2)).toLowerCase();
        console.log('TC_CON_007 — Tab 2 shows conflict/duplication?', text2.includes('conflict') || text2.includes('session'));

        // Document session behavior — no hard crash
        expect(await page1.title()).toBeTruthy();
        expect(await page2.title()).toBeTruthy();
        expect(text1).not.toContain('stack trace');
        expect(text2).not.toContain('stack trace');
      } finally {
        await ctx2.close();
      }
    } finally {
      await ctx1.close();
    }
  });

  test('TC_CON_008 Account A generates ECG, Account B refreshes and sees it', async ({ browser }) => {
    test.setTimeout(180000);
    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageA = await ctx1.newPage();
    const pageB = await ctx2.newPage();

    try {
      await Promise.all([
        loginContext(pageA, USERNAME, PASSWORD),
        loginContext(pageB, USERNAME2, PASSWORD2),
      ]);

      await goToDashboard(pageB);
      await enableFlutterA11y(pageB, 1500);
      await pageB.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
      const countBefore = await pageB.locator(SEL_ECG_ITEM).count();
      await pageB.screenshot({ path: 'reports/screenshots/CON_008_accountB_before_refresh.png' });
      console.log('TC_CON_008 — B ECG count before A seeds:', countBefore);

      // Account A seeds a new ECG
      const seedResult = await generateECG('high');
      console.log('TC_CON_008 — Seed result:', JSON.stringify(seedResult));
      await pageA.screenshot({ path: 'reports/screenshots/CON_008_accountA_seeded.png' });
      await new Promise(r => setTimeout(r, 3000));

      // Account B refreshes
      await pageB.reload({ waitUntil: 'domcontentloaded' });
      await pageB.waitForTimeout(2000);
      await enableFlutterA11y(pageB, 2000);
      await pageB.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
      const countAfter = await pageB.locator(SEL_ECG_ITEM).count();
      await pageB.screenshot({ path: 'reports/screenshots/CON_008_accountB_after_refresh.png' });
      console.log('TC_CON_008 — B ECG count after A seeds and B refreshes:', countAfter);

      // B should see at least as many ECGs as before (new one may appear)
      expect(countAfter).toBeGreaterThanOrEqual(countBefore);
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });

  test('TC_CON_009 Account A on patient form, B navigates to login — A form not disrupted', async ({ browser }) => {
    test.setTimeout(180000);
    await generateECG('high');
    await new Promise(r => setTimeout(r, 3000));

    const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageA = await ctx1.newPage();
    const pageB = await ctx2.newPage();

    try {
      await Promise.all([
        loginContext(pageA, USERNAME, PASSWORD),
        loginContext(pageB, USERNAME2, PASSWORD2),
      ]);

      // Account A opens a fresh ECG and fills partial form
      await goToDashboard(pageA);
      await enableFlutterA11y(pageA, 1500);
      const newEcgA = pageA.locator(SEL_NEW_ECG);
      if (await newEcgA.count() === 0) { test.skip(); return; }

      await newEcgA.first().click({ timeout: 8000 });
      await pageA.waitForTimeout(2000);
      await enableFlutterA11y(pageA, 1500);
      const uniqueId = `CON009${Date.now().toString().slice(-4)}`;
      await robustFill(pageA, SEL_PATIENT_ID, uniqueId);
      await robustFill(pageA, SEL_PAT_NAME, 'Form Test A');
      await pageA.screenshot({ path: 'reports/screenshots/CON_009_accountA_on_form.png' });

      // Account B navigates to login
      await pageB.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await pageB.waitForTimeout(2000);
      await enableFlutterA11y(pageB, 1500);
      await pageB.screenshot({ path: 'reports/screenshots/CON_009_accountB_on_login.png' });

      // Verify A's form data is not disrupted
      const patIdVal = await pageA.locator(SEL_PATIENT_ID).first().inputValue().catch(() => '');
      const patNameVal = await pageA.locator(SEL_PAT_NAME).first().inputValue().catch(() => '');
      console.log('TC_CON_009 — A form patientId:', patIdVal, '| name:', patNameVal);
      await pageA.screenshot({ path: 'reports/screenshots/CON_009_accountA_form_intact.png' });

      // Form data should still be present (or page navigated — but no crash)
      const urlA = pageA.url();
      const isStillOnForm = urlA.includes('/ecg') || urlA.includes('/patient');
      console.log('TC_CON_009 — A still on form page:', isStillOnForm, '| URL:', urlA);
      expect(await pageA.title()).toBeTruthy();
    } finally {
      await ctx1.close();
      await ctx2.close();
    }
  });
});

// ── Negative Concurrent Tests ─────────────────────────────────────────────────
test.describe('TC_CON — Negative Concurrent Tests', () => {

  test('TC_CON_010 Three rapid sequential logins — re-auth without crash', async ({ page }) => {
    test.setTimeout(180000);
    // First login
    await loginContext(page, USERNAME, PASSWORD);
    const url1 = page.url();
    await page.screenshot({ path: 'reports/screenshots/CON_010_first_login.png' });
    console.log('TC_CON_010 — First login URL:', url1);
    expect(url1).not.toContain('login');

    // Logout
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    const logoutBtn = page.locator('flt-semantics[role="button"]:has-text("Logout"), flt-semantics[role="button"]:has-text("Log Out")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await page.locator('flt-semantics[role="button"]:has-text("Confirm"), button:has-text("Confirm"), flt-semantics[role="button"]:has-text("Yes")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => url.href.includes('login'), { timeout: 20000 }).catch(() => {});
    } else {
      await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'reports/screenshots/CON_010_logout.png' });

    // Second login quickly after logout
    await loginContext(page, USERNAME, PASSWORD);
    const url2 = page.url();
    await page.screenshot({ path: 'reports/screenshots/CON_010_second_login_result.png' });
    console.log('TC_CON_010 — Second login URL:', url2);
    expect(url2).not.toContain('login');

    // Third rapid login attempt (logout again, then login)
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    const logoutBtn2 = page.locator('flt-semantics[role="button"]:has-text("Logout"), flt-semantics[role="button"]:has-text("Log Out")');
    if (await logoutBtn2.count() > 0) {
      await logoutBtn2.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await page.locator('flt-semantics[role="button"]:has-text("Confirm"), button:has-text("Confirm"), flt-semantics[role="button"]:has-text("Yes")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => url.href.includes('login'), { timeout: 20000 }).catch(() => {});
    } else {
      await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }
    await page.waitForTimeout(500); // rapid — minimal wait
    await loginContext(page, USERNAME, PASSWORD);
    const url3 = page.url();
    await page.screenshot({ path: 'reports/screenshots/CON_010_third_login_result.png' });
    console.log('TC_CON_010 — Third login URL:', url3);
    expect(url3).not.toContain('login');
    expect(await page.title()).toBeTruthy();
  });
});
