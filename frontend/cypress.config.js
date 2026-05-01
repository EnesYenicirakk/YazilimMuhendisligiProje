import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    allowCypressEnv: false,
    baseUrl: 'http://127.0.0.1:5173',
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
