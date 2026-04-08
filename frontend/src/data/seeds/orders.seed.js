const siparisMusterileri = [
  { uid: 1, ad: 'Yıldız Oto' },
  { uid: 2, ad: 'Tekin Otomotiv' },
  { uid: 3, ad: 'Mert Motor' },
  { uid: 5, ad: 'Hızlı Servis' },
  { uid: 6, ad: 'Akın Oto' },
  { uid: 7, ad: 'Bora Yedek Parça' },
  { uid: 8, ad: 'Demir Oto' },
  { uid: 9, ad: 'Asil Sanayi' },
  { uid: 10, ad: 'Nehir Otomotiv' },
  { uid: 11, ad: 'Kaya Oto Servis' },
  { uid: 12, ad: 'Yaman Yedek' },
  { uid: 13, ad: 'Gürkan Oto' },
  { uid: 14, ad: 'Doğan Oto' },
  { uid: 15, ad: 'Özen Servis' },
  { uid: 16, ad: 'Başak Otomotiv' },
]

const musteriAdiniGetir = (uid) => siparisMusterileri.find((musteri) => musteri.uid === uid)?.ad ?? 'Bilinmiyor'

const baslangicSiparisleri = [
  { siparisNo: '#SP-2134', musteriUid: 1, musteri: musteriAdiniGetir(1), urun: 'Fren Balatası Ön Takım', toplamTutar: 8400, siparisTarihi: '2026-03-10', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Yolda', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2133', musteriUid: 2, musteri: musteriAdiniGetir(2), urun: 'Amortisör Ön Çift', toplamTutar: 9250, siparisTarihi: '2026-03-09', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '3 iş günü' },
  { siparisNo: '#SP-2132', musteriUid: 3, musteri: musteriAdiniGetir(3), urun: 'Debriyaj Seti', toplamTutar: 6150, siparisTarihi: '2026-03-08', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2131', musteriUid: 5, musteri: musteriAdiniGetir(5), urun: 'Yağ Filtresi', toplamTutar: 1760, siparisTarihi: '2026-03-07', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Yolda', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2130', musteriUid: 6, musteri: musteriAdiniGetir(6), urun: 'Triger Kayışı Seti', toplamTutar: 3980, siparisTarihi: '2026-03-06', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2129', musteriUid: 7, musteri: musteriAdiniGetir(7), urun: 'Akü 72Ah', toplamTutar: 11200, siparisTarihi: '2026-03-05', odemeDurumu: 'Beklemede', urunHazirlik: 'Tedarik Bekleniyor', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '4 iş günü' },
  { siparisNo: '#SP-2128', musteriUid: 8, musteri: musteriAdiniGetir(8), urun: 'Radyatör Üst Hortum', toplamTutar: 2350, siparisTarihi: '2026-03-04', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2127', musteriUid: 9, musteri: musteriAdiniGetir(9), urun: 'Klima Kompresörü', toplamTutar: 18750, siparisTarihi: '2026-03-03', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Yolda', teslimatSuresi: '3 iş günü' },
  { siparisNo: '#SP-2126', musteriUid: 10, musteri: musteriAdiniGetir(10), urun: 'ABS Sensörü', toplamTutar: 3270, siparisTarihi: '2026-03-02', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2125', musteriUid: 11, musteri: musteriAdiniGetir(11), urun: 'Turbo Hortumu', toplamTutar: 2860, siparisTarihi: '2026-03-01', odemeDurumu: 'Beklemede', urunHazirlik: 'Tedarik Bekleniyor', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '5 iş günü' },
  { siparisNo: '#SP-2124', musteriUid: 12, musteri: musteriAdiniGetir(12), urun: 'Far Ampulü H7', toplamTutar: 980, siparisTarihi: '2026-02-28', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2123', musteriUid: 13, musteri: musteriAdiniGetir(13), urun: 'Direksiyon Kutusu', toplamTutar: 15600, siparisTarihi: '2026-02-27', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Yolda', teslimatSuresi: '3 iş günü' },
  { siparisNo: '#SP-2122', musteriUid: 14, musteri: musteriAdiniGetir(14), urun: 'Şarj Dinamosu', toplamTutar: 4720, siparisTarihi: '2026-02-26', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Teslim Edildi', teslimatSuresi: '1 iş günü' },
  { siparisNo: '#SP-2121', musteriUid: 15, musteri: musteriAdiniGetir(15), urun: 'Polen Filtresi', toplamTutar: 1240, siparisTarihi: '2026-02-25', odemeDurumu: 'Beklemede', urunHazirlik: 'Hazırlanıyor', teslimatDurumu: 'Hazırlanıyor', teslimatSuresi: '2 iş günü' },
  { siparisNo: '#SP-2120', musteriUid: 16, musteri: musteriAdiniGetir(16), urun: 'Debriyaj Bilyası', toplamTutar: 3180, siparisTarihi: '2026-02-24', odemeDurumu: 'Ödendi', urunHazirlik: 'Toplandı', teslimatDurumu: 'Yolda', teslimatSuresi: '2 iş günü' },
]

const gecmisSiparisIadeIndeksleri = new Set([2, 9, 15, 21, 28, 34, 43])
const gecmisSiparisIptalIndeksleri = new Set([1, 6, 11, 17, 24, 29, 33, 39, 46])
const gecmisSiparisMusteriUidleri = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13]

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
  const musteriUid = gecmisSiparisMusteriUidleri[index % gecmisSiparisMusteriUidleri.length]
  const musteri = musteriAdiniGetir(musteriUid)
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
    musteriUid,
    musteri,
    urun: urun.ad,
    tarih: `2026-${ay}-${gun}`,
    tutar,
    miktar,
    durum,
    aciklama: `${musteri} için ${urun.ad} siparişi arşive alındı.`,
  }
})

export {
  baslangicSiparisleri,
  baslangicGecmisSiparisleri,
}
