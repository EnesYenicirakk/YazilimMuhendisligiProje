import { useEffect, useMemo, useState } from 'react'
import { stokDegisimLoglari as baslangicStokDegisimLoglari } from '../../../components/common/Ikonlar'
import {
  avatarOlustur,
  baslangicUrunleri,
  bosForm,
  bosUrunDuzenlemeFormu,
  envanterKategorileri,
  favorileriOneTasi,
  negatifSayiVarMi,
} from '../../../shared/utils/constantsAndHelpers'

const SAYFA_BASINA_URUN = 8
const STOK_LOG_SAYFA_BASINA = 8

export default function useInventory({ toastGoster }) {
  const [urunler, setUrunler] = useState(baslangicUrunleri)
  const [aramaMetni, setAramaMetni] = useState('')
  const [envanterKategori, setEnvanterKategori] = useState('Tümü')
  const [envanterSayfa, setEnvanterSayfa] = useState(1)
  const [urunDuzenlemeArama, setUrunDuzenlemeArama] = useState('')
  const [urunDuzenlemeSayfa, setUrunDuzenlemeSayfa] = useState(1)
  const [urunDuzenlemeSekmesi, setUrunDuzenlemeSekmesi] = useState('urunler')
  const [stokLogSayfa, setStokLogSayfa] = useState(1)
  const [eklemeAcik, setEklemeAcik] = useState(false)
  const [duzenlemeAcik, setDuzenlemeAcik] = useState(false)
  const [silinecekUrun, setSilinecekUrun] = useState(null)
  const [urunDuzenlemeModalAcik, setUrunDuzenlemeModalAcik] = useState(false)
  const [silinecekDuzenlemeUrunu, setSilinecekDuzenlemeUrunu] = useState(null)
  const [seciliUid, setSeciliUid] = useState(null)
  const [form, setForm] = useState(bosForm)
  const [urunDuzenlemeUid, setUrunDuzenlemeUid] = useState(null)
  const [urunDuzenlemeFormu, setUrunDuzenlemeFormu] = useState(bosUrunDuzenlemeFormu)

  const stokDegisimLoglari = baslangicStokDegisimLoglari

  const filtreliUrunler = useMemo(() => {
    const metin = aramaMetni.trim().toLowerCase()
    const kategoriyeGore = envanterKategori === 'Tümü'
      ? urunler
      : urunler.filter((urun) => urun.kategori === envanterKategori)
    const sonuc = !metin
      ? kategoriyeGore
      : kategoriyeGore.filter(
          (urun) =>
            urun.ad.toLowerCase().includes(metin) ||
            urun.urunId.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(sonuc)
  }, [aramaMetni, envanterKategori, urunler])

  const toplamEnvanterSayfa = Math.max(1, Math.ceil(filtreliUrunler.length / SAYFA_BASINA_URUN))
  const sayfaBaslangic = (envanterSayfa - 1) * SAYFA_BASINA_URUN
  const sayfadakiUrunler = filtreliUrunler.slice(sayfaBaslangic, sayfaBaslangic + SAYFA_BASINA_URUN)

  const filtreliDuzenlemeUrunleri = useMemo(() => {
    const metin = urunDuzenlemeArama.trim().toLowerCase()
    const sonuc = !metin
      ? urunler
      : urunler.filter(
          (urun) =>
            urun.ad.toLowerCase().includes(metin) ||
            urun.urunId.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(sonuc)
  }, [urunDuzenlemeArama, urunler])

  const toplamUrunDuzenlemeSayfa = Math.max(1, Math.ceil(filtreliDuzenlemeUrunleri.length / SAYFA_BASINA_URUN))
  const urunDuzenlemeBaslangic = (urunDuzenlemeSayfa - 1) * SAYFA_BASINA_URUN
  const sayfadakiDuzenlemeUrunleri = filtreliDuzenlemeUrunleri.slice(
    urunDuzenlemeBaslangic,
    urunDuzenlemeBaslangic + SAYFA_BASINA_URUN,
  )

  const toplamStokLogSayfa = Math.max(1, Math.ceil(stokDegisimLoglari.length / STOK_LOG_SAYFA_BASINA))
  const stokLogBaslangic = (stokLogSayfa - 1) * STOK_LOG_SAYFA_BASINA
  const sayfadakiStokLoglari = stokDegisimLoglari.slice(
    stokLogBaslangic,
    stokLogBaslangic + STOK_LOG_SAYFA_BASINA,
  )

  useEffect(() => {
    if (envanterSayfa > toplamEnvanterSayfa) {
      setEnvanterSayfa(toplamEnvanterSayfa)
    }
  }, [envanterSayfa, toplamEnvanterSayfa])

  useEffect(() => {
    if (stokLogSayfa > toplamStokLogSayfa) {
      setStokLogSayfa(toplamStokLogSayfa)
    }
  }, [stokLogSayfa, toplamStokLogSayfa])

  const formGuncelle = (alan, deger) => {
    setForm((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const formuTemizle = () => {
    setForm(bosForm)
    setSeciliUid(null)
  }

  const eklemePenceresiniAc = () => {
    formuTemizle()
    setEklemeAcik(true)
  }

  const eklemePenceresiniKapat = () => {
    setEklemeAcik(false)
    formuTemizle()
  }

  const duzenlemePenceresiniAc = (urun) => {
    setSeciliUid(urun.uid)
    setForm({
      urunId: urun.urunId,
      ad: urun.ad,
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
      minimumStok: String(urun.minimumStok ?? 10),
    })
    setDuzenlemeAcik(true)
  }

  const duzenlemePenceresiniKapat = () => {
    setDuzenlemeAcik(false)
    formuTemizle()
  }

  const formKaydet = (mod) => {
    const urunId = form.urunId.trim()
    const ad = form.ad.trim()
    const urunAdedi = Number(form.urunAdedi)
    const magazaStok = Number(form.magazaStok)
    const minimumStok = Number(form.minimumStok)

    if (!urunId || !ad || Number.isNaN(urunAdedi) || Number.isNaN(magazaStok) || Number.isNaN(minimumStok)) {
      toastGoster?.('hata', 'Ürün bilgileri eksik veya hatalı görünüyor.')
      return
    }

    if (negatifSayiVarMi(urunAdedi, magazaStok, minimumStok)) {
      toastGoster?.('hata', 'Ürün adedi ve stok alanları negatif olamaz.')
      return
    }

    const tekrarEdenUrunId = urunler.some(
      (urun) => urun.urunId.toLowerCase() === urunId.toLowerCase() && (mod === 'ekle' || urun.uid !== seciliUid),
    )
    if (tekrarEdenUrunId) {
      toastGoster?.('hata', `${urunId} ürün ID'si zaten kullanılıyor.`)
      return
    }

    if (mod === 'ekle') {
      const yeniUrun = {
        uid: Date.now(),
        urunId,
        kategori: 'Diğer',
        ad,
        avatar: avatarOlustur(ad),
        urunAdedi,
        magazaStok,
        minimumStok,
        alisFiyati: 0,
        satisFiyati: 0,
        favori: false,
      }

      setUrunler((onceki) => [yeniUrun, ...onceki])
      eklemePenceresiniKapat()
      setEnvanterSayfa(1)
      toastGoster?.('basari', `${ad} envantere eklendi.`)
      return
    }

    setUrunler((onceki) =>
      onceki.map((urun) => {
        if (urun.uid !== seciliUid) return urun
        return {
          ...urun,
          urunId,
          ad,
          urunAdedi,
          magazaStok,
          minimumStok,
          avatar: avatarOlustur(ad),
        }
      }),
    )

    duzenlemePenceresiniKapat()
    toastGoster?.('basari', `${ad} bilgileri güncellendi.`)
  }

  const urunSil = () => {
    if (!silinecekUrun) return
    const silinenUrun = { ...silinecekUrun }
    const silinenAd = silinenUrun.ad
    const silinenIndex = urunler.findIndex((urun) => urun.uid === silinenUrun.uid)
    setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinenUrun.uid))
    setSilinecekUrun(null)
    toastGoster?.('basari', `${silinenAd} envanterden silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setUrunler((onceki) => {
          if (onceki.some((urun) => urun.uid === silinenUrun.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenUrun)
          return yeni
        })
        toastGoster?.('basari', `${silinenAd} geri alındı.`)
      },
    })
  }

  const urunDuzenlemeModaliniAc = (urun) => {
    setUrunDuzenlemeUid(urun.uid)
    setUrunDuzenlemeFormu({
      urunId: urun.urunId,
      ad: urun.ad,
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
      alisFiyati: String(urun.alisFiyati ?? 0),
      satisFiyati: String(urun.satisFiyati ?? 0),
    })
    setUrunDuzenlemeModalAcik(true)
  }

  const urunDuzenlemeModaliniKapat = () => {
    setUrunDuzenlemeModalAcik(false)
    setUrunDuzenlemeUid(null)
    setUrunDuzenlemeFormu(bosUrunDuzenlemeFormu)
  }

  const urunDuzenlemeFormuGuncelle = (alan, deger) => {
    setUrunDuzenlemeFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const urunDuzenlemeKaydet = () => {
    const urunId = urunDuzenlemeFormu.urunId.trim()
    const ad = urunDuzenlemeFormu.ad.trim()
    const urunAdedi = Number(urunDuzenlemeFormu.urunAdedi)
    const magazaStok = Number(urunDuzenlemeFormu.magazaStok)
    const alisFiyati = Number(urunDuzenlemeFormu.alisFiyati)
    const satisFiyati = Number(urunDuzenlemeFormu.satisFiyati)

    if (!urunId || !ad || [urunAdedi, magazaStok, alisFiyati, satisFiyati].some((deger) => Number.isNaN(deger))) {
      toastGoster?.('hata', 'Ürün düzenleme alanlarında eksik veya hatalı veri var.')
      return
    }

    if (negatifSayiVarMi(urunAdedi, magazaStok, alisFiyati, satisFiyati)) {
      toastGoster?.('hata', 'Adet, stok ve fiyat alanları negatif olamaz.')
      return
    }

    const tekrarEdenUrunId = urunler.some(
      (urun) => urun.urunId.toLowerCase() === urunId.toLowerCase() && urun.uid !== urunDuzenlemeUid,
    )
    if (tekrarEdenUrunId) {
      toastGoster?.('hata', `${urunId} ürün ID'si zaten kullanılıyor.`)
      return
    }

    setUrunler((onceki) =>
      onceki.map((urun) =>
        urun.uid === urunDuzenlemeUid
          ? {
              ...urun,
              urunId,
              kategori: urun.kategori ?? 'Diğer',
              ad,
              urunAdedi,
              magazaStok,
              alisFiyati,
              satisFiyati,
              avatar: avatarOlustur(ad),
            }
          : urun,
      ),
    )

    urunDuzenlemeModaliniKapat()
    toastGoster?.('basari', `${ad} fiyat ve stok bilgileri kaydedildi.`)
  }

  const urunDuzenlemeSil = () => {
    if (!silinecekDuzenlemeUrunu) return
    const silinenUrun = { ...silinecekDuzenlemeUrunu }
    const silinenAd = silinenUrun.ad
    const silinenIndex = urunler.findIndex((urun) => urun.uid === silinenUrun.uid)
    setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinenUrun.uid))
    setSilinecekDuzenlemeUrunu(null)
    toastGoster?.('basari', `${silinenAd} ürün düzenleme listesinden kaldırıldı.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setUrunler((onceki) => {
          if (onceki.some((urun) => urun.uid === silinenUrun.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenUrun)
          return yeni
        })
        toastGoster?.('basari', `${silinenAd} geri alındı.`)
      },
    })
  }

  const favoriDegistir = (uid) => {
    setUrunler((onceki) =>
      onceki.map((urun) => (urun.uid === uid ? { ...urun, favori: !urun.favori } : urun)),
    )
  }

  const envanterSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamEnvanterSayfa) return
    setEnvanterSayfa(sayfa)
  }

  const urunDuzenlemeSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamUrunDuzenlemeSayfa) return
    setUrunDuzenlemeSayfa(sayfa)
  }

  const inventoryModallariniKapat = () => {
    eklemePenceresiniKapat()
    duzenlemePenceresiniKapat()
    setSilinecekUrun(null)
    urunDuzenlemeModaliniKapat()
    setSilinecekDuzenlemeUrunu(null)
  }

  return {
    urunler,
    stokDegisimLoglari,
    envanterKategorileri,
    aramaMetni,
    setAramaMetni,
    envanterKategori,
    setEnvanterKategori,
    envanterSayfa,
    setEnvanterSayfa,
    urunDuzenlemeArama,
    setUrunDuzenlemeArama,
    urunDuzenlemeSayfa,
    setUrunDuzenlemeSayfa,
    urunDuzenlemeSekmesi,
    setUrunDuzenlemeSekmesi,
    stokLogSayfa,
    setStokLogSayfa,
    eklemeAcik,
    duzenlemeAcik,
    silinecekUrun,
    setSilinecekUrun,
    urunDuzenlemeModalAcik,
    silinecekDuzenlemeUrunu,
    setSilinecekDuzenlemeUrunu,
    form,
    urunDuzenlemeFormu,
    filtreliUrunler,
    toplamEnvanterSayfa,
    sayfaBaslangic,
    sayfadakiUrunler,
    toplamUrunDuzenlemeSayfa,
    urunDuzenlemeBaslangic,
    sayfadakiDuzenlemeUrunleri,
    toplamStokLogSayfa,
    stokLogBaslangic,
    sayfadakiStokLoglari,
    formGuncelle,
    eklemePenceresiniAc,
    eklemePenceresiniKapat,
    duzenlemePenceresiniAc,
    duzenlemePenceresiniKapat,
    formKaydet,
    urunSil,
    urunDuzenlemeModaliniAc,
    urunDuzenlemeModaliniKapat,
    urunDuzenlemeFormuGuncelle,
    urunDuzenlemeKaydet,
    urunDuzenlemeSil,
    favoriDegistir,
    envanterSayfayaGit,
    urunDuzenlemeSayfayaGit,
    inventoryModallariniKapat,
  }
}
