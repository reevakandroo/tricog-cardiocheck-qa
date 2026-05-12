'use strict';
/**
 * Mobile helpers for Tricog CardioCheck v1.4.0 — Playwright mobile emulation.
 * The app is Flutter Web (CanvasKit renderer). All interactions go through the
 * flt-semantics a11y tree. Activation is required on every new page load.
 *
 * Execution mode: Playwright mobile device emulation (Pixel 5) against the
 * Railway-hosted Flutter web app. APK / native Android testing requires a
 * device or emulator — see mobile/docs/mobile_setup_guide.md.
 */

const APP_URL   = 'https://cardiocheck-releasev140.up.railway.app';
const LOGIN_URL = `${APP_URL}/`;
const USERNAME  = 'reeva.kandroo+8@tricog.com';
const PASSWORD  = 'Tricog@1234';
const USERNAME2 = 'reeva.kandroo+16@tricog.com';
const PASSWORD2 = 'Tricog@1234';

// ── Selectors ─────────────────────────────────────────────────────────────────
const SEL_EMAIL      = 'input[aria-label="Enter your email"], input[placeholder="Enter your email"]';
const SEL_PASSWORD   = 'input[aria-label="Enter your password"], input[placeholder="Enter your password"]';
const SEL_A11Y_BTN   = 'button:has-text("Enable accessibility"), flt-semantics-placeholder';

// Patient form
const SEL_PATIENT_ID = 'input[aria-label*="Patient ID"], input[placeholder*="Patient ID"]';
const SEL_PAT_NAME   = 'input[aria-label*="Patient Name"], input[placeholder*="Patient Name"]';
const SEL_AGE        = 'input[aria-label*="Age"], input[placeholder*="Age"]';
const SEL_RISK_BTN   = 'flt-semantics[role="button"]:has-text("Get Risk Assessment")';
const SEL_SEARCH     = 'input[aria-label*="Search"], input[placeholder*="Search"]';
const SEL_EXPORT_PDF = [
  'flt-semantics[role="button"][aria-label*="Export" i]',
  'flt-semantics[role="button"][aria-label*="Share" i]',
  'flt-semantics[role="button"][aria-label*="PDF" i]',
  'flt-semantics[role="button"]:has-text("Export PDF")',
  'flt-semantics[role="button"]:has-text("Export")',
  'button:has-text("Export PDF")',
].join(', ');

// ── Enable Flutter accessibility ──────────────────────────────────────────────
async function enableFlutterA11y(page, waitMs = 2500) {
  await page.evaluate(() => {
    const ph = document.querySelector('flt-semantics-placeholder');
    if (ph) ph.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }).catch(() => {});

  const a11yBtn = page.locator(SEL_A11Y_BTN).first();
  if (await a11yBtn.count() > 0) {
    await a11yBtn.click({ timeout: 3000 }).catch(() => {});
  }
  await page.waitForTimeout(waitMs);
}

// ── Robust fill — retries up to maxAttempts ───────────────────────────────────
async function robustFill(page, selector, value, maxAttempts = 3) {
  if (value === null || value === undefined) return;
  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) await page.waitForTimeout(400 * i);
    try {
      const el = page.locator(selector).first();
      await el.waitFor({ state: 'visible', timeout: 6000 });
      await el.click({ timeout: 3000 });
      await el.fill(String(value));
      const val = await el.inputValue().catch(() => null);
      if (val === String(value)) return;
    } catch (_) { /* retry */ }
  }
}

// ── Navigate to login and activate a11y ──────────────────────────────────────
async function gotoLogin(page) {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(3000);
  await enableFlutterA11y(page, 2500);
  // Wait for email input to become available
  await page.locator(SEL_EMAIL).first().waitFor({ state: 'visible', timeout: 20_000 })
    .catch(() => {});
}

// ── Full login flow with EULA handling ────────────────────────────────────────
async function doLogin(page, user = USERNAME, pass = PASSWORD) {
  await gotoLogin(page);
  await robustFill(page, SEL_EMAIL, user);
  await robustFill(page, SEL_PASSWORD, pass);
  await clickButton(page, 'Login');
  await page.waitForURL(url => !url.href.includes('login'), { timeout: 30000 }).catch(() => {});
  // EULA gate
  if (page.url().includes('eula') || (await pageText(page)).toLowerCase().includes('eula')) {
    await enableFlutterA11y(page, 1500);
    await page.locator('flt-semantics[role="button"]:has-text("Agree"), button:has-text("Agree")').first()
      .click({ timeout: 8000 }).catch(() => {});
    await page.waitForURL(url => !url.href.includes('eula'), { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(2000);
}

// ── Click a Flutter semantics button by visible text ─────────────────────────
async function clickButton(page, text, timeout = 15000) {
  const sel = `flt-semantics[role="button"]:has-text("${text}"), button:has-text("${text}")`;
  await page.locator(sel).first().click({ timeout }).catch(async () => {
    // Fallback: evaluate click on any flt-semantics containing text
    await page.evaluate((t) => {
      const els = Array.from(document.querySelectorAll('flt-semantics[role="button"]'));
      const el  = els.find(e => e.textContent.includes(t));
      if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, text);
  });
}

// ── Get all visible text from the page ───────────────────────────────────────
async function pageText(page) {
  return page.evaluate(() => document.body.innerText || document.body.textContent || '').catch(() => '');
}

// ── Simulate touch tap at coordinates ────────────────────────────────────────
async function touchTap(page, x, y) {
  await page.touchscreen.tap(x, y);
  await page.waitForTimeout(300);
}

// ── Simulate swipe gesture ────────────────────────────────────────────────────
async function swipeUp(page, startX, startY, distance = 200) {
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX, startY - distance, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(400);
}

async function swipeDown(page, startX, startY, distance = 200) {
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX, startY + distance, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(400);
}

// ── Check if element meets minimum touch target size (44×44 CSS px) ──────────
async function checkTouchTarget(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return { ok: false, reason: 'not found' };
    const r = el.getBoundingClientRect();
    return { ok: r.width >= 44 && r.height >= 44, w: r.width, h: r.height };
  }, selector);
}

// ── Measure navigation performance ───────────────────────────────────────────
async function measureNavTime(page, action) {
  const t0 = Date.now();
  await action();
  return Date.now() - t0;
}

module.exports = {
  APP_URL, LOGIN_URL, USERNAME, PASSWORD, USERNAME2, PASSWORD2,
  SEL_EMAIL, SEL_PASSWORD, SEL_A11Y_BTN, SEL_PATIENT_ID, SEL_PAT_NAME,
  SEL_AGE, SEL_RISK_BTN, SEL_SEARCH, SEL_EXPORT_PDF,
  enableFlutterA11y, robustFill, gotoLogin, doLogin, clickButton, pageText,
  touchTap, swipeUp, swipeDown, checkTouchTarget, measureNavTime,
};
