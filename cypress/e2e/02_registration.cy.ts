import { RegistrationPage } from '../support/page-objects/RegistrationPage';
import { AuthPage } from '../support/page-objects/AuthPage';
import { buildUser, TestUser } from '../support/factories/userFactory';

describe('User registration', () => {
  const registrationPage = new RegistrationPage();
  const authPage = new AuthPage();

  const completeRegistration = (user: TestUser) => {
    registrationPage.fillForm(user);
    registrationPage.submit();

    registrationPage.assertSuccessMessage();
    cy.url().should('include', 'route=account/success');
  };

  beforeEach(() => {
    registrationPage.visit();
  });

  it('registers a new customer successfully', () => {
    const user = buildUser();

    completeRegistration(user);
    authPage.logout();
  });

  it('allows a registered customer to log in', () => {
    const user = buildUser();

    completeRegistration(user);
    authPage.logout();

    authPage.login({ email: user.email, password: user.password });
    authPage.assertLoginSuccess();
    authPage.logout();
  });

  it('accepts a password that is 4 characters long (lower boundary)', () => {
    const password = 'Abc1';
    const user = buildUser({ password });

    completeRegistration(user);
    authPage.logout();
  });

  it('accepts a password that is 20 characters long (upper boundary)', () => {
    const password = 'Abcd1234Efgh5678IjkL';
    const user = buildUser({ password });

    completeRegistration(user);
    authPage.logout();
  });

  describe('form validation', () => {
    it('shows an error for an invalid email address', () => {
      const user = buildUser({ email: 'invalid-email' });

      registrationPage.fillForm(user);
      registrationPage.submit();

      registrationPage.assertNativeValidationMessage('email', "include an '@'");
      cy.url().should('include', 'route=account/register');
    });

    it('shows an error for a telephone number that is too short', () => {
      const user = buildUser({ telephone: '12' });

      registrationPage.fillForm(user);
      registrationPage.submit();

      registrationPage.assertInlineError('telephone', 'Telephone must be between 3 and 32 characters!');
      cy.url().should('include', 'route=account/register');
    });

    it('shows an error when the password is shorter than 4 characters', () => {
      const user = buildUser({ password: 'Ab1' });

      registrationPage.fillForm(user);
      registrationPage.submit();

      registrationPage.assertInlineError('password', 'Password must be between 4 and 20 characters!');
      cy.url().should('include', 'route=account/register');
    });

    //TODO - bug to report
    it.skip('shows an error when the password is longer than 20 characters', () => {
      const user = buildUser({ password: 'Abcd1234Efgh5678IjkLM' });

      registrationPage.fillForm(user);
      registrationPage.submit();

      registrationPage.assertInlineError('password', 'Password must be between 4 and 20 characters!');
      cy.url().should('include', 'route=account/register');
    });

    it('shows an error when password confirmation does not match', () => {
      const user = buildUser({ password: 'Abcdef12' });

      registrationPage.fillForm({ ...user, confirmPassword: 'Different12!' });
      registrationPage.submit();

      registrationPage.assertInlineError('confirmPassword', 'Password confirmation does not match password!');
      cy.url().should('include', 'route=account/register');
    });

    it('shows an alert when privacy policy is not accepted', () => {
      const user = buildUser();

      registrationPage.fillForm({ ...user, agree: false });
      registrationPage.submit();

      registrationPage.assertErrorAlert('Warning: You must agree to the Privacy Policy!');
      cy.url().should('include', 'route=account/register');
    });
  });
});
