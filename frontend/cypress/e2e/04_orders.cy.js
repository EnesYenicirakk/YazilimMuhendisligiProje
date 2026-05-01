const PRODUCT_PREFIX = 'TEST_E2E_ORDER_PRODUCT_'
const CUSTOMER_PREFIX = 'TEST_E2E_CUSTOMER_'

const uniqueId = () => `${Date.now()}_${Cypress._.random(1000, 9999)}`
const orderRow = (orderId) => cy.get(`[data-cy="order-row"][data-order-id="${orderId}"]`)

describe('Orders E2E', () => {
  beforeEach(function () {
    const id = uniqueId()
    cy.fixture('users').then((users) => {
      this.user = users.admin
    })
    cy.fixture('products').then(({ e2eProduct }) => {
      this.product = {
        ...e2eProduct,
        ad: `${PRODUCT_PREFIX}${id}`,
        urunId: `${PRODUCT_PREFIX}${id}`,
        urunAdedi: 50,
        magazaStok: 20,
      }
      this.customer = {
        ad: `${CUSTOMER_PREFIX}${id}`,
        telefon: '05550000000',
        sonAlim: '2026-05-01',
        not: 'TEST_Cypress siparis musterisi',
      }
      cy.apiCreateProduct(this.product).as('createdProduct')
      cy.apiCreateCustomer(this.customer).as('createdCustomer')
    })
  })

  it('creates an order with TEST_ customer/product and reduces only the TEST_ product stock', function () {
    cy.login(this.user)
    cy.openPage('menu-siparisler', 'orders-page')

    cy.get('@createdProduct').then((createdProduct) => {
      cy.get('@createdCustomer').then((createdCustomer) => {
        cy.getByCy('order-add-button').click()
        cy.getByCy('order-create-modal').should('be.visible')
        cy.getByCy('order-customer-select').select(String(createdCustomer.uid))
        cy.getByCy('order-product-input').clear().type(createdProduct.urunId)
        cy.get(`[data-cy="order-product-option"][data-product-sku="${createdProduct.urunId}"]`).click()
        cy.getByCy('order-quantity-input').clear().type('3')
        cy.getByCy('order-total-input').clear().type('1230')
        cy.getByCy('order-payment-status-select').select('Beklemede')
        cy.getByCy('order-prep-status-select').select('Hazırlanıyor')
        cy.getByCy('order-delivery-status-select').select('Hazırlanıyor')
        cy.getByCy('order-create-submit').click()

        cy.getByCy('order-create-modal').should('not.exist')
        cy.getByCy('order-search').clear().type(createdCustomer.ad)
        cy.getByCy('order-row').should('have.length.at.least', 1).first().within(() => {
          cy.getByCy('order-customer').should('contain', createdCustomer.ad)
        })

        cy.apiFindProductBySku(createdProduct.urunId).then((productAfterOrder) => {
          expect(productAfterOrder.magazaStok).to.equal(17)
        })
      })
    })
  })

  it('keeps order form open when required order fields are invalid', function () {
    cy.login(this.user)
    cy.openPage('menu-siparisler', 'orders-page')

    cy.getByCy('order-add-button').click()
    cy.getByCy('order-create-modal').should('be.visible')
    cy.getByCy('order-product-input').clear()
    cy.getByCy('order-quantity-input').clear({ force: true }).type('0', { force: true })
    cy.getByCy('order-total-input').clear({ force: true }).type('100', { force: true })
    cy.getByCy('order-create-submit').click()

    cy.getByCy('order-create-modal').should('be.visible')
  })

  it('opens order detail and cancel modal without confirming cancellation', function () {
    cy.get('@createdProduct').then((createdProduct) => {
      cy.get('@createdCustomer').then((createdCustomer) => {
        cy.apiCreateOrder({
          musteriUid: createdCustomer.uid,
          urunUid: createdProduct.uid,
          urun: createdProduct.ad,
          urunAdedi: 1,
          toplamTutar: 410,
          siparisTarihi: '2026-05-01',
          odemeDurumu: 'Beklemede',
          urunHazirlik: 'Hazırlanıyor',
          teslimatDurumu: 'Hazırlanıyor',
        }).then((order) => {
          cy.login(this.user)
          cy.openPage('menu-siparisler', 'orders-page')
          cy.getByCy('order-search').clear().type(order.siparisNo)
          orderRow(order.siparisNo).within(() => {
            cy.getByCy('order-detail-button').click()
          })
          cy.getByCy('order-detail-modal').should('be.visible').and('contain', order.siparisNo)
          cy.getByCy('order-detail-modal').contains('button', 'Kapat').click()

          orderRow(order.siparisNo).within(() => {
            cy.getByCy('order-cancel-button').click()
          })
          cy.getByCy('order-cancel-modal').should('be.visible').and('contain', order.siparisNo)
          cy.getByCy('order-cancel-dismiss').click()
          cy.getByCy('order-cancel-modal').should('not.exist')
          orderRow(order.siparisNo).should('exist')
        })
      })
    })
  })
})
