export default function FinanceModals({ financeData }) {
  const {
    duzenlenenOdeme,
    odemeFormu,
    odemeFormuGuncelle,
    odemeDuzenlemeKaydet,
    odemeDuzenlemeKapat,
    silinecekOdeme,
    odemeSil,
    odemeSilmeKapat,
  } = financeData

  return (
    <>
      {duzenlenenOdeme && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Finans Kaydını Düzenle</h3>
            <div className="modal-form">
              <label>Taraf</label>
              <input value={odemeFormu.taraf} onChange={(event) => odemeFormuGuncelle('taraf', event.target.value)} />
              <label>Tarih</label>
              <input type="date" value={odemeFormu.tarih} onChange={(event) => odemeFormuGuncelle('tarih', event.target.value)} />
              <label>Durum</label>
              <select value={odemeFormu.durum} onChange={(event) => odemeFormuGuncelle('durum', event.target.value)}>
                <option value="Ödendi">Ödendi</option>
                <option value="Beklemede">Beklemede</option>
                <option value="İptal">İptal</option>
                <option value="Kısmi">Kısmi</option>
              </select>
              <label>Tutar</label>
              <input type="number" value={odemeFormu.tutar} onChange={(event) => odemeFormuGuncelle('tutar', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={odemeDuzenlemeKapat}>İptal</button>
              <button type="button" onClick={odemeDuzenlemeKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekOdeme && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz</h3>
            <p><strong>{silinecekOdeme.taraf}</strong> kaydı kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={odemeSilmeKapat}>Hayır</button>
              <button type="button" className="tehlike" onClick={odemeSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

