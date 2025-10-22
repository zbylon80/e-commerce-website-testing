export class BasketPage {
  private readonly cartUrl = '/index.php?route=checkout/cart';
  readonly selectors = {
    quantityInput: '#input-quantity',
    addToCartButton: 'button.button-cart',
    cartProductLink: '.table-responsive table tbody tr td.text-left a',
    removeButton: '.table-responsive table tbody tr button[title="Remove"]',
    cartContent: '#content',
  };

  addCurrentProductToCart(quantity: number = 1) {
    if (quantity !== 1) {
      cy.get(this.selectors.quantityInput).clear().type(`${quantity}`);
    }

    cy.get(this.selectors.addToCartButton)
      .filter(':enabled')
      .should(($buttons) => {
        expect($buttons.length, 'at least one enabled add-to-cart button').to.be.greaterThan(0);
      })
      .first()
      .click({ force: true });
  }

  assertAddToCartSuccess(productName: string) {
    cy.contains('body', `Success: You have added ${productName} to your shopping cart!`, {
      timeout: 10000,
    }).should('be.visible');
  }

  visit() {
    cy.visit(this.cartUrl);
  }

  assertCartContainsProduct(productName: string) {
    cy.contains(this.selectors.cartProductLink, new RegExp(productName, 'i')).should('be.visible');
  }

  emptyCart() {
    this.visit();

    cy.get('body').then(($body) => {
      const buttonCount = $body.find(this.selectors.removeButton).length;

      for (let index = 0; index < buttonCount; index += 1) {
        cy.get(this.selectors.removeButton).first().click();
      }
    });

    cy.get(this.selectors.cartContent)
      .should('contain', 'Your shopping cart is empty!')
      .should('be.visible');
  }
}
