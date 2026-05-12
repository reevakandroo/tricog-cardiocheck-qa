// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['json', { outputFile: '../../reports/results.json' }],
  ],
  use: {
    baseURL: 'https://cardiocheck-releasev140.up.railway.app',
    headless: true,
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'retain-on-failure',
    actionTimeout: 25_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'Pixel 5 Portrait',
      use: {
        ...devices['Pixel 5'],
        // Pixel 5: 393×851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true
      },
    },
    {
      name: 'Pixel 5 Landscape',
      use: {
        ...devices['Pixel 5 landscape'],
        // 851×393, isMobile: true, hasTouch: true
      },
      // Only run orientation-specific tests
      testMatch: ['**/10_m_orientation*'],
    },
    {
      name: 'Galaxy S9+',
      use: { ...devices['Galaxy S9+'] },
      // Only run for secondary device compatibility checks
      testMatch: ['**/01_m_auth*', '**/02_m_dashboard*'],
    },
  ],
});
