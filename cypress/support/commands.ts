type LoginOptions = {
  email?: string;
  password?: string;
};

Cypress.Commands.add('login', (options: LoginOptions = {}) => {
  const email = options.email ?? Cypress.env('TEST_LOGIN');
  const password = options.password ?? Cypress.env('TEST_PASSWORD');

  if (!email || !password) {
    throw new Error(
      'cy.login requires credentials. Pass them explicitly or set TEST_LOGIN and TEST_PASSWORD in your environment.',
    );
  }

  return cy
    .request({
      method: 'POST',
      url: '/index.php?route=account/login',
      form: true,
      body: {
        email,
        password,
      },
    })
    .then((response) => {
      if (![200, 302].includes(response.status)) {
        throw new Error(`Unexpected status code during login: ${response.status}`);
      }

      // Visit account page to ensure the session cookies are applied in the browser context.
      return cy.visit('/index.php?route=account/account');
    });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(options?: LoginOptions): Chainable<Cypress.AUTWindow>;
    }
  }
}

export {};
