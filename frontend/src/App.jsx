import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import './App.css'
import BosDurumKarti from './components/common/BosDurumKarti'
import {
  KucukIkon,
  SayfaIkonu,
  baslangicGecmisSiparisleri,
  baslangicMusterileri,
  baslangicSiparisleri,
  baslangicTedarikcileri,
  gelenNakitKayitlari,
  gidenNakitKayitlari,
  siparisMusteriTelefonlari,
  stokDegisimLoglari,
  tarihFormatla,
} from './components/common/Ikonlar'
import MobilKart from './components/common/MobilKart'

const FaturalamaPanel = lazy(() => import('./FaturalamaPanel'))
const BildirimPaneli = lazy(() => import('./BildirimPaneli'))
const AiPanel = lazy(() => import('./AiPanel'))
const FaturaModallari = lazy(() => import('./FaturaModallari'))
const SiparislerPaneli = lazy(() => import('./features/siparisler/SiparislerPaneli'))
const MusterilerPaneli = lazy(() => import('./features/musteriler/MusterilerPaneli'))
const TedarikcilerPaneli = lazy(() => import('./features/tedarikciler/TedarikcilerPaneli'))

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'
const SAYFA_BASINA_URUN = 8
const ODEME_SAYFA_BASINA = 10
const MUSTERI_SAYFA_BASINA = 8
const TEDARIKCI_SAYFA_BASINA = 8
const SIPARIS_SAYFA_BASINA = 8
const STOK_LOG_SAYFA_BASINA = 8
const FATURA_KDV_ORANI = 0.2

import {
  envanterKategorileri,
  avatarOlustur,
  gunEtiketiKisalt,
  urunOlustur,
  baslangicUrunleri,
  dashboardOzetSablon,
  dashboardBolumSablonu,
  paraFormatla,
  aylar,
  gelirSerisi,
  giderSerisi,
  aylikSatilanUrun,
  cizgiNoktalari,
  durumSinifi,
  teslimatGununuCoz,
  telefonuNormalizeEt,
  telefonGecerliMi,
  negatifSayiVarMi,
  bosForm,
  bosUrunDuzenlemeFormu,
  bosMusteriFormu,
  bosTedarikciFormu,
  bosTedarikciSiparisFormu,
  bosSiparisFormu,
  bosFaturaSatiri,
  bosFaturaFormu,
  faturaToplamlariHesapla,
  faturaKaydiOlustur,
  baslangicFaturalari,
  merkezMenusu,
  aiHizliKonular,
  metniNormalizeEt,
  favorileriOneTasi,
  kritikStoktaMi,
  htmlGuvenliMetin,
  pdfGuvenliMetin,
  pdfSatirOlustur,
  faturaBelgeHtmlOlustur,
  faturaBelgeTamHtmlOlustur,
  pdfKutuphaneleriPromise,
  pdfKutuphaneleriniYukle
} from './shared/utils/constantsAndHelpers';

function TemaIkonu({ tema }) {
  if (tema === 'acik') {
    return (
      <span className="ai-tema-ikon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
        </svg>
      </span>
    )
  }

  return (
    <span className="ai-tema-ikon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 15.2A8.5 8.5 0 1 1 10.1 4a6.8 6.8 0 0 0 9.9 11.2z" />
      </svg>
    </span>
  )
}

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginGecisiAktif, setLoginGecisiAktif] = useState(false)
  const [error, setError] = useState('')

  const [aktifSayfa, setAktifSayfa] = useState('merkez')
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false)
  const [toastlar, setToastlar] = useState([])
  const [sonGeriAlma, setSonGeriAlma] = useState(null)
  const [gizlenenOzetKartlari, setGizlenenOzetKartlari] = useState([])
  const [acikOzetMenusu, setAcikOzetMenusu] = useState('')
  const [dashboardBolumMenusuAcik, setDashboardBolumMenusuAcik] = useState(false)
  const [gorunenDashboardBolumleri, setGorunenDashboardBolumleri] = useState(
    dashboardBolumSablonu.reduce((acc, bolum) => ({ ...acc, [bolum.anahtar]: true }), {}),
  )
  const [urunler, setUrunler] = useState(baslangicUrunleri)
  const [musteriler, setMusteriler] = useState(baslangicMusterileri)
  const [siparisler, setSiparisler] = useState(baslangicSiparisleri)
  const [gelenNakitListesi, setGelenNakitListesi] = useState(() => gelenNakitKayitlari.map((k) => ({ ...k, favori: false })))
  const [gidenNakitListesi, setGidenNakitListesi] = useState(() => gidenNakitKayitlari.map((k) => ({ ...k, favori: false })))
  const [siparisArama, setSiparisArama] = useState('')
  const [siparisOdemeFiltresi, setSiparisOdemeFiltresi] = useState('Tüm Siparişler')
  const [siparisSekmesi, setSiparisSekmesi] = useState('aktif')
  const [siparisSayfa, setSiparisSayfa] = useState(1)
  const [gecmisSiparisArama, setGecmisSiparisArama] = useState('')
  const [gecmisSiparisSayfa, setGecmisSiparisSayfa] = useState(1)
  const [yeniSiparisAcik, setYeniSiparisAcik] = useState(false)
  const [detaySiparis, setDetaySiparis] = useState(null)
  const [detayGecmisSiparis, setDetayGecmisSiparis] = useState(null)
  const [duzenlenenSiparisNo, setDuzenlenenSiparisNo] = useState(null)
  const [durumGuncellenenSiparisNo, setDurumGuncellenenSiparisNo] = useState(null)
  const [silinecekSiparis, setSilinecekSiparis] = useState(null)
  const [siparisFormu, setSiparisFormu] = useState(bosSiparisFormu)
  const [siparisDurumFormu, setSiparisDurumFormu] = useState({
    odemeDurumu: 'Beklemede',
    urunHazirlik: 'Hazırlanıyor',
    teslimatDurumu: 'Hazırlanıyor',
    teslimatSuresi: '',
  })
  const [gecmisSiparisler] = useState(baslangicGecmisSiparisleri)
  const [odemeSekmesi, setOdemeSekmesi] = useState('gelen')
  const [gelenSayfa, setGelenSayfa] = useState(1)
  const [gidenSayfa, setGidenSayfa] = useState(1)
  const [duzenlenenOdeme, setDuzenlenenOdeme] = useState(null)
  const [odemeFormu, setOdemeFormu] = useState({ taraf: '', tarih: '', durum: '', tutar: '' })
  const [silinecekOdeme, setSilinecekOdeme] = useState(null)
  const [gecisBalonu, setGecisBalonu] = useState('')
  const [aramaMetni, setAramaMetni] = useState('')
  const [envanterKategori, setEnvanterKategori] = useState('Tümü')
  const [envanterSayfa, setEnvanterSayfa] = useState(1)
  const [urunDuzenlemeArama, setUrunDuzenlemeArama] = useState('')
  const [urunDuzenlemeSayfa, setUrunDuzenlemeSayfa] = useState(1)
  const [urunDuzenlemeSekmesi, setUrunDuzenlemeSekmesi] = useState('urunler')
  const [stokLogSayfa, setStokLogSayfa] = useState(1)
  const [musteriArama, setMusteriArama] = useState('')
  const [musteriSayfa, setMusteriSayfa] = useState(1)
  const [tedarikciler, setTedarikciler] = useState(baslangicTedarikcileri)
  const [tedarikciArama, setTedarikciArama] = useState('')
  const [tedarikciSekmesi, setTedarikciSekmesi] = useState('liste')
  const [tedarikciSayfa, setTedarikciSayfa] = useState(1)
  const [tedarikciSiparisSayfa, setTedarikciSiparisSayfa] = useState(1)
  const [tedarikciDetaySekmesi, setTedarikciDetaySekmesi] = useState('genel')

  const [eklemeAcik, setEklemeAcik] = useState(false)
  const [duzenlemeAcik, setDuzenlemeAcik] = useState(false)
  const [silinecekUrun, setSilinecekUrun] = useState(null)
  const [urunDuzenlemeModalAcik, setUrunDuzenlemeModalAcik] = useState(false)
  const [silinecekDuzenlemeUrunu, setSilinecekDuzenlemeUrunu] = useState(null)
  const [aiPanelAcik, setAiPanelAcik] = useState(false)
  const [aiPanelKucuk, setAiPanelKucuk] = useState(false)
  const [aiPanelKapaniyor, setAiPanelKapaniyor] = useState(false)
  const [bildirimPanelAcik, setBildirimPanelAcik] = useState(false)
  const [bildirimPanelKapaniyor, setBildirimPanelKapaniyor] = useState(false)
  const [okunanBildirimler, setOkunanBildirimler] = useState([])
  const [temizlenenBildirimler, setTemizlenenBildirimler] = useState([])
  const [sifreGorunur, setSifreGorunur] = useState(false)
  const [merkezeDonusAktif, setMerkezeDonusAktif] = useState(false)
  const [merkezGirisEfekti, setMerkezGirisEfekti] = useState(false)
  const [aiTemaMenuAcik, setAiTemaMenuAcik] = useState(false)
  const [aiMesajMetni, setAiMesajMetni] = useState('')
  const [aiHizliKonularAcik, setAiHizliKonularAcik] = useState(true)
  const [globalAramaMetni, setGlobalAramaMetni] = useState('')
  const [globalAramaMobilAcik, setGlobalAramaMobilAcik] = useState(false)
  const [aiMesajlar, setAiMesajlar] = useState([
    {
      id: 1,
      rol: 'bot',
      metin: 'Tekrardan hoş geldiniz, size nasıl yardımcı olabilirim?',
      saat: 'Şimdi',
    },
  ])

  const [seciliUid, setSeciliUid] = useState(null)
  const [form, setForm] = useState(bosForm)
  const [urunDuzenlemeUid, setUrunDuzenlemeUid] = useState(null)
  const [urunDuzenlemeFormu, setUrunDuzenlemeFormu] = useState(bosUrunDuzenlemeFormu)
  const [musteriEklemeAcik, setMusteriEklemeAcik] = useState(false)
  const [musteriDuzenlemeAcik, setMusteriDuzenlemeAcik] = useState(false)
  const [musteriNotAcik, setMusteriNotAcik] = useState(false)
  const [seciliMusteriUid, setSeciliMusteriUid] = useState(null)
  const [musteriFormu, setMusteriFormu] = useState(bosMusteriFormu)
  const [musteriNotMetni, setMusteriNotMetni] = useState('')
  const [silinecekMusteri, setSilinecekMusteri] = useState(null)
  const [tedarikciEklemeAcik, setTedarikciEklemeAcik] = useState(false)
  const [tedarikciDuzenlemeAcik, setTedarikciDuzenlemeAcik] = useState(false)
  const [tedarikciNotAcik, setTedarikciNotAcik] = useState(false)
  const [tedarikciDetayAcik, setTedarikciDetayAcik] = useState(false)
  const [seciliTedarikciUid, setSeciliTedarikciUid] = useState(null)
  const [tedarikciFormu, setTedarikciFormu] = useState(bosTedarikciFormu)
  const [tedarikciNotMetni, setTedarikciNotMetni] = useState('')
  const [silinecekTedarikci, setSilinecekTedarikci] = useState(null)
  const [tedarikciSiparisEklemeAcik, setTedarikciSiparisEklemeAcik] = useState(false)
  const [tedarikciSiparisFormu, setTedarikciSiparisFormu] = useState(bosTedarikciSiparisFormu)
  const [genelTedarikSiparisAcik, setGenelTedarikSiparisAcik] = useState(false)
  const [genelTedarikSiparisFormu, setGenelTedarikSiparisFormu] = useState({
    tedarikciUid: '',
    ...bosTedarikciSiparisFormu,
  })
  const [faturalar, setFaturalar] = useState(baslangicFaturalari)
  const [faturaSekmesi, setFaturaSekmesi] = useState('yeni')
  const [faturaArama, setFaturaArama] = useState('')
  const [faturaFormu, setFaturaFormu] = useState(bosFaturaFormu)
  const [faturaDetayAcik, setFaturaDetayAcik] = useState(false)
  const [seciliFaturaId, setSeciliFaturaId] = useState(null)
  const [pdfOnizlemeAcik, setPdfOnizlemeAcik] = useState(false)

  const filtreliUrunler = useMemo(() => {
    const metin = aramaMetni.trim().toLowerCase()
    const kategoriyeGore = envanterKategori === 'Tümü'
      ? urunler
      : urunler.filter((urun) => urun.kategori === envanterKategori)
    const sonuc = !metin
      ? kategoriyeGore
      : kategoriyeGore.filter((urun) => urun.ad.toLowerCase().includes(metin) || urun.urunId.toLowerCase().includes(metin))

    return favorileriOneTasi(sonuc)
  }, [aramaMetni, urunler, envanterKategori])

  const toplamEnvanterSayfa = Math.max(1, Math.ceil(filtreliUrunler.length / SAYFA_BASINA_URUN))
  const sayfaBaslangic = (envanterSayfa - 1) * SAYFA_BASINA_URUN
  const sayfadakiUrunler = filtreliUrunler.slice(sayfaBaslangic, sayfaBaslangic + SAYFA_BASINA_URUN)

  const filtreliDuzenlemeUrunleri = useMemo(() => {
    const metin = urunDuzenlemeArama.trim().toLowerCase()
    const sonuc = !metin
      ? urunler
      : urunler.filter((urun) =>
          urun.ad.toLowerCase().includes(metin) ||
          urun.urunId.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(sonuc)
  }, [urunDuzenlemeArama, urunler])

  const toplamUrunDuzenlemeSayfa = Math.max(1, Math.ceil(filtreliDuzenlemeUrunleri.length / SAYFA_BASINA_URUN))
  const urunDuzenlemeBaslangic = (urunDuzenlemeSayfa - 1) * SAYFA_BASINA_URUN
  const sayfadakiDuzenlemeUrunleri = filtreliDuzenlemeUrunleri.slice(
    urunDuzenlemeBaslangic,
    urunDuzenlemeBaslangic + SAYFA_BASINA_URUN,
  )

  const toplamStokLogSayfa = Math.max(1, Math.ceil(stokDegisimLoglari.length / STOK_LOG_SAYFA_BASINA))
  const stokLogBaslangic = (stokLogSayfa - 1) * STOK_LOG_SAYFA_BASINA
  const sayfadakiStokLoglari = stokDegisimLoglari.slice(stokLogBaslangic, stokLogBaslangic + STOK_LOG_SAYFA_BASINA)

  const filtreliMusteriler = useMemo(() => {
    const metin = musteriArama.trim().toLowerCase()
    const sonuc = !metin
      ? musteriler
      : musteriler.filter((musteri) =>
          musteri.ad.toLowerCase().includes(metin) ||
          musteri.telefon.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(sonuc, (musteri) => new Date(`${musteri.sonAlim}T00:00:00`).getTime())
  }, [musteriArama, musteriler])

  const toplamMusteriSayfa = Math.max(1, Math.ceil(filtreliMusteriler.length / MUSTERI_SAYFA_BASINA))
  const musteriBaslangic = (musteriSayfa - 1) * MUSTERI_SAYFA_BASINA
  const sayfadakiMusteriler = filtreliMusteriler.slice(musteriBaslangic, musteriBaslangic + MUSTERI_SAYFA_BASINA)

  const filtreliTedarikciler = useMemo(() => {
    const metin = tedarikciArama.trim().toLowerCase()
    const sonuc = !metin
      ? tedarikciler
      : tedarikciler.filter((tedarikci) =>
          tedarikci.firmaAdi.toLowerCase().includes(metin) ||
          tedarikci.telefon.toLowerCase().includes(metin) ||
          tedarikci.yetkiliKisi.toLowerCase().includes(metin) ||
          tedarikci.urunGrubu.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(sonuc, (tedarikci) => tedarikci.toplamHarcama)
  }, [tedarikciArama, tedarikciler])

  const toplamTedarikciSayfa = Math.max(1, Math.ceil(filtreliTedarikciler.length / TEDARIKCI_SAYFA_BASINA))
  const tedarikciBaslangic = (tedarikciSayfa - 1) * TEDARIKCI_SAYFA_BASINA
  const sayfadakiTedarikciler = filtreliTedarikciler.slice(tedarikciBaslangic, tedarikciBaslangic + TEDARIKCI_SAYFA_BASINA)
  const seciliTedarikci = tedarikciler.find((tedarikci) => tedarikci.uid === seciliTedarikciUid) ?? null
  const tumTedarikSiparisleri = useMemo(() => {
    const kayitlar = tedarikciler.flatMap((tedarikci) =>
      tedarikci.siparisler.map((siparis) => ({
        ...siparis,
        tedarikciUid: tedarikci.uid,
        firmaAdi: tedarikci.firmaAdi,
        yetkiliKisi: tedarikci.yetkiliKisi,
        telefon: tedarikci.telefon,
      })),
    )

    return kayitlar.sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
  }, [tedarikciler])
  const toplamTedarikSiparisSayfa = Math.max(1, Math.ceil(tumTedarikSiparisleri.length / TEDARIKCI_SAYFA_BASINA))
  const tedarikSiparisBaslangic = (tedarikciSiparisSayfa - 1) * TEDARIKCI_SAYFA_BASINA
  const sayfadakiTedarikSiparisleri = tumTedarikSiparisleri.slice(
    tedarikSiparisBaslangic,
    tedarikSiparisBaslangic + TEDARIKCI_SAYFA_BASINA,
  )
  const faturaKarsiTaraflar = useMemo(() => {
    if (faturaFormu.tur === 'Satış Faturası') {
      return musteriler.map((musteri) => ({ uid: musteri.uid, ad: musteri.ad, telefon: musteri.telefon, adres: 'Malatya Yeşilyurt / Malatya', vergiNo: '1111111111' }))
    }

    return tedarikciler.map((tedarikci) => ({
      uid: tedarikci.uid,
      ad: tedarikci.firmaAdi,
      telefon: tedarikci.telefon,
      adres: tedarikci.adres,
      vergiNo: tedarikci.vergiNumarasi,
    }))
  }, [faturaFormu.tur, musteriler, tedarikciler])
  const seciliFaturaKarsiTaraf = faturaKarsiTaraflar.find((kayit) => String(kayit.uid) === String(faturaFormu.karsiTarafUid)) ?? null
  const faturaOnizleme = useMemo(() => {
    const satirlar = faturaFormu.satirlar
      .filter((satir) => satir.urun.trim())
      .map((satir) => ({
        ...satir,
        miktar: Number(satir.miktar),
        birimFiyat: Number(satir.birimFiyat),
        kdvOrani: Number(satir.kdvOrani ?? FATURA_KDV_ORANI),
      }))
    const toplamlar = faturaToplamlariHesapla(satirlar)
    return {
      id: 'onizleme',
      faturaNo: `FTR-${new Date().getFullYear()}-${String(faturalar.length + 1).padStart(3, '0')}`,
      tur: faturaFormu.tur,
      karsiTarafUid: faturaFormu.karsiTarafUid,
      karsiTarafAdi: seciliFaturaKarsiTaraf?.ad ?? faturaFormu.karsiTarafAdi,
      tarih: faturaFormu.tarih,
      odemeTarihi: faturaFormu.odemeTarihi,
      satirlar,
      not: faturaFormu.not.trim(),
      durum: 'Taslak',
      ...toplamlar,
    }
  }, [faturaFormu, faturalar.length, seciliFaturaKarsiTaraf])
  const filtreliFaturalar = useMemo(() => {
    const arama = faturaArama.trim().toLowerCase()
    if (!arama) return faturalar
    return faturalar.filter((fatura) =>
      fatura.faturaNo.toLowerCase().includes(arama) ||
      fatura.karsiTarafAdi.toLowerCase().includes(arama) ||
      fatura.tur.toLowerCase().includes(arama),
    )
  }, [faturaArama, faturalar])
  const seciliFatura = faturalar.find((fatura) => fatura.id === seciliFaturaId) ?? null

  const siraliSiparisler = useMemo(() => {
    return [...siparisler].sort((a, b) => new Date(b.siparisTarihi).getTime() - new Date(a.siparisTarihi).getTime())
  }, [siparisler])

  const filtreliSiparisler = useMemo(() => {
    const arama = siparisArama.trim().toLowerCase()
    return siraliSiparisler.filter((siparis) => {
      const filtreUygun = siparisOdemeFiltresi === 'Tüm Siparişler' || siparis.odemeDurumu === siparisOdemeFiltresi
      if (!filtreUygun) return false
      if (!arama) return true
      return (
        siparis.siparisNo.toLowerCase().includes(arama) ||
        siparis.musteri.toLowerCase().includes(arama) ||
        siparis.urun.toLowerCase().includes(arama)
      )
    })
  }, [siparisArama, siparisOdemeFiltresi, siraliSiparisler])

  const toplamSiparisSayfa = Math.max(1, Math.ceil(filtreliSiparisler.length / SIPARIS_SAYFA_BASINA))
  const siparisBaslangic = (siparisSayfa - 1) * SIPARIS_SAYFA_BASINA
  const sayfadakiSiparisler = filtreliSiparisler.slice(siparisBaslangic, siparisBaslangic + SIPARIS_SAYFA_BASINA)

  const filtreliGecmisSiparisler = useMemo(() => {
    const metin = gecmisSiparisArama.trim().toLowerCase()
    if (!metin) return gecmisSiparisler

    return gecmisSiparisler.filter((siparis) =>
      siparis.siparisNo.toLowerCase().includes(metin) ||
      siparis.logNo.toLowerCase().includes(metin) ||
      siparis.musteri.toLowerCase().includes(metin) ||
      siparis.urun.toLowerCase().includes(metin) ||
      siparis.durum.toLowerCase().includes(metin),
    )
  }, [gecmisSiparisArama, gecmisSiparisler])

  const toplamGecmisSiparisSayfa = Math.max(1, Math.ceil(filtreliGecmisSiparisler.length / SIPARIS_SAYFA_BASINA))
  const gecmisSiparisBaslangic = (gecmisSiparisSayfa - 1) * SIPARIS_SAYFA_BASINA
  const sayfadakiGecmisSiparisler = filtreliGecmisSiparisler.slice(
    gecmisSiparisBaslangic,
    gecmisSiparisBaslangic + SIPARIS_SAYFA_BASINA,
  )

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

  const globalAramaSonuclari = useMemo(() => {
    const metin = globalAramaMetni.trim().toLowerCase()
    if (!metin) return []

    const urunSonuclari = urunler
      .filter((urun) => urun.ad.toLowerCase().includes(metin) || urun.urunId.toLowerCase().includes(metin) || urun.kategori.toLowerCase().includes(metin))
      .slice(0, 4)
      .map((urun) => ({
        id: `urun-${urun.uid}`,
        tur: 'Ürünler',
        baslik: urun.ad,
        alt: `${urun.urunId} • ${urun.kategori} • Stok: ${urun.magazaStok}`,
        hedef: 'envanter',
        deger: urun.ad,
      }))

    const aktifSiparisSonuclari = siraliSiparisler
      .filter((siparis) =>
        siparis.siparisNo.toLowerCase().includes(metin) ||
        siparis.musteri.toLowerCase().includes(metin) ||
        siparis.urun.toLowerCase().includes(metin),
      )
      .slice(0, 4)
      .map((siparis) => ({
        id: `aktif-siparis-${siparis.siparisNo}`,
        tur: 'Aktif Siparişler',
        baslik: siparis.siparisNo,
        alt: `${siparis.musteri} • ${siparis.urun} • ${paraFormatla(siparis.toplamTutar)}`,
        hedef: 'siparisler-aktif',
        deger: siparis.siparisNo,
      }))

    const gecmisSiparisSonuclari = gecmisSiparisler
      .filter((siparis) =>
        siparis.siparisNo.toLowerCase().includes(metin) ||
        siparis.logNo.toLowerCase().includes(metin) ||
        siparis.musteri.toLowerCase().includes(metin) ||
        siparis.urun.toLowerCase().includes(metin),
      )
      .slice(0, 3)
      .map((siparis) => ({
        id: `gecmis-siparis-${siparis.logNo}`,
        tur: 'Geçmiş Siparişler',
        baslik: siparis.siparisNo,
        alt: `${siparis.musteri} • ${siparis.durum} • ${paraFormatla(siparis.tutar)}`,
        hedef: 'siparisler-gecmis',
        deger: siparis.siparisNo,
      }))

    const rakamArama = metin.replace(/\D/g, '')

    const musteriSonuclari = musteriler
      .filter((musteri) =>
        musteri.ad.toLowerCase().includes(metin) ||
        (rakamArama && musteri.telefon.replace(/\D/g, '').includes(rakamArama)),
      )
      .slice(0, 4)
      .map((musteri) => ({
        id: `musteri-${musteri.uid}`,
        tur: 'Müşteriler',
        baslik: musteri.ad,
        alt: `${musteri.telefon} • ${paraFormatla(musteri.toplamHarcama)}`,
        hedef: 'musteriler',
        deger: musteri.ad,
      }))

    const tedarikciSonuclari = tedarikciler
      .filter((tedarikci) =>
        tedarikci.firmaAdi.toLowerCase().includes(metin) ||
        tedarikci.yetkiliKisi.toLowerCase().includes(metin) ||
        tedarikci.urunGrubu.toLowerCase().includes(metin),
      )
      .slice(0, 4)
      .map((tedarikci) => ({
        id: `tedarikci-${tedarikci.uid}`,
        tur: 'Tedarikçiler',
        baslik: tedarikci.firmaAdi,
        alt: `${tedarikci.yetkiliKisi} • ${tedarikci.urunGrubu}`,
        hedef: 'alicilar',
        uid: tedarikci.uid,
        deger: tedarikci.firmaAdi,
      }))

    const faturaSonuclari = faturalar
      .filter((fatura) =>
        fatura.faturaNo.toLowerCase().includes(metin) ||
        fatura.karsiTarafAdi.toLowerCase().includes(metin) ||
        fatura.tur.toLowerCase().includes(metin),
      )
      .slice(0, 3)
      .map((fatura) => ({
        id: `fatura-${fatura.id}`,
        tur: 'Faturalar',
        baslik: fatura.faturaNo,
        alt: `${fatura.karsiTarafAdi} • ${paraFormatla(fatura.toplam)}`,
        hedef: 'faturalama',
        uid: fatura.id,
        deger: fatura.faturaNo,
      }))

    return [
      ...urunSonuclari,
      ...aktifSiparisSonuclari,
      ...gecmisSiparisSonuclari,
      ...musteriSonuclari,
      ...tedarikciSonuclari,
      ...faturaSonuclari,
    ].slice(0, 14)
  }, [faturalar, gecmisSiparisler, globalAramaMetni, musteriler, paraFormatla, siraliSiparisler, tedarikciler, urunler])

  const siparisAktivitesi = useMemo(() => {
    const paketlenecek = filtreliSiparisler.filter(
      (siparis) => siparis.urunHazirlik === 'Hazırlanıyor' || siparis.urunHazirlik === 'Tedarik Bekleniyor',
    ).length
    const sevkEdilecek = filtreliSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Hazırlanıyor').length
    const teslimEdilecek = filtreliSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Yolda').length

    return { paketlenecek, sevkEdilecek, teslimEdilecek }
  }, [filtreliSiparisler])

  const dashboardCanliOzetler = useMemo(() => {
    const referansSiparis = siraliSiparisler[0]
    const bugun = referansSiparis ? new Date(`${referansSiparis.siparisTarihi}T00:00:00`) : new Date()

    const bugunkuSiparisler = siraliSiparisler.filter((siparis) => {
      const tarih = new Date(`${siparis.siparisTarihi}T00:00:00`)
      return tarih.toDateString() === bugun.toDateString()
    })

    const bekleyenTahsilatlar = siraliSiparisler.filter((siparis) => siparis.odemeDurumu === 'Beklemede')
    const kritikStokluUrunler = [...urunler]
      .filter((urun) => kritikStoktaMi(urun))
      .sort((a, b) => a.magazaStok - b.magazaStok)

    const gecikenSiparisler = siraliSiparisler.filter((siparis) => {
      const siparisTarihi = new Date(`${siparis.siparisTarihi}T00:00:00`)
      const teslimatGunu = teslimatGununuCoz(siparis.teslimatSuresi)
      const gunFarki = Math.floor((bugun.getTime() - siparisTarihi.getTime()) / 86400000)
      return siparis.teslimatDurumu !== 'Teslim Edildi' && teslimatGunu > 0 && gunFarki > teslimatGunu
    })

    return {
      bugunkuSiparisAdedi: bugunkuSiparisler.length,
      bugunkuSiparisTutari: bugunkuSiparisler.reduce((toplam, siparis) => toplam + siparis.toplamTutar, 0),
      bekleyenTahsilatAdedi: bekleyenTahsilatlar.length,
      bekleyenTahsilatTutari: bekleyenTahsilatlar.reduce((toplam, siparis) => toplam + siparis.toplamTutar, 0),
      kritikStokAdedi: kritikStokluUrunler.length,
      kritikStokluUrunler,
      gecikenSiparisAdedi: gecikenSiparisler.length,
      gecikenSiparisler,
    }
  }, [siraliSiparisler, urunler])

  const tumBildirimler = useMemo(() => {
    const kritikStokBildirimleri = dashboardCanliOzetler.kritikStokluUrunler.slice(0, 3).map((urun) => ({
      id: `kritik-${urun.uid}`,
      tur: 'kritik',
      baslik: `${urun.ad} kritik stokta`,
      detay: `Minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}. Yeniden sipariş planlanmalı.`,
      zaman: 'Az önce',
      sayfa: 'envanter',
    }))

    const stokLogBildirimleri = stokDegisimLoglari.slice(0, 3).map((log) => ({
      id: `stok-log-${log.id}`,
      tur: 'stok',
      baslik: `${log.urun} için ${log.islem.toLocaleLowerCase('tr-TR')}`,
      detay: `${log.eskiStok} adetten ${log.yeniStok} adede güncellendi. ${log.aciklama}`,
      zaman: log.tarih,
      sayfa: 'urun-duzenleme',
      sekme: 'stok-gecmisi',
    }))

    const sonSatisBildirimleri = siraliSiparisler.slice(0, 3).map((siparis) => ({
      id: `satis-${siparis.siparisNo}`,
      tur: 'satis',
      baslik: `${siparis.siparisNo} numaralı sipariş kaydedildi`,
      detay: `${siparis.musteri} için ${siparis.urun} satıldı. Tutar ${paraFormatla(siparis.toplamTutar)}.`,
      zaman: tarihFormatla(siparis.siparisTarihi),
      sayfa: 'siparisler',
    }))

    const bekleyenTahsilatBildirimleri = siraliSiparisler
      .filter((siparis) => siparis.odemeDurumu === 'Beklemede')
      .slice(0, 2)
      .map((siparis) => ({
        id: `bekleyen-${siparis.siparisNo}`,
        tur: 'tahsilat',
        baslik: `${siparis.siparisNo} tahsilat bekliyor`,
        detay: `${siparis.musteri} için ${paraFormatla(siparis.toplamTutar)} tutarında ödeme bekleniyor.`,
        zaman: tarihFormatla(siparis.siparisTarihi),
        sayfa: 'odemeler',
        sekme: 'gelen',
      }))

    return [
      ...kritikStokBildirimleri,
      ...stokLogBildirimleri,
      ...sonSatisBildirimleri,
      ...bekleyenTahsilatBildirimleri,
    ].slice(0, 8)
  }, [dashboardCanliOzetler.kritikStokluUrunler, siraliSiparisler])

  const bildirimler = useMemo(() => {
    return tumBildirimler.filter((bildirim) => !temizlenenBildirimler.includes(bildirim.id))
  }, [temizlenenBildirimler, tumBildirimler])

  const okunmamisBildirimSayisi = useMemo(() => {
    return bildirimler.filter((bildirim) => !okunanBildirimler.includes(bildirim.id)).length
  }, [bildirimler, okunanBildirimler])

  const siraliGelenNakit = useMemo(() => {
    return favorileriOneTasi(gelenNakitListesi, (kayit) => new Date(kayit.tarih).getTime())
  }, [gelenNakitListesi])

  const siraliGidenNakit = useMemo(() => {
    return favorileriOneTasi(gidenNakitListesi, (kayit) => new Date(kayit.tarih).getTime())
  }, [gidenNakitListesi])

  const toplamGelenNakit = useMemo(() => siraliGelenNakit.reduce((toplam, kayit) => toplam + kayit.tutar, 0), [siraliGelenNakit])
  const toplamGidenNakit = useMemo(() => siraliGidenNakit.reduce((toplam, kayit) => toplam + kayit.tutar, 0), [siraliGidenNakit])
  const aySonuKari = toplamGelenNakit - toplamGidenNakit

  const dashboardOzet = useMemo(() => {
    return [
      { baslik: 'Toplam Gelir', deger: paraFormatla(aySonuKari), degisim: '+%14', ikon: 'cuzdan' },
      ...dashboardOzetSablon,
    ].filter((kart) => !gizlenenOzetKartlari.includes(kart.baslik))
  }, [aySonuKari, gizlenenOzetKartlari])

  const aiHazirCevaplar = useMemo(() => {
    const enSonSiparis = siraliSiparisler[0]
    const referansTarih = enSonSiparis ? new Date(`${enSonSiparis.siparisTarihi}T00:00:00`) : new Date()
    const buAySiparisleri = siraliSiparisler.filter((siparis) => {
      const tarih = new Date(`${siparis.siparisTarihi}T00:00:00`)
      return tarih.getMonth() === referansTarih.getMonth() && tarih.getFullYear() === referansTarih.getFullYear()
    })

    const buAyToplamSatis = buAySiparisleri.reduce((toplam, siparis) => toplam + siparis.toplamTutar, 0)
    const enYuksekAylikSiparis = [...buAySiparisleri].sort((a, b) => b.toplamTutar - a.toplamTutar)[0]

    const dusukStokluUrunler = [...urunler]
      .filter((urun) => kritikStoktaMi(urun))
      .sort((a, b) => a.magazaStok - b.magazaStok)
      .slice(0, 4)

    const kargolananSiparisler = siraliSiparisler.filter(
      (siparis) => siparis.teslimatDurumu === 'Yolda' || siparis.teslimatDurumu === 'Teslim Edildi',
    )
    const teslimEdilenler = kargolananSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Teslim Edildi')
    const yoldakiler = kargolananSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Yolda')

    const kargolanmayanSiparisler = siraliSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Hazırlanıyor')
    const kargolanmayanOzet = kargolanmayanSiparisler
      .slice(0, 3)
      .map((siparis) => `${siparis.siparisNo} - ${siparis.urun}`)
      .join(', ')

    const urunSatisOzeti = siraliSiparisler.reduce((harita, siparis) => {
      harita[siparis.urun] = (harita[siparis.urun] ?? 0) + 1
      return harita
    }, {})

    const enCokSatanlar = Object.entries(urunSatisOzeti)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([urun, adet]) => `${urun} (${adet} sipariş)`)
      .join(', ')

    return {
      [metniNormalizeEt('Bu ay gerçekleşen satışlar hakkında bilgi ver.')]:
        `Bu ay toplam ${buAySiparisleri.length} siparişten ${paraFormatla(buAyToplamSatis)} ciro oluştu. En yüksek tutarlı sipariş ${enYuksekAylikSiparis?.siparisNo ?? '-'} numaralı kayıtta, ${enYuksekAylikSiparis?.musteri ?? '-'} için ${paraFormatla(enYuksekAylikSiparis?.toplamTutar ?? 0)} olarak görünüyor.`,
      [metniNormalizeEt('Bana stokları azalan ürünlerimiz hakkında bilgi ver.')]:
        dusukStokluUrunler.length > 0
          ? `Kritik stok seviyesine düşen ürünler: ${dusukStokluUrunler.map((urun) => `${urun.ad} (minimum ${urun.minimumStok} / mevcut ${urun.magazaStok})`).join(', ')}. Bu ürünler için yeniden sipariş açılması gerekiyor.`
          : 'Şu an kritik eşik altında görünen bir ürün yok. Envanter genel olarak dengeli görünüyor.',
      [metniNormalizeEt('Kargolanan siparişlerin teslimi yapıldı mı?')]:
        `Toplam ${kargolananSiparisler.length} sipariş kargoya çıktı. Bunların ${teslimEdilenler.length} adedi teslim edildi, ${yoldakiler.length} adedi ise hâlâ yolda. En yakın teslimat beklenen kayıtlar dashboarddaki son siparişler tablosunda da görünüyor.`,
      [metniNormalizeEt('Hangi siparişlerimiz henüz kargolanmadı?')]:
        kargolanmayanSiparisler.length > 0
          ? `Şu an ${kargolanmayanSiparisler.length} sipariş henüz kargolanmadı. Öne çıkan kayıtlar: ${kargolanmayanOzet}. Bu siparişlerin durumu siparişler ekranında "Hazırlanıyor" olarak işaretli.`
          : 'Şu anda kargolanmamış açık sipariş görünmüyor. Tüm kayıtlar ya yolda ya da teslim edilmiş durumda.',
      [metniNormalizeEt('En çok satan ürünlerimizden bana bahset.')]:
        `Sipariş kaydına göre öne çıkan ürünler: ${enCokSatanlar}. Bu ürünler aynı zamanda dashboarddaki "En Çok Satılan Ürünler" alanıyla da uyumlu ilerliyor.`,
      [metniNormalizeEt('En son gerçekleşen satışın ayrıntılarını anlat.')]:
        enSonSiparis
          ? `En son satış ${enSonSiparis.siparisNo} numarasıyla ${tarihFormatla(enSonSiparis.siparisTarihi)} tarihinde oluşturuldu. Ürün ${enSonSiparis.urun}, müşteri ${enSonSiparis.musteri}, tutar ${paraFormatla(enSonSiparis.toplamTutar)} ve teslimat durumu ${enSonSiparis.teslimatDurumu.toLocaleLowerCase('tr-TR')} olarak kayıtlı.`
          : 'En son satış kaydı şu anda bulunamadı.',
    }
  }, [siraliSiparisler, urunler, aySonuKari])

  const toplamGelenSayfa = Math.max(1, Math.ceil(siraliGelenNakit.length / ODEME_SAYFA_BASINA))
  const toplamGidenSayfa = Math.max(1, Math.ceil(siraliGidenNakit.length / ODEME_SAYFA_BASINA))
  const gelenSayfadakiKayitlar = siraliGelenNakit.slice((gelenSayfa - 1) * ODEME_SAYFA_BASINA, gelenSayfa * ODEME_SAYFA_BASINA)
  const gidenSayfadakiKayitlar = siraliGidenNakit.slice((gidenSayfa - 1) * ODEME_SAYFA_BASINA, gidenSayfa * ODEME_SAYFA_BASINA)

  useEffect(() => {
    if (envanterSayfa > toplamEnvanterSayfa) {
      setEnvanterSayfa(toplamEnvanterSayfa)
    }
  }, [envanterSayfa, toplamEnvanterSayfa])

  useEffect(() => {
    if (gelenSayfa > toplamGelenSayfa) setGelenSayfa(toplamGelenSayfa)
  }, [gelenSayfa, toplamGelenSayfa])

  useEffect(() => {
    if (gidenSayfa > toplamGidenSayfa) setGidenSayfa(toplamGidenSayfa)
  }, [gidenSayfa, toplamGidenSayfa])

  useEffect(() => {
    if (musteriSayfa > toplamMusteriSayfa) setMusteriSayfa(toplamMusteriSayfa)
  }, [musteriSayfa, toplamMusteriSayfa])

  useEffect(() => {
    if (tedarikciSayfa > toplamTedarikciSayfa) setTedarikciSayfa(toplamTedarikciSayfa)
  }, [tedarikciSayfa, toplamTedarikciSayfa])

  useEffect(() => {
    if (siparisSayfa > toplamSiparisSayfa) setSiparisSayfa(toplamSiparisSayfa)
  }, [siparisSayfa, toplamSiparisSayfa])

  useEffect(() => {
    if (gecmisSiparisSayfa > toplamGecmisSiparisSayfa) setGecmisSiparisSayfa(toplamGecmisSiparisSayfa)
  }, [gecmisSiparisSayfa, toplamGecmisSiparisSayfa])

  useEffect(() => {
    if (stokLogSayfa > toplamStokLogSayfa) setStokLogSayfa(toplamStokLogSayfa)
  }, [stokLogSayfa, toplamStokLogSayfa])

  useEffect(() => {
    setSiparisSayfa(1)
  }, [siparisArama, siparisOdemeFiltresi])

  useEffect(() => {
    setTedarikciSayfa(1)
  }, [tedarikciArama])

  useEffect(() => {
    if (tedarikciSiparisSayfa > toplamTedarikSiparisSayfa) setTedarikciSiparisSayfa(toplamTedarikSiparisSayfa)
  }, [tedarikciSiparisSayfa, toplamTedarikSiparisSayfa])

  useEffect(() => {
    if (!sonGeriAlma) return undefined

    const duzenlenebilirAlanAcikMi = () => {
      const aktif = document.activeElement
      if (!aktif) return false
      const tag = aktif.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || aktif.isContentEditable
    }

    const tusYakala = (event) => {
      const geriAlTuslandi = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z'
      if (!geriAlTuslandi || duzenlenebilirAlanAcikMi()) return

      event.preventDefault()
      const calisacakEylem = sonGeriAlma.eylem
      setToastlar((onceki) => onceki.filter((toast) => toast.id !== sonGeriAlma.toastId))
      setSonGeriAlma(null)
      if (typeof calisacakEylem === 'function') calisacakEylem()
    }

    window.addEventListener('keydown', tusYakala)
    return () => window.removeEventListener('keydown', tusYakala)
  }, [sonGeriAlma])

  const handleLogin = (event) => {
    event.preventDefault()

    if (username.trim() === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      setError('')
      setLoginGecisiAktif(true)
      window.setTimeout(() => {
        setIsLoggedIn(true)
        setAktifSayfa('merkez')
        setLoginGecisiAktif(false)
      }, 1180)
      return
    }

    setError('Kullanıcı adı veya şifre hatalı.')
  }

  const sayfaDegistir = (sayfa) => {
    setAktifSayfa(sayfa)
    setEklemeAcik(false)
    setDuzenlemeAcik(false)
    setSilinecekUrun(null)
    setUrunDuzenlemeModalAcik(false)
    setSilinecekDuzenlemeUrunu(null)
    setMusteriEklemeAcik(false)
    setMusteriDuzenlemeAcik(false)
    setMusteriNotAcik(false)
    setSilinecekMusteri(null)
    setTedarikciEklemeAcik(false)
    setTedarikciDuzenlemeAcik(false)
    setTedarikciNotAcik(false)
    setTedarikciDetayAcik(false)
    setSilinecekTedarikci(null)
    setTedarikciSiparisEklemeAcik(false)
    setGenelTedarikSiparisAcik(false)
    setFaturaDetayAcik(false)
    setPdfOnizlemeAcik(false)
    setAcikOzetMenusu('')
    setDashboardBolumMenusuAcik(false)
    setAiTemaMenuAcik(false)
    setGlobalAramaMetni('')
    setGlobalAramaMobilAcik(false)
    setMobilMenuAcik(false)
    setYeniSiparisAcik(false)
    setDetaySiparis(null)
    setDetayGecmisSiparis(null)
    setDuzenlenenSiparisNo(null)
    setDurumGuncellenenSiparisNo(null)
    setSilinecekSiparis(null)
    setDuzenlenenOdeme(null)
    setSilinecekOdeme(null)
    if (sayfa === 'envanter') setEnvanterSayfa(1)
    if (sayfa === 'urun-duzenleme') setUrunDuzenlemeSayfa(1)
    if (sayfa === 'urun-duzenleme') setStokLogSayfa(1)
    if (sayfa === 'musteriler') setMusteriSayfa(1)
    if (sayfa === 'alicilar') {
      setTedarikciSayfa(1)
      setTedarikciSiparisSayfa(1)
      setTedarikciSekmesi('liste')
    }
    if (sayfa === 'siparisler') setSiparisSayfa(1)
    if (sayfa === 'odemeler') {
      setOdemeSekmesi('gelen')
      setGelenSayfa(1)
      setGidenSayfa(1)
    }
    if (sayfa === 'faturalama') {
      setFaturaSekmesi('yeni')
    }
  }

  const merkezeDon = () => {
    if (merkezeDonusAktif) return

    setMerkezeDonusAktif(true)
    window.setTimeout(() => {
      sayfaDegistir('merkez')
      setMerkezGirisEfekti(true)
      setMerkezeDonusAktif(false)
      window.setTimeout(() => {
        setMerkezGirisEfekti(false)
      }, 520)
    }, 340)
  }

  const toastGoster = (tip, metin, secenekler = {}) => {
    const id = Date.now() + Math.random()
    setToastlar((onceki) => [...onceki, { id, tip, metin, ...secenekler }])
    if (secenekler.eylemEtiketi && typeof secenekler.eylem === 'function') {
      setSonGeriAlma({
        toastId: id,
        eylem: secenekler.eylem,
      })
    }

    window.setTimeout(() => {
      setToastlar((onceki) => onceki.filter((toast) => toast.id !== id))
      setSonGeriAlma((onceki) => (onceki?.toastId === id ? null : onceki))
    }, secenekler.sure ?? 3200)
  }

  const merkezdenSayfayaGit = (sayfa) => {
    setGecisBalonu(sayfa)
    window.setTimeout(() => {
      setGecisBalonu('')
      sayfaDegistir(sayfa)
    }, 520)
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
      minimumStok: String(urun.minimumStok ?? 10),
    })
    setDuzenlemeAcik(true)
  }

  const formKaydet = (mod) => {
    const urunId = form.urunId.trim()
    const ad = form.ad.trim()
    const urunAdedi = Number(form.urunAdedi)
    const magazaStok = Number(form.magazaStok)
    const minimumStok = Number(form.minimumStok)

    if (!urunId || !ad || Number.isNaN(urunAdedi) || Number.isNaN(magazaStok) || Number.isNaN(minimumStok)) {
      toastGoster('hata', 'Ürün bilgileri eksik veya hatalı görünüyor.')
      return
    }

    if (negatifSayiVarMi(urunAdedi, magazaStok, minimumStok)) {
      toastGoster('hata', 'Ürün adedi ve stok alanları negatif olamaz.')
      return
    }

    const tekrarEdenUrunId = urunler.some((urun) => urun.urunId.toLowerCase() === urunId.toLowerCase() && (mod === 'ekle' || urun.uid !== seciliUid))
    if (tekrarEdenUrunId) {
      toastGoster('hata', `${urunId} ürün ID’si zaten kullanılıyor.`)
      return
    }

    if (mod === 'ekle') {
        const yeniUrun = {
          uid: Date.now(),
          urunId,
          kategori: 'Diğer',
          ad,
          avatar: ad.split(' ').slice(0, 2).map((parca) => parca[0]?.toUpperCase() || '').join('').slice(0, 2),
          urunAdedi,
          magazaStok,
          minimumStok,
          alisFiyati: 0,
          satisFiyati: 0,
          favori: false,
        }

      setUrunler((onceki) => [yeniUrun, ...onceki])
      setEklemeAcik(false)
      formuTemizle()
      setEnvanterSayfa(1)
      toastGoster('basari', `${ad} envantere eklendi.`)
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
          minimumStok,
          avatar: ad.split(' ').slice(0, 2).map((parca) => parca[0]?.toUpperCase() || '').join('').slice(0, 2),
        }
      }),
    )

    setDuzenlemeAcik(false)
    formuTemizle()
    toastGoster('basari', `${ad} bilgileri güncellendi.`)
  }

  const urunSil = () => {
    if (!silinecekUrun) return
    const silinenUrun = { ...silinecekUrun }
    const silinenAd = silinenUrun.ad
    const silinenIndex = urunler.findIndex((urun) => urun.uid === silinenUrun.uid)
    setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinenUrun.uid))
    setSilinecekUrun(null)
    toastGoster('basari', `${silinenAd} envanterden silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setUrunler((onceki) => {
          if (onceki.some((urun) => urun.uid === silinenUrun.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenUrun)
          return yeni
        })
        toastGoster('basari', `${silinenAd} geri alındı.`)
      },
    })
  }

  const urunDuzenlemeModaliniAc = (urun) => {
    setUrunDuzenlemeUid(urun.uid)
    setUrunDuzenlemeFormu({
      urunId: urun.urunId,
      ad: urun.ad,
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
      alisFiyati: String(urun.alisFiyati ?? 0),
      satisFiyati: String(urun.satisFiyati ?? 0),
    })
    setUrunDuzenlemeModalAcik(true)
  }

  const urunDuzenlemeKaydet = () => {
    const urunId = urunDuzenlemeFormu.urunId.trim()
    const ad = urunDuzenlemeFormu.ad.trim()
    const urunAdedi = Number(urunDuzenlemeFormu.urunAdedi)
    const magazaStok = Number(urunDuzenlemeFormu.magazaStok)
    const alisFiyati = Number(urunDuzenlemeFormu.alisFiyati)
    const satisFiyati = Number(urunDuzenlemeFormu.satisFiyati)

    if (!urunId || !ad || [urunAdedi, magazaStok, alisFiyati, satisFiyati].some((deger) => Number.isNaN(deger))) {
      toastGoster('hata', 'Ürün düzenleme alanlarında eksik veya hatalı veri var.')
      return
    }

    if (negatifSayiVarMi(urunAdedi, magazaStok, alisFiyati, satisFiyati)) {
      toastGoster('hata', 'Adet, stok ve fiyat alanları negatif olamaz.')
      return
    }

    const tekrarEdenUrunId = urunler.some((urun) => urun.urunId.toLowerCase() === urunId.toLowerCase() && urun.uid !== urunDuzenlemeUid)
    if (tekrarEdenUrunId) {
      toastGoster('hata', `${urunId} ürün ID’si zaten kullanılıyor.`)
      return
    }

    setUrunler((onceki) =>
      onceki.map((urun) =>
        urun.uid === urunDuzenlemeUid
          ? {
              ...urun,
              urunId,
              kategori: urun.kategori ?? 'Diğer',
              ad,
              urunAdedi,
              magazaStok,
              alisFiyati,
              satisFiyati,
              avatar: ad.split(' ').slice(0, 2).map((parca) => parca[0]?.toUpperCase() || '').join('').slice(0, 2),
            }
          : urun,
      ),
    )

    setUrunDuzenlemeModalAcik(false)
    setUrunDuzenlemeUid(null)
    setUrunDuzenlemeFormu(bosUrunDuzenlemeFormu)
    toastGoster('basari', `${ad} fiyat ve stok bilgileri kaydedildi.`)
  }

  const urunDuzenlemeSil = () => {
    if (!silinecekDuzenlemeUrunu) return
    const silinenUrun = { ...silinecekDuzenlemeUrunu }
    const silinenAd = silinenUrun.ad
    const silinenIndex = urunler.findIndex((urun) => urun.uid === silinenUrun.uid)
    setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinenUrun.uid))
    setSilinecekDuzenlemeUrunu(null)
    toastGoster('basari', `${silinenAd} ürün düzenleme listesinden kaldırıldı.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setUrunler((onceki) => {
          if (onceki.some((urun) => urun.uid === silinenUrun.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenUrun)
          return yeni
        })
        toastGoster('basari', `${silinenAd} geri alındı.`)
      },
    })
  }

  const favoriDegistir = (uid) => {
    setUrunler((onceki) => onceki.map((urun) => (urun.uid === uid ? { ...urun, favori: !urun.favori } : urun)))
  }

  const envanterSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamEnvanterSayfa) return
    setEnvanterSayfa(sayfa)
  }

  const urunDuzenlemeSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamUrunDuzenlemeSayfa) return
    setUrunDuzenlemeSayfa(sayfa)
  }

  const musteriSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamMusteriSayfa) return
    setMusteriSayfa(sayfa)
  }

  const siparisDuzenlemeAc = (siparis) => {
    setDuzenlenenSiparisNo(siparis.siparisNo)
    setSiparisFormu({
      musteri: siparis.musteri,
      urun: siparis.urun,
      toplamTutar: String(siparis.toplamTutar),
      siparisTarihi: siparis.siparisTarihi,
      odemeDurumu: siparis.odemeDurumu,
      urunHazirlik: siparis.urunHazirlik,
      teslimatDurumu: siparis.teslimatDurumu,
      teslimatSuresi: siparis.teslimatSuresi,
    })
  }

  const siparisDurumGuncellemeAc = (siparis) => {
    setDurumGuncellenenSiparisNo(siparis.siparisNo)
    setSiparisDurumFormu({
      odemeDurumu: siparis.odemeDurumu,
      urunHazirlik: siparis.urunHazirlik,
      teslimatDurumu: siparis.teslimatDurumu,
      teslimatSuresi: siparis.teslimatSuresi,
    })
  }

  const siparisFormuGuncelle = (alan, deger) => {
    setSiparisFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const siparisDurumFormuGuncelle = (alan, deger) => {
    setSiparisDurumFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const yeniSiparisPenceresiniAc = () => {
    setSiparisFormu({
      ...bosSiparisFormu,
      siparisTarihi: new Date().toISOString().slice(0, 10),
      teslimatSuresi: '2 iş günü',
    })
    setYeniSiparisAcik(true)
  }

  const yeniSiparisKaydet = () => {
    const musteri = siparisFormu.musteri.trim()
    const urun = siparisFormu.urun.trim()
    const siparisTarihi = siparisFormu.siparisTarihi
    const toplamTutar = Number(siparisFormu.toplamTutar)
    const odemeDurumu = siparisFormu.odemeDurumu.trim()
    const urunHazirlik = siparisFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisFormu.teslimatDurumu.trim()
    const teslimatSuresi = siparisFormu.teslimatSuresi.trim()

    if (!musteri || !urun || !siparisTarihi || !odemeDurumu || !urunHazirlik || !teslimatDurumu || !teslimatSuresi || Number.isNaN(toplamTutar)) {
      toastGoster('hata', 'Yeni sipariş formunda eksik veya hatalı bilgi var.')
      return
    }

    if (negatifSayiVarMi(toplamTutar)) {
      toastGoster('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }

    const enYuksekNo = siparisler.reduce((maksimum, siparis) => {
      const sayi = Number(String(siparis.siparisNo).replace(/[^\d]/g, ''))
      return Number.isNaN(sayi) ? maksimum : Math.max(maksimum, sayi)
    }, 0)

    const yeniSiparisNo = `#SP-${enYuksekNo + 1}`

    setSiparisler((onceki) => [
      {
        siparisNo: yeniSiparisNo,
        musteri,
        urun,
        toplamTutar,
        siparisTarihi,
        odemeDurumu,
        urunHazirlik,
        teslimatDurumu,
        teslimatSuresi,
      },
      ...onceki,
    ])

    setYeniSiparisAcik(false)
    setSiparisSayfa(1)
    setSiparisFormu(bosSiparisFormu)
    toastGoster('basari', `${yeniSiparisNo} numaralı yeni sipariş oluşturuldu.`)
  }

  const siparisDuzenlemeKaydet = () => {
    const musteri = siparisFormu.musteri.trim()
    const urun = siparisFormu.urun.trim()
    const siparisTarihi = siparisFormu.siparisTarihi
    const toplamTutar = Number(siparisFormu.toplamTutar)
    const odemeDurumu = siparisFormu.odemeDurumu.trim()
    const urunHazirlik = siparisFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisFormu.teslimatDurumu.trim()
    const teslimatSuresi = siparisFormu.teslimatSuresi.trim()

    if (!musteri || !urun || !siparisTarihi || !odemeDurumu || !urunHazirlik || !teslimatDurumu || !teslimatSuresi || Number.isNaN(toplamTutar)) {
      toastGoster('hata', 'Sipariş düzenleme alanlarında eksik veya hatalı bilgi var.')
      return
    }

    if (negatifSayiVarMi(toplamTutar)) {
      toastGoster('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }

    setSiparisler((onceki) =>
      onceki.map((siparis) =>
        siparis.siparisNo === duzenlenenSiparisNo
          ? {
              ...siparis,
              musteri,
              urun,
              toplamTutar,
              siparisTarihi,
              odemeDurumu,
              urunHazirlik,
              teslimatDurumu,
              teslimatSuresi,
            }
          : siparis,
      ),
    )

    setDuzenlenenSiparisNo(null)
    setSiparisFormu(bosSiparisFormu)
    toastGoster('basari', `${musteri} için sipariş kaydı güncellendi.`)
  }

  const siparisDurumKaydet = () => {
    if (!durumGuncellenenSiparisNo) return
    const odemeDurumu = siparisDurumFormu.odemeDurumu.trim()
    const urunHazirlik = siparisDurumFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisDurumFormu.teslimatDurumu.trim()
    const teslimatSuresi = siparisDurumFormu.teslimatSuresi.trim()

    if (!odemeDurumu || !urunHazirlik || !teslimatDurumu || !teslimatSuresi) {
      toastGoster('hata', 'Durum güncelleme alanlarında boşluk bırakılamaz.')
      return
    }

    setSiparisler((onceki) =>
      onceki.map((siparis) =>
        siparis.siparisNo === durumGuncellenenSiparisNo
          ? {
              ...siparis,
              odemeDurumu,
              urunHazirlik,
              teslimatDurumu,
              teslimatSuresi,
            }
          : siparis,
      ),
    )

    setDurumGuncellenenSiparisNo(null)
    toastGoster('basari', `${durumGuncellenenSiparisNo} durumu güncellendi.`)
  }

  const siparisSil = () => {
    if (!silinecekSiparis) return
    const silinenSiparis = { ...silinecekSiparis }
    const silinenNo = silinenSiparis.siparisNo
    const silinenIndex = siparisler.findIndex((siparis) => siparis.siparisNo === silinenNo)
    setSiparisler((onceki) => onceki.filter((siparis) => siparis.siparisNo !== silinenNo))
    setSilinecekSiparis(null)
    toastGoster('basari', `${silinenNo} siparişi silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setSiparisler((onceki) => {
          if (onceki.some((siparis) => siparis.siparisNo === silinenNo)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenSiparis)
          return yeni
        })
        toastGoster('basari', `${silinenNo} geri alındı.`)
      },
    })
  }

  const telefonAramasiBaslat = (telefon, etiket = 'Kayıt') => {
    if (!telefon) {
      toastGoster('hata', `${etiket} için telefon bilgisi bulunamadı.`)
      return
    }

    window.location.href = `tel:${telefon.replace(/\s+/g, '')}`
  }

  const siparisMusteriAra = (siparis) => {
    const musteriKaydi = musteriler.find(
      (musteri) => metniNormalizeEt(musteri.ad) === metniNormalizeEt(siparis.musteri),
    )
    const telefon = musteriKaydi?.telefon ?? siparisMusteriTelefonlari[siparis.musteri]
    telefonAramasiBaslat(telefon, siparis.musteri)
  }

  const aiMesajGonder = (hazirMetin) => {
    const metin = (hazirMetin ?? aiMesajMetni).trim()
    if (!metin) return

    const normalizeMetin = metniNormalizeEt(metin)
    setAiHizliKonularAcik(false)

    setAiMesajlar((onceki) => [
      ...onceki,
      {
        id: Date.now(),
        rol: 'kullanici',
        metin,
        saat: 'Şimdi',
      },
    ])
    if (!hazirMetin) setAiMesajMetni('')

    if (normalizeMetin === metniNormalizeEt('Diğer')) {
      setAiHizliKonularAcik(false)
      return
    }

    const hazirCevap = aiHazirCevaplar[normalizeMetin]
    if (!hazirCevap) return

    window.setTimeout(() => {
      setAiMesajlar((onceki) => [
        ...onceki,
        {
          id: Date.now() + 1,
          rol: 'bot',
          metin: hazirCevap,
          saat: 'Şimdi',
        },
      ])
    }, 320)
  }

  useEffect(() => {
    if (!aiPanelKapaniyor) return undefined

    const zamanlayici = window.setTimeout(() => {
      setAiPanelAcik(false)
      setAiPanelKapaniyor(false)
    }, 260)

    return () => window.clearTimeout(zamanlayici)
  }, [aiPanelKapaniyor])

  useEffect(() => {
    if (!bildirimPanelKapaniyor) return undefined

    const zamanlayici = window.setTimeout(() => {
      setBildirimPanelAcik(false)
      setBildirimPanelKapaniyor(false)
    }, 240)

    return () => window.clearTimeout(zamanlayici)
  }, [bildirimPanelKapaniyor])

  useEffect(() => {
    const aktifBildirimIdleri = tumBildirimler.map((bildirim) => bildirim.id)
    setOkunanBildirimler((onceki) => onceki.filter((id) => aktifBildirimIdleri.includes(id)))
    setTemizlenenBildirimler((onceki) => onceki.filter((id) => aktifBildirimIdleri.includes(id)))
  }, [tumBildirimler])

  const aiPaneliAc = () => {
    setAiTemaMenuAcik(false)
    setAiPanelKapaniyor(false)
    setAiHizliKonularAcik(true)
    setAiPanelAcik(true)
    setAiPanelKucuk(false)
  }

  const aiPaneliKapat = () => {
    setAiTemaMenuAcik(false)
    setAiPanelKapaniyor(true)
  }

  const aiPanelDugmeTikla = () => {
    if (aiPanelAcik && !aiPanelKucuk && !aiPanelKapaniyor) {
      aiPaneliKapat()
      return
    }

    aiPaneliAc()
  }

  const bildirimPaneliKapat = () => {
    setBildirimPanelKapaniyor(true)
  }

  const bildirimPaneliAc = () => {
    setBildirimPanelKapaniyor(false)
    setBildirimPanelAcik(true)
  }

  const bildirimDugmesiTikla = () => {
    if (bildirimPanelAcik && !bildirimPanelKapaniyor) {
      bildirimPaneliKapat()
      return
    }

    bildirimPaneliAc()
  }

  const bildirimiOkunduYap = (bildirimId) => {
    setOkunanBildirimler((onceki) => (onceki.includes(bildirimId) ? onceki : [...onceki, bildirimId]))
  }

  const bildirimiOkunmadiYap = (bildirimId) => {
    setOkunanBildirimler((onceki) => onceki.filter((id) => id !== bildirimId))
  }

  const bildirimiTemizle = (bildirimId) => {
    setTemizlenenBildirimler((onceki) => (onceki.includes(bildirimId) ? onceki : [...onceki, bildirimId]))
    setOkunanBildirimler((onceki) => onceki.filter((id) => id !== bildirimId))
  }

  const tumBildirimleriTemizle = () => {
    setTemizlenenBildirimler(bildirimler.map((bildirim) => bildirim.id))
    toastGoster('basari', 'Tüm bildirimler temizlendi.')
  }

  const bildirimdenSayfayaGit = (bildirim) => {
    bildirimiOkunduYap(bildirim.id)
    bildirimPaneliKapat()
    if (bildirim.sayfa === 'urun-duzenleme' && bildirim.sekme) {
      setUrunDuzenlemeSekmesi(bildirim.sekme)
    }
    if (bildirim.sayfa === 'odemeler' && bildirim.sekme) {
      setOdemeSekmesi(bildirim.sekme)
    }
    sayfaDegistir(bildirim.sayfa)
  }

  const globalAramaSonucunuAc = (sonuc) => {
    if (sonuc.hedef === 'envanter') {
      sayfaDegistir('envanter')
      setEnvanterKategori('Tümü')
      setAramaMetni(sonuc.deger)
      setEnvanterSayfa(1)
    }

    if (sonuc.hedef === 'siparisler-aktif') {
      sayfaDegistir('siparisler')
      setSiparisSekmesi('aktif')
      setSiparisArama(sonuc.deger)
      setSiparisSayfa(1)
    }

    if (sonuc.hedef === 'siparisler-gecmis') {
      sayfaDegistir('siparisler')
      setSiparisSekmesi('gecmis')
      setGecmisSiparisArama(sonuc.deger)
      setGecmisSiparisSayfa(1)
    }

    if (sonuc.hedef === 'musteriler') {
      sayfaDegistir('musteriler')
      setMusteriArama(sonuc.deger)
      setMusteriSayfa(1)
    }

    if (sonuc.hedef === 'alicilar') {
      sayfaDegistir('alicilar')
      setTedarikciSekmesi('liste')
      setTedarikciArama(sonuc.deger)
      setTedarikciSayfa(1)
      if (sonuc.uid) {
        setSeciliTedarikciUid(sonuc.uid)
        setTedarikciDetaySekmesi('genel')
        setTedarikciDetayAcik(true)
      }
    }

    if (sonuc.hedef === 'faturalama') {
      sayfaDegistir('faturalama')
      setFaturaSekmesi('gecmis')
      setFaturaArama(sonuc.deger)
      if (sonuc.uid) {
        setSeciliFaturaId(sonuc.uid)
        setFaturaDetayAcik(true)
      }
    }

    setGlobalAramaMetni('')
    setGlobalAramaMobilAcik(false)
  }

  const musteriFormuTemizle = () => {
    setSeciliMusteriUid(null)
    setMusteriFormu(bosMusteriFormu)
    setMusteriNotMetni('')
  }

  const musteriEklemeAc = () => {
    musteriFormuTemizle()
    setMusteriEklemeAcik(true)
  }

  const musteriDuzenlemeAc = (musteri) => {
    setSeciliMusteriUid(musteri.uid)
    setMusteriFormu({
      ad: musteri.ad,
      telefon: musteri.telefon,
      sonAlim: musteri.sonAlim,
      toplamSiparis: String(musteri.toplamSiparis),
      toplamHarcama: String(musteri.toplamHarcama),
      not: musteri.not,
    })
    setMusteriDuzenlemeAcik(true)
  }

  const musteriNotAc = (musteri) => {
    setSeciliMusteriUid(musteri.uid)
    setMusteriNotMetni(musteri.not)
    setMusteriNotAcik(true)
  }

  const musteriFormuGuncelle = (alan, deger) => {
    setMusteriFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const musteriFavoriDegistir = (uid) => {
    setMusteriler((onceki) => onceki.map((musteri) => (musteri.uid === uid ? { ...musteri, favori: !musteri.favori } : musteri)))
  }

  const musteriKaydet = (mod) => {
    const ad = musteriFormu.ad.trim()
    const telefon = musteriFormu.telefon.trim()
    const sonAlim = musteriFormu.sonAlim
    const toplamSiparis = Number(musteriFormu.toplamSiparis)
    const toplamHarcama = Number(musteriFormu.toplamHarcama)
    const not = musteriFormu.not.trim()

    if (!ad || !telefon || !sonAlim || !not || Number.isNaN(toplamSiparis) || Number.isNaN(toplamHarcama)) {
      toastGoster('hata', 'Müşteri formunda eksik veya hatalı alan var.')
      return
    }

    if (!telefonGecerliMi(telefon)) {
      toastGoster('hata', 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalı.')
      return
    }

    if (negatifSayiVarMi(toplamSiparis, toplamHarcama)) {
      toastGoster('hata', 'Sipariş sayısı ve harcama negatif olamaz.')
      return
    }

    if (mod === 'ekle') {
      setMusteriler((onceki) => [
        {
          uid: Date.now(),
          ad,
          telefon,
          sonAlim,
          toplamSiparis,
          toplamHarcama,
          not,
          favori: false,
        },
        ...onceki,
      ])
      setMusteriEklemeAcik(false)
      setMusteriSayfa(1)
      toastGoster('basari', `${ad} müşteri listesine eklendi.`)
    } else {
      setMusteriler((onceki) =>
        onceki.map((musteri) =>
          musteri.uid === seciliMusteriUid
            ? { ...musteri, ad, telefon, sonAlim, toplamSiparis, toplamHarcama, not }
            : musteri,
        ),
      )
      setMusteriDuzenlemeAcik(false)
      toastGoster('basari', `${ad} müşteri kaydı güncellendi.`)
    }

    musteriFormuTemizle()
  }

  const musteriNotKaydet = () => {
    const temizNot = musteriNotMetni.trim()
    if (!temizNot) {
      toastGoster('hata', 'Müşteri notu boş bırakılamaz.')
      return
    }

    const seciliMusteri = musteriler.find((musteri) => musteri.uid === seciliMusteriUid)
    setMusteriler((onceki) =>
      onceki.map((musteri) =>
        musteri.uid === seciliMusteriUid
          ? { ...musteri, not: temizNot }
          : musteri,
      ),
    )
    setMusteriNotAcik(false)
    setSeciliMusteriUid(null)
    setMusteriNotMetni('')
    toastGoster('basari', `${seciliMusteri?.ad ?? 'Müşteri'} notu kaydedildi.`)
  }

  const musteriSil = () => {
    const silinenMusteri = { ...silinecekMusteri }
    const silinenAd = silinenMusteri.ad
    const silinenIndex = musteriler.findIndex((musteri) => musteri.uid === silinenMusteri.uid)
    setMusteriler((onceki) => onceki.filter((musteri) => musteri.uid !== silinenMusteri.uid))
    setSilinecekMusteri(null)
    toastGoster('basari', `${silinenAd} müşteri listesinden silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setMusteriler((onceki) => {
          if (onceki.some((musteri) => musteri.uid === silinenMusteri.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenMusteri)
          return yeni
        })
        toastGoster('basari', `${silinenAd} geri alındı.`)
      },
    })
  }

  const tedarikciFormuTemizle = () => {
    setSeciliTedarikciUid(null)
    setTedarikciFormu(bosTedarikciFormu)
    setTedarikciNotMetni('')
    setTedarikciDetaySekmesi('genel')
  }

  const tedarikciSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamTedarikciSayfa) return
    setTedarikciSayfa(sayfa)
  }

  const tedarikciSiparisSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamTedarikSiparisSayfa) return
    setTedarikciSiparisSayfa(sayfa)
  }

  const tedarikciEklemeAc = () => {
    tedarikciFormuTemizle()
    setTedarikciEklemeAcik(true)
  }

  const tedarikciDuzenlemeAc = (tedarikci) => {
    setSeciliTedarikciUid(tedarikci.uid)
    setTedarikciFormu({
      firmaAdi: tedarikci.firmaAdi,
      yetkiliKisi: tedarikci.yetkiliKisi,
      telefon: tedarikci.telefon,
      email: tedarikci.email,
      adres: tedarikci.adres,
      vergiNumarasi: tedarikci.vergiNumarasi,
      urunGrubu: tedarikci.urunGrubu,
      not: tedarikci.not,
      toplamAlisSayisi: String(tedarikci.toplamAlisSayisi),
      ortalamaTeslimSuresi: tedarikci.ortalamaTeslimSuresi,
      toplamHarcama: String(tedarikci.toplamHarcama),
    })
    setTedarikciDuzenlemeAcik(true)
  }

  const tedarikciDetayAc = (tedarikci) => {
    setSeciliTedarikciUid(tedarikci.uid)
    setTedarikciDetaySekmesi('genel')
    setTedarikciDetayAcik(true)
  }

  const tedarikciNotAc = (tedarikci) => {
    setSeciliTedarikciUid(tedarikci.uid)
    setTedarikciNotMetni(tedarikci.not)
    setTedarikciNotAcik(true)
  }

  const tedarikciFormuGuncelle = (alan, deger) => {
    setTedarikciFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const tedarikciFavoriDegistir = (uid) => {
    setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === uid ? { ...tedarikci, favori: !tedarikci.favori } : tedarikci)))
  }

  const epostaGecerliMi = (eposta) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)

  const tedarikciKaydet = (mod) => {
    const firmaAdi = tedarikciFormu.firmaAdi.trim()
    const yetkiliKisi = tedarikciFormu.yetkiliKisi.trim()
    const telefon = tedarikciFormu.telefon.trim()
    const email = tedarikciFormu.email.trim()
    const adres = tedarikciFormu.adres.trim()
    const vergiNumarasi = tedarikciFormu.vergiNumarasi.trim()
    const urunGrubu = tedarikciFormu.urunGrubu.trim()
    const not = tedarikciFormu.not.trim()
    const toplamAlisSayisi = Number(tedarikciFormu.toplamAlisSayisi)
    const toplamHarcama = Number(tedarikciFormu.toplamHarcama)
    const ortalamaTeslimSuresi = tedarikciFormu.ortalamaTeslimSuresi.trim()

    if (!firmaAdi || !yetkiliKisi || !telefon || !email || !adres || !vergiNumarasi || !urunGrubu || !not || !ortalamaTeslimSuresi || Number.isNaN(toplamAlisSayisi) || Number.isNaN(toplamHarcama)) {
      toastGoster('hata', 'Tedarikçi formunda eksik veya hatalı alan var.')
      return
    }

    if (!telefonGecerliMi(telefon)) {
      toastGoster('hata', 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalı.')
      return
    }

    if (!epostaGecerliMi(email)) {
      toastGoster('hata', 'Geçerli bir e-posta adresi girin.')
      return
    }

    if (!/^\d{10}$/.test(telefonuNormalizeEt(vergiNumarasi))) {
      toastGoster('hata', 'Vergi numarası 10 haneli olmalı.')
      return
    }

    if (negatifSayiVarMi(toplamAlisSayisi, toplamHarcama)) {
      toastGoster('hata', 'Alış sayısı ve toplam harcama negatif olamaz.')
      return
    }

    if (mod === 'ekle') {
      setTedarikciler((onceki) => [
        {
          uid: Date.now(),
          firmaAdi,
          yetkiliKisi,
          telefon,
          email,
          adres,
          vergiNumarasi,
          urunGrubu,
          toplamAlisSayisi,
          ortalamaTeslimSuresi,
          toplamHarcama,
          not,
          alinanUrunler: [],
          siparisler: [],
          fiyatGecmisi: [],
          favori: false,
        },
        ...onceki,
      ])
      setTedarikciEklemeAcik(false)
      setTedarikciSayfa(1)
      toastGoster('basari', `${firmaAdi} tedarikçi listesine eklendi.`)
    } else {
      setTedarikciler((onceki) =>
        onceki.map((tedarikci) =>
          tedarikci.uid === seciliTedarikciUid
            ? { ...tedarikci, firmaAdi, yetkiliKisi, telefon, email, adres, vergiNumarasi, urunGrubu, toplamAlisSayisi, ortalamaTeslimSuresi, toplamHarcama, not }
            : tedarikci,
        ),
      )
      setTedarikciDuzenlemeAcik(false)
      toastGoster('basari', `${firmaAdi} tedarikçi kaydı güncellendi.`)
    }

    tedarikciFormuTemizle()
  }

  const tedarikciNotKaydet = () => {
    const temizNot = tedarikciNotMetni.trim()
    if (!temizNot) {
      toastGoster('hata', 'Tedarikçi notu boş bırakılamaz.')
      return
    }

    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === seciliTedarikciUid)
    setTedarikciler((onceki) =>
      onceki.map((tedarikci) => (tedarikci.uid === seciliTedarikciUid ? { ...tedarikci, not: temizNot } : tedarikci)),
    )
    setTedarikciNotAcik(false)
    setSeciliTedarikciUid(null)
    setTedarikciNotMetni('')
    toastGoster('basari', `${secili?.firmaAdi ?? 'Tedarikçi'} notu kaydedildi.`)
  }

  const tedarikciSiparisFormuGuncelle = (alan, deger) => {
    setTedarikciSiparisFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const genelTedarikSiparisFormuGuncelle = (alan, deger) => {
    setGenelTedarikSiparisFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const tedarikciSiparisEklemeAc = () => {
    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === seciliTedarikciUid)
    const sonSiparis = secili?.siparisler?.[0]
    const onEk = secili
      ? secili.firmaAdi
          .split(' ')
          .map((parca) => parca[0] || '')
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'TD'
    const sonNumara = sonSiparis ? Number(String(sonSiparis.siparisNo).replace(/[^\d]/g, '')) : 100

    setTedarikciSiparisFormu({
      siparisNo: `${onEk}-${sonNumara + 1}`,
      tarih: new Date().toISOString().slice(0, 10),
      tutar: '',
      durum: 'Bekliyor',
    })
    setTedarikciSiparisEklemeAcik(true)
  }

  const genelTedarikSiparisEklemeAc = () => {
    const ilkTedarikci = tedarikciler[0]
    const onEk = ilkTedarikci
      ? ilkTedarikci.firmaAdi
          .split(' ')
          .map((parca) => parca[0] || '')
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'TD'
    const sonNumara = tumTedarikSiparisleri[0] ? Number(String(tumTedarikSiparisleri[0].siparisNo).replace(/[^\d]/g, '')) : 100

    setGenelTedarikSiparisFormu({
      tedarikciUid: ilkTedarikci ? String(ilkTedarikci.uid) : '',
      siparisNo: `${onEk}-${sonNumara + 1}`,
      tarih: new Date().toISOString().slice(0, 10),
      tutar: '',
      durum: 'Bekliyor',
    })
    setGenelTedarikSiparisAcik(true)
  }

  const tedarikciSiparisKaydet = () => {
    const siparisNo = tedarikciSiparisFormu.siparisNo.trim()
    const tarih = tedarikciSiparisFormu.tarih
    const tutar = Number(tedarikciSiparisFormu.tutar)
    const durum = tedarikciSiparisFormu.durum.trim()

    if (!seciliTedarikciUid || !siparisNo || !tarih || !durum || Number.isNaN(tutar)) {
      toastGoster('hata', 'Tedarikçi siparişi formunda eksik veya hatalı bilgi var.')
      return
    }

    if (negatifSayiVarMi(tutar)) {
      toastGoster('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }

    const tekrarVar = tedarikciler.some((tedarikci) =>
      tedarikci.uid === seciliTedarikciUid &&
      tedarikci.siparisler.some((siparis) => siparis.siparisNo.toLowerCase() === siparisNo.toLowerCase()),
    )

    if (tekrarVar) {
      toastGoster('hata', 'Bu sipariş numarası zaten mevcut.')
      return
    }

    setTedarikciler((onceki) =>
      onceki.map((tedarikci) =>
        tedarikci.uid === seciliTedarikciUid
          ? {
              ...tedarikci,
              siparisler: [{ siparisNo, tarih, tutar, durum }, ...tedarikci.siparisler],
              toplamAlisSayisi: tedarikci.toplamAlisSayisi + 1,
              toplamHarcama: tedarikci.toplamHarcama + tutar,
            }
          : tedarikci,
      ),
    )

    setTedarikciSiparisEklemeAcik(false)
    setTedarikciSiparisFormu(bosTedarikciSiparisFormu)
    toastGoster('basari', `${siparisNo} numaralı tedarikçi siparişi oluşturuldu.`)
  }

  const genelTedarikSiparisKaydet = () => {
    const tedarikciUid = Number(genelTedarikSiparisFormu.tedarikciUid)
    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === tedarikciUid)
    const siparisNo = genelTedarikSiparisFormu.siparisNo.trim()
    const tarih = genelTedarikSiparisFormu.tarih
    const tutar = Number(genelTedarikSiparisFormu.tutar)
    const durum = genelTedarikSiparisFormu.durum.trim()

    if (!tedarikciUid || !secili || !siparisNo || !tarih || !durum || Number.isNaN(tutar)) {
      toastGoster('hata', 'Yeni tedarik siparişi için eksik veya hatalı alan var.')
      return
    }

    if (negatifSayiVarMi(tutar)) {
      toastGoster('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }

    const tekrarVar = tedarikciler.some((tedarikci) =>
      tedarikci.uid === tedarikciUid &&
      tedarikci.siparisler.some((siparis) => siparis.siparisNo.toLowerCase() === siparisNo.toLowerCase()),
    )

    if (tekrarVar) {
      toastGoster('hata', 'Bu tedarikçi için aynı sipariş numarası zaten mevcut.')
      return
    }

    setTedarikciler((onceki) =>
      onceki.map((tedarikci) =>
        tedarikci.uid === tedarikciUid
          ? {
              ...tedarikci,
              siparisler: [{ siparisNo, tarih, tutar, durum }, ...tedarikci.siparisler],
              toplamAlisSayisi: tedarikci.toplamAlisSayisi + 1,
              toplamHarcama: tedarikci.toplamHarcama + tutar,
            }
          : tedarikci,
      ),
    )

    setGenelTedarikSiparisAcik(false)
    setTedarikciSiparisSayfa(1)
    setGenelTedarikSiparisFormu({ tedarikciUid: '', ...bosTedarikciSiparisFormu })
    toastGoster('basari', `${secili.firmaAdi} için ${siparisNo} numaralı sipariş oluşturuldu.`)
  }

  const tedarikciSil = () => {
    const silinenAd = silinecekTedarikci.firmaAdi
    const silinenTedarikci = { ...silinecekTedarikci }
    const silinenIndex = tedarikciler.findIndex((tedarikci) => tedarikci.uid === silinenTedarikci.uid)
    setTedarikciler((onceki) => onceki.filter((tedarikci) => tedarikci.uid !== silinenTedarikci.uid))
    setSilinecekTedarikci(null)
    if (seciliTedarikciUid === silinenTedarikci.uid) {
      setTedarikciDetayAcik(false)
      setSeciliTedarikciUid(null)
    }
    toastGoster('basari', `${silinenAd} tedarikçi listesinden silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setTedarikciler((onceki) => {
          if (onceki.some((tedarikci) => tedarikci.uid === silinenTedarikci.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenTedarikci)
          return yeni
        })
        toastGoster('basari', `${silinenAd} geri alındı.`)
      },
    })
  }

  const faturaNumarasiOlustur = () => `FTR-${new Date().getFullYear()}-${String(faturalar.length + 1).padStart(3, '0')}`

  const faturaFormunuSifirla = () => {
    setFaturaFormu({
      ...bosFaturaFormu,
      tarih: new Date().toISOString().slice(0, 10),
      odemeTarihi: new Date().toISOString().slice(0, 10),
      satirlar: [bosFaturaSatiri(Date.now())],
    })
  }

  const faturaFormuGuncelle = (alan, deger) => {
    setFaturaFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const faturaTuruDegistir = (tur) => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      tur,
      karsiTarafUid: '',
      karsiTarafAdi: '',
      satirlar: onceki.satirlar.map((satir) => ({ ...satir, birimFiyat: 0, urunUid: '', urun: '' })),
    }))
  }

  const faturaKarsiTarafDegistir = (uid) => {
    const secili = faturaKarsiTaraflar.find((kayit) => String(kayit.uid) === String(uid))
    setFaturaFormu((onceki) => ({
      ...onceki,
      karsiTarafUid: uid,
      karsiTarafAdi: secili?.ad ?? '',
    }))
  }

  const faturaSatiriGuncelle = (satirId, alan, deger) => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      satirlar: onceki.satirlar.map((satir) => {
        if (satir.id !== satirId) return satir
        if (alan === 'urunUid') {
          const urun = urunler.find((item) => String(item.uid) === String(deger))
          return {
            ...satir,
            urunUid: deger,
            urun: urun?.ad ?? '',
            birimFiyat: urun ? (onceki.tur === 'Satış Faturası' ? urun.satisFiyati : urun.alisFiyati) : 0,
          }
        }
        return { ...satir, [alan]: deger }
      }),
    }))
  }

  const faturaSatiriEkle = () => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      satirlar: [...onceki.satirlar, bosFaturaSatiri(Date.now() + onceki.satirlar.length)],
    }))
  }

  const faturaSatiriSil = (satirId) => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      satirlar: onceki.satirlar.length === 1 ? onceki.satirlar : onceki.satirlar.filter((satir) => satir.id !== satirId),
    }))
  }

  const faturaDetayAc = (fatura) => {
    setSeciliFaturaId(fatura.id)
    setFaturaDetayAcik(true)
  }

  const faturayiYazdir = (fatura, pdfModu = false) => {
    if (!fatura?.satirlar?.length || !fatura?.karsiTarafAdi) {
      toastGoster('hata', 'Yazdırma için önce fatura bilgilerini tamamlayın.')
      return
    }

    const karsiTaraf = fatura.tur === 'Satış Faturası'
      ? musteriler.find((musteri) => String(musteri.uid) === String(fatura.karsiTarafUid))
      : tedarikciler.find((tedarikci) => String(tedarikci.uid) === String(fatura.karsiTarafUid))
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.visibility = 'hidden'

    const temizle = () => {
      window.setTimeout(() => {
        iframe.remove()
      }, 400)
    }

    iframe.onload = () => {
      window.setTimeout(() => {
        try {
          iframe.contentWindow?.focus()
          iframe.contentWindow?.print()
          iframe.contentWindow?.addEventListener('afterprint', temizle, { once: true })
          window.setTimeout(temizle, 1500)
        } catch {
          temizle()
          setPdfOnizlemeAcik(true)
          if (fatura.id !== 'onizleme') setSeciliFaturaId(fatura.id)
          toastGoster('uyari', 'Yazdırma başlatılamadı. Önizleme açıldı.')
        }
      }, 180)
    }

    document.body.appendChild(iframe)
    iframe.srcdoc = faturaBelgeTamHtmlOlustur(fatura, karsiTaraf)
  }

  const faturayiPdfIndir = (fatura) => {
    if (!fatura?.satirlar?.length || !fatura?.karsiTarafAdi) {
      toastGoster('hata', 'PDF indirmek için önce fatura bilgilerini tamamlayın.')
      return
    }

    const karsiTaraf = fatura.tur === 'Satış Faturası'
      ? musteriler.find((musteri) => String(musteri.uid) === String(fatura.karsiTarafUid))
      : tedarikciler.find((tedarikci) => String(tedarikci.uid) === String(fatura.karsiTarafUid))

    const kap = document.createElement('div')
    kap.style.position = 'fixed'
    kap.style.left = '-99999px'
    kap.style.top = '0'
    kap.style.width = '794px'
    kap.style.background = '#ffffff'
    kap.innerHTML = faturaBelgeHtmlOlustur(fatura, karsiTaraf)
    document.body.appendChild(kap)

    const gorseller = Array.from(kap.querySelectorAll('img'))
    const bekleyenler = gorseller.map((gorsel) =>
      gorsel.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            gorsel.onload = () => resolve()
            gorsel.onerror = () => resolve()
          }),
    )

    Promise.all(bekleyenler)
      .then(() => new Promise((resolve) => window.setTimeout(resolve, 120)))
      .then(async () => {
        const { html2canvas, jsPDF } = await pdfKutuphaneleriniYukle()
        const canvas = await html2canvas(kap, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
        })
        const pdf = new jsPDF('p', 'mm', 'a4')
        const sayfaGenislik = pdf.internal.pageSize.getWidth()
        const sayfaYuksekligi = pdf.internal.pageSize.getHeight()
        const gorselYuksekligi = (canvas.height * sayfaGenislik) / canvas.width
        const gorsel = canvas.toDataURL('image/png')
        let kalanYukseklik = gorselYuksekligi
        let konum = 0

        pdf.addImage(gorsel, 'PNG', 0, konum, sayfaGenislik, gorselYuksekligi, undefined, 'FAST')
        kalanYukseklik -= sayfaYuksekligi

        while (kalanYukseklik > 0) {
          konum = kalanYukseklik - gorselYuksekligi
          pdf.addPage()
          pdf.addImage(gorsel, 'PNG', 0, konum, sayfaGenislik, gorselYuksekligi, undefined, 'FAST')
          kalanYukseklik -= sayfaYuksekligi
        }

        pdf.save(`${fatura.faturaNo}.pdf`)
        toastGoster('basari', `${fatura.faturaNo} PDF olarak indirildi.`)
      })
      .catch(() => {
        setPdfOnizlemeAcik(true)
        if (fatura.id !== 'onizleme') setSeciliFaturaId(fatura.id)
        toastGoster('uyari', 'PDF indirme sırasında önizleme açıldı.')
      })
      .finally(() => {
        kap.remove()
      })
  }

  const faturaKaydet = () => {
    const karsiTarafAdi = (seciliFaturaKarsiTaraf?.ad ?? faturaFormu.karsiTarafAdi).trim()
    const gecerliSatirlar = faturaFormu.satirlar
      .filter((satir) => satir.urun.trim())
      .map((satir) => ({
        ...satir,
        miktar: Number(satir.miktar),
        birimFiyat: Number(satir.birimFiyat),
        kdvOrani: Number(satir.kdvOrani ?? FATURA_KDV_ORANI),
      }))

    if (!faturaFormu.tarih || !faturaFormu.odemeTarihi || !karsiTarafAdi || !faturaFormu.karsiTarafUid || !gecerliSatirlar.length) {
      toastGoster('hata', 'Fatura oluşturmak için tüm zorunlu alanları doldurun.')
      return
    }

    if (gecerliSatirlar.some((satir) => !satir.urun.trim() || Number.isNaN(satir.miktar) || Number.isNaN(satir.birimFiyat) || satir.miktar <= 0 || satir.birimFiyat < 0)) {
      toastGoster('hata', 'Fatura satırlarında eksik veya hatalı bilgi var.')
      return
    }

    const yeniFatura = faturaKaydiOlustur({
      id: Date.now(),
      faturaNo: faturaNumarasiOlustur(),
      tur: faturaFormu.tur,
      karsiTarafUid: Number(faturaFormu.karsiTarafUid),
      karsiTarafAdi,
      tarih: faturaFormu.tarih,
      odemeTarihi: faturaFormu.odemeTarihi,
      satirlar: gecerliSatirlar,
      not: faturaFormu.not.trim(),
      durum: 'Hazır',
    })

    setFaturalar((onceki) => [yeniFatura, ...onceki])
    setFaturaSekmesi('gecmis')
    faturaFormunuSifirla()
    toastGoster('basari', `${yeniFatura.faturaNo} numaralı fatura oluşturuldu.`)
  }

  const faturaPdfOnizlemeAc = (fatura = faturaOnizleme) => {
    if (!fatura.satirlar.length || !fatura.karsiTarafAdi) {
      toastGoster('hata', 'PDF önizlemesi için önce fatura bilgilerini tamamlayın.')
      return
    }
    if (fatura.id !== 'onizleme') {
      setSeciliFaturaId(fatura.id)
    } else {
      setSeciliFaturaId(null)
    }
    setPdfOnizlemeAcik(true)
  }

  const ozetKartiniSil = (baslik) => {
    setGizlenenOzetKartlari((onceki) => [...onceki, baslik])
    setAcikOzetMenusu('')
    toastGoster('basari', `${baslik} kartı dashboard'dan kaldırıldı.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setGizlenenOzetKartlari((onceki) => onceki.filter((oge) => oge !== baslik))
        toastGoster('basari', `${baslik} kartı geri alındı.`)
      },
    })
  }

  const dashboardBolumGorunurlukDegistir = (anahtar) => {
    setGorunenDashboardBolumleri((onceki) => ({
      ...onceki,
      [anahtar]: !onceki[anahtar],
    }))
  }

  const odemeListesiGuncelle = (sekme, guncelleyici) => {
    if (sekme === 'gelen') {
      setGelenNakitListesi((onceki) => guncelleyici(onceki))
      return
    }
    setGidenNakitListesi((onceki) => guncelleyici(onceki))
  }

  const finansFavoriDegistir = (sekme, odemeNo) => {
    odemeListesiGuncelle(sekme, (onceki) =>
      onceki.map((kayit) => (kayit.odemeNo === odemeNo ? { ...kayit, favori: !kayit.favori } : kayit)),
    )
  }

  const odemeDuzenlemeAc = (sekme, kayit) => {
    setDuzenlenenOdeme({ sekme, odemeNo: kayit.odemeNo })
    setOdemeFormu({
      taraf: kayit.taraf,
      tarih: kayit.tarih,
      durum: kayit.durum,
      tutar: String(kayit.tutar),
    })
  }

  const odemeDuzenlemeKaydet = () => {
    if (!duzenlenenOdeme) return
    const tutar = Number(String(odemeFormu.tutar).replace(/[^\d.-]/g, ''))
    const taraf = odemeFormu.taraf.trim()
    const tarih = odemeFormu.tarih.trim()
    const durum = odemeFormu.durum.trim()

    if (!taraf || !tarih || !durum || Number.isNaN(tutar)) {
      toastGoster('hata', 'Finansal akış kaydında eksik veya hatalı bilgi var.')
      return
    }

    if (negatifSayiVarMi(tutar)) {
      toastGoster('hata', 'Ödeme veya tahsilat tutarı negatif olamaz.')
      return
    }

    odemeListesiGuncelle(duzenlenenOdeme.sekme, (onceki) =>
      onceki.map((kayit) =>
        kayit.odemeNo === duzenlenenOdeme.odemeNo
          ? { ...kayit, taraf, tarih, durum, tutar }
          : kayit,
      ),
    )
    setDuzenlenenOdeme(null)
    toastGoster('basari', `${taraf} kaydı güncellendi.`)
  }

  const odemeSil = () => {
    if (!silinecekOdeme) return
    const silinenOdeme = { ...silinecekOdeme }
    const kaynakListe = silinenOdeme.sekme === 'gelen' ? gelenNakitListesi : gidenNakitListesi
    const silinenKayit = kaynakListe.find((k) => k.odemeNo === silinenOdeme.odemeNo)
    const silinenIndex = kaynakListe.findIndex((k) => k.odemeNo === silinenOdeme.odemeNo)
    const silinenTaraf = silinenOdeme.taraf
    odemeListesiGuncelle(silinenOdeme.sekme, (onceki) => onceki.filter((k) => k.odemeNo !== silinenOdeme.odemeNo))
    setSilinecekOdeme(null)
    toastGoster('basari', `${silinenTaraf} kaydı silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        if (!silinenKayit) return
        odemeListesiGuncelle(silinenOdeme.sekme, (onceki) => {
          if (onceki.some((kayit) => kayit.odemeNo === silinenKayit.odemeNo)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenKayit)
          return yeni
        })
        toastGoster('basari', `${silinenTaraf} kaydı geri alındı.`)
      },
    })
  }

  const haftalikSatisVerisi = useMemo(() => {
    const formatYmd = (tarih) => {
      const yil = tarih.getFullYear()
      const ay = String(tarih.getMonth() + 1).padStart(2, '0')
      const gun = String(tarih.getDate()).padStart(2, '0')
      return `${yil}-${ay}-${gun}`
    }

    const tumTarihler = siparisler.map((s) => new Date(`${s.siparisTarihi}T00:00:00`))
    const enGuncel = new Date(Math.max(...tumTarihler.map((t) => t.getTime())))
    const siparisToplamlari = new Map()

    siparisler.forEach((s) => {
      siparisToplamlari.set(s.siparisTarihi, (siparisToplamlari.get(s.siparisTarihi) || 0) + s.toplamTutar)
    })

    const gunler = Array.from({ length: 7 }, (_, index) => {
      const tarih = new Date(enGuncel)
      tarih.setDate(enGuncel.getDate() - 6 + index)
      const ymd = formatYmd(tarih)
      const toplam = siparisToplamlari.get(ymd) || 0
      const etiket = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(tarih).replace('.', '')
      return { etiket, toplam }
    })

    const enYuksek = Math.max(...gunler.map((g) => g.toplam), 1)
    return gunler.map((gun) => {
      const oran = Math.max((gun.toplam / enYuksek) * 100, gun.toplam > 0 ? 16 : 8)
      const ustOran = gun.toplam > 0 ? Math.max(oran * 0.28, 8) : 4
      const altOran = Math.max(oran - ustOran, 6)
      return { ...gun, altOran, ustOran }
    })
  }, [siparisler])

  const haftalikSatisGrafikUstSinir = useMemo(() => {
    const enYuksek = Math.max(...haftalikSatisVerisi.map((v) => v.toplam), 0)
    return Math.max(Math.ceil(enYuksek / 10000) * 10000, 40000)
  }, [haftalikSatisVerisi])

  if (!isLoggedIn) {
    return (
      <main className="login-page">
        <div className={`login-balon-sahnesi ${loginGecisiAktif ? 'aktif' : ''}`} aria-hidden="true">
          {merkezMenusu.map((kart, index) => (
            <div key={`login-${kart.sayfa}`} className={`login-balon renk-${kart.renk} login-balon-${index + 1}`}>
              <div className="login-balon-icerik">
                <SayfaIkonu sayfa={kart.sayfa} className="login-balon-ikon" />
                <span>{kart.baslik}</span>
                <small>{kart.aciklama}</small>
              </div>
            </div>
          ))}
        </div>
        {loginGecisiAktif && (
          <div className="login-gecis-mercek" aria-hidden="true">
            <div className="login-gecis-flash" />
            <div className="login-gecis-isik" />
            <span className="login-gecis-ripple ripple-bir" />
            <span className="login-gecis-ripple ripple-iki" />
            <img
              src="/ytu-logo.png"
              alt=""
              className="login-gecis-logo"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = '/ytu-logo.svg'
              }}
            />
          </div>
        )}
        <section className={`login-shell ${loginGecisiAktif ? 'gecis-aktif' : ''}`} aria-label="Giriş Ekranı">
          <div className="panel left-panel">
            <img
              src="/ytu-logo.png"
              alt="MTÜ Sanayi logosu"
              className="sayfa-logo login-logo"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = '/ytu-logo.svg'
              }}
            />
            <h1>Giriş Yap</h1>
            <p className="subtitle">Envanter paneline erişmek için bilgilerinizi girin.</p>

            <form onSubmit={handleLogin} className="login-form">
              <label htmlFor="username">Kullanıcı adı</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Kullanıcı adınızı girin"
                autoComplete="username"
              />

              <label htmlFor="password">Şifre</label>
              <div className="sifre-alani">
                <input
                  id="password"
                  type={sifreGorunur ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Şifrenizi girin"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="sifre-goster-buton"
                  onClick={() => setSifreGorunur((onceki) => !onceki)}
                  aria-label={sifreGorunur ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {sifreGorunur ? 'Gizle' : 'Göster'}
                </button>
              </div>

              <button type="submit" className="login-giris-buton" disabled={loginGecisiAktif}>
                {loginGecisiAktif ? 'Yönlendiriliyor...' : 'Giriş yap'}
              </button>
            </form>

            {error && <p className="message error">{error}</p>}
          </div>

          <div className="panel right-panel" aria-hidden="true">
            <div className="visual-wrap">
              <div className="chart-card">
                <div className="chart-header">
                  <span>Analiz</span>
                  <small>Haftalık</small>
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

            <h2>Stok yönetimini sadeleştirin</h2>
            <p>Sanayi parçalarını tek ekrandan yönetin, stok seviyelerini hızlı takip edin.</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard-page">
      <section className={`dashboard-shell ${aktifSayfa === 'merkez' ? 'merkez-modu' : ''}`}>
          {aktifSayfa !== 'merkez' && (
            <button
              type="button"
              className="mobil-menu-dugmesi"
              onClick={() => setMobilMenuAcik(true)}
              aria-label="Menüyü Aç"
            >
              <span />
              <span />
              <span />
            </button>
          )}

          {aktifSayfa !== 'merkez' && mobilMenuAcik && (
            <button
              type="button"
              className="mobil-menu-arka-plan"
              aria-label="Menüyü Kapat"
              onClick={() => setMobilMenuAcik(false)}
            />
          )}

          {aktifSayfa !== 'merkez' && (
            <aside className={`yan-menu ${mobilMenuAcik ? 'mobil-acik' : ''}`}>
              <div className="mobil-menu-ust">
                <h2>Menü</h2>
                <button type="button" className="mobil-menu-kapat" onClick={() => setMobilMenuAcik(false)} aria-label="Menüyü Kapat">
                  ×
                </button>
              </div>
              <img
                src="/ytu-logo.png"
                alt="MTÜ Sanayi logosu"
                className="sayfa-logo menu-logo"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = '/ytu-logo.svg'
                }}
              />
              <nav>
                <button type="button" className={`menu-link ${aktifSayfa === 'dashboard' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('dashboard')}>
                  <SayfaIkonu sayfa="dashboard" />
                  <span>Dashboard</span>
                </button>
                <button type="button" className={`menu-link ${aktifSayfa === 'envanter' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('envanter')}>
                  <SayfaIkonu sayfa="envanter" />
                  <span>Envanter</span>
                </button>
                <button type="button" className={`menu-link ${aktifSayfa === 'siparisler' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('siparisler')}>
                  <SayfaIkonu sayfa="siparisler" />
                  <span>Siparişler</span>
                </button>
                <button type="button" className={`menu-link ${aktifSayfa === 'musteriler' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('musteriler')}>
                  <SayfaIkonu sayfa="musteriler" />
                  <span>Kayıtlı Müşteriler</span>
                </button>
                <button type="button" className={`menu-link ${aktifSayfa === 'alicilar' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('alicilar')}>
                  <SayfaIkonu sayfa="alicilar" />
                  <span>Kayıtlı Tedarikçiler</span>
                </button>
                <button type="button" className={`menu-link ${aktifSayfa === 'odemeler' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('odemeler')}>
                  <SayfaIkonu sayfa="odemeler" />
                  <span>Finansal Akış</span>
                </button>
                <button type="button" className={`menu-link ${aktifSayfa === 'urun-duzenleme' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('urun-duzenleme')}>
                  <SayfaIkonu sayfa="urun-duzenleme" />
                  <span>Ürün Düzenleme</span>
                </button>
                <button type="button" className={`menu-link ${aktifSayfa === 'faturalama' ? 'aktif' : ''}`} onClick={() => sayfaDegistir('faturalama')}>
                  <SayfaIkonu sayfa="faturalama" />
                  <span>Faturalama (PDF)</span>
                </button>
            </nav>
          </aside>
        )}

        <div className={`icerik-alani ${aktifSayfa === 'merkez' ? 'merkez-icerik' : ''} ${merkezeDonusAktif ? 'merkeze-donuyor' : ''}`}>
            {aktifSayfa === 'merkez' && (
              <section className={`merkez-ekrani ${gecisBalonu ? 'gecis-aktif' : ''} ${merkezGirisEfekti ? 'geri-giris' : ''}`}>
                <div className="merkez-sahne">
                  <div className="arka-plan-baloncuklari" aria-hidden="true">
                    <div className="arka-balon arka-balon-1">
                      <small>Satış</small>
                      <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                        <path d="M8 37 L25 30 L42 18 L60 23 L78 14 L92 28" className="cizgi-a" />
                        <path d="M8 43 L25 35 L42 40 L60 29 L78 33 L92 22" className="cizgi-b" />
                        <path d="M8 46 L25 48 L42 44 L60 47 L78 41 L92 45" className="cizgi-c" />
                      </svg>
                    </div>
                    <div className="arka-balon arka-balon-2">
                      <small>Nakit</small>
                      <div className="mini-halka-grafik">
                        <span>68%</span>
                      </div>
                    </div>
                    <div className="arka-balon arka-balon-3">
                      <small>Sipariş</small>
                      <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                        <path d="M8 34 L25 22 L42 27 L60 16 L78 12 L92 19" className="cizgi-a" />
                        <path d="M8 41 L25 39 L42 29 L60 33 L78 23 L92 26" className="cizgi-b" />
                        <path d="M8 48 L25 46 L42 44 L60 40 L78 43 L92 38" className="cizgi-c" />
                      </svg>
                    </div>
                    <div className="arka-balon arka-balon-4">
                      <small>Envanter</small>
                      <div className="mini-liste-grafik">
                        <span style={{ width: '62%' }} />
                        <span style={{ width: '48%' }} />
                        <span style={{ width: '71%' }} />
                      </div>
                    </div>
                    <div className="arka-balon arka-balon-5">
                      <small>Trend</small>
                      <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                        <path d="M8 38 L25 20 L42 31 L60 26 L78 9 L92 18" className="cizgi-a" />
                        <path d="M8 44 L25 37 L42 34 L60 20 L78 29 L92 24" className="cizgi-b" />
                        <path d="M8 50 L25 45 L42 46 L60 42 L78 38 L92 41" className="cizgi-c" />
                      </svg>
                    </div>
                    <div className="arka-balon arka-balon-6">
                      <small>Gelir</small>
                      <div className="mini-karsilastirma">
                        <span style={{ height: '48%' }} />
                        <span style={{ height: '72%' }} />
                      </div>
                    </div>
                    <div className="arka-balon arka-balon-7">
                      <small>Sevkiyat</small>
                      <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                        <path d="M8 42 L25 33 L42 19 L60 25 L78 17 L92 12" className="cizgi-a" />
                        <path d="M8 47 L25 40 L42 35 L60 28 L78 24 L92 30" className="cizgi-b" />
                        <path d="M8 49 L25 46 L42 43 L60 45 L78 39 L92 36" className="cizgi-c" />
                      </svg>
                    </div>
                    <div className="arka-balon arka-balon-8">
                      <small>Stok</small>
                      <div className="mini-liste-grafik">
                        <span style={{ width: '70%' }} />
                        <span style={{ width: '56%' }} />
                        <span style={{ width: '64%' }} />
                      </div>
                    </div>
                    <div className="arka-balon arka-balon-9">
                      <small>Günlük Satış</small>
                      <div className="mini-cubuk-grafik">
                        <span style={{ height: '42%' }} />
                        <span style={{ height: '56%' }} />
                        <span style={{ height: '34%' }} />
                        <span style={{ height: '68%' }} />
                        <span style={{ height: '48%' }} />
                        <span style={{ height: '74%' }} />
                      </div>
                    </div>
                    <div className="arka-balon arka-balon-10">
                      <small>Stok Hızı</small>
                      <div className="mini-cubuk-grafik">
                        <span style={{ height: '28%' }} />
                        <span style={{ height: '62%' }} />
                        <span style={{ height: '52%' }} />
                        <span style={{ height: '78%' }} />
                        <span style={{ height: '39%' }} />
                        <span style={{ height: '58%' }} />
                      </div>
                    </div>
                    <div className="arka-balon arka-balon-11">
                      <small>Aylık Hacim</small>
                      <div className="mini-cubuk-grafik">
                        <span style={{ height: '46%' }} />
                        <span style={{ height: '36%' }} />
                        <span style={{ height: '64%' }} />
                        <span style={{ height: '72%' }} />
                        <span style={{ height: '54%' }} />
                        <span style={{ height: '60%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="merkez-cember dis-cember" />
                  <div className="merkez-cember ic-cember" />
                  <div className="merkez-baslik-karti">
                    <p>Yönetim Merkezi</p>
                    <h1>Stok Takip Sistemi</h1>
                    <span>Bir modül seçerek devam edin</span>
                  </div>
                  {merkezMenusu.map((kart, index) => (
                    <button
                      key={kart.sayfa}
                      type="button"
                      className={`merkez-balon renk-${kart.renk} balon-${index + 1} ${gecisBalonu === kart.sayfa ? 'giriliyor' : ''}`}
                      onClick={() => merkezdenSayfayaGit(kart.sayfa)}
                    >
                      <div className="merkez-balon-icerik">
                        <SayfaIkonu sayfa={kart.sayfa} className="menu-ikon merkez-ikon-svg" />
                        <span>{kart.baslik}</span>
                        <small>{kart.aciklama}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

          {aktifSayfa !== 'merkez' && (
            <button type="button" className={`geri-buton ${merkezeDonusAktif ? 'aktif' : ''}`} onClick={merkezeDon}>
              ‹ Merkeze Dön
            </button>
          )}
          {aktifSayfa === 'dashboard' && (
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
                            <button type="button" onClick={() => ozetKartiniSil(kart.baslik)}>Grafiği Sil</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p>{kart.baslik}</p>
                    <div className="ozet-alt">
                      <h3>{kart.deger}</h3>
                      <span className={`ozet-degisim ${kart.degisim.startsWith('+') ? 'pozitif' : 'negatif'}`}>{kart.degisim}</span>
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
                                <span className="kritik-stok-rozet" data-tooltip="Bu ürün kritik stok değerinin altındadır.">!</span>
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
                      <h2>Aylara Göre Satılan Toplam Ürün</h2>
                      <small>Adet bazlı</small>
                    </div>
                    <svg viewBox="0 0 320 130" className="cizgi-grafik" aria-label="Aylık satılan ürün grafiği">
                      <line x1="10" y1="100" x2="310" y2="100" />
                      <polyline points={cizgiNoktalari(aylikSatilanUrun)} className="kirmizi-cizgi" />
                    </svg>
                    <div className="grafik-etiketleri">{aylar.map((ay) => <span key={ay}>{ay}</span>)}</div>
                    <div className="grafik-lejant"><span><i className="lejant-kutu kirmizi" /> Satılan Ürün (Adet)</span></div>
                  </article>

                  <article className="panel-kart grafik-kart">
                    <div className="panel-baslik">
                      <h2>Satılan Ürünlerin Sütun Grafiği</h2>
                      <small>Aynı verinin sütun görünümü</small>
                    </div>
                    <div className="sutun-grafik" aria-label="Satılan ürünlerin sütun grafiği">
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
              )}
            </section>
          )}

          {aktifSayfa === 'siparisler' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Siparişler yükleniyor...</section>}>
              <SiparislerPaneli
                yeniSiparisPenceresiniAc={yeniSiparisPenceresiniAc}
                siparisSekmesi={siparisSekmesi}
                setSiparisSekmesi={setSiparisSekmesi}
                siparisAktivitesi={siparisAktivitesi}
                siparisArama={siparisArama}
                setSiparisArama={setSiparisArama}
                siparisOdemeFiltresi={siparisOdemeFiltresi}
                setSiparisOdemeFiltresi={setSiparisOdemeFiltresi}
                sayfadakiSiparisler={sayfadakiSiparisler}
                paraFormatla={paraFormatla}
                tarihFormatla={tarihFormatla}
                durumSinifi={durumSinifi}
                setDetaySiparis={setDetaySiparis}
                siparisDuzenlemeAc={siparisDuzenlemeAc}
                siparisDurumGuncellemeAc={siparisDurumGuncellemeAc}
                setSilinecekSiparis={setSilinecekSiparis}
                siparisMusteriAra={siparisMusteriAra}
                siparisSayfa={siparisSayfa}
                setSiparisSayfa={setSiparisSayfa}
                toplamSiparisSayfa={toplamSiparisSayfa}
                gecmisSiparisArama={gecmisSiparisArama}
                setGecmisSiparisArama={setGecmisSiparisArama}
                setGecmisSiparisSayfa={setGecmisSiparisSayfa}
                sayfadakiGecmisSiparisler={sayfadakiGecmisSiparisler}
                setDetayGecmisSiparis={setDetayGecmisSiparis}
                gecmisSiparisSayfa={gecmisSiparisSayfa}
                toplamGecmisSiparisSayfa={toplamGecmisSiparisSayfa}
              />
            </Suspense>
          )}

          {aktifSayfa === 'musteriler' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Müşteriler yükleniyor...</section>}>
              <MusterilerPaneli
                musteriEklemeAc={musteriEklemeAc}
                musteriArama={musteriArama}
                setMusteriArama={setMusteriArama}
                setMusteriSayfa={setMusteriSayfa}
                sayfadakiMusteriler={sayfadakiMusteriler}
                musteriBaslangic={musteriBaslangic}
                tarihFormatla={tarihFormatla}
                paraFormatla={paraFormatla}
                musteriFavoriDegistir={musteriFavoriDegistir}
                musteriNotAc={musteriNotAc}
                musteriDuzenlemeAc={musteriDuzenlemeAc}
                telefonAramasiBaslat={telefonAramasiBaslat}
                setSilinecekMusteri={setSilinecekMusteri}
                musteriSayfa={musteriSayfa}
                musteriSayfayaGit={musteriSayfayaGit}
                toplamMusteriSayfa={toplamMusteriSayfa}
              />
            </Suspense>
          )}

          {aktifSayfa === 'alicilar' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Tedarikçiler yükleniyor...</section>}>
              <TedarikcilerPaneli
                tedarikciSekmesi={tedarikciSekmesi}
                setTedarikciSekmesi={setTedarikciSekmesi}
                tedarikciArama={tedarikciArama}
                setTedarikciArama={setTedarikciArama}
                tedarikciEklemeAc={tedarikciEklemeAc}
                sayfadakiTedarikciler={sayfadakiTedarikciler}
                tedarikciBaslangic={tedarikciBaslangic}
                tedarikciDetayAc={tedarikciDetayAc}
                tedarikciFavoriDegistir={tedarikciFavoriDegistir}
                tedarikciNotAc={tedarikciNotAc}
                tedarikciDuzenlemeAc={tedarikciDuzenlemeAc}
                telefonAramasiBaslat={telefonAramasiBaslat}
                setSilinecekTedarikci={setSilinecekTedarikci}
                paraFormatla={paraFormatla}
                tedarikciSayfa={tedarikciSayfa}
                tedarikciSayfayaGit={tedarikciSayfayaGit}
                toplamTedarikciSayfa={toplamTedarikciSayfa}
                setTedarikciSayfa={setTedarikciSayfa}
                sayfadakiTedarikSiparisleri={sayfadakiTedarikSiparisleri}
                genelTedarikSiparisEklemeAc={genelTedarikSiparisEklemeAc}
                tarihFormatla={tarihFormatla}
                tedarikciler={tedarikciler}
                seciliTedarikci={seciliTedarikci}
                tedarikciSiparisSayfa={tedarikciSiparisSayfa}
                tedarikciSiparisSayfayaGit={tedarikciSiparisSayfayaGit}
                toplamTedarikSiparisSayfa={toplamTedarikSiparisSayfa}
                tedarikSiparisBaslangic={tedarikSiparisBaslangic}
              />
            </Suspense>
          )}

          {aktifSayfa === 'odemeler' && (
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
                              <td><span className="odeme-durumu odendi">{kayit.durum}</span></td>
                              <td>{paraFormatla(kayit.tutar)}</td>
                              <td>
                                <div className="islem-dugmeleri odeme-islemler">
                                  <button type="button" className={`ikon-dugme favori ${kayit.favori ? 'aktif' : ''}`} onClick={() => finansFavoriDegistir('gelen', kayit.odemeNo)} title="Favori"><KucukIkon tip="favori" /></button>
                                  <button type="button" className="ikon-dugme duzenle" onClick={() => odemeDuzenlemeAc('gelen', kayit)} title="Düzenle"><KucukIkon tip="duzenle" /></button>
                                  <button type="button" className="ikon-dugme sil" onClick={() => setSilinecekOdeme({ sekme: 'gelen', odemeNo: kayit.odemeNo, taraf: kayit.taraf })} title="Sil"><KucukIkon tip="sil" /></button>
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
                            { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekOdeme({ sekme: 'gelen', odemeNo: kayit.odemeNo, taraf: kayit.taraf }) },
                          ]}
                          sagaAksiyonlar={[
                            { id: 'favori', etiket: 'Favori', onClick: () => finansFavoriDegistir('gelen', kayit.odemeNo) },
                            { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => odemeDuzenlemeAc('gelen', kayit) },
                          ]}
                          ust={<><strong>{kayit.odemeNo}</strong><span>{kayit.taraf}</span></>}
                          govde={<>
                            <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(kayit.tarih)}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Durum</span><strong>{kayit.durum}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(kayit.tutar)}</strong></div>
                          </>}
                        />
                      ))}
                    </div>

                    <div className="sayfalama">
                      <button type="button" className="sayfa-ok" onClick={() => setGelenSayfa((onceki) => Math.max(1, onceki - 1))} disabled={gelenSayfa === 1}>‹</button>
                      {Array.from({ length: toplamGelenSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                        <button key={`gelen-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${gelenSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => setGelenSayfa(sayfaNo)}>
                          {sayfaNo}
                        </button>
                      ))}
                      <button type="button" className="sayfa-ok" onClick={() => setGelenSayfa((onceki) => Math.min(toplamGelenSayfa, onceki + 1))} disabled={gelenSayfa === toplamGelenSayfa}>›</button>
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
                              <td><span className="odeme-durumu odendi">{kayit.durum}</span></td>
                              <td>{paraFormatla(kayit.tutar)}</td>
                              <td>
                                <div className="islem-dugmeleri odeme-islemler">
                                  <button type="button" className={`ikon-dugme favori ${kayit.favori ? 'aktif' : ''}`} onClick={() => finansFavoriDegistir('giden', kayit.odemeNo)} title="Favori"><KucukIkon tip="favori" /></button>
                                  <button type="button" className="ikon-dugme duzenle" onClick={() => odemeDuzenlemeAc('giden', kayit)} title="Düzenle"><KucukIkon tip="duzenle" /></button>
                                  <button type="button" className="ikon-dugme sil" onClick={() => setSilinecekOdeme({ sekme: 'giden', odemeNo: kayit.odemeNo, taraf: kayit.taraf })} title="Sil"><KucukIkon tip="sil" /></button>
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
                            { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekOdeme({ sekme: 'giden', odemeNo: kayit.odemeNo, taraf: kayit.taraf }) },
                          ]}
                          sagaAksiyonlar={[
                            { id: 'favori', etiket: 'Favori', onClick: () => finansFavoriDegistir('giden', kayit.odemeNo) },
                            { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => odemeDuzenlemeAc('giden', kayit) },
                          ]}
                          ust={<><strong>{kayit.odemeNo}</strong><span>{kayit.taraf}</span></>}
                          govde={<>
                            <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(kayit.tarih)}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Durum</span><strong>{kayit.durum}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(kayit.tutar)}</strong></div>
                          </>}
                        />
                      ))}
                    </div>

                    <div className="sayfalama">
                      <button type="button" className="sayfa-ok" onClick={() => setGidenSayfa((onceki) => Math.max(1, onceki - 1))} disabled={gidenSayfa === 1}>‹</button>
                      {Array.from({ length: toplamGidenSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                        <button key={`giden-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${gidenSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => setGidenSayfa(sayfaNo)}>
                          {sayfaNo}
                        </button>
                      ))}
                      <button type="button" className="sayfa-ok" onClick={() => setGidenSayfa((onceki) => Math.min(toplamGidenSayfa, onceki + 1))} disabled={gidenSayfa === toplamGidenSayfa}>›</button>
                    </div>
                  </>
                )}
              </section>
            </section>
          )}

          {aktifSayfa === 'urun-duzenleme' && (
            <section>
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
                    onClick={() => setUrunDuzenlemeSekmesi('urunler')}
                  >
                    Ürün Listesi
                  </button>
                  <button
                    type="button"
                    className={`odeme-sekme ${urunDuzenlemeSekmesi === 'stok-loglari' ? 'aktif' : ''}`}
                    onClick={() => setUrunDuzenlemeSekmesi('stok-loglari')}
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
                      <table>
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
                            <tr key={`duzenleme-${urun.uid}`}>
                              <td>{String(urunDuzenlemeBaslangic + index + 1).padStart(2, '0')}</td>
                              <td>
                                <div className="urun-bilgi">
                                  <span className="urun-avatar">{urun.avatar}</span>
                                  <span className="urun-ad-satiri">
                                    <span>{urun.ad}</span>
                                    {kritikStoktaMi(urun) && (
                                      <span className="kritik-stok-rozet" data-tooltip="Bu ürün kritik stok değerinin altındadır." title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}>
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
                                  <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => urunDuzenlemeModaliniAc(urun)}><KucukIkon tip="duzenle" /></button>
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
                          sagaEtiket="Favori ve düzenle"
                          solaAksiyonlar={[
                            { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekDuzenlemeUrunu(urun) },
                          ]}
                          sagaAksiyonlar={[
                            { id: 'favori', etiket: 'Favori', onClick: () => favoriDegistir(urun.uid) },
                            { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => urunDuzenlemeModaliniAc(urun) },
                          ]}
                          ust={
                            <>
                              <strong>{String(urunDuzenlemeBaslangic + index + 1).padStart(2, '0')} - {urun.ad}</strong>
                              <span>{urun.urunId}</span>
                            </>
                          }
                          govde={
                            <>
                              <div className="mobil-kart-kisi">
                                <span className="urun-avatar">{urun.avatar}</span>
                                <div className="mobil-kisi-metin">
                                  <strong className="urun-ad-satiri">
                                    <span>{urun.ad}</span>
                                    {kritikStoktaMi(urun) && (
                                      <span className="kritik-stok-rozet" data-tooltip="Bu ürün kritik stok değerinin altındadır." title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}>
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
                          }
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
                      <button
                        type="button"
                        className="sayfa-ok"
                        onClick={() => urunDuzenlemeSayfayaGit(urunDuzenlemeSayfa + 1)}
                        disabled={urunDuzenlemeSayfa === toplamUrunDuzenlemeSayfa}
                      >
                        ›
                      </button>
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
                          ust={
                            <>
                              <strong>{String(stokLogBaslangic + index + 1).padStart(2, '0')} - {log.urun}</strong>
                              <span className="stok-log-rozet">{log.islem}</span>
                            </>
                          }
                          govde={
                            <>
                              <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{log.tarih}</strong></div>
                              <div className="mobil-bilgi-satiri"><span>Ürün ID</span><strong>{log.urunId}</strong></div>
                              <div className="mobil-bilgi-satiri"><span>Eski Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.eskiStok > log.yeniStok ? 'yuksek' : 'dusuk'}`}>{log.eskiStok}</span></strong></div>
                              <div className="mobil-bilgi-satiri"><span>Yeni Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.yeniStok > log.eskiStok ? 'yuksek' : 'dusuk'}`}>{log.yeniStok}</span></strong></div>
                              <div className="mobil-bilgi-satiri"><span>Kullanıcı</span><strong>{log.kullanici}</strong></div>
                              <div className="mobil-bilgi-satiri tam"><span>Açıklama</span><strong>{log.aciklama}</strong></div>
                            </>
                          }
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
                      <button
                        type="button"
                        className="sayfa-ok"
                        onClick={() => setStokLogSayfa(stokLogSayfa + 1)}
                        disabled={stokLogSayfa === toplamStokLogSayfa}
                      >
                        ›
                      </button>
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
          )}

          {aktifSayfa === 'faturalama' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Faturalama ekranı yükleniyor...</section>}>
              <FaturalamaPanel
                KucukIkon={KucukIkon}
                faturalar={faturalar}
                faturaArama={faturaArama}
                faturaDetayAc={faturaDetayAc}
                faturaFormu={faturaFormu}
                faturaFormuGuncelle={faturaFormuGuncelle}
                faturaKarsiTarafDegistir={faturaKarsiTarafDegistir}
                faturaKarsiTaraflar={faturaKarsiTaraflar}
                faturaKaydet={faturaKaydet}
                faturaOnizleme={faturaOnizleme}
                faturaPdfOnizlemeAc={faturaPdfOnizlemeAc}
                faturaSatiriEkle={faturaSatiriEkle}
                faturaSatiriGuncelle={faturaSatiriGuncelle}
                faturaSatiriSil={faturaSatiriSil}
                faturaSekmesi={faturaSekmesi}
                faturaTuruDegistir={faturaTuruDegistir}
                faturayiPdfIndir={faturayiPdfIndir}
                faturayiYazdir={faturayiYazdir}
                filtreliFaturalar={filtreliFaturalar}
                paraFormatla={paraFormatla}
                setFaturaArama={setFaturaArama}
                setFaturaSekmesi={setFaturaSekmesi}
                tarihFormatla={tarihFormatla}
                urunler={urunler}
              />
            </Suspense>
          )}

          {aktifSayfa === 'envanter' && (
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
                        <th>Ürün Adedi</th>
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
                              <span className="urun-avatar">{urun.avatar}</span>
                              <strong className="urun-ad-satiri">
                                <span>{urun.ad}</span>
                                {kritikStoktaMi(urun) && (
                                  <span className="kritik-stok-rozet" data-tooltip="Bu ürün kritik stok değerinin altındadır." title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}>
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
                              <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}><KucukIkon tip="favori" /></button>
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
                      sagaEtiket="Favori ve düzenle"
                      solaAksiyonlar={[
                        { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekUrun(urun) },
                      ]}
                      sagaAksiyonlar={[
                        { id: 'favori', etiket: 'Favori', onClick: () => favoriDegistir(urun.uid) },
                        { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => duzenlemePenceresiniAc(urun) },
                      ]}
                      ust={
                        <>
                          <strong>{String(sayfaBaslangic + index + 1).padStart(2, '0')} - {urun.ad}</strong>
                          <span>{urun.kategori}</span>
                        </>
                      }
                      govde={
                        <>
                          <div className="mobil-kart-kisi">
                            <span className="urun-avatar">{urun.avatar}</span>
                            <div className="mobil-kisi-metin">
                              <strong className="urun-ad-satiri">
                                <span>{urun.ad}</span>
                                {kritikStoktaMi(urun) && (
                                  <span className="kritik-stok-rozet" data-tooltip="Bu ürün kritik stok değerinin altındadır." title={`Kritik stok: minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}`}>
                                    !
                                  </span>
                                )}
                              </strong>
                              <span>{urun.urunId}</span>
                            </div>
                          </div>
                          <div className="mobil-bilgi-satiri"><span>Kategori</span><strong>{urun.kategori}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Ürün Adedi</span><strong>{urun.urunAdedi}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Minimum Stok</span><strong>{urun.minimumStok}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Mağaza Stok</span><strong>{urun.magazaStok}</strong></div>
                        </>
                      }
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
                  <button
                    type="button"
                    className="sayfa-ok"
                    onClick={() => envanterSayfayaGit(envanterSayfa + 1)}
                    disabled={envanterSayfa === toplamEnvanterSayfa}
                  >
                    ›
                  </button>
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
              </section>
            </section>
          )}
          </div>
        </section>

        {aktifSayfa !== 'merkez' && (
          <>
            <div className={`global-arama-kapsayici ${globalAramaMobilAcik || globalAramaMetni ? 'acik' : ''}`}>
              <button
                type="button"
                className="global-arama-mobil-dugme"
                aria-label="Global aramayı aç"
                onClick={() => setGlobalAramaMobilAcik((onceki) => !onceki)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>

              <div className="global-arama-alani">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="text"
                  value={globalAramaMetni}
                  onChange={(event) => setGlobalAramaMetni(event.target.value)}
                  placeholder="Ürün, sipariş, müşteri veya tedarikçi ara"
                />
                {globalAramaMetni && (
                  <button type="button" className="global-arama-temizle" aria-label="Aramayı temizle" onClick={() => setGlobalAramaMetni('')}>
                    ×
                  </button>
                )}
              </div>

              {globalAramaMetni.trim() && (
                <div className="global-arama-sonuclar">
                  {globalAramaSonuclari.length === 0 ? (
                    <div className="global-arama-bos">
                      <strong>Sonuç bulunamadı.</strong>
                      <span>Başka bir anahtar kelime deneyin.</span>
                    </div>
                  ) : (
                    globalAramaSonuclari.map((sonuc) => (
                      <button
                        key={sonuc.id}
                        type="button"
                        className="global-arama-sonuc"
                        onClick={() => globalAramaSonucunuAc(sonuc)}
                      >
                        <span className="global-arama-etiket">{sonuc.tur}</span>
                        <strong>{sonuc.baslik}</strong>
                        <small>{sonuc.alt}</small>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="bildirim-dugmesi"
              aria-label="Bildirimler"
              onClick={bildirimDugmesiTikla}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 17H5l2-2v-4a5 5 0 1 1 10 0v4l2 2h-4" />
                <path d="M10 17a2 2 0 0 0 4 0" />
              </svg>
              {okunmamisBildirimSayisi > 0 && <span className="bildirim-sayisi">{okunmamisBildirimSayisi}</span>}
            </button>
          </>
        )}

        {aktifSayfa !== 'merkez' && bildirimPanelAcik && (
          <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Bildirimler yükleniyor...</section>}>
            <BildirimPaneli
              KucukIkon={KucukIkon}
              bildirimPanelKapaniyor={bildirimPanelKapaniyor}
              bildirimPaneliKapat={bildirimPaneliKapat}
              bildirimdenSayfayaGit={bildirimdenSayfayaGit}
              bildirimler={bildirimler}
              bildirimiOkunduYap={bildirimiOkunduYap}
              bildirimiOkunmadiYap={bildirimiOkunmadiYap}
              bildirimiTemizle={bildirimiTemizle}
              okunanBildirimler={okunanBildirimler}
              tumBildirimleriTemizle={tumBildirimleriTemizle}
            />
          </Suspense>
        )}

        {aktifSayfa !== 'merkez' && (
          <button
            type="button"
            className="ai-yardim-buton"
            aria-label="Yapay zeka yardımı"
            onClick={aiPanelDugmeTikla}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 9h8M8 13h5" />
            </svg>
          </button>
        )}

        {aktifSayfa !== 'merkez' && (
          <nav className="mobil-alt-menu" aria-label="Hızlı gezinme">
            {[
              { sayfa: 'dashboard', etiket: 'Dashboard' },
              { sayfa: 'envanter', etiket: 'Envanter' },
              { sayfa: 'siparisler', etiket: 'Siparişler' },
              { sayfa: 'odemeler', etiket: 'Finansal Akış' },
            ].map((oge) => (
              <button
                key={oge.sayfa}
                type="button"
                className={`mobil-alt-menu-ogesi ${aktifSayfa === oge.sayfa ? 'aktif' : ''}`}
                onClick={() => sayfaDegistir(oge.sayfa)}
              >
                <SayfaIkonu sayfa={oge.sayfa} className="mobil-alt-menu-ikon" />
                <span>{oge.etiket}</span>
              </button>
            ))}
          </nav>
        )}

        {aktifSayfa !== 'merkez' && aiPanelAcik && !aiPanelKucuk && (
          <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Asistan yükleniyor...</section>}>
            <AiPanel
              KucukIkon={KucukIkon}
              TemaIkonu={TemaIkonu}
              aiHizliKonular={aiHizliKonular}
              aiHizliKonularAcik={aiHizliKonularAcik}
              aiMesajGonder={aiMesajGonder}
              aiMesajMetni={aiMesajMetni}
              aiMesajlar={aiMesajlar}
              aiPanelKapaniyor={aiPanelKapaniyor}
              aiPaneliKapat={aiPaneliKapat}
              aiTemaMenuAcik={aiTemaMenuAcik}
              setAiMesajMetni={setAiMesajMetni}
              setAiHizliKonularAcik={setAiHizliKonularAcik}
              setAiPanelKucuk={setAiPanelKucuk}
              setAiTemaMenuAcik={setAiTemaMenuAcik}
            />
          </Suspense>
        )}

        {toastlar.length > 0 && (
          <div className="toast-kapsayici" aria-live="polite" aria-atomic="true">
            {toastlar.map((toast) => (
              <article key={toast.id} className={`toast-bildirim ${toast.tip}`}>
                <span className="toast-ikon" aria-hidden="true">
                  <KucukIkon tip={toast.tip === 'basari' ? 'basari' : 'uyari'} />
                </span>
                <div className="toast-metin">
                  <strong>{toast.tip === 'basari' ? 'Başarılı' : 'Uyarı'}</strong>
                  <span>{toast.metin}</span>
                  {toast.eylemEtiketi && typeof toast.eylem === 'function' && (
                    <button
                      type="button"
                      className="toast-eylem"
                      onClick={() => {
                        setToastlar((onceki) => onceki.filter((oge) => oge.id !== toast.id))
                        setSonGeriAlma((onceki) => (onceki?.toastId === toast.id ? null : onceki))
                        toast.eylem()
                      }}
                    >
                      {toast.eylemEtiketi}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="toast-kapat"
                  aria-label="Bildirimi kapat"
                  onClick={() => {
                    setToastlar((onceki) => onceki.filter((oge) => oge.id !== toast.id))
                    setSonGeriAlma((onceki) => (onceki?.toastId === toast.id ? null : onceki))
                  }}
                >
                  ×
                </button>
              </article>
            ))}
          </div>
        )}

        {yeniSiparisAcik && (
          <div className="modal-kaplama">
            <div className="modal-kutu">
              <h3>Yeni Sipariş Oluştur</h3>
              <div className="modal-form">
                <label>Müşteri</label>
                <input value={siparisFormu.musteri} onChange={(event) => siparisFormuGuncelle('musteri', event.target.value)} />

                <label>Ürün</label>
                <input value={siparisFormu.urun} onChange={(event) => siparisFormuGuncelle('urun', event.target.value)} />

                <label>Toplam Tutar</label>
                <input type="number" value={siparisFormu.toplamTutar} onChange={(event) => siparisFormuGuncelle('toplamTutar', event.target.value)} />

                <label>Sipariş Tarihi</label>
                <input type="date" value={siparisFormu.siparisTarihi} onChange={(event) => siparisFormuGuncelle('siparisTarihi', event.target.value)} />

                <label>Ödeme Durumu</label>
                <input value={siparisFormu.odemeDurumu} onChange={(event) => siparisFormuGuncelle('odemeDurumu', event.target.value)} />

                <label>Ürün Hazırlık</label>
                <input value={siparisFormu.urunHazirlik} onChange={(event) => siparisFormuGuncelle('urunHazirlik', event.target.value)} />

                <label>Teslimat Durumu</label>
                <input value={siparisFormu.teslimatDurumu} onChange={(event) => siparisFormuGuncelle('teslimatDurumu', event.target.value)} />

                <label>Teslimat Süresi</label>
                <input value={siparisFormu.teslimatSuresi} onChange={(event) => siparisFormuGuncelle('teslimatSuresi', event.target.value)} />
              </div>
              <div className="modal-aksiyon">
                <button type="button" className="ikinci" onClick={() => setYeniSiparisAcik(false)}>İptal</button>
                <button type="button" onClick={yeniSiparisKaydet}>Siparişi Oluştur</button>
              </div>
            </div>
          </div>
        )}

        {detaySiparis && (
          <div className="modal-kaplama">
            <div className="modal-kutu">
              <h3>Sipariş Detayı</h3>
              <div className="modal-form siparis-detay-icerik">
                <div className="mobil-bilgi-satiri"><span>Sipariş No</span><strong>{detaySiparis.siparisNo}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Müşteri</span><strong>{detaySiparis.musteri}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisMusteriTelefonlari[detaySiparis.musteri] ?? 'Bilinmiyor'}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Ürün</span><strong>{detaySiparis.urun}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detaySiparis.toplamTutar)}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detaySiparis.siparisTarihi)}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Ödeme</span><strong>{detaySiparis.odemeDurumu}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Hazırlık</span><strong>{detaySiparis.urunHazirlik}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Teslimat</span><strong>{detaySiparis.teslimatDurumu}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Tahmini Süre</span><strong>{detaySiparis.teslimatSuresi}</strong></div>
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
              <h3>Geçmiş Sipariş Detayı</h3>
              <div className="modal-form siparis-detay-icerik">
                <div className="mobil-bilgi-satiri"><span>Log No</span><strong>{detayGecmisSiparis.logNo}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Sipariş No</span><strong>{detayGecmisSiparis.siparisNo}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Müşteri</span><strong>{detayGecmisSiparis.musteri}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{siparisMusteriTelefonlari[detayGecmisSiparis.musteri] ?? 'Bilinmiyor'}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Ürün</span><strong>{detayGecmisSiparis.urun}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(detayGecmisSiparis.tarih)}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Miktar</span><strong>{detayGecmisSiparis.miktar}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(detayGecmisSiparis.tutar)}</strong></div>
                <div className="mobil-bilgi-satiri"><span>Durum</span><strong>{detayGecmisSiparis.durum}</strong></div>
                <div className="mobil-bilgi-satiri tam"><span>Açıklama</span><strong>{detayGecmisSiparis.aciklama}</strong></div>
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
              <h3>Siparişi Düzenle</h3>
              <div className="modal-form">
                <label>Müşteri</label>
                <input value={siparisFormu.musteri} onChange={(event) => siparisFormuGuncelle('musteri', event.target.value)} />

                <label>Ürün</label>
                <input value={siparisFormu.urun} onChange={(event) => siparisFormuGuncelle('urun', event.target.value)} />

                <label>Toplam Tutar</label>
                <input type="number" value={siparisFormu.toplamTutar} onChange={(event) => siparisFormuGuncelle('toplamTutar', event.target.value)} />

                <label>Sipariş Tarihi</label>
                <input type="date" value={siparisFormu.siparisTarihi} onChange={(event) => siparisFormuGuncelle('siparisTarihi', event.target.value)} />

                <label>Ödeme Durumu</label>
                <input value={siparisFormu.odemeDurumu} onChange={(event) => siparisFormuGuncelle('odemeDurumu', event.target.value)} />

                <label>Ürün Hazırlık</label>
                <input value={siparisFormu.urunHazirlik} onChange={(event) => siparisFormuGuncelle('urunHazirlik', event.target.value)} />

                <label>Teslimat Durumu</label>
                <input value={siparisFormu.teslimatDurumu} onChange={(event) => siparisFormuGuncelle('teslimatDurumu', event.target.value)} />

                <label>Teslimat Süresi</label>
                <input value={siparisFormu.teslimatSuresi} onChange={(event) => siparisFormuGuncelle('teslimatSuresi', event.target.value)} />
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
              <h3>Sipariş Durumu Güncelle</h3>
              <div className="modal-form">
                <label>Ödeme Durumu</label>
                <input value={siparisDurumFormu.odemeDurumu} onChange={(event) => siparisDurumFormuGuncelle('odemeDurumu', event.target.value)} />

                <label>Ürün Hazırlık</label>
                <input value={siparisDurumFormu.urunHazirlik} onChange={(event) => siparisDurumFormuGuncelle('urunHazirlik', event.target.value)} />

                <label>Teslimat Durumu</label>
                <input value={siparisDurumFormu.teslimatDurumu} onChange={(event) => siparisDurumFormuGuncelle('teslimatDurumu', event.target.value)} />

                <label>Teslimat Süresi</label>
                <input value={siparisDurumFormu.teslimatSuresi} onChange={(event) => siparisDurumFormuGuncelle('teslimatSuresi', event.target.value)} />
              </div>
              <div className="modal-aksiyon">
                <button type="button" className="ikinci" onClick={() => setDurumGuncellenenSiparisNo(null)}>İptal</button>
                <button type="button" onClick={siparisDurumKaydet}>Kaydet</button>
              </div>
            </div>
          </div>
        )}

        {silinecekSiparis && (
          <div className="modal-kaplama">
            <div className="modal-kutu kucuk">
              <h3>Silmek istediğinizden emin misiniz?</h3>
              <p><strong>{silinecekSiparis.siparisNo}</strong> siparişi kaldırılacak.</p>
              <div className="modal-aksiyon">
                <button type="button" className="ikinci" onClick={() => setSilinecekSiparis(null)}>Hayır</button>
                <button type="button" className="tehlike" onClick={siparisSil}>Evet</button>
              </div>
            </div>
          </div>
        )}

        {duzenlenenOdeme && (
          <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Ödeme Kaydını Düzenle</h3>
            <div className="modal-form">
              <label>Cari / Tedarikçi</label>
              <input value={odemeFormu.taraf} onChange={(event) => setOdemeFormu((o) => ({ ...o, taraf: event.target.value }))} />

              <label>Tarih</label>
              <input type="date" value={odemeFormu.tarih} onChange={(event) => setOdemeFormu((o) => ({ ...o, tarih: event.target.value }))} />

              <label>Durum</label>
              <input value={odemeFormu.durum} onChange={(event) => setOdemeFormu((o) => ({ ...o, durum: event.target.value }))} />

              <label>Tutar (TL)</label>
              <input type="number" value={odemeFormu.tutar} onChange={(event) => setOdemeFormu((o) => ({ ...o, tutar: event.target.value }))} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setDuzenlenenOdeme(null)}>İptal</button>
              <button type="button" onClick={odemeDuzenlemeKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekOdeme && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz?</h3>
            <p><strong>{silinecekOdeme.taraf}</strong> ödeme kaydı kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekOdeme(null)}>Hayır</button>
              <button type="button" className="tehlike" onClick={odemeSil}>Evet</button>
            </div>
          </div>
        </div>
      )}

      {musteriEklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Müşteri Ekle</h3>
            <div className="modal-form">
              <label>Müşteri Adı</label>
              <input value={musteriFormu.ad} onChange={(event) => musteriFormuGuncelle('ad', event.target.value)} />

              <label>Telefon Numarası</label>
              <input value={musteriFormu.telefon} onChange={(event) => musteriFormuGuncelle('telefon', event.target.value)} />

              <label>Son Satın Alım</label>
              <input type="date" value={musteriFormu.sonAlim} onChange={(event) => musteriFormuGuncelle('sonAlim', event.target.value)} />

              <label>Sipariş Sayısı</label>
              <input type="number" value={musteriFormu.toplamSiparis} onChange={(event) => musteriFormuGuncelle('toplamSiparis', event.target.value)} />

              <label>Toplam Harcama</label>
              <input type="number" value={musteriFormu.toplamHarcama} onChange={(event) => musteriFormuGuncelle('toplamHarcama', event.target.value)} />

              <label>Not</label>
              <input value={musteriFormu.not} onChange={(event) => musteriFormuGuncelle('not', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setMusteriEklemeAcik(false)}>İptal</button>
              <button type="button" onClick={() => musteriKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {musteriDuzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Müşteriyi Düzenle</h3>
            <div className="modal-form">
              <label>Müşteri Adı</label>
              <input value={musteriFormu.ad} onChange={(event) => musteriFormuGuncelle('ad', event.target.value)} />

              <label>Telefon Numarası</label>
              <input value={musteriFormu.telefon} onChange={(event) => musteriFormuGuncelle('telefon', event.target.value)} />

              <label>Son Satın Alım</label>
              <input type="date" value={musteriFormu.sonAlim} onChange={(event) => musteriFormuGuncelle('sonAlim', event.target.value)} />

              <label>Sipariş Sayısı</label>
              <input type="number" value={musteriFormu.toplamSiparis} onChange={(event) => musteriFormuGuncelle('toplamSiparis', event.target.value)} />

              <label>Toplam Harcama</label>
              <input type="number" value={musteriFormu.toplamHarcama} onChange={(event) => musteriFormuGuncelle('toplamHarcama', event.target.value)} />

              <label>Not</label>
              <input value={musteriFormu.not} onChange={(event) => musteriFormuGuncelle('not', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setMusteriDuzenlemeAcik(false)}>İptal</button>
              <button type="button" onClick={() => musteriKaydet('duzenle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {musteriNotAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Müşteri Notu</h3>
            <div className="modal-form">
              <label>Not İçeriği</label>
              <textarea className="musteri-not-alani" value={musteriNotMetni} onChange={(event) => setMusteriNotMetni(event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setMusteriNotAcik(false)}>İptal</button>
              <button type="button" onClick={musteriNotKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekMusteri && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz?</h3>
            <p><strong>{silinecekMusteri.ad}</strong> müşteri listesinden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekMusteri(null)}>Hayır</button>
              <button type="button" className="tehlike" onClick={musteriSil}>Evet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciEklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Tedarikçi Ekle</h3>
            <div className="modal-form">
              <label>Firma Adı</label>
              <input value={tedarikciFormu.firmaAdi} onChange={(event) => tedarikciFormuGuncelle('firmaAdi', event.target.value)} />
              <label>Yetkili Kişi</label>
              <input value={tedarikciFormu.yetkiliKisi} onChange={(event) => tedarikciFormuGuncelle('yetkiliKisi', event.target.value)} />
              <label>Telefon</label>
              <input value={tedarikciFormu.telefon} onChange={(event) => tedarikciFormuGuncelle('telefon', event.target.value)} />
              <label>E-posta</label>
              <input value={tedarikciFormu.email} onChange={(event) => tedarikciFormuGuncelle('email', event.target.value)} />
              <label>Adres</label>
              <input value={tedarikciFormu.adres} onChange={(event) => tedarikciFormuGuncelle('adres', event.target.value)} />
              <label>Vergi Numarası</label>
              <input value={tedarikciFormu.vergiNumarasi} onChange={(event) => tedarikciFormuGuncelle('vergiNumarasi', event.target.value)} />
              <label>Ürün Grubu</label>
              <input value={tedarikciFormu.urunGrubu} onChange={(event) => tedarikciFormuGuncelle('urunGrubu', event.target.value)} />
              <label>Toplam Alış Sayısı</label>
              <input type="number" value={tedarikciFormu.toplamAlisSayisi} onChange={(event) => tedarikciFormuGuncelle('toplamAlisSayisi', event.target.value)} />
              <label>Ortalama Teslim Süresi</label>
              <input value={tedarikciFormu.ortalamaTeslimSuresi} onChange={(event) => tedarikciFormuGuncelle('ortalamaTeslimSuresi', event.target.value)} />
              <label>Toplam Harcama</label>
              <input type="number" value={tedarikciFormu.toplamHarcama} onChange={(event) => tedarikciFormuGuncelle('toplamHarcama', event.target.value)} />
              <label>Not</label>
              <textarea className="musteri-not-alani" value={tedarikciFormu.not} onChange={(event) => tedarikciFormuGuncelle('not', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setTedarikciEklemeAcik(false)}>İptal</button>
              <button type="button" onClick={() => tedarikciKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciDuzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Tedarikçiyi Düzenle</h3>
            <div className="modal-form">
              <label>Firma Adı</label>
              <input value={tedarikciFormu.firmaAdi} onChange={(event) => tedarikciFormuGuncelle('firmaAdi', event.target.value)} />
              <label>Yetkili Kişi</label>
              <input value={tedarikciFormu.yetkiliKisi} onChange={(event) => tedarikciFormuGuncelle('yetkiliKisi', event.target.value)} />
              <label>Telefon</label>
              <input value={tedarikciFormu.telefon} onChange={(event) => tedarikciFormuGuncelle('telefon', event.target.value)} />
              <label>E-posta</label>
              <input value={tedarikciFormu.email} onChange={(event) => tedarikciFormuGuncelle('email', event.target.value)} />
              <label>Adres</label>
              <input value={tedarikciFormu.adres} onChange={(event) => tedarikciFormuGuncelle('adres', event.target.value)} />
              <label>Vergi Numarası</label>
              <input value={tedarikciFormu.vergiNumarasi} onChange={(event) => tedarikciFormuGuncelle('vergiNumarasi', event.target.value)} />
              <label>Ürün Grubu</label>
              <input value={tedarikciFormu.urunGrubu} onChange={(event) => tedarikciFormuGuncelle('urunGrubu', event.target.value)} />
              <label>Toplam Alış Sayısı</label>
              <input type="number" value={tedarikciFormu.toplamAlisSayisi} onChange={(event) => tedarikciFormuGuncelle('toplamAlisSayisi', event.target.value)} />
              <label>Ortalama Teslim Süresi</label>
              <input value={tedarikciFormu.ortalamaTeslimSuresi} onChange={(event) => tedarikciFormuGuncelle('ortalamaTeslimSuresi', event.target.value)} />
              <label>Toplam Harcama</label>
              <input type="number" value={tedarikciFormu.toplamHarcama} onChange={(event) => tedarikciFormuGuncelle('toplamHarcama', event.target.value)} />
              <label>Not</label>
              <textarea className="musteri-not-alani" value={tedarikciFormu.not} onChange={(event) => tedarikciFormuGuncelle('not', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setTedarikciDuzenlemeAcik(false)}>İptal</button>
              <button type="button" onClick={() => tedarikciKaydet('duzenle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciNotAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Tedarikçi Notu</h3>
            <div className="modal-form">
              <label>Not İçeriği</label>
              <textarea className="musteri-not-alani" value={tedarikciNotMetni} onChange={(event) => setTedarikciNotMetni(event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setTedarikciNotAcik(false)}>İptal</button>
              <button type="button" onClick={tedarikciNotKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciDetayAcik && seciliTedarikci && (
        <div className="modal-kaplama">
          <div className="modal-kutu buyuk tedarikci-detay-modali">
            <div className="tedarikci-detay-ust">
              <div className="tedarikci-detay-kimlik">
                <span className="musteri-avatar tedarikci-avatar buyuk" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                <div>
                  <h3>{seciliTedarikci.firmaAdi}</h3>
                  <p>{seciliTedarikci.yetkiliKisi} • {seciliTedarikci.urunGrubu}</p>
                </div>
              </div>
              <div className="odeme-sekme-alani tedarikci-sekme-alani">
                <button type="button" className={`odeme-sekme ${tedarikciDetaySekmesi === 'genel' ? 'aktif' : ''}`} onClick={() => setTedarikciDetaySekmesi('genel')}>Genel Bilgiler</button>
                <button type="button" className={`odeme-sekme ${tedarikciDetaySekmesi === 'siparisler' ? 'aktif' : ''}`} onClick={() => setTedarikciDetaySekmesi('siparisler')}>Siparişler</button>
              </div>
            </div>

            {tedarikciDetaySekmesi === 'genel' && (
              <div className="tedarikci-detay-icerik">
                <section className="tedarikci-bilgi-grid">
                  <div className="mobil-bilgi-satiri"><span>Firma Adı</span><strong>{seciliTedarikci.firmaAdi}</strong></div>
                  <div className="mobil-bilgi-satiri"><span>Yetkili Kişi</span><strong>{seciliTedarikci.yetkiliKisi}</strong></div>
                  <div className="mobil-bilgi-satiri"><span>Telefon</span><strong>{seciliTedarikci.telefon}</strong></div>
                  <div className="mobil-bilgi-satiri"><span>E-posta</span><strong>{seciliTedarikci.email}</strong></div>
                  <div className="mobil-bilgi-satiri tam"><span>Adres</span><strong>{seciliTedarikci.adres}</strong></div>
                  <div className="mobil-bilgi-satiri"><span>Vergi Numarası</span><strong>{seciliTedarikci.vergiNumarasi}</strong></div>
                </section>

                <section className="dashboard-canli-grid tedarikci-analiz-grid">
                  <article className="canli-ozet-kart">
                    <span className="canli-ozet-etiket">Toplam Alış Sayısı</span>
                    <strong>{seciliTedarikci.toplamAlisSayisi}</strong>
                  </article>
                  <article className="canli-ozet-kart">
                    <span className="canli-ozet-etiket">Ortalama Teslim Süresi</span>
                    <strong>{seciliTedarikci.ortalamaTeslimSuresi}</strong>
                  </article>
                  <article className="canli-ozet-kart">
                    <span className="canli-ozet-etiket">Toplam Harcama</span>
                    <strong>{paraFormatla(seciliTedarikci.toplamHarcama)}</strong>
                  </article>
                </section>

                <section className="panel-kart">
                  <h2>Tedarikçiden Alınan Ürünler</h2>
                  <div className="tablo-sarmal">
                    <table>
                      <thead>
                        <tr>
                          <th>Ürün</th>
                          <th>Son Fiyat</th>
                          <th>Son Alış Tarihi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seciliTedarikci.alinanUrunler.map((urun) => (
                          <tr key={`${seciliTedarikci.uid}-${urun.urun}`}>
                            <td>{urun.urun}</td>
                            <td>{paraFormatla(urun.sonFiyat)}</td>
                            <td>{tarihFormatla(urun.sonAlisTarihi)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel-kart">
                  <h2>Fiyat Geçmişi</h2>
                  <div className="tablo-sarmal">
                    <table>
                      <thead>
                        <tr>
                          <th>Tarih</th>
                          <th>Ürün</th>
                          <th>Fiyat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seciliTedarikci.fiyatGecmisi.map((kayit, index) => (
                          <tr key={`${seciliTedarikci.uid}-fiyat-${index}`}>
                            <td>{tarihFormatla(kayit.tarih)}</td>
                            <td>{kayit.urun}</td>
                            <td>{paraFormatla(kayit.fiyat)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel-kart">
                  <h2>Notlar</h2>
                  <p className="tedarikci-detay-not">{seciliTedarikci.not}</p>
                </section>
              </div>
            )}

            {tedarikciDetaySekmesi === 'siparisler' && (
              <div className="tedarikci-detay-icerik">
                <section className="panel-kart">
                  <div className="panel-ust-cizgi">
                    <h2>Tedarikçiye Verilen Siparişler</h2>
                    <button type="button" className="siparis-aksiyon-buton" onClick={tedarikciSiparisEklemeAc}>
                      Yeni Sipariş
                    </button>
                  </div>
                  <div className="tablo-sarmal masaustu-tablo">
                    <table>
                      <thead>
                        <tr>
                          <th>Sipariş No</th>
                          <th>Tarih</th>
                          <th>Tutar</th>
                          <th>Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seciliTedarikci.siparisler.map((siparis) => (
                          <tr key={siparis.siparisNo}>
                            <td>{siparis.siparisNo}</td>
                            <td>{tarihFormatla(siparis.tarih)}</td>
                            <td>{paraFormatla(siparis.tutar)}</td>
                            <td><span className={`tedarik-durum ${siparis.durum === 'Teslim alındı' ? 'teslim' : siparis.durum === 'Hazırlanıyor' ? 'hazirlaniyor' : 'bekliyor'}`}>{siparis.durum}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mobil-kart-listesi tedarikci-detay-mobil">
                    {seciliTedarikci.siparisler.map((siparis) => (
                      <article key={`mobil-${siparis.siparisNo}`} className="mobil-kart">
                        <div className="mobil-kart-ust">
                          <strong>{siparis.siparisNo}</strong>
                          <span className={`tedarik-durum ${siparis.durum === 'Teslim alındı' ? 'teslim' : siparis.durum === 'Hazırlanıyor' ? 'hazirlaniyor' : 'bekliyor'}`}>{siparis.durum}</span>
                        </div>
                        <div className="mobil-kart-govde">
                          <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(siparis.tarih)}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(siparis.tutar)}</strong></div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            )}

            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setTedarikciDetayAcik(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {silinecekTedarikci && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz?</h3>
            <p><strong>{silinecekTedarikci.firmaAdi}</strong> tedarikçi listesinden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekTedarikci(null)}>Hayır</button>
              <button type="button" className="tehlike" onClick={tedarikciSil}>Evet</button>
            </div>
          </div>
        </div>
      )}

      {tedarikciSiparisEklemeAcik && seciliTedarikci && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>{seciliTedarikci.firmaAdi} için Yeni Sipariş</h3>
            <div className="modal-form">
              <label>Sipariş No</label>
              <input value={tedarikciSiparisFormu.siparisNo} onChange={(event) => tedarikciSiparisFormuGuncelle('siparisNo', event.target.value)} />

              <label>Tarih</label>
              <input type="date" value={tedarikciSiparisFormu.tarih} onChange={(event) => tedarikciSiparisFormuGuncelle('tarih', event.target.value)} />

              <label>Tutar</label>
              <input type="number" value={tedarikciSiparisFormu.tutar} onChange={(event) => tedarikciSiparisFormuGuncelle('tutar', event.target.value)} />

              <label>Durum</label>
              <select value={tedarikciSiparisFormu.durum} onChange={(event) => tedarikciSiparisFormuGuncelle('durum', event.target.value)}>
                <option>Bekliyor</option>
                <option>Hazırlanıyor</option>
                <option>Teslim alındı</option>
              </select>
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setTedarikciSiparisEklemeAcik(false)}>İptal</button>
              <button type="button" onClick={tedarikciSiparisKaydet}>Siparişi Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {genelTedarikSiparisAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Tedarikçi Siparişi Oluştur</h3>
            <div className="modal-form">
              <label>Tedarikçi</label>
              <select value={genelTedarikSiparisFormu.tedarikciUid} onChange={(event) => genelTedarikSiparisFormuGuncelle('tedarikciUid', event.target.value)}>
                <option value="">Tedarikçi seçin</option>
                {tedarikciler.map((tedarikci) => (
                  <option key={`genel-tedarikci-${tedarikci.uid}`} value={tedarikci.uid}>{tedarikci.firmaAdi}</option>
                ))}
              </select>

              <label>Sipariş No</label>
              <input value={genelTedarikSiparisFormu.siparisNo} onChange={(event) => genelTedarikSiparisFormuGuncelle('siparisNo', event.target.value)} />

              <label>Tarih</label>
              <input type="date" value={genelTedarikSiparisFormu.tarih} onChange={(event) => genelTedarikSiparisFormuGuncelle('tarih', event.target.value)} />

              <label>Tutar</label>
              <input type="number" value={genelTedarikSiparisFormu.tutar} onChange={(event) => genelTedarikSiparisFormuGuncelle('tutar', event.target.value)} />

              <label>Durum</label>
              <select value={genelTedarikSiparisFormu.durum} onChange={(event) => genelTedarikSiparisFormuGuncelle('durum', event.target.value)}>
                <option>Bekliyor</option>
                <option>Hazırlanıyor</option>
                <option>Teslim alındı</option>
              </select>
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setGenelTedarikSiparisAcik(false)}>İptal</button>
              <button type="button" onClick={genelTedarikSiparisKaydet}>Siparişi Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {(faturaDetayAcik || pdfOnizlemeAcik) && (
        <Suspense fallback={<div className="modal-kaplama"><div className="modal-kutu buyuk lazy-panel-bekleme">Belge ekranı yükleniyor...</div></div>}>
          <FaturaModallari
            faturaDetayAcik={faturaDetayAcik}
            faturaOnizleme={faturaOnizleme}
            faturayiPdfIndir={faturayiPdfIndir}
            faturayiYazdir={faturayiYazdir}
            paraFormatla={paraFormatla}
            pdfOnizlemeAcik={pdfOnizlemeAcik}
            seciliFatura={seciliFatura}
            setFaturaDetayAcik={setFaturaDetayAcik}
            setPdfOnizlemeAcik={setPdfOnizlemeAcik}
            tarihFormatla={tarihFormatla}
          />
        </Suspense>
      )}

      {eklemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Ürün Ekle</h3>
            <div className="modal-form">
              <label>Ürün İsmi</label>
              <input value={form.ad} onChange={(event) => formGuncelle('ad', event.target.value)} />

              <label>Ürün ID</label>
              <input value={form.urunId} onChange={(event) => formGuncelle('urunId', event.target.value)} />

              <label>Ürün Adedi</label>
              <input type="number" value={form.urunAdedi} onChange={(event) => formGuncelle('urunAdedi', event.target.value)} />

              <label>Minimum Stok</label>
              <input type="number" value={form.minimumStok} onChange={(event) => formGuncelle('minimumStok', event.target.value)} />

              <label>Mağazadaki Ürün Sayısı</label>
              <input type="number" value={form.magazaStok} onChange={(event) => formGuncelle('magazaStok', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setEklemeAcik(false)}>İptal</button>
              <button type="button" onClick={() => formKaydet('ekle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {duzenlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Ürünü Düzenle</h3>
            <div className="modal-form">
              <label>Ürün İsmi</label>
              <input value={form.ad} onChange={(event) => formGuncelle('ad', event.target.value)} />

              <label>Ürün ID</label>
              <input value={form.urunId} onChange={(event) => formGuncelle('urunId', event.target.value)} />

              <label>Ürün Adedi</label>
              <input type="number" value={form.urunAdedi} onChange={(event) => formGuncelle('urunAdedi', event.target.value)} />

              <label>Minimum Stok</label>
              <input type="number" value={form.minimumStok} onChange={(event) => formGuncelle('minimumStok', event.target.value)} />

              <label>Mağazadaki Ürün Sayısı</label>
              <input type="number" value={form.magazaStok} onChange={(event) => formGuncelle('magazaStok', event.target.value)} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setDuzenlemeAcik(false)}>İptal</button>
              <button type="button" onClick={() => formKaydet('duzenle')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {urunDuzenlemeModalAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu">
            <h3>Ürünü Düzenle</h3>
            <div className="modal-form">
              <label>Ürün İsmi</label>
              <input value={urunDuzenlemeFormu.ad} onChange={(event) => setUrunDuzenlemeFormu((onceki) => ({ ...onceki, ad: event.target.value }))} />

              <label>Ürün ID</label>
              <input value={urunDuzenlemeFormu.urunId} onChange={(event) => setUrunDuzenlemeFormu((onceki) => ({ ...onceki, urunId: event.target.value }))} />

              <label>Ürün Adedi</label>
              <input type="number" value={urunDuzenlemeFormu.urunAdedi} onChange={(event) => setUrunDuzenlemeFormu((onceki) => ({ ...onceki, urunAdedi: event.target.value }))} />

              <label>Alış Fiyatı</label>
              <input type="number" value={urunDuzenlemeFormu.alisFiyati} onChange={(event) => setUrunDuzenlemeFormu((onceki) => ({ ...onceki, alisFiyati: event.target.value }))} />

              <label>Satış Fiyatı</label>
              <input type="number" value={urunDuzenlemeFormu.satisFiyati} onChange={(event) => setUrunDuzenlemeFormu((onceki) => ({ ...onceki, satisFiyati: event.target.value }))} />

              <label>Mağazadaki Ürün Sayısı</label>
              <input type="number" value={urunDuzenlemeFormu.magazaStok} onChange={(event) => setUrunDuzenlemeFormu((onceki) => ({ ...onceki, magazaStok: event.target.value }))} />
            </div>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setUrunDuzenlemeModalAcik(false)}>İptal</button>
              <button type="button" onClick={urunDuzenlemeKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekUrun && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz?</h3>
            <p><strong>{silinecekUrun.ad}</strong> envanterden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekUrun(null)}>Hayır</button>
              <button type="button" className="tehlike" onClick={urunSil}>Evet</button>
            </div>
          </div>
        </div>
      )}

      {silinecekDuzenlemeUrunu && (
        <div className="modal-kaplama">
          <div className="modal-kutu kucuk">
            <h3>Silmek istediğinizden emin misiniz?</h3>
            <p><strong>{silinecekDuzenlemeUrunu.ad}</strong> ürün düzenleme listesinden kaldırılacak.</p>
            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => setSilinecekDuzenlemeUrunu(null)}>Hayır</button>
              <button type="button" className="tehlike" onClick={urunDuzenlemeSil}>Evet</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
