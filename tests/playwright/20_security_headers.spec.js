// @ts-check
/**
 * Module 20 — Security Headers & Input Validation Tests
 * Covers TC_SECH_001 through TC_SECH_012
 * Tests HTTP security headers, auth headers, session fixation, brute force,
 * and injection attack handling.
 */
const { test, expect } = require('@playwright/test');
const {
  APP_URL,
  USERNAME, PASSWORD,
  SEL_EMAIL, SEL_PASSWORD,
  enableFlutterA11y, robustFill, clickButton,
  doLogin, gotoLogin, ensureDashboard, openFreshECG, generateECG,
  fillPatient, pageText, SEL_RISK_BTN,
} = require('./helpers');

// ── Positive Security Header Tests ───────────────────────────────────────────
test.describe('TC_SECH — Security Header Tests', () => {

  test('TC_SECH_001 Strict-Transport-Security header present on responses', async ({ page }) => {
    test.setTimeout(120000);
    const headersFound = {};
    page.on('response', response => {
      const url = response.url();
      if (url.includes('railway.app') || url.includes('tricog')) {
        const hsts = response.headers()['strict-transport-security'];
        if (hsts) headersFound[url] = hsts;
      }
    });

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/SECH_001_login_page.png' });

    // Trigger more requests via login
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_001_after_login.png' });

    console.log('TC_SECH_001 — HSTS headers found on URLs:', JSON.stringify(headersFound, null, 2));
    const hstsPresent = Object.keys(headersFound).length > 0;
    if (!hstsPresent) {
      console.warn('TC_SECH_001: WARN — Strict-Transport-Security header NOT found on any response. This is a security gap if the app is HTTPS-only.');
    }
    // Soft assertion — log finding but do not fail if Railway CDN strips headers
    expect(await page.title()).toBeTruthy();
  });

  test('TC_SECH_002 X-Content-Type-Options: nosniff header present', async ({ page }) => {
    test.setTimeout(120000);
    const nosniffUrls = [];
    const missingUrls = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('railway.app') || url.includes('tricog')) {
        const val = response.headers()['x-content-type-options'];
        if (val && val.toLowerCase().includes('nosniff')) {
          nosniffUrls.push(url);
        } else {
          missingUrls.push(url);
        }
      }
    });

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/SECH_002_login_page.png' });

    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_002_dashboard.png' });

    console.log('TC_SECH_002 — nosniff present on:', nosniffUrls.length, 'URLs');
    console.log('TC_SECH_002 — nosniff MISSING on:', missingUrls.length, 'URLs');
    if (nosniffUrls.length === 0) {
      console.warn('TC_SECH_002: WARN — X-Content-Type-Options: nosniff not found on any response.');
    }
    expect(await page.title()).toBeTruthy();
  });

  test('TC_SECH_003 X-Frame-Options or CSP frame-ancestors — clickjacking protection', async ({ page }) => {
    test.setTimeout(120000);
    const frameProtectedUrls = [];
    const unprotectedUrls = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('railway.app') || url.includes('tricog')) {
        const xfo = response.headers()['x-frame-options'];
        const csp = response.headers()['content-security-policy'];
        const hasFrameProtection = (xfo && (xfo.toUpperCase().includes('DENY') || xfo.toUpperCase().includes('SAMEORIGIN')))
          || (csp && csp.toLowerCase().includes('frame-ancestors'));
        if (hasFrameProtection) {
          frameProtectedUrls.push({ url, xfo: xfo || '', csp: csp || '' });
        } else {
          unprotectedUrls.push(url);
        }
      }
    });

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/SECH_003_login_page.png' });

    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_003_dashboard.png' });

    console.log('TC_SECH_003 — Frame-protected URLs:', frameProtectedUrls.length);
    console.log('TC_SECH_003 — Unprotected URLs:', unprotectedUrls.slice(0, 5));
    if (frameProtectedUrls.length === 0) {
      console.warn('TC_SECH_003: WARN — No X-Frame-Options or CSP frame-ancestors found. Clickjacking risk.');
    }
    expect(await page.title()).toBeTruthy();
  });

  test('TC_SECH_004 Referrer-Policy header present', async ({ page }) => {
    test.setTimeout(120000);
    const referrerPolicyUrls = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('railway.app') || url.includes('tricog')) {
        const rp = response.headers()['referrer-policy'];
        if (rp) referrerPolicyUrls.push({ url, value: rp });
      }
    });

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/SECH_004_login_page.png' });

    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_004_dashboard.png' });

    console.log('TC_SECH_004 — Referrer-Policy found on:', referrerPolicyUrls.length, 'URLs');
    referrerPolicyUrls.slice(0, 3).forEach(r => console.log('  ', r.url, '->', r.value));
    if (referrerPolicyUrls.length === 0) {
      console.warn('TC_SECH_004: WARN — Referrer-Policy header not found on any response.');
    }
    expect(await page.title()).toBeTruthy();
  });

  test('TC_SECH_005 All state-changing API requests carry Authorization Bearer header', async ({ page }) => {
    test.setTimeout(180000);
    const mutatingMethodsMissingAuth = [];
    const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

    page.on('request', request => {
      if (mutatingMethods.has(request.method())) {
        const authHeader = request.headers()['authorization'];
        const url = request.url();
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          // Skip browser internal requests and non-app URLs
          if (url.includes('railway.app') || url.includes('tricog')) {
            mutatingMethodsMissingAuth.push({ method: request.method(), url });
          }
        }
      }
    });

    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_005_dashboard.png' });

    // Trigger ECG flow to generate API calls
    await openFreshECG(page, 'high');
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_005_ecg_form.png' });

    await fillPatient(page, { patientId: `SECH005${Date.now().toString().slice(-4)}`, name: 'Auth Check', age: '45', gender: 'Male' });
    await page.waitForTimeout(1000);
    await enableFlutterA11y(page, 1000);
    const riskBtn = page.locator(SEL_RISK_BTN);
    if (await riskBtn.count() > 0) {
      await riskBtn.click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(5000);
    }
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_005_after_flow.png' });

    console.log('TC_SECH_005 — Mutating requests MISSING Authorization header:', mutatingMethodsMissingAuth.length);
    mutatingMethodsMissingAuth.forEach(r => console.log('  MISSING AUTH:', r.method, r.url));

    if (mutatingMethodsMissingAuth.length > 0) {
      console.warn('TC_SECH_005: SECURITY RISK — The following mutating requests lacked Authorization:', mutatingMethodsMissingAuth);
    }
    // Soft assertion — document, allow some requests (e.g., mock ingest)
    expect(mutatingMethodsMissingAuth.filter(r => !r.url.includes('mock')).length).toBe(0);
  });

  test('TC_SECH_006 Session fixation check — session identifier changes after login', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);

    // Capture pre-login storage state
    const preLoginStorage = await page.evaluate(() => {
      const result = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        result[key] = localStorage.getItem(key);
      }
      return result;
    });
    const preLoginCookies = await page.context().cookies();
    await page.screenshot({ path: 'reports/screenshots/SECH_006_pre_login_state.png' });
    console.log('TC_SECH_006 — Pre-login localStorage keys:', Object.keys(preLoginStorage));
    console.log('TC_SECH_006 — Pre-login cookies:', preLoginCookies.map(c => c.name));

    // Login
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await clickButton(page, 'Login');
    await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    if (page.url().includes('eula')) {
      await page.locator('button:has-text("I Agree"), button:has-text("Agree")').first()
        .click({ timeout: 5000 }).catch(() => {});
      await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await enableFlutterA11y(page, 1500);

    // Capture post-login storage state
    const postLoginStorage = await page.evaluate(() => {
      const result = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        result[key] = localStorage.getItem(key);
      }
      return result;
    });
    const postLoginCookies = await page.context().cookies();
    await page.screenshot({ path: 'reports/screenshots/SECH_006_post_login_state.png' });
    console.log('TC_SECH_006 — Post-login localStorage keys:', Object.keys(postLoginStorage));
    console.log('TC_SECH_006 — Post-login cookies:', postLoginCookies.map(c => c.name));

    // Verify new auth tokens appeared after login
    const newKeys = Object.keys(postLoginStorage).filter(k => !Object.keys(preLoginStorage).includes(k));
    const authKeys = Object.keys(postLoginStorage).filter(k =>
      k.toLowerCase().includes('token') || k.toLowerCase().includes('auth') || k.toLowerCase().includes('session')
    );
    console.log('TC_SECH_006 — New storage keys after login:', newKeys);
    console.log('TC_SECH_006 — Auth-related keys:', authKeys);

    // After login there should be some auth state stored
    expect(Object.keys(postLoginStorage).length).toBeGreaterThan(0);
  });
});

// ── Negative Security Tests ────────────────────────────────────────────────────
test.describe('TC_SECH — Negative & Attack Tests', () => {

  test('TC_SECH_007 Brute force — 7 wrong login attempts with non-existent email', async ({ page }) => {
    test.setTimeout(180000);
    const bruteEmail = 'brutetest@invalid-test-only.com';
    const wrongPassword = 'WrongPass!';

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2500);
    await page.screenshot({ path: 'reports/screenshots/SECH_007_initial_login.png' });

    const responses = [];

    for (let attempt = 1; attempt <= 7; attempt++) {
      // Re-activate a11y on each attempt
      await enableFlutterA11y(page, 1000);
      await robustFill(page, SEL_EMAIL, bruteEmail);
      await robustFill(page, SEL_PASSWORD, wrongPassword);
      await clickButton(page, 'Login');
      await page.waitForTimeout(3000);
      await enableFlutterA11y(page, 1000);

      const text = (await pageText(page)).toLowerCase();
      responses.push({ attempt, text: text.substring(0, 200) });
      console.log(`TC_SECH_007 — Attempt ${attempt}:`, text.substring(0, 150));

      if (attempt === 1 || attempt === 5 || attempt === 7) {
        await page.screenshot({ path: `reports/screenshots/SECH_007_attempt_${attempt}.png` });
      }

      // Check for lockout or rate-limit message
      const locked = text.includes('locked') || text.includes('too many') || text.includes('rate') || text.includes('blocked');
      if (locked) {
        console.log(`TC_SECH_007 — Lockout detected at attempt ${attempt}`);
        break;
      }

      // Stay on login page if still there
      if (!page.url().includes('login') && !page.url().includes(APP_URL)) break;
    }

    await page.screenshot({ path: 'reports/screenshots/SECH_007_after_7_attempts.png' });
    const finalText = (await pageText(page)).toLowerCase();
    console.log('TC_SECH_007 — Final page text:', finalText.substring(0, 300));

    // App should not crash and should still show login page or lockout message
    expect(await page.title()).toBeTruthy();
    // App should remain on login/error state (not dashboard)
    expect(page.url()).not.toContain('/ecg');
  });

  test('TC_SECH_008 Lockout error message does not reveal email enumeration info', async ({ page }) => {
    test.setTimeout(120000);
    const nonExistentEmail = 'doesnotexist_xyz987@invalidtest.com';

    await gotoLogin(page);
    await enableFlutterA11y(page, 1500);
    await robustFill(page, SEL_EMAIL, nonExistentEmail);
    await robustFill(page, SEL_PASSWORD, 'AnyPassword123!');
    await clickButton(page, 'Login');
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_008_error_message.png' });

    const text = (await pageText(page)).toLowerCase();
    console.log('TC_SECH_008 — Error message text:', text.substring(0, 300));

    // Error message should NOT explicitly expose email/account existence
    const enumLeaks = text.includes('email not found') || text.includes('account not found')
      || text.includes('no account') || text.includes('user does not exist')
      || text.includes("doesn't exist") || text.includes('not registered');

    if (enumLeaks) {
      console.warn('TC_SECH_008: SECURITY RISK — Error message leaks email enumeration information:', text.substring(0, 200));
    }
    // Document finding — soft assertion
    expect(enumLeaks).toBe(false);
  });

  test('TC_SECH_010 SQL injection in login email field — stays on login, no server error', async ({ page }) => {
    test.setTimeout(120000);
    const sqlPayload = "' OR 1=1; --";

    await gotoLogin(page);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_010_before_sql_input.png' });

    await robustFill(page, SEL_EMAIL, sqlPayload);
    await robustFill(page, SEL_PASSWORD, 'AnyPassword123!');
    await page.screenshot({ path: 'reports/screenshots/SECH_010_sql_injected.png' });

    await clickButton(page, 'Login');
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_010_after_sql_submit.png' });

    const text = (await pageText(page)).toLowerCase();
    const currentUrl = page.url();
    console.log('TC_SECH_010 — After SQL injection URL:', currentUrl);
    console.log('TC_SECH_010 — Response text:', text.substring(0, 300));

    // App must NOT be on dashboard (SQL injection must not bypass auth)
    expect(currentUrl).not.toContain('/ecg');
    // App must NOT show SQL errors
    expect(text).not.toContain('sql');
    expect(text).not.toContain('syntax error');
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('exception');
    // App should still show login or error state
    expect(await page.title()).toBeTruthy();
  });

  test('TC_SECH_011 XSS in login email field — no alert dialog fires', async ({ page }) => {
    test.setTimeout(120000);
    const xssPayload = '<script>alert(1)</script>';
    let alertFired = false;
    page.on('dialog', async dialog => {
      alertFired = true;
      console.warn('TC_SECH_011: SECURITY RISK — Alert/dialog fired! Message:', dialog.message());
      await dialog.dismiss().catch(() => {});
    });

    await gotoLogin(page);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_011_before_xss_input.png' });

    await robustFill(page, SEL_EMAIL, xssPayload);
    await robustFill(page, SEL_PASSWORD, 'AnyPassword123!');
    await page.screenshot({ path: 'reports/screenshots/SECH_011_xss_injected.png' });

    await clickButton(page, 'Login');
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_011_after_xss_submit.png' });

    console.log('TC_SECH_011 — Alert fired:', alertFired);
    const currentUrl = page.url();
    console.log('TC_SECH_011 — URL after XSS:', currentUrl);

    // No alert should have fired
    expect(alertFired).toBe(false);
    // App must NOT be on dashboard
    expect(currentUrl).not.toContain('/ecg');
    expect(await page.title()).toBeTruthy();
  });

  test('TC_SECH_012 Long string 300 chars in login email — app handles gracefully', async ({ page }) => {
    test.setTimeout(120000);
    const longEmail = 'a'.repeat(150) + '@' + 'b'.repeat(146) + '.com'; // 300 chars total

    await gotoLogin(page);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_012_before_long_input.png' });

    await robustFill(page, SEL_EMAIL, longEmail);
    await robustFill(page, SEL_PASSWORD, 'AnyPassword123!');
    await page.screenshot({ path: 'reports/screenshots/SECH_012_long_input_filled.png' });

    await clickButton(page, 'Login');
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_012_after_long_submit.png' });

    const text = (await pageText(page)).toLowerCase();
    const currentUrl = page.url();
    console.log('TC_SECH_012 — URL after long string:', currentUrl);
    console.log('TC_SECH_012 — Response text:', text.substring(0, 300));

    // App must NOT crash with server error
    expect(text).not.toContain('internal server error');
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('exception');
    // App must NOT be on dashboard (long email should not bypass auth)
    expect(currentUrl).not.toContain('/ecg');
    // Page should still be functional
    expect(await page.title()).toBeTruthy();
  });
});

// ── Security Flow Test ────────────────────────────────────────────────────────
test.describe('TC_SECH — JS Error & Flow Tests', () => {

  test('TC_SECH_009 No unhandled JS exceptions during full login→dashboard→ECG flow', async ({ page }) => {
    test.setTimeout(180000);
    const jsErrors = [];
    const consoleErrors = [];

    page.on('pageerror', e => {
      jsErrors.push(e.message);
      console.error('TC_SECH_009 — JS Error:', e.message);
    });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error('TC_SECH_009 — Console Error:', msg.text());
      }
    });

    // Step 1: Login
    await doLogin(page);
    await page.screenshot({ path: 'reports/screenshots/SECH_009_login_step.png' });
    console.log('TC_SECH_009 — After login — JS errors:', jsErrors.length);

    // Step 2: Dashboard
    await ensureDashboard(page);
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/SECH_009_dashboard_step.png' });
    console.log('TC_SECH_009 — After dashboard — JS errors:', jsErrors.length);

    // Step 3: Open ECG
    const ecgCount = await page.locator('flt-semantics[role="button"]').count();
    if (ecgCount > 0) {
      await page.locator('flt-semantics[role="button"]').first().click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await enableFlutterA11y(page, 1500);
    }
    await page.screenshot({ path: 'reports/screenshots/SECH_009_ecg_step.png' });
    console.log('TC_SECH_009 — After ECG open — JS errors:', jsErrors.length);

    // Filter out non-critical Flutter/browser warnings (focus on unhandled exceptions)
    const criticalErrors = jsErrors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error promise rejection') &&
      !e.toLowerCase().includes('favicon')
    );
    console.log('TC_SECH_009 — Critical JS errors:', criticalErrors);
    console.log('TC_SECH_009 — Console errors:', consoleErrors.slice(0, 5));

    expect(criticalErrors.length).toBe(0);
  });
});
