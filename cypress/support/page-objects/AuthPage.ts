type Credentials = {
  email: string;
  password: string;
};

export class AuthPage {
  private readonly loginUrl = '/index.php?route=account/login';
  private readonly logoutUrl = '/index.php?route=account/logout';
  private readonly selectors = {
    email: '#input-email',
    password: '#input-password',
    submit: 'form [type="submit"][value="Login"]',
    accountHeading: 'h2',
  };

  visitLogin() {
    cy.visit(this.loginUrl);
  }

  fillLoginForm(credentials: Credentials) {
    cy.get(this.selectors.email).clear().type(credentials.email);
    cy.get(this.selectors.password).clear().type(credentials.password, { log: false });
  }

  submitLogin() {
    cy.get(this.selectors.submit).click();
  }

  assertLoginSuccess() {
    cy.url().should('include', 'route=account/account');
    cy.get(this.selectors.accountHeading).should('contain.text', 'My Account');
  }

  login(credentials: Credentials) {
    this.visitLogin();
    this.fillLoginForm(credentials);
    this.submitLogin();
  }

  logout() {
    cy.visit(this.logoutUrl);
  }
}
