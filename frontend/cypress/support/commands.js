const API_URL = 'http://127.0.0.1:8000/api'

Cypress.Commands.add('getByTestId', (testId, ...args) => {
  return cy.get(`[data-testid="${testId}"]`, ...args)
})

Cypress.Commands.add('findByTestId', { prevSubject: true }, (subject, testId, ...args) => {
  return cy.wrap(subject).find(`[data-testid="${testId}"]`, ...args)
})

Cypress.Commands.add('login', (user = { username: 'admin', password: 'admin123' }) => {
  cy.clearLocalStorage()
  cy.visit('/')
  cy.getByTestId('login-form').should('be.visible')
  cy.getByTestId('login-username').clear().type(user.username)
  cy.getByTestId('login-password').clear().type(user.password, { log: false })
  cy.getByTestId('login-submit').click()

  // Successful auth stores a backend token and renders the application shell.
  cy.window().its('localStorage.access_token').should('be.a', 'string').and('not.be.empty')
  cy.get('.dashboard-shell').should('be.visible')
})

Cypress.Commands.add('openPage', (menuTestId, pageTestId) => {
  cy.get('body').then(($body) => {
    const menuSelector = `[data-testid="${menuTestId}"]`
    const homeSelector = menuTestId.replace('menu-', 'home-')

    if ($body.find(menuSelector).length) {
      cy.get(menuSelector).should('be.visible').click()
    } else {
      cy.getByTestId(homeSelector).should('be.visible').click()
    }
  })

  cy.getByTestId(pageTestId).should('be.visible')
})

Cypress.Commands.add('apiCreateProduct', (product) => {
  return cy.request('POST', `${API_URL}/products`, product).its('body')
})

Cypress.Commands.add('apiDeleteProductBySku', (sku) => {
  return cy.request('GET', `${API_URL}/products`).then(({ body }) => {
    const products = body.filter((product) => product.urunId === sku)

    cy.wrap(products).each((product) => {
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/products/${product.uid}`,
        failOnStatusCode: false,
      })
    })
  })
})

Cypress.Commands.add('apiDeleteProductsByPrefix', (prefix) => {
  return cy.request('GET', `${API_URL}/products`).then(({ body }) => {
    const products = body.filter((product) => String(product.urunId).startsWith(prefix))

    cy.wrap(products).each((product) => {
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/products/${product.uid}`,
        failOnStatusCode: false,
      })
    })
  })
})
