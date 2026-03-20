import { useEffect, useMemo, useState } from 'react'

export default function useGlobalSearch({
  aktifSayfa,
  urunler,
  siparisler,
  gecmisSiparisler,
  musteriler,
  tedarikciler,
  faturalar,
  paraFormatla,
  sayfaDegistir,
  inventoryData,
  ordersData,
  customersData,
  suppliersData,
  invoicesData,
}) {
  const [globalAramaMetni, setGlobalAramaMetni] = useState('')
  const [globalAramaMobilAcik, setGlobalAramaMobilAcik] = useState(false)

  const aramayiTemizle = () => {
    setGlobalAramaMetni('')
    setGlobalAramaMobilAcik(false)
  }

  useEffect(() => {
    aramayiTemizle()
  }, [aktifSayfa])

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

    const aktifSiparisSonuclari = siparisler
      .filter((siparis) => siparis.siparisNo.toLowerCase().includes(metin) || siparis.musteri.toLowerCase().includes(metin) || siparis.urun.toLowerCase().includes(metin))
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
      .filter((siparis) => siparis.siparisNo.toLowerCase().includes(metin) || siparis.logNo.toLowerCase().includes(metin) || siparis.musteri.toLowerCase().includes(metin) || siparis.urun.toLowerCase().includes(metin))
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
      .filter((musteri) => musteri.ad.toLowerCase().includes(metin) || (rakamArama && musteri.telefon.replace(/\D/g, '').includes(rakamArama)))
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
      .filter((tedarikci) => tedarikci.firmaAdi.toLowerCase().includes(metin) || tedarikci.yetkiliKisi.toLowerCase().includes(metin) || tedarikci.urunGrubu.toLowerCase().includes(metin))
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
      .filter((fatura) => fatura.faturaNo.toLowerCase().includes(metin) || fatura.karsiTarafAdi.toLowerCase().includes(metin) || fatura.tur.toLowerCase().includes(metin))
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
  }, [faturalar, gecmisSiparisler, globalAramaMetni, musteriler, paraFormatla, siparisler, tedarikciler, urunler])

  const globalAramaSonucunuAc = (sonuc) => {
    if (sonuc.hedef === 'envanter') {
      sayfaDegistir('envanter')
      inventoryData.setEnvanterKategori('Tümü')
      inventoryData.setAramaMetni(sonuc.deger)
      inventoryData.setEnvanterSayfa(1)
    }

    if (sonuc.hedef === 'siparisler-aktif') {
      sayfaDegistir('siparisler')
      ordersData.setSiparisSekmesi('aktif')
      ordersData.setSiparisArama(sonuc.deger)
      ordersData.setSiparisSayfa(1)
    }

    if (sonuc.hedef === 'siparisler-gecmis') {
      sayfaDegistir('siparisler')
      ordersData.setSiparisSekmesi('gecmis')
      ordersData.setGecmisSiparisArama(sonuc.deger)
      ordersData.setGecmisSiparisSayfa(1)
    }

    if (sonuc.hedef === 'musteriler') {
      sayfaDegistir('musteriler')
      customersData.setMusteriArama(sonuc.deger)
      customersData.setMusteriSayfa(1)
    }

    if (sonuc.hedef === 'alicilar') {
      sayfaDegistir('alicilar')
      suppliersData.setTedarikciSekmesi('liste')
      suppliersData.setTedarikciArama(sonuc.deger)
      suppliersData.setTedarikciSayfa(1)
      if (sonuc.uid) {
        const seciliTedarikci = suppliersData.tedarikciler.find((item) => item.uid === sonuc.uid)
        if (seciliTedarikci) suppliersData.tedarikciDetayAc(seciliTedarikci)
      }
    }

    if (sonuc.hedef === 'faturalama') {
      sayfaDegistir('faturalama')
      invoicesData.setFaturaSekmesi('gecmis')
      invoicesData.setFaturaArama(sonuc.deger)
      if (sonuc.uid) {
        invoicesData.faturaIdIleDetayAc(sonuc.uid)
      }
    }

    aramayiTemizle()
  }

  return {
    globalAramaMetni,
    setGlobalAramaMetni,
    globalAramaMobilAcik,
    setGlobalAramaMobilAcik,
    globalAramaSonuclari,
    globalAramaSonucunuAc,
    aramayiTemizle,
  }
}
