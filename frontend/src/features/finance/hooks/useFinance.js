import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../../core/api/apiClient'
import {
  favorileriOneTasi,
  gerceklesenOdemeTutari,
  negatifSayiVarMi,
  odemeDurumunuStandartlastir,
} from '../../../shared/utils/constantsAndHelpers'

const ODEME_SAYFA_BASINA = 10

const mapOdeme = (kayit) => ({
  uid: kayit.uid,
  odemeNo: kayit.odemeNo,
  tur: kayit.tur,
  taraf: kayit.taraf ?? kayit.aciklama ?? '—',
  tutar: kayit.tutar ?? 0,
  tarih: kayit.tarih,
  durum: odemeDurumunuStandartlastir(kayit.durum ?? 'Tamamlandı'),
  aciklama: kayit.aciklama ?? '',
  faturaId: kayit.faturaId ?? null,
  favori: false,
})

const BOS_ODEME_FORMU = { taraf: '', tarih: '', durum: '', tutar: '' }

export default function useFinance({ toastGoster, isLoggedIn }) {
  const [gelenNakitListesi, setGelenNakitListesi] = useState([])
  const [gidenNakitListesi, setGidenNakitListesi] = useState([])
  const [odemeSekmesi, setOdemeSekmesi] = useState('gelen')
  const [gelenSayfa, setGelenSayfa] = useState(1)
  const [gidenSayfa, setGidenSayfa] = useState(1)
  const [duzenlenenOdeme, setDuzenlenenOdeme] = useState(null)
  const [odemeFormu, setOdemeFormu] = useState(BOS_ODEME_FORMU)
  const [silinecekOdeme, setSilinecekOdeme] = useState(null)

  // Backend'den ödemeleri yükle
  const odemeleriFetchle = useCallback(async () => {
    try {
      const data = await api.get('/payments')
      const liste = (data?.data ?? data ?? []).map(mapOdeme)
      setGelenNakitListesi(liste.filter((k) => k.tur === 'incoming'))
      setGidenNakitListesi(liste.filter((k) => k.tur === 'outgoing'))
    } catch {
      toastGoster?.('hata', 'Ödemeler yüklenirken hata oluştu.')
    }
  }, [toastGoster])

  useEffect(() => { if (isLoggedIn) odemeleriFetchle() }, [isLoggedIn, odemeleriFetchle])

  const siraliGelenNakit = useMemo(
    () => favorileriOneTasi(gelenNakitListesi, (k) => new Date(k.tarih).getTime()),
    [gelenNakitListesi],
  )
  const siraliGidenNakit = useMemo(
    () => favorileriOneTasi(gidenNakitListesi, (k) => new Date(k.tarih).getTime()),
    [gidenNakitListesi],
  )
  const toplamGelenNakit = useMemo(
    () => siraliGelenNakit.reduce((t, k) => t + gerceklesenOdemeTutari(k), 0),
    [siraliGelenNakit],
  )
  const toplamGidenNakit = useMemo(
    () => siraliGidenNakit.reduce((t, k) => t + gerceklesenOdemeTutari(k), 0),
    [siraliGidenNakit],
  )

  const aySonuKari = toplamGelenNakit - toplamGidenNakit
  const toplamGelenSayfa = Math.max(1, Math.ceil(siraliGelenNakit.length / ODEME_SAYFA_BASINA))
  const toplamGidenSayfa = Math.max(1, Math.ceil(siraliGidenNakit.length / ODEME_SAYFA_BASINA))

  const gelenSayfadakiKayitlar = siraliGelenNakit.slice(
    (gelenSayfa - 1) * ODEME_SAYFA_BASINA, gelenSayfa * ODEME_SAYFA_BASINA,
  )
  const gidenSayfadakiKayitlar = siraliGidenNakit.slice(
    (gidenSayfa - 1) * ODEME_SAYFA_BASINA, gidenSayfa * ODEME_SAYFA_BASINA,
  )

  useEffect(() => { if (gelenSayfa > toplamGelenSayfa) setGelenSayfa(toplamGelenSayfa) }, [gelenSayfa, toplamGelenSayfa])
  useEffect(() => { if (gidenSayfa > toplamGidenSayfa) setGidenSayfa(toplamGidenSayfa) }, [gidenSayfa, toplamGidenSayfa])

  const odemeListesiGuncelle = (sekme, guncelleyici) => {
    if (sekme === 'gelen') { setGelenNakitListesi((p) => guncelleyici(p)); return }
    setGidenNakitListesi((p) => guncelleyici(p))
  }

  const finansFavoriDegistir = (sekme, odemeNo) =>
    odemeListesiGuncelle(sekme, (p) =>
      p.map((k) => (k.odemeNo === odemeNo ? { ...k, favori: !k.favori } : k)),
    )

  const odemeDuzenlemeAc = (sekme, kayit) => {
    setDuzenlenenOdeme({ sekme, odemeNo: kayit.odemeNo, uid: kayit.uid })
    setOdemeFormu({ taraf: kayit.taraf, tarih: kayit.tarih, durum: kayit.durum, tutar: String(kayit.tutar) })
  }
  const odemeDuzenlemeKapat = () => { setDuzenlenenOdeme(null); setOdemeFormu(BOS_ODEME_FORMU) }
  const odemeFormuGuncelle = (alan, deger) => setOdemeFormu((p) => ({ ...p, [alan]: deger }))

  const odemeDuzenlemeKaydet = async () => {
    if (!duzenlenenOdeme) return
    const tutar = Number(String(odemeFormu.tutar).replace(/[^0-9.-]/g, ''))
    const taraf = odemeFormu.taraf.trim()
    const tarih = odemeFormu.tarih.trim()
    const durum = odemeDurumunuStandartlastir(odemeFormu.durum)
    if (!taraf || !tarih || !durum || Number.isNaN(tutar)) { toastGoster?.('hata', 'Eksik veya hatalı bilgi var.'); return }
    if (negatifSayiVarMi(tutar)) { toastGoster?.('hata', 'Ödeme tutarı negatif olamaz.'); return }
    try {
      await api.put(`/payments/${duzenlenenOdeme.uid}`, { amount: tutar, payment_date: tarih, status: 'completed', description: taraf })
      odemeListesiGuncelle(duzenlenenOdeme.sekme, (p) =>
        p.map((k) => (k.odemeNo === duzenlenenOdeme.odemeNo ? { ...k, taraf, tarih, durum, tutar } : k)),
      )
      odemeDuzenlemeKapat()
      toastGoster?.('basari', `${taraf} kaydı güncellendi.`)
    } catch { toastGoster?.('hata', 'Güncelleme sırasında hata oluştu.') }
  }

  const odemeSilmeKapat = () => setSilinecekOdeme(null)

  const odemeSil = async () => {
    if (!silinecekOdeme) return
    const silinenOdeme = { ...silinecekOdeme }
    try {
      await api.delete(`/payments/${silinenOdeme.uid}`)
      odemeListesiGuncelle(silinenOdeme.sekme, (p) => p.filter((k) => k.odemeNo !== silinenOdeme.odemeNo))
      odemeSilmeKapat()
      toastGoster?.('basari', `${silinenOdeme.taraf} kaydı silindi.`)
    } catch { toastGoster?.('hata', 'Silme sırasında hata oluştu.') }
  }

  const financeModallariniKapat = () => { odemeDuzenlemeKapat(); odemeSilmeKapat() }

  return {
    odemeSekmesi, setOdemeSekmesi, gelenSayfa, setGelenSayfa, gidenSayfa, setGidenSayfa,
    duzenlenenOdeme, odemeFormu, silinecekOdeme, gelenSayfadakiKayitlar, gidenSayfadakiKayitlar,
    toplamGelenSayfa, toplamGidenSayfa, toplamGelenNakit, toplamGidenNakit, aySonuKari,
    siraliGelenNakit, siraliGidenNakit, finansFavoriDegistir, odemeDuzenlemeAc,
    odemeDuzenlemeKapat, odemeFormuGuncelle, odemeDuzenlemeKaydet, setSilinecekOdeme,
    odemeSilmeKapat, odemeSil, financeModallariniKapat,
  }
}
