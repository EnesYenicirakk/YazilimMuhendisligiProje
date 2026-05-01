const CUSTOMER_PREFIX = 'TEST_E2E_UI_CUSTOMER_'

const uniqueId = () => `${Date.now()}_${Cypress._.random(1000, 9999)}`

describe('Customers and Finance E2E', () => {
  beforeEach(function () {
    cy.fixture('users').then((users) => {
      cy.login(users.admin)
    })
  })

  it('adds and lists a TEST_ customer without using real customer data', () => {
    const customerName = `${CUSTOMER_PREFIX}${uniqueId()}`

    cy.openPage('menu-musteriler', 'customers-page')
    cy.getByCy('customer-add-button').click()
    cy.getByCy('customer-create-modal').should('be.visible')
    cy.getByCy('customer-name-input').clear().type(customerName)
    cy.getByCy('customer-phone-input').clear().type('05550000001')
    cy.getByCy('customer-date-input').clear().type('2026-05-01')
    cy.getByCy('customer-note-input').clear().type('TEST_Cypress musterisi')
    cy.getByCy('customer-create-submit').click()

    cy.getByCy('customer-create-modal').should('not.exist')
    cy.getByCy('customer-search').clear().type(customerName)
    cy.getByCy('customer-row').should('have.length', 1).and('contain', customerName)
  })

  it('opens customer delete confirmation but cancels instead of deleting', () => {
    const customerName = `${CUSTOMER_PREFIX}${uniqueId()}`

    cy.apiCreateCustomer({
      ad: customerName,
      telefon: '05550000002',
      sonAlim: '2026-05-01',
      not: 'TEST_Cypress silme iptal musterisi',
    })

    cy.reload()
    cy.getByTestId('home-page').should('be.visible')
    cy.openPage('menu-musteriler', 'customers-page')
    cy.getByCy('customer-search').clear().type(customerName)
    cy.getByCy('customer-row').should('have.length', 1).within(() => {
      cy.getByCy('customer-delete-button').click()
    })

    cy.getByCy('customer-delete-modal').should('be.visible').and('contain', customerName)
    cy.getByCy('customer-delete-cancel').click()
    cy.getByCy('customer-delete-modal').should('not.exist')
    cy.getByCy('customer-row').should('have.length', 1)
  })

  it('shows finance summaries and switches between income and expense tabs without changing records', () => {
    cy.openPage('menu-odemeler', 'finance-page')

    cy.getByCy('finance-summary-income').should('be.visible')
    cy.getByCy('finance-summary-expense').should('be.visible')
    cy.getByCy('finance-summary-net').should('be.visible')
    cy.getByCy('finance-income-table').should('exist')

    cy.getByCy('finance-expense-tab').click()
    cy.getByCy('finance-expense-table').should('exist')
    cy.getByCy('finance-income-tab').click()
    cy.getByCy('finance-income-table').should('exist')
  })
})
