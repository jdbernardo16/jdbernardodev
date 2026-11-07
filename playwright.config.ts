import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  use: { baseURL: 'http://localhost:3000', channel: 'chromium' },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
