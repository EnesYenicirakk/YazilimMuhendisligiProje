
import { tarihFormatla } from '../../components/common/Ikonlar';
const FATURA_KDV_ORANI = 0.2; // needed inside

export const envanterKategorileri = ['Tümü', 'Motor', 'Fren', 'Filtre', 'Elektrik', 'Şanzıman', 'Diğer']

export const avatarOlustur = (ad) =>
  ad
    .split(' ')
    .slice(0, 2)
    .map((parca) => parca[0].toUpperCase() || '')
    .join('')
    .slice(0, 2)

export const gunEtiketiKisalt = (etiket) => {
  const harita = {
    Pzt: 'P',
    Sal: 'S',
    Çar: 'Ç',
    Per: 'P',
    Cum: 'C',
    Cmt: 'C',
    Paz: 'P',
  }

  return harita[etiket] || etiket.charAt(0) || etiket
}

export const urunOlustur = (uid, urunId, kategori, ad, urunAdedi, magazaStok, minimumStok, alisFiyati, satisFiyati) => ({
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

export const baslangicUrunleri = [
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

export const dashboardOzetSablon = [
  { baslik: 'Acil Sipariş', deger: '17', degisim: '-%6', ikon: 'kutu' },
  { baslik: 'Toplam Sipariş', deger: '1865', degisim: '+%12', ikon: 'liste' },
  { baslik: 'Ortalama Teslimat', deger: '2,6 Gün', degisim: '+%8', ikon: 'saat' },
]

export const dashboardBolumSablonu = [
  { anahtar: 'canli', etiket: 'Canlı Özetler' },
  { anahtar: 'haftalik', etiket: 'Haftalık Grafik ve En Çok Satanlar' },
  { anahtar: 'kritik', etiket: 'Kritik Stok Uyarısı' },
  { anahtar: 'yakin', etiket: 'Yakın Zamanda Satılan Ürünler' },
  { anahtar: 'altGrafikler', etiket: 'Alt Grafikler' },
]

export const paraFormatla = (deger) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(deger)
}

export const aylar = ['May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki']
export const gelirSerisi = [92000, 108000, 104000, 121000, 129000, 137000]
export const giderSerisi = [76000, 82000, 79000, 96000, 102000, 101000]
export const aylikSatilanUrun = [360, 245, 278, 332, 406, 452]

export const cizgiNoktalari = (degerler, maksimumDeger) => {
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

export const durumSinifi = (durum) => {
  if (durum === 'Yolda') return 'durum-yolda'
  if (durum === 'Hazırlanıyor') return 'durum-hazirlaniyor'
  if (durum === 'Teslim Edildi') return 'durum-teslim'
  return ''
}

export const teslimatGununuCoz = (metin) => {
  const eslesme = String(metin).match(/(\d+)/)
  return eslesme ? Number(eslesme[1]) : 0
}

export const telefonuNormalizeEt = (telefon) => telefon.replace(/\D/g, '')

export const telefonGecerliMi = (telefon) => {
  const rakamlar = telefonuNormalizeEt(telefon)
  return /^0\d{10}$/.test(rakamlar)
}

export const negatifSayiVarMi = (...degerler) => degerler.some((deger) => Number(deger) < 0)

export const bosForm = {
  urunId: '',
  ad: '',
  urunAdedi: '',
  magazaStok: '',
  minimumStok: '',
}

export const bosUrunDuzenlemeFormu = {
  urunId: '',
  ad: '',
  urunAdedi: '',
  magazaStok: '',
  alisFiyati: '',
  satisFiyati: '',
}

export const bosMusteriFormu = {
  ad: '',
  telefon: '',
  sonAlim: '',
  toplamSiparis: '',
  toplamHarcama: '',
  not: '',
}

export const bosTedarikciFormu = {
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

export const bosTedarikciSiparisFormu = {
  siparisNo: '',
  tarih: '',
  tutar: '',
  durum: 'Bekliyor',
}

export const bosSiparisFormu = {
  musteri: '',
  urun: '',
  toplamTutar: '',
  siparisTarihi: '',
  odemeDurumu: 'Beklemede',
  urunHazirlik: 'Hazırlanıyor',
  teslimatDurumu: 'Hazırlanıyor',
  teslimatSuresi: '',
}

export const bosFaturaSatiri = (id = Date.now()) => ({
  id,
  urunUid: '',
  urun: '',
  miktar: 1,
  birimFiyat: 0,
  kdvOrani: FATURA_KDV_ORANI,
})

export const bosFaturaFormu = {
  tur: 'Satış Faturası',
  karsiTarafUid: '',
  karsiTarafAdi: '',
  tarih: new Date().toISOString().slice(0, 10),
  odemeTarihi: new Date().toISOString().slice(0, 10),
  not: '',
  satirlar: [bosFaturaSatiri(1)],
}

export const faturaToplamlariHesapla = (satirlar) => {
  const araToplam = satirlar.reduce((toplam, satir) => toplam + Number(satir.miktar || 0) * Number(satir.birimFiyat || 0), 0)
  const kdv = satirlar.reduce(
    (toplam, satir) => toplam + Number(satir.miktar || 0) * Number(satir.birimFiyat || 0) * Number(satir.kdvOrani || FATURA_KDV_ORANI),
    0,
  )
  return {
    araToplam,
    kdv,
    toplam: araToplam + kdv,
  }
}

export const faturaKaydiOlustur = ({ id, faturaNo, tur, karsiTarafUid, karsiTarafAdi, tarih, odemeTarihi, satirlar, not, durum = 'Taslak' }) => {
  const temizSatirlar = satirlar.map((satir) => ({
    ...satir,
    miktar: Number(satir.miktar),
    birimFiyat: Number(satir.birimFiyat),
    kdvOrani: Number(satir.kdvOrani || FATURA_KDV_ORANI),
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

export const baslangicFaturalari = [
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

export const merkezMenusu = [
  { sayfa: 'dashboard', baslik: 'Dashboard', renk: 'turuncu', aciklama: 'Özet görünüm' },
  { sayfa: 'envanter', baslik: 'Envanter', renk: 'yesil-koyu', aciklama: 'Stok yönetimi' },
  { sayfa: 'siparisler', baslik: 'Siparişler', renk: 'altin', aciklama: 'Sipariş hareketleri' },
  { sayfa: 'musteriler', baslik: 'Kayıtlı Müşteriler', renk: 'turkuaz', aciklama: 'Müşteri listesi' },
  { sayfa: 'alicilar', baslik: 'Kayıtlı Tedarikçiler', renk: 'lacivert', aciklama: 'Tedarikçi kayıtları' },
  { sayfa: 'odemeler', baslik: 'Finansal Akış', renk: 'kehribar', aciklama: 'Nakit akışı' },
  { sayfa: 'urun-duzenleme', baslik: 'Ürün Düzenleme', renk: 'mavi-gri', aciklama: 'Ürün güncelleme' },
  { sayfa: 'faturalama', baslik: 'Faturalama (PDF)', renk: 'kiremit', aciklama: 'Fatura üretimi' },
]

export const aiHizliKonular = [
  { etiket: 'Aylık Satış', mesaj: 'Bu ay gerçekleşen satışlar hakkında bilgi ver.' },
  { etiket: 'Stok Durumu', mesaj: 'Bana stokları azalan ürünlerimiz hakkında bilgi ver.' },
  { etiket: 'Kargolanmış Siparişler', mesaj: 'Kargolanan siparişlerin teslimi yapıldı mı' },
  { etiket: 'Kargolanmamış Siparişler', mesaj: 'Hangi siparişlerimiz henüz kargolanmadı' },
  { etiket: 'En Çok Satanlar', mesaj: 'En çok satan ürünlerimizden bana bahset.' },
  { etiket: 'En Son Satış', mesaj: 'En son gerçekleşen satışın ayrıntılarını anlat.' },
  { etiket: 'Diğer', mesaj: null },
]

export const metniNormalizeEt = (metin) =>
  metin
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.!,;:]/g, '')
    .trim()

export const favorileriOneTasi = (liste, tarihAl) =>
  [...liste].sort((a, b) => {
    if (Boolean(a.favori) !== Boolean(b.favori)) return a.favori ? -1 : 1
    if (tarihAl) return tarihAl(b) - tarihAl(a)
    return 0
  })

export const kritikStoktaMi = (urun) => urun.magazaStok <= (urun.minimumStok ?? 10)

export const htmlGuvenliMetin = (metin) =>
  String(metin ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const pdfGuvenliMetin = (metin) =>
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

export const pdfSatirOlustur = (metin, x, y, fontBoyutu = 12) =>
  `BT /F1 ${fontBoyutu} Tf 1 0 0 1 ${x} ${y} Tm (${pdfGuvenliMetin(metin)}) Tj ET`

export const faturaBelgeHtmlOlustur = (fatura, karsiTaraf) => {
  const logoUrl = `${window.location.origin}/ytu-logo.png`
  const gibLogoUrl = `${window.location.origin}/gib-logo.png`
  const yedekLogoUrl = `${window.location.origin}/ytu-logo.svg`
  const yedekGibLogoUrl = `${window.location.origin}/gib-logo.svg`
  const guvenliFaturaNo = htmlGuvenliMetin(fatura.faturaNo)
  const guvenliFaturaTuru = htmlGuvenliMetin(fatura.tur)
  const guvenliTarih = htmlGuvenliMetin(tarihFormatla(fatura.tarih))
  const guvenliOdemeTarihi = htmlGuvenliMetin(tarihFormatla(fatura.odemeTarihi))
  const guvenliKarsiTarafAdi = htmlGuvenliMetin(fatura.karsiTarafAdi)
  const guvenliTelefon = htmlGuvenliMetin(karsiTaraf.telefon || '0532 000 00 00')
  const guvenliAdres = htmlGuvenliMetin(karsiTaraf.adres || 'Malatya Ye?ilyurt / Malatya')
  const guvenliVergiNo = htmlGuvenliMetin(karsiTaraf.vergiNumarasi || karsiTaraf.vergiNo || '1111111111')
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
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">%${Math.round((satir.kdvOrani || FATURA_KDV_ORANI) * 100)}</td>
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

export const faturaBelgeTamHtmlOlustur = (fatura, karsiTaraf) => `
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

export let pdfKutuphaneleriPromise = null

export const pdfKutuphaneleriniYukle = async () => {
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


