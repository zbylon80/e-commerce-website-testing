export class SearchPage {
  url = '/index.php?route=product/search&search=';

  selectors = {
    searchInput: '#input-search',
    categorySelect: 'select[name="category_id"]',
    searchButton: '#button-search',
    productCards: '.product-thumb',
    productTitle: '.product-thumb .title',
    priceFilterMin: '.module-mz_filter input[name="mz_fp[min]"]',
    priceFilterMax: '.module-mz_filter input[name="mz_fp[max]"]',
    paginationLinks: '.content-pagination .pagination .page-link',
    activePaginationLabel: '.content-pagination .pagination li.active span.page-link',
  };

  visit() {
    cy.visit(this.url);
  }

  search(query: string, categoryValue?: string) {
    cy.get(this.selectors.searchInput).clear().type(query);

    if (categoryValue) {
      cy.get(this.selectors.categorySelect).select(categoryValue);
    }

    cy.get(this.selectors.searchButton).click();
  }

  assertResultsContainText(text: string) {
    const lowerText = text.toLowerCase();

    cy.get(this.selectors.productCards).its('length').should('be.greaterThan', 0);

    cy.get(this.selectors.productTitle).each(($title) => {
      const currentText = ($title.text() || '').toLowerCase();
      expect(currentText).to.contain(lowerText);
    });
  }

  getResultPrices(): Cypress.Chainable<number[]> {
    return cy.get(this.selectors.productCards).then(($cards) => {
      const list: number[] = [];

      $cards.each((_, element) => {
        const htmlElement = element as HTMLElement;
        const priceContainer = htmlElement.querySelector('.price');

        if (!priceContainer) {
          return;
        }

        const priceElement =
          priceContainer.querySelector('.price-new') ||
          priceContainer.querySelector('.price-normal') ||
          priceContainer.querySelector('.price-special') ||
          priceContainer.querySelector('.price-old') ||
          priceContainer;

        const priceText = priceElement?.textContent ?? '';
        const match = priceText.match(/[\d.,]+/);

        if (match) {
          const parsed = Number.parseFloat(match[0].replace(/,/g, ''));

          if (!Number.isNaN(parsed)) {
            list.push(parsed);
          }
        }
      });

      return list;
    });
  }

  assertPriceFilterMatchesResults() {
    this.getResultPrices().then((prices) => {
      if (!prices.length) {
        throw new Error('No prices found for search results');
      }

      const roundedPrices = prices.map((value) => Math.floor(value));
      const minPrice = Math.min(...roundedPrices);
      const maxPrice = Math.max(...roundedPrices);

      cy.get(this.selectors.priceFilterMin)
        .filter(':visible')
        .first()
        .should('have.value', minPrice.toString());

      cy.get(this.selectors.priceFilterMax)
        .filter(':visible')
        .first()
        .should('have.value', maxPrice.toString());
    });
  }

  setPriceFilter(min: number, max: number) {
    cy.get(this.selectors.priceFilterMin).filter(':visible').first().clear().type(`${min}`);

    cy.get(this.selectors.priceFilterMax)
      .filter(':visible')
      .first()
      .clear()
      .type(`${max}`)
      .blur()
      .trigger('change', { force: true });

    cy.get('body', { timeout: 10000 }).should('have.class', 'mz-filter-loading');
    cy.get('body', { timeout: 10000 }).should('not.have.class', 'mz-filter-loading');
  }

  setPriceFilterBeyondResults(offset: number = 10, rangeWidth: number = 5) {
    this.getResultPrices().then((prices) => {
      if (!prices.length) {
        throw new Error('No prices found to calculate out-of-range filter');
      }

      const highestPrice = Math.max(...prices);
      const minOutOfRange = Math.floor(highestPrice) + offset;

      this.setPriceFilter(minOutOfRange, minOutOfRange + rangeWidth);
    });
  }

  assertNoResults() {
    cy.get('body').find(this.selectors.productCards).should('have.length', 0);

    cy.contains('There is no product that matches the search criteria', {
      timeout: 10000,
    }).should('be.visible');
  }

  assertResultsWithinPriceRange(min: number, max: number) {
    cy.get(this.selectors.productCards).its('length').should('be.greaterThan', 0);

    this.getResultPrices().then((prices) => {
      expect(prices.length, 'products should be returned for the current page').to.be.greaterThan(
        0,
      );

      prices.forEach((price) => {
        expect(price, `price ${price} should be within range`).to.be.at.least(min);
        expect(price, `price ${price} should be within range`).to.be.at.most(max);
      });
    });
  }

  assertResultsWithinPriceRangeAcrossPages(min: number, max: number) {
    this.getVisiblePaginationPages().then((pages) => {
      if (!pages.length) {
        this.assertResultsWithinPriceRange(min, max);
        return;
      }

      pages.forEach((pageNumber) => {
        this.goToPaginationPage(pageNumber);
        this.assertResultsWithinPriceRange(min, max);
      });
    });
  }

  private getVisiblePaginationPages(): Cypress.Chainable<number[]> {
    return cy.get('body').then(($body) => {
      const nodes = $body.find(
        `${this.selectors.paginationLinks}, ${this.selectors.activePaginationLabel}`,
      );
      const pages = new Set<number>();

      nodes.each((_, element) => {
        const text = element.textContent?.trim() ?? '';
        const parsed = Number.parseInt(text, 10);

        if (!Number.isNaN(parsed)) {
          pages.add(parsed);
        }
      });

      return Array.from(pages).sort((a, b) => a - b);
    });
  }

  assertPaginationIncludes(pageNumber: number) {
    cy.contains(this.selectors.paginationLinks, new RegExp(`^${pageNumber}$`)).should('be.visible');
  }

  goToPaginationPage(pageNumber: number) {
    cy.get('body').then(($body) => {
      const isAlreadyActive = $body
        .find(this.selectors.activePaginationLabel)
        .toArray()
        .some((element) => element.textContent?.trim() === `${pageNumber}`);

      if (isAlreadyActive) {
        return;
      }

      cy.contains(this.selectors.paginationLinks, new RegExp(`^${pageNumber}$`))
        .scrollIntoView()
        .click();
    });

    cy.contains(this.selectors.activePaginationLabel, new RegExp(`^${pageNumber}$`)).should(
      'be.visible',
    );
  }
}
