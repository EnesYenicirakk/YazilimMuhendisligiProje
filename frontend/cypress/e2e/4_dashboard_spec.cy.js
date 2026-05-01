describe('Dashboard and Charts Flow', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123');
  });

  it('Should load Dashboard page and render charts/statistics', () => {
    // Navigate to dashboard
    cy.contains('Dashboard').click({ force: true });
    cy.get('h1').contains('Dashboard').should('be.visible');

    // 1. Verify summary cards (.ozet-grid)
    cy.get('.ozet-grid').should('exist');
    cy.get('.ozet-kartcik').should('have.length.at.least', 1);

    // 2. Verify Live Summaries (e.g. Bugünkü Siparişler)
    cy.get('.dashboard-canli-grid').should('exist');
    cy.get('.canli-ozet-karti').contains('Bugünkü Siparişler').should('exist');

    // 3. Verify charts rendering
    // Weekly Sales Chart
    cy.get('.haftalik-grafik-kapsayici').should('exist');
    
    // Bottom Charts (SVG line charts)
    cy.get('svg.cizgi-grafik').should('have.length.at.least', 1);
    
    // Column Chart (sutun-grafik)
    cy.get('.sutun-grafik').should('exist');
    cy.get('.sutun-ogesi').should('have.length.at.least', 1);

    // Ensure there's no visual breakdown
    // Toggle chart visibility using the menu
    cy.contains('button', 'Tabloları Gizle/Göster').click();
    cy.get('.dashboard-bolum-menu').should('be.visible');
    cy.get('input[type="checkbox"]').first().uncheck(); // hide something
    cy.get('.dashboard-canli-grid').should('not.exist'); // 'canli' is hidden
  });
});
