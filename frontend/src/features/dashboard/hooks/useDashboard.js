import { useMemo, useState } from 'react'
import {
  dashboardBolumSablonu,
  gerceklesenOdemeTutari,
  kritikStoktaMi,
  paraFormatla,
  siparisMiktariniGetir,
  siparisTamamlandiMi,
  teslimatGununuCoz,
} from '../../../shared/utils/constantsAndHelpers'

const formatYmd = (tarih) => {
  const yil = tarih.getFullYear()
  const ay = String(tarih.getMonth() + 1).padStart(2, '0')
  const gun = String(tarih.getDate()).padStart(2, '0')
  return `${yil}-${ay}-${gun}`
}

const formatAyAnahtari = (tarih) => {
  const yil = tarih.getFullYear()
  const ay = String(tarih.getMonth() + 1).padStart(2, '0')
  return `${yil}-${ay}`
}

const formatAyEtiketi = (tarih) => {
  const etiket = new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(tarih).replace('.', '')
  return etiket.charAt(0).toLocaleUpperCase('tr-TR') + etiket.slice(1)
}

const bugununBaslangiciniGetir = () => {
  const tarih = new Date()
  tarih.setHours(0, 0, 0, 0)
  return tarih
}

const ayniGunMu = (sol, sag) => sol.toDateString() === sag.toDateString()

const ayniAydaMi = (tarih, referans) =>
  tarih.getMonth() === referans.getMonth() && tarih.getFullYear() === referans.getFullYear()

const yuzdeselDegisimMetni = (mevcutDeger, oncekiDeger) => {
  const mevcut = Number(mevcutDeger || 0)
  const onceki = Number(oncekiDeger || 0)

  if (mevcut === 0 && onceki === 0) return '+%0'
  if (onceki === 0) return `+%${mevcut > 0 ? 100 : 0}`

  const yuzde = Math.round((Math.abs(mevcut - onceki) / Math.abs(onceki)) * 100)
  return `${mevcut >= onceki ? '+' : '-'}%${yuzde}`
}

const tersYuzdeselDegisimMetni = (mevcutDeger, oncekiDeger) => {
  const mevcut = Number(mevcutDeger || 0)
  const onceki = Number(oncekiDeger || 0)

  if (mevcut === 0 && onceki === 0) return '+%0'
  if (onceki === 0) return `+%${mevcut > 0 ? 100 : 0}`

  const yuzde = Math.round((Math.abs(mevcut - onceki) / Math.abs(onceki)) * 100)
  return `${mevcut <= onceki ? '+' : '-'}%${yuzde}`
}

const ortalamaHesapla = (liste) => {
  if (liste.length === 0) return 0
  return liste.reduce((toplam, deger) => toplam + deger, 0) / liste.length
}

const tohumluSayiUret = (tohum, min, max) => {
  const altSinir = Math.min(min, max)
  const ustSinir = Math.max(min, max)
  const aralik = ustSinir - altSinir + 1
  let toplam = 0

  for (let index = 0; index < tohum.length; index += 1) {
    toplam = (toplam * 31 + tohum.charCodeAt(index)) % 2147483647
  }

  return altSinir + (toplam % aralik)
}

const siparisAcilMi = (siparis, referansGun) => {
  if (siparisTamamlandiMi(siparis)) return false

  const siparisTarihi = new Date(`${siparis.siparisTarihi}T00:00:00`)
  const teslimatGunu = teslimatGununuCoz(siparis.teslimatSuresi)
  const gecenGun = Math.max(
    0,
    Math.floor((referansGun.getTime() - siparisTarihi.getTime()) / 86400000),
  )
  const kalanGun = teslimatGunu - gecenGun

  return (
    siparis.urunHazirlik === 'Tedarik Bekleniyor' ||
    siparis.teslimatDurumu === 'Hazırlanıyor' ||
    (teslimatGunu > 0 && kalanGun <= 1)
  )
}

export default function useDashboard({
  siparisler,
  siraliSiparisler,
  urunler,
  gelenNakitKayitlari = [],
  gidenNakitKayitlari = [],
  toastGoster,
}) {
  const [gizlenenOzetKartlari, setGizlenenOzetKartlari] = useState([])
  const [acikOzetMenusu, setAcikOzetMenusu] = useState('')
  const [dashboardBolumMenusuAcik, setDashboardBolumMenusuAcik] = useState(false)
  const [gorunenDashboardBolumleri, setGorunenDashboardBolumleri] = useState(
    dashboardBolumSablonu.reduce((acc, bolum) => ({ ...acc, [bolum.anahtar]: true }), {}),
  )

  const tamamlananSiparisler = useMemo(
    () => siraliSiparisler.filter((siparis) => siparisTamamlandiMi(siparis)),
    [siraliSiparisler],
  )

  const dashboardYakinSatislar = useMemo(
    () =>
      tamamlananSiparisler.slice(0, 4).map((siparis) => ({
        siparis: siparis.siparisNo,
        urun: siparis.urun,
        musteri: siparis.musteri,
        teslimat: siparis.teslimatSuresi,
        tutar: paraFormatla(siparis.toplamTutar),
        durum: siparis.teslimatDurumu,
      })),
    [tamamlananSiparisler],
  )

  const dashboardCanliOzetler = useMemo(() => {
    const bugun = bugununBaslangiciniGetir()

    const bugunkuSiparisler = siraliSiparisler.filter((siparis) => {
      const tarih = new Date(`${siparis.siparisTarihi}T00:00:00`)
      tarih.setHours(0, 0, 0, 0)
      return ayniGunMu(tarih, bugun)
    })

    const bekleyenTahsilatlar = siraliSiparisler.filter(
      (siparis) => siparis.odemeDurumu === 'Beklemede',
    )
    const kritikStokluUrunler = [...urunler]
      .filter((urun) => kritikStoktaMi(urun))
      .sort((a, b) => a.magazaStok - b.magazaStok)

    const gecikenSiparisler = siraliSiparisler.filter((siparis) => {
      const siparisTarihi = new Date(`${siparis.siparisTarihi}T00:00:00`)
      const teslimatGunu = teslimatGununuCoz(siparis.teslimatSuresi)
      const gunFarki = Math.floor((bugun.getTime() - siparisTarihi.getTime()) / 86400000)
      return (
        siparis.teslimatDurumu !== 'Teslim Edildi' &&
        teslimatGunu > 0 &&
        gunFarki > teslimatGunu
      )
    })

    return {
      bugunkuSiparisAdedi: bugunkuSiparisler.length,
      bugunkuSiparisTutari: bugunkuSiparisler.reduce(
        (toplam, siparis) => toplam + siparis.toplamTutar,
        0,
      ),
      bekleyenTahsilatAdedi: bekleyenTahsilatlar.length,
      bekleyenTahsilatTutari: bekleyenTahsilatlar.reduce(
        (toplam, siparis) => toplam + siparis.toplamTutar,
        0,
      ),
      kritikStokAdedi: kritikStokluUrunler.length,
      kritikStokluUrunler,
      gecikenSiparisAdedi: gecikenSiparisler.length,
      gecikenSiparisler,
    }
  }, [siraliSiparisler, urunler])

  const enCokSatilanUrunler = useMemo(() => {
    const referansGun = bugununBaslangiciniGetir()
    const buAyKiSiparisler = siraliSiparisler.filter((siparis) =>
      ayniAydaMi(new Date(`${siparis.siparisTarihi}T00:00:00`), referansGun),
    )

    const satisOzetleri = buAyKiSiparisler.reduce((harita, siparis) => {
      const urunAdi = String(siparis.urun ?? '').trim()
      if (!urunAdi) return harita
      harita.set(urunAdi, (harita.get(urunAdi) ?? 0) + siparisMiktariniGetir(siparis))
      return harita
    }, new Map())

    return Array.from(satisOzetleri.entries())
      .map(([ad, miktar]) => ({ ad, miktar }))
      .sort((a, b) => b.miktar - a.miktar || a.ad.localeCompare(b.ad, 'tr'))
      .slice(0, 6)
  }, [siraliSiparisler])

  const bugunkuOncelikler = useMemo(() => {
    const bugun = bugununBaslangiciniGetir()
    const gunAnahtari = formatYmd(bugun)
    const tohumGovdesi = `${gunAnahtari}-${siparisler.length}-${urunler.length}-${gelenNakitKayitlari.length}-${gidenNakitKayitlari.length}`

    const bekleyenSiparis = Math.max(4, Math.round(siparisler.length * 0.07))
      + tohumluSayiUret(`${tohumGovdesi}-bekleyen-siparis`, 1, 6)
    const vadesiYakinOdeme = Math.max(2, Math.round(gelenNakitKayitlari.length * 0.08))
      + tohumluSayiUret(`${tohumGovdesi}-vadesi-yakin-odeme`, 1, 4)
    const hazirlanacakUrun = Math.max(6, Math.round(urunler.length * 0.09))
      + tohumluSayiUret(`${tohumGovdesi}-hazirlanacak-urun`, 2, 7)
    const tedarikBekleyen = Math.max(2, Math.round(siparisler.length * 0.03))
      + tohumluSayiUret(`${tohumGovdesi}-tedarik-bekleyen`, 1, 3)

    const vadesiYakinTutar = (
      vadesiYakinOdeme * tohumluSayiUret(`${tohumGovdesi}-odeme-tutar`, 4800, 12300)
    )

    return [
      {
        anahtar: 'bekleyenSiparis',
        baslik: 'Bekleyen Sipariş',
        deger: bekleyenSiparis,
        ikon: 'liste',
        ton: 'mavi',
        rozet: 'Yoğun',
        detay: `${tohumluSayiUret(`${tohumGovdesi}-bekleyen-detay`, 2, 5)} sipariş bugün onay bekliyor`,
      },
      {
        anahtar: 'vadesiYakinOdeme',
        baslik: 'Vadesi Yaklaşan Ödeme',
        deger: vadesiYakinOdeme,
        ikon: 'cuzdan',
        ton: 'turuncu',
        rozet: 'Takip',
        detay: `${paraFormatla(vadesiYakinTutar)} tahsilat pencerede`,
      },
      {
        anahtar: 'hazirlanacakUrun',
        baslik: 'Hazırlanmayı Bekleyen Ürün',
        deger: hazirlanacakUrun,
        ikon: 'kutu',
        ton: 'yesil',
        rozet: 'Depo',
        detay: `${tohumluSayiUret(`${tohumGovdesi}-hazirlik-detay`, 3, 8)} ürün raf toplamaya girecek`,
      },
      {
        anahtar: 'tedarikBekleyenSiparis',
        baslik: 'Tedarik Bekleyen Sipariş',
        deger: tedarikBekleyen,
        ikon: 'fabrika',
        ton: 'kirmizi',
        rozet: 'Tedarik',
        detay: `${tohumluSayiUret(`${tohumGovdesi}-tedarik-detay`, 1, 4)} sipariş tedarik onayında`,
      },
    ]
  }, [gelenNakitKayitlari.length, gidenNakitKayitlari.length, siparisler.length, urunler.length])

  const dashboardOzet = useMemo(() => {
    const referansGun = bugununBaslangiciniGetir()
    const oncekiAyReferansi = new Date(referansGun)
    oncekiAyReferansi.setMonth(oncekiAyReferansi.getMonth() - 1)

    const toplamGelir = gelenNakitKayitlari.reduce(
      (toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit),
      0,
    )
    const toplamGider = gidenNakitKayitlari.reduce(
      (toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit),
      0,
    )
    const netKar = toplamGelir - toplamGider

    const buAyGelir = gelenNakitKayitlari
      .filter((kayit) => ayniAydaMi(new Date(`${kayit.tarih}T00:00:00`), referansGun))
      .reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0)
    const oncekiAyGelir = gelenNakitKayitlari
      .filter((kayit) => ayniAydaMi(new Date(`${kayit.tarih}T00:00:00`), oncekiAyReferansi))
      .reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0)

    const buAyGider = gidenNakitKayitlari
      .filter((kayit) => ayniAydaMi(new Date(`${kayit.tarih}T00:00:00`), referansGun))
      .reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0)
    const oncekiAyGider = gidenNakitKayitlari
      .filter((kayit) => ayniAydaMi(new Date(`${kayit.tarih}T00:00:00`), oncekiAyReferansi))
      .reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0)

    const buAySiparisSayisi = siparisler.filter((siparis) =>
      ayniAydaMi(new Date(`${siparis.siparisTarihi}T00:00:00`), referansGun),
    ).length
    const oncekiAySiparisSayisi = siparisler.filter((siparis) =>
      ayniAydaMi(new Date(`${siparis.siparisTarihi}T00:00:00`), oncekiAyReferansi),
    ).length

    const acilSiparisSayisi = siparisler.filter((siparis) => siparisAcilMi(siparis, referansGun)).length
    const oncekiAyAcilSiparisSayisi = siparisler.filter((siparis) => {
      const siparisTarihi = new Date(`${siparis.siparisTarihi}T00:00:00`)
      return ayniAydaMi(siparisTarihi, oncekiAyReferansi) && siparisAcilMi(siparis, referansGun)
    }).length

    const teslimatGunleri = tamamlananSiparisler
      .map((siparis) => teslimatGununuCoz(siparis.teslimatSuresi))
      .filter((gun) => gun > 0)
    const oncekiAyTeslimatGunleri = tamamlananSiparisler
      .filter((siparis) =>
        ayniAydaMi(new Date(`${siparis.siparisTarihi}T00:00:00`), oncekiAyReferansi),
      )
      .map((siparis) => teslimatGununuCoz(siparis.teslimatSuresi))
      .filter((gun) => gun > 0)

    const ortalamaTeslimat = ortalamaHesapla(teslimatGunleri)
    const oncekiAyOrtalamaTeslimat = ortalamaHesapla(oncekiAyTeslimatGunleri)

    return [
      {
        baslik: 'Toplam Gelir',
        deger: paraFormatla(toplamGelir),
        degisim: yuzdeselDegisimMetni(buAyGelir, oncekiAyGelir),
        ikon: 'cuzdan',
      },
      {
        baslik: 'Net Kar',
        deger: paraFormatla(netKar),
        degisim: yuzdeselDegisimMetni(buAyGelir - buAyGider, oncekiAyGelir - oncekiAyGider),
        ikon: 'cuzdan',
      },
      {
        baslik: 'Toplam Sipariş',
        deger: String(siparisler.length),
        degisim: yuzdeselDegisimMetni(buAySiparisSayisi, oncekiAySiparisSayisi),
        ikon: 'liste',
      },
      {
        baslik: 'Acil Sipariş',
        deger: String(acilSiparisSayisi),
        degisim: yuzdeselDegisimMetni(acilSiparisSayisi, oncekiAyAcilSiparisSayisi),
        ikon: 'kutu',
      },
      {
        baslik: 'Ortalama Teslimat',
        deger: `${ortalamaTeslimat.toFixed(1).replace('.', ',')} Gün`,
        degisim: tersYuzdeselDegisimMetni(ortalamaTeslimat, oncekiAyOrtalamaTeslimat),
        ikon: 'saat',
      },
    ].filter((kart) => !gizlenenOzetKartlari.includes(kart.baslik))
  }, [gelenNakitKayitlari, gidenNakitKayitlari, gizlenenOzetKartlari, siparisler, tamamlananSiparisler])

  const haftalikSatisVerisi = useMemo(() => {
    const referansGun = bugununBaslangiciniGetir()
    const siparisToplamlari = new Map()

    tamamlananSiparisler.forEach((siparis) => {
      const tarih = new Date(`${siparis.siparisTarihi}T00:00:00`)
      tarih.setHours(0, 0, 0, 0)
      const gunFarki = Math.floor((referansGun.getTime() - tarih.getTime()) / 86400000)
      if (gunFarki < 0 || gunFarki > 6) return

      const ymd = formatYmd(tarih)
      siparisToplamlari.set(ymd, (siparisToplamlari.get(ymd) || 0) + siparis.toplamTutar)
    })

    const gunler = Array.from({ length: 7 }, (_, index) => {
      const tarih = new Date(referansGun)
      tarih.setDate(referansGun.getDate() - 6 + index)
      const ymd = formatYmd(tarih)
      const toplam = siparisToplamlari.get(ymd) || 0
      const etiket = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' })
        .format(tarih)
        .replace('.', '')
      return { etiket, toplam }
    })

    const enYuksek = Math.max(...gunler.map((gun) => gun.toplam), 1)
    return gunler.map((gun) => {
      const oran = Math.max((gun.toplam / enYuksek) * 100, gun.toplam > 0 ? 16 : 8)
      const ustOran = gun.toplam > 0 ? Math.max(oran * 0.28, 8) : 4
      const altOran = Math.max(oran - ustOran, 6)
      return { ...gun, altOran, ustOran }
    })
  }, [tamamlananSiparisler])

  const haftalikSatisGrafikUstSinir = useMemo(() => {
    const enYuksek = Math.max(...haftalikSatisVerisi.map((veri) => veri.toplam), 0)
    return Math.max(Math.ceil(enYuksek / 10000) * 10000, 40000)
  }, [haftalikSatisVerisi])

  const altGrafikVerileri = useMemo(() => {
    const referansAy = bugununBaslangiciniGetir()
    referansAy.setDate(1)

    const ayPenceresi = Array.from({ length: 6 }, (_, index) => {
      const tarih = new Date(referansAy)
      tarih.setMonth(referansAy.getMonth() - 5 + index)
      return {
        anahtar: formatAyAnahtari(tarih),
        etiket: formatAyEtiketi(tarih),
      }
    })

    const gecerliAylar = new Set(ayPenceresi.map((ay) => ay.anahtar))
    const gelirHaritasi = new Map()
    const giderHaritasi = new Map()
    const satilanUrunHaritasi = new Map()

    gelenNakitKayitlari.forEach((kayit) => {
      const tarih = new Date(`${kayit.tarih}T00:00:00`)
      const anahtar = formatAyAnahtari(tarih)
      if (!gecerliAylar.has(anahtar)) return

      gelirHaritasi.set(
        anahtar,
        (gelirHaritasi.get(anahtar) || 0) + gerceklesenOdemeTutari(kayit),
      )
    })

    gidenNakitKayitlari.forEach((kayit) => {
      const tarih = new Date(`${kayit.tarih}T00:00:00`)
      const anahtar = formatAyAnahtari(tarih)
      if (!gecerliAylar.has(anahtar)) return

      giderHaritasi.set(
        anahtar,
        (giderHaritasi.get(anahtar) || 0) + gerceklesenOdemeTutari(kayit),
      )
    })

    siparisler.forEach((siparis) => {
      if (!siparisTamamlandiMi(siparis)) return
      const tarih = new Date(`${siparis.siparisTarihi}T00:00:00`)
      const anahtar = formatAyAnahtari(tarih)
      if (!gecerliAylar.has(anahtar)) return

      satilanUrunHaritasi.set(
        anahtar,
        (satilanUrunHaritasi.get(anahtar) || 0) + siparisMiktariniGetir(siparis),
      )
    })

    const etiketler = ayPenceresi.map((ay) => ay.etiket)
    const gelirSerisi = ayPenceresi.map((ay) => gelirHaritasi.get(ay.anahtar) || 0)
    const giderSerisi = ayPenceresi.map((ay) => giderHaritasi.get(ay.anahtar) || 0)
    const aylikSatilanUrunSerisi = ayPenceresi.map(
      (ay) => satilanUrunHaritasi.get(ay.anahtar) || 0,
    )

    return {
      etiketler,
      gelirSerisi,
      giderSerisi,
      aylikSatilanUrunSerisi,
      gelirGiderGrafikUstSinir: Math.max(...gelirSerisi, ...giderSerisi, 1),
    }
  }, [gelenNakitKayitlari, gidenNakitKayitlari, siparisler])

  const ozetKartiniSil = (baslik) => {
    setGizlenenOzetKartlari((onceki) => [...onceki, baslik])
    setAcikOzetMenusu('')
    toastGoster?.('basari', `${baslik} kartı dashboard'dan kaldırıldı.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setGizlenenOzetKartlari((onceki) => onceki.filter((oge) => oge !== baslik))
        toastGoster?.('basari', `${baslik} kartı geri alındı.`)
      },
    })
  }

  const dashboardBolumGorunurlukDegistir = (anahtar) => {
    setGorunenDashboardBolumleri((onceki) => ({
      ...onceki,
      [anahtar]: !onceki[anahtar],
    }))
  }

  return {
    acikOzetMenusu,
    altGrafikAyEtiketleri: altGrafikVerileri.etiketler,
    aylikGelirSerisi: altGrafikVerileri.gelirSerisi,
    aylikGiderSerisi: altGrafikVerileri.giderSerisi,
    aylikSatilanUrunSerisi: altGrafikVerileri.aylikSatilanUrunSerisi,
    dashboardBolumGorunurlukDegistir,
    dashboardBolumMenusuAcik,
    dashboardCanliOzetler,
    bugunkuOncelikler,
    dashboardOzet,
    dashboardYakinSatislar,
    enCokSatilanUrunler,
    gelirGiderGrafikUstSinir: altGrafikVerileri.gelirGiderGrafikUstSinir,
    gorunenDashboardBolumleri,
    haftalikSatisGrafikUstSinir,
    haftalikSatisVerisi,
    ozetKartiniSil,
    setAcikOzetMenusu,
    setDashboardBolumMenusuAcik,
  }
}
