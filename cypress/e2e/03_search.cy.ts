import { SearchPage } from '../support/page-objects/SearchPage';

describe('Product search and filters', () => {
  const searchPage = new SearchPage();

  beforeEach(() => {
    cy.login();
    searchPage.visit();
  });

  it('finds Mac products and locks the price filter to product price', () => {
    searchPage.search('iPod Touch', '27');

    searchPage.assertResultsContainText('iPod Touch');
    searchPage.assertPriceFilterMatchesResults();
  });

  it('hides results when the price range excludes all products', () => {
    searchPage.search('iPod Touch', '27');
    searchPage.assertResultsContainText('iPod Touch');

    searchPage.setPriceFilterBeyondResults();

    searchPage.assertNoResults();
  });

  it('filters the full catalog and keeps paginated results within the price range', () => {
    const minPrice = 134;
    const maxPrice = 146;

    searchPage.setPriceFilter(minPrice, maxPrice);

    searchPage.assertPaginationIncludes(2);
    searchPage.assertResultsWithinPriceRangeAcrossPages(minPrice, maxPrice);
  });
});
