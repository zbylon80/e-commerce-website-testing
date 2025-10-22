import { SearchPage } from '../support/page-objects/SearchPage';
import { BasketPage } from '../support/page-objects/BasketPage';

describe('Basket interactions', () => {
  const searchPage = new SearchPage();
  const basketPage = new BasketPage();

  beforeEach(() => {
    cy.login();
    searchPage.visit();
  });

  it('adds a product from search results to the basket', () => {
    const searchQuery = 'HTC Touch HD';

    searchPage.search(searchQuery);

    searchPage.openResultAtIndex(1).then((productName) => {
      cy.url().should('include', 'route=product/product');

      basketPage.addCurrentProductToCart();
      basketPage.assertAddToCartSuccess(productName);
      basketPage.visit();
      basketPage.assertCartContainsProduct(productName);
      basketPage.emptyCart();
    });
  });
});
