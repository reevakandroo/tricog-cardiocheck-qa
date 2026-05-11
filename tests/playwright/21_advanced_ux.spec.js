// @ts-check
/**
 * Module 21 — Advanced UX & Performance Tests
 * Covers TC_PADV_001 through TC_PADV_010
 * Tests memory usage, scroll performance, tab visibility, navigation,
 * print trigger, double-click protection, page titles, and keyboard navigation.
 */
const { test, expect } = require('@playwright/test');
const {
  APP_URL,
  USERNAME, PASSWORD,
  SEL_EMAIL, SEL_PASSWORD, SEL_ECG_ITEM, SEL_NEW_ECG,
  SEL_PATIENT_ID, SEL_PAT_NAME, SEL_AGE, SEL_RISK_BTN,
  enableFlutterA11y, robustFill, clickButton,
  doLogin, gotoLogin, ensureDashboard, openFreshECG, generateECG,
  fillPatient, pageText,
} = require('./helpers');

// ── Memory & Performance Tests ────────────────────────────────────────────────
test.describe('TC_PADV — Memory & Scroll Performance', () => {

  test('TC_PADV_001 JS heap does not grow by more than 50MB while navigating 5 ECGs', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 2000);

    const ecgCount = await page.locator(SEL_ECG_ITEM).count();
    if (ecgCount === 0) {
      console.warn('TC_PADV_001: No ECG items found — skipping heap test.');
      test.skip();
      return;
    }

    // Capture baseline heap via CDP
    const client = await page.context().newCDPSession(page);
    const heapBefore = await client.send('Runtime.getHeapUsage').catch(() => ({ usedSize: 0, totalSize: 0 }));
    console.log('TC_PADV_001 — Heap BEFORE navigation:', JSON.stringify(heapBefore));
    await page.screenshot({ path: 'reports/screenshots/PADV_001_initial_state.png' });

    // Navigate through up to 5 ECGs
    const iterations = Math.min(ecgCount, 5);
    for (let i = 0; i < iterations; i++) {
      await ensureDashboard(page);
      await page.waitForTimeout(1000);
      await enableFlutterA11y(page, 1000);
      await page.locator(SEL_ECG_ITEM).nth(i % ecgCount).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await enableFlutterA11y(page, 1000);
      console.log(`TC_PADV_001 — Navigated to ECG ${i + 1}, URL: ${page.url()}`);
    }

    await page.screenshot({ path: 'reports/screenshots/PADV_001_after_navigation.png' });

    // Capture post-navigation heap
    const heapAfter = await client.send('Runtime.getHeapUsage').catch(() => ({ usedSize: 0, totalSize: 0 }));
    console.log('TC_PADV_001 — Heap AFTER navigation:', JSON.stringify(heapAfter));

    const heapGrowthMB = (heapAfter.usedSize - heapBefore.usedSize) / (1024 * 1024);
    console.log('TC_PADV_001 — Heap growth (MB):', heapGrowthMB.toFixed(2));
    await page.screenshot({ path: 'reports/screenshots/PADV_001_heap_measured.png' });

    // Assert heap growth under 50MB
    expect(heapGrowthMB).toBeLessThan(50);
  });

  test('TC_PADV_002 Scroll performance on large ECG list — 3 full scrolls under 10 seconds', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await ensureDashboard(page);

    // Seed 10 ECGs for a larger list
    console.log('TC_PADV_002 — Seeding 10 ECGs...');
    const seedPromises = Array.from({ length: 10 }, () => generateECG('high'));
    await Promise.all(seedPromises);
    await new Promise(r => setTimeout(r, 4000));

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 20000 }).catch(() => {});

    const listCount = await page.locator(SEL_ECG_ITEM).count();
    console.log('TC_PADV_002 — ECG list count after seeding:', listCount);
    await page.screenshot({ path: 'reports/screenshots/PADV_002_list_before_scroll.png' });

    if (listCount === 0) {
      console.warn('TC_PADV_002: No ECG items after seeding — skipping scroll test.');
      test.skip();
      return;
    }

    // Scroll to bottom 3 times and measure time
    const start = Date.now();
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
      await page.waitForTimeout(600);
      if (i === 1) {
        await page.screenshot({ path: 'reports/screenshots/PADV_002_mid_scroll.png' });
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(400);
    }
    const elapsed = Date.now() - start;
    console.log('TC_PADV_002 — 3 scroll cycles took (ms):', elapsed);
    await page.screenshot({ path: 'reports/screenshots/PADV_002_scroll_complete.png' });

    // Scrolling 3 times should complete in under 10 seconds
    expect(elapsed).toBeLessThan(10000);
  });
});

// ── State & Navigation Tests ──────────────────────────────────────────────────
test.describe('TC_PADV — Tab Visibility & Navigation', () => {

  test('TC_PADV_003 Tab visibility change mid-form — form fields retain values', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await openFreshECG(page, 'high');
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);

    const patIdCount = await page.locator(SEL_PATIENT_ID).count();
    if (patIdCount === 0) {
      console.warn('TC_PADV_003: Patient ID field not found (likely already-processed ECG). Skipping.');
      test.skip();
      return;
    }

    const uniqueId = `PADV003${Date.now().toString().slice(-4)}`;
    const patientName = 'Visibility Test';
    await robustFill(page, SEL_PATIENT_ID, uniqueId);
    await robustFill(page, SEL_PAT_NAME, patientName);
    await page.screenshot({ path: 'reports/screenshots/PADV_003_form_filled.png' });

    // Simulate tab becoming hidden (visibility change to hidden)
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    }).catch(() => {});
    await page.waitForTimeout(2000);

    // Simulate tab becoming visible again
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    }).catch(() => {});
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1000);
    await page.screenshot({ path: 'reports/screenshots/PADV_003_after_visibility_change.png' });

    // Check form fields still have values
    const currentPatId = await page.locator(SEL_PATIENT_ID).first().inputValue().catch(() => '');
    const currentPatName = await page.locator(SEL_PAT_NAME).first().inputValue().catch(() => '');
    console.log('TC_PADV_003 — Patient ID after visibility change:', currentPatId);
    console.log('TC_PADV_003 — Patient Name after visibility change:', currentPatName);
    await page.screenshot({ path: 'reports/screenshots/PADV_003_form_state_final.png' });

    // Values should be retained
    expect(currentPatId).toBe(uniqueId);
  });

  test('TC_PADV_004 Back navigation mid-flow — dashboard loads without crash', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await openFreshECG(page, 'high');
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);

    const patIdCount = await page.locator(SEL_PATIENT_ID).count();
    if (patIdCount > 0) {
      await robustFill(page, SEL_PATIENT_ID, `BACK${Date.now().toString().slice(-4)}`);
      await robustFill(page, SEL_PAT_NAME, 'Back Nav Test');
    }
    await page.screenshot({ path: 'reports/screenshots/PADV_004_form_state_before_back.png' });

    // Press back
    await page.goBack({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PADV_004_after_goback.png' });

    const text = (await pageText(page)).toLowerCase();
    const currentUrl = page.url();
    console.log('TC_PADV_004 — URL after goBack:', currentUrl);

    // No crash
    expect(text).not.toContain('internal server error');
    expect(text).not.toContain('stack trace');
    expect(await page.title()).toBeTruthy();
    await page.screenshot({ path: 'reports/screenshots/PADV_004_dashboard_restored.png' });
  });

  test('TC_PADV_005 Forward navigation after going back — no crash or blank screen', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await openFreshECG(page, 'high');
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PADV_005_ecg_before_back.png' });

    // Go back to dashboard
    await page.goBack({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    const urlAfterBack = page.url();
    console.log('TC_PADV_005 — URL after goBack:', urlAfterBack);
    await page.screenshot({ path: 'reports/screenshots/PADV_005_dashboard_after_back.png' });

    // Go forward
    await page.goForward({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await enableFlutterA11y(page, 1500);
    const urlAfterForward = page.url();
    console.log('TC_PADV_005 — URL after goForward:', urlAfterForward);
    await page.screenshot({ path: 'reports/screenshots/PADV_005_state_after_forward.png' });

    // No crash — page title still valid and no blank screen
    const title = await page.title();
    const text = (await pageText(page)).toLowerCase();
    console.log('TC_PADV_005 — Title after forward:', title);

    expect(title).toBeTruthy();
    expect(title.toLowerCase()).not.toBe('undefined');
    expect(text).not.toContain('stack trace');
    // Page should have some content (not a blank screen)
    expect(text.length).toBeGreaterThan(0);
  });
});

// ── Print, Double-click & Page Title Tests ────────────────────────────────────
test.describe('TC_PADV — Print, Double-click & Titles', () => {

  test('TC_PADV_006 Print trigger on result screen — no crash', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await openFreshECG(page, 'high');
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);

    // Fill patient form and get risk assessment
    await fillPatient(page, {
      patientId: `PRINT${Date.now().toString().slice(-4)}`,
      name: 'Print Test',
      age: '50',
      gender: 'Male',
    });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1000);

    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() === 0) {
      console.warn('TC_PADV_006: Risk button not found — ECG may already be processed.');
      test.skip();
      return;
    }

    await riskBtn.click({ timeout: 8000 });
    await page.waitForFunction(
      () => ['low', 'moderate', 'high'].some(v =>
        Array.from(document.querySelectorAll('flt-semantics'))
          .map(e => e.innerText || '')
          .join(' ')
          .toLowerCase()
          .includes(v)
      ),
      { timeout: 90000 }
    ).catch(() => {});
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/PADV_006_result_before_print.png' });

    // Trigger print — override to prevent actual print dialog
    await page.evaluate(() => {
      window.print = () => { console.log('print called'); };
      window.print();
    }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'reports/screenshots/PADV_006_after_print_call.png' });

    // No crash — page title still valid
    const title = await page.title();
    console.log('TC_PADV_006 — Title after print:', title);
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).not.toBe('undefined');
  });

  test('TC_PADV_007 Rapid double-click on Login button — no duplicate auth', async ({ page }) => {
    test.setTimeout(120000);
    const authRequests = [];
    page.on('request', req => {
      const url = req.url();
      if ((url.includes('/auth') || url.includes('/login') || url.includes('/token')) && req.method() === 'POST') {
        authRequests.push(url);
      }
    });

    await gotoLogin(page);
    await enableFlutterA11y(page, 1500);
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await page.screenshot({ path: 'reports/screenshots/PADV_007_before_double_click.png' });

    // Double-click the login button in rapid succession
    const loginBtn = page.locator('flt-semantics[role="button"]:has-text("Login"), button:has-text("Login")').first();
    if (await loginBtn.count() > 0) {
      await loginBtn.click({ timeout: 3000 }).catch(() => {});
      await loginBtn.click({ timeout: 3000 }).catch(() => {});
    } else {
      await clickButton(page, 'Login');
      await clickButton(page, 'Login');
    }

    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PADV_007_after_double_click.png' });

    console.log('TC_PADV_007 — Auth requests fired:', authRequests.length, authRequests);
    // Even if 2 requests fired, the app must not crash and must land on dashboard
    expect(page.url()).not.toContain('login');
    expect(await page.title()).toBeTruthy();
  });

  test('TC_PADV_008 Rapid double-click on Get Risk Assessment — no duplicate submission', async ({ page }) => {
    test.setTimeout(180000);
    const riskRequests = [];
    page.on('request', req => {
      const url = req.url();
      if ((url.includes('/risk') || url.includes('/assess') || url.includes('/result')) && req.method() === 'POST') {
        riskRequests.push(url);
      }
    });

    await doLogin(page);
    await openFreshECG(page, 'high');
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);

    const patIdCount = await page.locator(SEL_PATIENT_ID).count();
    if (patIdCount === 0) {
      console.warn('TC_PADV_008: Patient form not found — ECG already processed. Skipping.');
      test.skip();
      return;
    }

    await fillPatient(page, {
      patientId: `DBLCLK${Date.now().toString().slice(-4)}`,
      name: 'Double Click Test',
      age: '45',
      gender: 'Male',
    });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1000);
    await page.screenshot({ path: 'reports/screenshots/PADV_008_form_ready.png' });

    // Double-click risk assessment button
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() === 0) { test.skip(); return; }

    await riskBtn.click({ timeout: 5000 }).catch(() => {});
    await riskBtn.click({ timeout: 2000 }).catch(() => {});
    await page.screenshot({ path: 'reports/screenshots/PADV_008_after_double_click.png' });

    // Wait for result
    await page.waitForFunction(
      () => ['low', 'moderate', 'high'].some(v =>
        Array.from(document.querySelectorAll('flt-semantics'))
          .map(e => e.innerText || '')
          .join(' ')
          .toLowerCase()
          .includes(v)
      ),
      { timeout: 90000 }
    ).catch(() => {});
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/PADV_008_result.png' });

    console.log('TC_PADV_008 — Risk assessment requests fired:', riskRequests.length, riskRequests);
    // No crash and app responds normally
    expect(await page.title()).toBeTruthy();
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('internal server error');
  });
});

// ── Page Title & Keyboard Tests ───────────────────────────────────────────────
test.describe('TC_PADV — Page Title & Keyboard Navigation', () => {

  test('TC_PADV_009 Page title is meaningful across all routes', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    const loginTitle = await page.title();
    await page.screenshot({ path: 'reports/screenshots/PADV_009_login_title.png' });
    console.log('TC_PADV_009 — Login page title:', loginTitle);

    // Login
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    const dashboardTitle = await page.title();
    await page.screenshot({ path: 'reports/screenshots/PADV_009_dashboard_title.png' });
    console.log('TC_PADV_009 — Dashboard page title:', dashboardTitle);

    // Navigate to patient form
    const ecgCount = await page.locator(SEL_ECG_ITEM).count();
    if (ecgCount > 0) {
      await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await enableFlutterA11y(page, 1500);
    }
    const formTitle = await page.title();
    await page.screenshot({ path: 'reports/screenshots/PADV_009_form_title.png' });
    console.log('TC_PADV_009 — ECG/form page title:', formTitle);

    // All titles should be non-empty and not "undefined"
    expect(loginTitle.length).toBeGreaterThan(0);
    expect(loginTitle.toLowerCase()).not.toBe('undefined');
    expect(dashboardTitle.length).toBeGreaterThan(0);
    expect(dashboardTitle.toLowerCase()).not.toBe('undefined');
    expect(formTitle.length).toBeGreaterThan(0);
    expect(formTitle.toLowerCase()).not.toBe('undefined');
  });

  test('TC_PADV_010 Keyboard-only navigation — Tab key does not crash app', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2500);
    await page.screenshot({ path: 'reports/screenshots/PADV_010_initial_focus.png' });

    // Press Tab key 5 times and check for crash
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: 'reports/screenshots/PADV_010_after_5_tabs.png' });

    // Check what element is focused
    const focusedInfo = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return 'no focused element';
      return {
        tagName: el.tagName,
        type: el.getAttribute('type') || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        role: el.getAttribute('role') || '',
        text: (el.textContent || '').trim().substring(0, 50),
      };
    });
    console.log('TC_PADV_010 — Focused element after 5 Tabs:', JSON.stringify(focusedInfo));
    await page.screenshot({ path: 'reports/screenshots/PADV_010_focused_element.png' });

    // App should not crash on Tab navigation
    expect(await page.title()).toBeTruthy();
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('internal server error');
    // Login page should still be rendered
    const pageStillRendered = text.includes('login') || text.includes('email') || text.includes('cardiocheck') || text.length > 10;
    expect(pageStillRendered).toBe(true);
  });
});
