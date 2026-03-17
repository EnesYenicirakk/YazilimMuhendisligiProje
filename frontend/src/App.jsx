import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import './App.css'

const FaturalamaPanel = lazy(() => import('./FaturalamaPanel'))
const BildirimPaneli = lazy(() => import('./BildirimPaneli'))
const AiPanel = lazy(() => import('./AiPanel'))
const FaturaModallari = lazy(() => import('./FaturaModallari'))

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'
const SAYFA_BASINA_URUN = 8
const ODEME_SAYFA_BASINA = 10
const MUSTERI_SAYFA_BASINA = 8
const TEDARIKCI_SAYFA_BASINA = 8
const SIPARIS_SAYFA_BASINA = 8
const STOK_LOG_SAYFA_BASINA = 8
const FATURA_KDV_ORANI = 0.2

const envanterKategorileri = ['Tümü', 'Motor', 'Fren', 'Filtre', 'Elektrik', 'Şanzıman', 'Diğer']

const avatarOlustur = (ad) =>
  ad
    .split(' ')
    .slice(0, 2)
    .map((parca) => parca[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2)

const urunOlustur = (uid, urunId, kategori, ad, urunAdedi, magazaStok, minimumStok, alisFiyati, satisFiyati) => ({
  uid,
  urunId,
  kategori,
  ad,
  avatar: avatarOlustur(ad),
  urunAdedi,
  magazaStok,
  minimumStok,
  alisFiyati,
  satisFiyati,
  favori: false,
})

const baslangicUrunleri = [
  urunOlustur(1, 'MTR-2001', 'Motor', 'Silindir Kapak Contası', 48, 22, 12, 740, 1090),
  urunOlustur(2, 'MTR-2002', 'Motor', 'Piston Segman Takımı', 34, 18, 10, 1680, 2290),
  urunOlustur(3, 'MTR-2003', 'Motor', 'Eksantrik Mili Sensörü', 52, 27, 12, 420, 690),
  urunOlustur(4, 'MTR-2004', 'Motor', 'Krank Sensörü', 61, 31, 14, 390, 620),
  urunOlustur(5, 'MTR-2005', 'Motor', 'Subap İtici Takımı', 28, 16, 8, 1320, 1840),
  urunOlustur(6, 'MTR-2006', 'Motor', 'Yağ Pompası', 23, 11, 8, 1460, 1980),
  urunOlustur(7, 'MTR-2007', 'Motor', 'Devirdaim Pompası', 39, 14, 10, 980, 1420),
  urunOlustur(8, 'MTR-2008', 'Motor', 'Motor Takozu Sağ', 33, 19, 10, 560, 810),
  urunOlustur(9, 'MTR-2009', 'Motor', 'Turbo Intercooler Hortumu', 44, 20, 12, 360, 590),
  urunOlustur(10, 'MTR-2010', 'Motor', 'Gaz Kelebeği', 18, 9, 8, 2850, 3640),
  urunOlustur(11, 'MTR-2011', 'Motor', 'Rölanti Valfi', 27, 12, 8, 790, 1180),
  urunOlustur(12, 'MTR-2012', 'Motor', 'Motor Yağ Soğutucusu', 16, 7, 7, 1740, 2380),

  urunOlustur(13, 'FRN-2101', 'Fren', 'Fren Balatası Ön Takım', 84, 7, 10, 1850, 2480),
  urunOlustur(14, 'FRN-2102', 'Fren', 'Fren Balatası Arka Takım', 76, 24, 10, 1620, 2260),
  urunOlustur(15, 'FRN-2103', 'Fren', 'Fren Diski Ön Çift', 31, 11, 8, 2740, 3580),
  urunOlustur(16, 'FRN-2104', 'Fren', 'Fren Diski Arka Çift', 22, 9, 8, 2380, 3150),
  urunOlustur(17, 'FRN-2105', 'Fren', 'ABS Sensörü Ön', 49, 18, 10, 690, 960),
  urunOlustur(18, 'FRN-2106', 'Fren', 'El Fren Teli', 42, 15, 10, 430, 690),
  urunOlustur(19, 'FRN-2107', 'Fren', 'Fren Hortumu Seti', 38, 17, 10, 360, 580),
  urunOlustur(20, 'FRN-2108', 'Fren', 'Fren Merkezi', 14, 6, 6, 1940, 2590),
  urunOlustur(21, 'FRN-2109', 'Fren', 'Balata Spreyi', 76, 34, 16, 95, 165),
  urunOlustur(22, 'FRN-2110', 'Fren', 'Kampana Fren Yayı', 29, 13, 8, 210, 340),
  urunOlustur(23, 'FRN-2111', 'Fren', 'Fren Müşürü', 35, 16, 8, 280, 450),
  urunOlustur(24, 'FRN-2112', 'Fren', 'Vakum Pompası Fren', 11, 4, 5, 2160, 2920),

  urunOlustur(25, 'FLT-2201', 'Filtre', 'Yağ Filtresi', 145, 72, 18, 180, 320),
  urunOlustur(26, 'FLT-2202', 'Filtre', 'Hava Filtresi', 112, 61, 20, 240, 390),
  urunOlustur(27, 'FLT-2203', 'Filtre', 'Polen Filtresi', 96, 55, 18, 210, 360),
  urunOlustur(28, 'FLT-2204', 'Filtre', 'Yakıt Filtresi', 67, 28, 14, 260, 420),
  urunOlustur(29, 'FLT-2205', 'Filtre', 'Şanzıman Yağ Filtresi', 34, 16, 10, 420, 670),
  urunOlustur(30, 'FLT-2206', 'Filtre', 'Kabin Karbon Filtre', 88, 42, 16, 250, 410),
  urunOlustur(31, 'FLT-2207', 'Filtre', 'Hava Kurutucu Filtresi', 22, 10, 8, 690, 960),
  urunOlustur(32, 'FLT-2208', 'Filtre', 'Turbo Hava Filtre Elemanı', 18, 8, 8, 540, 780),
  urunOlustur(33, 'FLT-2209', 'Filtre', 'Mazot Ön Filtre', 39, 17, 10, 230, 380),
  urunOlustur(34, 'FLT-2210', 'Filtre', 'Partikül Filtre Sensörü', 14, 7, 6, 830, 1190),
  urunOlustur(35, 'FLT-2211', 'Filtre', 'Krank Havalandırma Filtresi', 21, 9, 8, 190, 340),
  urunOlustur(36, 'FLT-2212', 'Filtre', 'Yakıt Ayırıcı Filtre', 24, 11, 8, 310, 490),

  urunOlustur(37, 'ELK-2301', 'Elektrik', 'Akü 72Ah', 21, 8, 12, 2150, 3060),
  urunOlustur(38, 'ELK-2302', 'Elektrik', 'Şarj Dinamosu', 24, 7, 9, 3150, 4280),
  urunOlustur(39, 'ELK-2303', 'Elektrik', 'Marş Motoru', 19, 8, 8, 2840, 3720),
  urunOlustur(40, 'ELK-2304', 'Elektrik', 'Far Ampulü H7', 110, 44, 18, 75, 145),
  urunOlustur(41, 'ELK-2305', 'Elektrik', 'Buji Takımı', 63, 25, 12, 620, 880),
  urunOlustur(42, 'ELK-2306', 'Elektrik', 'Ateşleme Bobini', 28, 13, 8, 960, 1380),
  urunOlustur(43, 'ELK-2307', 'Elektrik', 'Sigorta Kutusu', 16, 7, 6, 1240, 1710),
  urunOlustur(44, 'ELK-2308', 'Elektrik', 'Cam Kriko Motoru', 22, 10, 8, 890, 1290),
  urunOlustur(45, 'ELK-2309', 'Elektrik', 'Far Sensörü', 17, 9, 7, 470, 720),
  urunOlustur(46, 'ELK-2310', 'Elektrik', 'Eksantrik Sensörü', 58, 21, 15, 430, 690),
  urunOlustur(47, 'ELK-2311', 'Elektrik', 'ABS Sensörü Arka', 26, 11, 8, 650, 930),
  urunOlustur(48, 'ELK-2312', 'Elektrik', 'Akü Şarj Regülatörü', 15, 6, 6, 520, 790),

  urunOlustur(49, 'SAN-2401', 'Şanzıman', 'Debriyaj Seti', 38, 15, 10, 2780, 3910),
  urunOlustur(50, 'SAN-2402', 'Şanzıman', 'Debriyaj Bilyası', 29, 12, 8, 740, 1090),
  urunOlustur(51, 'SAN-2403', 'Şanzıman', 'Volan Dişlisi', 11, 5, 5, 2180, 2960),
  urunOlustur(52, 'SAN-2404', 'Şanzıman', 'Vites Halatı', 26, 10, 8, 680, 980),
  urunOlustur(53, 'SAN-2405', 'Şanzıman', 'Şanzıman Takozu', 24, 11, 8, 590, 860),
  urunOlustur(54, 'SAN-2406', 'Şanzıman', 'Otomatik Şanzıman Filtre Kiti', 14, 7, 6, 1290, 1820),
  urunOlustur(55, 'SAN-2407', 'Şanzıman', 'Şanzıman Yağ Soğutucu Hortumu', 18, 8, 7, 460, 710),
  urunOlustur(56, 'SAN-2408', 'Şanzıman', 'Şanzıman Selenoidi', 13, 6, 6, 1540, 2140),
  urunOlustur(57, 'SAN-2409', 'Şanzıman', 'Vites Topuzu Mekanizması', 21, 10, 8, 320, 520),
  urunOlustur(58, 'SAN-2410', 'Şanzıman', 'Şanzıman Keçesi', 33, 14, 10, 150, 260),
  urunOlustur(59, 'SAN-2411', 'Şanzıman', 'Baskı Balata Hidroliği', 19, 8, 7, 860, 1230),
  urunOlustur(60, 'SAN-2412', 'Şanzıman', 'Diferansiyel Rulmanı', 12, 5, 5, 1360, 1890),

  urunOlustur(61, 'DGR-2501', 'Diğer', 'Radyatör Üst Hortum', 46, 19, 15, 310, 520),
  urunOlustur(62, 'DGR-2502', 'Diğer', 'Klima Kompresörü', 18, 7, 8, 6900, 8950),
  urunOlustur(63, 'DGR-2503', 'Diğer', 'Direksiyon Kutusu', 12, 5, 6, 7450, 9380),
  urunOlustur(64, 'DGR-2504', 'Diğer', 'Enjektör Takımı', 35, 16, 8, 4820, 6190),
  urunOlustur(65, 'DGR-2505', 'Diğer', 'Turbo Hortumu', 22, 11, 12, 380, 610),
  urunOlustur(66, 'DGR-2506', 'Diğer', 'Yağ Radyatörü', 17, 5, 7, 1710, 2380),
  urunOlustur(67, 'DGR-2507', 'Diğer', 'Krank Kasnağı', 27, 12, 9, 920, 1380),
  urunOlustur(68, 'DGR-2508', 'Diğer', 'Susturucu Arka', 14, 4, 6, 1280, 1820),
  urunOlustur(69, 'DGR-2509', 'Diğer', 'Bijon Somunu Seti', 90, 41, 20, 110, 210),
  urunOlustur(70, 'DGR-2510', 'Diğer', 'Triger Kayışı Seti', 52, 20, 14, 1240, 1760),
  urunOlustur(71, 'DGR-2511', 'Diğer', 'Amortisör Ön Çift', 29, 9, 12, 3250, 4520),
  urunOlustur(72, 'DGR-2512', 'Diğer', 'Direksiyon Rot Başı', 31, 13, 9, 410, 660),
]

const dashboardOzetSablon = [
  { baslik: 'Acil Sipariş', deger: '17', degisim: '-%6', ikon: 'kutu' },
  { baslik: 'Toplam Sipariş', deger: '1865', degisim: '+%12', ikon: 'liste' },
  { baslik: 'Ortalama Teslimat', deger: '2,6 Gün', degisim: '+%8', ikon: 'saat' },
]

const dashboardBolumSablonu = [
  { anahtar: 'canli', etiket: 'Canlı Özetler' },
  { anahtar: 'haftalik', etiket: 'Haftalık Grafik ve En Çok Satanlar' },
  { anahtar: 'kritik', etiket: 'Kritik Stok Uyarısı' },
  { anahtar: 'yakin', etiket: 'Yakın Zamanda Satılan Ürünler' },
  { anahtar: 'altGrafikler', etiket: 'Alt Grafikler' },
]

function KucukIkon({ tip }) {
  if (tip === 'favori') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="m12 3.7 2.57 5.22 5.76.84-4.16 4.05.98 5.72L12 16.8 6.85 19.53l.98-5.72-4.16-4.05 5.76-.84L12 3.7Z" />
      </svg>
    )
  }

  if (tip === 'not') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3h8l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M16 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    )
  }

  if (tip === 'duzenle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17.25V21h3.75L18.8 8.94l-3.75-3.75L3 17.25Z" />
        <path d="m14.95 5.19 3.75 3.75" />
      </svg>
    )
  }

  if (tip === 'sil') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
        <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      </svg>
    )
  }

  if (tip === 'detay') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    )
  }

  if (tip === 'durum') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    )
  }

  if (tip === 'fabrika') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21V9l7 4V9l7 4V5l4 2v14H3Z" />
        <path d="M7 21v-4" />
        <path d="M11 21v-4" />
        <path d="M15 21v-4" />
      </svg>
    )
  }

  if (tip === 'musteri-ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="8" r="3.5" />
        <path d="M4.5 19a6 6 0 0 1 11 0" />
        <path d="M18 8v6" />
        <path d="M15 11h6" />
      </svg>
    )
  }

  if (tip === 'siparis-ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="17" cy="19" r="1.5" />
        <path d="M3 4h2l2.2 9.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L19 8H7.2" />
        <path d="M18 3v4" />
        <path d="M16 5h4" />
      </svg>
    )
  }

  if (tip === 'urun-ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="M12 12l8-4.5" />
        <path d="M12 21v-9" />
        <path d="M18 3v4" />
        <path d="M16 5h4" />
      </svg>
    )
  }

  if (tip === 'ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    )
  }

  if (tip === 'liste') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'kutu') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="M12 12l8-4.5" />
        <path d="M12 21v-9" />
      </svg>
    )
  }

  if (tip === 'cuzdan') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
        <path d="M4 9h13.5A2.5 2.5 0 0 1 20 11.5v1A2.5 2.5 0 0 1 17.5 15H4" />
        <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'saat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </svg>
    )
  }

  if (tip === 'menu') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="12" cy="19" r="1.8" />
      </svg>
    )
  }

  if (tip === 'basari') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m7 12 3 3 7-7" />
      </svg>
    )
  }

  if (tip === 'uyari') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 7v6" />
        <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'bildirim-kritik') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 21 19H3L12 3Z" />
        <path d="M12 9v4" />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'bildirim-stok') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="M12 12l8-4.5" />
      </svg>
    )
  }

  if (tip === 'bildirim-tahsilat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
        <path d="M4 9h13.5A2.5 2.5 0 0 1 20 11.5v1A2.5 2.5 0 0 1 17.5 15H4" />
        <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'bildirim-satis') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 18h16" />
        <path d="M7 15V9" />
        <path d="M12 15V6" />
        <path d="M17 15v-3" />
      </svg>
    )
  }

  if (tip === 'ayar') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="12" cy="19" r="1.8" />
      </svg>
    )
  }

  if (tip === 'gonder') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 20 21 12 3 4l3 8-3 8Z" />
        <path d="M6 12h8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}

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
  { siparisNo: '#SP-2122', musteri: 'Doğan Oto', urun: 'Şarj Dinamosu', toplamTutar: 4720, siparisTarihi: '2026-02-26', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2121', musteri: 'Özen Servis', urun: 'Polen Filtresi', toplamTutar: 1240, siparisTarihi: '2026-02-25', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2120', musteri: 'Başak Otomotiv', urun: 'Debriyaj Bilyası', toplamTutar: 3180, siparisTarihi: '2026-02-24', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Yolda', teslimatSuresi: '2 iş günü' },
]

const gecmisSiparisIadeIndeksleri = new Set([2, 9, 15, 21, 28, 34, 43])
const gecmisSiparisIptalIndeksleri = new Set([1, 6, 11, 17, 24, 29, 33, 39, 46])
const gecmisSiparisMusterileri = ['Yıldız Oto', 'Tekin Otomotiv', 'Mert Motor', 'Hızlı Servis', 'Akın Oto', 'Bora Yedek Parça', 'Demir Oto', 'Asil Sanayi', 'Nehir Otomotiv', 'Kaya Oto Servis', 'Yaman Yedek', 'Gürkan Oto']

const baslangicGecmisSiparisleri = Array.from({ length: 48 }, (_, index) => {
  const urun = baslangicUrunleri[index % baslangicUrunleri.length]
  const musteri = gecmisSiparisMusterileri[index % gecmisSiparisMusterileri.length]
  const gun = String(16 - (index % 12)).padStart(2, '0')
  const ay = index < 24 ? '02' : '01'
  const miktar = (index % 4) + 1
  const tutar = miktar * (urun.satisFiyati + (index % 5) * 120)
  const durum = gecmisSiparisIadeIndeksleri.has(index)
    ? 'İade Edildi'
    : gecmisSiparisIptalIndeksleri.has(index)
      ? 'İptal Edildi'
      : index % 3 === 0
        ? 'Teslim Edildi'
        : 'Tamamlandı'

  return {
    logNo: `GSP-${String(index + 1).padStart(4, '0')}`,
    siparisNo: `#SP-${String(2080 - index).padStart(4, '0')}`,
    musteri,
    urun: urun.ad,
    tarih: `2026-${ay}-${gun}`,
    tutar,
    miktar,
    durum,
    aciklama: `${musteri} için ${urun.ad} siparişi arşive alındı.`,
  }
})

const siparisMusteriTelefonlari = {
  'Yıldız Oto': '0532 410 22 10',
  'Tekin Otomotiv': '0533 812 14 32',
  'Mert Motor': '0541 632 41 18',
  'Hızlı Servis': '0537 228 76 90',
  'Akın Oto': '0542 611 70 91',
  'Bora Yedek Parça': '0505 338 14 62',
  'Demir Oto': '0536 304 88 41',
  'Asil Sanayi': '0549 210 53 72',
  'Nehir Otomotiv': '0531 902 16 20',
  'Kaya Oto Servis': '0544 781 32 08',
  'Yaman Yedek': '0507 624 90 14',
  'Gürkan Oto': '0538 470 19 35',
  'Doğan Oto': '0543 613 27 44',
  'Özen Servis': '0539 115 64 77',
  'Başak Otomotiv': '0506 841 28 63',
}

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

const baslangicMusterileri = [
  { uid: 1, ad: 'Ahmet Yılmaz', telefon: '0532 418 22 10', sonAlim: '2026-03-10', toplamSiparis: 6, toplamHarcama: 18240, not: 'Fren ve yağ grubu ürünlerini sık alıyor.', favori: true },
  { uid: 2, ad: 'Mehmet Kaya', telefon: '0541 722 18 64', sonAlim: '2026-03-09', toplamSiparis: 4, toplamHarcama: 13780, not: 'Ödemelerini aynı gün tamamlıyor.', favori: false },
  { uid: 3, ad: 'Elif Demir', telefon: '0507 316 44 82', sonAlim: '2026-03-08', toplamSiparis: 3, toplamHarcama: 9640, not: 'Debriyaj seti ve filtre grubuna odaklı.', favori: false },
  { uid: 4, ad: 'Canan Şahin', telefon: '0533 902 17 53', sonAlim: '2026-03-08', toplamSiparis: 7, toplamHarcama: 22100, not: 'Telefonla aranınca hızlı geri dönüş yapıyor.', favori: true },
  { uid: 5, ad: 'Burak Arslan', telefon: '0542 611 70 91', sonAlim: '2026-03-07', toplamSiparis: 5, toplamHarcama: 15420, not: 'Şehir içi teslimatı tercih ediyor.', favori: false },
  { uid: 6, ad: 'Zeynep Çetin', telefon: '0505 812 36 20', sonAlim: '2026-03-06', toplamSiparis: 2, toplamHarcama: 6420, not: 'Ağırlıklı olarak sensör sipariş ediyor.', favori: false },
  { uid: 7, ad: 'Murat Koç', telefon: '0537 291 05 48', sonAlim: '2026-03-06', toplamSiparis: 8, toplamHarcama: 26480, not: 'Kampanya dönemlerinde toplu alım yapıyor.', favori: true },
  { uid: 8, ad: 'Sibel Acar', telefon: '0553 421 87 34', sonAlim: '2026-03-05', toplamSiparis: 3, toplamHarcama: 8590, not: 'Arka amortisör talepleri artıyor.', favori: false },
  { uid: 9, ad: 'Tolga Eren', telefon: '0536 108 29 61', sonAlim: '2026-03-05', toplamSiparis: 4, toplamHarcama: 12890, not: 'Fatura bilgisini WhatsApp üzerinden istiyor.', favori: false },
  { uid: 10, ad: 'Gizem Aksoy', telefon: '0543 515 13 70', sonAlim: '2026-03-04', toplamSiparis: 6, toplamHarcama: 17660, not: 'Kargo takip bilgisi özellikle paylaşılsın.', favori: false },
  { uid: 11, ad: 'Onur Çalışkan', telefon: '0506 804 55 19', sonAlim: '2026-03-04', toplamSiparis: 2, toplamHarcama: 5810, not: 'Hafta sonu teslimat talep ediyor.', favori: false },
  { uid: 12, ad: 'Buse Karaca', telefon: '0531 247 86 93', sonAlim: '2026-03-03', toplamSiparis: 5, toplamHarcama: 14880, not: 'Yağ filtresi ve buji grubunda tekrar sipariş veriyor.', favori: true },
  { uid: 13, ad: 'Ali Rıza Tekin', telefon: '0546 334 41 58', sonAlim: '2026-03-03', toplamSiparis: 3, toplamHarcama: 9420, not: 'Motor takozu için yeni teklif bekliyor.', favori: false },
  { uid: 14, ad: 'Merve Uslu', telefon: '0507 621 74 11', sonAlim: '2026-03-02', toplamSiparis: 4, toplamHarcama: 11700, not: 'Özel indirim soruyor, fiyat hassasiyeti yüksek.', favori: false },
  { uid: 15, ad: 'Sinan Özkan', telefon: '0539 455 26 67', sonAlim: '2026-03-02', toplamSiparis: 7, toplamHarcama: 20640, not: 'Triger seti ve turbo grubunu takip ediyor.', favori: true },
  { uid: 16, ad: 'Ece Bozkurt', telefon: '0549 318 90 42', sonAlim: '2026-03-01', toplamSiparis: 2, toplamHarcama: 4980, not: 'Yeni müşteri, geri arama beklentisi var.', favori: false },
]

const tedarikciOlustur = (uid, firmaAdi, yetkiliKisi, telefon, email, adres, vergiNumarasi, urunGrubu, toplamAlisSayisi, ortalamaTeslimSuresi, toplamHarcama, not, alinanUrunler, siparisler, fiyatGecmisi, favori = false) => ({
  uid,
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
  alinanUrunler,
  siparisler,
  fiyatGecmisi,
  favori,
})

const baslangicTedarikcileri = [
  tedarikciOlustur(1, 'Anadolu Filtre Sanayi', 'Murat Yıldırım', '0532 601 11 24', 'satis@anadolufiltre.com', 'İkitelli OSB 12. Cadde No:44 Başakşehir / İstanbul', '3456789123', 'Filtre', 26, '2,1 gün', 184500, 'Yağ ve hava filtresi tedariğinde hızlı, fiyat istikrarı yüksek.', [{ urun: 'Yağ Filtresi', sonFiyat: 120, sonAlisTarihi: '2026-03-15' }, { urun: 'Hava Filtresi', sonFiyat: 145, sonAlisTarihi: '2026-03-11' }], [{ siparisNo: 'AP-103', tarih: '2026-03-12', tutar: 8500, durum: 'Bekliyor' }, { siparisNo: 'AP-099', tarih: '2026-03-08', tutar: 12400, durum: 'Teslim alındı' }], [{ tarih: '2026-01-15', urun: 'Yağ Filtresi', fiyat: 112 }, { tarih: '2026-02-16', urun: 'Yağ Filtresi', fiyat: 117 }, { tarih: '2026-03-15', urun: 'Yağ Filtresi', fiyat: 120 }], true),
  tedarikciOlustur(2, 'Delta Fren Sistemleri', 'Selin Aksoy', '0533 712 44 18', 'destek@deltafren.com', 'Büsan Sanayi 3. Blok No:19 Selçuklu / Konya', '4567891234', 'Fren', 18, '2,8 gün', 236800, 'Fren balatası ve disk grubunda ana tedarikçi.', [{ urun: 'Fren Balatası Ön Takım', sonFiyat: 1680, sonAlisTarihi: '2026-03-14' }, { urun: 'Fren Diski Ön Çift', sonFiyat: 2520, sonAlisTarihi: '2026-03-07' }], [{ siparisNo: 'DF-221', tarih: '2026-03-13', tutar: 19200, durum: 'Hazırlanıyor' }, { siparisNo: 'DF-214', tarih: '2026-03-03', tutar: 15100, durum: 'Teslim alındı' }], [{ tarih: '2026-01-09', urun: 'Fren Balatası Ön Takım', fiyat: 1590 }, { tarih: '2026-02-11', urun: 'Fren Balatası Ön Takım', fiyat: 1635 }, { tarih: '2026-03-14', urun: 'Fren Balatası Ön Takım', fiyat: 1680 }]),
  tedarikciOlustur(3, 'Mavi Elektrik Oto', 'Okan Demir', '0541 455 22 61', 'info@mavielektrikoto.com', 'İvedik OSB 1456 Sokak No:22 Yenimahalle / Ankara', '5678912345', 'Elektrik', 21, '3,1 gün', 278900, 'Şarj dinamosu ve sensör grubunda güvenilir teslimat sağlıyor.', [{ urun: 'Şarj Dinamosu', sonFiyat: 2980, sonAlisTarihi: '2026-03-12' }, { urun: 'Akü 72Ah', sonFiyat: 1980, sonAlisTarihi: '2026-03-05' }], [{ siparisNo: 'ME-081', tarih: '2026-03-12', tutar: 23100, durum: 'Bekliyor' }, { siparisNo: 'ME-078', tarih: '2026-03-04', tutar: 17600, durum: 'Teslim alındı' }], [{ tarih: '2026-01-22', urun: 'Şarj Dinamosu', fiyat: 2840 }, { tarih: '2026-02-18', urun: 'Şarj Dinamosu', fiyat: 2910 }, { tarih: '2026-03-12', urun: 'Şarj Dinamosu', fiyat: 2980 }]),
  tedarikciOlustur(4, 'Şanzıman Parça Merkezi', 'Kemal Ersoy', '0538 244 91 17', 'operasyon@spmerkezi.com', 'Ostim Mah. 1208 Cad. No:7 Yenimahalle / Ankara', '6789123456', 'Şanzıman', 14, '3,6 gün', 198400, 'Şanzıman parçalarında fiyat avantajı var, teslim süresi orta seviyede.', [{ urun: 'Debriyaj Seti', sonFiyat: 2540, sonAlisTarihi: '2026-03-10' }, { urun: 'Debriyaj Bilyası', sonFiyat: 610, sonAlisTarihi: '2026-03-01' }], [{ siparisNo: 'SP-302', tarih: '2026-03-10', tutar: 14100, durum: 'Hazırlanıyor' }, { siparisNo: 'SP-295', tarih: '2026-02-27', tutar: 9800, durum: 'Teslim alındı' }], [{ tarih: '2026-01-06', urun: 'Debriyaj Seti', fiyat: 2420 }, { tarih: '2026-02-09', urun: 'Debriyaj Seti', fiyat: 2480 }, { tarih: '2026-03-10', urun: 'Debriyaj Seti', fiyat: 2540 }]),
  tedarikciOlustur(5, 'MotorTek Endüstri', 'Burcu Kalkan', '0543 811 62 09', 'iletisim@motortek.com', '10045 Sokak No:8 Çiğli / İzmir', '7891234567', 'Motor', 25, '2,4 gün', 321600, 'Motor ve conta grubunda hacimli alım yapılan ana iş ortağı.', [{ urun: 'Silindir Kapak Contası', sonFiyat: 690, sonAlisTarihi: '2026-03-16' }, { urun: 'Yağ Pompası', sonFiyat: 1380, sonAlisTarihi: '2026-03-09' }], [{ siparisNo: 'MT-510', tarih: '2026-03-16', tutar: 20400, durum: 'Bekliyor' }, { siparisNo: 'MT-503', tarih: '2026-03-08', tutar: 18600, durum: 'Teslim alındı' }], [{ tarih: '2026-01-12', urun: 'Silindir Kapak Contası', fiyat: 650 }, { tarih: '2026-02-14', urun: 'Silindir Kapak Contası', fiyat: 670 }, { tarih: '2026-03-16', urun: 'Silindir Kapak Contası', fiyat: 690 }], true),
  tedarikciOlustur(6, 'Kuzey Oto Kimya', 'Arda Şen', '0507 630 14 55', 'satis@kuzeyotokimya.com', 'Akdeniz Sanayi Sitesi 7. Blok No:13 Kepez / Antalya', '8123456789', 'Diğer', 11, '1,9 gün', 76400, 'Sarf malzeme ve yardımcı ürünlerde hızlı sevkiyat sağlıyor.', [{ urun: 'Balata Spreyi', sonFiyat: 88, sonAlisTarihi: '2026-03-10' }, { urun: 'Bijon Somunu Seti', sonFiyat: 98, sonAlisTarihi: '2026-02-28' }], [{ siparisNo: 'KK-118', tarih: '2026-03-10', tutar: 3400, durum: 'Teslim alındı' }, { siparisNo: 'KK-116', tarih: '2026-03-04', tutar: 2900, durum: 'Teslim alındı' }], [{ tarih: '2026-01-18', urun: 'Balata Spreyi', fiyat: 80 }, { tarih: '2026-02-19', urun: 'Balata Spreyi', fiyat: 84 }, { tarih: '2026-03-10', urun: 'Balata Spreyi', fiyat: 88 }]),
  tedarikciOlustur(7, 'Eksen Filtre Dağıtım', 'Seda Uyar', '0531 845 63 20', 'bayi@eksenfiltre.com', 'Kayabaşı Mah. 42. Sk. No:3 Nilüfer / Bursa', '9234567890', 'Filtre', 17, '2,2 gün', 118900, 'Polen ve yakıt filtresi grubunda düzenli kampanya geçiyor.', [{ urun: 'Polen Filtresi', sonFiyat: 172, sonAlisTarihi: '2026-03-13' }, { urun: 'Yakıt Filtresi', sonFiyat: 228, sonAlisTarihi: '2026-03-07' }], [{ siparisNo: 'EF-072', tarih: '2026-03-13', tutar: 6200, durum: 'Hazırlanıyor' }, { siparisNo: 'EF-068', tarih: '2026-03-02', tutar: 7140, durum: 'Teslim alındı' }], [{ tarih: '2026-01-25', urun: 'Polen Filtresi', fiyat: 164 }, { tarih: '2026-02-26', urun: 'Polen Filtresi', fiyat: 168 }, { tarih: '2026-03-13', urun: 'Polen Filtresi', fiyat: 172 }]),
  tedarikciOlustur(8, 'Atlas Fren Lojistik', 'Cem Aydın', '0546 319 52 81', 'tedarik@atlasfren.com', 'Minareliçavuş OSB 5. Cadde No:28 Nilüfer / Bursa', '1034567891', 'Fren', 12, '4,0 gün', 142300, 'Bazı teslimatlar gecikmeli, yine de fiyatları rekabetçi.', [{ urun: 'ABS Sensörü Ön', sonFiyat: 610, sonAlisTarihi: '2026-03-06' }, { urun: 'Fren Müşürü', sonFiyat: 240, sonAlisTarihi: '2026-02-26' }], [{ siparisNo: 'AF-151', tarih: '2026-03-06', tutar: 9100, durum: 'Bekliyor' }, { siparisNo: 'AF-149', tarih: '2026-02-26', tutar: 6800, durum: 'Teslim alındı' }], [{ tarih: '2026-01-10', urun: 'ABS Sensörü Ön', fiyat: 575 }, { tarih: '2026-02-12', urun: 'ABS Sensörü Ön', fiyat: 590 }, { tarih: '2026-03-06', urun: 'ABS Sensörü Ön', fiyat: 610 }]),
  tedarikciOlustur(9, 'Volta Elektrik Parça', 'Ebru Kiriş', '0506 284 33 75', 'operasyon@voltaelektrik.com', 'Yeni Sanayi 210. Sk. No:17 Melikgazi / Kayseri', '1134567892', 'Elektrik', 16, '2,7 gün', 165700, 'Ateşleme ve bobin grubunda fiyat sabitliği iyi.', [{ urun: 'Ateşleme Bobini', sonFiyat: 910, sonAlisTarihi: '2026-03-14' }, { urun: 'Buji Takımı', sonFiyat: 540, sonAlisTarihi: '2026-03-05' }], [{ siparisNo: 'VE-244', tarih: '2026-03-14', tutar: 7400, durum: 'Hazırlanıyor' }, { siparisNo: 'VE-241', tarih: '2026-03-05', tutar: 5300, durum: 'Teslim alındı' }], [{ tarih: '2026-01-17', urun: 'Ateşleme Bobini', fiyat: 860 }, { tarih: '2026-02-19', urun: 'Ateşleme Bobini', fiyat: 885 }, { tarih: '2026-03-14', urun: 'Ateşleme Bobini', fiyat: 910 }]),
  tedarikciOlustur(10, 'YedekNet Genel Tedarik', 'Serhat Çolak', '0549 117 65 44', 'teklif@yedeknet.com', 'Evren Sanayi 4. Blok No:11 Esenyurt / İstanbul', '1434567895', 'Diğer', 13, '2,9 gün', 96700, 'Karışık ürün grubunda alternatif tedarikçi olarak kullanılıyor.', [{ urun: 'Turbo Hortumu', sonFiyat: 340, sonAlisTarihi: '2026-03-12' }, { urun: 'Radyatör Üst Hortum', sonFiyat: 260, sonAlisTarihi: '2026-03-06' }], [{ siparisNo: 'YN-061', tarih: '2026-03-12', tutar: 5600, durum: 'Bekliyor' }, { siparisNo: 'YN-058', tarih: '2026-03-06', tutar: 4700, durum: 'Teslim alındı' }], [{ tarih: '2026-01-14', urun: 'Turbo Hortumu', fiyat: 310 }, { tarih: '2026-02-15', urun: 'Turbo Hortumu', fiyat: 326 }, { tarih: '2026-03-12', urun: 'Turbo Hortumu', fiyat: 340 }]),
]

const stokDegisimLoglari = [
  { id: 1, tarih: '2026-03-16 09:10', urun: 'Fren Balatası Ön Takım', urunId: 'FRN-2101', islem: 'Stok düşüşü', eskiStok: 12, yeniStok: 7, kullanici: 'Admin', aciklama: 'Servis siparişi için 5 adet çıkış yapıldı.' },
  { id: 2, tarih: '2026-03-16 08:32', urun: 'Akü 72Ah', urunId: 'ELK-2301', islem: 'Stok düşüşü', eskiStok: 11, yeniStok: 8, kullanici: 'Admin', aciklama: '3 adet perakende satış işlendi.' },
  { id: 3, tarih: '2026-03-15 18:05', urun: 'Debriyaj Seti', urunId: 'SAN-2401', islem: 'Stok artışı', eskiStok: 11, yeniStok: 15, kullanici: 'Admin', aciklama: 'Yeni tedarik girişinden 4 adet eklendi.' },
  { id: 4, tarih: '2026-03-15 16:42', urun: 'Yağ Filtresi', urunId: 'FLT-2201', islem: 'Stok düşüşü', eskiStok: 77, yeniStok: 72, kullanici: 'Admin', aciklama: 'Toplu bakım siparişi için çıkış yapıldı.' },
  { id: 5, tarih: '2026-03-15 13:27', urun: 'Şarj Dinamosu', urunId: 'ELK-2302', islem: 'Stok düşüşü', eskiStok: 9, yeniStok: 7, kullanici: 'Admin', aciklama: '2 adet servis sevkiyatına ayrıldı.' },
  { id: 6, tarih: '2026-03-15 10:15', urun: 'Turbo Hortumu', urunId: 'DGR-2505', islem: 'Stok artışı', eskiStok: 8, yeniStok: 11, kullanici: 'Admin', aciklama: 'Tedarikçiden gelen 3 ürün depoya işlendi.' },
  { id: 7, tarih: '2026-03-14 17:58', urun: 'Polen Filtresi', urunId: 'FLT-2203', islem: 'Stok düşüşü', eskiStok: 59, yeniStok: 55, kullanici: 'Admin', aciklama: '4 adet şehir içi siparişe gönderildi.' },
  { id: 8, tarih: '2026-03-14 15:14', urun: 'Direksiyon Kutusu', urunId: 'DGR-2503', islem: 'Stok artışı', eskiStok: 3, yeniStok: 5, kullanici: 'Admin', aciklama: 'İki yeni ürün raf stoğuna eklendi.' },
  { id: 9, tarih: '2026-03-14 11:36', urun: 'Fren Diski Ön Çift', urunId: 'FRN-2103', islem: 'Stok düşüşü', eskiStok: 14, yeniStok: 11, kullanici: 'Admin', aciklama: '3 adet servis montajına çıktı.' },
  { id: 10, tarih: '2026-03-13 18:22', urun: 'Motor Yağ Soğutucusu', urunId: 'MTR-2012', islem: 'Stok düşüşü', eskiStok: 9, yeniStok: 7, kullanici: 'Admin', aciklama: '2 adet siparişe rezerv edildi.' },
  { id: 11, tarih: '2026-03-13 14:48', urun: 'Buji Takımı', urunId: 'ELK-2305', islem: 'Stok artışı', eskiStok: 19, yeniStok: 25, kullanici: 'Admin', aciklama: '6 adet yeni ürün girişi yapıldı.' },
  { id: 12, tarih: '2026-03-13 09:24', urun: 'Triger Kayışı Seti', urunId: 'DGR-2510', islem: 'Stok düşüşü', eskiStok: 24, yeniStok: 20, kullanici: 'Admin', aciklama: '4 adet müşteri siparişine ayrıldı.' },
  { id: 13, tarih: '2026-03-12 17:17', urun: 'ABS Sensörü Arka', urunId: 'ELK-2311', islem: 'Stok artışı', eskiStok: 8, yeniStok: 11, kullanici: 'Admin', aciklama: 'Eksik sayılan 3 ürün sayımla geri işlendi.' },
  { id: 14, tarih: '2026-03-12 13:40', urun: 'Şanzıman Takozu', urunId: 'SAN-2405', islem: 'Stok düşüşü', eskiStok: 13, yeniStok: 11, kullanici: 'Admin', aciklama: '2 adet servis çıkışı yapıldı.' },
  { id: 15, tarih: '2026-03-12 10:11', urun: 'Klima Kompresörü', urunId: 'DGR-2502', islem: 'Stok artışı', eskiStok: 5, yeniStok: 7, kullanici: 'Admin', aciklama: 'Yeni tedarik sevkiyatından 2 adet eklendi.' },
  { id: 16, tarih: '2026-03-11 16:52', urun: 'Debriyaj Bilyası', urunId: 'SAN-2402', islem: 'Stok düşüşü', eskiStok: 15, yeniStok: 12, kullanici: 'Admin', aciklama: '3 adet satış sonrası stok güncellendi.' },
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

const teslimatGununuCoz = (metin) => {
  const eslesme = String(metin).match(/(\d+)/)
  return eslesme ? Number(eslesme[1]) : 0
}

const telefonuNormalizeEt = (telefon) => telefon.replace(/\D/g, '')

const telefonGecerliMi = (telefon) => {
  const rakamlar = telefonuNormalizeEt(telefon)
  return /^0\d{10}$/.test(rakamlar)
}

const negatifSayiVarMi = (...degerler) => degerler.some((deger) => Number(deger) < 0)

const bosForm = {
  urunId: '',
  ad: '',
  urunAdedi: '',
  magazaStok: '',
  minimumStok: '',
}

const bosUrunDuzenlemeFormu = {
  urunId: '',
  ad: '',
  urunAdedi: '',
  magazaStok: '',
  alisFiyati: '',
  satisFiyati: '',
}

const bosMusteriFormu = {
  ad: '',
  telefon: '',
  sonAlim: '',
  toplamSiparis: '',
  toplamHarcama: '',
  not: '',
}

const bosTedarikciFormu = {
  firmaAdi: '',
  yetkiliKisi: '',
  telefon: '',
  email: '',
  adres: '',
  vergiNumarasi: '',
  urunGrubu: '',
  not: '',
  toplamAlisSayisi: '',
  ortalamaTeslimSuresi: '',
  toplamHarcama: '',
}

const bosTedarikciSiparisFormu = {
  siparisNo: '',
  tarih: '',
  tutar: '',
  durum: 'Bekliyor',
}

const bosSiparisFormu = {
  musteri: '',
  urun: '',
  toplamTutar: '',
  siparisTarihi: '',
  odemeDurumu: 'Beklemede',
  urunHazirlik: 'Hazırlanıyor',
  teslimatDurumu: 'Hazırlanıyor',
  teslimatSuresi: '',
}

const bosFaturaSatiri = (id = Date.now()) => ({
  id,
  urunUid: '',
  urun: '',
  miktar: 1,
  birimFiyat: 0,
  kdvOrani: FATURA_KDV_ORANI,
})

const bosFaturaFormu = {
  tur: 'Satış Faturası',
  karsiTarafUid: '',
  karsiTarafAdi: '',
  tarih: new Date().toISOString().slice(0, 10),
  odemeTarihi: new Date().toISOString().slice(0, 10),
  not: '',
  satirlar: [bosFaturaSatiri(1)],
}

const faturaToplamlariHesapla = (satirlar) => {
  const araToplam = satirlar.reduce((toplam, satir) => toplam + Number(satir.miktar || 0) * Number(satir.birimFiyat || 0), 0)
  const kdv = satirlar.reduce(
    (toplam, satir) => toplam + Number(satir.miktar || 0) * Number(satir.birimFiyat || 0) * Number(satir.kdvOrani ?? FATURA_KDV_ORANI),
    0,
  )
  return {
    araToplam,
    kdv,
    toplam: araToplam + kdv,
  }
}

const faturaKaydiOlustur = ({ id, faturaNo, tur, karsiTarafUid, karsiTarafAdi, tarih, odemeTarihi, satirlar, not, durum = 'Taslak' }) => {
  const temizSatirlar = satirlar.map((satir) => ({
    ...satir,
    miktar: Number(satir.miktar),
    birimFiyat: Number(satir.birimFiyat),
    kdvOrani: Number(satir.kdvOrani ?? FATURA_KDV_ORANI),
  }))
  const toplamlar = faturaToplamlariHesapla(temizSatirlar)
  return {
    id,
    faturaNo,
    tur,
    karsiTarafUid,
    karsiTarafAdi,
    tarih,
    odemeTarihi,
    satirlar: temizSatirlar,
    not,
    durum,
    ...toplamlar,
  }
}

const baslangicFaturalari = [
  faturaKaydiOlustur({
    id: 1,
    faturaNo: 'FTR-001',
    tur: 'Satış Faturası',
    karsiTarafUid: 1,
    karsiTarafAdi: 'Yıldız Oto',
    tarih: '2026-03-18',
    odemeTarihi: '2026-03-20',
    satirlar: [
      { id: 11, urunUid: 13, urun: 'Fren Balatası Ön Takım', miktar: 2, birimFiyat: 450, kdvOrani: FATURA_KDV_ORANI },
      { id: 12, urunUid: 25, urun: 'Yağ Filtresi', miktar: 1, birimFiyat: 120, kdvOrani: FATURA_KDV_ORANI },
    ],
    not: 'Şehir içi teslimat planlandı.',
    durum: 'PDF Oluşturuldu',
  }),
  faturaKaydiOlustur({
    id: 2,
    faturaNo: 'FTR-002',
    tur: 'Satış Faturası',
    karsiTarafUid: 4,
    karsiTarafAdi: 'Canan Şahin',
    tarih: '2026-03-17',
    odemeTarihi: '2026-03-19',
    satirlar: [
      { id: 21, urunUid: 49, urun: 'Debriyaj Seti', miktar: 1, birimFiyat: 3910, kdvOrani: FATURA_KDV_ORANI },
      { id: 22, urunUid: 41, urun: 'Buji Takımı', miktar: 2, birimFiyat: 880, kdvOrani: FATURA_KDV_ORANI },
    ],
    not: 'Parça teslimi önceden teyit edildi.',
    durum: 'Hazır',
  }),
  faturaKaydiOlustur({
    id: 3,
    faturaNo: 'FTR-003',
    tur: 'Alış Faturası',
    karsiTarafUid: 1,
    karsiTarafAdi: 'Anadolu Filtre Sanayi',
    tarih: '2026-03-16',
    odemeTarihi: '2026-03-22',
    satirlar: [
      { id: 31, urunUid: 25, urun: 'Yağ Filtresi', miktar: 20, birimFiyat: 120, kdvOrani: FATURA_KDV_ORANI },
      { id: 32, urunUid: 26, urun: 'Hava Filtresi', miktar: 12, birimFiyat: 145, kdvOrani: FATURA_KDV_ORANI },
    ],
    not: 'Depo giriş fişiyle eşleştirildi.',
    durum: 'PDF Oluşturuldu',
  }),
  faturaKaydiOlustur({
    id: 4,
    faturaNo: 'FTR-004',
    tur: 'Alış Faturası',
    karsiTarafUid: 5,
    karsiTarafAdi: 'MotorTek Endüstri',
    tarih: '2026-03-15',
    odemeTarihi: '2026-03-24',
    satirlar: [
      { id: 41, urunUid: 1, urun: 'Silindir Kapak Contası', miktar: 8, birimFiyat: 690, kdvOrani: FATURA_KDV_ORANI },
      { id: 42, urunUid: 6, urun: 'Yağ Pompası', miktar: 4, birimFiyat: 1380, kdvOrani: FATURA_KDV_ORANI },
    ],
    not: 'Tedarikçi fiyat güncellemesi işlendi.',
    durum: 'Hazır',
  }),
]

const merkezMenusu = [
  { sayfa: 'dashboard', baslik: 'Dashboard', renk: 'turuncu', aciklama: 'Özet görünüm' },
  { sayfa: 'envanter', baslik: 'Envanter', renk: 'yesil-koyu', aciklama: 'Stok yönetimi' },
  { sayfa: 'siparisler', baslik: 'Siparişler', renk: 'altin', aciklama: 'Sipariş hareketleri' },
  { sayfa: 'musteriler', baslik: 'Kayıtlı Müşteriler', renk: 'turkuaz', aciklama: 'Müşteri listesi' },
  { sayfa: 'alicilar', baslik: 'Kayıtlı Tedarikçiler', renk: 'lacivert', aciklama: 'Tedarikçi kayıtları' },
  { sayfa: 'odemeler', baslik: 'Finansal Akış', renk: 'kehribar', aciklama: 'Nakit akışı' },
  { sayfa: 'urun-duzenleme', baslik: 'Ürün Düzenleme', renk: 'mavi-gri', aciklama: 'Ürün güncelleme' },
  { sayfa: 'faturalama', baslik: 'Faturalama (PDF)', renk: 'kiremit', aciklama: 'Fatura üretimi' },
]

const aiHizliKonular = [
  { etiket: 'Aylık Satış', mesaj: 'Bu ay gerçekleşen satışlar hakkında bilgi ver.' },
  { etiket: 'Stok Durumu', mesaj: 'Bana stokları azalan ürünlerimiz hakkında bilgi ver.' },
  { etiket: 'Kargolanmış Siparişler', mesaj: 'Kargolanan siparişlerin teslimi yapıldı mı?' },
  { etiket: 'Kargolanmamış Siparişler', mesaj: 'Hangi siparişlerimiz henüz kargolanmadı?' },
  { etiket: 'En Çok Satanlar', mesaj: 'En çok satan ürünlerimizden bana bahset.' },
  { etiket: 'En Son Satış', mesaj: 'En son gerçekleşen satışın ayrıntılarını anlat.' },
  { etiket: 'Diğer', mesaj: null },
]

const metniNormalizeEt = (metin) =>
  metin
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[?.!,;:]/g, '')
    .trim()

const favorileriOneTasi = (liste, tarihAl) =>
  [...liste].sort((a, b) => {
    if (Boolean(a.favori) !== Boolean(b.favori)) return a.favori ? -1 : 1
    if (tarihAl) return tarihAl(b) - tarihAl(a)
    return 0
  })

const kritikStoktaMi = (urun) => urun.magazaStok <= (urun.minimumStok ?? 10)

const htmlGuvenliMetin = (metin) =>
  String(metin ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const pdfGuvenliMetin = (metin) =>
  String(metin ?? '')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')

const pdfSatirOlustur = (metin, x, y, fontBoyutu = 12) =>
  `BT /F1 ${fontBoyutu} Tf 1 0 0 1 ${x} ${y} Tm (${pdfGuvenliMetin(metin)}) Tj ET`

const faturaBelgeHtmlOlustur = (fatura, karsiTaraf) => {
  const logoUrl = `${window.location.origin}/ytu-logo.png`
  const gibLogoUrl = `${window.location.origin}/gib-logo.png`
  const yedekLogoUrl = `${window.location.origin}/ytu-logo.svg`
  const yedekGibLogoUrl = `${window.location.origin}/gib-logo.svg`
  const guvenliFaturaNo = htmlGuvenliMetin(fatura.faturaNo)
  const guvenliFaturaTuru = htmlGuvenliMetin(fatura.tur)
  const guvenliTarih = htmlGuvenliMetin(tarihFormatla(fatura.tarih))
  const guvenliOdemeTarihi = htmlGuvenliMetin(tarihFormatla(fatura.odemeTarihi))
  const guvenliKarsiTarafAdi = htmlGuvenliMetin(fatura.karsiTarafAdi)
  const guvenliTelefon = htmlGuvenliMetin(karsiTaraf?.telefon ?? '0532 000 00 00')
  const guvenliAdres = htmlGuvenliMetin(karsiTaraf?.adres ?? 'Malatya Yeşilyurt / Malatya')
  const guvenliVergiNo = htmlGuvenliMetin(karsiTaraf?.vergiNumarasi ?? karsiTaraf?.vergiNo ?? '1111111111')
  const guvenliDurum = htmlGuvenliMetin(fatura.durum)
  const guvenliNot = htmlGuvenliMetin(fatura.not || 'Standart ödeme ve teslimat koşulları geçerlidir.')

  const satirlarHtml = fatura.satirlar
    .map((satir, index) => {
      const toplam = Number(satir.miktar) * Number(satir.birimFiyat)
      return `
        <tr>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${index + 1}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${htmlGuvenliMetin(satir.urun)}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${satir.miktar}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${paraFormatla(satir.birimFiyat)}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">%${Math.round((satir.kdvOrani ?? FATURA_KDV_ORANI) * 100)}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${paraFormatla(toplam)}</td>
        </tr>
      `
    })
    .join('')

  return `
    <div style="width:794px;background:#fff;padding:18px 20px 22px;color:#17314d;font-family:Arial,sans-serif;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:18px;">
        <div style="max-width:255px;">
          <div style="font-size:13px;color:#61748d;margin-bottom:8px;">${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
          <div style="font-size:18px;font-weight:800;color:#1f61b8;margin-bottom:8px;">MTÜ Sanayi</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Malatya Yeşilyurt, Ankara Yolu 5. Km No:42</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Vergi No: 4481237781 | Tel: 0422 456 12 77</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">info@mtusanayi.com</div>
        </div>
        <div style="display:grid;justify-items:center;gap:6px;">
          <div style="font-size:11px;color:#5b6f88;">${guvenliFaturaNo}</div>
          <img src="${logoUrl}" onerror="this.onerror=null;this.src='${yedekLogoUrl}'" alt="MTÜ" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #d2e2f8;background:#fff;" />
        </div>
        <div style="max-width:240px;text-align:left;">
          <div style="font-size:18px;font-weight:800;color:#1f61b8;margin-bottom:8px;">${guvenliFaturaTuru}</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Fatura No: ${guvenliFaturaNo}</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Tarih: ${guvenliTarih}</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Ödeme Tarihi: ${guvenliOdemeTarihi}</div>
        </div>
      </div>

      <div style="margin-top:14px;border:1px solid #d9e8f9;border-radius:14px;padding:14px 16px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div>
          <div style="font-size:13px;font-weight:700;color:#244668;margin-bottom:10px;">${fatura.tur === 'Satış Faturası' ? 'Müşteri Bilgileri' : 'Tedarikçi Bilgileri'}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">${guvenliKarsiTarafAdi}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">${guvenliTelefon}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">${guvenliAdres}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">Vergi No: ${guvenliVergiNo}</div>
        </div>
        <div>
          <div style="font-size:13px;font-weight:700;color:#244668;margin-bottom:10px;">Fatura Özeti</div>
          <div style="font-size:11px;line-height:1.9;color:#2f4866;">Durum: ${guvenliDurum}</div>
          <div style="font-size:11px;line-height:1.9;color:#2f4866;">Satır Sayısı: ${fatura.satirlar.length}</div>
          <div style="font-size:11px;line-height:1.9;color:#2f4866;">Toplam Kalem: ${fatura.satirlar.reduce((toplam, satir) => toplam + Number(satir.miktar), 0)}</div>
        </div>
      </div>

      <div style="margin-top:14px;border:1px solid #d9e8f9;border-radius:14px;padding:14px 16px;">
        <div style="font-size:13px;font-weight:700;color:#244668;margin-bottom:10px;">Ürünler</div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">No</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Hizmet / Ürün</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Miktar</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Birim Fiyat</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">KDV Oranı</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Toplam</th>
            </tr>
          </thead>
          <tbody>${satirlarHtml}</tbody>
        </table>

        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-top:18px;">
          <div style="font-size:11px;color:#6f8298;line-height:1.5;max-width:360px;">${guvenliNot}</div>
          <div style="min-width:220px;display:grid;gap:8px;">
            <div style="display:flex;justify-content:space-between;color:#45617d;font-size:11px;"><span>Ara Toplam</span><strong style="color:#17314d;">${paraFormatla(fatura.araToplam)}</strong></div>
            <div style="display:flex;justify-content:space-between;color:#45617d;font-size:11px;"><span>KDV</span><strong style="color:#17314d;">${paraFormatla(fatura.kdv)}</strong></div>
            <div style="display:flex;justify-content:space-between;color:#1f61b8;font-size:14px;font-weight:800;border-top:1px solid #dce7f5;padding-top:8px;"><span>Toplam</span><strong>${paraFormatla(fatura.toplam)}</strong></div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;margin-top:14px;">
          <img src="${gibLogoUrl}" onerror="this.onerror=null;this.src='${yedekGibLogoUrl}'" alt="GİB" style="width:86px;height:86px;object-fit:contain;" />
        </div>
      </div>
    </div>
  `
}

const faturaBelgeTamHtmlOlustur = (fatura, karsiTaraf) => `
  <html lang="tr">
    <head>
      <meta charset="utf-8" />
      <title>${htmlGuvenliMetin(fatura.faturaNo)}</title>
      <style>
        html, body { margin: 0; padding: 0; background: #ffffff; }
        body { font-family: Arial, sans-serif; color: #17314d; }
        .yazdir-sayfa { width: 794px; margin: 0 auto; padding: 28px 0; box-sizing: border-box; }
        img { max-width: 100%; }
        @page { size: A4; margin: 10mm; }
        @media print {
          body { background: #ffffff; }
          .yazdir-sayfa { margin: 0 auto; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="yazdir-sayfa">${faturaBelgeHtmlOlustur(fatura, karsiTaraf)}</div>
    </body>
  </html>
`

let pdfKutuphaneleriPromise = null

const pdfKutuphaneleriniYukle = async () => {
  if (!pdfKutuphaneleriPromise) {
    pdfKutuphaneleriPromise = Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]).then(([html2canvasModulu, jsPdfModulu]) => ({
      html2canvas: html2canvasModulu.default,
      jsPDF: jsPdfModulu.default,
    }))
  }

  return pdfKutuphaneleriPromise
}

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

  const siparisMusteriAra = (siparis) => {
    const musteriKaydi = musteriler.find(
      (musteri) => metniNormalizeEt(musteri.ad) === metniNormalizeEt(siparis.musteri),
    )
    const telefon = musteriKaydi?.telefon ?? siparisMusteriTelefonlari[siparis.musteri]
    if (!telefon) {
      toastGoster('hata', `${siparis.musteri} için telefon bilgisi bulunamadı.`)
      return
    }

    window.location.href = `tel:${telefon.replace(/\s+/g, '')}`
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
                  <button
                    type="button"
                    className={`odeme-sekme ${siparisSekmesi === 'aktif' ? 'aktif' : ''}`}
                    onClick={() => setSiparisSekmesi('aktif')}
                  >
                    Aktif Siparişler
                  </button>
                  <button
                    type="button"
                    className={`odeme-sekme ${siparisSekmesi === 'gecmis' ? 'aktif' : ''}`}
                    onClick={() => setSiparisSekmesi('gecmis')}
                  >
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
                              <td>
                                <span className={`odeme-durumu ${siparis.odemeDurumu === 'Ödendi' ? 'odendi' : 'beklemede'}`}>
                                  {siparis.odemeDurumu}
                                </span>
                              </td>
                              <td>{siparis.urunHazirlik}</td>
                              <td>
                                <span className={`durum-baloncuk ${durumSinifi(siparis.teslimatDurumu)}`}>{siparis.teslimatDurumu}</span>
                              </td>
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
                        <article key={`mobil-${siparis.siparisNo}`} className="mobil-kart siparis-mobil-kart">
                          <div className="mobil-kart-ust">
                            <strong>{siparis.siparisNo}</strong>
                            <span className={`durum-baloncuk ${durumSinifi(siparis.teslimatDurumu)}`}>{siparis.teslimatDurumu}</span>
                          </div>
                          <div className="mobil-kart-govde">
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Müşteri</span><strong>{siparis.musteri}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ürün</span><strong>{siparis.urun}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tutar</span><strong>{paraFormatla(siparis.toplamTutar)}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tarih</span><strong>{tarihFormatla(siparis.siparisTarihi)}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ödeme</span><strong><span className={`odeme-durumu ${siparis.odemeDurumu === 'Ödendi' ? 'odendi' : 'beklemede'}`}>{siparis.odemeDurumu}</span></strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Hazırlık</span><strong>{siparis.urunHazirlik}</strong></div>
                          </div>
                          <div className="mobil-kart-aksiyon">
                            <div className="siparis-mobil-aksiyonlari">
                              <button type="button" className="siparis-aksiyon-buton" onClick={() => setDetaySiparis(siparis)}>Detay</button>
                              <button type="button" className="siparis-aksiyon-buton" onClick={() => siparisDurumGuncellemeAc(siparis)}>Durum Güncelle</button>
                              <button type="button" className="siparis-aksiyon-buton ikincil" onClick={() => siparisMusteriAra(siparis)}>Müşteriyi Ara</button>
                              <button type="button" className="siparis-aksiyon-buton ikincil" onClick={() => siparisDuzenlemeAc(siparis)}>Düzenle</button>
                              <button type="button" className="siparis-aksiyon-buton tehlike" onClick={() => setSilinecekSiparis(siparis)}>Sil</button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="sayfalama">
                      <button type="button" className="sayfa-ok" onClick={() => setSiparisSayfa(siparisSayfa - 1)} disabled={siparisSayfa === 1}>‹</button>
                      {Array.from({ length: toplamSiparisSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                        <button
                          key={sayfaNo}
                          type="button"
                          className={`sayfa-buton ${siparisSayfa === sayfaNo ? 'aktif' : ''}`}
                          onClick={() => setSiparisSayfa(sayfaNo)}
                        >
                          {sayfaNo}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="sayfa-ok"
                        onClick={() => setSiparisSayfa(siparisSayfa + 1)}
                        disabled={siparisSayfa === toplamSiparisSayfa}
                      >
                        ›
                      </button>
                    </div>
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
                        <article key={`mobil-${kayit.logNo}`} className="mobil-kart siparis-mobil-kart">
                          <div className="mobil-kart-ust">
                            <strong>{kayit.siparisNo}</strong>
                            <span className={`tedarik-durum ${kayit.durum === 'İptal Edildi' ? 'iptal' : kayit.durum === 'İade Edildi' ? 'iade' : 'teslim'}`}>{kayit.durum}</span>
                          </div>
                          <div className="mobil-kart-govde">
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Log No</span><strong>{kayit.logNo}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Müşteri</span><strong>{kayit.musteri}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Ürün</span><strong>{kayit.urun}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tarih</span><strong>{tarihFormatla(kayit.tarih)}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Miktar</span><strong>{kayit.miktar}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Tutar</span><strong>{paraFormatla(kayit.tutar)}</strong></div>
                            <div className="mobil-bilgi-satiri siparis-detay-satiri"><span>Durum</span><strong>{kayit.durum}</strong></div>
                            <div className="mobil-bilgi-satiri tam"><span>Açıklama</span><strong>{kayit.aciklama}</strong></div>
                          </div>
                        <div className="mobil-kart-aksiyon">
                          <div className="siparis-mobil-aksiyonlari">
                            <button type="button" className="siparis-aksiyon-buton" onClick={() => setDetayGecmisSiparis(kayit)}>Detay</button>
                          </div>
                        </div>
                      </article>
                    ))}
                    </div>

                    <div className="sayfalama">
                      <button type="button" className="sayfa-ok" onClick={() => setGecmisSiparisSayfa(gecmisSiparisSayfa - 1)} disabled={gecmisSiparisSayfa === 1}>‹</button>
                      {Array.from({ length: toplamGecmisSiparisSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                        <button
                          key={`gecmis-siparis-sayfa-${sayfaNo}`}
                          type="button"
                          className={`sayfa-buton ${gecmisSiparisSayfa === sayfaNo ? 'aktif' : ''}`}
                          onClick={() => setGecmisSiparisSayfa(sayfaNo)}
                        >
                          {sayfaNo}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="sayfa-ok"
                        onClick={() => setGecmisSiparisSayfa(gecmisSiparisSayfa + 1)}
                        disabled={gecmisSiparisSayfa === toplamGecmisSiparisSayfa}
                      >
                        ›
                      </button>
                    </div>
                  </>
                )}
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

                <div className="tablo-sarmal masaustu-tablo">
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
                                <KucukIkon tip="favori" />
                              </button>
                              <button
                                type="button"
                                className="odeme-ikon kalem"
                                onClick={() => odemeDuzenlemeAc(odemeSekmesi, kayit)}
                                title="Düzenle"
                              >
                                <KucukIkon tip="duzenle" />
                              </button>
                              <button
                                type="button"
                                className="odeme-ikon cop"
                                onClick={() => setSilinecekOdeme({ sekme: odemeSekmesi, odemeNo: kayit.odemeNo, taraf: kayit.taraf })}
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
                  {(odemeSekmesi === 'gelen' ? gelenSayfadakiKayitlar : gidenSayfadakiKayitlar).map((kayit) => (
                    <article key={`mobil-${kayit.odemeNo}`} className="mobil-kart">
                      <div className="mobil-kart-ust">
                        <strong>{kayit.odemeNo}</strong>
                        <span className={`nakit-tutar-baloncuk ${odemeSekmesi === 'gelen' ? 'gelen' : 'giden'}`}>{paraFormatla(kayit.tutar)}</span>
                      </div>
                      <div className="mobil-kart-govde">
                        <div className="mobil-bilgi-satiri"><span>Cari / Tedarikçi</span><strong>{kayit.taraf}</strong></div>
                        <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(kayit.tarih)}</strong></div>
                        <div className="mobil-bilgi-satiri"><span>Durum</span><strong>{kayit.durum}</strong></div>
                      </div>
                      <div className="mobil-kart-aksiyon">
                        <div className="odeme-islemler">
                          <button
                            type="button"
                            className={`odeme-ikon yildiz ${kayit.favori ? 'aktif' : ''}`}
                            onClick={() => finansFavoriDegistir(odemeSekmesi, kayit.odemeNo)}
                            title="Favori"
                          >
                            <KucukIkon tip="favori" />
                          </button>
                          <button
                            type="button"
                            className="odeme-ikon kalem"
                            onClick={() => odemeDuzenlemeAc(odemeSekmesi, kayit)}
                            title="Düzenle"
                          >
                            <KucukIkon tip="duzenle" />
                          </button>
                          <button
                            type="button"
                            className="odeme-ikon cop"
                            onClick={() => setSilinecekOdeme({ sekme: odemeSekmesi, odemeNo: kayit.odemeNo, taraf: kayit.taraf })}
                            title="Sil"
                          >
                            <KucukIkon tip="sil" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
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
              <header className="ust-baslik envanter-baslik">
                <div>
                  <h1>Kayıtlı Müşteriler</h1>
                  <p>Daha önce alışveriş yapan müşterileri telefon ve not bilgileriyle birlikte yönetin.</p>
                </div>
                <button type="button" className="urun-ekle-karti" onClick={musteriEklemeAc}>
                  <span className="urun-ekle-ikon" aria-hidden="true"><KucukIkon tip="musteri-ekle" /></span>
                  <span className="urun-ekle-metin">Müşteri Ekle</span>
                </button>
              </header>

              <section className="panel-kart musteriler-kart">
                <div className="panel-ust-cizgi">
                  <h2>Müşteri Listesi</h2>
                  <input
                    type="text"
                    placeholder="Müşteri adı veya telefon ara"
                    value={musteriArama}
                    onChange={(event) => {
                      setMusteriArama(event.target.value)
                      setMusteriSayfa(1)
                    }}
                  />
                </div>

                <div className="tablo-sarmal masaustu-tablo">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Müşteri</th>
                        <th>Telefon</th>
                        <th>Son Satın Alım</th>
                        <th>Sipariş Sayısı</th>
                        <th>Toplam Harcama</th>
                        <th>Not</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiMusteriler.map((musteri, index) => (
                        <tr key={musteri.uid}>
                          <td>{String(musteriBaslangic + index + 1).padStart(2, '0')}</td>
                          <td>
                            <div className="urun-hucre">
                              <span className="musteri-avatar" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <circle cx="12" cy="8.1" r="4.05" />
                                  <path d="M4.8 19.8a8.1 8.1 0 0 1 14.4 0A11.2 11.2 0 0 1 12 22a11.2 11.2 0 0 1-7.2-2.2Z" />
                                </svg>
                              </span>
                              <strong>{musteri.ad}</strong>
                            </div>
                          </td>
                          <td>{musteri.telefon}</td>
                          <td>{tarihFormatla(musteri.sonAlim)}</td>
                          <td>{musteri.toplamSiparis}</td>
                          <td>{paraFormatla(musteri.toplamHarcama)}</td>
                          <td className="musteri-not-ozet">{musteri.not}</td>
                          <td>
                            <div className="islem-dugmeleri">
                              <button type="button" className={`ikon-dugme favori ${musteri.favori ? 'aktif' : ''}`} title="Favori" onClick={() => musteriFavoriDegistir(musteri.uid)}><KucukIkon tip="favori" /></button>
                              <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={() => musteriNotAc(musteri)}><KucukIkon tip="not" /></button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => musteriDuzenlemeAc(musteri)}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekMusteri(musteri)}><KucukIkon tip="sil" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiMusteriler.map((musteri, index) => (
                    <article key={`mobil-musteri-${musteri.uid}`} className="mobil-kart">
                      <div className="mobil-kart-ust">
                        <strong>{String(musteriBaslangic + index + 1).padStart(2, '0')} - {musteri.ad}</strong>
                        <span>{tarihFormatla(musteri.sonAlim)}</span>
                      </div>
                      <div className="mobil-kart-govde">
                        <div className="mobil-kart-kisi">
                          <span className="musteri-avatar" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="8.1" r="4.05" />
                              <path d="M4.8 19.8a8.1 8.1 0 0 1 14.4 0A11.2 11.2 0 0 1 12 22a11.2 11.2 0 0 1-7.2-2.2Z" />
                            </svg>
                          </span>
                          <div className="mobil-kisi-metin">
                            <strong>{musteri.ad}</strong>
                            <span>{musteri.telefon}</span>
                          </div>
                        </div>
                        <div className="mobil-bilgi-satiri"><span>Sipariş Sayısı</span><strong>{musteri.toplamSiparis}</strong></div>
                        <div className="mobil-bilgi-satiri"><span>Toplam Harcama</span><strong>{paraFormatla(musteri.toplamHarcama)}</strong></div>
                        <div className="mobil-bilgi-satiri tam"><span>Not</span><strong>{musteri.not}</strong></div>
                      </div>
                      <div className="mobil-kart-aksiyon">
                        <div className="islem-dugmeleri">
                          <button type="button" className={`ikon-dugme favori ${musteri.favori ? 'aktif' : ''}`} title="Favori" onClick={() => musteriFavoriDegistir(musteri.uid)}><KucukIkon tip="favori" /></button>
                          <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={() => musteriNotAc(musteri)}><KucukIkon tip="not" /></button>
                          <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => musteriDuzenlemeAc(musteri)}><KucukIkon tip="duzenle" /></button>
                          <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekMusteri(musteri)}><KucukIkon tip="sil" /></button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => musteriSayfayaGit(musteriSayfa - 1)} disabled={musteriSayfa === 1}>‹</button>
                  {Array.from({ length: toplamMusteriSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button
                      key={`musteri-sayfa-${sayfaNo}`}
                      type="button"
                      className={`sayfa-buton ${musteriSayfa === sayfaNo ? 'aktif' : ''}`}
                      onClick={() => musteriSayfayaGit(sayfaNo)}
                    >
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => musteriSayfayaGit(musteriSayfa + 1)} disabled={musteriSayfa === toplamMusteriSayfa}>›</button>
                </div>
              </section>
            </section>
          )}

          {aktifSayfa === 'alicilar' && (
            <section>
              <header className="ust-baslik envanter-baslik">
                <div>
                  <h1>Kayıtlı Tedarikçiler</h1>
                  <p>Tedarikçi detaylarını, siparişlerini ve fiyat geçmişlerini tek yerden yönetin.</p>
                </div>
              </header>

              <section className="panel-kart musteriler-kart">
                <div className="odeme-sekme-alani">
                  <button
                    type="button"
                    className={`odeme-sekme ${tedarikciSekmesi === 'liste' ? 'aktif' : ''}`}
                    onClick={() => setTedarikciSekmesi('liste')}
                  >
                    Tedarikçi Listesi
                  </button>
                  <button
                    type="button"
                    className={`odeme-sekme ${tedarikciSekmesi === 'siparisler' ? 'aktif' : ''}`}
                    onClick={() => setTedarikciSekmesi('siparisler')}
                  >
                    Son Tedarik Siparişleri
                  </button>
                </div>

                {tedarikciSekmesi === 'liste' && (
                  <>
                    <div className="panel-ust-cizgi tedarikci-ust-cizgi">
                      <h2>Tedarikçi Listesi</h2>
                      <div className="tedarikci-arama-alani">
                        <input
                          type="text"
                          placeholder="Firma, yetkili, telefon veya ürün grubu ara"
                          value={tedarikciArama}
                          onChange={(event) => setTedarikciArama(event.target.value)}
                        />
                        <button type="button" className="mobil-arama-dugmesi" aria-label="Tedarikçi ara"><KucukIkon tip="detay" /></button>
                      </div>
                      <button type="button" className="urun-ekle-karti" onClick={tedarikciEklemeAc}>
                        <span className="urun-ekle-ikon" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                        <span className="urun-ekle-metin">Tedarikçi Ekle</span>
                      </button>
                    </div>

                    <div className="tablo-sarmal masaustu-tablo">
                      <table>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Firma</th>
                            <th>Yetkili</th>
                            <th>Telefon</th>
                            <th>Ürün Grubu</th>
                            <th>Toplam Alış</th>
                            <th>Ortalama Teslim</th>
                            <th>Toplam Harcama</th>
                            <th>Not</th>
                            <th>İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sayfadakiTedarikciler.map((tedarikci, index) => (
                            <tr key={tedarikci.uid} className="satir-tiklanabilir" onClick={() => tedarikciDetayAc(tedarikci)}>
                              <td>{String(tedarikciBaslangic + index + 1).padStart(2, '0')}</td>
                              <td>
                                <div className="urun-hucre">
                                  <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                                  <strong>{tedarikci.firmaAdi}</strong>
                                </div>
                              </td>
                              <td>{tedarikci.yetkiliKisi}</td>
                              <td>{tedarikci.telefon}</td>
                              <td>{tedarikci.urunGrubu}</td>
                              <td>{tedarikci.toplamAlisSayisi}</td>
                              <td>{tedarikci.ortalamaTeslimSuresi}</td>
                              <td>{paraFormatla(tedarikci.toplamHarcama)}</td>
                              <td className="musteri-not-ozet">{tedarikci.not}</td>
                              <td>
                                <div className="islem-dugmeleri">
                                  <button type="button" className={`ikon-dugme favori ${tedarikci.favori ? 'aktif' : ''}`} title="Favori" onClick={(event) => { event.stopPropagation(); tedarikciFavoriDegistir(tedarikci.uid) }}><KucukIkon tip="favori" /></button>
                                  <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={(event) => { event.stopPropagation(); tedarikciNotAc(tedarikci) }}><KucukIkon tip="not" /></button>
                                  <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={(event) => { event.stopPropagation(); tedarikciDuzenlemeAc(tedarikci) }}><KucukIkon tip="duzenle" /></button>
                                  <button type="button" className="ikon-dugme sil" title="Sil" onClick={(event) => { event.stopPropagation(); setSilinecekTedarikci(tedarikci) }}><KucukIkon tip="sil" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mobil-kart-listesi">
                      {sayfadakiTedarikciler.map((tedarikci, index) => (
                        <article key={`mobil-tedarikci-${tedarikci.uid}`} className="mobil-kart tedarikci-mobil-kart">
                          <div className="mobil-kart-ust">
                            <strong>{String(tedarikciBaslangic + index + 1).padStart(2, '0')} - {tedarikci.firmaAdi}</strong>
                            <span>{tedarikci.urunGrubu}</span>
                          </div>
                          <div className="mobil-kart-govde">
                            <div className="mobil-kart-kisi">
                              <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                              <div className="mobil-kisi-metin">
                                <strong>{tedarikci.yetkiliKisi}</strong>
                                <span>{tedarikci.telefon}</span>
                              </div>
                            </div>
                            <div className="mobil-bilgi-satiri"><span>E-posta</span><strong>{tedarikci.email}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Toplam Alış</span><strong>{tedarikci.toplamAlisSayisi}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Toplam Harcama</span><strong>{paraFormatla(tedarikci.toplamHarcama)}</strong></div>
                            <div className="mobil-bilgi-satiri tam"><span>Not</span><strong>{tedarikci.not}</strong></div>
                          </div>
                          <div className="mobil-kart-aksiyon">
                            <div className="islem-dugmeleri">
                              <button type="button" className="siparis-aksiyon-buton" onClick={() => tedarikciDetayAc(tedarikci)}>Detay</button>
                              <button type="button" className={`ikon-dugme favori ${tedarikci.favori ? 'aktif' : ''}`} title="Favori" onClick={() => tedarikciFavoriDegistir(tedarikci.uid)}><KucukIkon tip="favori" /></button>
                              <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={() => tedarikciNotAc(tedarikci)}><KucukIkon tip="not" /></button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => tedarikciDuzenlemeAc(tedarikci)}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekTedarikci(tedarikci)}><KucukIkon tip="sil" /></button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="sayfalama">
                      <button type="button" className="sayfa-ok" onClick={() => tedarikciSayfayaGit(tedarikciSayfa - 1)} disabled={tedarikciSayfa === 1}>‹</button>
                      {Array.from({ length: toplamTedarikciSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                        <button key={`tedarikci-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${tedarikciSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => tedarikciSayfayaGit(sayfaNo)}>
                          {sayfaNo}
                        </button>
                      ))}
                      <button type="button" className="sayfa-ok" onClick={() => tedarikciSayfayaGit(tedarikciSayfa + 1)} disabled={tedarikciSayfa === toplamTedarikciSayfa}>›</button>
                    </div>
                  </>
                )}

                {tedarikciSekmesi === 'siparisler' && (
                  <>
                    <div className="panel-ust-cizgi tedarikci-ust-cizgi">
                      <h2>Mağazaya Verilen Son Siparişler</h2>
                      <button type="button" className="siparis-aksiyon-buton" onClick={genelTedarikSiparisEklemeAc}>
                        Yeni Sipariş
                      </button>
                    </div>

                    <div className="tablo-sarmal masaustu-tablo">
                      <table>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Tedarikçi</th>
                            <th>Sipariş No</th>
                            <th>Tarih</th>
                            <th>Tutar</th>
                            <th>Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sayfadakiTedarikSiparisleri.map((siparis, index) => (
                            <tr key={`${siparis.tedarikciUid}-${siparis.siparisNo}`} className="satir-tiklanabilir" onClick={() => tedarikciDetayAc(tedarikciler.find((item) => item.uid === siparis.tedarikciUid) ?? seciliTedarikci)}>
                              <td>{String(tedarikSiparisBaslangic + index + 1).padStart(2, '0')}</td>
                              <td>
                                <div className="urun-hucre">
                                  <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                                  <div className="mobil-kisi-metin">
                                    <strong>{siparis.firmaAdi}</strong>
                                    <span>{siparis.yetkiliKisi}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{siparis.siparisNo}</td>
                              <td>{tarihFormatla(siparis.tarih)}</td>
                              <td>{paraFormatla(siparis.tutar)}</td>
                              <td><span className={`tedarik-durum ${siparis.durum === 'Bekliyor' ? 'bekliyor' : siparis.durum === 'Hazırlanıyor' ? 'hazirlaniyor' : 'teslim'}`}>{siparis.durum}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mobil-kart-listesi">
                      {sayfadakiTedarikSiparisleri.map((siparis) => (
                        <article key={`mobil-tedarik-siparis-${siparis.tedarikciUid}-${siparis.siparisNo}`} className="mobil-kart tedarikci-mobil-kart">
                          <div className="mobil-kart-ust">
                            <strong>{siparis.siparisNo}</strong>
                            <span className={`tedarik-durum ${siparis.durum === 'Bekliyor' ? 'bekliyor' : siparis.durum === 'Hazırlanıyor' ? 'hazirlaniyor' : 'teslim'}`}>{siparis.durum}</span>
                          </div>
                          <div className="mobil-kart-govde">
                            <div className="mobil-kart-kisi">
                              <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                              <div className="mobil-kisi-metin">
                                <strong>{siparis.firmaAdi}</strong>
                                <span>{siparis.telefon}</span>
                              </div>
                            </div>
                            <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(siparis.tarih)}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(siparis.tutar)}</strong></div>
                          </div>
                          <div className="mobil-kart-aksiyon">
                            <button
                              type="button"
                              className="siparis-aksiyon-buton"
                              onClick={() => tedarikciDetayAc(tedarikciler.find((item) => item.uid === siparis.tedarikciUid) ?? seciliTedarikci)}
                            >
                              Tedarikçiye Git
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="sayfalama">
                      <button type="button" className="sayfa-ok" onClick={() => tedarikciSiparisSayfayaGit(tedarikciSiparisSayfa - 1)} disabled={tedarikciSiparisSayfa === 1}>‹</button>
                      {Array.from({ length: toplamTedarikSiparisSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                        <button key={`tedarik-siparis-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${tedarikciSiparisSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => tedarikciSiparisSayfayaGit(sayfaNo)}>
                          {sayfaNo}
                        </button>
                      ))}
                      <button type="button" className="sayfa-ok" onClick={() => tedarikciSiparisSayfayaGit(tedarikciSiparisSayfa + 1)} disabled={tedarikciSiparisSayfa === toplamTedarikSiparisSayfa}>›</button>
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
                        <article key={`mobil-duzenleme-${urun.uid}`} className="mobil-kart">
                          <div className="mobil-kart-ust">
                            <strong>{String(urunDuzenlemeBaslangic + index + 1).padStart(2, '0')} - {urun.ad}</strong>
                            <span>{urun.urunId}</span>
                          </div>
                          <div className="mobil-kart-govde">
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
                          </div>
                          <div className="mobil-kart-aksiyon">
                            <div className="islem-dugmeleri">
                              <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}><KucukIkon tip="favori" /></button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => urunDuzenlemeModaliniAc(urun)}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekDuzenlemeUrunu(urun)}><KucukIkon tip="sil" /></button>
                            </div>
                          </div>
                        </article>
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
                )}

                {urunDuzenlemeSekmesi === 'stok-loglari' && (
                  <>
                    <div className="panel-ust-cizgi">
                      <h2>Son Stok Değişiklikleri</h2>
                      <span className="panel-bilgi-rozet">Son 16 hareket</span>
                    </div>

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
                        <article key={`mobil-stok-log-${log.id}`} className="mobil-kart">
                          <div className="mobil-kart-ust">
                            <strong>{String(stokLogBaslangic + index + 1).padStart(2, '0')} - {log.urun}</strong>
                            <span className="stok-log-rozet">{log.islem}</span>
                          </div>
                          <div className="mobil-kart-govde">
                            <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{log.tarih}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Ürün ID</span><strong>{log.urunId}</strong></div>
                            <div className="mobil-bilgi-satiri"><span>Eski Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.eskiStok > log.yeniStok ? 'yuksek' : 'dusuk'}`}>{log.eskiStok}</span></strong></div>
                            <div className="mobil-bilgi-satiri"><span>Yeni Stok</span><strong><span className={`stok-log-deger-baloncuk ${log.yeniStok > log.eskiStok ? 'yuksek' : 'dusuk'}`}>{log.yeniStok}</span></strong></div>
                            <div className="mobil-bilgi-satiri"><span>Kullanıcı</span><strong>{log.kullanici}</strong></div>
                            <div className="mobil-bilgi-satiri tam"><span>Açıklama</span><strong>{log.aciklama}</strong></div>
                          </div>
                        </article>
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
                    <article key={`mobil-envanter-${urun.uid}`} className="mobil-kart">
                      <div className="mobil-kart-ust">
                        <strong>{String(sayfaBaslangic + index + 1).padStart(2, '0')} - {urun.ad}</strong>
                        <span>{urun.kategori}</span>
                      </div>
                      <div className="mobil-kart-govde">
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
                      </div>
                      <div className="mobil-kart-aksiyon">
                        <div className="islem-dugmeleri">
                          <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}><KucukIkon tip="favori" /></button>
                          <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => duzenlemePenceresiniAc(urun)}><KucukIkon tip="duzenle" /></button>
                          <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekUrun(urun)}><KucukIkon tip="sil" /></button>
                        </div>
                      </div>
                    </article>
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






