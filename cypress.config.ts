import { defineConfig } from 'cypress';

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
});
