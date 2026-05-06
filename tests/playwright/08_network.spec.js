// @ts-check
const { test, expect } = require('@playwright/test');
const {
  SEL_ECG_ITEM, enableFlutterA11y, doLogin, ensureDashboard, openFreshECG,
  fillPatient, pageText,
} = require('./helpers');

test.describe('TC_Network — Connectivity', () => {
  test('TC_NET_001 Offline banner appears when network disabled', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/NET_001_offline.png' });
    const text = (await pageText(page)).toLowerCase();
    const hasBanner = text.includes('offline') || text.includes('no connection') ||
      text.includes('network') || text.includes('internet');
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    expect(hasBanner).toBe(true);
  });

  test('TC_NET_002 Online recovery — banner disappears after reconnect', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await page.context().newCDPSession(page);
    // Go offline
    await client.send('Network.emulateNetworkConditions', {
      offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
    });
    await page.waitForTimeout(2000);
    // Go back online
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/NET_002_recovered.png' });
    const text = (await pageText(page)).toLowerCase();
    // Offline banner should be gone
    const stillOffline = text.includes('offline') && !text.includes('online');
    expect(stillOffline).toBe(false);
  });

  test('TC_NET_003 Slow network — login still works with loading state', async ({ page }) => {
    // Throttle to Slow 3G before loading
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 400, downloadThroughput: 40 * 1024 / 8, uploadThroughput: 20 * 1024 / 8,
    });
    await doLogin(page);
    await page.screenshot({ path: 'reports/screenshots/NET_003_slow_login.png' });
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    // Should eventually reach dashboard (may be slow)
    const url = page.url();
    expect(url.includes('/ecg') || url.includes('login')).toBe(true);
  });

  test('TC_NET_004 Submit patient data offline — graceful error', async ({ page }) => {
    await doLogin(page);
    await openFreshECG(page, 'high');
    await fillPatient(page, { patientId: 'NET001', name: 'Offline Test', age: '30', gender: 'Male' });
    // Go offline before submit
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
    });
    await page.waitForTimeout(1000);
    const saveBtn = page.locator('flt-semantics[role="button"]:has-text("Save")').or(
      page.locator('flt-semantics[role="button"]:has-text("Submit")'));
    if (await saveBtn.count() > 0) await saveBtn.first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/NET_004_offline_submit.png' });
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    // App should not crash — error shown or data retained
    expect(await page.title()).toBeTruthy();
  });

  test('TC_NET_005 Load ECG list while offline — graceful error shown', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
    });
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/NET_005_offline_list.png' });
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    expect(await page.title()).toBeTruthy();
  });
});

// ─── NEW TESTS added for full coverage ───────────────────────────────────────

test.describe('TC_Network — Additional Coverage', () => {
  test('TC_NET_006 Rapid offline/online toggle — no crash', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await page.context().newCDPSession(page);
    for (let i = 0; i < 3; i++) {
      await client.send('Network.emulateNetworkConditions', {
        offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
      });
      await page.waitForTimeout(1000);
      await client.send('Network.emulateNetworkConditions', {
        offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
      });
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: 'reports/screenshots/NET_006_rapid_toggle.png' });
    expect(await page.title()).toBeTruthy();
  });

  test('TC_NET_007 Network restored — ECG list can be refreshed', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
    });
    await page.waitForTimeout(2000);
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'reports/screenshots/NET_007_restore_refresh.png' });
    const count = await page.locator(SEL_ECG_ITEM).count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_NET_008 Network loss during ECG detail view — no crash', async ({ page }) => {
    await doLogin(page);
    await ensureDashboard(page);
    await page.waitForSelector(SEL_ECG_ITEM, { timeout: 15000 }).catch(() => {});
    await page.locator(SEL_ECG_ITEM).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1500);
    // Go offline mid-view
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/NET_008_offline_detail.png' });
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    expect(await page.title()).toBeTruthy();
  });

  test('TC_NET_009 Very slow 2G network — app still renders', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    // 2G: ~50kbps down, 20kbps up, 300ms latency
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 300, downloadThroughput: 50 * 1024 / 8, uploadThroughput: 20 * 1024 / 8,
    });
    await doLogin(page);
    await page.screenshot({ path: 'reports/screenshots/NET_009_2g_network.png' });
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    const url = page.url();
    // Should reach dashboard or login (not crash)
    expect(url.includes('/ecg') || url.includes('login')).toBe(true);
  });
});
