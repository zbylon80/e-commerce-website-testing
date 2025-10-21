type RegistrationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword?: string;
  agree?: boolean;
};

export class RegistrationPage {
  private readonly url = '/index.php?route=account/register';
  private readonly selectors = {
    firstName: '#input-firstname',
    lastName: '#input-lastname',
    email: '#input-email',
    telephone: '#input-telephone',
    password: '#input-password',
    confirmPassword: '#input-confirm',
    privacyPolicy: '#input-agree',
    submit: 'form [type="submit"][value="Continue"]',
    successHeading: 'h1',
    errorAlert: '.alert-danger',
  };

  private readonly fieldErrorSelectors = {
    firstName: '#input-firstname + .text-danger',
    lastName: '#input-lastname + .text-danger',
    email: '#input-email + .text-danger',
    telephone: '#input-telephone + .text-danger',
    password: '#input-password + .text-danger',
    confirmPassword: '#input-confirm + .text-danger',
  };

  visit() {
    cy.visit(this.url);
  }

  fillForm(payload: RegistrationPayload) {
    cy.get(this.selectors.firstName).clear().type(payload.firstName);
    cy.get(this.selectors.lastName).clear().type(payload.lastName);
    cy.get(this.selectors.email).clear().type(payload.email);
    cy.get(this.selectors.telephone).clear().type(payload.telephone);
    cy.get(this.selectors.password).clear().type(payload.password, { log: false });
    const confirmPassword = payload.confirmPassword ?? payload.password;
    cy.get(this.selectors.confirmPassword).clear().type(confirmPassword, { log: false });
    const shouldAgree = payload.agree ?? true;
    if (shouldAgree) {
      cy.get(this.selectors.privacyPolicy).check({ force: true });
    } else {
      cy.get(this.selectors.privacyPolicy).uncheck({ force: true });
    }
  }

  submit() {
    cy.get(this.selectors.submit).click();
  }

  assertSuccessMessage() {
    cy.get(this.selectors.successHeading).should('contain.text', 'Your Account Has Been Created!');
  }

  assertInlineError(field: keyof typeof this.fieldErrorSelectors, expected: string) {
    cy.get(this.fieldErrorSelectors[field]).should('be.visible').and('contain.text', expected);
  }

  assertErrorAlert(expected: string) {
    cy.get(this.selectors.errorAlert).should('be.visible').and('contain.text', expected);
  }

  assertNativeValidationMessage(
    field: 'firstName' | 'lastName' | 'email' | 'telephone' | 'password' | 'confirmPassword',
    expectedSubstring: string,
  ) {
    const selector = this.selectors[field];
    cy.get(selector).then(($input) => {
      const inputElement = $input[0] as HTMLInputElement;
      expect(inputElement.checkValidity(), `${field} should be invalid`).to.be.false;
      expect(inputElement.validationMessage).to.contain(expectedSubstring);
    });
  }
}
