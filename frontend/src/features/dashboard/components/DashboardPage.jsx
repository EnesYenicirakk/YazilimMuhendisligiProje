import {
  cizgiNoktalari,
  dashboardBolumSablonu,
  durumSinifi,
  gunEtiketiKisalt,
  paraFormatla,
} from '../../../shared/utils/constantsAndHelpers'

export default function DashboardPage({
  KucukIkon,
  sayfaDegistir,
  dashboardData,
}) {
  const {
    setDashboardBolumMenusuAcik,
    dashboardBolumMenusuAcik,
    gorunenDashboardBolumleri,
    dashboardBolumGorunurlukDegistir,
    dashboardOzet,
    setAcikOzetMenusu,
    acikOzetMenusu,
    ozetKartiniSil,
    dashboardCanliOzetler,
    enCokSatilanUrunler,
    haftalikSatisGrafikUstSinir,
    haftalikSatisVerisi,
    dashboardYakinSatislar,
    altGrafikAyEtiketleri,
    aylikGelirSerisi,
    aylikGiderSerisi,
    aylikSatilanUrunSerisi,
    gelirGiderGrafikUstSinir,
  } = dashboardData

  const aylikSatilanUrunMaksimum = Math.max(...aylikSatilanUrunSerisi, 1)

  return (
    <>
      <section>
        <header className="ust-baslik envanter-baslik">
          <div>
            <h1>Dashboard</h1>
            <p>Genel stok ve sipariş özeti</p>
          </div>
          <div className="dashboard-ust-aksiyonlar">
            <div className="dashboard-bolum-menu-sarmal">
              <button
                type="button"
                className="ikinci dashboard-bolum-buton"
                onClick={() => setDashboardBolumMenusuAcik((onceki) => !onceki)}
              >
                Tabloları Gizle/Göster
              </button>
              {dashboardBolumMenusuAcik && (
                <div className="dashboard-bolum-menu">
                  {dashboardBolumSablonu.map((bolum) => (
                    <label key={bolum.anahtar} className="dashboard-bolum-secenek">
                      <input
                        type="checkbox"
                        checked={gorunenDashboardBolumleri[bolum.anahtar]}
                        onChange={() => dashboardBolumGorunurlukDegistir(bolum.anahtar)}
                      />
                      <span>{bolum.etiket}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={() => sayfaDegistir('envanter')}>
              Envantere Git
            </button>
          </div>
        </header>

        <div className="ozet-grid">
          {dashboardOzet.map((kart) => (
            <article key={kart.baslik} className="ozet-kartcik">
              <div className="ozet-ust">
                <span className="ozet-ikon"><KucukIkon tip={kart.ikon} /></span>
                <div className="ozet-menu-sarmal">
                  <button
                    type="button"
                    className="ozet-menu"
                    aria-label="Kart Menüsü"
                    onClick={() => setAcikOzetMenusu((onceki) => (onceki === kart.baslik ? '' : kart.baslik))}
                  >
                    <KucukIkon tip="menu" />
                  </button>
                  {acikOzetMenusu === kart.baslik && (
                    <div className="ozet-menu-acilir">
                      <button type="button" onClick={() => ozetKartiniSil(kart.baslik)}>
                        Grafiği Sil
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p>{kart.baslik}</p>
              <div className="ozet-alt">
                <h3>{kart.deger}</h3>
                <span className={`ozet-degisim ${kart.degisim.startsWith('+') ? 'pozitif' : 'negatif'}`}>
                  {kart.degisim}
                </span>
              </div>
            </article>
          ))}
        </div>

        {gorunenDashboardBolumleri.canli && (
          <section className="dashboard-canli-grid">
            <article className="panel-kart canli-ozet-karti">
              <div className="panel-baslik">
                <h2>Bugünkü Siparişler</h2>
                <small>Canlı özet</small>
              </div>
              <strong className="canli-ozet-deger">{dashboardCanliOzetler.bugunkuSiparisAdedi}</strong>
              <p className="canli-ozet-aciklama">Bugün açılan sipariş sayısı</p>
              <span className="canli-ozet-alt">{paraFormatla(dashboardCanliOzetler.bugunkuSiparisTutari)} toplam hacim</span>
            </article>

            <article className="panel-kart canli-ozet-karti">
              <div className="panel-baslik">
                <h2>Bekleyen Tahsilatlar</h2>
                <small>Ödeme takibi</small>
              </div>
              <strong className="canli-ozet-deger">{dashboardCanliOzetler.bekleyenTahsilatAdedi}</strong>
              <p className="canli-ozet-aciklama">Tahsil edilmesi gereken sipariş</p>
              <span className="canli-ozet-alt">{paraFormatla(dashboardCanliOzetler.bekleyenTahsilatTutari)} bekleyen tutar</span>
            </article>

            <article className="panel-kart canli-ozet-karti">
              <div className="panel-baslik">
                <h2>Geciken Siparişler</h2>
                <small>Teslimat uyarısı</small>
              </div>
              <strong className="canli-ozet-deger">{dashboardCanliOzetler.gecikenSiparisAdedi}</strong>
              <p className="canli-ozet-aciklama">Tahmini süresi aşılmış sipariş</p>
              <span className="canli-ozet-alt">
                {dashboardCanliOzetler.gecikenSiparisAdedi > 0
                  ? dashboardCanliOzetler.gecikenSiparisler.slice(0, 2).map((siparis) => siparis.siparisNo).join(', ')
                  : 'Şu an gecikme görünmüyor'}
              </span>
            </article>
          </section>
        )}

        {(gorunenDashboardBolumleri.haftalik || gorunenDashboardBolumleri.kritik) && (
          <section className="dashboard-orta-grid">
            {gorunenDashboardBolumleri.haftalik && (
              <>
                <article className="panel-kart">
                  <div className="panel-baslik">
                    <h2>Haftalık Satış Grafiği</h2>
                    <small>Son 7 gün</small>
                  </div>
                  <div className="haftalik-grafik-kapsayici">
                    <div className="satis-olcek">
                      {[haftalikSatisGrafikUstSinir, haftalikSatisGrafikUstSinir * 0.75, haftalikSatisGrafikUstSinir * 0.5, haftalikSatisGrafikUstSinir * 0.25, 0].map((deger) => (
                        <span key={deger} className="satis-olcek-etiketi">
                          {deger === 0 ? '0' : `₺${Math.round(deger / 1000)}B`}
                        </span>
                      ))}
                    </div>
                    <div className="satis-grafik">
                      {[1, 0.75, 0.5, 0.25, 0].map((cizgi) => (
                        <div key={cizgi} className="yatay-cizgi" style={{ bottom: `${cizgi * 100}%` }} />
                      ))}
                      {haftalikSatisVerisi.map((gun) => (
                        <div key={gun.etiket} className="bar-wrap">
                          <div className="bar-katman">
                            <div className="bar-ust" style={{ height: `${gun.ustOran}%` }} />
                            <div className="bar-alt" style={{ height: `${gun.altOran}%` }} />
                          </div>
                          <span className="bar-nokta" />
                          <span className="bar-etiket">
                            <span className="bar-etiket-tam">{gun.etiket}</span>
                            <span className="bar-etiket-kisa">{gunEtiketiKisalt(gun.etiket)}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mobil-gun-etiketleri" aria-hidden="true">
                      {haftalikSatisVerisi.map((gun) => (
                        <span key={`mobil-gun-${gun.etiket}`}>{gunEtiketiKisalt(gun.etiket)}</span>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="panel-kart">
                  <div className="panel-baslik">
                    <h2>En Çok Satılan Ürünler</h2>
                    <small>Aylık</small>
                  </div>
                  <ul className="dashboard-liste grafikli-liste">
                    {enCokSatilanUrunler.map((urun) => {
                      const maksimum = Math.max(...enCokSatilanUrunler.map((item) => item.miktar), 1)
                      const oran = Math.max((urun.miktar / maksimum) * 100, 8)
                      return (
                        <li key={urun.ad}>
                          <div className="urun-grafik-satiri">
                            <div className="urun-grafik-ust">
                              <span>{urun.ad}</span>
                              <strong>{urun.miktar} adet</strong>
                            </div>
                            <div className="urun-grafik-zemin">
                              <div className="urun-grafik-dolgu" style={{ width: `${oran}%` }} />
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </article>
              </>
            )}

            {gorunenDashboardBolumleri.kritik && (
              <article className="panel-kart kritik-stok-paneli">
                <div className="panel-baslik">
                  <h2>Kritik Stok Uyarısı</h2>
                  <small>{dashboardCanliOzetler.kritikStokAdedi} ürün eşik altında</small>
                </div>

                <div className="kritik-stok-ozet">
                  <strong>{dashboardCanliOzetler.kritikStokAdedi}</strong>
                  <span>Minimum stok değerinin altına düşen ürünler</span>
                </div>

                <div className="kritik-stok-liste">
                  {dashboardCanliOzetler.kritikStokluUrunler.slice(0, 4).map((urun) => (
                    <article key={`kritik-${urun.uid}`} className="kritik-stok-karti">
                      <div className="kritik-stok-baslik">
                        <strong className="urun-ad-satiri">
                          <span>{urun.ad}</span>
                          <span className="kritik-stok-rozet" data-tooltip="Bu ürün kritik stok değerinin altındadır.">
                            !
                          </span>
                        </strong>
                        <span>{urun.urunId}</span>
                      </div>
                      <div className="kritik-stok-detay">
                        <span>Minimum stok: <strong>{urun.minimumStok}</strong></span>
                        <span>Mevcut: <strong>{urun.magazaStok}</strong></span>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            )}
          </section>
        )}

        {gorunenDashboardBolumleri.yakin && (
          <article className="panel-kart">
            <div className="panel-baslik">
              <h2>Yakın Zamanda Satılan Ürünler</h2>
              <small>Şehir içi siparişler</small>
            </div>
            <div className="tablo-sarmal masaustu-tablo">
              <table>
                <thead>
                  <tr>
                    <th>Sipariş No</th>
                    <th>Ürün</th>
                    <th>Müşteri</th>
                    <th>Teslimat</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardYakinSatislar.map((satis) => (
                    <tr key={satis.siparis}>
                      <td>{satis.siparis}</td>
                      <td>{satis.urun}</td>
                      <td>{satis.musteri}</td>
                      <td>{satis.teslimat}</td>
                      <td>{satis.tutar}</td>
                      <td><span className={`durum-baloncuk ${durumSinifi(satis.durum)}`}>{satis.durum}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        )}

        {gorunenDashboardBolumleri.altGrafikler && (
          <section className="dashboard-alt-grafikler">
            <article className="panel-kart grafik-kart">
              <div className="panel-baslik">
                <h2>Harcanan Tutar ve Elde Edilen Gelir</h2>
                <small>Son 6 ay</small>
              </div>
              <svg viewBox="0 0 320 130" className="cizgi-grafik" aria-label="Gelir ve gider grafiği">
                <line x1="10" y1="100" x2="310" y2="100" />
                <polyline points={cizgiNoktalari(aylikGelirSerisi, gelirGiderGrafikUstSinir)} className="mavi-cizgi" />
                <polyline points={cizgiNoktalari(aylikGiderSerisi, gelirGiderGrafikUstSinir)} className="kirmizi-cizgi" />
              </svg>
              <div className="grafik-etiketleri">
                {altGrafikAyEtiketleri.map((ay) => <span key={ay}>{ay}</span>)}
              </div>
              <div className="grafik-lejant">
                <span><i className="lejant-kutu mavi" /> Toplam Gelir</span>
                <span><i className="lejant-kutu kirmizi" /> Toplam Gider</span>
              </div>
            </article>

            <article className="panel-kart grafik-kart">
              <div className="panel-baslik">
                <h2>Aylara Göre Satılan Toplam Ürün</h2>
                <small>Adet bazlı</small>
              </div>
              <svg viewBox="0 0 320 130" className="cizgi-grafik" aria-label="Aylık satılan ürün grafiği">
                <line x1="10" y1="100" x2="310" y2="100" />
                <polyline points={cizgiNoktalari(aylikSatilanUrunSerisi)} className="kirmizi-cizgi" />
              </svg>
              <div className="grafik-etiketleri">
                {altGrafikAyEtiketleri.map((ay) => <span key={ay}>{ay}</span>)}
              </div>
              <div className="grafik-lejant"><span><i className="lejant-kutu kirmizi" /> Satılan Ürün (Adet)</span></div>
            </article>

            <article className="panel-kart grafik-kart">
              <div className="panel-baslik">
                <h2>Satılan Ürünlerin Sütun Grafiği</h2>
                <small>Aynı verinin sütun görünümü</small>
              </div>
              <div className="sutun-grafik" aria-label="Satılan ürünlerin sütun grafiği">
                {aylikSatilanUrunSerisi.map((deger, index) => (
                  <div key={`${altGrafikAyEtiketleri[index]}-${deger}`} className="sutun-ogesi">
                    <span className="sutun-deger">{deger}</span>
                    <div className="sutun" style={{ height: `${Math.max((deger / aylikSatilanUrunMaksimum) * 100, 8)}%` }} />
                    <small>{altGrafikAyEtiketleri[index]}</small>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </section>
    </>
  )
}
