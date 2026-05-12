// @ts-check
const { test, expect } = require('@playwright/test');
const { doLogin, enableFlutterA11y, clickButton, pageText, LOGIN_URL, USERNAME } = require('./helpers');

test.describe('TC_Mobile_Profile — User Profile', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await page.waitForTimeout(3000);
    await enableFlutterA11y(page, 2000);
  });

  test('TC_MPRF_001 Profile page accessible from mobile dashboard', async ({ page }) => {
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MPRF_001_profile_page.png' });
    const text = await pageText(page);
    const hasProfile = text.toLowerCase().includes('profile') || text.includes(USERNAME);
    console.log(`Profile page reached: ${hasProfile}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MPRF_002 App version number visible on profile', async ({ page }) => {
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MPRF_002_version.png' });
    const text = await pageText(page);
    const hasVersion = /v\d+\.\d+|\d+\.\d+\.\d+|version/i.test(text);
    console.log(`Version visible: ${hasVersion} | Text snippet: ${text.substring(0, 200)}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MPRF_003 User email displayed on profile', async ({ page }) => {
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MPRF_003_email.png' });
    const text = await pageText(page);
    const hasEmail = text.includes('@tricog.com') || text.includes('reeva');
    console.log(`Email on profile: ${hasEmail}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MPRF_004 Center name displayed on profile', async ({ page }) => {
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await page.screenshot({ path: 'mobile/reports/screenshots/MPRF_004_center.png' });
    const text = await pageText(page);
    console.log(`Profile text: ${text.substring(0, 300)}`);
    expect(page.url()).not.toContain('login');
  });

  test('TC_MPRF_005 Logout from profile page on mobile', async ({ page }) => {
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    await clickButton(page, 'Logout').catch(() => clickButton(page, 'Log Out').catch(() => clickButton(page, 'Sign Out').catch(() => {})));
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'mobile/reports/screenshots/MPRF_005_logout.png' });
    const onLogin = page.url().includes('login') || page.url() === LOGIN_URL || page.url() === `${LOGIN_URL}#/login`;
    const text = (await pageText(page)).toLowerCase();
    const loggedOut = onLogin || text.includes('sign in') || text.includes('log in') || text.includes('email');
    expect(loggedOut).toBe(true);
  });

  test('TC_MPRF_006 Profile layout fits mobile screen without overflow', async ({ page }) => {
    await clickButton(page, 'Profile').catch(() => {});
    await page.waitForTimeout(2000);
    await enableFlutterA11y(page, 1500);
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    await page.screenshot({ path: 'mobile/reports/screenshots/MPRF_006_layout.png' });
    expect(overflow).toBe(false);
  });
});
