describe('Inventory Management Flow', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123');
  });

  it('Should add a new product', () => {
    // Navigate to inventory
    cy.contains('Envanter').click({ force: true });
    cy.get('h1').contains('Envanter').should('be.visible');

    // Click "Yeni Ürün" button
    cy.contains('button', 'Yeni Ürün').click({ force: true });
    cy.get('.modal-kutu').should('be.visible').contains('Ürün Ekle');

    // Fill the form
    const uniqueId = `CYP-${Date.now().toString().slice(-4)}`;
    cy.contains('label', 'Ürün İsmi').next('input').type('Cypress Test Ürünü');
    cy.contains('label', 'Ürün ID').next('input').type(uniqueId);
    cy.contains('label', 'Ürün Adedi').next('input').clear().type('100');
    cy.contains('label', 'Minimum Stok').next('input').clear().type('10');
    cy.contains('label', 'Mağazadaki Ürün Sayısı').next('input').clear().type('50');

    // Save
    cy.contains('button', 'Kaydet').click({ force: true });

    // Verify it exists in the list (using search to find it quickly)
    cy.get('input[placeholder="Ürün veya ID ara"]').type(uniqueId);
    cy.get('table').contains('Cypress Test Ürünü').should('exist');
  });

  it('Should delete the product', () => {
    cy.contains('Envanter').click({ force: true });
    
    // Search for Cypress products
    cy.get('input[placeholder="Ürün veya ID ara"]').type('Cypress Test Ürünü');
    
    // Click delete on the first one found
    // Using eq(0) in case there are multiple from previous failed tests
    cy.get('button[title="Sil"]').eq(0).click({ force: true });
    
    // Confirm delete
    cy.get('.modal-kutu').should('be.visible').contains('Silmek istediğinizden emin misiniz');
    cy.contains('button', 'Evet').click({ force: true });
    
    // It should disappear
    cy.wait(1000); // give some time for API to respond
    // If it was the only one, table should be empty or say not found
    cy.get('body').then($body => {
      if ($body.find('table').length > 0) {
        cy.get('table').should('not.contain', 'Cypress Test Ürünü');
      } else {
        cy.contains('Parça bulunamadı').should('exist');
      }
    });
  });
});
