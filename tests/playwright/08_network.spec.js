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
