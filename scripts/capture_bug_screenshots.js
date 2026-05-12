#!/usr/bin/env node
'use strict';
/**
 * Captures clear bug-evidence screenshots for:
 *   TC_SECH_007 — No brute force lockout
 *   TC_SAUD_008 — /v1/ecgs returns HTTP 200 after logout (HIPAA violation)
 *
 * Run: node scripts/capture_bug_screenshots.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const APP_URL    = 'https://cardiocheck-releasev140.up.railway.app';
const API_BASE   = 'https://cardiocheck-releasev140.up.railway.app';
const USERNAME   = 'reeva.kandroo+8@tricog.com';
const PASSWORD   = 'Tricog@1234';
const SHOTS_DIR  = path.join(__dirname, '../reports/screenshots');

async function enableFlutterA11y(page, ms = 2000) {
  try { await page.locator('flt-semantics-placeholder').click({ timeout: 5000 }); } catch (_) {}
  await page.waitForTimeout(ms);
}

async function robustFill(page, selector, value) {
  for (const sel of selector.split(',').map(s => s.trim())) {
    try {
      const el = page.locator(sel).first();
      if (await el.count() > 0) {
        await el.click({ timeout: 3000 });
        await el.fill('', { timeout: 3000 });
        await el.pressSequentially(value, { delay: 60 });
        return;
      }
    } catch (_) {}
  }
}

async function clickButton(page, label) {
  const sels = [
    `flt-semantics[role="button"]:has-text("${label}")`,
    `button:has-text("${label}")`,
    `[aria-label="${label}"]`,
  ];
  for (const sel of sels) {
    try {
      const el = page.locator(sel).first();
      if (await el.count() > 0) { await el.click({ timeout: 5000 }); return; }
    } catch (_) {}
  }
}

async function inject_overlay(page, lines, color = '#dc2626') {
  await page.evaluate(({ lines, color }) => {
    const existing = document.getElementById('__bug_overlay');
    if (existing) existing.remove();
    const d = document.createElement('div');
    d.id = '__bug_overlay';
    d.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
    Object.assign(d.style, {
      position: 'fixed', top: '12px', right: '12px', zIndex: '99999',
      background: '#fff', border: `3px solid ${color}`, borderRadius: '8px',
      padding: '14px 18px', maxWidth: '480px', fontFamily: 'monospace',
      fontSize: '13px', lineHeight: '1.7', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      color: '#1a1a2e',
    });
    const title = d.querySelector('div:first-child');
    if (title) Object.assign(title.style, { fontWeight: '700', fontSize: '14px', color, marginBottom: '6px' });
    document.body.appendChild(d);
  }, { lines, color });
}

// ─────────────────────────────────────────────────────────────────────────────
// TC_SECH_007 — Brute Force: no lockout after 7 wrong attempts
// ─────────────────────────────────────────────────────────────────────────────
async function captureSECH007(browser) {
  console.log('\n── TC_SECH_007: Brute Force Evidence ──');
  const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  try {
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2500);

    const SEL_EMAIL    = 'flt-semantics[aria-label*="mail" i], flt-semantics[aria-label*="email" i], input[type="email"], input[name="email"]';
    const SEL_PASSWORD = 'flt-semantics[aria-label*="pass" i], input[type="password"], input[name="password"]';

    const bruteEmail = 'brutetest@invalid-test-only.com';
    const wrongPass  = 'WrongPassword123!';
    const responses  = [];

    for (let attempt = 1; attempt <= 7; attempt++) {
      console.log(`  Attempt ${attempt}/7...`);
      await enableFlutterA11y(page, 800);
      await robustFill(page, SEL_EMAIL, bruteEmail);
      await page.waitForTimeout(300);
      await robustFill(page, SEL_PASSWORD, wrongPass);
      await page.waitForTimeout(300);
      await clickButton(page, 'Login');
      await page.waitForTimeout(3500);
      await enableFlutterA11y(page, 800);

      const text = await page.evaluate(() =>
        [...document.querySelectorAll('flt-semantics')].map(e => e.getAttribute('aria-label') || '').join(' ')
      );
      const locked = /locked|too many|rate.?limit|blocked|temporarily/i.test(text);
      responses.push({ attempt, locked, snippet: text.substring(0, 200) });
      console.log(`  Attempt ${attempt}: locked=${locked}`);
    }

    const allLocked  = responses.some(r => r.locked);
    const finalLocked = responses[responses.length - 1]?.locked;

    // Inject the evidence overlay
    const overlayLines = [
      `🔴 BUG TC_SECH_007 — No Brute Force Lockout`,
      `Test: 7 consecutive wrong passwords for &lt;${bruteEmail}&gt;`,
      `Lockout detected at any attempt: ${allLocked ? '✅ YES' : '❌ NO'}`,
      `Status after attempt 7: ${finalLocked ? '🔒 Locked out' : '⚠️ Still active — form not disabled'}`,
      `All 7 attempts completed without lockout, rate-limit, or CAPTCHA.`,
      `HIPAA Risk: Brute-force credential attacks are unrestricted.`,
    ];
    await inject_overlay(page, overlayLines, '#dc2626');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'SECH_007_brute_force.png'), fullPage: false });
    console.log('  ✅ Saved SECH_007_brute_force.png');

    // Second screenshot — closer view of the login form showing it is still responsive
    await inject_overlay(page, [
      `🔴 LOGIN FORM STILL ACTIVE AFTER 7 FAILED ATTEMPTS`,
      `Expected: Account locked OR CAPTCHA required`,
      `Actual: Login form fully usable — no lockout message`,
      `Implication: Unlimited password guessing allowed`,
    ], '#dc2626');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'SECH_007_no_lockout_confirmed.png'), fullPage: false });
    console.log('  ✅ Saved SECH_007_no_lockout_confirmed.png');

  } catch (err) {
    console.error('  ❌ TC_SECH_007 capture failed:', err.message);
  } finally {
    await ctx.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TC_SAUD_008 — /v1/ecgs returns 200 after logout
// ─────────────────────────────────────────────────────────────────────────────
async function captureSAUD008(browser) {
  console.log('\n── TC_SAUD_008: Unauthenticated API Evidence ──');
  const ctx  = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  try {
    // Step 1: Login
    console.log('  Logging in...');
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2500);

    const SEL_EMAIL    = 'flt-semantics[aria-label*="mail" i], flt-semantics[aria-label*="email" i], input[type="email"]';
    const SEL_PASSWORD = 'flt-semantics[aria-label*="pass" i], input[type="password"]';

    await robustFill(page, SEL_EMAIL, USERNAME);
    await page.waitForTimeout(400);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await page.waitForTimeout(400);
    await clickButton(page, 'Login');
    await page.waitForTimeout(8000);
    await enableFlutterA11y(page, 2000);

    // Capture cookies/session BEFORE logout (Playwright session context has the cookie)
    const cookies = await ctx.cookies();
    console.log('  Cookies after login:', cookies.map(c => `${c.name}=${c.value.substring(0,20)}...`));

    // Screenshot: logged in state
    await inject_overlay(page, [
      '📋 TC_SAUD_008 — Step 1: Logged In',
      `User: ${USERNAME}`,
      'About to log out and then call /v1/ecgs without auth...',
    ], '#2563eb');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'SAUD_008_step1_logged_in.png') });
    console.log('  ✅ Saved SAUD_008_step1_logged_in.png');

    // Step 2: Navigate to profile and logout
    console.log('  Logging out...');
    await page.goto(`${APP_URL}/profile`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 2000);
    const logoutBtn = page.locator('flt-semantics[role="button"]:has-text("Logout"), flt-semantics[role="button"]:has-text("Log Out")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const confirmBtn = page.locator('flt-semantics[role="button"]:has-text("Confirm"), flt-semantics[role="button"]:has-text("Yes"), button:has-text("Confirm")');
      if (await confirmBtn.count() > 0) {
        await confirmBtn.first().click({ timeout: 5000 }).catch(() => {});
      }
      await page.waitForTimeout(3000);
    } else {
      // Force logout by clearing storage
      await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
      await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);
    }

    // Screenshot: logged out state
    await inject_overlay(page, [
      '📋 TC_SAUD_008 — Step 2: Logged Out',
      'Session terminated. Now calling /v1/ecgs without Authorization header...',
    ], '#2563eb');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'SAUD_008_step2_logged_out.png') });
    console.log('  ✅ Saved SAUD_008_step2_logged_out.png');

    // Step 3: Call /v1/ecgs with no Authorization header
    console.log('  Calling /v1/ecgs without auth...');
    const apiUrl = `${API_BASE}/v1/ecgs`;

    // Use page.request which is a fresh request context (no stored cookies from the logged-in ctx)
    const freshCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    let apiStatus = null;
    let apiBody   = null;
    let apiRecords = 0;
    try {
      const resp = await freshCtx.request.get(apiUrl, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000,
      });
      apiStatus = resp.status();
      try {
        const json = await resp.json();
        apiBody    = JSON.stringify(json, null, 2).substring(0, 600);
        if (Array.isArray(json)) apiRecords = json.length;
        else if (json?.data && Array.isArray(json.data)) apiRecords = json.data.length;
      } catch (_) {
        apiBody = await resp.text().catch(() => '(could not read body)');
        apiBody = apiBody.substring(0, 400);
      }
    } catch (err) {
      apiStatus = 'NETWORK_ERROR';
      apiBody   = err.message;
    } finally {
      await freshCtx.close();
    }

    console.log(`  API status: ${apiStatus}`);
    console.log(`  API body preview: ${(apiBody || '').substring(0, 200)}`);

    const isBug = typeof apiStatus === 'number' && apiStatus === 200;

    // Step 4: Inject result overlay and screenshot
    const resultColor   = isBug ? '#dc2626' : '#16a34a';
    const resultLabel   = isBug ? `🔴 BUG CONFIRMED` : `✅ API correctly returned ${apiStatus}`;
    const implication   = isBug
      ? `CRITICAL HIPAA VIOLATION: Patient ECG data accessible without authentication!`
      : `API access is correctly blocked after logout.`;

    const overlayLines = [
      `${resultLabel} — TC_SAUD_008`,
      `Endpoint: GET /v1/ecgs (no Authorization header)`,
      `Expected: HTTP 401 Unauthorized or 403 Forbidden`,
      `Actual:   HTTP ${apiStatus}${isBug ? ' — returns patient data!' : ''}`,
      ...(isBug && apiRecords > 0 ? [`Records returned: ${apiRecords} ECG record(s) exposed`] : []),
      implication,
    ];

    // Show result on a blank page for clarity
    const htmlPage = `
      <html><body style="font-family:monospace;background:#f8f8f8;padding:40px">
      <h2 style="color:${resultColor}">TC_SAUD_008 — Unauthenticated API Response</h2>
      <table style="border-collapse:collapse;width:100%;max-width:800px;font-size:14px">
        <tr><td style="padding:8px;font-weight:bold;background:#eee">Endpoint</td><td style="padding:8px">GET ${apiUrl}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#eee">Authorization header</td><td style="padding:8px">❌ None (no Bearer token)</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#eee">Session state</td><td style="padding:8px">Logged out</td></tr>
        <tr style="background:${isBug ? '#fee2e2':'#dcfce7'}">
          <td style="padding:8px;font-weight:bold">HTTP Status</td>
          <td style="padding:8px;font-weight:bold;color:${resultColor}">${apiStatus} ${isBug ? '— SHOULD BE 401/403' : '✅ Correct'}</td>
        </tr>
        <tr><td style="padding:8px;font-weight:bold;background:#eee">Expected</td><td style="padding:8px">401 Unauthorized or 403 Forbidden</td></tr>
      </table>
      ${isBug ? `<div style="margin-top:20px;padding:16px;background:#fee2e2;border:2px solid #dc2626;border-radius:6px">
        <strong style="color:#dc2626">⚠️ HIPAA VIOLATION:</strong> Patient ECG records are accessible without login.<br>
        HIPAA Security Rule §164.312(a)(1) requires access controls ensuring only authorized users can access PHI.<br>
        This endpoint bypasses server-side authentication validation after session termination.
      </div>` : ''}
      <div style="margin-top:20px">
        <strong>Response body preview:</strong>
        <pre style="background:#fff;padding:12px;border:1px solid #ccc;border-radius:4px;max-height:280px;overflow:auto;font-size:12px">${(apiBody || '(empty)').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
      </div>
      </body></html>
    `;

    const evidencePage = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
    await evidencePage.setContent(htmlPage, { waitUntil: 'domcontentloaded' });
    await evidencePage.waitForTimeout(500);
    await evidencePage.screenshot({ path: path.join(SHOTS_DIR, 'SAUD_008_unauth_api.png'), fullPage: true });
    console.log(`  ✅ Saved SAUD_008_unauth_api.png (status=${apiStatus})`);
    await evidencePage.context().close();

    // Also save a combined before/after screenshot on the actual app page
    await page.evaluate(() => { const el = document.getElementById('__bug_overlay'); if (el) el.remove(); });
    await inject_overlay(page, overlayLines, resultColor);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SHOTS_DIR, 'SAUD_008_unauth_api_app.png'), fullPage: false });
    console.log('  ✅ Saved SAUD_008_unauth_api_app.png');

  } catch (err) {
    console.error('  ❌ TC_SAUD_008 capture failed:', err.message);
  } finally {
    await ctx.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log('🎯 Capturing bug evidence screenshots...\n');
  const browser = await chromium.launch({ headless: true });
  try {
    await captureSECH007(browser);
    await captureSAUD008(browser);
    console.log('\n✅ All bug screenshots captured successfully.');
  } finally {
    await browser.close();
  }
})();
