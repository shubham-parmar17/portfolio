import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium', viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Mini'], browserName: 'chromium', viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1 },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
