import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'https://ecommerce-playground.lambdatest.io',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    watchForFileChanges: false,
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false,
    retries: {
      runMode: 1,
      openMode: 0,
    },
  },
  env: {
    TEST_LOGIN: process.env.TEST_LOGIN,
    TEST_PASSWORD: process.env.TEST_PASSWORD,
  },
});
