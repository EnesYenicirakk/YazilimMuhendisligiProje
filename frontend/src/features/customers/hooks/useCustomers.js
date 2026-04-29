import { useEffect, useMemo, useState } from 'react'
import { customerApi } from '../../../core/services/backendApiService'
import {
  bosMusteriFormu,
  favorileriOneTasi,
  telefonGecerliMi,
} from '../../../shared/utils/constantsAndHelpers'

const MUSTERI_SAYFA_BASINA = 8

export default function useCustomers({ toastGoster, isLoggedIn }) {
  const [musteriler, setMusteriler] = useState([])
  const [musteriArama, setMusteriArama] = useState('')
  const [musteriSayfa, setMusteriSayfa] = useState(1)
  const [musteriEklemeAcik, setMusteriEklemeAcik] = useState(false)
  const [musteriDuzenlemeAcik, setMusteriDuzenlemeAcik] = useState(false)
  const [musteriNotAcik, setMusteriNotAcik] = useState(false)
  const [seciliMusteriUid, setSeciliMusteriUid] = useState(null)
  const [musteriFormu, setMusteriFormu] = useState(bosMusteriFormu)
  const [musteriNotMetni, setMusteriNotMetni] = useState('')
  const [silinecekMusteri, setSilinecekMusteri] = useState(null)
  const [loading, setLoading] = useState(true)

  const filtreliMusteriler = useMemo(() => {
    const metin = musteriArama.trim().toLowerCase()
    const sonuc = !metin
      ? musteriler
      : musteriler.filter(
          (musteri) =>
            musteri.ad.toLowerCase().includes(metin) ||
            musteri.telefon.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(
      sonuc,
      (musteri) => new Date(`${musteri.sonAlim}T00:00:00`).getTime(),
    )
  }, [musteriArama, musteriler])

  const toplamMusteriSayfa = Math.max(1, Math.ceil(filtreliMusteriler.length / MUSTERI_SAYFA_BASINA))
  const musteriBaslangic = (musteriSayfa - 1) * MUSTERI_SAYFA_BASINA
  const sayfadakiMusteriler = filtreliMusteriler.slice(musteriBaslangic, musteriBaslangic + MUSTERI_SAYFA_BASINA)

  useEffect(() => {
    if (!isLoggedIn) return

    const musterileriYukle = async () => {
      setLoading(true)
      try {
        const veriler = await customerApi.getAll()
        setMusteriler(veriler)
      } catch (error) {
        console.error('Müşteriler yüklenirken hata oluştu:', error)
        toastGoster?.('hata', 'Müşteri listesi veritabanından alınamadı.')
      } finally {
        setLoading(false)
      }
    }
    musterileriYukle()
  }, [toastGoster, isLoggedIn])

  useEffect(() => {
    if (musteriSayfa > toplamMusteriSayfa) {
      setMusteriSayfa(toplamMusteriSayfa)
    }
  }, [musteriSayfa, toplamMusteriSayfa])

  const musteriFormuTemizle = () => {
    setSeciliMusteriUid(null)
    setMusteriFormu(bosMusteriFormu)
    setMusteriNotMetni('')
  }

  const musteriEklemeKapat = () => {
    setMusteriEklemeAcik(false)
    musteriFormuTemizle()
  }

  const musteriDuzenlemeKapat = () => {
    setMusteriDuzenlemeAcik(false)
    musteriFormuTemizle()
  }

  const musteriNotKapat = () => {
    setMusteriNotAcik(false)
    setSeciliMusteriUid(null)
    setMusteriNotMetni('')
  }

  const musteriSilmeKapat = () => {
    setSilinecekMusteri(null)
  }

  const musteriModallariniKapat = () => {
    musteriEklemeKapat()
    musteriDuzenlemeKapat()
    musteriNotKapat()
    musteriSilmeKapat()
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
    const musteri = musteriler.find((m) => m.uid === uid)
    if (!musteri) return

    const guncellenenMusteriData = {
      ...musteri,
      favori: !musteri.favori,
    }

    customerApi.update(uid, guncellenenMusteriData).then((sunucuVerisi) => {
      setMusteriler((onceki) =>
        onceki.map((m) => (m.uid === uid ? sunucuVerisi : m)),
      )
    }).catch(err => {
      console.error('Müşteri favori durumu güncellenirken hata:', err)
      toastGoster?.('hata', 'Favori durumu güncellenirken hata oluştu.')
    })
  }

  const musteriKaydet = (mod) => {
    const ad = musteriFormu.ad.trim()
    const telefon = musteriFormu.telefon.trim()
    const sonAlim = musteriFormu.sonAlim
    const not = musteriFormu.not.trim()

    if (!ad || !telefon || !sonAlim || !not) {
      toastGoster?.('hata', 'Müşteri formunda eksik veya hatalı alan var.')
      return
    }

    if (!telefonGecerliMi(telefon)) {
      toastGoster?.('hata', 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalı.')
      return
    }

    if (mod === 'ekle') {
      const yeniMusteriData = { ad, telefon, sonAlim, not }
      customerApi.create(yeniMusteriData).then((sunucuVerisi) => {
        setMusteriler((onceki) => [sunucuVerisi, ...onceki])
        setMusteriSayfa(1)
        musteriEklemeKapat()
        toastGoster?.('basari', `${ad} müşteri listesine eklendi.`)
      }).catch(err => {
        console.error('Müşteri eklenirken hata:', err)
        toastGoster?.('hata', 'Müşteri eklenirken bir hata oluştu.')
      })
      return
    }

    const guncellenenMusteriData = { ad, telefon, sonAlim, not }
    customerApi.update(seciliMusteriUid, guncellenenMusteriData).then((sunucuVerisi) => {
      setMusteriler((onceki) =>
        onceki.map((m) => (m.uid === seciliMusteriUid ? sunucuVerisi : m)),
      )
      musteriDuzenlemeKapat()
      toastGoster?.('basari', `${ad} müşteri kaydı güncellendi.`)
    }).catch(err => {
      console.error('Müşteri güncellenirken hata:', err)
      toastGoster?.('hata', 'Müşteri güncellenirken bir hata oluştu.')
    })
  }

  const musteriNotKaydet = () => {
    const temizNot = musteriNotMetni.trim()
    if (!temizNot) {
      toastGoster?.('hata', 'Müşteri notu boş bırakılamaz.')
      return
    }

    const seciliMusteri = musteriler.find((musteri) => musteri.uid === seciliMusteriUid)
    if (!seciliMusteri) return

    const guncellenenMusteriData = {
      ...seciliMusteri,
      not: temizNot,
    }

    customerApi.update(seciliMusteriUid, guncellenenMusteriData).then((sunucuVerisi) => {
      setMusteriler((onceki) =>
        onceki.map((m) => (m.uid === seciliMusteriUid ? sunucuVerisi : m)),
      )
      musteriNotKapat()
      toastGoster?.('basari', `${seciliMusteri.ad} notu kaydedildi.`)
    }).catch(err => {
      console.error('Müşteri notu güncellenirken hata:', err)
      toastGoster?.('hata', 'Not kaydedilirken sunucu hatası oluştu.')
    })
  }

  const musteriSil = () => {
    const silinenMusteri = { ...silinecekMusteri }
    const silinenAd = silinenMusteri.ad

    customerApi.delete(silinenMusteri.uid).then(() => {
      setMusteriler((onceki) => onceki.filter((m) => m.uid !== silinenMusteri.uid))
      musteriSilmeKapat()
      toastGoster?.('basari', `${silinenAd} müşteri listesinden silindi.`)
    }).catch(err => {
      console.error('Müşteri silinirken hata:', err)
      toastGoster?.('hata', 'Müşteri silinirken bir hata oluştu.')
    })
  }

  const musteriSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamMusteriSayfa) return
    setMusteriSayfa(sayfa)
  }

  return {
    musteriler,
    musteriArama,
    setMusteriArama,
    musteriSayfa,
    setMusteriSayfa,
    musteriEklemeAcik,
    setMusteriEklemeAcik,
    musteriDuzenlemeAcik,
    setMusteriDuzenlemeAcik,
    musteriNotAcik,
    setMusteriNotAcik,
    seciliMusteriUid,
    setSeciliMusteriUid,
    musteriFormu,
    musteriNotMetni,
    setMusteriNotMetni,
    silinecekMusteri,
    setSilinecekMusteri,
    filtreliMusteriler,
    toplamMusteriSayfa,
    musteriBaslangic,
    sayfadakiMusteriler,
    musteriFormuTemizle,
    musteriEklemeKapat,
    musteriDuzenlemeKapat,
    musteriNotKapat,
    musteriSilmeKapat,
    musteriModallariniKapat,
    musteriEklemeAc,
    musteriDuzenlemeAc,
    musteriNotAc,
    musteriFormuGuncelle,
    musteriFavoriDegistir,
    musteriKaydet,
    musteriNotKaydet,
    musteriSil,
    musteriSayfayaGit,
    loading,
  }
}
