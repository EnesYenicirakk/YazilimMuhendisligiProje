describe('Order and Finance Integration Flow', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123');
  });

  it('Should process an order and reflect on inventory and finance', () => {
    const uniqueId = `ORD-PROD-${Date.now().toString().slice(-4)}`;
    
    // 1. Create a Product for testing
    cy.contains('Envanter').click({ force: true });
    cy.contains('button', 'Yeni Ürün').click({ force: true });
    cy.contains('label', 'Ürün İsmi').next('input').type('Sipariş Test Ürünü');
    cy.contains('label', 'Ürün ID').next('input').type(uniqueId);
    cy.contains('label', 'Ürün Adedi').next('input').clear().type('50');
    cy.contains('label', 'Minimum Stok').next('input').clear().type('10');
    cy.contains('label', 'Mağazadaki Ürün Sayısı').next('input').clear().type('50');
    cy.contains('button', 'Kaydet').click({ force: true });
    cy.wait(1000); // wait for API

    // 2. Go to Orders and create a paid order
    cy.contains('Siparişler').click({ force: true });
    cy.contains('button', 'Yeni Sipariş').click({ force: true });
    
    // Fill Order Modal
    // select customer (assuming at least one exists, we pick index 1)
    cy.contains('label', 'Musteri').next('select').select(1);
    
    // search and select product
    cy.get('input[placeholder="Urun adi yazin veya listeden secin"]').type(uniqueId);
    cy.wait(500);
    cy.get('.urun-secici-secenek').contains('Sipariş Test Ürünü').click();
    
    // quantity
    cy.contains('label', 'Siparis Verilen Urun Adedi').next('input').clear().type('10');
    // total amount
    cy.contains('label', 'Toplam Tutar').next('input').clear().type('500');
    // date (today)
    const today = new Date().toISOString().split('T')[0];
    cy.contains('label', 'Siparis Tarihi').next('input').type(today);
    // status
    cy.contains('label', 'Ödeme Durumu').next('select').select('Ödendi');
    
    // Save order
    cy.contains('button', 'Siparisi Olustur').click({ force: true });
    cy.wait(1000);
    
    // 3. Verify stock dropped in Inventory (50 -> 40)
    cy.contains('Envanter').click({ force: true });
    cy.get('input[placeholder="Ürün veya ID ara"]').clear().type(uniqueId);
    // "Depo Stok" is urunAdedi, "Mağaza Stok" is store_stock. The order controller drops store_stock.
    // Check if row contains 40 (store stock)
    cy.get('table').contains('tr', uniqueId).should('contain', '40');

    // 4. Verify finance reflection
    cy.contains('Finans / Ödemeler').click({ force: true });
    // Assuming 500 appears in "Gelen Nakit" list
    cy.get('.panel-kart').contains('500').should('exist');
    
    // 5. Cleanup: Delete Product (optional, order cleanup might be needed first due to foreign keys)
    cy.contains('Envanter').click({ force: true });
    cy.get('input[placeholder="Ürün veya ID ara"]').clear().type(uniqueId);
    cy.get('button[title="Sil"]').eq(0).click({ force: true });
    cy.contains('button', 'Evet').click({ force: true });
  });
});
