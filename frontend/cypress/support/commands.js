const API_URL = 'http://127.0.0.1:8000/api'

Cypress.Commands.add('getByTestId', (testId, ...args) => {
  return cy.get(`[data-cy="${testId}"], [data-testid="${testId}"]`, ...args)
})

Cypress.Commands.add('findByTestId', { prevSubject: true }, (subject, testId, ...args) => {
  return cy.wrap(subject).find(`[data-cy="${testId}"], [data-testid="${testId}"]`, ...args)
})

Cypress.Commands.add('getByCy', (testId, ...args) => {
  return cy.get(`[data-cy="${testId}"]`, ...args)
})

const assertLocalOnly = () => {
  const appBaseUrl = String(Cypress.config('baseUrl') || '')
  const apiBaseUrl = API_URL
  const allowedHosts = ['127.0.0.1', 'localhost']

  const appHost = new URL(appBaseUrl).hostname
  const apiHost = new URL(apiBaseUrl).hostname

  expect(allowedHosts, 'Cypress app host must be local/dev').to.include(appHost)
  expect(allowedHosts, 'Cypress API host must be local/dev').to.include(apiHost)
}

Cypress.Commands.add('login', (user = { username: 'admin', password: 'admin123' }) => {
  assertLocalOnly()
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
  assertLocalOnly()
  expect(product.urunId, 'test product sku').to.match(/^TEST_/)
  return cy.request('POST', `${API_URL}/products`, product).its('body')
})

Cypress.Commands.add('apiCreateCustomer', (customer) => {
  assertLocalOnly()
  expect(customer.ad, 'test customer name').to.match(/^TEST_/)
  return cy.request('POST', `${API_URL}/customers`, customer).its('body')
})

Cypress.Commands.add('apiCreateOrder', (order) => {
  assertLocalOnly()
  return cy.request('POST', `${API_URL}/orders`, order).its('body')
})

Cypress.Commands.add('apiFindProductBySku', (sku) => {
  assertLocalOnly()
  return cy.request('GET', `${API_URL}/products`).then(({ body }) => {
    return body.find((product) => product.urunId === sku) ?? null
  })
})

Cypress.Commands.add('apiDeleteProductBySku', () => {
  throw new Error('Unsafe delete helper is disabled. Use TEST_ data and leave audit-safe test records instead.')
})

Cypress.Commands.add('apiDeleteProductsByPrefix', () => {
  throw new Error('Unsafe bulk delete helper is disabled. Cypress must not delete records by prefix.')
})
