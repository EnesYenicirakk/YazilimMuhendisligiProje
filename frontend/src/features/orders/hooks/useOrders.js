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
  onSiparisOlusturuldu,
}) {
  const urunSeceneginiBul = (urunUid, urunAdi) => {
    if (urunUid != null && urunUid !== '') {
      const uidEslesmesi = urunler.find((urun) => String(urun.uid) === String(urunUid))
      if (uidEslesmesi) return uidEslesmesi
    }

    const normalizeAd = String(urunAdi ?? '').trim().toLocaleLowerCase('tr-TR')
    if (!normalizeAd) return null

    return (
      urunler.find((urun) => urun.ad.trim().toLocaleLowerCase('tr-TR') === normalizeAd) ??
      null
    )
  }

  const siparisMusteriAdiniGetir = (kayit) =>
    siparisIcinMusteriBul(kayit, musteriler)?.ad ?? kayit?.musteri ?? 'Bilinmiyor'

  const [siparisler, setSiparisler] = useState([])
  const [siparisArama, setSiparisArama] = useState('')
  const [siparisOdemeFiltresi, setSiparisOdemeFiltresi] = useState('Tüm Siparişler')
  const [siparisSekmesi, setSiparisSekmesi] = useState('aktif')
  const [siparisSayfa, setSiparisSayfa] = useState(1)
  const [gecmisSiparisArama, setGecmisSiparisArama] = useState('')
  const [gecmisSiparisSayfa, setGecmisSiparisSayfa] = useState(1)
  const [iptalEdilecekSiparis, setIptalEdilecekSiparis] = useState(null)
  const [iptalNotu, setIptalNotu] = useState('')
  const [iptalSiparisArama, setIptalSiparisArama] = useState('')
  const [iptalSiparisSayfa, setIptalSiparisSayfa] = useState(1)
  const [yeniSiparisAcik, setYeniSiparisAcik] = useState(false)
  const [detaySiparis, setDetaySiparis] = useState(null)
  const [detayGecmisSiparis, setDetayGecmisSiparis] = useState(null)
  const [duzenlenenSiparisNo, setDuzenlenenSiparisNo] = useState(null)
  const [durumGuncellenenSiparisNo, setDurumGuncellenenSiparisNo] = useState(null)
  const [silinecekSiparis, setSilinecekSiparis] = useState(null)
  const [siparisFormu, setSiparisFormu] = useState(bosSiparisFormu)
  const [siparisDurumFormu, setSiparisDurumFormu] = useState(BOS_DURUM_FORMU)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const urunUid = siparisFormu.urunUid
    const miktar = Number(siparisFormu.urunAdedi)
    
    if (!urunUid || !miktar || miktar < 1) return

    const seciliUrun = urunler.find(u => String(u.uid) === String(urunUid))
    if (seciliUrun) {
      const birimFiyat = Number(seciliUrun.satisFiyati || 0)
      const toplam = (birimFiyat * miktar).toFixed(2)
      
      setSiparisFormu(onceki => {
        if (onceki.toplamTutar === toplam) return onceki
        return { ...onceki, toplamTutar: toplam }
      })
    }
  }, [siparisFormu.urunUid, siparisFormu.urunAdedi, urunler])

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

  // Aktif siparişler: ödeme tamamlanmamış VEYA teslim edilmemiş (iptal edilenler hariç)
  const aktifSiparisler = useMemo(() => {
    return siraliSiparisler.filter((siparis) => {
      if (siparis.odemeDurumu === 'İptal') return false
      const odemeTamamlanmadimi = siparis.odemeDurumu !== 'Ödendi'
      const teslimatTamamlanmadimi = siparis.teslimatDurumu !== 'Teslim Edildi'
      return odemeTamamlanmadimi || teslimatTamamlanmadimi
    })
  }, [siraliSiparisler])

  // İptal edilen siparişler: odemeDurumu === 'İptal' olanlar
  const iptalEdilenSiparisler = useMemo(() =>
    siraliSiparisler
      .filter((s) => s.odemeDurumu === 'İptal')
      .map((s) => ({
        ...s,
        logNo: `IPTAL-${s.siparisNo}`,
        iptalNedeni: s.iptalNotu ?? '',
      })),
    [siraliSiparisler]
  )

  // Geçmiş siparişler: ödeme tamamlanmış VE teslim edilmiş (SiparislerPaneli formatında)
  const gecmisSiparislerHesap = useMemo(() => {
    return siraliSiparisler
      .filter((siparis) => {
        return siparis.odemeDurumu === 'Ödendi' && siparis.teslimatDurumu === 'Teslim Edildi'
      })
      .map((siparis) => ({
        // Geçmiş sipariş formatı
        logNo: `LOG-${siparis.siparisNo}`,
        siparisNo: siparis.siparisNo,
        musteri: siparis.musteri,
        musteriUid: siparis.musteriUid,
        urun: siparis.urun,
        tarih: siparis.siparisTarihi,
        miktar: siparis.urunAdedi,
        tutar: siparis.toplamTutar,
        durum: 'Teslim Edildi',
        aciklama: `Ödeme: ${siparis.odemeDurumu}, Hazırlık: ${siparis.urunHazirlik}`,
        // Orijinal veriler (gerekirse)
        odemeDurumu: siparis.odemeDurumu,
        teslimatDurumu: siparis.teslimatDurumu,
      }))
  }, [siraliSiparisler])

  const filtreliSiparisler = useMemo(() => {
    const arama = siparisArama.trim().toLowerCase()
    return aktifSiparisler.filter((siparis) => {
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
  }, [aktifSiparisler, siparisArama, siparisOdemeFiltresi, musteriler])

  const toplamSiparisSayfa = Math.max(1, Math.ceil(filtreliSiparisler.length / SIPARIS_SAYFA_BASINA))
  const sayfadakiSiparisler = useMemo(() => {
    const baslangic = (siparisSayfa - 1) * SIPARIS_SAYFA_BASINA
    return filtreliSiparisler.slice(baslangic, baslangic + SIPARIS_SAYFA_BASINA)
  }, [filtreliSiparisler, siparisSayfa])

  const filtreliGecmisSiparisler = useMemo(() => {
    const metin = gecmisSiparisArama.trim().toLowerCase()
    const siraliGecmisSiparisler = [...gecmisSiparislerHesap].sort((a, b) => new Date(b.siparisTarihi).getTime() - new Date(a.siparisTarihi).getTime())
    
    if (!metin) return siraliGecmisSiparisler

    return siraliGecmisSiparisler.filter((siparis) => {
      const musteriAdi =
        (siparisIcinMusteriBul(siparis, musteriler)?.ad ?? siparis.musteri ?? '').toLowerCase()
      return (
        siparis.siparisNo.toLowerCase().includes(metin) ||
        musteriAdi.includes(metin) ||
        siparis.urun.toLowerCase().includes(metin)
      )
    })
  }, [gecmisSiparisArama, gecmisSiparislerHesap, musteriler])

  const toplamGecmisSiparisSayfa = Math.max(1, Math.ceil(filtreliGecmisSiparisler.length / SIPARIS_SAYFA_BASINA))
  const sayfadakiGecmisSiparisler = useMemo(() => {
    const baslangic = (gecmisSiparisSayfa - 1) * SIPARIS_SAYFA_BASINA
    return filtreliGecmisSiparisler.slice(baslangic, baslangic + SIPARIS_SAYFA_BASINA)
  }, [filtreliGecmisSiparisler, gecmisSiparisSayfa])

  const siparisAktivitesi = useMemo(() => {
    const paketlenecek = aktifSiparisler.filter(
      (siparis) =>
        siparis.urunHazirlik === 'Hazırlanıyor' || siparis.urunHazirlik === 'Tedarik Bekleniyor',
    ).length
    const sevkEdilecek = aktifSiparisler.filter(
      (siparis) => siparis.teslimatDurumu === 'Hazırlanıyor',
    ).length
    const teslimEdilecek = aktifSiparisler.filter(
      (siparis) => siparis.teslimatDurumu === 'Yolda' || siparis.teslimatDurumu === 'Kargoda',
    ).length
    return { paketlenecek, sevkEdilecek, teslimEdilecek }
  }, [aktifSiparisler])

  useEffect(() => {
    if (siparisSayfa > toplamSiparisSayfa) setSiparisSayfa(toplamSiparisSayfa)
  }, [siparisSayfa, toplamSiparisSayfa])

  useEffect(() => {
    if (gecmisSiparisSayfa > toplamGecmisSiparisSayfa) setGecmisSiparisSayfa(toplamGecmisSiparisSayfa)
  }, [gecmisSiparisSayfa, toplamGecmisSiparisSayfa])

  const filtreliIptalSiparisler = useMemo(() => {
    const metin = iptalSiparisArama.trim().toLowerCase()
    if (!metin) return iptalEdilenSiparisler
    return iptalEdilenSiparisler.filter((s) =>
      s.siparisNo.toLowerCase().includes(metin) ||
      s.musteri.toLowerCase().includes(metin) ||
      s.urun.toLowerCase().includes(metin)
    )
  }, [iptalEdilenSiparisler, iptalSiparisArama])

  const toplamIptalSiparisSayfa = Math.max(1, Math.ceil(filtreliIptalSiparisler.length / SIPARIS_SAYFA_BASINA))
  const sayfadakiIptalSiparisler = useMemo(() => {
    const baslangic = (iptalSiparisSayfa - 1) * SIPARIS_SAYFA_BASINA
    return filtreliIptalSiparisler.slice(baslangic, baslangic + SIPARIS_SAYFA_BASINA)
  }, [filtreliIptalSiparisler, iptalSiparisSayfa])

  const siparisIptalAc = (siparis) => {
    setIptalEdilecekSiparis(siparis)
    setIptalNotu('')
  }

  const siparisIptalKaydet = () => {
    if (!iptalEdilecekSiparis) return
    if (!iptalNotu.trim()) {
      toastGoster?.('hata', 'İptal nedeni boş bırakılamaz.')
      return
    }
    orderApi
      .cancel(iptalEdilecekSiparis.siparisNo, { iptalNotu: iptalNotu.trim() })
      .then((sunucuVerisi) => {
        setSiparisler((onceki) =>
          onceki.map((s) =>
            s.siparisNo === iptalEdilecekSiparis.siparisNo ? sunucuVerisi : s
          )
        )
        toastGoster?.('basari', `${iptalEdilecekSiparis.siparisNo} siparişi iptal edildi.`)
        setIptalEdilecekSiparis(null)
        setIptalNotu('')
      })
      .catch((err) => {
        console.error('Sipariş iptal edilirken hata:', err)
        toastGoster?.('hata', 'Sipariş iptal edilirken sunucu hatası oluştu.')
      })
  }

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
      urunUid: String(siparis.urunUid ?? ''),
      urun: siparis.urun,
      urunAdedi: String(siparis.urunAdedi ?? 1),
      toplamTutar: String(siparis.toplamTutar),
      siparisTarihi: siparis.siparisTarihi,
      odemeDurumu: siparis.odemeDurumu,
      urunHazirlik: siparis.urunHazirlik,
      teslimatDurumu: siparis.teslimatDurumu,
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
    let sonrakiDeger = deger
    if (alan === 'toplamTutar') {
      sonrakiDeger = negatifOlmayanSayiyaDonustur(deger)
    } else if (alan === 'urunAdedi') {
      sonrakiDeger = String(deger ?? '').replace(/[^\d]/g, '')
    }

    setSiparisFormu((onceki) => ({
      ...onceki,
      [alan]: sonrakiDeger,
      ...(alan === 'urun' && deger === '' ? { urunUid: '' } : {}),
    }))
  }

  const siparisDurumFormuGuncelle = (alan, deger) => {
    setSiparisDurumFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const yeniSiparisPenceresiniAc = () => {
    setSiparisFormu({
      ...bosSiparisFormu,
      musteriUid: String(musteriSecenekleri[0]?.uid ?? ''),
      siparisTarihi: new Date().toISOString().slice(0, 10),
    })
    setYeniSiparisAcik(true)
  }

  const yeniSiparisKaydet = () => {
    const musteriUid = String(siparisFormu.musteriUid ?? '').trim()
    const urunAdedi = Number(siparisFormu.urunAdedi)
    const urun = siparisFormu.urun.trim()
    const seciliUrun = urunSeceneginiBul(siparisFormu.urunUid, urun)
    const siparisTarihi = siparisFormu.siparisTarihi
    const toplamTutar = Number(siparisFormu.toplamTutar)
    const odemeDurumu = siparisFormu.odemeDurumu.trim()
    const urunHazirlik = siparisFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisFormu.teslimatDurumu.trim()
    const seciliMusteri =
      musteriler.find((kayit) => String(kayit.uid) === musteriUid) ?? null

    if (
      !musteriUid ||
      !seciliMusteri ||
      !urun ||
      !seciliUrun ||
      !siparisTarihi ||
      !odemeDurumu ||
      !urunHazirlik ||
      !teslimatDurumu ||
      !Number.isInteger(urunAdedi) ||
      urunAdedi < 1 ||
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
      urunUid: seciliUrun.uid,
      urun: seciliUrun.ad,
      urunAdedi,
      siparisTarihi,
      toplamTutar,
      odemeDurumu,
      urunHazirlik,
      teslimatDurumu,
    }

    orderApi.create(yeniSiparisData).then((sunucuVerisi) => {
      setSiparisler((onceki) => [sunucuVerisi, ...onceki])
      onSiparisOlusturuldu?.({
        urunUid: seciliUrun.uid,
        urunAdedi,
      })
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
    const urunAdedi = Number(siparisFormu.urunAdedi)
    const urun = siparisFormu.urun.trim()
    const seciliUrun = urunSeceneginiBul(siparisFormu.urunUid, urun)
    const siparisTarihi = siparisFormu.siparisTarihi
    const toplamTutar = Number(siparisFormu.toplamTutar)
    const odemeDurumu = siparisFormu.odemeDurumu.trim()
    const urunHazirlik = siparisFormu.urunHazirlik.trim()
    const teslimatDurumu = siparisFormu.teslimatDurumu.trim()
    const seciliMusteri =
      musteriler.find((kayit) => String(kayit.uid) === musteriUid) ?? null

    if (
      !musteriUid ||
      !seciliMusteri ||
      !urun ||
      !seciliUrun ||
      !siparisTarihi ||
      !odemeDurumu ||
      !urunHazirlik ||
      !teslimatDurumu ||
      !Number.isInteger(urunAdedi) ||
      urunAdedi < 1 ||
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
      urunUid: seciliUrun.uid,
      urun: seciliUrun.ad,
      urunAdedi,
      toplamTutar,
      siparisTarihi,
      odemeDurumu,
      urunHazirlik,
      teslimatDurumu,
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

    if (!odemeDurumu || !urunHazirlik || !teslimatDurumu) {
      toastGoster?.('hata', 'Durum güncelleme alanlarında boşluk bırakılamaz.')
      return
    }

    const mevcutSiparis = siparisler.find(s => s.siparisNo === durumGuncellenenSiparisNo)
    if (!mevcutSiparis) return

    orderApi.updateStatus(durumGuncellenenSiparisNo, { odemeDurumu, urunHazirlik, teslimatDurumu }).then((sunucuVerisi) => {
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
    gecmisSiparisler: gecmisSiparislerHesap,
    iptalEdilenSiparisler,
    iptalEdilecekSiparis,
    setIptalEdilecekSiparis,
    iptalNotu,
    setIptalNotu,
    iptalSiparisArama,
    setIptalSiparisArama,
    iptalSiparisSayfa,
    setIptalSiparisSayfa,
    toplamIptalSiparisSayfa,
    sayfadakiIptalSiparisler,
    siparisIptalAc,
    siparisIptalKaydet,
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
