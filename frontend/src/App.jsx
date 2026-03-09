import { useMemo, useState } from 'react'
import './App.css'

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'

const baslangicUrunleri = [
  { uid: 1, urunId: 'FRN-1001', ad: 'Fren Balatasi On Takim', avatar: 'FB', urunAdedi: 84, magazaStok: 126, favori: false },
  { uid: 2, urunId: 'YGF-1002', ad: 'Yag Filtresi', avatar: 'YF', urunAdedi: 145, magazaStok: 210, favori: false },
  { uid: 3, urunId: 'HVF-1003', ad: 'Hava Filtresi', avatar: 'HF', urunAdedi: 112, magazaStok: 168, favori: false },
  { uid: 4, urunId: 'BUJ-1004', ad: 'Buji Takimi', avatar: 'BT', urunAdedi: 63, magazaStok: 95, favori: false },
  { uid: 5, urunId: 'AMR-1005', ad: 'Amortisor On Cift', avatar: 'AM', urunAdedi: 29, magazaStok: 44, favori: false },
  { uid: 6, urunId: 'DBR-1006', ad: 'Debriyaj Seti', avatar: 'DS', urunAdedi: 38, magazaStok: 57, favori: false },
  { uid: 7, urunId: 'AKU-1007', ad: 'Aku 72Ah', avatar: 'AK', urunAdedi: 21, magazaStok: 35, favori: false },
  { uid: 8, urunId: 'TRM-1008', ad: 'Triger Kayisi Seti', avatar: 'TK', urunAdedi: 52, magazaStok: 73, favori: false },
]

const dashboardOzet = [
  { baslik: 'Toplam Gelir', deger: '₺512.400', degisim: '+%11', ikon: '₺' },
  { baslik: 'Acil Siparis', deger: '17', degisim: '-%6', ikon: '◻' },
  { baslik: 'Toplam Siparis', deger: '1865', degisim: '+%12', ikon: '▣' },
  { baslik: 'Ortalama Teslimat', deger: '2,6 Gun', degisim: '+%8', ikon: '◷' },
]

const haftalikSatis = [56, 42, 31, 49, 68, 61, 37]

const sonSatislar = [
  { siparis: '#SP-2121', urun: 'Fren Balatasi On Takim', musteri: 'Yildiz Oto', teslimat: '2 is gunu', tutar: '₺8.400', durum: 'Yolda' },
  { siparis: '#SP-2120', urun: 'Debriyaj Seti', musteri: 'Mert Motor', teslimat: '1 is gunu', tutar: '₺6.150', durum: 'Teslim Edildi' },
  { siparis: '#SP-2119', urun: 'Yag Filtresi', musteri: 'Hizli Servis', teslimat: '3 is gunu', tutar: '₺1.760', durum: 'Hazirlaniyor' },
  { siparis: '#SP-2118', urun: 'Triger Kayisi Seti', musteri: 'Tekin Otomotiv', teslimat: '2 is gunu', tutar: '₺3.980', durum: 'Yolda' },
]

const aylar = ['May', 'Haz', 'Tem', 'Agu', 'Eyl', 'Eki']
const gelirSerisi = [92000, 108000, 104000, 121000, 129000, 137000]
const giderSerisi = [76000, 82000, 79000, 96000, 102000, 101000]
const aylikSatilanUrun = [360, 245, 278, 332, 406, 452]

const cizgiNoktalari = (degerler, maksimumDeger) => {
  const maxDeger = maksimumDeger || Math.max(...degerler, 1)
  const xAlan = 300
  const yAlan = 90

  return degerler
    .map((deger, index) => {
      const x = 10 + (index * xAlan) / Math.max(degerler.length - 1, 1)
      const y = 10 + yAlan - (deger / maxDeger) * yAlan
      return `${x},${y}`
    })
    .join(' ')
}

const durumSinifi = (durum) => {
  if (durum === 'Yolda') return 'durum-yolda'
  if (durum === 'Hazirlaniyor') return 'durum-hazirlaniyor'
  if (durum === 'Teslim Edildi') return 'durum-teslim'
  return ''
}

const bosForm = {
  urunId: '',
  ad: '',
  urunAdedi: '',
  magazaStok: '',
}

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const [aktifSayfa, setAktifSayfa] = useState('dashboard')

  const [urunler, setUrunler] = useState(baslangicUrunleri)
  const [aramaMetni, setAramaMetni] = useState('')

  const [eklemeAcik, setEklemeAcik] = useState(false)
  const [duzenlemeAcik, setDuzenlemeAcik] = useState(false)
  const [silinecekUrun, setSilinecekUrun] = useState(null)

  const [seciliUid, setSeciliUid] = useState(null)
  const [form, setForm] = useState(bosForm)

  const filtreliUrunler = useMemo(() => {
    const metin = aramaMetni.trim().toLowerCase()
    if (!metin) return urunler

    return urunler.filter((urun) => {
      return urun.ad.toLowerCase().includes(metin) || urun.urunId.toLowerCase().includes(metin)
    })
  }, [aramaMetni, urunler])

  const handleLogin = (event) => {
    event.preventDefault()

    if (username.trim() === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      setIsLoggedIn(true)
      setError('')
      return
    }

    setError('Kullanici adi veya sifre hatali.')
  }

  const sayfaDegistir = (sayfa) => {
    setAktifSayfa(sayfa)
    setEklemeAcik(false)
    setDuzenlemeAcik(false)
    setSilinecekUrun(null)
  }

  const formGuncelle = (alan, deger) => {
    setForm((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const formuTemizle = () => {
    setForm(bosForm)
    setSeciliUid(null)
  }

  const eklemePenceresiniAc = () => {
    formuTemizle()
    setEklemeAcik(true)
  }

  const duzenlemePenceresiniAc = (urun) => {
    setSeciliUid(urun.uid)
    setForm({
      urunId: urun.urunId,
      ad: urun.ad,
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
    })
    setDuzenlemeAcik(true)
  }

  const formKaydet = (mod) => {
    const urunId = form.urunId.trim()
    const ad = form.ad.trim()
    const urunAdedi = Number(form.urunAdedi)
    const magazaStok = Number(form.magazaStok)

    if (!urunId || !ad || Number.isNaN(urunAdedi) || Number.isNaN(magazaStok)) return

    if (mod === 'ekle') {
      const yeniUrun = {
        uid: Date.now(),
        urunId,
        ad,
        avatar: ad
          .split(' ')
          .slice(0, 2)
          .map((parca) => parca[0]?.toUpperCase() || '')
          .join('')
          .slice(0, 2),
        urunAdedi,
        magazaStok,
        favori: false,
      }

      setUrunler((onceki) => [yeniUrun, ...onceki])
      setEklemeAcik(false)
      formuTemizle()
      return
    }

    setUrunler((onceki) =>
      onceki.map((urun) => {
        if (urun.uid !== seciliUid) return urun
        return {
          ...urun,
          urunId,
          ad,
          urunAdedi,
          magazaStok,
          avatar: ad
            .split(' ')
            .slice(0, 2)
            .map((parca) => parca[0]?.toUpperCase() || '')
            .join('')
            .slice(0, 2),
        }
      }),
    )

    setDuzenlemeAcik(false)
    formuTemizle()
  }

  const urunSil = () => {
    if (!silinecekUrun) return
    setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinecekUrun.uid))
    setSilinecekUrun(null)
  }

  const favoriDegistir = (uid) => {
    setUrunler((onceki) =>
      onceki.map((urun) => (urun.uid === uid ? { ...urun, favori: !urun.favori } : urun)),
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="login-page">
        <section className="login-shell" aria-label="Giris Ekrani">
          <div className="panel left-panel">
            <h1>Giris Yap</h1>
            <p className="subtitle">Envanter paneline erismek icin bilgilerinizi girin.</p>

            <form onSubmit={handleLogin} className="login-form">
              <label htmlFor="username">Kullanici adi</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Kullanici adinizi girin"
                autoComplete="username"
              />

              <label htmlFor="password">Sifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sifrenizi girin"
                autoComplete="current-password"
              />

              <button type="submit">Giris yap</button>
            </form>

            {error && <p className="message error">{error}</p>}
          </div>

          <div className="panel right-panel" aria-hidden="true">
            <div className="visual-wrap">
              <div className="chart-card">
                <div className="chart-header">
                  <span>Analiz</span>
                  <small>Haftalik</small>
                </div>
                <div className="chart-lines">
                  <span className="line one" />
                  <span className="line two" />
                  <span className="line three" />
                </div>
              </div>

              <div className="stats-card">
                <div className="donut" />
                <p>Toplam</p>
                <strong>%42</strong>
              </div>
            </div>

            <h2>Stok yonetimini sadelestirin</h2>
            <p>Sanayi parcalarini tek ekrandan yonetin, stok seviyelerini hizli takip edin.</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <aside className="yan-menu">
          <h2>Menu</h2>
          <nav>
            <button
              type="button"
              className={`menu-link ${aktifSayfa === 'dashboard' ? 'aktif' : ''}`}
              onClick={() => sayfaDegistir('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`menu-link ${aktifSayfa === 'envanter' ? 'aktif' : ''}`}
              onClick={() => sayfaDegistir('envanter')}
            >
              Envanter
            </button>
            <button type="button" className="menu-link pasif">Siparisler</button>
            <button type="button" className="menu-link pasif">Kayitli Musteriler</button>
            <button type="button" className="menu-link pasif">Kayitli Alicilar</button>
            <button type="button" className="menu-link pasif">Nakit Akisi</button>
            <button type="button" className="menu-link pasif">Urun Duzenleme</button>
            <button type="button" className="menu-link pasif">Faturalama (PDF)</button>
          </nav>
        </aside>

        <div className="icerik-alani">
          {aktifSayfa === 'dashboard' && (
            <section>
              <header className="ust-baslik envanter-baslik">
                <div>
                  <h1>Dashboard</h1>
                  <p>Genel stok ve siparis ozeti</p>
                </div>
                <button type="button" onClick={() => sayfaDegistir('envanter')}>
                  Envantere Git
                </button>
              </header>

              <div className="ozet-grid">
                {dashboardOzet.map((kart) => (
                  <article key={kart.baslik} className="ozet-kartcik">
                    <div className="ozet-ust">
                      <span className="ozet-ikon">{kart.ikon}</span>
                      <button type="button" className="ozet-menu" aria-label="Kart Menusu">
                        ⋮
                      </button>
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

              <section className="dashboard-orta-grid">
                <article className="panel-kart">
                  <div className="panel-baslik">
                    <h2>Haftalik Satis Grafigi</h2>
                    <small>Son 7 gun</small>
                  </div>
                  <div className="satis-grafik">
                    {haftalikSatis.map((oran, index) => (
                      <div key={index} className="bar-wrap">
                        <div className="bar" style={{ height: `${oran}%` }} />
                        <span>{['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'][index]}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel-kart">
                  <div className="panel-baslik">
                    <h2>En Cok Satilan Urunler</h2>
                    <small>Aylik</small>
                  </div>
                  <ul className="dashboard-liste grafikli-liste">
                    {urunler.slice(0, 6).map((urun) => {
                      const maksimum = Math.max(...urunler.map((u) => u.urunAdedi), 1)
                      const oran = Math.max((urun.urunAdedi / maksimum) * 100, 8)
                      return (
                      <li key={urun.uid}>
                        <div className="urun-grafik-satiri">
                          <div className="urun-grafik-ust">
                            <span>{urun.ad}</span>
                            <strong>{urun.urunAdedi} adet</strong>
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
              </section>

              <article className="panel-kart">
                <div className="panel-baslik">
                  <h2>Yakin Zamanda Satilan Urunler</h2>
                  <small>Sehir ici siparisler</small>
                </div>
                <div className="tablo-sarmal">
                  <table>
                    <thead>
                      <tr>
                        <th>Siparis No</th>
                        <th>Urun</th>
                        <th>Musteri</th>
                        <th>Teslimat</th>
                        <th>Tutar</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sonSatislar.map((satis) => (
                        <tr key={satis.siparis}>
                          <td>{satis.siparis}</td>
                          <td>{satis.urun}</td>
                          <td>{satis.musteri}</td>
                          <td>{satis.teslimat}</td>
                          <td>{satis.tutar}</td>
                          <td>
                            <span className={`durum-baloncuk ${durumSinifi(satis.durum)}`}>{satis.durum}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <section className="dashboard-alt-grafikler">
                <article className="panel-kart grafik-kart">
                  <div className="panel-baslik">
                    <h2>Harcanan Tutar ve Elde Edilen Gelir</h2>
                    <small>Son 6 ay</small>
                  </div>
                  <svg viewBox="0 0 320 130" className="cizgi-grafik" aria-label="Gelir ve gider grafigi">
                    <line x1="10" y1="100" x2="310" y2="100" />
                    <polyline points={cizgiNoktalari(gelirSerisi)} className="mavi-cizgi" />
                    <polyline points={cizgiNoktalari(giderSerisi)} className="kirmizi-cizgi" />
                  </svg>
                  <div className="grafik-etiketleri">
                    {aylar.map((ay) => (
                      <span key={ay}>{ay}</span>
                    ))}
                  </div>
                  <div className="grafik-lejant">
                    <span><i className="lejant-kutu mavi" /> Toplam Gelir</span>
                    <span><i className="lejant-kutu kirmizi" /> Toplam Gider</span>
                  </div>
                </article>

                <article className="panel-kart grafik-kart">
                  <div className="panel-baslik">
                    <h2>Aylara Gore Satilan Toplam Urun</h2>
                    <small>Adet bazli</small>
                  </div>
                  <svg viewBox="0 0 320 130" className="cizgi-grafik" aria-label="Aylik satilan urun grafigi">
                    <line x1="10" y1="100" x2="310" y2="100" />
                    <polyline points={cizgiNoktalari(aylikSatilanUrun)} className="kirmizi-cizgi" />
                  </svg>
                  <div className="grafik-etiketleri">
                    {aylar.map((ay) => (
                      <span key={ay}>{ay}</span>
                    ))}
                  </div>
                  <div className="grafik-lejant">
                    <span><i className="lejant-kutu kirmizi" /> Satilan Urun (Adet)</span>
                  </div>
                </article>

                <article className="panel-kart grafik-kart">
                  <div className="panel-baslik">
                    <h2>Satilan Urunlerin Sutun Grafigi</h2>
                    <small>Ayni verinin sutun gorunumu</small>
                  </div>
                  <div className="sutun-grafik" aria-label="Satilan urunlerin sutun grafigi">
                    {aylikSatilanUrun.map((deger, index) => (
                      <div key={`${aylar[index]}-${deger}`} className="sutun-ogesi">
                        <span className="sutun-deger">{deger}</span>
                        <div
                          className="sutun"
                          style={{ height: `${Math.max((deger / Math.max(...aylikSatilanUrun)) * 100, 8)}%` }}
                        />
                        <small>{aylar[index]}</small>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </section>
          )}

          {aktifSayfa === 'envanter' && (
            <section>
              <header className="ust-baslik envanter-baslik">
                <div>
                  <h1>Envanter</h1>
                  <p>Magaza: Merkez Sube</p>
                </div>
                <button type="button" className="urun-ekle-karti" onClick={eklemePenceresiniAc}>
                  <span className="urun-ekle-ikon" aria-hidden="true">
                    🛍
                  </span>
                  <span className="urun-ekle-metin">Yeni Urun</span>
                </button>
              </header>

              <section className="panel-kart envanter-kart">
                <div className="panel-ust-cizgi">
                  <h2>Parca Listesi</h2>
                  <input
                    type="text"
                    placeholder="Urun veya ID ara"
                    value={aramaMetni}
                    onChange={(event) => setAramaMetni(event.target.value)}
                  />
                </div>

                <div className="tablo-sarmal">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Urun</th>
                        <th>Urun ID</th>
                        <th>Urun Adedi</th>
                        <th>Magaza Stok</th>
                        <th>Islem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtreliUrunler.map((urun, index) => (
                        <tr key={urun.uid}>
                          <td>{String(index + 1).padStart(2, '0')}</td>
                          <td>
                            <div className="urun-hucre">
                              <span className="urun-avatar">{urun.avatar}</span>
                              <strong>{urun.ad}</strong>
                            </div>
                          </td>
                          <td>{urun.urunId}</td>
                          <td>{urun.urunAdedi}</td>
                          <td>{urun.magazaStok}</td>
                          <td>
                            <div className="islem-dugmeleri">
                              <button
                                type="button"
                                className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`}
                                title="Favori"
                                onClick={() => favoriDegistir(urun.uid)}
                              >
                                ★
                              </button>
                              <button
                                type="button"
                                className="ikon-dugme duzenle"
                                title="Duzenle"
                                onClick={() => duzenlemePenceresiniAc(urun)}
                              >
                                ✎
                              </button>
                              <button
                                type="button"
                                className="ikon-dugme sil"
                                title="Sil"
                                onClick={() => setSilinecekUrun(urun)}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          )}
        </div>
      </section>

      {eklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Urun Ekle</h3>
            <div className="modal-form">
              <label>Urun Ismi</label>
              <input value={form.ad} onChange={(event) => formGuncelle('ad', event.target.value)} />

              <label>Urun ID</label>
              <input value={form.urunId} onChange={(event) => formGuncelle('urunId', event.target.value)} />

              <label>Urun Adedi</label>
              <input type="number" value={form.urunAdedi} onChange={(event) => formGuncelle('urunAdedi', event.target.value)} />

              <label>Magazadaki Urun Sayisi</label>
              <input
                type="number"
                value={form.magazaStok}
                onChange={(event) => formGuncelle('magazaStok', event.target.value)}
              />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setEklemeAcik(false)}>Iptal</button>
              <button type="button" onClick={() => formKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {duzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Urunu Duzenle</h3>
            <div className="modal-form">
              <label>Urun Ismi</label>
              <input value={form.ad} onChange={(event) => formGuncelle('ad', event.target.value)} />

              <label>Urun ID</label>
              <input value={form.urunId} onChange={(event) => formGuncelle('urunId', event.target.value)} />

              <label>Urun Adedi</label>
              <input type="number" value={form.urunAdedi} onChange={(event) => formGuncelle('urunAdedi', event.target.value)} />

              <label>Magazadaki Urun Sayisi</label>
              <input
                type="number"
                value={form.magazaStok}
                onChange={(event) => formGuncelle('magazaStok', event.target.value)}
              />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setDuzenlemeAcik(false)}>Iptal</button>
              <button type="button" onClick={() => formKaydet('duzenle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekUrun && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediginizden emin misiniz?</h3>
            <p><strong>{silinecekUrun.ad}</strong> envanterden kaldirilacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekUrun(null)}>Hayir</button>
              <button type="button" className="tehlike" onClick={urunSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
