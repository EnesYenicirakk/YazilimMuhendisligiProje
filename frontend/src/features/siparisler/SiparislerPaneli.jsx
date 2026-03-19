import BosDurumKarti from '../../components/common/BosDurumKarti'
import { KucukIkon } from '../../components/common/Ikonlar'
import MobilKart from '../../components/common/MobilKart'

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
    setSilinecekSiparis,
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
  } = props

  return (
    <section>
      <header className="ust-baslik siparisler-baslik">
        <div>
          <h1>Siparişler</h1>
          <p>En yeni siparişten en eski siparişe doğru listelenir.</p>
        </div>
        <button type="button" className="urun-ekle-karti" onClick={yeniSiparisPenceresiniAc}>
          <span className="urun-ekle-ikon" aria-hidden="true"><KucukIkon tip="siparis-ekle" /></span>
          <span className="urun-ekle-metin">Yeni Sipariş</span>
        </button>
      </header>

      <section className="panel-kart siparisler-kart">
        <div className="odeme-sekme-alani">
          <button type="button" className={`odeme-sekme ${siparisSekmesi === 'aktif' ? 'aktif' : ''}`} onClick={() => setSiparisSekmesi('aktif')}>
            Aktif Siparişler
          </button>
          <button type="button" className={`odeme-sekme ${siparisSekmesi === 'gecmis' ? 'aktif' : ''}`} onClick={() => setSiparisSekmesi('gecmis')}>
            Geçmiş Siparişler
          </button>
        </div>

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
                type="text"
                placeholder="Sipariş no, müşteri veya ürün ara"
                value={siparisArama}
                onChange={(event) => setSiparisArama(event.target.value)}
              />
              <select value={siparisOdemeFiltresi} onChange={(event) => setSiparisOdemeFiltresi(event.target.value)}>
                <option>Tüm Siparişler</option>
                <option>Ödendi</option>
                <option>Beklemede</option>
              </select>
            </div>

            {sayfadakiSiparisler.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table>
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
                        <tr key={siparis.siparisNo}>
                          <td>{siparis.siparisNo}</td>
                          <td>{siparis.musteri}</td>
                          <td>{paraFormatla(siparis.toplamTutar)}</td>
                          <td>{tarihFormatla(siparis.siparisTarihi)}</td>
                          <td><span className={`odeme-durumu ${siparis.odemeDurumu === 'Ödendi' ? 'odendi' : 'beklemede'}`}>{siparis.odemeDurumu}</span></td>
                          <td>{siparis.urunHazirlik}</td>
                          <td><span className={`durum-baloncuk ${durumSinifi(siparis.teslimatDurumu)}`}>{siparis.teslimatDurumu}</span></td>
                          <td>
                            <div className="islem-dugmeleri siparis-islemleri">
                              <button type="button" className="ikon-dugme not" title="Detay" onClick={() => setDetaySiparis(siparis)}><KucukIkon tip="detay" /></button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => siparisDuzenlemeAc(siparis)}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme favori" title="Durum Güncelle" onClick={() => siparisDurumGuncellemeAc(siparis)}><KucukIkon tip="durum" /></button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekSiparis(siparis)}><KucukIkon tip="sil" /></button>
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
                        { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekSiparis(siparis) },
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
                          <span className={`durum-baloncuk ${durumSinifi(siparis.teslimatDurumu)}`}>{siparis.teslimatDurumu}</span>
                        </>
                      }
                      govde={
                        <>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Müşteri</span><strong>{siparis.musteri}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ürün</span><strong>{siparis.urun}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tutar</span><strong>{paraFormatla(siparis.toplamTutar)}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tarih</span><strong>{tarihFormatla(siparis.siparisTarihi)}</strong></div>
                          <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ödeme</span><strong><span className={`odeme-durumu ${siparis.odemeDurumu === 'Ödendi' ? 'odendi' : 'beklemede'}`}>{siparis.odemeDurumu}</span></strong></div>
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

        {siparisSekmesi === 'gecmis' && (
          <>
            <div className="panel-ust-cizgi">
              <h2>Geçmiş Siparişler</h2>
              <input
                type="text"
                placeholder="Log no, sipariş no, müşteri veya ürün ara"
                value={gecmisSiparisArama}
                onChange={(event) => {
                  setGecmisSiparisArama(event.target.value)
                  setGecmisSiparisSayfa(1)
                }}
              />
            </div>

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
                          <td><span className={`tedarik-durum ${kayit.durum === 'İptal Edildi' ? 'iptal' : kayit.durum === 'İade Edildi' ? 'iade' : 'teslim'}`}>{kayit.durum}</span></td>
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
                          <span className={`tedarik-durum ${kayit.durum === 'İptal Edildi' ? 'iptal' : kayit.durum === 'İade Edildi' ? 'iade' : 'teslim'}`}>{kayit.durum}</span>
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
      </section>
    </section>
  )
}

export default SiparislerPaneli
