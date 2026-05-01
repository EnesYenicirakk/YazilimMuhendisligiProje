Cypress.Commands.add('login', (username = 'admin', password = 'admin123') => {
  cy.visit('/');
  // Clear localStorage to ensure a fresh session
  cy.clearLocalStorage();
  
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.get('.dashboard-shell').should('exist'); // Wait for login to complete
});
