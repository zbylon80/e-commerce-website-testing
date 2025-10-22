describe('Sanity', () => {
  it('opens home', () => {
    cy.visit('/');
    cy.title().should('match', /Your Store/i);
  });

  it('logs in via custom command', () => {
    cy.login();
    cy.url().should('include', 'route=account/account');
    cy.get('h2').should('contain.text', 'My Account');
  });
});
