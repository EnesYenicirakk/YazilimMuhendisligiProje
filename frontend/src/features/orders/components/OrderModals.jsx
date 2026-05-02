import { useEffect, useMemo, useRef, useState } from 'react'

function UrunSecici({ value, onChange, urunSecenekleri }) {
  const [acik, setAcik] = useState(false)
  const kapsayiciRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!kapsayiciRef.current?.contains(event.target)) {
        setAcik(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const filtreliUrunler = useMemo(() => {
    const arama = String(value ?? '').trim().toLocaleLowerCase('tr-TR')
    if (!arama) return urunSecenekleri.slice(0, 8)

    return urunSecenekleri
      .filter(
        (urun) =>
          urun.ad.toLocaleLowerCase('tr-TR').includes(arama) ||
          String(urun.urunId ?? '').toLocaleLowerCase('tr-TR').includes(arama),
      )
      .slice(0, 8)
  }, [urunSecenekleri, value])

  const urunSec = (urun) => {
    onChange(urun)
    setAcik(false)
  }

  return (
    <div className={`urun-secici ${acik ? 'acik' : ''}`} data-cy="order-product-picker" ref={kapsayiciRef}>
      <div className="urun-secici-alan">
        <input
          data-cy="order-product-input"
          value={value}
          onChange={(event) => {
            onChange({
              ad: event.target.value,
              uid: '',
            })
            setAcik(true)
          }}
          onFocus={() => setAcik(true)}
          placeholder="Urun adi yazin veya listeden secin"
          autoComplete="off"
        />
        <button
          type="button"
          className="urun-secici-dugme"
          aria-label="Urun listesini ac"
          onClick={() => setAcik((onceki) => !onceki)}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 5.25L7 9.25L11 5.25" />
          </svg>
        </button>
      </div>

      {acik && (
        <div className="urun-secici-liste" data-cy="order-product-options" role="listbox" aria-label="Urun secenekleri">
          {filtreliUrunler.length > 0 ? (
            filtreliUrunler.map((urun) => (
              <button
                key={urun.uid}
                type="button"
                data-cy="order-product-option"
                data-product-sku={urun.urunId}
                className={`urun-secici-secenek ${urun.ad === value ? 'secili' : ''}`}
                onClick={() => urunSec(urun)}
              >
                <strong>{urun.ad}</strong>
                <span>{urun.urunId} · {urun.kategori} · Stok: {urun.stok}</span>
              </button>
            ))
          ) : (
            <div className="urun-secici-bos">Eslesen urun bulunamadi.</div>
          )}
        </div>
      )}
    </div>
  )
}

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
    iptalEdilecekSiparis,
    setIptalEdilecekSiparis,
    iptalNotu,
    setIptalNotu,
    siparisIptalKaydet,
    durumGuncellenenSiparisNo,
    setDurumGuncellenenSiparisNo,
    siparisDurumFormu,
    siparisDurumFormuGuncelle,
    siparisDurumKaydet,
    silinecekSiparis,
    setSilinecekSiparis,
    siparisSil,
    musteriSecenekleri,
    urunSecenekleri,
    siparisMusteriAdiniGetir,
    siparisTelefonunuGetir,
  } = ordersData

  return (
    <>
      {yeniSiparisAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu" data-cy="order-create-modal">
            <div className="modal-baslik">
              <h3>Yeni Siparis Olustur</h3>
              <button type="button" className="modal-kapat" onClick={() => setYeniSiparisAcik(false)} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Musteri</label>
              <select data-cy="order-customer-select" value={siparisFormu.musteriUid} onChange={(event) => siparisFormuGuncelle('musteriUid', event.target.value)}>
                <option value="">Musteri secin</option>
                {musteriSecenekleri.map((musteri) => (
                  <option key={musteri.uid} value={musteri.uid}>
                    {musteri.ad}
                  </option>
                ))}
              </select>
              <label>Urun</label>
              <UrunSecici
                value={siparisFormu.urun}
                onChange={(urun) => {
                  siparisFormuGuncelle('urun', urun.ad)
                  siparisFormuGuncelle('urunUid', urun.uid)
                }}
                urunSecenekleri={urunSecenekleri}
              />
              <label>Siparis Verilen Urun Adedi</label>
              <input data-cy="order-quantity-input" type="number" min="1" step="1" value={siparisFormu.urunAdedi} onChange={(event) => siparisFormuGuncelle('urunAdedi', event.target.value)} />
              <label>Toplam Tutar</label>
              <input data-cy="order-total-input" type="number" min="0" step="0.01" value={siparisFormu.toplamTutar} readOnly style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }} />
              <label>Siparis Tarihi</label>
              <input data-cy="order-date-input" type="date" value={siparisFormu.siparisTarihi} onChange={(event) => siparisFormuGuncelle('siparisTarihi', event.target.value)} />
              <label>Ödeme Durumu</label>
              <select data-cy="order-payment-status-select" value={siparisFormu.odemeDurumu} onChange={(event) => siparisFormuGuncelle('odemeDurumu', event.target.value)}>
                <option>Beklemede</option>
                <option>Ödendi</option>
              </select>
              <label>Ürün Hazırlık</label>
              <select data-cy="order-prep-status-select" value={siparisFormu.urunHazirlik} onChange={(event) => siparisFormuGuncelle('urunHazirlik', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Tedarik Bekleniyor</option>
                <option>Hazır</option>
              </select>
              <label>Teslimat Durumu</label>
              <select data-cy="order-delivery-status-select" value={siparisFormu.teslimatDurumu} onChange={(event) => siparisFormuGuncelle('teslimatDurumu', event.target.value)}>
                <option>Hazırlanıyor</option>
                <option>Yolda</option>
                <option>Teslim Edildi</option>
              </select>
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" data-cy="order-create-cancel" onClick={() => setYeniSiparisAcik(false)}>İptal</button>
              <button type="button" data-cy="order-create-submit" onClick={yeniSiparisKaydet}>Siparisi Olustur</button>
            </div>
          </div>
        </div>
      )}

      {detaySiparis && (
        <div className="modal-kaplama">
          <div className="modal-kutu" data-cy="order-detail-modal">
            <div className="modal-baslik">
              <h3>Siparis Detayi</h3>
              <button type="button" className="modal-kapat" onClick={() => setDetaySiparis(null)} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form siparis-detay-icerik">
              <div className="mobil-bilgi-satiri"><span>Siparis No</span><strong>{detaySiparis.siparisNo}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Musteri</span><strong>{siparisMusteriAdiniGetir(detaySiparis)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisTelefonunuGetir(detaySiparis)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Urun</span><strong>{detaySiparis.urun}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Adet</span><strong>{detaySiparis.urunAdedi}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detaySiparis.toplamTutar)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detaySiparis.siparisTarihi)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Odeme</span><strong>{detaySiparis.odemeDurumu}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Hazirlik</span><strong>{detaySiparis.urunHazirlik}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Teslimat</span><strong>{detaySiparis.teslimatDurumu}</strong></div>
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
            <div className="modal-baslik">
              <h3>Gecmis Siparis Detayi</h3>
              <button type="button" className="modal-kapat" onClick={() => setDetayGecmisSiparis(null)} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form siparis-detay-icerik">
              <div className="mobil-bilgi-satiri"><span>Log No</span><strong>{detayGecmisSiparis.logNo}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Siparis No</span><strong>{detayGecmisSiparis.siparisNo}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Musteri</span><strong>{detayGecmisSiparis.musteri}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisTelefonunuGetir(detayGecmisSiparis)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Urun</span><strong>{detayGecmisSiparis.urun}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detayGecmisSiparis.tarih)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Miktar</span><strong>{detayGecmisSiparis.miktar}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detayGecmisSiparis.tutar)}</strong></div>
              <div className="mobil-bilgi-satiri"><span>Durum</span><strong>{detayGecmisSiparis.durum}</strong></div>
              <div className="mobil-bilgi-satiri tam"><span>Aciklama</span><strong>{detayGecmisSiparis.aciklama}</strong></div>
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
            <div className="modal-baslik">
              <h3>Siparisi Duzenle</h3>
              <button type="button" className="modal-kapat" onClick={() => setDuzenlenenSiparisNo(null)} aria-label="Kapat">×</button>
            </div>
            <div className="modal-form">
              <label>Musteri</label>
              <select value={siparisFormu.musteriUid} onChange={(event) => siparisFormuGuncelle('musteriUid', event.target.value)}>
                <option value="">Musteri secin</option>
                {musteriSecenekleri.map((musteri) => (
                  <option key={musteri.uid} value={musteri.uid}>
                    {musteri.ad}
                  </option>
                ))}
              </select>
              <label>Urun</label>
              <UrunSecici
                value={siparisFormu.urun}
                onChange={(urun) => {
                  siparisFormuGuncelle('urun', urun.ad)
                  siparisFormuGuncelle('urunUid', urun.uid)
                }}
                urunSecenekleri={urunSecenekleri}
              />
              <label>Siparis Verilen Urun Adedi</label>
              <input type="number" min="1" step="1" value={siparisFormu.urunAdedi} onChange={(event) => siparisFormuGuncelle('urunAdedi', event.target.value)} />
              <label>Toplam Tutar</label>
              <input type="number" min="0" step="0.01" value={siparisFormu.toplamTutar} readOnly style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }} />
              <label>Siparis Tarihi</label>
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
            <div className="modal-baslik">
              <h3>Siparis Durumu Guncelle</h3>
              <button type="button" className="modal-kapat" onClick={() => setDurumGuncellenenSiparisNo(null)} aria-label="Kapat">×</button>
            </div>
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
              <label>Teslimat Suresi</label>
              <input value={siparisDurumFormu.teslimatSuresi} onChange={(event) => siparisDurumFormuGuncelle('teslimatSuresi', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setDurumGuncellenenSiparisNo(null)}>Iptal</button>
              <button type="button" onClick={siparisDurumKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekSiparis && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk" data-cy="order-delete-modal">
            <div className="modal-baslik">
              <h3>Silmek istediginizden emin misiniz?</h3>
              <button type="button" className="modal-kapat" onClick={() => setSilinecekSiparis(null)} aria-label="Kapat">×</button>
            </div>
            <p><strong>{silinecekSiparis.siparisNo}</strong> siparisi kaldirilacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekSiparis(null)}>Hayir</button>
              <button type="button" className="tehlike" onClick={siparisSil}>Evet</button>
            </div>
          </div>
        </div>
      )}

      {iptalEdilecekSiparis && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk" data-cy="order-cancel-modal">
            <div className="modal-baslik">
              <h3>Siparişi İptal Et</h3>
              <button type="button" className="modal-kapat" onClick={() => setIptalEdilecekSiparis(null)} aria-label="Kapat">×</button>
            </div>
            <p><strong>{iptalEdilecekSiparis.siparisNo}</strong> siparişini iptal etmek üzeresiniz.</p>
            <div className="modal-form">
              <label>İptal Nedeni</label>
              <textarea
                data-cy="order-cancel-note"
                rows={4}
                placeholder="Sipariş neden iptal ediliyor?"
                value={iptalNotu}
                onChange={(event) => setIptalNotu(event.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" data-cy="order-cancel-dismiss" onClick={() => setIptalEdilecekSiparis(null)}>Vazgeç</button>
              <button type="button" className="tehlike" data-cy="order-cancel-confirm" onClick={siparisIptalKaydet}>İptal Et</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
