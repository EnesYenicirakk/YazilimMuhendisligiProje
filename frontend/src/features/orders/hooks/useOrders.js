import { useEffect, useMemo, useState } from 'react'
import { orderApi } from '../../../core/services/backendApiService'
import { bosSiparisFormu, negatifSayiVarMi } from '../../../shared/utils/constantsAndHelpers'

const SIPARIS_SAYFA_BASINA = 8
const BOS_DURUM_FORMU = {
  odemeDurumu: 'Beklemede',
  urunHazirlik: 'Hazırlanıyor',
  teslimatDurumu: 'Hazırlanıyor',
  teslimatSuresi: '',
}

const negatifOlmayanSayiyaDonustur = (deger) => {
  const temizDeger = String(deger ?? '').replace(',', '.').replace(/[^\d.]/g, '')
  const ilkNokta = temizDeger.indexOf('.')
  if (ilkNokta === -1) return temizDeger

  return `${temizDeger.slice(0, ilkNokta + 1)}${temizDeger.slice(ilkNokta + 1).replace(/\./g, '')}`
}

const siparisIcinMusteriBul = (kayit, musteriListesi) => {
  if (kayit?.musteriUid == null || kayit?.musteriUid === '') return null

  return (
    musteriListesi.find((musteri) => String(musteri.uid) === String(kayit.musteriUid)) ??
    null
  )
}

export default function useOrders({
  musteriler = [],
  urunler = [],
  toastGoster,
  telefonAramasiBaslat,
  isLoggedIn,
}) {
  const siparisMusteriAdiniGetir = (kayit) =>
    siparisIcinMusteriBul(kayit, musteriler)?.ad ?? kayit?.musteri ?? 'Bilinmiyor'

  const [siparisler, setSiparisler] = useState([])
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
  const [siparisDurumFormu, setSiparisDurumFormu] = useState(BOS_DURUM_FORMU)
  const [gecmisSiparisler] = useState([])
  const [loading, setLoading] = useState(true)

  const musteriSecenekleri = useMemo(
    () =>
      musteriler.map((musteri) => ({
        uid: musteri.uid,
        ad: musteri.ad,
      })),
    [musteriler],
  )

  const urunSecenekleri = useMemo(
    () =>
      [...urunler]
        .map((urun) => ({
          uid: urun.uid,
          ad: urun.ad,
          urunId: urun.urunId,
          kategori: urun.kategori,
          stok: urun.magazaStok,
        }))
        .sort((a, b) => a.ad.localeCompare(b.ad, 'tr')),
    [urunler],
  )

  const siraliSiparisler = useMemo(
    () => [...siparisler].sort((a, b) => new Date(b.siparisTarihi).getTime() - new Date(a.siparisTarihi).getTime()),
    [siparisler],
  )

  const filtreliSiparisler = useMemo(() => {
    const arama = siparisArama.trim().toLowerCase()
    return siraliSiparisler.filter((siparis) => {
      const filtreUygun =
        siparisOdemeFiltresi === 'Tüm Siparişler' || siparis.odemeDurumu === siparisOdemeFiltresi
      if (!filtreUygun) return false
      if (!arama) return true

      const musteriAdi =
        (siparisIcinMusteriBul(siparis, musteriler)?.ad ?? siparis.musteri ?? '').toLowerCase()
      return (
        siparis.siparisNo.toLowerCase().includes(arama) ||
        musteriAdi.includes(arama) ||
        siparis.urun.toLowerCase().includes(arama)
      )
    })
  }, [siraliSiparisler, siparisArama, siparisOdemeFiltresi, musteriler])

  const toplamSiparisSayfa = Math.max(1, Math.ceil(filtreliSiparisler.length / SIPARIS_SAYFA_BASINA))
  const sayfadakiSiparisler = useMemo(() => {
    const baslangic = (siparisSayfa - 1) * SIPARIS_SAYFA_BASINA
    return filtreliSiparisler.slice(baslangic, baslangic + SIPARIS_SAYFA_BASINA)
  }, [filtreliSiparisler, siparisSayfa])

  const filtreliGecmisSiparisler = useMemo(() => {
    const metin = gecmisSiparisArama.trim().toLowerCase()
    if (!metin) return gecmisSiparisler

    return gecmisSiparisler.filter((siparis) => {
      const musteriAdi =
        (siparisIcinMusteriBul(siparis, musteriler)?.ad ?? siparis.musteri ?? '').toLowerCase()
      return (
        siparis.siparisNo.toLowerCase().includes(metin) ||
        siparis.logNo.toLowerCase().includes(metin) ||
        musteriAdi.includes(metin) ||
        siparis.urun.toLowerCase().includes(metin) ||
        siparis.durum.toLowerCase().includes(metin)
      )
    })
  }, [gecmisSiparisArama, gecmisSiparisler, musteriler])

  const toplamGecmisSiparisSayfa = Math.max(1, Math.ceil(filtreliGecmisSiparisler.length / SIPARIS_SAYFA_BASINA))
  const sayfadakiGecmisSiparisler = useMemo(() => {
    const baslangic = (gecmisSiparisSayfa - 1) * SIPARIS_SAYFA_BASINA
    return filtreliGecmisSiparisler.slice(baslangic, baslangic + SIPARIS_SAYFA_BASINA)
  }, [filtreliGecmisSiparisler, gecmisSiparisSayfa])

  const siparisAktivitesi = useMemo(() => {
    const paketlenecek = filtreliSiparisler.filter(
      (siparis) =>
        siparis.urunHazirlik === 'Hazırlanıyor' || siparis.urunHazirlik === 'Tedarik Bekleniyor',
    ).length
    const sevkEdilecek = filtreliSiparisler.filter(
      (siparis) => siparis.teslimatDurumu === 'Hazırlanıyor',
    ).length
    const teslimEdilecek = filtreliSiparisler.filter(
      (siparis) => siparis.teslimatDurumu === 'Yolda' || siparis.teslimatDurumu === 'Kargoda',
    ).length
    return { paketlenecek, sevkEdilecek, teslimEdilecek }
  }, [filtreliSiparisler])

  useEffect(() => {
    if (siparisSayfa > toplamSiparisSayfa) setSiparisSayfa(toplamSiparisSayfa)
  }, [siparisSayfa, toplamSiparisSayfa])

  useEffect(() => {
    if (gecmisSiparisSayfa > toplamGecmisSiparisSayfa) setGecmisSiparisSayfa(toplamGecmisSiparisSayfa)
  }, [gecmisSiparisSayfa, toplamGecmisSiparisSayfa])

  useEffect(() => {
    setSiparisSayfa(1)
  }, [siparisArama, siparisOdemeFiltresi])

  useEffect(() => {
    if (!isLoggedIn) return

    const siparisleriYukle = async () => {
      setLoading(true)
      try {
        const veriler = await orderApi.getAll()
        setSiparisler(veriler)
      } catch (error) {
        console.error('Siparişler yüklenirken hata oluştu:', error)
        toastGoster?.('hata', 'Sipariş listesi veritabanından alınamadı.')
      } finally {
        setLoading(false)
      }
    }
    siparisleriYukle()
  }, [toastGoster, isLoggedIn])

  useEffect(() => {
    setSiparisler((onceki) =>
      onceki.map((siparis) => {
        const musteriKaydi = siparisIcinMusteriBul(siparis, musteriler)
        if (!musteriKaydi || siparis.musteri === musteriKaydi.ad) return siparis

        return {
          ...siparis,
          musteri: musteriKaydi.ad,
        }
      }),
    )
  }, [musteriler])

  const siparisTelefonunuGetir = (kayit) =>
    siparisIcinMusteriBul(kayit, musteriler)?.telefon ?? 'Bilinmiyor'

  const siparisMusteriAra = (siparis) => {
    const telefon = siparisTelefonunuGetir(siparis)
    telefonAramasiBaslat?.(
      telefon === 'Bilinmiyor' ? '' : telefon,
      siparisMusteriAdiniGetir(siparis),
    )
  }

  const siparisDuzenlemeAc = (siparis) => {
    setDuzenlenenSiparisNo(siparis.siparisNo)
    setSiparisFormu({
      musteriUid: String(siparis.musteriUid ?? ''),
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
    const sonrakiDeger = alan === 'toplamTutar' ? negatifOlmayanSayiyaDonustur(deger) : deger
    setSiparisFormu((onceki) => ({ ...onceki, [alan]: sonrakiDeger }))
  }

  const siparisDurumFormuGuncelle = (alan, deger) => {
    setSiparisDurumFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const yeniSiparisPenceresiniAc = () => {
    setSiparisFormu({
      ...bosSiparisFormu,
      musteriUid: String(musteriSecenekleri[0]?.uid ?? ''),
      siparisTarihi: new Date().toISOString().slice(0, 10),
      teslimatSuresi: '2 iş günü',
    })
    setYeniSiparisAcik(true)
  }

  const yeniSiparisKaydet = () => {
    const musteriUid = String(siparisFormu.musteriUid ?? '').trim()
    const urun = siparisFormu.urun.trim()
    const siparisTarihi = siparisFormu.siparisTarihi
    const toplamTutar = Number(siparisFormu.toplamTutar)
    const odemeDurumu = siparisFormu.odemeDurumu.trim()
    const urunHazirlik = siparisFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisFormu.teslimatDurumu.trim()
    const teslimatSuresi = siparisFormu.teslimatSuresi.trim()
    const seciliMusteri =
      musteriler.find((kayit) => String(kayit.uid) === musteriUid) ?? null

    if (
      !musteriUid ||
      !seciliMusteri ||
      !urun ||
      !siparisTarihi ||
      !odemeDurumu ||
      !urunHazirlik ||
      !teslimatDurumu ||
      !teslimatSuresi ||
      Number.isNaN(toplamTutar)
    ) {
      toastGoster?.('hata', 'Yeni sipariş formunda eksik veya hatalı bilgi var.')
      return
    }
    if (negatifSayiVarMi(toplamTutar)) {
      toastGoster?.('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }

    const yeniSiparisData = {
      musteriUid,
      urun,
      siparisTarihi,
      toplamTutar,
      odemeDurumu,
      urunHazirlik,
      teslimatDurumu,
      teslimatSuresi,
    }

    orderApi.create(yeniSiparisData).then((sunucuVerisi) => {
      setSiparisler((onceki) => [sunucuVerisi, ...onceki])
      setYeniSiparisAcik(false)
      setSiparisSayfa(1)
      setSiparisFormu(bosSiparisFormu)
      toastGoster?.('basari', `${sunucuVerisi.siparisNo} numaralı yeni sipariş oluşturuldu.`)
    }).catch(err => {
      console.error('Sipariş eklenirken hata:', err)
      toastGoster?.('hata', 'Sipariş oluşturulurken bir hata oluştu.')
    })
  }

  const siparisDuzenlemeKaydet = () => {
    const musteriUid = String(siparisFormu.musteriUid ?? '').trim()
    const urun = siparisFormu.urun.trim()
    const siparisTarihi = siparisFormu.siparisTarihi
    const toplamTutar = Number(siparisFormu.toplamTutar)
    const odemeDurumu = siparisFormu.odemeDurumu.trim()
    const urunHazirlik = siparisFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisFormu.teslimatDurumu.trim()
    const teslimatSuresi = siparisFormu.teslimatSuresi.trim()
    const seciliMusteri =
      musteriler.find((kayit) => String(kayit.uid) === musteriUid) ?? null

    if (
      !musteriUid ||
      !seciliMusteri ||
      !urun ||
      !siparisTarihi ||
      !odemeDurumu ||
      !urunHazirlik ||
      !teslimatDurumu ||
      !teslimatSuresi ||
      Number.isNaN(toplamTutar)
    ) {
      toastGoster?.('hata', 'Sipariş düzenleme alanlarında eksik veya hatalı bilgi var.')
      return
    }
    if (negatifSayiVarMi(toplamTutar)) {
      toastGoster?.('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }

    const guncellenenSiparisData = {
      musteriUid,
      urun,
      toplamTutar,
      siparisTarihi,
      odemeDurumu,
      urunHazirlik,
      teslimatDurumu,
      teslimatSuresi,
    }

    orderApi.update(duzenlenenSiparisNo, guncellenenSiparisData).then((sunucuVerisi) => {
      setSiparisler((onceki) =>
        onceki.map((siparis) =>
          siparis.siparisNo === duzenlenenSiparisNo ? sunucuVerisi : siparis,
        ),
      )
      setDuzenlenenSiparisNo(null)
      setSiparisFormu(bosSiparisFormu)
      toastGoster?.('basari', `${seciliMusteri.ad} için sipariş kaydı güncellendi.`)
    }).catch(err => {
      console.error('Sipariş güncellenirken hata:', err)
      toastGoster?.('hata', 'Sipariş güncellenirken sunucu hatası oluştu.')
    })
  }

  const siparisDurumKaydet = () => {
    if (!durumGuncellenenSiparisNo) return
    const odemeDurumu = siparisDurumFormu.odemeDurumu.trim()
    const urunHazirlik = siparisDurumFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisDurumFormu.teslimatDurumu.trim()
    const teslimatSuresi = siparisDurumFormu.teslimatSuresi.trim()

    if (!odemeDurumu || !urunHazirlik || !teslimatDurumu || !teslimatSuresi) {
      toastGoster?.('hata', 'Durum güncelleme alanlarında boşluk bırakılamaz.')
      return
    }

    const mevcutSiparis = siparisler.find(s => s.siparisNo === durumGuncellenenSiparisNo)
    if (!mevcutSiparis) return

    const guncellenenSiparisData = {
      ...mevcutSiparis,
      odemeDurumu,
      urunHazirlik,
      teslimatDurumu,
      teslimatSuresi,
    }

    orderApi.update(durumGuncellenenSiparisNo, guncellenenSiparisData).then((sunucuVerisi) => {
      setSiparisler((onceki) =>
        onceki.map((siparis) =>
          siparis.siparisNo === durumGuncellenenSiparisNo ? sunucuVerisi : siparis,
        ),
      )
      setDurumGuncellenenSiparisNo(null)
      toastGoster?.('basari', `${durumGuncellenenSiparisNo} durumu güncellendi.`)
    }).catch(err => {
      console.error('Sipariş durumu güncellenirken hata:', err)
      toastGoster?.('hata', 'Sipariş durumu güncellenirken sunucu hatası oluştu.')
    })
  }

  const siparisSil = () => {
    if (!silinecekSiparis) return
    const silinenSiparis = { ...silinecekSiparis }
    const silinenNo = silinenSiparis.siparisNo
    const silinenIndex = siparisler.findIndex((siparis) => siparis.siparisNo === silinenNo)
    orderApi.delete(silinenNo).then(() => {
      setSiparisler((onceki) => onceki.filter((siparis) => siparis.siparisNo !== silinenNo))
      setSilinecekSiparis(null)
      toastGoster?.('basari', `${silinenNo} siparişi kalıcı olarak silindi.`)
    }).catch(err => {
      console.error('Sipariş silinirken hata:', err)
      toastGoster?.('hata', 'Sipariş silinirken sunucu hatası oluştu.')
    })
  }

  return {
    siparisler,
    siparisArama,
    setSiparisArama,
    siparisOdemeFiltresi,
    setSiparisOdemeFiltresi,
    siparisSekmesi,
    setSiparisSekmesi,
    siparisSayfa,
    setSiparisSayfa,
    gecmisSiparisArama,
    setGecmisSiparisArama,
    gecmisSiparisSayfa,
    setGecmisSiparisSayfa,
    yeniSiparisAcik,
    setYeniSiparisAcik,
    detaySiparis,
    setDetaySiparis,
    detayGecmisSiparis,
    setDetayGecmisSiparis,
    duzenlenenSiparisNo,
    setDuzenlenenSiparisNo,
    durumGuncellenenSiparisNo,
    setDurumGuncellenenSiparisNo,
    silinecekSiparis,
    setSilinecekSiparis,
    siparisFormu,
    siparisDurumFormu,
    gecmisSiparisler,
    siraliSiparisler,
    filtreliSiparisler,
    toplamSiparisSayfa,
    sayfadakiSiparisler,
    toplamGecmisSiparisSayfa,
    sayfadakiGecmisSiparisler,
    siparisAktivitesi,
    musteriSecenekleri,
    urunSecenekleri,
    siparisFormuGuncelle,
    siparisDurumFormuGuncelle,
    yeniSiparisPenceresiniAc,
    yeniSiparisKaydet,
    siparisDuzenlemeAc,
    siparisDuzenlemeKaydet,
    siparisDurumGuncellemeAc,
    siparisDurumKaydet,
    siparisSil,
    siparisMusteriAra,
    siparisMusteriAdiniGetir,
    siparisTelefonunuGetir,
    loading,
  }
}
