import { useEffect, useMemo, useState } from 'react'
import { financeApi } from '../../../core/services/backendApiService'
import {
  favorileriOneTasi,
  gerceklesenOdemeTutari,
  negatifSayiVarMi,
  odemeDurumunuStandartlastir,
} from '../../../shared/utils/constantsAndHelpers'

const ODEME_SAYFA_BASINA = 10
const BOS_ODEME_FORMU = { taraf: '', tarih: '', durum: '', tutar: '' }
export default function useFinance({ toastGoster }) {
  const [gelenNakitListesi, setGelenNakitListesi] = useState([])
  const [gidenNakitListesi, setGidenNakitListesi] = useState([])
  const [odemeSekmesi, setOdemeSekmesi] = useState('gelen')
  const [gelenSayfa, setGelenSayfa] = useState(1)
  const [gidenSayfa, setGidenSayfa] = useState(1)
  const [duzenlenenOdeme, setDuzenlenenOdeme] = useState(null)
  const [odemeFormu, setOdemeFormu] = useState(BOS_ODEME_FORMU)
  const [silinecekOdeme, setSilinecekOdeme] = useState(null)

  const siraliGelenNakit = useMemo(
    () => favorileriOneTasi(gelenNakitListesi, (kayit) => new Date(kayit.tarih).getTime()),
    [gelenNakitListesi],
  )

  const siraliGidenNakit = useMemo(
    () => favorileriOneTasi(gidenNakitListesi, (kayit) => new Date(kayit.tarih).getTime()),
    [gidenNakitListesi],
  )

  const toplamGelenNakit = useMemo(
    () => siraliGelenNakit.reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0),
    [siraliGelenNakit],
  )

  const toplamGidenNakit = useMemo(
    () => siraliGidenNakit.reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0),
    [siraliGidenNakit],
  )

  const aySonuKari = toplamGelenNakit - toplamGidenNakit
  const toplamGelenSayfa = Math.max(1, Math.ceil(siraliGelenNakit.length / ODEME_SAYFA_BASINA))
  const toplamGidenSayfa = Math.max(1, Math.ceil(siraliGidenNakit.length / ODEME_SAYFA_BASINA))

  const gelenSayfadakiKayitlar = siraliGelenNakit.slice(
    (gelenSayfa - 1) * ODEME_SAYFA_BASINA,
    gelenSayfa * ODEME_SAYFA_BASINA,
  )

  const gidenSayfadakiKayitlar = siraliGidenNakit.slice(
    (gidenSayfa - 1) * ODEME_SAYFA_BASINA,
    gidenSayfa * ODEME_SAYFA_BASINA,
  )

  useEffect(() => {
    if (gelenSayfa > toplamGelenSayfa) setGelenSayfa(toplamGelenSayfa)
  }, [gelenSayfa, toplamGelenSayfa])

  useEffect(() => {
    if (gidenSayfa > toplamGidenSayfa) setGidenSayfa(toplamGidenSayfa)
  }, [gidenSayfa, toplamGidenSayfa])

  useEffect(() => {
    const finansYukle = async () => {
      try {
        const veriler = await financeApi.getAll()
        setGelenNakitListesi(veriler.gelen || [])
        setGidenNakitListesi(veriler.giden || [])
      } catch (error) {
        console.error('Finans verileri yüklenirken hata oluştu:', error)
        toastGoster?.('hata', 'Finansal veriler veritabanından alınamadı.')
      }
    }
    finansYukle()
  }, [toastGoster])

  const odemeListesiGuncelle = (sekme, guncelleyici) => {
    if (sekme === 'gelen') {
      setGelenNakitListesi((onceki) => guncelleyici(onceki))
      return
    }
    setGidenNakitListesi((onceki) => guncelleyici(onceki))
  }

  const finansFavoriDegistir = (sekme, odemeNo) => {
    odemeListesiGuncelle(sekme, (onceki) =>
      onceki.map((kayit) =>
        kayit.odemeNo === odemeNo ? { ...kayit, favori: !kayit.favori } : kayit,
      ),
    )
  }

  const odemeDuzenlemeAc = (sekme, kayit) => {
    setDuzenlenenOdeme({ sekme, odemeNo: kayit.odemeNo })
    setOdemeFormu({
      taraf: kayit.taraf,
      tarih: kayit.tarih,
      durum: kayit.durum,
      tutar: String(kayit.tutar),
    })
  }

  const odemeDuzenlemeKapat = () => {
    setDuzenlenenOdeme(null)
    setOdemeFormu(BOS_ODEME_FORMU)
  }

  const odemeFormuGuncelle = (alan, deger) => {
    setOdemeFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const odemeDuzenlemeKaydet = () => {
    if (!duzenlenenOdeme) return

    const tutar = Number(String(odemeFormu.tutar).replace(/[^\d.-]/g, ''))
    const taraf = odemeFormu.taraf.trim()
    const tarih = odemeFormu.tarih.trim()
    const durum = odemeDurumunuStandartlastir(odemeFormu.durum)

    if (!taraf || !tarih || !durum || Number.isNaN(tutar)) {
      toastGoster?.('hata', 'Finansal akış kaydında eksik veya hatalı bilgi var.')
      return
    }

    if (negatifSayiVarMi(tutar)) {
      toastGoster?.('hata', 'Ödeme veya tahsilat tutarı negatif olamaz.')
      return
    }

    odemeListesiGuncelle(duzenlenenOdeme.sekme, (onceki) =>
      onceki.map((kayit) =>
        kayit.odemeNo === duzenlenenOdeme.odemeNo
          ? { ...kayit, taraf, tarih, durum, tutar }
          : kayit,
      ),
    )

    odemeDuzenlemeKapat()
    toastGoster?.('basari', `${taraf} kaydı güncellendi.`)
  }

  const odemeSilmeKapat = () => {
    setSilinecekOdeme(null)
  }

  const odemeSil = () => {
    if (!silinecekOdeme) return

    const silinenOdeme = { ...silinecekOdeme }
    const kaynakListe = silinenOdeme.sekme === 'gelen' ? gelenNakitListesi : gidenNakitListesi
    const silinenKayit = kaynakListe.find((kayit) => kayit.odemeNo === silinenOdeme.odemeNo)
    const silinenIndex = kaynakListe.findIndex((kayit) => kayit.odemeNo === silinenOdeme.odemeNo)
    const silinenTaraf = silinenOdeme.taraf

    odemeListesiGuncelle(silinenOdeme.sekme, (onceki) =>
      onceki.filter((kayit) => kayit.odemeNo !== silinenOdeme.odemeNo),
    )
    odemeSilmeKapat()

    toastGoster?.('basari', `${silinenTaraf} kaydı silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        if (!silinenKayit) return
        odemeListesiGuncelle(silinenOdeme.sekme, (onceki) => {
          if (onceki.some((kayit) => kayit.odemeNo === silinenKayit.odemeNo)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenKayit)
          return yeni
        })
        toastGoster?.('basari', `${silinenTaraf} kaydı geri alındı.`)
      },
    })
  }

  const financeModallariniKapat = () => {
    odemeDuzenlemeKapat()
    odemeSilmeKapat()
  }

  return {
    odemeSekmesi,
    setOdemeSekmesi,
    gelenSayfa,
    setGelenSayfa,
    gidenSayfa,
    setGidenSayfa,
    duzenlenenOdeme,
    odemeFormu,
    silinecekOdeme,
    gelenSayfadakiKayitlar,
    gidenSayfadakiKayitlar,
    toplamGelenSayfa,
    toplamGidenSayfa,
    toplamGelenNakit,
    toplamGidenNakit,
    aySonuKari,
    siraliGelenNakit,
    siraliGidenNakit,
    finansFavoriDegistir,
    odemeDuzenlemeAc,
    odemeDuzenlemeKapat,
    odemeFormuGuncelle,
    odemeDuzenlemeKaydet,
    setSilinecekOdeme,
    odemeSilmeKapat,
    odemeSil,
    financeModallariniKapat,
  }
}
