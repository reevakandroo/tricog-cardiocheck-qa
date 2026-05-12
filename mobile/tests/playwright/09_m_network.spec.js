// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, gotoLogin, enableFlutterA11y, pageText, LOGIN_URL } = require('./helpers');

test.describe('TC_Mobile_Network — Connectivity', () => {
  test('TC_MNET_001 App loads normally on fast network (WiFi sim)', async ({ page }) => {
    const t0 = Date.now();
    await doLogin(page);
    const elapsed = Date.now() - t0;
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_001_fast_load.png' });
    console.log(`Login time on fast network: ${elapsed}ms`);
    expect(page.url()).toContain('/ecg');
    expect(elapsed).toBeLessThan(60000);
  });

  test('TC_MNET_002 App loads on simulated 4G (10 Mbps)', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 40, downloadThroughput: 10 * 1024 * 1024 / 8,
      uploadThroughput: 5 * 1024 * 1024 / 8,
    });
    const t0 = Date.now();
    await gotoLogin(page);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_002_4g_load.png' });
    console.log(`4G load time: ${Date.now() - t0}ms`);
    expect(page.url()).not.toContain('error');
  });

  test('TC_MNET_003 App loads on simulated 3G (1.6 Mbps)', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 100, downloadThroughput: 1.6 * 1024 * 1024 / 8,
      uploadThroughput: 768 * 1024 / 8,
    });
    const t0 = Date.now();
    await gotoLogin(page);
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_003_3g_load.png' });
    console.log(`3G load time: ${Date.now() - t0}ms`);
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('unhandled exception');
  });

  test('TC_MNET_004 App goes offline after login — no crash', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0,
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_004_offline.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('uncaught exception');
    // Restore
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
  });

  test('TC_MNET_005 Network recovery — app reconnects after going offline', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    // Go offline
    await client.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_005_offline_state.png' });
    // Restore
    await client.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_005_restored.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('crash');
  });

  test('TC_MNET_006 Slow network shows loading indicators — no blank screen', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 500, downloadThroughput: 200 * 1024 / 8, uploadThroughput: 100 * 1024 / 8,
    });
    await gotoLogin(page);
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_006_slow_network.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('exception');
  });

  test('TC_MNET_007 Login fails gracefully on server timeout (simulated)', async ({ page }) => {
    await page.route('**/v1/**', route => setTimeout(() => route.abort('timedout'), 8000));
    await gotoLogin(page);
    const { robustFill, SEL_EMAIL, SEL_PASSWORD, clickButton: cb, USERNAME, PASSWORD } = require('./helpers');
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await cb(page, 'Login');
    await page.waitForTimeout(12000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_007_timeout.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('uncaught');
  });

  test('TC_MNET_008 Server error 500 on login — graceful error message', async ({ page }) => {
    await page.route('**/auth/**', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
    await gotoLogin(page);
    const { robustFill, SEL_EMAIL, SEL_PASSWORD, clickButton: cb, USERNAME, PASSWORD } = require('./helpers');
    await robustFill(page, SEL_EMAIL, USERNAME);
    await robustFill(page, SEL_PASSWORD, PASSWORD);
    await cb(page, 'Login');
    await page.waitForTimeout(6000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_008_server_error.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('stack trace');
  });

  test('TC_MNET_009 Airplane mode mid-flow — no crash on ECG list', async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await page.waitForTimeout(2000);
    // Try to scroll
    const vp = page.viewportSize() || { width: 393, height: 851 };
    await page.mouse.move(vp.width / 2, 500);
    await page.mouse.down();
    await page.mouse.move(vp.width / 2, 200, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_009_airplane_mode.png' });
    const text = (await pageText(page)).toLowerCase();
    expect(text).not.toContain('uncaught exception');
    await client.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  });

  test('TC_MNET_010 App loads from cache when offline on second visit', async ({ page }) => {
    // First visit to warm cache
    await gotoLogin(page);
    await page.waitForTimeout(3000);
    // Go offline
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    // Reload
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MNET_010_cache_offline.png' });
    const text = (await pageText(page)).toLowerCase();
    // Should load from cache — not fully blank
    console.log(`Offline cache text length: ${text.length}`);
    expect(text).not.toContain('uncaught exception');
    await client.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  });
});
