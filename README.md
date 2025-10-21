# E-commerce Website Testing

End-to-end test suite for the demo store at `https://ecommerce-playground.lambdatest.io`, created as part of the recruitment process for **S&P**.

## Tech stack

- Cypress 15 (E2E mode)
- TypeScript
- Page Object Model
- Faker for synthetic test data
- ESLint + Prettier for code quality

## Prerequisites

- Node.js 18 or newer
- npm (bundled with Node.js)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables used by the tests:
   ```bash
   cp .env.example .env
   # fill in TEST_LOGIN and TEST_PASSWORD in the .env file
   ```

## Key npm scripts

- `npm run cy:open` – launches Cypress in interactive mode.
- `npm run cy:run` – runs the full suite headlessly (Chrome by default).
- `npm run lint` – lints the codebase.
- `npm run format` – formats the code with Prettier.

## Project structure

- `cypress/e2e` – test scenarios, e.g. `registration.cy.ts`.
- `cypress/support/page-objects` – page objects that wrap UI interactions.
- `cypress/support/factories` – test data builders.
- `cypress.config.ts` – Cypress configuration (baseUrl, viewport, retries, etc.).
