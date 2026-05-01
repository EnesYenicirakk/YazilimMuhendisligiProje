export default function InventoryModals({ inventoryData }) {
  const {
    eklemeAcik,
    duzenlemeAcik,
    silinecekUrun,
    urunDuzenlemeModalAcik,
    silinecekDuzenlemeUrunu,
    form,
    urunDuzenlemeFormu,
    formGuncelle,
    eklemePenceresiniKapat,
    duzenlemePenceresiniKapat,
    formKaydet,
    urunSil,
    urunDuzenlemeModaliniKapat,
    urunDuzenlemeFormuGuncelle,
    urunDuzenlemeKaydet,
    urunDuzenlemeSil,
    setSilinecekUrun,
    setSilinecekDuzenlemeUrunu,
  } = inventoryData

  return (
    <>
      {eklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu" data-testid="product-create-modal">
            <div className="modal-baslik">
              <h3>Ürün Ekle</h3>
              <button type="button" className="modal-kapat" onClick={eklemePenceresiniKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Ürün İsmi</label>
              <input data-testid="product-name-input" value={form.ad} onChange={(event) => formGuncelle('ad', event.target.value)} />
              <label>Ürün ID</label>
              <input data-testid="product-sku-input" value={form.urunId} onChange={(event) => formGuncelle('urunId', event.target.value)} />
              <label>Ürün Adedi</label>
              <input data-testid="product-warehouse-stock-input" type="number" min="0" step="1" value={form.urunAdedi} onChange={(event) => formGuncelle('urunAdedi', event.target.value)} />
              <label>AlÄ±ÅŸ FiyatÄ±</label>
              <input data-testid="product-purchase-price-input" type="number" min="0" step="0.01" value={form.alisFiyati} onChange={(event) => formGuncelle('alisFiyati', event.target.value)} />
              <label>SatÄ±ÅŸ FiyatÄ±</label>
              <input data-testid="product-sale-price-input" type="number" min="0" step="0.01" value={form.satisFiyati} onChange={(event) => formGuncelle('satisFiyati', event.target.value)} />
              <label>Minimum Stok</label>
              <input data-testid="product-min-stock-input" type="number" min="0" step="1" value={form.minimumStok} onChange={(event) => formGuncelle('minimumStok', event.target.value)} />
              <label>Mağazadaki Ürün Sayısı</label>
              <input data-testid="product-store-stock-input" type="number" min="0" step="1" value={form.magazaStok} onChange={(event) => formGuncelle('magazaStok', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={eklemePenceresiniKapat}>İptal</button>
              <button type="button" data-testid="product-save-button" onClick={() => formKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {duzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu" data-testid="product-edit-modal">
            <div className="modal-baslik">
              <h3>Ürünü Düzenle</h3>
              <button type="button" className="modal-kapat" onClick={duzenlemePenceresiniKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Ürün İsmi</label>
              <input data-testid="product-name-input" value={form.ad} onChange={(event) => formGuncelle('ad', event.target.value)} />
              <label>Ürün ID</label>
              <input data-testid="product-sku-input" value={form.urunId} onChange={(event) => formGuncelle('urunId', event.target.value)} />
              <label>Ürün Adedi</label>
              <input data-testid="product-warehouse-stock-input" type="number" min="0" step="1" value={form.urunAdedi} onChange={(event) => formGuncelle('urunAdedi', event.target.value)} />
              <label>AlÄ±ÅŸ FiyatÄ±</label>
              <input data-testid="product-purchase-price-input" type="number" min="0" step="0.01" value={form.alisFiyati} onChange={(event) => formGuncelle('alisFiyati', event.target.value)} />
              <label>SatÄ±ÅŸ FiyatÄ±</label>
              <input data-testid="product-sale-price-input" type="number" min="0" step="0.01" value={form.satisFiyati} onChange={(event) => formGuncelle('satisFiyati', event.target.value)} />
              <label>Minimum Stok</label>
              <input data-testid="product-min-stock-input" type="number" min="0" step="1" value={form.minimumStok} onChange={(event) => formGuncelle('minimumStok', event.target.value)} />
              <label>Mağazadaki Ürün Sayısı</label>
              <input data-testid="product-store-stock-input" type="number" min="0" step="1" value={form.magazaStok} onChange={(event) => formGuncelle('magazaStok', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={duzenlemePenceresiniKapat}>İptal</button>
              <button type="button" data-testid="product-save-button" onClick={() => formKaydet('duzenle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {urunDuzenlemeModalAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu" data-testid="product-price-edit-modal">
            <div className="modal-baslik">
              <h3>Ürünü Düzenle</h3>
              <button type="button" className="modal-kapat" onClick={urunDuzenlemeModaliniKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Ürün İsmi</label>
              <input data-testid="product-name-input" value={urunDuzenlemeFormu.ad} onChange={(event) => urunDuzenlemeFormuGuncelle('ad', event.target.value)} />
              <label>Ürün ID</label>
              <input data-testid="product-sku-input" value={urunDuzenlemeFormu.urunId} onChange={(event) => urunDuzenlemeFormuGuncelle('urunId', event.target.value)} />
              <label>Ürün Adedi</label>
              <input data-testid="product-warehouse-stock-input" type="number" min="0" step="1" value={urunDuzenlemeFormu.urunAdedi} onChange={(event) => urunDuzenlemeFormuGuncelle('urunAdedi', event.target.value)} />
              <label>Alış Fiyatı</label>
              <input data-testid="product-purchase-price-input" type="number" min="0" step="0.01" value={urunDuzenlemeFormu.alisFiyati} onChange={(event) => urunDuzenlemeFormuGuncelle('alisFiyati', event.target.value)} />
              <label>Satış Fiyatı</label>
              <input data-testid="product-sale-price-input" type="number" min="0" step="0.01" value={urunDuzenlemeFormu.satisFiyati} onChange={(event) => urunDuzenlemeFormuGuncelle('satisFiyati', event.target.value)} />
              <label>Mağazadaki Ürün Sayısı</label>
              <input data-testid="product-store-stock-input" type="number" min="0" step="1" value={urunDuzenlemeFormu.magazaStok} onChange={(event) => urunDuzenlemeFormuGuncelle('magazaStok', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={urunDuzenlemeModaliniKapat}>İptal</button>
              <button type="button" data-testid="product-save-button" onClick={urunDuzenlemeKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekUrun && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk" data-testid="product-delete-modal">
            <div className="modal-baslik">
              <h3>Silmek istediğinizden emin misiniz</h3>
              <button type="button" className="modal-kapat" onClick={() => setSilinecekUrun(null)} aria-label="Kapat">×</button>
            </div>
            <p><strong>{silinecekUrun.ad}</strong> envanterden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekUrun(null)}>Hayır</button>
              <button type="button" className="tehlike" data-testid="product-delete-confirm" onClick={urunSil}>Evet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekDuzenlemeUrunu && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk" data-testid="product-delete-modal">
            <div className="modal-baslik">
              <h3>Silmek istediğinizden emin misiniz</h3>
              <button type="button" className="modal-kapat" onClick={() => setSilinecekDuzenlemeUrunu(null)} aria-label="Kapat">×</button>
            </div>
            <p><strong>{silinecekDuzenlemeUrunu.ad}</strong> ürün düzenleme listesinden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekDuzenlemeUrunu(null)}>Hayır</button>
              <button type="button" className="tehlike" data-testid="product-delete-confirm" onClick={urunDuzenlemeSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

