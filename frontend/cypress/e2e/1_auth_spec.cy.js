describe('Authentication Flow', () => {
  it('Should load the login page', () => {
    cy.visit('/');
    cy.get('h1').contains('Giriş Yap');
    cy.get('#username').should('exist');
    cy.get('#password').should('exist');
  });

  it('Should show error on invalid credentials', () => {
    cy.visit('/');
    cy.get('#username').type('wronguser');
    cy.get('#password').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.get('.message.error').should('be.visible');
  });

  it('Should login successfully with correct credentials', () => {
    cy.visit('/');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Redirects to dashboard/index after login
    cy.get('.dashboard-shell').should('exist');
  });
});
