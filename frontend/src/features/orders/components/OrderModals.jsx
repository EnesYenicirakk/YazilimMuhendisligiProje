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
    siparisTelefonunuGetir,
  } = ordersData

  return (
    <>
      {yeniSiparisAcik && (
        <div className="modal-kaplama"><div className="modal-kutu"><h3>Yeni SipariÅŸ OluÅŸtur</h3><div className="modal-form">
          <label>MÃ¼ÅŸteri</label><input value={siparisFormu.musteri} onChange={(event) => siparisFormuGuncelle('musteri', event.target.value)} />
          <label>ÃœrÃ¼n</label><input value={siparisFormu.urun} onChange={(event) => siparisFormuGuncelle('urun', event.target.value)} />
          <label>Toplam Tutar</label><input type="number" value={siparisFormu.toplamTutar} onChange={(event) => siparisFormuGuncelle('toplamTutar', event.target.value)} />
          <label>SipariÅŸ Tarihi</label><input type="date" value={siparisFormu.siparisTarihi} onChange={(event) => siparisFormuGuncelle('siparisTarihi', event.target.value)} />
          <label>Ã–deme Durumu</label><select value={siparisFormu.odemeDurumu} onChange={(event) => siparisFormuGuncelle('odemeDurumu', event.target.value)}><option>Beklemede</option><option>Ödendi</option></select>
          <label>ÃœrÃ¼n HazÄ±rlÄ±k</label><select value={siparisFormu.urunHazirlik} onChange={(event) => siparisFormuGuncelle('urunHazirlik', event.target.value)}><option>Hazırlanıyor</option><option>Tedarik Bekleniyor</option><option>Hazır</option></select>
          <label>Teslimat Durumu</label><select value={siparisFormu.teslimatDurumu} onChange={(event) => siparisFormuGuncelle('teslimatDurumu', event.target.value)}><option>Hazırlanıyor</option><option>Kargoda</option><option>Yolda</option><option>Teslim Edildi</option></select>
          <label>Teslimat SÃ¼resi</label><input value={siparisFormu.teslimatSuresi} onChange={(event) => siparisFormuGuncelle('teslimatSuresi', event.target.value)} />
        </div><div className="modal-aksiyon"><button type="button" className="ikinci" onClick={() => setYeniSiparisAcik(false)}>Ä°ptal</button><button type="button" onClick={yeniSiparisKaydet}>SipariÅŸi OluÅŸtur</button></div></div></div>
      )}

      {detaySiparis && (
        <div className="modal-kaplama"><div className="modal-kutu"><h3>SipariÅŸ DetayÄ±</h3><div className="modal-form siparis-detay-icerik">
          <div className="mobil-bilgi-satiri"><span>SipariÅŸ No</span><strong>{detaySiparis.siparisNo}</strong></div>
          <div className="mobil-bilgi-satiri"><span>MÃ¼ÅŸteri</span><strong>{detaySiparis.musteri}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisTelefonunuGetir(detaySiparis)}</strong></div>
          <div className="mobil-bilgi-satiri"><span>ÃœrÃ¼n</span><strong>{detaySiparis.urun}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detaySiparis.toplamTutar)}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detaySiparis.siparisTarihi)}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Ã–deme</span><strong>{detaySiparis.odemeDurumu}</strong></div>
          <div className="mobil-bilgi-satiri"><span>HazÄ±rlÄ±k</span><strong>{detaySiparis.urunHazirlik}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Teslimat</span><strong>{detaySiparis.teslimatDurumu}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Tahmini SÃ¼re</span><strong>{detaySiparis.teslimatSuresi}</strong></div>
        </div><div className="modal-aksiyon"><button type="button" onClick={() => setDetaySiparis(null)}>Kapat</button></div></div></div>
      )}

      {detayGecmisSiparis && (
        <div className="modal-kaplama"><div className="modal-kutu"><h3>GeÃ§miÅŸ SipariÅŸ DetayÄ±</h3><div className="modal-form siparis-detay-icerik">
          <div className="mobil-bilgi-satiri"><span>Log No</span><strong>{detayGecmisSiparis.logNo}</strong></div>
          <div className="mobil-bilgi-satiri"><span>SipariÅŸ No</span><strong>{detayGecmisSiparis.siparisNo}</strong></div>
          <div className="mobil-bilgi-satiri"><span>MÃ¼ÅŸteri</span><strong>{detayGecmisSiparis.musteri}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisTelefonunuGetir(detayGecmisSiparis)}</strong></div>
          <div className="mobil-bilgi-satiri"><span>ÃœrÃ¼n</span><strong>{detayGecmisSiparis.urun}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detayGecmisSiparis.tarih)}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Miktar</span><strong>{detayGecmisSiparis.miktar}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detayGecmisSiparis.tutar)}</strong></div>
          <div className="mobil-bilgi-satiri"><span>Durum</span><strong>{detayGecmisSiparis.durum}</strong></div>
          <div className="mobil-bilgi-satiri tam"><span>AÃ§Ä±klama</span><strong>{detayGecmisSiparis.aciklama}</strong></div>
        </div><div className="modal-aksiyon"><button type="button" onClick={() => setDetayGecmisSiparis(null)}>Kapat</button></div></div></div>
      )}

      {duzenlenenSiparisNo && (
        <div className="modal-kaplama"><div className="modal-kutu"><h3>SipariÅŸi DÃ¼zenle</h3><div className="modal-form">
          <label>MÃ¼ÅŸteri</label><input value={siparisFormu.musteri} onChange={(event) => siparisFormuGuncelle('musteri', event.target.value)} />
          <label>ÃœrÃ¼n</label><input value={siparisFormu.urun} onChange={(event) => siparisFormuGuncelle('urun', event.target.value)} />
          <label>Toplam Tutar</label><input type="number" value={siparisFormu.toplamTutar} onChange={(event) => siparisFormuGuncelle('toplamTutar', event.target.value)} />
          <label>SipariÅŸ Tarihi</label><input type="date" value={siparisFormu.siparisTarihi} onChange={(event) => siparisFormuGuncelle('siparisTarihi', event.target.value)} />
          <label>Ã–deme Durumu</label><select value={siparisFormu.odemeDurumu} onChange={(event) => siparisFormuGuncelle('odemeDurumu', event.target.value)}><option>Beklemede</option><option>Ödendi</option></select>
          <label>ÃœrÃ¼n HazÄ±rlÄ±k</label><select value={siparisFormu.urunHazirlik} onChange={(event) => siparisFormuGuncelle('urunHazirlik', event.target.value)}><option>Hazırlanıyor</option><option>Tedarik Bekleniyor</option><option>Hazır</option></select>
          <label>Teslimat Durumu</label><select value={siparisFormu.teslimatDurumu} onChange={(event) => siparisFormuGuncelle('teslimatDurumu', event.target.value)}><option>Hazırlanıyor</option><option>Kargoda</option><option>Yolda</option><option>Teslim Edildi</option></select>
          <label>Teslimat SÃ¼resi</label><input value={siparisFormu.teslimatSuresi} onChange={(event) => siparisFormuGuncelle('teslimatSuresi', event.target.value)} />
        </div><div className="modal-aksiyon"><button type="button" className="ikinci" onClick={() => setDuzenlenenSiparisNo(null)}>Ä°ptal</button><button type="button" onClick={siparisDuzenlemeKaydet}>Kaydet</button></div></div></div>
      )}

      {durumGuncellenenSiparisNo && (
        <div className="modal-kaplama"><div className="modal-kutu"><h3>SipariÅŸ Durumu GÃ¼ncelle</h3><div className="modal-form">
          <label>Ã–deme Durumu</label><select value={siparisDurumFormu.odemeDurumu} onChange={(event) => siparisDurumFormuGuncelle('odemeDurumu', event.target.value)}><option>Beklemede</option><option>Ödendi</option></select>
          <label>ÃœrÃ¼n HazÄ±rlÄ±k</label><select value={siparisDurumFormu.urunHazirlik} onChange={(event) => siparisDurumFormuGuncelle('urunHazirlik', event.target.value)}><option>Hazırlanıyor</option><option>Tedarik Bekleniyor</option><option>Hazır</option></select>
          <label>Teslimat Durumu</label><select value={siparisDurumFormu.teslimatDurumu} onChange={(event) => siparisDurumFormuGuncelle('teslimatDurumu', event.target.value)}><option>Hazırlanıyor</option><option>Kargoda</option><option>Yolda</option><option>Teslim Edildi</option></select>
          <label>Teslimat SÃ¼resi</label><input value={siparisDurumFormu.teslimatSuresi} onChange={(event) => siparisDurumFormuGuncelle('teslimatSuresi', event.target.value)} />
        </div><div className="modal-aksiyon"><button type="button" className="ikinci" onClick={() => setDurumGuncellenenSiparisNo(null)}>Ä°ptal</button><button type="button" onClick={siparisDurumKaydet}>Kaydet</button></div></div></div>
      )}

      {silinecekSiparis && (
        <div className="modal-kaplama"><div className="modal-kutu kucuk"><h3>Silmek istediÄŸinizden emin misiniz</h3><p><strong>{silinecekSiparis.siparisNo}</strong> sipariÅŸi kaldÄ±rÄ±lacak.</p><div className="modal-aksiyon"><button type="button" className="ikinci" onClick={() => setSilinecekSiparis(null)}>HayÄ±r</button><button type="button" className="tehlike" onClick={siparisSil}>Evet</button></div></div></div>
      )}
    </>
  )
}

