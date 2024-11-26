export const config = {
  baseURL: 'http://localhost:8002/',
  timeout: 15000,
  browserOptions: {
    headless: false,
    timeout: 30000,
  },
  browserContextOptions: {
    viewport: { width: 1920, height: 1080 },
  }
};