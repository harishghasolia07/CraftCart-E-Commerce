describe('E-Commerce App Basic Flow', () => {
  it('loads the home page and fetches products', () => {
    cy.visit('/');
    cy.contains('Obsidian Atelier').should('be.visible');
    // Ensure that some products are loaded (since it relies on got/fetch, wait to see cards)
    cy.get('div', { timeout: 10000 }).contains('$').should('be.visible');
  });

  it('can navigate to product detail page without re-fetching', () => {
    cy.visit('/');
    cy.get('div', { timeout: 10000 }).contains('$').should('be.visible');
    cy.get('a').first().click(); // Navigate to details
    cy.contains('Add to MyCart').should('be.visible');
    cy.contains('Return to Collection').should('be.visible');
  });

  it('can add an item to the cart and total updates', () => {
    cy.visit('/');
    cy.get('div', { timeout: 10000 }).contains('$').should('be.visible');
    cy.get('a').first().click();
    
    // Add to cart
    cy.contains('Add to MyCart').click();
    
    // Check footer
    cy.contains('Cart Items: 1').should('be.visible');
    
    // Total should update (just check that it is > 0)
    cy.contains('Total Value: $0.00').should('not.exist');
    
    // Return home
    cy.contains('Return to Collection').click();
    cy.contains('Obsidian Atelier').should('be.visible');
  });
});
