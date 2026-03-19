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

const gecmisSiparisUrunleri = [
  { ad: 'Fren Balatası Ön Takım', satisFiyati: 2480 },
  { ad: 'Debriyaj Seti', satisFiyati: 3910 },
  { ad: 'Yağ Filtresi', satisFiyati: 320 },
  { ad: 'Akü 72Ah', satisFiyati: 3060 },
  { ad: 'Klima Kompresörü', satisFiyati: 8950 },
  { ad: 'Triger Kayışı Seti', satisFiyati: 1760 },
  { ad: 'Şarj Dinamosu', satisFiyati: 4280 },
  { ad: 'Polen Filtresi', satisFiyati: 360 },
]

const baslangicGecmisSiparisleri = Array.from({ length: 48 }, (_, index) => {
  const urun = gecmisSiparisUrunleri[index % gecmisSiparisUrunleri.length]
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

export {
  baslangicSiparisleri,
  baslangicGecmisSiparisleri,
  siparisMusteriTelefonlari,
}
