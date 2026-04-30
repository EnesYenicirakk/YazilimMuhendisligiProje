export default function SupplierModals({
  suppliersData,
  paraFormatla,
  tarihFormatla,
}) {
  const {
    tedarikciEklemeAcik,
    tedarikciDuzenlemeAcik,
    tedarikciNotAcik,
    tedarikciDetayAcik,
    seciliTedarikci,
    tedarikciDetaySekmesi,
    setTedarikciDetaySekmesi,
    tedarikciFormu,
    tedarikciFormuGuncelle,
    tedarikciKaydet,
    tedarikciNotMetni,
    setTedarikciNotMetni,
    tedarikciNotKaydet,
    tedarikciSiparisEklemeAcik,
    tedarikciSiparisFormu,
    tedarikciSiparisFormuGuncelle,
    tedarikciSiparisKaydet,
    genelTedarikSiparisAcik,
    genelTedarikSiparisFormu,
    genelTedarikSiparisFormuGuncelle,
    genelTedarikSiparisKaydet,
    tedarikciler,
    silinecekTedarikci,
    tedarikciEklemeKapat,
    tedarikciDuzenlemeKapat,
    tedarikciNotKapat,
    tedarikciDetayKapat,
    tedarikciSiparisKapat,
    genelTedarikSiparisKapat,
    tedarikciSilmeKapat,
    tedarikciSiparisEklemeAc,
    tedarikciSil,
  } = suppliersData

  const siparisOzeti = (siparis) => (
    `${tarihFormatla(siparis.tarih)} • ${paraFormatla(siparis.tutar)} • ${siparis.durum}`
  )

  const alinanUrunlerMetni = seciliTedarikci?.alinanUrunler?.length
    ? seciliTedarikci.alinanUrunler
        .map((urun) => `${urun.urun} - ${paraFormatla(urun.sonFiyat)} - ${tarihFormatla(urun.sonAlisTarihi)}`)
        .join(' | ')
    : '-'

  const fiyatGecmisiMetni = seciliTedarikci?.fiyatGecmisi?.length
    ? seciliTedarikci.fiyatGecmisi
        .map((kayit) => `${tarihFormatla(kayit.tarih)} ${kayit.urun} ${paraFormatla(kayit.fiyat)}`)
        .join(' | ')
    : '-'

  const renderTedarikciFormAlanlari = () => (
    <>
      <label className="modal-form-grup">
        <span>Firma Adı</span>
        <input value={tedarikciFormu.firmaAdi} onChange={(event) => tedarikciFormuGuncelle('firmaAdi', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>Yetkili Kişi</span>
        <input value={tedarikciFormu.yetkiliKisi} onChange={(event) => tedarikciFormuGuncelle('yetkiliKisi', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>Telefon</span>
        <input value={tedarikciFormu.telefon} onChange={(event) => tedarikciFormuGuncelle('telefon', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>E-posta</span>
        <input value={tedarikciFormu.email} onChange={(event) => tedarikciFormuGuncelle('email', event.target.value)} />
      </label>
      <label className="modal-form-grup modal-form-grup-tam">
        <span>Adres</span>
        <textarea value={tedarikciFormu.adres} onChange={(event) => tedarikciFormuGuncelle('adres', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>Vergi Numarası</span>
        <input value={tedarikciFormu.vergiNumarasi} onChange={(event) => tedarikciFormuGuncelle('vergiNumarasi', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>Ürün Grubu</span>
        <input value={tedarikciFormu.urunGrubu} onChange={(event) => tedarikciFormuGuncelle('urunGrubu', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>Toplam Alış Sayısı</span>
        <input type="number" min="0" step="1" value={tedarikciFormu.toplamAlisSayisi} onChange={(event) => tedarikciFormuGuncelle('toplamAlisSayisi', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>Ortalama Teslim Süresi</span>
        <input value={tedarikciFormu.ortalamaTeslimSuresi} onChange={(event) => tedarikciFormuGuncelle('ortalamaTeslimSuresi', event.target.value)} />
      </label>
      <label className="modal-form-grup">
        <span>Toplam Harcama</span>
        <input type="number" min="0" step="0.01" value={tedarikciFormu.toplamHarcama} onChange={(event) => tedarikciFormuGuncelle('toplamHarcama', event.target.value)} />
      </label>
      <label className="modal-form-grup modal-form-grup-tam">
        <span>Not</span>
        <textarea value={tedarikciFormu.not} onChange={(event) => tedarikciFormuGuncelle('not', event.target.value)} />
      </label>
    </>
  )

  return (
    <>
      {tedarikciEklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu modal-kutu-form-buyuk">
            <div className="modal-baslik">
              <h3>Tedarikçi Ekle</h3>
              <button type="button" className="modal-kapat" onClick={tedarikciEklemeKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form modal-form-iki-kolonlu">
              {renderTedarikciFormAlanlari()}
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={tedarikciEklemeKapat}>İptal</button>
              <button type="button" onClick={() => tedarikciKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciDuzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu modal-kutu-form-buyuk">
            <div className="modal-baslik">
              <h3>Tedarikçiyi Düzenle</h3>
              <button type="button" className="modal-kapat" onClick={tedarikciDuzenlemeKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form modal-form-iki-kolonlu">
              {renderTedarikciFormAlanlari()}
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={tedarikciDuzenlemeKapat}>İptal</button>
              <button type="button" onClick={() => tedarikciKaydet('duzenle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciNotAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <div className="modal-baslik">
              <h3>Tedarikçi Notu</h3>
              <button type="button" className="modal-kapat" onClick={tedarikciNotKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Not</label>
              <textarea value={tedarikciNotMetni} onChange={(event) => setTedarikciNotMetni(event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={tedarikciNotKapat}>İptal</button>
              <button type="button" onClick={tedarikciNotKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciDetayAcik && seciliTedarikci && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <div className="modal-baslik">
              <h3>{seciliTedarikci.firmaAdi}</h3>
              <button type="button" className="modal-kapat" onClick={tedarikciDetayKapat} aria-label="Kapat">×</button>
            </div>
            <div className="odeme-sekme-alani">
              <button
                type="button"
                className={`odeme-sekme ${tedarikciDetaySekmesi === 'genel' ? 'aktif' : ''}`}
                onClick={() => setTedarikciDetaySekmesi('genel')}
              >
                Genel Bilgiler
              </button>
              <button
                type="button"
                className={`odeme-sekme ${tedarikciDetaySekmesi === 'siparisler' ? 'aktif' : ''}`}
                onClick={() => setTedarikciDetaySekmesi('siparisler')}
              >
                Siparişler
              </button>
            </div>

            {tedarikciDetaySekmesi === 'genel' && (
              <div className="modal-form siparis-detay-icerik" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="mobil-bilgi-satiri"><span>Firma</span><strong>{seciliTedarikci.firmaAdi}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Yetkili</span><strong>{seciliTedarikci.yetkiliKisi}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{seciliTedarikci.telefon}</strong></div>
                <div className="mobil-bilgi-satiri"><span>E-posta</span><strong>{seciliTedarikci.email}</strong></div>
                <div className="mobil-bilgi-satiri tam"><span>Adres</span><strong>{seciliTedarikci.adres}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Vergi No</span><strong>{seciliTedarikci.vergiNumarasi}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Toplam Alış</span><strong>{seciliTedarikci.toplamAlisSayisi}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Ortalama Teslim</span><strong>{seciliTedarikci.ortalamaTeslimSuresi}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Toplam Harcama</span><strong>{paraFormatla(seciliTedarikci.toplamHarcama)}</strong></div>
                <div className="mobil-bilgi-satiri tam"><span>Not</span><strong>{seciliTedarikci.not}</strong></div>
                <div className="mobil-bilgi-satiri tam"><span>Alınan Ürünler</span><strong>{alinanUrunlerMetni}</strong></div>
                <div className="mobil-bilgi-satiri tam"><span>Fiyat Geçmişi</span><strong>{fiyatGecmisiMetni}</strong></div>
              </div>
            )}

            {tedarikciDetaySekmesi === 'siparisler' && (
              <div className="modal-form siparis-detay-icerik" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {seciliTedarikci.siparisler.map((siparis) => (
                  <div key={`${seciliTedarikci.uid}-${siparis.siparisNo}`} className="mobil-bilgi-satiri tam">
                    <span>{siparis.siparisNo}</span>
                    <strong>{siparisOzeti(siparis)}</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-aksiyon">
              <button type="button" onClick={tedarikciSiparisEklemeAc}>Yeni Sipariş</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciSiparisEklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <div className="modal-baslik">
              <h3>Tedarikçi Siparişi Oluştur</h3>
              <button type="button" className="modal-kapat" onClick={tedarikciSiparisKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Sipariş No</label>
              <input value={tedarikciSiparisFormu.siparisNo} onChange={(event) => tedarikciSiparisFormuGuncelle('siparisNo', event.target.value)} />
              <label>Tarih</label>
              <input type="date" value={tedarikciSiparisFormu.tarih} onChange={(event) => tedarikciSiparisFormuGuncelle('tarih', event.target.value)} />
              <label>Tutar</label>
              <input type="number" min="0" step="0.01" value={tedarikciSiparisFormu.tutar} onChange={(event) => tedarikciSiparisFormuGuncelle('tutar', event.target.value)} />
              <label>Durum</label>
              <select value={tedarikciSiparisFormu.durum} onChange={(event) => tedarikciSiparisFormuGuncelle('durum', event.target.value)}>
                <option>Bekliyor</option>
                <option>Hazırlanıyor</option>
                <option>Teslim alındı</option>
              </select>
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={tedarikciSiparisKapat}>İptal</button>
              <button type="button" onClick={tedarikciSiparisKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {genelTedarikSiparisAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <div className="modal-baslik">
              <h3>Yeni Tedarik Siparişi</h3>
              <button type="button" className="modal-kapat" onClick={genelTedarikSiparisKapat} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Tedarikçi</label>
              <select value={genelTedarikSiparisFormu.tedarikciUid} onChange={(event) => genelTedarikSiparisFormuGuncelle('tedarikciUid', event.target.value)}>
                <option value="">Tedarikçi seçin</option>
                {tedarikciler.map((tedarikci) => (
                  <option key={`genel-tedarikci-${tedarikci.uid}`} value={tedarikci.uid}>{tedarikci.firmaAdi}</option>
                ))}
              </select>
              <label>Sipariş No</label>
              <input value={genelTedarikSiparisFormu.siparisNo} onChange={(event) => genelTedarikSiparisFormuGuncelle('siparisNo', event.target.value)} />
              <label>Tarih</label>
              <input type="date" value={genelTedarikSiparisFormu.tarih} onChange={(event) => genelTedarikSiparisFormuGuncelle('tarih', event.target.value)} />
              <label>Tutar</label>
              <input type="number" min="0" step="0.01" value={genelTedarikSiparisFormu.tutar} onChange={(event) => genelTedarikSiparisFormuGuncelle('tutar', event.target.value)} />
              <label>Durum</label>
              <select value={genelTedarikSiparisFormu.durum} onChange={(event) => genelTedarikSiparisFormuGuncelle('durum', event.target.value)}>
                <option>Bekliyor</option>
                <option>Hazırlanıyor</option>
                <option>Teslim alındı</option>
              </select>
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={genelTedarikSiparisKapat}>İptal</button>
              <button type="button" onClick={genelTedarikSiparisKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekTedarikci && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <div className="modal-baslik">
              <h3>Silmek istediğinizden emin misiniz?</h3>
              <button type="button" className="modal-kapat" onClick={tedarikciSilmeKapat} aria-label="Kapat">×</button>
            </div>
            <p><strong>{silinecekTedarikci.firmaAdi}</strong> tedarikçi listesinden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={tedarikciSilmeKapat}>Hayır</button>
              <button type="button" className="tehlike" onClick={tedarikciSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
