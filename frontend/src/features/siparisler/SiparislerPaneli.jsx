import BosDurumKarti from '../../components/common/BosDurumKarti'
import { KucukIkon } from '../../components/common/Ikonlar'
import MobilKart from '../../components/common/MobilKart'
import PageHeader from '../../shared/ui/PageHeader'
import SectionToolbar from '../../shared/ui/SectionToolbar'
import StatusBadge from '../../shared/ui/StatusBadge'
import TabSwitcher from '../../shared/ui/TabSwitcher'

function odemeDurumuRozeti(durum) {
  return {
    tone: durum === 'Ödendi' ? 'success' : 'warning',
  }
}

function teslimatDurumuRozeti(teslimatDurumuSinifi) {
  if (teslimatDurumuSinifi === 'durum-hazirlaniyor') {
    return {
      tone: 'info',
      className: 'durum-hazirlaniyor',
    }
  }

  if (teslimatDurumuSinifi === 'durum-teslim') {
    return {
      tone: 'info',
      className: 'durum-teslim',
    }
  }

  return {
    tone: 'info',
  }
}

function gecmisSiparisDurumuRozeti(durum) {
  if (durum === 'İptal Edildi') {
    return {
      tone: 'danger',
      variant: 'outline',
    }
  }

  if (durum === 'İade Edildi') {
    return {
      tone: 'neutral',
      variant: 'outline',
      className: 'iade',
    }
  }

  return {
    tone: 'success',
    variant: 'outline',
  }
}

function SiparislerPaneli(props) {
  const {
    yeniSiparisPenceresiniAc,
    siparisSekmesi,
    setSiparisSekmesi,
    siparisAktivitesi,
    siparisArama,
    setSiparisArama,
    siparisOdemeFiltresi,
    setSiparisOdemeFiltresi,
    sayfadakiSiparisler,
    paraFormatla,
    tarihFormatla,
    durumSinifi,
    setDetaySiparis,
    siparisDuzenlemeAc,
    siparisDurumGuncellemeAc,
    siparisIptalAc,
    siparisMusteriAra,
    siparisSayfa,
    setSiparisSayfa,
    toplamSiparisSayfa,
    gecmisSiparisArama,
    setGecmisSiparisArama,
    setGecmisSiparisSayfa,
    sayfadakiGecmisSiparisler,
    setDetayGecmisSiparis,
    gecmisSiparisSayfa,
    toplamGecmisSiparisSayfa,
    iptalSiparisArama,
    setIptalSiparisArama,
    setIptalSiparisSayfa,
    sayfadakiIptalSiparisler,
    iptalSiparisSayfa,
    toplamIptalSiparisSayfa,
  } = props

  return (
    <section data-cy="orders-page">
      <PageHeader
        title="Siparişler"
        description="En yeni siparişten en eski siparişe doğru listelenir."
        className="siparisler-baslik"
        actions={(
          <button type="button" className="urun-ekle-karti" data-cy="order-add-button" onClick={yeniSiparisPenceresiniAc}>
            <span className="urun-ekle-ikon" aria-hidden="true"><KucukIkon tip="siparis-ekle" /></span>
            <span className="urun-ekle-metin">Yeni Sipariş</span>
          </button>
        )}
      />

      <section className="panel-kart siparisler-kart">
        <TabSwitcher
          value={siparisSekmesi}
          onChange={setSiparisSekmesi}
          options={[
            { id: 'aktif', label: 'Aktif Siparişler' },
            { id: 'gecmis', label: 'Geçmiş Siparişler' },
            { id: 'iptal', label: 'İptal Edilen Siparişler' },
          ]}
        />

        {props.loading ? (
          <div className="yukleniyor-alani">
            <div className="yukleniyor-spinner"></div>
            <p>Siparişler yükleniyor...</p>
          </div>
        ) : (
          <>
            {siparisSekmesi === 'aktif' && (
          <>
            <section className="siparis-aktivite-kartlari" aria-label="Sipariş Aktivitesi">
              <article className="siparis-aktivite-karti">
                <strong className="sayi mavi">{siparisAktivitesi.paketlenecek}</strong>
                <small>Adet</small>
                <p>Paketlenecek</p>
              </article>
              <article className="siparis-aktivite-karti">
                <strong className="sayi kirmizi">{siparisAktivitesi.sevkEdilecek}</strong>
                <small>Adet</small>
                <p>Sevk Edilecek</p>
              </article>
              <article className="siparis-aktivite-karti">
                <strong className="sayi yesil">{siparisAktivitesi.teslimEdilecek}</strong>
                <small>Adet</small>
                <p>Teslim Edilecek</p>
              </article>
            </section>

            <div className="siparis-kontrol">
              <input
                data-cy="order-search"
                type="text"
                placeholder="Sipariş no, müşteri veya ürün ara"
                value={siparisArama}
                onChange={(event) => setSiparisArama(event.target.value)}
              />
              <select data-cy="order-payment-filter" value={siparisOdemeFiltresi} onChange={(event) => setSiparisOdemeFiltresi(event.target.value)}>
                <option>Tüm Siparişler</option>
                <option>Ödendi</option>
                <option>Beklemede</option>
              </select>
            </div>

            {sayfadakiSiparisler.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table data-cy="orders-table">
                    <thead>
                      <tr>
                        <th>Sipariş No</th>
                        <th>Müşteri Adı</th>
                        <th>Toplam Tutar</th>
                        <th>Sipariş Tarihi</th>
                        <th>Ödeme</th>
                        <th>Ürün Hazırlık</th>
                        <th>Teslimat</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiSiparisler.map((siparis) => (
                        <tr key={siparis.siparisNo} data-cy="order-row" data-order-id={siparis.siparisNo}>
                          <td data-cy="order-number">{siparis.siparisNo}</td>
                          <td data-cy="order-customer">{siparis.musteri}</td>
                          <td>{paraFormatla(siparis.toplamTutar)}</td>
                          <td>{tarihFormatla(siparis.siparisTarihi)}</td>
                          <td>
                            <StatusBadge
                              label={siparis.odemeDurumu}
                              {...odemeDurumuRozeti(siparis.odemeDurumu)}
                            />
                          </td>
                          <td>{siparis.urunHazirlik}</td>
                          <td>
                            <StatusBadge
                              label={siparis.teslimatDurumu}
                              {...teslimatDurumuRozeti(durumSinifi(siparis.teslimatDurumu))}
                            />
                          </td>
                          <td>
                            <div className="islem-dugmeleri siparis-islemleri">
                              <button type="button" className="ikon-dugme not" data-cy="order-detail-button" title="Detay" onClick={() => setDetaySiparis(siparis)}><KucukIkon tip="detay" /></button>
                              <button type="button" className="ikon-dugme duzenle" data-cy="order-edit-button" title="Düzenle" onClick={() => siparisDuzenlemeAc(siparis)}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme favori" data-cy="order-status-button" title="Durum Güncelle" onClick={() => siparisDurumGuncellemeAc(siparis)}><KucukIkon tip="durum" /></button>
                              <button type="button" className="ikon-dugme sil" data-cy="order-cancel-button" title="İptal Et" onClick={() => siparisIptalAc(siparis)}><KucukIkon tip="sil" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiSiparisler.map((siparis) => (
                    <MobilKart
                      key={`mobil-${siparis.siparisNo}`}
                      className="siparis-mobil-kart"
                      solaEtiket="Sil"
                      sagaEtiket="Detay ve işlemler"
                      solaAksiyonlar={[
                        { id: 'iptal', etiket: 'İptal Et', varyant: 'tehlike', onClick: () => siparisIptalAc(siparis) },
                      ]}
                      sagaAksiyonlar={[
                        { id: 'detay', etiket: 'Detay', onClick: () => setDetaySiparis(siparis) },
                        { id: 'durum', etiket: 'Durum', onClick: () => siparisDurumGuncellemeAc(siparis) },
                        { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => siparisDuzenlemeAc(siparis) },
                        { id: 'ara', etiket: 'Ara', varyant: 'ikincil', onClick: () => siparisMusteriAra(siparis) },
                      ]}
                      ust={
                        <>
                          <strong>{siparis.siparisNo}</strong>
                          <StatusBadge
                            label={siparis.teslimatDurumu}
                            {...teslimatDurumuRozeti(durumSinifi(siparis.teslimatDurumu))}
                          />
                        </>
                      }
                      govde={
                        <>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Müşteri</span><strong>{siparis.musteri}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ürün</span><strong>{siparis.urun}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tutar</span><strong>{paraFormatla(siparis.toplamTutar)}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tarih</span><strong>{tarihFormatla(siparis.siparisTarihi)}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri">
                            <span>Ödeme</span>
                            <strong>
                              <StatusBadge
                                label={siparis.odemeDurumu}
                                {...odemeDurumuRozeti(siparis.odemeDurumu)}
                              />
                            </strong>
                          </div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Hazırlık</span><strong>{siparis.urunHazirlik}</strong></div>
                        </>
                      }
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => setSiparisSayfa(siparisSayfa - 1)} disabled={siparisSayfa === 1}>‹</button>
                  {Array.from({ length: toplamSiparisSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button key={sayfaNo} type="button" className={`sayfa-buton ${siparisSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => setSiparisSayfa(sayfaNo)}>
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => setSiparisSayfa(siparisSayfa + 1)} disabled={siparisSayfa === toplamSiparisSayfa}>›</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="Sipariş bulunamadı"
                aciklama="Arama veya ödeme filtresine uygun aktif sipariş kaydı bulunmuyor."
                eylemMetni="Filtreleri Temizle"
                onEylem={() => {
                  setSiparisArama('')
                  setSiparisOdemeFiltresi('Tüm Siparişler')
                  setSiparisSayfa(1)
                }}
              />
            )}
          </>
        )}

        {siparisSekmesi === 'iptal' && (
          <>
            <SectionToolbar
              title="İptal Edilen Siparişler"
              rightSlot={(
                <input
                  type="text"
                  placeholder="Sipariş no, müşteri veya ürün ara"
                  value={iptalSiparisArama}
                  onChange={(event) => {
                    setIptalSiparisArama(event.target.value)
                    setIptalSiparisSayfa(1)
                  }}
                />
              )}
            />

            {sayfadakiIptalSiparisler.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table>
                    <thead>
                      <tr>
                        <th>Log No</th>
                        <th>Sipariş No</th>
                        <th>Müşteri</th>
                        <th>Ürün</th>
                        <th>Tarih</th>
                        <th>Miktar</th>
                        <th>Tutar</th>
                        <th>İptal Nedeni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiIptalSiparisler.map((kayit) => (
                        <tr key={kayit.logNo}>
                          <td>{kayit.logNo}</td>
                          <td>{kayit.siparisNo}</td>
                          <td>{kayit.musteri}</td>
                          <td>{kayit.urun}</td>
                          <td>{tarihFormatla(kayit.siparisTarihi)}</td>
                          <td>{kayit.urunAdedi}</td>
                          <td>{paraFormatla(kayit.toplamTutar)}</td>
                          <td>{kayit.iptalNedeni}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiIptalSiparisler.map((kayit) => (
                    <MobilKart
                      key={`mobil-iptal-${kayit.logNo}`}
                      className="siparis-mobil-kart"
                      ust={
                        <>
                          <strong>{kayit.siparisNo}</strong>
                          <StatusBadge label="İptal Edildi" tone="danger" variant="outline" />
                        </>
                      }
                      govde={
                        <>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Log No</span><strong>{kayit.logNo}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Müşteri</span><strong>{kayit.musteri}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ürün</span><strong>{kayit.urun}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tarih</span><strong>{tarihFormatla(kayit.siparisTarihi)}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tutar</span><strong>{paraFormatla(kayit.toplamTutar)}</strong></div>
                          <div className="mobil-bilgi-satiri tam"><span>İptal Nedeni</span><strong>{kayit.iptalNedeni}</strong></div>
                        </>
                      }
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => setIptalSiparisSayfa(iptalSiparisSayfa - 1)} disabled={iptalSiparisSayfa === 1}>‹</button>
                  {Array.from({ length: toplamIptalSiparisSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button key={`iptal-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${iptalSiparisSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => setIptalSiparisSayfa(sayfaNo)}>
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => setIptalSiparisSayfa(iptalSiparisSayfa + 1)} disabled={iptalSiparisSayfa === toplamIptalSiparisSayfa}>›</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="İptal edilen sipariş yok"
                aciklama="Henüz iptal edilmiş sipariş kaydı bulunmuyor."
              />
            )}
          </>
        )}

        {siparisSekmesi === 'gecmis' && (
          <>
            <SectionToolbar
              title="Geçmiş Siparişler"
              rightSlot={(
                <input
                  type="text"
                  placeholder="Log no, sipariş no, müşteri veya ürün ara"
                  value={gecmisSiparisArama}
                  onChange={(event) => {
                    setGecmisSiparisArama(event.target.value)
                    setGecmisSiparisSayfa(1)
                  }}
                />
              )}
            />

            {sayfadakiGecmisSiparisler.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table>
                    <thead>
                      <tr>
                        <th>Log No</th>
                        <th>Sipariş No</th>
                        <th>Müşteri</th>
                        <th>Ürün</th>
                        <th>Tarih</th>
                        <th>Miktar</th>
                        <th>Tutar</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiGecmisSiparisler.map((kayit) => (
                        <tr key={kayit.logNo} className="satir-tiklanabilir" onClick={() => setDetayGecmisSiparis(kayit)}>
                          <td>{kayit.logNo}</td>
                          <td>{kayit.siparisNo}</td>
                          <td>{kayit.musteri}</td>
                          <td>{kayit.urun}</td>
                          <td>{tarihFormatla(kayit.tarih)}</td>
                          <td>{kayit.miktar}</td>
                          <td>{paraFormatla(kayit.tutar)}</td>
                          <td>
                            <StatusBadge
                              label={kayit.durum}
                              {...gecmisSiparisDurumuRozeti(kayit.durum)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiGecmisSiparisler.map((kayit) => (
                    <MobilKart
                      key={`mobil-${kayit.logNo}`}
                      className="siparis-mobil-kart"
                      sagaEtiket="Detay"
                      sagaAksiyonlar={[
                        { id: 'detay', etiket: 'Detay', onClick: () => setDetayGecmisSiparis(kayit) },
                      ]}
                      ust={
                        <>
                          <strong>{kayit.siparisNo}</strong>
                          <StatusBadge
                            label={kayit.durum}
                            {...gecmisSiparisDurumuRozeti(kayit.durum)}
                          />
                        </>
                      }
                      govde={
                        <>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Log No</span><strong>{kayit.logNo}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Müşteri</span><strong>{kayit.musteri}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ürün</span><strong>{kayit.urun}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tarih</span><strong>{tarihFormatla(kayit.tarih)}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Miktar</span><strong>{kayit.miktar}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tutar</span><strong>{paraFormatla(kayit.tutar)}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Durum</span><strong>{kayit.durum}</strong></div>
                          <div className="mobil-bilgi-satiri tam"><span>Açıklama</span><strong>{kayit.aciklama}</strong></div>
                        </>
                      }
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => setGecmisSiparisSayfa(gecmisSiparisSayfa - 1)} disabled={gecmisSiparisSayfa === 1}>‹</button>
                  {Array.from({ length: toplamGecmisSiparisSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button key={`gecmis-siparis-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${gecmisSiparisSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => setGecmisSiparisSayfa(sayfaNo)}>
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => setGecmisSiparisSayfa(gecmisSiparisSayfa + 1)} disabled={gecmisSiparisSayfa === toplamGecmisSiparisSayfa}>›</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="Geçmiş sipariş bulunamadı"
                aciklama="Arama kriterine uyan geçmiş sipariş kaydı yok."
                eylemMetni="Aramayı Temizle"
                onEylem={() => {
                  setGecmisSiparisArama('')
                  setGecmisSiparisSayfa(1)
                }}
              />
            )}
          </>
        )}
      </>
    )}
      </section>
    </section>
  )
}

export default SiparislerPaneli

