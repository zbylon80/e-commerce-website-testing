describe('Sanity', () => {
  it('opens home', () => {
    cy.visit('/');
    cy.title().should('match', /Your Store/i);
  });
});
