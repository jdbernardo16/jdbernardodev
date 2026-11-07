import { defineConfig } from '@playwright/test'

const useWebServer = !process.env.PLAYWRIGHT_NO_SERVER

export default defineConfig({
  testDir: './test/e2e',
  timeout: 60_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
    channel: 'chromium',
  },
  ...(useWebServer
    ? {
        webServer: {
          command: 'pnpm dev --host 127.0.0.1',
          url: 'http://127.0.0.1:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }
    : {}),
})
