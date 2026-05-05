// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 2,
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
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
});
