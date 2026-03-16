import { useEffect, useMemo, useState } from 'react'
import './App.css'

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'
const SAYFA_BASINA_URUN = 8
const ODEME_SAYFA_BASINA = 10
const MUSTERI_SAYFA_BASINA = 8
const SIPARIS_SAYFA_BASINA = 8
const STOK_LOG_SAYFA_BASINA = 8

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
  { siparisNo: '#SP-2122', musteri: 'Doğan Oto', urun: 'Şarj Dinamosu', toplamTutar: 4720, siparisTarihi: '2026-02-26', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2121', musteri: 'Özen Servis', urun: 'Polen Filtresi', toplamTutar: 1240, siparisTarihi: '2026-02-25', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2120', musteri: 'Başak Otomotiv', urun: 'Debriyaj Bilyası', toplamTutar: 3180, siparisTarihi: '2026-02-24', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Yolda', teslimatSuresi: '2 iş günü' },
]

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
  const [gizlenenOzetKartlari, setGizlenenOzetKartlari] = useState([])
  const [acikOzetMenusu, setAcikOzetMenusu] = useState('')
  const [urunler, setUrunler] = useState(baslangicUrunleri)
  const [musteriler, setMusteriler] = useState(baslangicMusterileri)
  const [siparisler, setSiparisler] = useState(baslangicSiparisleri)
  const [gelenNakitListesi, setGelenNakitListesi] = useState(() => gelenNakitKayitlari.map((k) => ({ ...k, favori: false })))
  const [gidenNakitListesi, setGidenNakitListesi] = useState(() => gidenNakitKayitlari.map((k) => ({ ...k, favori: false })))
  const [siparisArama, setSiparisArama] = useState('')
  const [siparisOdemeFiltresi, setSiparisOdemeFiltresi] = useState('Tüm Siparişler')
  const [siparisSayfa, setSiparisSayfa] = useState(1)
  const [yeniSiparisAcik, setYeniSiparisAcik] = useState(false)
  const [detaySiparis, setDetaySiparis] = useState(null)
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
  const [aiTemaMenuAcik, setAiTemaMenuAcik] = useState(false)
  const [aiMesajMetni, setAiMesajMetni] = useState('')
  const [aiHizliKonularAcik, setAiHizliKonularAcik] = useState(true)
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
      { baslik: 'Toplam Gelir', deger: paraFormatla(aySonuKari), degisim: '+%14', ikon: '₺' },
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
    if (siparisSayfa > toplamSiparisSayfa) setSiparisSayfa(toplamSiparisSayfa)
  }, [siparisSayfa, toplamSiparisSayfa])

  useEffect(() => {
    if (stokLogSayfa > toplamStokLogSayfa) setStokLogSayfa(toplamStokLogSayfa)
  }, [stokLogSayfa, toplamStokLogSayfa])

  useEffect(() => {
    setSiparisSayfa(1)
  }, [siparisArama, siparisOdemeFiltresi])

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
    setAcikOzetMenusu('')
    setAiTemaMenuAcik(false)
    setMobilMenuAcik(false)
    setYeniSiparisAcik(false)
    setDetaySiparis(null)
    setDuzenlenenSiparisNo(null)
    setDurumGuncellenenSiparisNo(null)
    setSilinecekSiparis(null)
    setDuzenlenenOdeme(null)
    setSilinecekOdeme(null)
    if (sayfa === 'envanter') setEnvanterSayfa(1)
    if (sayfa === 'urun-duzenleme') setUrunDuzenlemeSayfa(1)
    if (sayfa === 'urun-duzenleme') setStokLogSayfa(1)
    if (sayfa === 'musteriler') setMusteriSayfa(1)
    if (sayfa === 'siparisler') setSiparisSayfa(1)
    if (sayfa === 'odemeler') {
      setOdemeSekmesi('gelen')
      setGelenSayfa(1)
      setGidenSayfa(1)
    }
  }

  const merkezeDon = () => {
    sayfaDegistir('merkez')
  }

  const toastGoster = (tip, metin) => {
    const id = Date.now() + Math.random()
    setToastlar((onceki) => [...onceki, { id, tip, metin }])

    window.setTimeout(() => {
      setToastlar((onceki) => onceki.filter((toast) => toast.id !== id))
    }, 3200)
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
    const silinenAd = silinecekUrun.ad
    setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinecekUrun.uid))
    setSilinecekUrun(null)
    toastGoster('basari', `${silinenAd} envanterden silindi.`)
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
    const silinenAd = silinecekDuzenlemeUrunu.ad
    setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinecekDuzenlemeUrunu.uid))
    setSilinecekDuzenlemeUrunu(null)
    toastGoster('basari', `${silinenAd} ürün düzenleme listesinden kaldırıldı.`)
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
    const silinenNo = silinecekSiparis.siparisNo
    setSiparisler((onceki) => onceki.filter((siparis) => siparis.siparisNo !== silinenNo))
    setSilinecekSiparis(null)
    toastGoster('basari', `${silinenNo} siparişi silindi.`)
  }

  const siparisMusteriAra = (siparis) => {
    const telefon = siparisMusteriTelefonlari[siparis.musteri]
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
    toastGoster('basari', 'Tum bildirimler temizlendi.')
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
    const silinenAd = silinecekMusteri.ad
    setMusteriler((onceki) => onceki.filter((musteri) => musteri.uid !== silinecekMusteri.uid))
    setSilinecekMusteri(null)
    toastGoster('basari', `${silinenAd} müşteri listesinden silindi.`)
  }

  const ozetKartiniSil = (baslik) => {
    setGizlenenOzetKartlari((onceki) => [...onceki, baslik])
    setAcikOzetMenusu('')
    toastGoster('basari', `${baslik} kartı dashboarddan kaldırıldı.`)
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
    const silinenTaraf = silinecekOdeme.taraf
    odemeListesiGuncelle(silinecekOdeme.sekme, (onceki) => onceki.filter((k) => k.odemeNo !== silinecekOdeme.odemeNo))
    setSilinecekOdeme(null)
    toastGoster('basari', `${silinenTaraf} kaydı silindi.`)
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
                alt="Üniversite Logosu"
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

        <div className={`icerik-alani ${aktifSayfa === 'merkez' ? 'merkez-icerik' : ''}`}>
            {aktifSayfa === 'merkez' && (
              <section className={`merkez-ekrani ${gecisBalonu ? 'gecis-aktif' : ''}`}>
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
                      <div className="ozet-menu-sarmal">
                        <button
                          type="button"
                          className="ozet-menu"
                          aria-label="Kart Menüsü"
                          onClick={() => setAcikOzetMenusu((onceki) => (onceki === kart.baslik ? '' : kart.baslik))}
                        >
                          ⋮
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
                <button type="button" className="siparis-yeni-buton" onClick={yeniSiparisPenceresiniAc}>Yeni Sipariş</button>
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
                              <button type="button" className="ikon-dugme not" title="Detay" onClick={() => setDetaySiparis(siparis)}>≡</button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => siparisDuzenlemeAc(siparis)}>✎</button>
                              <button type="button" className="ikon-dugme favori" title="Durum Güncelle" onClick={() => siparisDurumGuncellemeAc(siparis)}>↺</button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekSiparis(siparis)}>🗑</button>
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
                  <span className="urun-ekle-ikon" aria-hidden="true">👤</span>
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
                              <button type="button" className={`ikon-dugme favori ${musteri.favori ? 'aktif' : ''}`} title="Favori" onClick={() => musteriFavoriDegistir(musteri.uid)}>★</button>
                              <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={() => musteriNotAc(musteri)}>📝</button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => musteriDuzenlemeAc(musteri)}>✎</button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekMusteri(musteri)}>🗑</button>
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
                          <button type="button" className={`ikon-dugme favori ${musteri.favori ? 'aktif' : ''}`} title="Favori" onClick={() => musteriFavoriDegistir(musteri.uid)}>★</button>
                          <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={() => musteriNotAc(musteri)}>📝</button>
                          <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => musteriDuzenlemeAc(musteri)}>✎</button>
                          <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekMusteri(musteri)}>🗑</button>
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
              <header className="ust-baslik siparisler-baslik">
                <div>
                  <h1>Kayıtlı Tedarikçiler</h1>
                  <p>Tedarikçi bilgileri bu bölümde toplanacak.</p>
                </div>
              </header>
              <section className="panel-kart bos-modul-karti">
                <h2>Tedarikçi modülü hazırlanıyor</h2>
                <p>Bu alanı ürün tedarik ettiğiniz firmaların kayıtları için kullanacağız.</p>
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
                                  <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}>★</button>
                                  <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => urunDuzenlemeModaliniAc(urun)}>✎</button>
                                  <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekDuzenlemeUrunu(urun)}>🗑</button>
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
                              <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}>★</button>
                              <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => urunDuzenlemeModaliniAc(urun)}>✎</button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekDuzenlemeUrunu(urun)}>🗑</button>
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
                          <button type="button" className={`ikon-dugme favori ${urun.favori ? 'aktif' : ''}`} title="Favori" onClick={() => favoriDegistir(urun.uid)}>★</button>
                          <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => duzenlemePenceresiniAc(urun)}>✎</button>
                          <button type="button" className="ikon-dugme sil" title="Sil" onClick={() => setSilinecekUrun(urun)}>🗑</button>
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
        )}

        {aktifSayfa !== 'merkez' && bildirimPanelAcik && (
          <section className={`bildirim-paneli ${bildirimPanelKapaniyor ? 'kapaniyor' : 'aciliyor'}`}>
            <header className="bildirim-panel-ust">
              <div>
                <strong>Bildirimler</strong>
                <small>Yakın zamanda gerçekleşen gelişmeler</small>
              </div>
              <div className="bildirim-panel-aksiyonlari">
                <button
                  type="button"
                  className="bildirim-hepsini-temizle"
                  onClick={tumBildirimleriTemizle}
                  disabled={bildirimler.length === 0}
                >
                  Hepsini Temizle
                </button>
                <button type="button" className="bildirim-panel-kapat" onClick={bildirimPaneliKapat} aria-label="Bildirimleri Kapat">
                  ×
                </button>
              </div>
            </header>

            <div className="bildirim-listesi">
              {bildirimler.length === 0 ? (
                <div className="bildirim-bos">
                  <strong>Görüntülenecek bildirim kalmadı.</strong>
                  <p>Yeni kritik stok, satis veya stok hareketleri burada belirecek.</p>
                </div>
              ) : (
                bildirimler.map((bildirim) => {
                  const okundu = okunanBildirimler.includes(bildirim.id)

                  return (
                    <article
                      key={bildirim.id}
                      className={`bildirim-oge ${bildirim.tur} ${okundu ? 'okundu' : 'okunmadi'}`}
                      onClick={() => bildirimdenSayfayaGit(bildirim)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          bildirimdenSayfayaGit(bildirim)
                        }
                      }}
                    >
                      <span className="bildirim-ikon" aria-hidden="true">
                        {bildirim.tur === 'kritik' ? '!' : bildirim.tur === 'stok' ? '↺' : bildirim.tur === 'tahsilat' ? '₺' : '✓'}
                      </span>
                      <div className="bildirim-icerik">
                        <div className="bildirim-etiket-satiri">
                          <strong>{bildirim.baslik}</strong>
                          <span className={`bildirim-durum-rozeti ${okundu ? 'okundu' : 'okunmadi'}`}>
                            {okundu ? 'Okundu' : 'Yeni'}
                          </span>
                        </div>
                        <p>{bildirim.detay}</p>
                        <div className="bildirim-alt-satir">
                          <small>{bildirim.zaman}</small>
                          <div className="bildirim-kart-aksiyonlari">
                            <button
                              type="button"
                              className="bildirim-mini-buton"
                              onClick={(event) => {
                                event.stopPropagation()
                                okundu ? bildirimiOkunmadiYap(bildirim.id) : bildirimiOkunduYap(bildirim.id)
                              }}
                            >
                              {okundu ? 'Okunmadı Yap' : 'Okundu Yap'}
                            </button>
                            <button
                              type="button"
                              className="bildirim-mini-buton vurgulu"
                              onClick={(event) => {
                                event.stopPropagation()
                                bildirimiTemizle(bildirim.id)
                              }}
                            >
                              Temizle
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </section>
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
          <section className={`ai-panel ai-tema-acik ${aiPanelKapaniyor ? 'kapaniyor' : 'aciliyor'}`}>
            <header className="ai-panel-ust">
              <div className="ai-panel-kontroller">
                <button
                  type="button"
                  className="ai-ikon-buton"
                  aria-label="Tema menüsü"
                  onClick={() => setAiTemaMenuAcik((onceki) => !onceki)}
                >
                  ⋯
                </button>
                {aiTemaMenuAcik && (
                  <div className="ai-tema-menu">
                    <button
                      type="button"
                      className="aktif"
                      onClick={() => {
                        setAiTemaMenuAcik(false)
                      }}
                    >
                      <TemaIkonu tema="acik" />
                      <span>Açık Tema</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="ai-panel-baslik">
                <div className="ai-avatar" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="8.3" r="4.1" />
                    <path d="M4.9 19.8a7.9 7.9 0 0 1 14.2 0c-1.7 1.4-4.3 2.2-7.1 2.2s-5.4-.8-7.1-2.2Z" />
                  </svg>
                </div>
                <div>
                  <strong>Kişisel Asistanınız</strong>
                  <small>Her zaman yanınızda</small>
                </div>
              </div>

              <div className="ai-panel-aksiyonlar">
                <button
                  type="button"
                  className="ai-ikon-buton"
                  aria-label="Alta al"
                  onClick={() => {
                    setAiPanelKucuk(true)
                    setAiTemaMenuAcik(false)
                  }}
                >
                  −
                </button>
                <button
                  type="button"
                  className="ai-ikon-buton"
                  aria-label="Kapat"
                  onClick={aiPaneliKapat}
                >
                  ×
                </button>
              </div>
            </header>

            <div className="ai-mesajlar">
              {aiMesajlar.map((mesaj, index) => (
                <article key={mesaj.id} className={`ai-mesaj ai-mesaj-${mesaj.rol}`}>
                  <p>{mesaj.metin}</p>
                  {index === 0 && mesaj.rol === 'bot' && aiHizliKonularAcik && (
                    <div className="ai-hizli-konular">
                      {aiHizliKonular.map((konu) => (
                        <button
                          key={konu.etiket}
                          type="button"
                          className="ai-hizli-konu"
                          onClick={() => {
                            if (konu.etiket === 'Diğer') {
                              setAiHizliKonularAcik(false)
                              return
                            }
                            aiMesajGonder(konu.mesaj)
                          }}
                        >
                          {konu.etiket}
                        </button>
                      ))}
                    </div>
                  )}
                  <span>{mesaj.saat}</span>
                </article>
              ))}
            </div>

            <div className="ai-giris-alani">
              <input
                type="text"
                value={aiMesajMetni}
                onChange={(event) => setAiMesajMetni(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') aiMesajGonder()
                }}
                placeholder="Mesaj yaz..."
              />
              <button type="button" className="ai-gonder-buton" onClick={aiMesajGonder}>
                ↑
              </button>
            </div>
          </section>
        )}

        {toastlar.length > 0 && (
          <div className="toast-kapsayici" aria-live="polite" aria-atomic="true">
            {toastlar.map((toast) => (
              <article key={toast.id} className={`toast-bildirim ${toast.tip}`}>
                <span className="toast-ikon" aria-hidden="true">
                  {toast.tip === 'basari' ? '✓' : '!'}
                </span>
                <div className="toast-metin">
                  <strong>{toast.tip === 'basari' ? 'Başarılı' : 'Uyarı'}</strong>
                  <span>{toast.metin}</span>
                </div>
                <button
                  type="button"
                  className="toast-kapat"
                  aria-label="Bildirimi kapat"
                  onClick={() => setToastlar((onceki) => onceki.filter((oge) => oge.id !== toast.id))}
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


