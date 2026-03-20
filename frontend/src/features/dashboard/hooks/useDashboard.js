import { useMemo, useState } from 'react'
import {
  dashboardBolumSablonu,
  dashboardOzetSablon,
  kritikStoktaMi,
  paraFormatla,
  teslimatGununuCoz,
} from '../../../shared/utils/constantsAndHelpers'

export default function useDashboard({ siparisler, siraliSiparisler, urunler, aySonuKari, toastGoster }) {
  const [gizlenenOzetKartlari, setGizlenenOzetKartlari] = useState([])
  const [acikOzetMenusu, setAcikOzetMenusu] = useState('')
  const [dashboardBolumMenusuAcik, setDashboardBolumMenusuAcik] = useState(false)
  const [gorunenDashboardBolumleri, setGorunenDashboardBolumleri] = useState(
    dashboardBolumSablonu.reduce((acc, bolum) => ({ ...acc, [bolum.anahtar]: true }), {}),
  )

  const dashboardYakinSatislar = useMemo(
    () =>
      siraliSiparisler.slice(0, 4).map((siparis) => ({
        siparis: siparis.siparisNo,
        urun: siparis.urun,
        musteri: siparis.musteri,
        teslimat: siparis.teslimatSuresi,
        tutar: paraFormatla(siparis.toplamTutar),
        durum: siparis.teslimatDurumu,
      })),
    [siraliSiparisler],
  )

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

  const dashboardOzet = useMemo(
    () => [
      { baslik: 'Toplam Gelir', deger: paraFormatla(aySonuKari), degisim: '+%14', ikon: 'cuzdan' },
      ...dashboardOzetSablon,
    ].filter((kart) => !gizlenenOzetKartlari.includes(kart.baslik)),
    [aySonuKari, gizlenenOzetKartlari],
  )

  const haftalikSatisVerisi = useMemo(() => {
    const formatYmd = (tarih) => {
      const yil = tarih.getFullYear()
      const ay = String(tarih.getMonth() + 1).padStart(2, '0')
      const gun = String(tarih.getDate()).padStart(2, '0')
      return `${yil}-${ay}-${gun}`
    }

    const tumTarihler = siparisler.map((siparis) => new Date(`${siparis.siparisTarihi}T00:00:00`))
    const enGuncel = new Date(Math.max(...tumTarihler.map((tarih) => tarih.getTime())))
    const siparisToplamlari = new Map()

    siparisler.forEach((siparis) => {
      siparisToplamlari.set(siparis.siparisTarihi, (siparisToplamlari.get(siparis.siparisTarihi) || 0) + siparis.toplamTutar)
    })

    const gunler = Array.from({ length: 7 }, (_, index) => {
      const tarih = new Date(enGuncel)
      tarih.setDate(enGuncel.getDate() - 6 + index)
      const ymd = formatYmd(tarih)
      const toplam = siparisToplamlari.get(ymd) || 0
      const etiket = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(tarih).replace('.', '')
      return { etiket, toplam }
    })

    const enYuksek = Math.max(...gunler.map((gun) => gun.toplam), 1)
    return gunler.map((gun) => {
      const oran = Math.max((gun.toplam / enYuksek) * 100, gun.toplam > 0 ? 16 : 8)
      const ustOran = gun.toplam > 0 ? Math.max(oran * 0.28, 8) : 4
      const altOran = Math.max(oran - ustOran, 6)
      return { ...gun, altOran, ustOran }
    })
  }, [siparisler])

  const haftalikSatisGrafikUstSinir = useMemo(() => {
    const enYuksek = Math.max(...haftalikSatisVerisi.map((veri) => veri.toplam), 0)
    return Math.max(Math.ceil(enYuksek / 10000) * 10000, 40000)
  }, [haftalikSatisVerisi])

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
    dashboardBolumGorunurlukDegistir,
    dashboardBolumMenusuAcik,
    dashboardCanliOzetler,
    dashboardOzet,
    dashboardYakinSatislar,
    gorunenDashboardBolumleri,
    haftalikSatisGrafikUstSinir,
    haftalikSatisVerisi,
    ozetKartiniSil,
    setAcikOzetMenusu,
    setDashboardBolumMenusuAcik,
  }
}
