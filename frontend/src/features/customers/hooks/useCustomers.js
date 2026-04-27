import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../../core/api/apiClient'
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

  // Backend'den müşterileri yükle
  const musterileriFetchle = useCallback(async () => {
    try {
      const data = await api.get('/customers')
      const liste = (data?.data ?? data ?? []).map((m) => ({
        uid: m.uid,
        ad: m.ad,
        telefon: m.telefon ?? '',
        email: m.email ?? '',
        adres: m.adres ?? '',
        vergiNumarasi: m.vergiNumarasi ?? '',
        sonAlim: m.sonAlimTarihi ?? '',
        not: m.not ?? '',
        favori: false,
      }))
      setMusteriler(liste)
    } catch {
      toastGoster?.('hata', 'Müşteriler yüklenirken hata oluştu.')
    }
  }, [toastGoster])

  useEffect(() => {
    if (isLoggedIn) musterileriFetchle()
  }, [isLoggedIn, musterileriFetchle])

  const filtreliMusteriler = useMemo(() => {
    const metin = musteriArama.trim().toLowerCase()
    const sonuc = !metin
      ? musteriler
      : musteriler.filter(
          (musteri) =>
            musteri.ad.toLowerCase().includes(metin) ||
            (musteri.telefon ?? '').toLowerCase().includes(metin),
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
    if (musteriSayfa > toplamMusteriSayfa) setMusteriSayfa(toplamMusteriSayfa)
  }, [musteriSayfa, toplamMusteriSayfa])

  const musteriFormuTemizle = () => {
    setSeciliMusteriUid(null)
    setMusteriFormu(bosMusteriFormu)
    setMusteriNotMetni('')
  }

  const musteriEklemeKapat = () => { setMusteriEklemeAcik(false); musteriFormuTemizle() }
  const musteriDuzenlemeKapat = () => { setMusteriDuzenlemeAcik(false); musteriFormuTemizle() }
  const musteriNotKapat = () => { setMusteriNotAcik(false); setSeciliMusteriUid(null); setMusteriNotMetni('') }
  const musteriSilmeKapat = () => setSilinecekMusteri(null)
  const musteriModallariniKapat = () => {
    musteriEklemeKapat(); musteriDuzenlemeKapat(); musteriNotKapat(); musteriSilmeKapat()
  }

  const musteriEklemeAc = () => { musteriFormuTemizle(); setMusteriEklemeAcik(true) }

  const musteriDuzenlemeAc = (musteri) => {
    setSeciliMusteriUid(musteri.uid)
    setMusteriFormu({ ad: musteri.ad, telefon: musteri.telefon, sonAlim: musteri.sonAlim, not: musteri.not })
    setMusteriDuzenlemeAcik(true)
  }

  const musteriNotAc = (musteri) => {
    setSeciliMusteriUid(musteri.uid)
    setMusteriNotMetni(musteri.not)
    setMusteriNotAcik(true)
  }

  const musteriFormuGuncelle = (alan, deger) =>
    setMusteriFormu((onceki) => ({ ...onceki, [alan]: deger }))

  const musteriFavoriDegistir = (uid) =>
    setMusteriler((onceki) =>
      onceki.map((m) => (m.uid === uid ? { ...m, favori: !m.favori } : m)),
    )

  const musteriKaydet = async (mod) => {
    const ad = musteriFormu.ad?.trim()
    const telefon = musteriFormu.telefon?.trim()
    const not = musteriFormu.not?.trim()
    const sonAlim = musteriFormu.sonAlim

    if (!ad || !telefon) {
      toastGoster?.('hata', 'Müşteri formunda eksik alan var.')
      return
    }
    if (!telefonGecerliMi(telefon)) {
      toastGoster?.('hata', 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalı.')
      return
    }

    try {
      if (mod === 'ekle') {
        const yanit = await api.post('/customers', {
          full_name: ad,
          phone: telefon,
          last_purchase_date: sonAlim || null,
          notes: not,
        })
        const yeni = yanit?.data ?? yanit
        setMusteriler((onceki) => [{
          uid: yeni.uid, ad: yeni.ad, telefon: yeni.telefon ?? telefon,
          email: yeni.email ?? '', adres: yeni.adres ?? '',
          vergiNumarasi: yeni.vergiNumarasi ?? '', sonAlim: yeni.sonAlimTarihi ?? sonAlim,
          not: yeni.not ?? not, favori: false,
        }, ...onceki])
        setMusteriSayfa(1)
        musteriEklemeKapat()
        toastGoster?.('basari', `${ad} müşteri listesine eklendi.`)
      } else {
        await api.put(`/customers/${seciliMusteriUid}`, {
          full_name: ad, phone: telefon,
          last_purchase_date: sonAlim || null, notes: not,
        })
        setMusteriler((onceki) =>
          onceki.map((m) =>
            m.uid === seciliMusteriUid ? { ...m, ad, telefon, sonAlim, not } : m,
          ),
        )
        musteriDuzenlemeKapat()
        toastGoster?.('basari', `${ad} müşteri kaydı güncellendi.`)
      }
    } catch {
      toastGoster?.('hata', 'İşlem sırasında hata oluştu.')
    }
  }

  const musteriNotKaydet = async () => {
    const temizNot = musteriNotMetni.trim()
    if (!temizNot) { toastGoster?.('hata', 'Müşteri notu boş bırakılamaz.'); return }
    const seciliMusteri = musteriler.find((m) => m.uid === seciliMusteriUid)
    try {
      await api.put(`/customers/${seciliMusteriUid}`, { notes: temizNot })
      setMusteriler((onceki) =>
        onceki.map((m) => (m.uid === seciliMusteriUid ? { ...m, not: temizNot } : m)),
      )
      musteriNotKapat()
      toastGoster?.('basari', `${seciliMusteri?.ad ?? 'Müşteri'} notu kaydedildi.`)
    } catch {
      toastGoster?.('hata', 'Not kaydedilirken hata oluştu.')
    }
  }

  const musteriSil = async () => {
    if (!silinecekMusteri) return
    const silinenMusteri = { ...silinecekMusteri }
    const silinenAd = silinenMusteri.ad
    try {
      await api.delete(`/customers/${silinenMusteri.uid}`)
      setMusteriler((onceki) => onceki.filter((m) => m.uid !== silinenMusteri.uid))
      musteriSilmeKapat()
      toastGoster?.('basari', `${silinenAd} müşteri listesinden silindi.`)
    } catch {
      toastGoster?.('hata', 'Müşteri silinirken hata oluştu.')
    }
  }

  const musteriSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamMusteriSayfa) return
    setMusteriSayfa(sayfa)
  }

  return {
    musteriler, musteriArama, setMusteriArama, musteriSayfa, setMusteriSayfa,
    musteriEklemeAcik, setMusteriEklemeAcik, musteriDuzenlemeAcik, setMusteriDuzenlemeAcik,
    musteriNotAcik, setMusteriNotAcik, seciliMusteriUid, setSeciliMusteriUid,
    musteriFormu, musteriNotMetni, setMusteriNotMetni, silinecekMusteri, setSilinecekMusteri,
    filtreliMusteriler, toplamMusteriSayfa, musteriBaslangic, sayfadakiMusteriler,
    musteriFormuTemizle, musteriEklemeKapat, musteriDuzenlemeKapat, musteriNotKapat,
    musteriSilmeKapat, musteriModallariniKapat, musteriEklemeAc, musteriDuzenlemeAc,
    musteriNotAc, musteriFormuGuncelle, musteriFavoriDegistir, musteriKaydet,
    musteriNotKaydet, musteriSil, musteriSayfayaGit,
  }
}
