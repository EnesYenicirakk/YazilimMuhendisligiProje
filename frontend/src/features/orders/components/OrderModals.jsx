export default function OrderModals({ ordersData, paraFormatla, tarihFormatla }) {
  const {
    yeniSiparisAcik,
    setYeniSiparisAcik,
    siparisFormu,
    siparisFormuGuncelle,
    yeniSiparisKaydet,
    detaySiparis,
    setDetaySiparis,
    detayGecmisSiparis,
    setDetayGecmisSiparis,
    duzenlenenSiparisNo,
    setDuzenlenenSiparisNo,
    siparisDuzenlemeKaydet,
    durumGuncellenenSiparisNo,
    setDurumGuncellenenSiparisNo,
    siparisDurumFormu,
    siparisDurumFormuGuncelle,
    siparisDurumKaydet,
    silinecekSiparis,
    setSilinecekSiparis,
    siparisSil,
    musteriSecenekleri,
    siparisMusteriAdiniGetir,
    siparisTelefonunuGetir,
  } = ordersData

  return (
    <>
      {yeniSiparisAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Yeni Sipariş Oluştur</h3>
            <div className="modal-form">
              <label>Müşteri</label>
              <select value={siparisFormu.musteriUid} onChange={(event) => siparisFormuGuncelle('musteriUid', event.target.value)}>
                <option value="">Müşteri seçin</option>
                {musteriSecenekleri.map((musteri) => (
                  <option key={musteri.uid} value={musteri.uid}>
                    {musteri.ad}
                  </option>
                ))}
              </select>
              <label>Ürün</label>
              <input value={siparisFormu.urun} onChange={(event) => siparisFormuGuncelle('urun', event.target.value)} />
              <label>Toplam Tutar</label>
              <input type="number" value={siparisFormu.toplamTutar} onChange={(event) => siparisFormuGuncelle('toplamTutar', event.target.value)} />
              <label>Sipariş Tarihi</label>
              <input type="date" value={siparisFormu.siparisTarihi} onChange={(event) => siparisFormuGuncelle('siparisTarihi', event.target.value)} />
              <label>Ödeme Durumu</label>
              <select value={siparisFormu.odemeDurumu} onChange={(event) => siparisFormuGuncelle('odemeDurumu', event.target.value)}>
                <option>Beklemede</option>
                <option>Ödendi</option>
              </select>
              <label>Ürün Hazırlık</label>
              <select value={siparisFormu.urunHazirlik} onChange={(event) => siparisFormuGuncelle('urunHazirlik', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Tedarik Bekleniyor</option>
                <option>Hazır</option>
              </select>
              <label>Teslimat Durumu</label>
              <select value={siparisFormu.teslimatDurumu} onChange={(event) => siparisFormuGuncelle('teslimatDurumu', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Yolda</option>
                <option>Teslim Edildi</option>
              </select>
              <label>Teslimat Süresi</label>
              <input value={siparisFormu.teslimatSuresi} onChange={(event) => siparisFormuGuncelle('teslimatSuresi', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setYeniSiparisAcik(false)}>İptal</button>
              <button type="button" onClick={yeniSiparisKaydet}>Siparişi Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {detaySiparis && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Sipariş Detayı</h3>
            <div className="modal-form siparis-detay-icerik">
              <div className="mobil-bilgi-satiri"><span>Sipariş No</span><strong>{detaySiparis.siparisNo}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Müşteri</span><strong>{siparisMusteriAdiniGetir(detaySiparis)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisTelefonunuGetir(detaySiparis)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Ürün</span><strong>{detaySiparis.urun}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detaySiparis.toplamTutar)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detaySiparis.siparisTarihi)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Ödeme</span><strong>{detaySiparis.odemeDurumu}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Hazırlık</span><strong>{detaySiparis.urunHazirlik}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Teslimat</span><strong>{detaySiparis.teslimatDurumu}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tahmini Süre</span><strong>{detaySiparis.teslimatSuresi}</strong></div>
            </div>
            <div className="modal-aksiyon">
              <button type="button" onClick={() => setDetaySiparis(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {detayGecmisSiparis && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Geçmiş Sipariş Detayı</h3>
            <div className="modal-form siparis-detay-icerik">
              <div className="mobil-bilgi-satiri"><span>Log No</span><strong>{detayGecmisSiparis.logNo}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Sipariş No</span><strong>{detayGecmisSiparis.siparisNo}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Müşteri</span><strong>{detayGecmisSiparis.musteri}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisTelefonunuGetir(detayGecmisSiparis)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Ürün</span><strong>{detayGecmisSiparis.urun}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detayGecmisSiparis.tarih)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Miktar</span><strong>{detayGecmisSiparis.miktar}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detayGecmisSiparis.tutar)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Durum</span><strong>{detayGecmisSiparis.durum}</strong></div>
              <div className="mobil-bilgi-satiri tam"><span>Açıklama</span><strong>{detayGecmisSiparis.aciklama}</strong></div>
            </div>
            <div className="modal-aksiyon">
              <button type="button" onClick={() => setDetayGecmisSiparis(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {duzenlenenSiparisNo && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Siparişi Düzenle</h3>
            <div className="modal-form">
              <label>Müşteri</label>
              <select value={siparisFormu.musteriUid} onChange={(event) => siparisFormuGuncelle('musteriUid', event.target.value)}>
                <option value="">Müşteri seçin</option>
                {musteriSecenekleri.map((musteri) => (
                  <option key={musteri.uid} value={musteri.uid}>
                    {musteri.ad}
                  </option>
                ))}
              </select>
              <label>Ürün</label>
              <input value={siparisFormu.urun} onChange={(event) => siparisFormuGuncelle('urun', event.target.value)} />
              <label>Toplam Tutar</label>
              <input type="number" value={siparisFormu.toplamTutar} onChange={(event) => siparisFormuGuncelle('toplamTutar', event.target.value)} />
              <label>Sipariş Tarihi</label>
              <input type="date" value={siparisFormu.siparisTarihi} onChange={(event) => siparisFormuGuncelle('siparisTarihi', event.target.value)} />
              <label>Ödeme Durumu</label>
              <select value={siparisFormu.odemeDurumu} onChange={(event) => siparisFormuGuncelle('odemeDurumu', event.target.value)}>
                <option>Beklemede</option>
                <option>Ödendi</option>
              </select>
              <label>Ürün Hazırlık</label>
              <select value={siparisFormu.urunHazirlik} onChange={(event) => siparisFormuGuncelle('urunHazirlik', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Tedarik Bekleniyor</option>
                <option>Hazır</option>
              </select>
              <label>Teslimat Durumu</label>
              <select value={siparisFormu.teslimatDurumu} onChange={(event) => siparisFormuGuncelle('teslimatDurumu', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Yolda</option>
                <option>Teslim Edildi</option>
              </select>
              <label>Teslimat Süresi</label>
              <input value={siparisFormu.teslimatSuresi} onChange={(event) => siparisFormuGuncelle('teslimatSuresi', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setDuzenlenenSiparisNo(null)}>İptal</button>
              <button type="button" onClick={siparisDuzenlemeKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {durumGuncellenenSiparisNo && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Sipariş Durumu Güncelle</h3>
            <div className="modal-form">
              <label>Ödeme Durumu</label>
              <select value={siparisDurumFormu.odemeDurumu} onChange={(event) => siparisDurumFormuGuncelle('odemeDurumu', event.target.value)}>
                <option>Beklemede</option>
                <option>Ödendi</option>
              </select>
              <label>Ürün Hazırlık</label>
              <select value={siparisDurumFormu.urunHazirlik} onChange={(event) => siparisDurumFormuGuncelle('urunHazirlik', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Tedarik Bekleniyor</option>
                <option>Hazır</option>
              </select>
              <label>Teslimat Durumu</label>
              <select value={siparisDurumFormu.teslimatDurumu} onChange={(event) => siparisDurumFormuGuncelle('teslimatDurumu', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Yolda</option>
                <option>Teslim Edildi</option>
              </select>
              <label>Teslimat Süresi</label>
              <input value={siparisDurumFormu.teslimatSuresi} onChange={(event) => siparisDurumFormuGuncelle('teslimatSuresi', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setDurumGuncellenenSiparisNo(null)}>İptal</button>
              <button type="button" onClick={siparisDurumKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekSiparis && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz?</h3>
            <p><strong>{silinecekSiparis.siparisNo}</strong> siparişi kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekSiparis(null)}>Hayır</button>
              <button type="button" className="tehlike" onClick={siparisSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
