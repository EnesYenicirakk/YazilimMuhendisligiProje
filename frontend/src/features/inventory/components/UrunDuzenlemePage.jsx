import { kritikStoktaMi, paraFormatla } from '../../../shared/utils/constantsAndHelpers'

export default function UrunDuzenlemePage({
  KucukIkon,
  BosDurumKarti,
  MobilKart,
  urunDuzenlemeSekmesi,
  setUrunDuzenlemeSekmesi,
  urunDuzenlemeArama,
  setUrunDuzenlemeArama,
  setUrunDuzenlemeSayfa,
  sayfadakiDuzenlemeUrunleri,
  urunDuzenlemeBaslangic,
  favoriDegistir,
  urunDuzenlemeModaliniAc,
  setSilinecekDuzenlemeUrunu,
  urunDuzenlemeSayfa,
  urunDuzenlemeSayfayaGit,
  toplamUrunDuzenlemeSayfa,
  sayfadakiStokLoglari,
  stokLogBaslangic,
  stokLogSayfa,
  setStokLogSayfa,
  toplamStokLogSayfa,
}) {
  return (
    <section data-testid="product-management-page">
      <header className="ust-baslik envanter-baslik">
        <div>
          <h1>Ürün Düzenleme</h1>
          <p>Alış ve satış fiyatlarını ürün bazında yönetin.</p>
        </div>
      </header>

      <section className="panel-kart envanter-kart">
        <div className="odeme-sekme-alani">
          <button
            type="button"
            className={`odeme-sekme ${urunDuzenlemeSekmesi === 'urunler' ? 'aktif' : ''}`}
            onClick={() => {
              setUrunDuzenlemeSekmesi('urunler')
              setUrunDuzenlemeSayfa(1)
            }}
          >
            Ürün Listesi
          </button>
          <button
            type="button"
            className={`odeme-sekme ${urunDuzenlemeSekmesi === 'stok-loglari' ? 'aktif' : ''}`}
            onClick={() => {
              setUrunDuzenlemeSekmesi('stok-loglari')
              setStokLogSayfa(1)
            }}
          >
            Stok Geçmişi
          </button>
        </div>

        {urunDuzenlemeSekmesi === 'urunler' && (
          <>
            <div className="panel-ust-cizgi">
              <h2>Ürün Fiyat Listesi</h2>
              <input
                type="text"
                data-testid="product-management-search"
                placeholder="Ürün veya ID ara"
                value={urunDuzenlemeArama}
                onChange={(event) => {
                  setUrunDuzenlemeArama(event.target.value)
                  setUrunDuzenlemeSayfa(1)
                }}
              />
            </div>

            {sayfadakiDuzenlemeUrunleri.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table data-testid="product-management-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Ürün</th>
                        <th>Ürün ID</th>
                        <th>Ürün Adedi</th>
                        <th>Alış Fiyatı</th>
                        <th>Satış Fiyatı</th>
                        <th>Mağaza Stok</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiDuzenlemeUrunleri.map((urun, index) => (
                        <tr key={`duzenleme-${urun.uid}`} data-testid="product-management-row" data-product-sku={urun.urunId}>
                          <td>{String(urunDuzenlemeBaslangic + index + 1).padStart(2, '0')}</td>
                          <td>
                            <div className="urun-bilgi">
                              <span
                                className="urun-avatar"
                                style={urun.avatar?.startsWith('#') ? { backgroundColor: urun.avatar, color: '#fff', border: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.2)' } : {}}
                              >
                                {urun.avatar?.startsWith('#') ? (urun.ad?.charAt(0) || '') : (urun.avatar || urun.ad?.charAt(0) || '?')}
                              </span>
                              <span className="urun-ad-satiri">
                                <span>{urun.ad}</span>
                                {kritikStoktaMi(urun) && (
                                  <span
                                    className="kritik-stok-rozet"
                                    data-tooltip="Bu ürün kritik stok değerinin altındadır."
                                    title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}
                                  >
                                    !
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td data-testid="product-management-sku">{urun.urunId}</td>
                          <td data-testid="product-management-warehouse-stock">{urun.urunAdedi}</td>
                          <td data-testid="product-management-purchase-price">{paraFormatla(urun.alisFiyati ?? 0)}</td>
                          <td data-testid="product-management-sale-price">{paraFormatla(urun.satisFiyati ?? 0)}</td>
                          <td data-testid="product-management-store-stock">{urun.magazaStok}</td>
                          <td>
                            <div className="islem-dugmeleri">
                              <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Otomatik Tedarik" onClick={() => favoriDegistir(urun.uid)}><KucukIkon tip="otomatik-tedarik" /></button>
                              <button type="button" className="ikon-dugme duzenle" data-testid="product-management-edit" title="Düzenle" onClick={() => urunDuzenlemeModaliniAc(urun)}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme sil" data-testid="product-management-delete" title="Sil" onClick={() => setSilinecekDuzenlemeUrunu(urun)}><KucukIkon tip="sil" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiDuzenlemeUrunleri.map((urun, index) => (
                    <MobilKart
                      key={`mobil-duzenleme-${urun.uid}`}
                      className="envanter-mobil-kart"
                      solaEtiket="Sil"
                      sagaEtiket="Otomatik tedarik ve düzenle"
                      solaAksiyonlar={[
                        { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekDuzenlemeUrunu(urun) },
                      ]}
                      sagaAksiyonlar={[
                        { id: 'favori', etiket: 'Otomatik Tedarik', varyant: 'favori', aktif: urun.favori, onClick: () => favoriDegistir(urun.uid) },
                        { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => urunDuzenlemeModaliniAc(urun) },
                      ]}
                      ust={(
                        <>
                          <strong>{String(urunDuzenlemeBaslangic + index + 1).padStart(2, '0')} - {urun.ad}</strong>
                          <span>{urun.urunId}</span>
                        </>
                      )}
                      govde={(
                        <>
                          <div className="mobil-kart-kisi">
                            <span
                              className="urun-avatar"
                              style={urun.avatar?.startsWith('#') ? { backgroundColor: urun.avatar, color: '#fff', border: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.2)' } : {}}
                            >
                              {urun.avatar?.startsWith('#') ? (urun.ad?.charAt(0) || '') : (urun.avatar || urun.ad?.charAt(0) || '?')}
                            </span>
                            <div className="mobil-kisi-metin">
                              <strong className="urun-ad-satiri">
                                <span>{urun.ad}</span>
                                {kritikStoktaMi(urun) && (
                                  <span
                                    className="kritik-stok-rozet"
                                    data-tooltip="Bu ürün kritik stok değerinin altındadır."
                                    title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}
                                  >
                                    !
                                  </span>
                                )}
                              </strong>
                              <span>{urun.urunId}</span>
                            </div>
                          </div>
                          <div className="mobil-bilgi-satiri"><span>Ürün Adedi</span><strong>{urun.urunAdedi}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Minimum Stok</span><strong>{urun.minimumStok}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Alış Fiyatı</span><strong>{paraFormatla(urun.alisFiyati ?? 0)}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Satış Fiyatı</span><strong>{paraFormatla(urun.satisFiyati ?? 0)}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Mağaza Stok</span><strong>{urun.magazaStok}</strong></div>
                        </>
                      )}
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => urunDuzenlemeSayfayaGit(urunDuzenlemeSayfa - 1)} disabled={urunDuzenlemeSayfa === 1}>‹</button>
                  {Array.from({ length: toplamUrunDuzenlemeSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button
                      key={`duzenleme-sayfa-${sayfaNo}`}
                      type="button"
                      className={`sayfa-buton ${urunDuzenlemeSayfa === sayfaNo ? 'aktif' : ''}`}
                      onClick={() => urunDuzenlemeSayfayaGit(sayfaNo)}
                    >
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => urunDuzenlemeSayfayaGit(urunDuzenlemeSayfa + 1)} disabled={urunDuzenlemeSayfa === toplamUrunDuzenlemeSayfa}>›</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="Düzenlenecek ürün bulunamadı"
                aciklama="Arama kriterine göre görüntülenecek ürün yok."
                eylemMetni="Aramayı Temizle"
                onEylem={() => {
                  setUrunDuzenlemeArama('')
                  setUrunDuzenlemeSayfa(1)
                }}
              />
            )}
          </>
        )}

        {urunDuzenlemeSekmesi === 'stok-loglari' && (
          <>
            <div className="panel-ust-cizgi">
              <h2>Son Stok Değişiklikleri</h2>
              <span className="panel-bilgi-rozet">Son 16 hareket</span>
            </div>

            {sayfadakiStokLoglari.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Tarih</th>
                        <th>Ürün</th>
                        <th>Ürün ID</th>
                        <th>İşlem</th>
                        <th>Eski Stok</th>
                        <th>Yeni Stok</th>
                        <th>Kullanıcı</th>
                        <th>Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiStokLoglari.map((log, index) => (
                        <tr key={`stok-log-${log.id}`}>
                          <td>{String(stokLogBaslangic + index + 1).padStart(2, '0')}</td>
                          <td>{log.tarih}</td>
                          <td>{log.urun}</td>
                          <td>{log.urunId}</td>
                          <td><span className="stok-log-rozet">{log.islem}</span></td>
                          <td>
                            <span className={`stok-log-deger-baloncuk ${log.eskiStok > log.yeniStok ? 'yuksek' : 'dusuk'}`}>
                              {log.eskiStok}
                            </span>
                          </td>
                          <td>
                            <span className={`stok-log-deger-baloncuk ${log.yeniStok > log.eskiStok ? 'yuksek' : 'dusuk'}`}>
                              {log.yeniStok}
                            </span>
                          </td>
                          <td>{log.kullanici}</td>
                          <td>{log.aciklama}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiStokLoglari.map((log, index) => (
                    <MobilKart
                      key={`mobil-stok-log-${log.id}`}
                      className="stok-log-mobil-kart"
                      ust={(
                        <>
                          <strong>{String(stokLogBaslangic + index + 1).padStart(2, '0')} - {log.urun}</strong>
                          <span className="stok-log-rozet">{log.islem}</span>
                        </>
                      )}
                      govde={(
                        <>
                          <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{log.tarih}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Ürün ID</span><strong>{log.urunId}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Eski Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.eskiStok > log.yeniStok ? 'yuksek' : 'dusuk'}`}>{log.eskiStok}</span></strong></div>
                          <div className="mobil-bilgi-satiri"><span>Yeni Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.yeniStok > log.eskiStok ? 'yuksek' : 'dusuk'}`}>{log.yeniStok}</span></strong></div>
                          <div className="mobil-bilgi-satiri"><span>Kullanıcı</span><strong>{log.kullanici}</strong></div>
                          <div className="mobil-bilgi-satiri tam"><span>Açıklama</span><strong>{log.aciklama}</strong></div>
                        </>
                      )}
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => setStokLogSayfa(stokLogSayfa - 1)} disabled={stokLogSayfa === 1}>‹</button>
                  {Array.from({ length: toplamStokLogSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button
                      key={`stok-log-sayfa-${sayfaNo}`}
                      type="button"
                      className={`sayfa-buton ${stokLogSayfa === sayfaNo ? 'aktif' : ''}`}
                      onClick={() => setStokLogSayfa(sayfaNo)}
                    >
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => setStokLogSayfa(stokLogSayfa + 1)} disabled={stokLogSayfa === toplamStokLogSayfa}>›</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="Stok hareketi bulunamadı"
                aciklama="Henüz görüntülenecek stok değişiklik kaydı yok."
              />
            )}
          </>
        )}
      </section>
    </section>
  )
}



