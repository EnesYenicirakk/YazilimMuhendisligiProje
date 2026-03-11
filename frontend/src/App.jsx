import { useEffect, useMemo, useState } from 'react'
import './App.css'

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'
const SAYFA_BASINA_URUN = 8

const baslangicUrunleri = [
  { uid: 1, urunId: 'FRN-1001', ad: 'Fren Balatasi On Takim', avatar: 'FB', urunAdedi: 84, magazaStok: 126, favori: false },
  { uid: 2, urunId: 'YGF-1002', ad: 'Yag Filtresi', avatar: 'YF', urunAdedi: 145, magazaStok: 210, favori: false },
  { uid: 3, urunId: 'HVF-1003', ad: 'Hava Filtresi', avatar: 'HF', urunAdedi: 112, magazaStok: 168, favori: false },
  { uid: 4, urunId: 'BUJ-1004', ad: 'Buji Takimi', avatar: 'BT', urunAdedi: 63, magazaStok: 95, favori: false },
  { uid: 5, urunId: 'AMR-1005', ad: 'Amortisor On Cift', avatar: 'AM', urunAdedi: 29, magazaStok: 44, favori: false },
  { uid: 6, urunId: 'DBR-1006', ad: 'Debriyaj Seti', avatar: 'DS', urunAdedi: 38, magazaStok: 57, favori: false },
  { uid: 7, urunId: 'AKU-1007', ad: 'Aku 72Ah', avatar: 'AK', urunAdedi: 21, magazaStok: 35, favori: false },
  { uid: 8, urunId: 'TRM-1008', ad: 'Triger Kayisi Seti', avatar: 'TK', urunAdedi: 52, magazaStok: 73, favori: false },
  { uid: 9, urunId: 'RAD-1009', ad: 'Radyator Ust Hortum', avatar: 'RH', urunAdedi: 46, magazaStok: 70, favori: false },
  { uid: 10, urunId: 'BLC-1010', ad: 'Balata Spreyi', avatar: 'BS', urunAdedi: 76, magazaStok: 120, favori: false },
  { uid: 11, urunId: 'KLR-1011', ad: 'Klima Kompresoru', avatar: 'KK', urunAdedi: 18, magazaStok: 27, favori: false },
  { uid: 12, urunId: 'MTR-1012', ad: 'Motor Takozu', avatar: 'MT', urunAdedi: 41, magazaStok: 62, favori: false },
  { uid: 13, urunId: 'SRS-1013', ad: 'Sarz Dinamosu', avatar: 'SD', urunAdedi: 24, magazaStok: 36, favori: false },
  { uid: 14, urunId: 'DST-1014', ad: 'Direksiyon Kutusu', avatar: 'DK', urunAdedi: 12, magazaStok: 19, favori: false },
  { uid: 15, urunId: 'EKS-1015', ad: 'Eksantrik Sensoru', avatar: 'ES', urunAdedi: 58, magazaStok: 88, favori: false },
  { uid: 16, urunId: 'ENJ-1016', ad: 'Enjektor Takimi', avatar: 'ET', urunAdedi: 35, magazaStok: 51, favori: false },
  { uid: 17, urunId: 'ROL-1017', ad: 'Rolanti Motoru', avatar: 'RM', urunAdedi: 33, magazaStok: 47, favori: false },
  { uid: 18, urunId: 'YGR-1018', ad: 'Yag Radyatoru', avatar: 'YR', urunAdedi: 17, magazaStok: 24, favori: false },
  { uid: 19, urunId: 'KRN-1019', ad: 'Krank Kasnagi', avatar: 'KK', urunAdedi: 27, magazaStok: 39, favori: false },
  { uid: 20, urunId: 'TRB-1020', ad: 'Turbo Hortumu', avatar: 'TH', urunAdedi: 22, magazaStok: 31, favori: false },
  { uid: 21, urunId: 'ABS-1021', ad: 'ABS Sensoru', avatar: 'AS', urunAdedi: 49, magazaStok: 74, favori: false },
  { uid: 22, urunId: 'SUS-1022', ad: 'Susturucu Arka', avatar: 'SA', urunAdedi: 14, magazaStok: 20, favori: false },
  { uid: 23, urunId: 'BIL-1023', ad: 'Bijon Somunu Seti', avatar: 'BS', urunAdedi: 90, magazaStok: 140, favori: false },
  { uid: 24, urunId: 'FAR-1024', ad: 'Far Ampulu H7', avatar: 'FA', urunAdedi: 110, magazaStok: 165, favori: false },
]

const dashboardOzet = [
  { baslik: 'Toplam Gelir', deger: '₺512.400', degisim: '+%11', ikon: '₺' },
  { baslik: 'Acil Siparis', deger: '17', degisim: '-%6', ikon: '◻' },
  { baslik: 'Toplam Siparis', deger: '1865', degisim: '+%12', ikon: '▣' },
  { baslik: 'Ortalama Teslimat', deger: '2,6 Gun', degisim: '+%8', ikon: '◷' },
]

const haftalikSatis = [56, 42, 31, 49, 68, 61, 37]

const baslangicSiparisleri = [
  { siparisNo: '#SP-2134', musteri: 'Yildiz Oto', urun: 'Fren Balatasi On Takim', toplamTutar: 8400, siparisTarihi: '2026-03-10', odemeDurumu: 'Odendi', urunHazirlik: 'Toplandi', teslimatDurumu: 'Yolda', teslimatSuresi: '2 is gunu' },
  { siparisNo: '#SP-2133', musteri: 'Tekin Otomotiv', urun: 'Amortisor On Cift', toplamTutar: 9250, siparisTarihi: '2026-03-09', odemeDurumu: 'Odendi', urunHazirlik: 'Toplandi', teslimatDurumu: 'Hazirlaniyor', teslimatSuresi: '3 is gunu' },
  { siparisNo: '#SP-2132', musteri: 'Mert Motor', urun: 'Debriyaj Seti', toplamTutar: 6150, siparisTarihi: '2026-03-08', odemeDurumu: 'Odendi', urunHazirlik: 'Toplandi', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 is gunu' },
  { siparisNo: '#SP-2131', musteri: 'Hizli Servis', urun: 'Yag Filtresi', toplamTutar: 1760, siparisTarihi: '2026-03-07', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazirlaniyor', teslimatDurumu: 'Yolda', teslimatSuresi: '2 is gunu' },
  { siparisNo: '#SP-2130', musteri: 'Akin Oto', urun: 'Triger Kayisi Seti', toplamTutar: 3980, siparisTarihi: '2026-03-06', odemeDurumu: 'Odendi', urunHazirlik: 'Toplandi', teslimatDurumu: 'Hazirlaniyor', teslimatSuresi: '2 is gunu' },
  { siparisNo: '#SP-2129', musteri: 'Bora Yedek Parca', urun: 'Aku 72Ah', toplamTutar: 11200, siparisTarihi: '2026-03-05', odemeDurumu: 'Beklemede', urunHazirlik: 'Tedarik Bekleniyor', teslimatDurumu: 'Hazirlaniyor', teslimatSuresi: '4 is gunu' },
  { siparisNo: '#SP-2128', musteri: 'Demir Oto', urun: 'Radyator Ust Hortum', toplamTutar: 2350, siparisTarihi: '2026-03-04', odemeDurumu: 'Odendi', urunHazirlik: 'Toplandi', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 is gunu' },
  { siparisNo: '#SP-2127', musteri: 'Asil Sanayi', urun: 'Klima Kompresoru', toplamTutar: 18750, siparisTarihi: '2026-03-03', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazirlaniyor', teslimatDurumu: 'Yolda', teslimatSuresi: '3 is gunu' },
  { siparisNo: '#SP-2126', musteri: 'Nehir Otomotiv', urun: 'ABS Sensoru', toplamTutar: 3270, siparisTarihi: '2026-03-02', odemeDurumu: 'Odendi', urunHazirlik: 'Toplandi', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 is gunu' },
  { siparisNo: '#SP-2125', musteri: 'Kaya Oto Servis', urun: 'Turbo Hortumu', toplamTutar: 2860, siparisTarihi: '2026-03-01', odemeDurumu: 'Beklemede', urunHazirlik: 'Tedarik Bekleniyor', teslimatDurumu: 'Hazirlaniyor', teslimatSuresi: '5 is gunu' },
  { siparisNo: '#SP-2124', musteri: 'Yaman Yedek', urun: 'Far Ampulu H7', toplamTutar: 980, siparisTarihi: '2026-02-28', odemeDurumu: 'Odendi', urunHazirlik: 'Toplandi', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 is gunu' },
  { siparisNo: '#SP-2123', musteri: 'Gurkan Oto', urun: 'Direksiyon Kutusu', toplamTutar: 15600, siparisTarihi: '2026-02-27', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazirlaniyor', teslimatDurumu: 'Yolda', teslimatSuresi: '3 is gunu' },
]

const tarihFormatla = (isoTarih) => {
  const tarih = new Date(isoTarih)
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tarih)
}

const paraFormatla = (deger) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(deger)
}

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
  const [siparisler] = useState(baslangicSiparisleri)
  const [siparisArama, setSiparisArama] = useState('')
  const [siparisOdemeFiltresi, setSiparisOdemeFiltresi] = useState('Tum Siparisler')
  const [aramaMetni, setAramaMetni] = useState('')
  const [envanterSayfa, setEnvanterSayfa] = useState(1)

  const [eklemeAcik, setEklemeAcik] = useState(false)
  const [duzenlemeAcik, setDuzenlemeAcik] = useState(false)
  const [silinecekUrun, setSilinecekUrun] = useState(null)

  const [seciliUid, setSeciliUid] = useState(null)
  const [form, setForm] = useState(bosForm)

  const filtreliUrunler = useMemo(() => {
    const metin = aramaMetni.trim().toLowerCase()
    if (!metin) return urunler

    return urunler.filter((urun) => urun.ad.toLowerCase().includes(metin) || urun.urunId.toLowerCase().includes(metin))
  }, [aramaMetni, urunler])

  const toplamEnvanterSayfa = Math.max(1, Math.ceil(filtreliUrunler.length / SAYFA_BASINA_URUN))
  const sayfaBaslangic = (envanterSayfa - 1) * SAYFA_BASINA_URUN
  const sayfadakiUrunler = filtreliUrunler.slice(sayfaBaslangic, sayfaBaslangic + SAYFA_BASINA_URUN)

  const siraliSiparisler = useMemo(() => {
    return [...siparisler].sort((a, b) => new Date(b.siparisTarihi).getTime() - new Date(a.siparisTarihi).getTime())
  }, [siparisler])

  const filtreliSiparisler = useMemo(() => {
    const arama = siparisArama.trim().toLowerCase()
    return siraliSiparisler.filter((siparis) => {
      const filtreUygun = siparisOdemeFiltresi === 'Tum Siparisler' || siparis.odemeDurumu === siparisOdemeFiltresi
      if (!filtreUygun) return false
      if (!arama) return true
      return (
        siparis.siparisNo.toLowerCase().includes(arama) ||
        siparis.musteri.toLowerCase().includes(arama) ||
        siparis.urun.toLowerCase().includes(arama)
      )
    })
  }, [siparisArama, siparisOdemeFiltresi, siraliSiparisler])

  const dashboardYakinSatislar = useMemo(() => {
    return siraliSiparisler.slice(0, 4).map((siparis) => ({
      siparis: siparis.siparisNo,
      urun: siparis.urun,
      musteri: siparis.musteri,
      teslimat: siparis.teslimatSuresi,
      tutar: paraFormatla(siparis.toplamTutar),
      durum: siparis.teslimatDurumu,
    }))
  }, [siraliSiparisler])

  useEffect(() => {
    if (envanterSayfa > toplamEnvanterSayfa) {
      setEnvanterSayfa(toplamEnvanterSayfa)
    }
  }, [envanterSayfa, toplamEnvanterSayfa])

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
    if (sayfa === 'envanter') setEnvanterSayfa(1)
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
        avatar: ad.split(' ').slice(0, 2).map((parca) => parca[0]?.toUpperCase() || '').join('').slice(0, 2),
        urunAdedi,
        magazaStok,
        favori: false,
      }

      setUrunler((onceki) => [yeniUrun, ...onceki])
      setEklemeAcik(false)
      formuTemizle()
      setEnvanterSayfa(1)
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
          avatar: ad.split(' ').slice(0, 2).map((parca) => parca[0]?.toUpperCase() || '').join('').slice(0, 2),
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
    setUrunler((onceki) => onceki.map((urun) => (urun.uid === uid ? { ...urun, favori: !urun.favori } : urun)))
  }

  const envanterSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamEnvanterSayfa) return
    setEnvanterSayfa(sayfa)
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
            <button type="button" className={`menu-link ${aktifSayfa === 'dashboard' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('dashboard')}>
              Dashboard
            </button>
            <button type="button" className={`menu-link ${aktifSayfa === 'envanter' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('envanter')}>
              Envanter
            </button>
            <button type="button" className={`menu-link ${aktifSayfa === 'siparisler' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('siparisler')}>
              Siparisler
            </button>
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
                      <button type="button" className="ozet-menu" aria-label="Kart Menusu">⋮</button>
                    </div>
                    <p>{kart.baslik}</p>
                    <div className="ozet-alt">
                      <h3>{kart.deger}</h3>
                      <span className={`ozet-degisim ${kart.degisim.startsWith('+') ? 'pozitif' : 'negatif'}`}>{kart.degisim}</span>
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
                  <div className="grafik-etiketleri">{aylar.map((ay) => <span key={ay}>{ay}</span>)}</div>
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
                  <div className="grafik-etiketleri">{aylar.map((ay) => <span key={ay}>{ay}</span>)}</div>
                  <div className="grafik-lejant"><span><i className="lejant-kutu kirmizi" /> Satilan Urun (Adet)</span></div>
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
                        <div className="sutun" style={{ height: `${Math.max((deger / Math.max(...aylikSatilanUrun)) * 100, 8)}%` }} />
                        <small>{aylar[index]}</small>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </section>
          )}

          {aktifSayfa === 'siparisler' && (
            <section>
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Siparisler</h1>
                  <p>En yeni siparisten en eski siparise dogru listelenir.</p>
                </div>
                <button type="button" className="siparis-yeni-buton">Yeni Siparis</button>
              </header>

              <section className="panel-kart siparisler-kart">
                <div className="siparis-kontrol">
                  <input
                    type="text"
                    placeholder="Siparis no, musteri veya urun ara"
                    value={siparisArama}
                    onChange={(event) => setSiparisArama(event.target.value)}
                  />
                  <select value={siparisOdemeFiltresi} onChange={(event) => setSiparisOdemeFiltresi(event.target.value)}>
                    <option>Tum Siparisler</option>
                    <option>Odendi</option>
                    <option>Beklemede</option>
                  </select>
                </div>

                <div className="tablo-sarmal">
                  <table>
                    <thead>
                      <tr>
                        <th>Siparis No</th>
                        <th>Musteri Adi</th>
                        <th>Toplam Tutar</th>
                        <th>Siparis Tarihi</th>
                        <th>Odeme</th>
                        <th>Urun Hazirlik</th>
                        <th>Teslimat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtreliSiparisler.map((siparis) => (
                        <tr key={siparis.siparisNo}>
                          <td>{siparis.siparisNo}</td>
                          <td>{siparis.musteri}</td>
                          <td>{paraFormatla(siparis.toplamTutar)}</td>
                          <td>{tarihFormatla(siparis.siparisTarihi)}</td>
                          <td>
                            <span className={`odeme-durumu ${siparis.odemeDurumu === 'Odendi' ? 'odendi' : 'beklemede'}`}>
                              {siparis.odemeDurumu}
                            </span>
                          </td>
                          <td>{siparis.urunHazirlik}</td>
                          <td>
                            <span className={`durum-baloncuk ${durumSinifi(siparis.teslimatDurumu)}`}>{siparis.teslimatDurumu}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <span className="urun-ekle-ikon" aria-hidden="true">🛍</span>
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
                    onChange={(event) => {
                      setAramaMetni(event.target.value)
                      setEnvanterSayfa(1)
                    }}
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
                      {sayfadakiUrunler.map((urun, index) => (
                        <tr key={urun.uid}>
                          <td>{String(sayfaBaslangic + index + 1).padStart(2, '0')}</td>
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
                              <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}>★</button>
                              <button type="button" className="ikon-dugme duzenle" title="Duzenle" onClick={() => duzenlemePenceresiniAc(urun)}>✎</button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekUrun(urun)}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  <button
                    type="button"
                    className="sayfa-ok"
                    onClick={() => envanterSayfayaGit(envanterSayfa + 1)}
                    disabled={envanterSayfa === toplamEnvanterSayfa}
                  >
                    ›
                  </button>
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
              <input type="number" value={form.magazaStok} onChange={(event) => formGuncelle('magazaStok', event.target.value)} />
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
              <input type="number" value={form.magazaStok} onChange={(event) => formGuncelle('magazaStok', event.target.value)} />
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
