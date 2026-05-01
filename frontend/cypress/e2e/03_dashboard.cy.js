describe('Dashboard E2E', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.admin)
    })
  })

  it('opens dashboard and navigates to inventory from the dashboard action', () => {
    cy.openPage('menu-dashboard', 'dashboard-page')

    cy.getByCy('dashboard-summary-card').should('have.length.at.least', 1)
    cy.getByCy('dashboard-go-inventory').click()
    cy.getByTestId('inventory-page').should('be.visible')
  })
})
