const PRODUCT_PREFIX = 'E2E-STOCK-'

const productRow = (sku) => cy.get(`[data-product-sku="${sku}"]`)

const searchInventoryBySku = (sku) => {
  cy.getByTestId('inventory-search').clear().type(sku)
  productRow(sku).should('have.length', 1)
}

const searchProductManagementBySku = (sku) => {
  cy.getByTestId('product-management-search').clear().type(sku)
  productRow(sku).should('have.length', 1)
}

describe('Inventory and Stock E2E', () => {
  beforeEach(function () {
    cy.fixture('users').then((users) => {
      cy.login(users.admin)
    })

    cy.fixture('products').then(({ e2eProduct }) => {
      this.baseProduct = e2eProduct
      this.sku = `${PRODUCT_PREFIX}${Cypress._.random(100000, 999999)}`
      this.product = {
        ...e2eProduct,
        urunId: this.sku,
      }
    })
  })

  afterEach(function () {
    if (this.sku) {
      cy.apiDeleteProductBySku(this.sku)
    }
  })

  after(() => {
    cy.apiDeleteProductsByPrefix(PRODUCT_PREFIX)
  })

  it('adds a product from the UI and verifies it is listed', function () {
    cy.openPage('menu-envanter', 'inventory-page')
    cy.getByTestId('inventory-add-product').should('be.visible').click()

    cy.getByTestId('product-create-modal').should('be.visible')
    cy.getByTestId('product-name-input').clear().type(this.product.ad)
    cy.getByTestId('product-sku-input').clear().type(this.product.urunId)
    cy.getByTestId('product-warehouse-stock-input').clear().type(String(this.product.urunAdedi))
    cy.getByTestId('product-purchase-price-input').clear().type(String(this.product.alisFiyati))
    cy.getByTestId('product-sale-price-input').clear().type(String(this.product.satisFiyati))
    cy.getByTestId('product-min-stock-input').clear().type(String(this.product.minimumStok))
    cy.getByTestId('product-store-stock-input').clear().type(String(this.product.magazaStok))
    cy.getByTestId('product-save-button').click()

    cy.getByTestId('product-create-modal').should('not.exist')
    searchInventoryBySku(this.product.urunId)

    productRow(this.product.urunId).within(() => {
      cy.contains(this.product.ad).should('be.visible')
      cy.getByTestId('inventory-product-sku').should('have.text', this.product.urunId)
      cy.getByTestId('inventory-warehouse-stock').should('have.text', String(this.product.urunAdedi))
      cy.getByTestId('inventory-store-stock').should('have.text', String(this.product.magazaStok))
    })
  })

  it('updates the store stock for an existing product', function () {
    cy.apiCreateProduct(this.product)
    cy.reload()
    cy.getByTestId('home-page').should('be.visible')
    cy.openPage('menu-envanter', 'inventory-page')
    searchInventoryBySku(this.product.urunId)

    productRow(this.product.urunId).within(() => {
      cy.getByTestId('inventory-edit-product').click()
    })

    cy.getByTestId('product-edit-modal').should('be.visible')
    cy.getByTestId('product-store-stock-input').clear().type('48')
    cy.getByTestId('product-save-button').click()

    cy.getByTestId('product-edit-modal').should('not.exist')
    searchInventoryBySku(this.product.urunId)
    productRow(this.product.urunId)
      .findByTestId('inventory-store-stock')
      .should('have.text', '48')
  })

  it('renders product name, price and stock information correctly', function () {
    cy.apiCreateProduct(this.product)
    cy.reload()
    cy.getByTestId('home-page').should('be.visible')
    cy.openPage('menu-urun-duzenleme', 'product-management-page')
    searchProductManagementBySku(this.product.urunId)

    productRow(this.product.urunId).within(() => {
      cy.contains(this.product.ad).should('be.visible')
      cy.getByTestId('product-management-sku').should('have.text', this.product.urunId)
      cy.getByTestId('product-management-warehouse-stock').should('have.text', String(this.product.urunAdedi))
      cy.getByTestId('product-management-store-stock').should('have.text', String(this.product.magazaStok))

      // Currency formatting is locale-dependent, so assert the meaningful numeric parts.
      cy.getByTestId('product-management-purchase-price').should('contain', '276')
      cy.getByTestId('product-management-sale-price').should('contain', '411')
    })
  })

  it('prevents submitting an incomplete product form', () => {
    cy.openPage('menu-envanter', 'inventory-page')
    cy.getByTestId('inventory-add-product').click()

    cy.getByTestId('product-create-modal').should('be.visible')
    cy.getByTestId('product-name-input').clear()
    cy.getByTestId('product-sku-input').clear()
    cy.getByTestId('product-save-button').click()

    // The modal remains open when client-side validation rejects the form.
    cy.getByTestId('product-create-modal').should('be.visible')
  })

  it('deletes a product and removes it from the inventory list', function () {
    cy.apiCreateProduct(this.product)
    cy.reload()
    cy.getByTestId('home-page').should('be.visible')
    cy.openPage('menu-envanter', 'inventory-page')
    searchInventoryBySku(this.product.urunId)

    productRow(this.product.urunId).within(() => {
      cy.getByTestId('inventory-delete-product').click()
    })

    cy.getByTestId('product-delete-modal').should('be.visible').and('contain', this.product.ad)
    cy.getByTestId('product-delete-confirm').click()

    cy.getByTestId('product-delete-modal').should('not.exist')
    cy.getByTestId('inventory-search').clear().type(this.product.urunId)
    productRow(this.product.urunId).should('not.exist')
  })
})
