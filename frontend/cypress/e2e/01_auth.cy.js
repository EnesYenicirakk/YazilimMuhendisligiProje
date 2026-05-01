describe('Authentication', () => {
  beforeEach(() => {
    cy.fixture('users').as('users')
    cy.clearLocalStorage()
  })

  it('logs in with valid credentials and opens the application shell', function () {
    cy.visit('/')
    cy.getByTestId('login-form').should('be.visible')

    cy.getByTestId('login-username').type(this.users.admin.username)
    cy.getByTestId('login-password').type(this.users.admin.password, { log: false })
    cy.getByTestId('login-submit').should('be.enabled').click()

    // The app keeps the authenticated session in localStorage and shows the home module selector.
    cy.window().its('localStorage.access_token').should('be.a', 'string').and('not.be.empty')
    cy.getByTestId('home-page').should('be.visible')
    cy.contains('Stok Takip Sistemi').should('be.visible')
  })

  it('shows a clear error and stays on login for invalid credentials', function () {
    cy.visit('/')
    cy.getByTestId('login-form').should('be.visible')

    cy.getByTestId('login-username').type(this.users.invalid.username)
    cy.getByTestId('login-password').type(this.users.invalid.password, { log: false })
    cy.getByTestId('login-submit').click()

    cy.getByTestId('login-error').should('be.visible').and('not.be.empty')
    cy.getByTestId('login-form').should('be.visible')
    cy.window().its('localStorage.access_token').should('not.exist')
  })
})
