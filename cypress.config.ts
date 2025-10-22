import { defineConfig } from 'cypress';
import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportFilename: 'index',
    overwrite: true,
    html: true,
    json: false,
    charts: true,
    reportTitle: 'E-commerce Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    baseUrl: 'https://ecommerce-playground.lambdatest.io',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    watchForFileChanges: false,
    viewportWidth: 1366,
    viewportHeight: 768,
    video: false,
    setupNodeEvents(on, config) {
      cypressMochawesomeReporter(on);
      return config;
    },
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
