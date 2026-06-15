import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 4173)
const EXTERNAL_BASE_URL = process.env.PLAYWRIGHT_BASE_URL
const BASE_URL = EXTERNAL_BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // When PLAYWRIGHT_BASE_URL is set (e.g., for a production smoke pass),
  // skip spinning up a local static server and aim tests at the external URL.
  webServer: EXTERNAL_BASE_URL
    ? undefined
    : {
        command: `npx --yes serve dist/client -p ${PORT} --no-clipboard`,
        port: PORT,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
})
