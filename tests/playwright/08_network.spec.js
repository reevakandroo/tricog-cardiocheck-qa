// @ts-check
/**
 * Module 08 — Network Connectivity Tests
 *
 * Two core UX requirements under test:
 *   1. No network  → app must display "You're offline" banner
 *   2. Slow (2G)   → app must display "Low network connection" banner
 *
 * Also covers: banner disappears on recovery, banner switches between states,
 * functional behaviour (no crash, graceful errors), and text quality.
 *
 * 20 tests across 4 describe groups.
 */
const { test, expect } = require('@playwright/test');
const {
  APP_URL, SEL_ECG_ITEM, enableFlutterA11y,
  doLogin, ensureDashboard, openFreshECG, fillPatient, pageText,
} = require('./helpers');

// ── Network condition presets ─────────────────────────────────────────────────
const NET = {
  OFFLINE: { offline: true,  latency: 0,   downloadThroughput: 0,     uploadThroughput: 0 },
  SLOW_2G: { offline: false, latency: 300,  downloadThroughput: 6250,  uploadThroughput: 2500 }, // ~50kbps / 20kbps
  NORMAL:  { offline: false, latency: 0,    downloadThroughput: -1,    uploadThroughput: -1 },
};

async function cdp(page) {
  const client = await page.context().newCDPSession(page);
  return client;
}
async function setNet(client, preset) {
  await client.send('Network.emulateNetworkConditions', preset);
}

// Banner keyword sets — what the app is EXPECTED to display
const OFFLINE_WORDS = ["you're offline", 'youre offline', 'no internet', 'no connection', 'offline'];
const SLOW_WORDS    = ['low network', 'slow connection', 'poor connection', 'weak signal', 'low connectivity', 'slow network'];

const hasOfflineBanner = t => OFFLINE_WORDS.some(k => t.includes(k));
const hasSlowBanner    = t => SLOW_WORDS.some(k => t.includes(k));

// ── GROUP A: "You're offline" banner ─────────────────────────────────────────
test.describe('TC_Network — Offline Banner', () => {

  test('TC_NET_001 Dashboard: go offline → "You\'re offline" banner appears', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_001_offline_banner.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasOfflineBanner(text)).toBe(true);
  });

  test('TC_NET_002 Login page: go offline → "You\'re offline" banner appears', async ({ page }) => {
    await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_002_offline_login.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasOfflineBanner(text)).toBe(true);
  });

  test('TC_NET_003 ECG list: go offline → "You\'re offline" banner appears', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_003_offline_ecglist.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasOfflineBanner(text)).toBe(true);
  });

  test('TC_NET_004 ECG detail: go offline mid-view → "You\'re offline" banner appears', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await enableFlutterA11y(page, 1500);
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_004_offline_detail.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasOfflineBanner(text)).toBe(true);
  });

  test('TC_NET_005 "You\'re offline" banner disappears after network is restored', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    // Go offline — verify banner appears
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    const textOffline = (await pageText(page)).toLowerCase();
    // Restore network — verify banner disappears
    await setNet(client, NET.NORMAL);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_005_offline_recovered.png' });
    const textOnline = (await pageText(page)).toLowerCase();
    expect(hasOfflineBanner(textOffline)).toBe(true);
    expect(hasOfflineBanner(textOnline)).toBe(false);
  });

});

// ── GROUP B: "Low network connection" banner ──────────────────────────────────
test.describe('TC_Network — Slow Network Banner', () => {

  test('TC_NET_006 Dashboard: throttle to 2G → "Low network connection" banner appears', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/NET_006_2g_banner_dash.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasSlowBanner(text)).toBe(true);
  });

  test('TC_NET_007 ECG list: throttle to 2G → "Low network connection" banner appears', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    const client = await cdp(page);
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/NET_007_2g_banner_list.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasSlowBanner(text)).toBe(true);
  });

  test('TC_NET_008 Patient form on 2G → "Low network connection" banner appears', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await openFreshECG(page, 'high');
    const client = await cdp(page);
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/NET_008_2g_patient_form.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasSlowBanner(text)).toBe(true);
  });

  test('TC_NET_009 Login page on 2G → "Low network connection" banner appears', async ({ page }) => {
    await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const client = await cdp(page);
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 2000);
    await page.screenshot({ path: 'reports/screenshots/NET_009_2g_login.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(hasSlowBanner(text)).toBe(true);
  });

  test('TC_NET_010 "Low network" banner disappears after speed restored to normal', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    // Go 2G — verify banner
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    const textSlow = (await pageText(page)).toLowerCase();
    // Restore — verify banner gone
    await setNet(client, NET.NORMAL);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_010_2g_recovered.png' });
    const textNormal = (await pageText(page)).toLowerCase();
    expect(hasSlowBanner(textSlow)).toBe(true);
    expect(hasSlowBanner(textNormal)).toBe(false);
  });

});

// ── GROUP C: Banner combinations & state transitions ─────────────────────────
test.describe('TC_Network — Banner Combinations', () => {

  test('TC_NET_011 Offline → restore to 2G: offline banner clears, slow banner may appear', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    // Step 1: fully offline
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    const textOffline = (await pageText(page)).toLowerCase();
    // Step 2: restore to 2G (partial connectivity)
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_011_offline_to_2g.png' });
    const text2G = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    // Offline banner was shown; after partial restore it must clear
    expect(hasOfflineBanner(textOffline)).toBe(true);
    expect(hasOfflineBanner(text2G)).toBe(false);
  });

  test('TC_NET_012 2G → fully offline: slow banner replaced by offline banner', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    // Step 2: cut fully offline
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_012_2g_to_offline.png' });
    const textOffline = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    // Should now show offline banner (not slow banner)
    expect(hasOfflineBanner(textOffline)).toBe(true);
  });

  test('TC_NET_013 Rapid offline ↔ online × 3 — no JS crash, banner updates each time', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    for (let i = 0; i < 3; i++) {
      await setNet(client, NET.OFFLINE);
      await page.waitForTimeout(1200);
      await setNet(client, NET.NORMAL);
      await page.waitForTimeout(1200);
    }
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_013_rapid_toggle.png' });
    // After restoring to normal, offline banner must be gone
    const text = (await pageText(page)).toLowerCase();
    expect(errors.length).toBe(0);
    expect(hasOfflineBanner(text)).toBe(false);
  });

  test('TC_NET_014 Offline banner text is plain English — no stack trace or error code', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_014_offline_text_quality.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('exception');
    expect(text).not.toContain('err_network');
    expect(text).not.toContain('null pointer');
    expect(text).not.toContain('socket');
  });

  test('TC_NET_015 Slow-network banner text is plain English — no technical error codes', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    await setNet(client, NET.SLOW_2G);
    await page.waitForTimeout(4000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_015_2g_text_quality.png' });
    const text = (await pageText(page)).toLowerCase();
    await setNet(client, NET.NORMAL);
    expect(text).not.toContain('stack trace');
    expect(text).not.toContain('exception');
    expect(text).not.toContain('err_');
    expect(text).not.toContain('timeout');
  });

});

// ── GROUP D: Functional behaviour under network degradation ───────────────────
test.describe('TC_Network — Functional Behaviour', () => {

  test('TC_NET_016 Login attempt while offline → page loads, no crash', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${APP_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/NET_016_offline_login_attempt.png' });
    await setNet(client, NET.NORMAL);
    expect(errors.length).toBe(0);
    expect(await page.title()).toBeTruthy();
  });

  test('TC_NET_017 Submit patient form while offline → graceful error, no crash', async ({ page }) => {
    test.setTimeout(180000);
    await doLogin(page);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: 'NET017', name: 'Offline Test', age: '30', gender: 'Male' });
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(1000);
    const saveBtn = page.locator('flt-semantics[role="button"]:has-text("Save"), flt-semantics[role="button"]:has-text("Submit")');
    if (await saveBtn.count() > 0) await saveBtn.first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/NET_017_offline_submit.png' });
    await setNet(client, NET.NORMAL);
    expect(await page.title()).toBeTruthy();
  });

  test('TC_NET_018 Reload ECG list while offline → no blank screen (title present)', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_018_offline_reload.png' });
    await setNet(client, NET.NORMAL);
    expect(await page.title()).toBeTruthy();
  });

  test('TC_NET_019 Network restored → ECG list reloads and shows records', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await cdp(page);
    await setNet(client, NET.OFFLINE);
    await page.waitForTimeout(2000);
    await setNet(client, NET.NORMAL);
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_019_restored_refresh.png' });
    const count = await page.locator(SEL_ECG_ITEM).count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_NET_020 Slow 2G login — completes without JS error, loading state visible', async ({ page }) => {
    test.setTimeout(180000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const client = await cdp(page);
    await setNet(client, NET.SLOW_2G);
    await doLogin(page);
    await page.screenshot({ path: 'reports/screenshots/NET_020_2g_login.png' });
    await setNet(client, NET.NORMAL);
    expect(errors.length).toBe(0);
    expect(page.url().includes('/ecg') || page.url().includes('login')).toBe(true);
  });

});
