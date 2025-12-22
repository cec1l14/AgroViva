import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npx http-server ./public -p 3000',
    url: 'http://localhost:3000',
    timeout: 30000,
    reuseExistingServer: true,
  },
  testDir: './tests',
});