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
    <section>
      <header className="ust-baslik envanter-baslik">
        <div>
          <h1>ÃœrÃ¼n DÃ¼zenleme</h1>
          <p>AlÄ±ÅŸ ve satÄ±ÅŸ fiyatlarÄ±nÄ± Ã¼rÃ¼n bazÄ±nda yÃ¶netin.</p>
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
            ÃœrÃ¼n Listesi
          </button>
          <button
            type="button"
            className={`odeme-sekme ${urunDuzenlemeSekmesi === 'stok-loglari' ? 'aktif' : ''}`}
            onClick={() => {
              setUrunDuzenlemeSekmesi('stok-loglari')
              setStokLogSayfa(1)
            }}
          >
            Stok GeÃ§miÅŸi
          </button>
        </div>

        {urunDuzenlemeSekmesi === 'urunler' && (
          <>
            <div className="panel-ust-cizgi">
              <h2>ÃœrÃ¼n Fiyat Listesi</h2>
              <input
                type="text"
                placeholder="ÃœrÃ¼n veya ID ara"
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
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>ÃœrÃ¼n</th>
                        <th>ÃœrÃ¼n ID</th>
                        <th>ÃœrÃ¼n Adedi</th>
                        <th>AlÄ±ÅŸ FiyatÄ±</th>
                        <th>SatÄ±ÅŸ FiyatÄ±</th>
                        <th>MaÄŸaza Stok</th>
                        <th>Ä°ÅŸlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiDuzenlemeUrunleri.map((urun, index) => (
                        <tr key={`duzenleme-${urun.uid}`}>
                          <td>{String(urunDuzenlemeBaslangic + index + 1).padStart(2, '0')}</td>
                          <td>
                            <div className="urun-bilgi">
                              <span className="urun-avatar">{urun.avatar}</span>
                              <span className="urun-ad-satiri">
                                <span>{urun.ad}</span>
                                {kritikStoktaMi(urun) && (
                                  <span
                                    className="kritik-stok-rozet"
                                    data-tooltip="Bu Ã¼rÃ¼n kritik stok deÄŸerinin altÄ±ndadÄ±r."
                                    title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}
                                  >
                                    !
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td>{urun.urunId}</td>
                          <td>{urun.urunAdedi}</td>
                          <td>{paraFormatla(urun.alisFiyati ?? 0)}</td>
                          <td>{paraFormatla(urun.satisFiyati ?? 0)}</td>
                          <td>{urun.magazaStok}</td>
                          <td>
                            <div className="islem-dugmeleri">
                              <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}><KucukIkon tip="favori" /></button>
                              <button type="button" className="ikon-dugme duzenle" title="DÃ¼zenle" onClick={() => urunDuzenlemeModaliniAc(urun)}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekDuzenlemeUrunu(urun)}><KucukIkon tip="sil" /></button>
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
                      sagaEtiket="Favori ve dÃ¼zenle"
                      solaAksiyonlar={[
                        { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekDuzenlemeUrunu(urun) },
                      ]}
                      sagaAksiyonlar={[
                        { id: 'favori', etiket: 'Favori', varyant: 'favori', aktif: urun.favori, onClick: () => favoriDegistir(urun.uid) },
                        { id: 'duzenle', etiket: 'DÃ¼zenle', varyant: 'ikincil', onClick: () => urunDuzenlemeModaliniAc(urun) },
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
                            <span className="urun-avatar">{urun.avatar}</span>
                            <div className="mobil-kisi-metin">
                              <strong className="urun-ad-satiri">
                                <span>{urun.ad}</span>
                                {kritikStoktaMi(urun) && (
                                  <span
                                    className="kritik-stok-rozet"
                                    data-tooltip="Bu Ã¼rÃ¼n kritik stok deÄŸerinin altÄ±ndadÄ±r."
                                    title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}
                                  >
                                    !
                                  </span>
                                )}
                              </strong>
                              <span>{urun.urunId}</span>
                            </div>
                          </div>
                          <div className="mobil-bilgi-satiri"><span>ÃœrÃ¼n Adedi</span><strong>{urun.urunAdedi}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Minimum Stok</span><strong>{urun.minimumStok}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>AlÄ±ÅŸ FiyatÄ±</span><strong>{paraFormatla(urun.alisFiyati ?? 0)}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>SatÄ±ÅŸ FiyatÄ±</span><strong>{paraFormatla(urun.satisFiyati ?? 0)}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>MaÄŸaza Stok</span><strong>{urun.magazaStok}</strong></div>
                        </>
                      )}
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => urunDuzenlemeSayfayaGit(urunDuzenlemeSayfa - 1)} disabled={urunDuzenlemeSayfa === 1}>â€¹</button>
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
                  <button type="button" className="sayfa-ok" onClick={() => urunDuzenlemeSayfayaGit(urunDuzenlemeSayfa + 1)} disabled={urunDuzenlemeSayfa === toplamUrunDuzenlemeSayfa}>â€º</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="DÃ¼zenlenecek Ã¼rÃ¼n bulunamadÄ±"
                aciklama="Arama kriterine gÃ¶re gÃ¶rÃ¼ntÃ¼lenecek Ã¼rÃ¼n yok."
                eylemMetni="AramayÄ± Temizle"
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
              <h2>Son Stok DeÄŸiÅŸiklikleri</h2>
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
                        <th>ÃœrÃ¼n</th>
                        <th>ÃœrÃ¼n ID</th>
                        <th>Ä°ÅŸlem</th>
                        <th>Eski Stok</th>
                        <th>Yeni Stok</th>
                        <th>KullanÄ±cÄ±</th>
                        <th>AÃ§Ä±klama</th>
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
                          <div className="mobil-bilgi-satiri"><span>ÃœrÃ¼n ID</span><strong>{log.urunId}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Eski Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.eskiStok > log.yeniStok ? 'yuksek' : 'dusuk'}`}>{log.eskiStok}</span></strong></div>
                          <div className="mobil-bilgi-satiri"><span>Yeni Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.yeniStok > log.eskiStok ? 'yuksek' : 'dusuk'}`}>{log.yeniStok}</span></strong></div>
                          <div className="mobil-bilgi-satiri"><span>KullanÄ±cÄ±</span><strong>{log.kullanici}</strong></div>
                          <div className="mobil-bilgi-satiri tam"><span>AÃ§Ä±klama</span><strong>{log.aciklama}</strong></div>
                        </>
                      )}
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => setStokLogSayfa(stokLogSayfa - 1)} disabled={stokLogSayfa === 1}>â€¹</button>
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
                  <button type="button" className="sayfa-ok" onClick={() => setStokLogSayfa(stokLogSayfa + 1)} disabled={stokLogSayfa === toplamStokLogSayfa}>â€º</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="Stok hareketi bulunamadÄ±"
                aciklama="HenÃ¼z gÃ¶rÃ¼ntÃ¼lenecek stok deÄŸiÅŸiklik kaydÄ± yok."
              />
            )}
          </>
        )}
      </section>
    </section>
  )
}


