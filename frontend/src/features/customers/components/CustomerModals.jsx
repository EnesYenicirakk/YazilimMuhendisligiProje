export default function CustomerModals({ customersData }) {
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
          <div className="modal-kutu">
            <h3>Müşteri Ekle</h3>
            <div className="modal-form">
              <label>Müşteri Adı</label>
              <input value={musteriFormu.ad} onChange={(event) => musteriFormuGuncelle('ad', event.target.value)} />
              <label>Telefon</label>
              <input value={musteriFormu.telefon} onChange={(event) => musteriFormuGuncelle('telefon', event.target.value)} />
              <label>Son Satın Alım</label>
              <input type="date" value={musteriFormu.sonAlim} onChange={(event) => musteriFormuGuncelle('sonAlim', event.target.value)} />
              <label>Sipariş Sayısı</label>
              <input type="number" value={musteriFormu.toplamSiparis} onChange={(event) => musteriFormuGuncelle('toplamSiparis', event.target.value)} />
              <label>Toplam Harcama</label>
              <input type="number" value={musteriFormu.toplamHarcama} onChange={(event) => musteriFormuGuncelle('toplamHarcama', event.target.value)} />
              <label>Not</label>
              <textarea value={musteriFormu.not} onChange={(event) => musteriFormuGuncelle('not', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={musteriEklemeKapat}>İptal</button>
              <button type="button" onClick={() => musteriKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {musteriDuzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Müşteriyi Düzenle</h3>
            <div className="modal-form">
              <label>Müşteri Adı</label>
              <input value={musteriFormu.ad} onChange={(event) => musteriFormuGuncelle('ad', event.target.value)} />
              <label>Telefon</label>
              <input value={musteriFormu.telefon} onChange={(event) => musteriFormuGuncelle('telefon', event.target.value)} />
              <label>Son Satın Alım</label>
              <input type="date" value={musteriFormu.sonAlim} onChange={(event) => musteriFormuGuncelle('sonAlim', event.target.value)} />
              <label>Sipariş Sayısı</label>
              <input type="number" value={musteriFormu.toplamSiparis} onChange={(event) => musteriFormuGuncelle('toplamSiparis', event.target.value)} />
              <label>Toplam Harcama</label>
              <input type="number" value={musteriFormu.toplamHarcama} onChange={(event) => musteriFormuGuncelle('toplamHarcama', event.target.value)} />
              <label>Not</label>
              <textarea value={musteriFormu.not} onChange={(event) => musteriFormuGuncelle('not', event.target.value)} />
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
            <h3>Müşteri Notu</h3>
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
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz</h3>
            <p><strong>{silinecekMusteri.ad}</strong> müşteri listesinden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={musteriSilmeKapat}>Hayır</button>
              <button type="button" className="tehlike" onClick={musteriSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
