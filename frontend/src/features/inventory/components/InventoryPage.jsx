import { envanterKategorileri, kritikStoktaMi } from '../../../shared/utils/constantsAndHelpers'

export default function InventoryPage({
  KucukIkon,
  BosDurumKarti,
  MobilKart,
  eklemePenceresiniAc,
  envanterKategori,
  setEnvanterKategori,
  envanterSayfa,
  setEnvanterSayfa,
  envanterSayfayaGit,
  toplamEnvanterSayfa,
  aramaMetni,
  setAramaMetni,
  sayfadakiUrunler,
  sayfaBaslangic,
  favoriDegistir,
  duzenlemePenceresiniAc,
  setSilinecekUrun,
  loading,
}) {
  return (
    <section>
      <header className="ust-baslik envanter-baslik">
        <div>
          <h1>Envanter</h1>
          <p>Mağaza: Merkez Şube</p>
        </div>
        <button type="button" className="urun-ekle-karti" onClick={eklemePenceresiniAc}>
          <span className="urun-ekle-ikon" aria-hidden="true"><KucukIkon tip="urun-ekle" /></span>
          <span className="urun-ekle-metin">Yeni Ürün</span>
        </button>
      </header>

      <section className="panel-kart envanter-kart">
        <div className="odeme-sekme-alani kategori-sekme-alani">
          {envanterKategorileri.map((kategori) => (
            <button
              key={kategori}
              type="button"
              className={`odeme-sekme ${envanterKategori === kategori ? 'aktif' : ''}`}
              onClick={() => {
                setEnvanterKategori(kategori)
                setEnvanterSayfa(1)
              }}
            >
              {kategori}
            </button>
          ))}
        </div>

        <div className="panel-ust-cizgi">
          <h2>Parça Listesi</h2>
          <input
            type="text"
            placeholder="Ürün veya ID ara"
            value={aramaMetni}
            onChange={(event) => {
              setAramaMetni(event.target.value)
              setEnvanterSayfa(1)
            }}
          />
        </div>

        {loading ? (
          <div className="yukleniyor-alani">
            <div className="yukleniyor-spinner"></div>
            <p>Envanter verileri yükleniyor...</p>
          </div>
        ) : (
          <>
            {sayfadakiUrunler.length > 0 ? (
          <>
            <div className="tablo-sarmal masaustu-tablo">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Ürün</th>
                    <th>Ürün ID</th>
                    <th>Kategori</th>
                    <th>Depo Stok</th>
                    <th>Mağaza Stok</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {sayfadakiUrunler.map((urun, index) => (
                    <tr key={urun.uid}>
                      <td>{String(sayfaBaslangic + index + 1).padStart(2, '0')}</td>
                      <td>
                        <div className="urun-hucre">
                          <span
                            className="urun-avatar"
                            style={urun.avatar?.startsWith('#') ? { backgroundColor: urun.avatar, color: '#fff', border: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.2)' } : {}}
                          >
                            {urun.avatar?.startsWith('#') ? (urun.ad?.charAt(0) || '') : (urun.avatar || urun.ad?.charAt(0) || '?')}
                          </span>
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
                        </div>
                      </td>
                      <td>{urun.urunId}</td>
                      <td>{urun.kategori}</td>
                      <td>{urun.urunAdedi}</td>
                      <td>{urun.magazaStok}</td>
                      <td>
                        <div className="islem-dugmeleri">
                          <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Otomatik Tedarik" onClick={() => favoriDegistir(urun.uid)}><KucukIkon tip="otomatik-tedarik" /></button>
                          <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => duzenlemePenceresiniAc(urun)}><KucukIkon tip="duzenle" /></button>
                          <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekUrun(urun)}><KucukIkon tip="sil" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobil-kart-listesi">
              {sayfadakiUrunler.map((urun, index) => (
                <MobilKart
                  key={`mobil-envanter-${urun.uid}`}
                  className="envanter-mobil-kart"
                  solaEtiket="Sil"
                  sagaEtiket="Otomatik tedarik ve düzenle"
                  solaAksiyonlar={[
                    { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekUrun(urun) },
                  ]}
                  sagaAksiyonlar={[
                    { id: 'favori', etiket: 'Otomatik Tedarik', varyant: 'favori', aktif: urun.favori, onClick: () => favoriDegistir(urun.uid) },
                    { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => duzenlemePenceresiniAc(urun) },
                  ]}
                  ust={(
                    <>
                      <strong>{String(sayfaBaslangic + index + 1).padStart(2, '0')} - {urun.ad}</strong>
                      <span>{urun.kategori}</span>
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
                      <div className="mobil-bilgi-satiri"><span>Kategori</span><strong>{urun.kategori}</strong></div>
                      <div className="mobil-bilgi-satiri"><span>Depo Stok</span><strong>{urun.urunAdedi}</strong></div>
                      <div className="mobil-bilgi-satiri"><span>Minimum Stok</span><strong>{urun.minimumStok}</strong></div>
                      <div className="mobil-bilgi-satiri"><span>Mağaza Stok</span><strong>{urun.magazaStok}</strong></div>
                    </>
                  )}
                />
              ))}
            </div>

            <div className="sayfalama">
              <button type="button" className="sayfa-ok" onClick={() => envanterSayfayaGit(envanterSayfa - 1)} disabled={envanterSayfa === 1}>‹</button>
              {Array.from({ length: toplamEnvanterSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                <button
                  key={sayfaNo}
                  type="button"
                  className={`sayfa-buton ${envanterSayfa === sayfaNo ? 'aktif' : ''}`}
                  onClick={() => envanterSayfayaGit(sayfaNo)}
                >
                  {sayfaNo}
                </button>
              ))}
              <button type="button" className="sayfa-ok" onClick={() => envanterSayfayaGit(envanterSayfa + 1)} disabled={envanterSayfa === toplamEnvanterSayfa}>›</button>
            </div>
          </>
        ) : (
          <BosDurumKarti
            baslik="Parça bulunamadı"
            aciklama="Arama veya kategori filtresine uyan ürün görünmüyor."
            eylemMetni="Filtreleri Temizle"
            onEylem={() => {
              setAramaMetni('')
              setEnvanterKategori('Tümü')
              setEnvanterSayfa(1)
            }}
          />
        )}
      </>
    )}
      </section>
    </section>
  )
}



