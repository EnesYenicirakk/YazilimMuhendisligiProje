export default function CustomerModals({ customersData }) {
  const ZorunluYildiz = () => <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>

  const {
    musteriEklemeAcik,
    musteriDuzenlemeAcik,
    musteriNotAcik,
    silinecekMusteri,
    musteriFormu,
    musteriFormuGuncelle,
    musteriKaydet,
    musteriNotMetni,
    setMusteriNotMetni,
    musteriNotKaydet,
    musteriEklemeKapat,
    musteriDuzenlemeKapat,
    musteriNotKapat,
    musteriSilmeKapat,
    musteriSil,
  } = customersData

  return (
    <>
      {musteriEklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu modal-kutu-form-buyuk" data-cy="customer-create-modal">
            <div className="modal-baslik">
              <h3>Müşteri Ekle</h3>
              <button type="button" className="modal-kapat" onClick={musteriEklemeKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form modal-form-iki-kolonlu">
              <label className="modal-form-grup">
                <span>Müşteri Adı<ZorunluYildiz /></span>
                <input data-cy="customer-name-input" value={musteriFormu.ad} onChange={(event) => musteriFormuGuncelle('ad', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Yetkili Kişi<ZorunluYildiz /></span>
                <input value={musteriFormu.yetkiliKisi} onChange={(event) => musteriFormuGuncelle('yetkiliKisi', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Telefon<ZorunluYildiz /></span>
                <input data-cy="customer-phone-input" value={musteriFormu.telefon} onChange={(event) => musteriFormuGuncelle('telefon', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>E-posta<ZorunluYildiz /></span>
                <input type="email" value={musteriFormu.email} onChange={(event) => musteriFormuGuncelle('email', event.target.value)} />
              </label>
              <label className="modal-form-grup modal-form-grup-tam">
                <span>Adres<ZorunluYildiz /></span>
                <textarea value={musteriFormu.adres} onChange={(event) => musteriFormuGuncelle('adres', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Vergi Numarası<ZorunluYildiz /></span>
                <input value={musteriFormu.vergiNumarasi} onChange={(event) => musteriFormuGuncelle('vergiNumarasi', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Son Satın Alım</span>
                <input data-cy="customer-date-input" type="date" value={musteriFormu.sonAlim} onChange={(event) => musteriFormuGuncelle('sonAlim', event.target.value)} />
              </label>
              <label className="modal-form-grup modal-form-grup-tam">
                <span>Not</span>
                <textarea data-cy="customer-note-input" value={musteriFormu.not} onChange={(event) => musteriFormuGuncelle('not', event.target.value)} />
              </label>
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" data-cy="customer-create-cancel" onClick={musteriEklemeKapat}>İptal</button>
              <button type="button" data-cy="customer-create-submit" onClick={() => musteriKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {musteriDuzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu modal-kutu-form-buyuk">
            <div className="modal-baslik">
              <h3>Müşteriyi Düzenle</h3>
              <button type="button" className="modal-kapat" onClick={musteriDuzenlemeKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form modal-form-iki-kolonlu">
              <label className="modal-form-grup">
                <span>Müşteri Adı<ZorunluYildiz /></span>
                <input value={musteriFormu.ad} onChange={(event) => musteriFormuGuncelle('ad', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Yetkili Kişi<ZorunluYildiz /></span>
                <input value={musteriFormu.yetkiliKisi} onChange={(event) => musteriFormuGuncelle('yetkiliKisi', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Telefon<ZorunluYildiz /></span>
                <input value={musteriFormu.telefon} onChange={(event) => musteriFormuGuncelle('telefon', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>E-posta<ZorunluYildiz /></span>
                <input type="email" value={musteriFormu.email} onChange={(event) => musteriFormuGuncelle('email', event.target.value)} />
              </label>
              <label className="modal-form-grup modal-form-grup-tam">
                <span>Adres<ZorunluYildiz /></span>
                <textarea value={musteriFormu.adres} onChange={(event) => musteriFormuGuncelle('adres', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Vergi Numarası<ZorunluYildiz /></span>
                <input value={musteriFormu.vergiNumarasi} onChange={(event) => musteriFormuGuncelle('vergiNumarasi', event.target.value)} />
              </label>
              <label className="modal-form-grup">
                <span>Son Satın Alım</span>
                <input type="date" value={musteriFormu.sonAlim} onChange={(event) => musteriFormuGuncelle('sonAlim', event.target.value)} />
              </label>
              <label className="modal-form-grup modal-form-grup-tam">
                <span>Not</span>
                <textarea value={musteriFormu.not} onChange={(event) => musteriFormuGuncelle('not', event.target.value)} />
              </label>
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={musteriDuzenlemeKapat}>İptal</button>
              <button type="button" onClick={() => musteriKaydet('duzenle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {musteriNotAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <div className="modal-baslik">
              <h3>Müşteri Notu</h3>
              <button type="button" className="modal-kapat" onClick={musteriNotKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Not</label>
              <textarea value={musteriNotMetni} onChange={(event) => setMusteriNotMetni(event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={musteriNotKapat}>İptal</button>
              <button type="button" onClick={musteriNotKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekMusteri && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk" data-cy="customer-delete-modal">
            <div className="modal-baslik">
              <h3>Silmek istediğinizden emin misiniz</h3>
              <button type="button" className="modal-kapat" onClick={musteriSilmeKapat} aria-label="Kapat">×</button>
            </div>
            <p><strong>{silinecekMusteri.ad}</strong> müşteri listesinden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" data-cy="customer-delete-cancel" onClick={musteriSilmeKapat}>Hayır</button>
              <button type="button" className="tehlike" data-cy="customer-delete-confirm" onClick={musteriSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

