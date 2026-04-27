import { useEffect, useMemo, useState } from 'react'
import { customerApi } from '../../../core/services/backendApiService'
import {
  bosMusteriFormu,
  favorileriOneTasi,
  telefonGecerliMi,
} from '../../../shared/utils/constantsAndHelpers'

const MUSTERI_SAYFA_BASINA = 8

export default function useCustomers({ toastGoster }) {
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
    const musterileriYukle = async () => {
      try {
        const veriler = await customerApi.getAll()
        setMusteriler(veriler)
      } catch (error) {
        console.error('Müşteriler yüklenirken hata oluştu:', error)
        toastGoster?.('hata', 'Müşteri listesi veritabanından alınamadı.')
      }
    }
    musterileriYukle()
  }, [toastGoster])

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
    setMusteriler((onceki) =>
      onceki.map((musteri) =>
        musteri.uid === uid ? { ...musteri, favori: !musteri.favori } : musteri,
      ),
    )
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
      setMusteriler((onceki) => [
        {
          uid: Date.now(),
          ad,
          telefon,
          sonAlim,
          not,
          favori: false,
        },
        ...onceki,
      ])
      setMusteriSayfa(1)
      musteriEklemeKapat()
      toastGoster?.('basari', `${ad} müşteri listesine eklendi.`)
      return
    }

    setMusteriler((onceki) =>
      onceki.map((musteri) =>
        musteri.uid === seciliMusteriUid
          ? { ...musteri, ad, telefon, sonAlim, not }
          : musteri,
      ),
    )
    musteriDuzenlemeKapat()
    toastGoster?.('basari', `${ad} müşteri kaydı güncellendi.`)
  }

  const musteriNotKaydet = () => {
    const temizNot = musteriNotMetni.trim()
    if (!temizNot) {
      toastGoster?.('hata', 'Müşteri notu boş bırakılamaz.')
      return
    }

    const seciliMusteri = musteriler.find((musteri) => musteri.uid === seciliMusteriUid)

    setMusteriler((onceki) =>
      onceki.map((musteri) =>
        musteri.uid === seciliMusteriUid ? { ...musteri, not: temizNot } : musteri,
      ),
    )
    musteriNotKapat()
    toastGoster?.('basari', `${seciliMusteri?.ad ?? 'Müşteri'} notu kaydedildi.`)
  }

  const musteriSil = () => {
    if (!silinecekMusteri) return

    const silinenMusteri = { ...silinecekMusteri }
    const silinenAd = silinenMusteri.ad
    const silinenIndex = musteriler.findIndex((musteri) => musteri.uid === silinenMusteri.uid)

    setMusteriler((onceki) => onceki.filter((musteri) => musteri.uid !== silinenMusteri.uid))
    musteriSilmeKapat()
    toastGoster?.('basari', `${silinenAd} müşteri listesinden silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setMusteriler((onceki) => {
          if (onceki.some((musteri) => musteri.uid === silinenMusteri.uid)) {
            return onceki
          }
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenMusteri)
          return yeni
        })
        toastGoster?.('basari', `${silinenAd} geri alındı.`)
      },
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
  }
}
