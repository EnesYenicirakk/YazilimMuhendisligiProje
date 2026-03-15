import { useEffect, useMemo, useState } from 'react'
import './App.css'

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'
const SAYFA_BASINA_URUN = 8
const ODEME_SAYFA_BASINA = 10

const baslangicUrunleri = [
  { uid: 1, urunId: 'FRN-1001', ad: 'Fren Balatası Ön Takım', avatar: 'FB', urunAdedi: 84, magazaStok: 126, favori: false },
  { uid: 2, urunId: 'YGF-1002', ad: 'Yağ Filtresi', avatar: 'YF', urunAdedi: 145, magazaStok: 210, favori: false },
  { uid: 3, urunId: 'HVF-1003', ad: 'Hava Filtresi', avatar: 'HF', urunAdedi: 112, magazaStok: 168, favori: false },
  { uid: 4, urunId: 'BUJ-1004', ad: 'Buji Takımı', avatar: 'BT', urunAdedi: 63, magazaStok: 95, favori: false },
  { uid: 5, urunId: 'AMR-1005', ad: 'Amortisör Ön Çift', avatar: 'AM', urunAdedi: 29, magazaStok: 44, favori: false },
  { uid: 6, urunId: 'DBR-1006', ad: 'Debriyaj Seti', avatar: 'DS', urunAdedi: 38, magazaStok: 57, favori: false },
  { uid: 7, urunId: 'AKU-1007', ad: 'Aku 72Ah', avatar: 'AK', urunAdedi: 21, magazaStok: 35, favori: false },
  { uid: 8, urunId: 'TRM-1008', ad: 'Triger Kayışı Seti', avatar: 'TK', urunAdedi: 52, magazaStok: 73, favori: false },
  { uid: 9, urunId: 'RAD-1009', ad: 'Radyatör Üst Hortum', avatar: 'RH', urunAdedi: 46, magazaStok: 70, favori: false },
  { uid: 10, urunId: 'BLC-1010', ad: 'Balata Spreyi', avatar: 'BS', urunAdedi: 76, magazaStok: 120, favori: false },
  { uid: 11, urunId: 'KLR-1011', ad: 'Klima Kompresörü', avatar: 'KK', urunAdedi: 18, magazaStok: 27, favori: false },
  { uid: 12, urunId: 'MTR-1012', ad: 'Motor Takozu', avatar: 'MT', urunAdedi: 41, magazaStok: 62, favori: false },
  { uid: 13, urunId: 'SRS-1013', ad: 'Şarj Dinamosu', avatar: 'SD', urunAdedi: 24, magazaStok: 36, favori: false },
  { uid: 14, urunId: 'DST-1014', ad: 'Direksiyon Kutusu', avatar: 'DK', urunAdedi: 12, magazaStok: 19, favori: false },
  { uid: 15, urunId: 'EKS-1015', ad: 'Eksantrik Sensörü', avatar: 'ES', urunAdedi: 58, magazaStok: 88, favori: false },
  { uid: 16, urunId: 'ENJ-1016', ad: 'Enjektör Takımı', avatar: 'ET', urunAdedi: 35, magazaStok: 51, favori: false },
  { uid: 17, urunId: 'ROL-1017', ad: 'Rölanti Motoru', avatar: 'RM', urunAdedi: 33, magazaStok: 47, favori: false },
  { uid: 18, urunId: 'YGR-1018', ad: 'Yağ Radyatörü', avatar: 'YR', urunAdedi: 17, magazaStok: 24, favori: false },
  { uid: 19, urunId: 'KRN-1019', ad: 'Krank Kasnağı', avatar: 'KK', urunAdedi: 27, magazaStok: 39, favori: false },
  { uid: 20, urunId: 'TRB-1020', ad: 'Turbo Hortumu', avatar: 'TH', urunAdedi: 22, magazaStok: 31, favori: false },
  { uid: 21, urunId: 'ABS-1021', ad: 'ABS Sensörü', avatar: 'AS', urunAdedi: 49, magazaStok: 74, favori: false },
  { uid: 22, urunId: 'SUS-1022', ad: 'Susturucu Arka', avatar: 'SA', urunAdedi: 14, magazaStok: 20, favori: false },
  { uid: 23, urunId: 'BIL-1023', ad: 'Bijon Somunu Seti', avatar: 'BS', urunAdedi: 90, magazaStok: 140, favori: false },
  { uid: 24, urunId: 'FAR-1024', ad: 'Far Ampulü H7', avatar: 'FA', urunAdedi: 110, magazaStok: 165, favori: false },
]

const dashboardOzetSablon = [
  { baslik: 'Acil Sipariş', deger: '17', degisim: '-%6', ikon: '◻' },
  { baslik: 'Toplam Sipariş', deger: '1865', degisim: '+%12', ikon: '▣' },
  { baslik: 'Ortalama Teslimat', deger: '2,6 Gün', degisim: '+%8', ikon: '◷' },
]

const baslangicSiparisleri = [
  { siparisNo: '#SP-2134', musteri: 'Yıldız Oto', urun: 'Fren Balatası Ön Takım', toplamTutar: 8400, siparisTarihi: '2026-03-10', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Yolda', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2133', musteri: 'Tekin Otomotiv', urun: 'Amortisör Ön Çift', toplamTutar: 9250, siparisTarihi: '2026-03-09', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '3 iş günü' },
  { siparisNo: '#SP-2132', musteri: 'Mert Motor', urun: 'Debriyaj Seti', toplamTutar: 6150, siparisTarihi: '2026-03-08', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2131', musteri: 'Hızlı Servis', urun: 'Yağ Filtresi', toplamTutar: 1760, siparisTarihi: '2026-03-07', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Yolda', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2130', musteri: 'Akın Oto', urun: 'Triger Kayışı Seti', toplamTutar: 3980, siparisTarihi: '2026-03-06', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2129', musteri: 'Bora Yedek Parça', urun: 'Akü 72Ah', toplamTutar: 11200, siparisTarihi: '2026-03-05', odemeDurumu: 'Beklemede', urunHazirlik: 'Tedarik Bekleniyor', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '4 iş günü' },
  { siparisNo: '#SP-2128', musteri: 'Demir Oto', urun: 'Radyatör Üst Hortum', toplamTutar: 2350, siparisTarihi: '2026-03-04', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2127', musteri: 'Asil Sanayi', urun: 'Klima Kompresörü', toplamTutar: 18750, siparisTarihi: '2026-03-03', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Yolda', teslimatSuresi: '3 iş günü' },
  { siparisNo: '#SP-2126', musteri: 'Nehir Otomotiv', urun: 'ABS Sensörü', toplamTutar: 3270, siparisTarihi: '2026-03-02', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2125', musteri: 'Kaya Oto Servis', urun: 'Turbo Hortumu', toplamTutar: 2860, siparisTarihi: '2026-03-01', odemeDurumu: 'Beklemede', urunHazirlik: 'Tedarik Bekleniyor', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '5 iş günü' },
  { siparisNo: '#SP-2124', musteri: 'Yaman Yedek', urun: 'Far Ampulü H7', toplamTutar: 980, siparisTarihi: '2026-02-28', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2123', musteri: 'Gürkan Oto', urun: 'Direksiyon Kutusu', toplamTutar: 15600, siparisTarihi: '2026-02-27', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Yolda', teslimatSuresi: '3 iş günü' },
]

const gelenNakitKayitlari = [
  { odemeNo: 'GN-5001', taraf: 'Yıldız Oto', tarih: '2026-03-11', durum: 'Tahsil Edildi', tutar: 94500 },
  { odemeNo: 'GN-5002', taraf: 'Tekin Otomotiv', tarih: '2026-03-10', durum: 'Tahsil Edildi', tutar: 88200 },
  { odemeNo: 'GN-5003', taraf: 'Mert Motor', tarih: '2026-03-10', durum: 'Tahsil Edildi', tutar: 76400 },
  { odemeNo: 'GN-5004', taraf: 'Hızlı Servis', tarih: '2026-03-09', durum: 'Tahsil Edildi', tutar: 69250 },
  { odemeNo: 'GN-5005', taraf: 'Asil Sanayi', tarih: '2026-03-09', durum: 'Tahsil Edildi', tutar: 101300 },
  { odemeNo: 'GN-5006', taraf: 'Nehir Otomotiv', tarih: '2026-03-08', durum: 'Tahsil Edildi', tutar: 57300 },
  { odemeNo: 'GN-5007', taraf: 'Akın Oto', tarih: '2026-03-08', durum: 'Tahsil Edildi', tutar: 66400 },
  { odemeNo: 'GN-5008', taraf: 'Demir Oto', tarih: '2026-03-07', durum: 'Tahsil Edildi', tutar: 81250 },
  { odemeNo: 'GN-5009', taraf: 'Kaya Oto Servis', tarih: '2026-03-07', durum: 'Tahsil Edildi', tutar: 53890 },
  { odemeNo: 'GN-5010', taraf: 'Bora Yedek Parça', tarih: '2026-03-06', durum: 'Tahsil Edildi', tutar: 73400 },
  { odemeNo: 'GN-5011', taraf: 'Gürkan Oto', tarih: '2026-03-06', durum: 'Tahsil Edildi', tutar: 68500 },
  { odemeNo: 'GN-5012', taraf: 'Yaman Yedek', tarih: '2026-03-05', durum: 'Tahsil Edildi', tutar: 49700 },
  { odemeNo: 'GN-5013', taraf: 'Volkan Oto', tarih: '2026-03-05', durum: 'Tahsil Edildi', tutar: 62900 },
  { odemeNo: 'GN-5014', taraf: 'Acar Endüstri', tarih: '2026-03-04', durum: 'Tahsil Edildi', tutar: 91800 },
  { odemeNo: 'GN-5015', taraf: 'Baran Ticaret', tarih: '2026-03-04', durum: 'Tahsil Edildi', tutar: 57200 },
  { odemeNo: 'GN-5016', taraf: 'Uzman Oto', tarih: '2026-03-03', durum: 'Tahsil Edildi', tutar: 68700 },
  { odemeNo: 'GN-5017', taraf: 'Özkan Parça', tarih: '2026-03-03', durum: 'Tahsil Edildi', tutar: 74200 },
  { odemeNo: 'GN-5018', taraf: 'Merkez Lojistik', tarih: '2026-03-02', durum: 'Tahsil Edildi', tutar: 55650 },
  { odemeNo: 'GN-5019', taraf: 'Delta Motor', tarih: '2026-03-02', durum: 'Tahsil Edildi', tutar: 63300 },
  { odemeNo: 'GN-5020', taraf: 'Sistem Otomotiv', tarih: '2026-03-01', durum: 'Tahsil Edildi', tutar: 87900 },
]

const gidenNakitKayitlari = [
  { odemeNo: 'GD-7001', taraf: 'Anadolu Çelik', tarih: '2026-03-11', durum: 'Ödendi', tutar: 26800 },
  { odemeNo: 'GD-7002', taraf: 'Beta Lojistik', tarih: '2026-03-10', durum: 'Ödendi', tutar: 31900 },
  { odemeNo: 'GD-7003', taraf: 'Mavi Enerji', tarih: '2026-03-10', durum: 'Ödendi', tutar: 24150 },
  { odemeNo: 'GD-7004', taraf: 'Yıldız Plastik', tarih: '2026-03-09', durum: 'Ödendi', tutar: 37200 },
  { odemeNo: 'GD-7005', taraf: 'Eksen Makine', tarih: '2026-03-09', durum: 'Ödendi', tutar: 29500 },
  { odemeNo: 'GD-7006', taraf: 'Poyraz Nakliyat', tarih: '2026-03-08', durum: 'Ödendi', tutar: 28400 },
  { odemeNo: 'GD-7007', taraf: 'Kuzey Kimya', tarih: '2026-03-08', durum: 'Ödendi', tutar: 33600 },
  { odemeNo: 'GD-7008', taraf: 'Arel Teknik', tarih: '2026-03-07', durum: 'Ödendi', tutar: 31100 },
  { odemeNo: 'GD-7009', taraf: 'Toros Kargo', tarih: '2026-03-07', durum: 'Ödendi', tutar: 22300 },
  { odemeNo: 'GD-7010', taraf: 'Merkez Kira', tarih: '2026-03-06', durum: 'Ödendi', tutar: 45200 },
  { odemeNo: 'GD-7011', taraf: 'Bilişim Destek', tarih: '2026-03-06', durum: 'Ödendi', tutar: 18800 },
  { odemeNo: 'GD-7012', taraf: 'İş Güvenliği AŞ', tarih: '2026-03-05', durum: 'Ödendi', tutar: 21200 },
  { odemeNo: 'GD-7013', taraf: 'Motor Test Lab', tarih: '2026-03-05', durum: 'Ödendi', tutar: 27400 },
  { odemeNo: 'GD-7014', taraf: 'Atılım Danışmanlık', tarih: '2026-03-04', durum: 'Ödendi', tutar: 19600 },
  { odemeNo: 'GD-7015', taraf: 'Özgür Reklam', tarih: '2026-03-04', durum: 'Ödendi', tutar: 16400 },
  { odemeNo: 'GD-7016', taraf: 'Kule Sigorta', tarih: '2026-03-03', durum: 'Ödendi', tutar: 25750 },
  { odemeNo: 'GD-7017', taraf: 'Duru Temizlik', tarih: '2026-03-03', durum: 'Ödendi', tutar: 14600 },
  { odemeNo: 'GD-7018', taraf: 'Sunucu Bulut', tarih: '2026-03-02', durum: 'Ödendi', tutar: 17350 },
  { odemeNo: 'GD-7019', taraf: 'Koçak Akaryakıt', tarih: '2026-03-02', durum: 'Ödendi', tutar: 29800 },
  { odemeNo: 'GD-7020', taraf: 'Asya Ambalaj', tarih: '2026-03-01', durum: 'Ödendi', tutar: 20500 },
]

const tarihFormatla = (isoTarih) => {
  const tarih = new Date(isoTarih)
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tarih)
}

const paraFormatla = (deger) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(deger)
}

const aylar = ['May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki']
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
  if (durum === 'Hazırlanıyor') return 'durum-hazirlaniyor'
  if (durum === 'Teslim Edildi') return 'durum-teslim'
  return ''
}

const bosForm = {
  urunId: '',
  ad: '',
  urunAdedi: '',
  magazaStok: '',
}

const merkezMenusu = [
  { sayfa: 'dashboard', baslik: 'Dashboard', renk: 'turuncu', aciklama: 'Özet görünüm' },
  { sayfa: 'envanter', baslik: 'Envanter', renk: 'yesil-koyu', aciklama: 'Stok yönetimi' },
  { sayfa: 'siparisler', baslik: 'Siparişler', renk: 'altin', aciklama: 'Sipariş hareketleri' },
  { sayfa: 'musteriler', baslik: 'Kayıtlı Müşteriler', renk: 'turkuaz', aciklama: 'Müşteri listesi' },
  { sayfa: 'alicilar', baslik: 'Kayıtlı Alıcılar', renk: 'lacivert', aciklama: 'Alıcı kayıtları' },
  { sayfa: 'odemeler', baslik: 'Finansal Akış', renk: 'kehribar', aciklama: 'Nakit akışı' },
  { sayfa: 'urun-duzenleme', baslik: 'Ürün Düzenleme', renk: 'mavi-gri', aciklama: 'Ürün güncelleme' },
  { sayfa: 'faturalama', baslik: 'Faturalama (PDF)', renk: 'kiremit', aciklama: 'Fatura üretimi' },
]

function SayfaIkonu({ sayfa, className = 'menu-ikon' }) {
  if (sayfa === 'dashboard') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="5" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="11" width="7" height="9" rx="1.2" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'envanter') {
    return (
      <span className={`${className} menu-ikon-envanter`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6.5" y="5.8" width="11" height="14.7" rx="1.8" />
          <path d="M9 4.8h6v2.1H9z" />
          <path d="M9.3 10h5.5M9.3 13h5.5M9.3 16h4.2" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'musteriler') {
    return (
      <span className={`${className} menu-ikon-telefon`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4.5h5l1.2 3.3-2.3 1.4a13.1 13.1 0 0 0 5.9 5.9l1.4-2.3L19.5 14v5a2 2 0 0 1-2.1 2A16.7 16.7 0 0 1 3 6.6 2 2 0 0 1 5 4.5z" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'alicilar') {
    return (
      <span className={`${className} menu-ikon-telefon2`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="2.8" width="10" height="18.5" rx="2.2" />
          <circle cx="12" cy="17.2" r="1" />
          <path d="M10 5.8h4" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'odemeler') {
    return (
      <span className={`${className} menu-ikon-cuzdan`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="5" width="17" height="14" rx="2.5" />
          <path d="M19.5 9h2a1.5 1.5 0 0 1 0 6h-2" />
          <circle cx="16" cy="12" r="1.1" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'siparisler') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7.5h12M6 12h12M6 16.5h12" />
          <circle cx="4" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="4" cy="12" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="4" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'urun-duzenleme') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l4.2-1 9-9a2 2 0 0 0-2.8-2.8l-9 9L4 20z" />
          <path d="M13 6l5 5" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'faturalama') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3.5h8l3 3V20l-2-1.2L14 20l-2-1.2L10 20l-2-1.2L6 20V5a1.5 1.5 0 0 1 1-1.5z" />
          <path d="M9 10h6M9 13.5h6M9 17h4" />
        </svg>
      </span>
    )
  }

  return <span className={className} aria-hidden="true">•</span>
}

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const [aktifSayfa, setAktifSayfa] = useState('merkez')
  const [urunler, setUrunler] = useState(baslangicUrunleri)
  const [siparisler] = useState(baslangicSiparisleri)
  const [gelenNakitListesi, setGelenNakitListesi] = useState(() => gelenNakitKayitlari.map((k) => ({ ...k, favori: false })))
  const [gidenNakitListesi, setGidenNakitListesi] = useState(() => gidenNakitKayitlari.map((k) => ({ ...k, favori: false })))
  const [siparisArama, setSiparisArama] = useState('')
  const [siparisOdemeFiltresi, setSiparisOdemeFiltresi] = useState('Tüm Siparişler')
  const [odemeSekmesi, setOdemeSekmesi] = useState('gelen')
  const [gelenSayfa, setGelenSayfa] = useState(1)
  const [gidenSayfa, setGidenSayfa] = useState(1)
  const [duzenlenenOdeme, setDuzenlenenOdeme] = useState(null)
  const [odemeFormu, setOdemeFormu] = useState({ taraf: '', tarih: '', durum: '', tutar: '' })
  const [silinecekOdeme, setSilinecekOdeme] = useState(null)
  const [gecisBalonu, setGecisBalonu] = useState('')
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

  const siparisAktivitesi = useMemo(() => {
    const paketlenecek = filtreliSiparisler.filter(
      (siparis) => siparis.urunHazirlik === 'Hazırlanıyor' || siparis.urunHazirlik === 'Tedarik Bekleniyor',
    ).length
    const sevkEdilecek = filtreliSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Hazırlanıyor').length
    const teslimEdilecek = filtreliSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Yolda').length

    return { paketlenecek, sevkEdilecek, teslimEdilecek }
  }, [filtreliSiparisler])

  const siraliGelenNakit = useMemo(() => {
    return [...gelenNakitListesi].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
  }, [gelenNakitListesi])

  const siraliGidenNakit = useMemo(() => {
    return [...gidenNakitListesi].sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
  }, [gidenNakitListesi])

  const toplamGelenNakit = useMemo(() => siraliGelenNakit.reduce((toplam, kayit) => toplam + kayit.tutar, 0), [siraliGelenNakit])
  const toplamGidenNakit = useMemo(() => siraliGidenNakit.reduce((toplam, kayit) => toplam + kayit.tutar, 0), [siraliGidenNakit])
  const aySonuKari = toplamGelenNakit - toplamGidenNakit

  const dashboardOzet = useMemo(() => {
    return [
      { baslik: 'Toplam Gelir', deger: paraFormatla(aySonuKari), degisim: '+%14', ikon: '₺' },
      ...dashboardOzetSablon,
    ]
  }, [aySonuKari])

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

  const handleLogin = (event) => {
    event.preventDefault()

    if (username.trim() === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      setIsLoggedIn(true)
      setAktifSayfa('merkez')
      setError('')
      return
    }

    setError('Kullanıcı adı veya şifre hatalı.')
  }

  const sayfaDegistir = (sayfa) => {
    setAktifSayfa(sayfa)
    setEklemeAcik(false)
    setDuzenlemeAcik(false)
    setSilinecekUrun(null)
    setDuzenlenenOdeme(null)
    setSilinecekOdeme(null)
    if (sayfa === 'envanter') setEnvanterSayfa(1)
    if (sayfa === 'odemeler') {
      setOdemeSekmesi('gelen')
      setGelenSayfa(1)
      setGidenSayfa(1)
    }
  }

  const merkezeDon = () => {
    sayfaDegistir('merkez')
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
    if (!odemeFormu.taraf.trim() || !odemeFormu.tarih.trim() || !odemeFormu.durum.trim() || Number.isNaN(tutar)) return

    odemeListesiGuncelle(duzenlenenOdeme.sekme, (onceki) =>
      onceki.map((kayit) =>
        kayit.odemeNo === duzenlenenOdeme.odemeNo
          ? { ...kayit, taraf: odemeFormu.taraf.trim(), tarih: odemeFormu.tarih, durum: odemeFormu.durum.trim(), tutar }
          : kayit,
      ),
    )
    setDuzenlenenOdeme(null)
  }

  const odemeSil = () => {
    if (!silinecekOdeme) return
    odemeListesiGuncelle(silinecekOdeme.sekme, (onceki) => onceki.filter((k) => k.odemeNo !== silinecekOdeme.odemeNo))
    setSilinecekOdeme(null)
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
        <section className="login-shell" aria-label="Giriş Ekranı">
          <div className="panel left-panel">
            <img
              src="/ytu-logo.png"
              alt="Üniversite Logosu"
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
                placeholder="Kullanıcı adınizi girin"
                autoComplete="username"
              />

              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Şifrenizi girin"
                autoComplete="current-password"
              />

              <button type="submit">Giriş yap</button>
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
          <aside className="yan-menu">
            <h2>Menü</h2>
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
                  <span>Kayıtlı Alıcılar</span>
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

        <div className={`icerik-alani ${aktifSayfa === 'merkez' ? 'merkez-icerik' : ''}`}>
          {aktifSayfa === 'merkez' && (
            <section className={`merkez-ekrani ${gecisBalonu ? 'gecis-aktif' : ''}`}>
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
            </section>
          )}

          {aktifSayfa !== 'merkez' && (
            <button type="button" className="geri-buton" onClick={merkezeDon}>
              ← Merkeze Dön
            </button>
          )}
          {aktifSayfa === 'dashboard' && (
            <section>
              <header className="ust-baslik envanter-baslik">
                <div>
                  <h1>Dashboard</h1>
                  <p>Genel stok ve sipariş özeti</p>
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
                      <button type="button" className="ozet-menu" aria-label="Kart Menüsü">⋮</button>
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
                    <h2>Haftalık Satış Grafiği</h2>
                    <small>Son 7 gün</small>
                  </div>
                  <div className="haftalik-grafik-kapsayici">
                    <div className="satis-olcek">
                      {[haftalikSatisGrafikUstSinir, haftalikSatisGrafikUstSinir * 0.75, haftalikSatisGrafikUstSinir * 0.5, haftalikSatisGrafikUstSinir * 0.25, 0].map((deger) => (
                        <span key={deger}>{deger === 0 ? '0' : `₺${Math.round(deger / 1000)}B`}</span>
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
                          <span>{gun.etiket}</span>
                        </div>
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
              </section>

              <article className="panel-kart">
                <div className="panel-baslik">
                  <h2>Yakın Zamanda Satılan Ürünler</h2>
                  <small>Şehir içi siparişler</small>
                </div>
                <div className="tablo-sarmal">
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
            </section>
          )}

          {aktifSayfa === 'siparisler' && (
            <section>
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Siparişler</h1>
                  <p>En yeni siparişten en eski siparişe doğru listelenir.</p>
                </div>
                <button type="button" className="siparis-yeni-buton">Yeni Sipariş</button>
              </header>

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

              <section className="panel-kart siparisler-kart">
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

                <div className="tablo-sarmal">
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
                            <span className={`odeme-durumu ${siparis.odemeDurumu === 'Ödendi' ? 'odendi' : 'beklemede'}`}>
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

          {aktifSayfa === 'odemeler' && (
            <section>
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Finansal Akış</h1>
                  <p>Nakit akışını gelen ve giden olarak ayrı ayrı takip edin.</p>
                </div>
              </header>

              <section className="panel-kart odeme-kart">
                <div className="odeme-sekme-alani">
                  <button
                    type="button"
                    className={`odeme-sekme ${odemeSekmesi === 'gelen' ? 'aktif' : ''}`}
                    onClick={() => setOdemeSekmesi('gelen')}
                  >
                    Gelen Nakit
                  </button>
                  <button
                    type="button"
                    className={`odeme-sekme ${odemeSekmesi === 'giden' ? 'aktif' : ''}`}
                    onClick={() => setOdemeSekmesi('giden')}
                  >
                    Giden Nakit
                  </button>
                </div>

                <div className="tablo-sarmal">
                  <table>
                    <thead>
                      <tr>
                        <th>Ödeme No</th>
                        <th>Cari / Tedarikçi</th>
                        <th>Tarih</th>
                        <th>Durum</th>
                        <th>Tutar</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(odemeSekmesi === 'gelen' ? gelenSayfadakiKayitlar : gidenSayfadakiKayitlar).map((kayit) => (
                        <tr key={kayit.odemeNo}>
                          <td>{kayit.odemeNo}</td>
                          <td>{kayit.taraf}</td>
                          <td>{tarihFormatla(kayit.tarih)}</td>
                          <td>{kayit.durum}</td>
                          <td>
                            <span className={`nakit-tutar-baloncuk ${odemeSekmesi === 'gelen' ? 'gelen' : 'giden'}`}>
                              {paraFormatla(kayit.tutar)}
                            </span>
                          </td>
                          <td>
                            <div className="odeme-islemler">
                              <button
                                type="button"
                                className={`odeme-ikon yildiz ${kayit.favori ? 'aktif' : ''}`}
                                onClick={() => finansFavoriDegistir(odemeSekmesi, kayit.odemeNo)}
                                title="Favori"
                              >
                                ★
                              </button>
                              <button
                                type="button"
                                className="odeme-ikon kalem"
                                onClick={() => odemeDuzenlemeAc(odemeSekmesi, kayit)}
                                title="Düzenle"
                              >
                                ✎
                              </button>
                              <button
                                type="button"
                                className="odeme-ikon cop"
                                onClick={() => setSilinecekOdeme({ sekme: odemeSekmesi, odemeNo: kayit.odemeNo, taraf: kayit.taraf })}
                                title="Sil"
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

                <div className="sayfalama">
                  <button
                    type="button"
                    className="sayfa-ok"
                    onClick={() => (odemeSekmesi === 'gelen' ? setGelenSayfa((s) => Math.max(1, s - 1)) : setGidenSayfa((s) => Math.max(1, s - 1)))}
                    disabled={odemeSekmesi === 'gelen' ? gelenSayfa === 1 : gidenSayfa === 1}
                  >
                    ‹
                  </button>

                  {Array.from({ length: odemeSekmesi === 'gelen' ? toplamGelenSayfa : toplamGidenSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button
                      key={sayfaNo}
                      type="button"
                      className={`sayfa-buton ${(odemeSekmesi === 'gelen' ? gelenSayfa : gidenSayfa) === sayfaNo ? 'aktif' : ''}`}
                      onClick={() => (odemeSekmesi === 'gelen' ? setGelenSayfa(sayfaNo) : setGidenSayfa(sayfaNo))}
                    >
                      {sayfaNo}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="sayfa-ok"
                    onClick={() =>
                      odemeSekmesi === 'gelen'
                        ? setGelenSayfa((s) => Math.min(toplamGelenSayfa, s + 1))
                        : setGidenSayfa((s) => Math.min(toplamGidenSayfa, s + 1))
                    }
                    disabled={odemeSekmesi === 'gelen' ? gelenSayfa === toplamGelenSayfa : gidenSayfa === toplamGidenSayfa}
                  >
                    ›
                  </button>
                </div>
              </section>
            </section>
          )}

          {aktifSayfa === 'musteriler' && (
            <section>
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Kayıtlı Müşteriler</h1>
                  <p>Müşteri kayıtlarını bu ekrandan takip edeceksiniz.</p>
                </div>
              </header>
              <section className="panel-kart bos-modul-karti">
                <h2>Müşteri modülü hazırlanıyor</h2>
                <p>Bu alan sonraki adımda müşteri listesi, iletişim bilgileri ve satın alma geçmişiyle doldurulacak.</p>
              </section>
            </section>
          )}

          {aktifSayfa === 'alicilar' && (
            <section>
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Kayıtlı Alıcılar</h1>
                  <p>Kurumsal alıcı bilgileri bu bölümde toplanacak.</p>
                </div>
              </header>
              <section className="panel-kart bos-modul-karti">
                <h2>Alıcı modülü hazırlanıyor</h2>
                <p>Bu alanı bayi ve tedarik alıcı kayıtları için kullanacağız.</p>
              </section>
            </section>
          )}

          {aktifSayfa === 'urun-duzenleme' && (
            <section>
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Ürün Düzenleme</h1>
                  <p>Toplu ürün işlemleri için ayrılan alan.</p>
                </div>
              </header>
              <section className="panel-kart bos-modul-karti">
                <h2>Ürün düzenleme paneli hazırlanıyor</h2>
                <p>Toplu güncelleme, fiyat revizyonu ve ürün durum değişiklikleri burada olacak.</p>
              </section>
            </section>
          )}

          {aktifSayfa === 'faturalama' && (
            <section>
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Faturalama (PDF)</h1>
                  <p>PDF fatura oluşturma ekranı bu bölümde yer alacak.</p>
                </div>
              </header>
              <section className="panel-kart bos-modul-karti">
                <h2>Faturalama modülü hazırlanıyor</h2>
                <p>Fatura listesi, ön izleme ve PDF dışa aktarma burada konumlanacak.</p>
              </section>
            </section>
          )}

          {aktifSayfa === 'envanter' && (
            <section>
              <header className="ust-baslik envanter-baslik">
                <div>
                  <h1>Envanter</h1>
                  <p>Mağaza: Merkez Şube</p>
                </div>
                <button type="button" className="urun-ekle-karti" onClick={eklemePenceresiniAc}>
                  <span className="urun-ekle-ikon" aria-hidden="true">🛍</span>
                  <span className="urun-ekle-metin">Yeni Ürün</span>
                </button>
              </header>

              <section className="panel-kart envanter-kart">
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

                <div className="tablo-sarmal">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Ürün</th>
                        <th>Ürün ID</th>
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
                              <strong>{urun.ad}</strong>
                            </div>
                          </td>
                          <td>{urun.urunId}</td>
                          <td>{urun.urunAdedi}</td>
                          <td>{urun.magazaStok}</td>
                          <td>
                            <div className="islem-dugmeleri">
                              <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}>★</button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => duzenlemePenceresiniAc(urun)}>✎</button>
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
    </main>
  )
}

export default App


