import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    baseURL: 'https://example.com',
    // viewport: { width: 1280, height: 720 },
    viewport: { width: 720, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
