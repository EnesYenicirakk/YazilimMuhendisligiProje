import { paraFormatla } from '../../../shared/utils/constantsAndHelpers'
import { tarihFormatla } from '../../../components/common/Ikonlar'

function odemeDurumuSinifi(durum) {
  const normalize = String(durum ?? '').trim().toLocaleLowerCase('tr-TR')
  if (normalize === 'ödendi' || normalize === 'tahsil edildi') return 'odendi'
  if (normalize === 'beklemede') return 'beklemede'
  if (normalize === 'iptal') return 'iptal'
  if (normalize === 'kısmi' || normalize === 'kismi') return 'kismi'
  return 'beklemede'
}

export default function OdemelerPage({
  KucukIkon,
  MobilKart,
  odemeSekmesi,
  setOdemeSekmesi,
  toplamGelenNakit,
  toplamGidenNakit,
  gelenSayfadakiKayitlar,
  gidenSayfadakiKayitlar,
  finansFavoriDegistir,
  odemeDuzenlemeAc,
  setSilinecekOdeme,
  gelenSayfa,
  setGelenSayfa,
  toplamGelenSayfa,
  gidenSayfa,
  setGidenSayfa,
  toplamGidenSayfa,
}) {
  return (
    <section>
      <header className="ust-baslik envanter-baslik">
        <div>
          <h1>Finansal Akış</h1>
          <p>Tahsilat ve ödeme hareketlerini tek ekrandan takip edin.</p>
        </div>
      </header>

      <section className="panel-kart odeme-kart">
        <div className="odeme-sekme-alani">
          <button
            type="button"
            className={`odeme-sekme ${odemeSekmesi === 'gelen' ? 'aktif' : ''}`}
            onClick={() => setOdemeSekmesi('gelen')}
          >
            Tahsilatlar
          </button>
          <button
            type="button"
            className={`odeme-sekme ${odemeSekmesi === 'giden' ? 'aktif' : ''}`}
            onClick={() => setOdemeSekmesi('giden')}
          >
            Ödemeler
          </button>
        </div>

        <section className="dashboard-canli-grid">
          <article className="canli-ozet-kart">
            <span className="canli-ozet-etiket">Toplam Tahsilat</span>
            <strong>{paraFormatla(toplamGelenNakit)}</strong>
          </article>
          <article className="canli-ozet-kart">
            <span className="canli-ozet-etiket">Toplam Ödeme</span>
            <strong>{paraFormatla(toplamGidenNakit)}</strong>
          </article>
          <article className="canli-ozet-kart">
            <span className="canli-ozet-etiket">Net Durum</span>
            <strong>{paraFormatla(toplamGelenNakit - toplamGidenNakit)}</strong>
          </article>
        </section>

        {odemeSekmesi === 'gelen' && (
          <>
            <div className="panel-ust-cizgi">
              <h2>Tahsilat Listesi</h2>
              <small>{gelenSayfadakiKayitlar.length} kayıt gösteriliyor</small>
            </div>

            <div className="tablo-sarmal masaustu-tablo">
              <table>
                <thead>
                  <tr>
                    <th>Ödeme No</th>
                    <th>Taraf</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                    <th>Tutar</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {gelenSayfadakiKayitlar.map((kayit) => (
                    <tr key={kayit.odemeNo}>
                      <td>{kayit.odemeNo}</td>
                      <td>{kayit.taraf}</td>
                      <td>{tarihFormatla(kayit.tarih)}</td>
                      <td>
                        <span className={`odeme-durumu ${odemeDurumuSinifi(kayit.durum)}`}>
                          {kayit.durum}
                        </span>
                      </td>
                      <td>{paraFormatla(kayit.tutar)}</td>
                      <td>
                        <div className="islem-dugmeleri odeme-islemler">
                          <button
                            type="button"
                            className={`ikon-dugme favori ${kayit.favori ? 'aktif' : ''}`}
                            onClick={() => finansFavoriDegistir('gelen', kayit.odemeNo)}
                            title="Favori"
                          >
                            <KucukIkon tip="favori" />
                          </button>
                          <button
                            type="button"
                            className="ikon-dugme duzenle"
                            onClick={() => odemeDuzenlemeAc('gelen', kayit)}
                            title="Düzenle"
                          >
                            <KucukIkon tip="duzenle" />
                          </button>
                          <button
                            type="button"
                            className="ikon-dugme sil"
                            onClick={() =>
                              setSilinecekOdeme({ sekme: 'gelen', odemeNo: kayit.odemeNo, taraf: kayit.taraf })
                            }
                            title="Sil"
                          >
                            <KucukIkon tip="sil" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobil-kart-listesi">
              {gelenSayfadakiKayitlar.map((kayit) => (
                <MobilKart
                  key={`gelen-${kayit.odemeNo}`}
                  className="odeme-mobil-kart"
                  solaEtiket="Sil"
                  sagaEtiket="Favori ve düzenle"
                  solaAksiyonlar={[
                    {
                      id: 'sil',
                      etiket: 'Sil',
                      varyant: 'tehlike',
                      onClick: () => setSilinecekOdeme({ sekme: 'gelen', odemeNo: kayit.odemeNo, taraf: kayit.taraf }),
                    },
                  ]}
                  sagaAksiyonlar={[
                    { id: 'favori', etiket: 'Favori', varyant: 'favori', aktif: kayit.favori, onClick: () => finansFavoriDegistir('gelen', kayit.odemeNo) },
                    { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => odemeDuzenlemeAc('gelen', kayit) },
                  ]}
                  ust={
                    <>
                      <strong>{kayit.odemeNo}</strong>
                      <span>{kayit.taraf}</span>
                    </>
                  }
                  govde={
                    <>
                      <div className="mobil-bilgi-satiri">
                        <span>Tarih</span>
                        <strong>{tarihFormatla(kayit.tarih)}</strong>
                      </div>
                      <div className="mobil-bilgi-satiri">
                        <span>Durum</span>
                        <strong className={`odeme-durumu ${odemeDurumuSinifi(kayit.durum)}`}>
                          {kayit.durum}
                        </strong>
                      </div>
                      <div className="mobil-bilgi-satiri">
                        <span>Tutar</span>
                        <strong>{paraFormatla(kayit.tutar)}</strong>
                      </div>
                    </>
                  }
                />
              ))}
            </div>

            <div className="sayfalama">
              <button
                type="button"
                className="sayfa-ok"
                onClick={() => setGelenSayfa((onceki) => Math.max(1, onceki - 1))}
                disabled={gelenSayfa === 1}
              >
                ‹
              </button>
              {Array.from({ length: toplamGelenSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                <button
                  key={`gelen-sayfa-${sayfaNo}`}
                  type="button"
                  className={`sayfa-buton ${gelenSayfa === sayfaNo ? 'aktif' : ''}`}
                  onClick={() => setGelenSayfa(sayfaNo)}
                >
                  {sayfaNo}
                </button>
              ))}
              <button
                type="button"
                className="sayfa-ok"
                onClick={() => setGelenSayfa((onceki) => Math.min(toplamGelenSayfa, onceki + 1))}
                disabled={gelenSayfa === toplamGelenSayfa}
              >
                ›
              </button>
            </div>
          </>
        )}

        {odemeSekmesi === 'giden' && (
          <>
            <div className="panel-ust-cizgi">
              <h2>Ödeme Listesi</h2>
              <small>{gidenSayfadakiKayitlar.length} kayıt gösteriliyor</small>
            </div>

            <div className="tablo-sarmal masaustu-tablo">
              <table>
                <thead>
                  <tr>
                    <th>Ödeme No</th>
                    <th>Taraf</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                    <th>Tutar</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {gidenSayfadakiKayitlar.map((kayit) => (
                    <tr key={kayit.odemeNo}>
                      <td>{kayit.odemeNo}</td>
                      <td>{kayit.taraf}</td>
                      <td>{tarihFormatla(kayit.tarih)}</td>
                      <td>
                        <span className={`odeme-durumu ${odemeDurumuSinifi(kayit.durum)}`}>
                          {kayit.durum}
                        </span>
                      </td>
                      <td>{paraFormatla(kayit.tutar)}</td>
                      <td>
                        <div className="islem-dugmeleri odeme-islemler">
                          <button
                            type="button"
                            className={`ikon-dugme favori ${kayit.favori ? 'aktif' : ''}`}
                            onClick={() => finansFavoriDegistir('giden', kayit.odemeNo)}
                            title="Favori"
                          >
                            <KucukIkon tip="favori" />
                          </button>
                          <button
                            type="button"
                            className="ikon-dugme duzenle"
                            onClick={() => odemeDuzenlemeAc('giden', kayit)}
                            title="Düzenle"
                          >
                            <KucukIkon tip="duzenle" />
                          </button>
                          <button
                            type="button"
                            className="ikon-dugme sil"
                            onClick={() =>
                              setSilinecekOdeme({ sekme: 'giden', odemeNo: kayit.odemeNo, taraf: kayit.taraf })
                            }
                            title="Sil"
                          >
                            <KucukIkon tip="sil" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobil-kart-listesi">
              {gidenSayfadakiKayitlar.map((kayit) => (
                <MobilKart
                  key={`giden-${kayit.odemeNo}`}
                  className="odeme-mobil-kart"
                  solaEtiket="Sil"
                  sagaEtiket="Favori ve düzenle"
                  solaAksiyonlar={[
                    {
                      id: 'sil',
                      etiket: 'Sil',
                      varyant: 'tehlike',
                      onClick: () => setSilinecekOdeme({ sekme: 'giden', odemeNo: kayit.odemeNo, taraf: kayit.taraf }),
                    },
                  ]}
                  sagaAksiyonlar={[
                    { id: 'favori', etiket: 'Favori', varyant: 'favori', aktif: kayit.favori, onClick: () => finansFavoriDegistir('giden', kayit.odemeNo) },
                    { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => odemeDuzenlemeAc('giden', kayit) },
                  ]}
                  ust={
                    <>
                      <strong>{kayit.odemeNo}</strong>
                      <span>{kayit.taraf}</span>
                    </>
                  }
                  govde={
                    <>
                      <div className="mobil-bilgi-satiri">
                        <span>Tarih</span>
                        <strong>{tarihFormatla(kayit.tarih)}</strong>
                      </div>
                      <div className="mobil-bilgi-satiri">
                        <span>Durum</span>
                        <strong className={`odeme-durumu ${odemeDurumuSinifi(kayit.durum)}`}>
                          {kayit.durum}
                        </strong>
                      </div>
                      <div className="mobil-bilgi-satiri">
                        <span>Tutar</span>
                        <strong>{paraFormatla(kayit.tutar)}</strong>
                      </div>
                    </>
                  }
                />
              ))}
            </div>

            <div className="sayfalama">
              <button
                type="button"
                className="sayfa-ok"
                onClick={() => setGidenSayfa((onceki) => Math.max(1, onceki - 1))}
                disabled={gidenSayfa === 1}
              >
                ‹
              </button>
              {Array.from({ length: toplamGidenSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                <button
                  key={`giden-sayfa-${sayfaNo}`}
                  type="button"
                  className={`sayfa-buton ${gidenSayfa === sayfaNo ? 'aktif' : ''}`}
                  onClick={() => setGidenSayfa(sayfaNo)}
                >
                  {sayfaNo}
                </button>
              ))}
              <button
                type="button"
                className="sayfa-ok"
                onClick={() => setGidenSayfa((onceki) => Math.min(toplamGidenSayfa, onceki + 1))}
                disabled={gidenSayfa === toplamGidenSayfa}
              >
                ›
              </button>
            </div>
          </>
        )}
      </section>
    </section>
  )
}
