import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../../core/api/apiClient'
import { bosSiparisFormu, negatifSayiVarMi } from '../../../shared/utils/constantsAndHelpers'

const SIPARIS_SAYFA_BASINA = 8
const BOS_DURUM_FORMU = {
  odemeDurumu: 'Beklemede',
  urunHazirlik: 'Hazırlanıyor',
  teslimatDurumu: 'Hazırlanıyor',
  teslimatSuresi: '',
}

const mapSiparis = (s) => ({
  uid: s.uid,
  siparisNo: s.siparisNo,
  musteriUid: s.musteriUid,
  musteri: s.musteri ?? 'Bilinmiyor',
  urun: s.urunler?.[0]?.urunAdi ?? s.urunler?.map((u) => u.urunAdi).join(', ') ?? '—',
  toplamTutar: s.toplamTutar ?? 0,
  siparisTarihi: s.siparisTarihi ? String(s.siparisTarihi).slice(0, 10) : '',
  odemeDurumu: s.odemeDurumu ?? 'Beklemede',
  urunHazirlik: s.urunHazirlik ?? 'Hazırlanıyor',
  teslimatDurumu: s.teslimatDurumu ?? 'Hazırlanıyor',
  teslimatSuresi: s.teslimatSuresi ?? '2 iş günü',
  urunler: s.urunler ?? [],
})

const siparisIcinMusteriBul = (kayit, musteriListesi) => {
  if (kayit?.musteriUid == null || kayit?.musteriUid === '') return null
  return musteriListesi.find((m) => String(m.uid) === String(kayit.musteriUid)) ?? null
}

export default function useOrders({ musteriler, urunler, toastGoster, telefonAramasiBaslat, isLoggedIn }) {
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

  const siparisleriYukle = useCallback(async () => {
    try {
      const data = await api.get('/customer-orders')
      setSiparisler((data?.data ?? data ?? []).map(mapSiparis))
    } catch {
      toastGoster?.('hata', 'Siparişler yüklenirken hata oluştu.')
    }
  }, [toastGoster])

  useEffect(() => { if (isLoggedIn) siparisleriYukle() }, [isLoggedIn, siparisleriYukle])

  const musteriSecenekleri = useMemo(
    () => musteriler.map((m) => ({ uid: m.uid, ad: m.ad })),
    [musteriler],
  )

  const siraliSiparisler = useMemo(
    () => [...siparisler].sort((a, b) => new Date(b.siparisTarihi).getTime() - new Date(a.siparisTarihi).getTime()),
    [siparisler],
  )

  const filtreliSiparisler = useMemo(() => {
    const arama = siparisArama.trim().toLowerCase()
    return siraliSiparisler.filter((s) => {
      const filtreUygun = siparisOdemeFiltresi === 'Tüm Siparişler' || s.odemeDurumu === siparisOdemeFiltresi
      if (!filtreUygun) return false
      if (!arama) return true
      const musteriAdi = (siparisIcinMusteriBul(s, musteriler)?.ad ?? s.musteri ?? '').toLowerCase()
      return s.siparisNo.toLowerCase().includes(arama) || musteriAdi.includes(arama) || s.urun.toLowerCase().includes(arama)
    })
  }, [siraliSiparisler, siparisArama, siparisOdemeFiltresi, musteriler])

  const toplamSiparisSayfa = Math.max(1, Math.ceil(filtreliSiparisler.length / SIPARIS_SAYFA_BASINA))
  const sayfadakiSiparisler = useMemo(() => {
    const bas = (siparisSayfa - 1) * SIPARIS_SAYFA_BASINA
    return filtreliSiparisler.slice(bas, bas + SIPARIS_SAYFA_BASINA)
  }, [filtreliSiparisler, siparisSayfa])

  const filtreliGecmisSiparisler = useMemo(() => {
    const metin = gecmisSiparisArama.trim().toLowerCase()
    if (!metin) return gecmisSiparisler
    return gecmisSiparisler.filter((s) => {
      const musteriAdi = (siparisIcinMusteriBul(s, musteriler)?.ad ?? s.musteri ?? '').toLowerCase()
      return s.siparisNo.toLowerCase().includes(metin) || musteriAdi.includes(metin)
    })
  }, [gecmisSiparisArama, gecmisSiparisler, musteriler])

  const toplamGecmisSiparisSayfa = Math.max(1, Math.ceil(filtreliGecmisSiparisler.length / SIPARIS_SAYFA_BASINA))
  const sayfadakiGecmisSiparisler = useMemo(() => {
    const bas = (gecmisSiparisSayfa - 1) * SIPARIS_SAYFA_BASINA
    return filtreliGecmisSiparisler.slice(bas, bas + SIPARIS_SAYFA_BASINA)
  }, [filtreliGecmisSiparisler, gecmisSiparisSayfa])

  const siparisAktivitesi = useMemo(() => ({
    paketlenecek: filtreliSiparisler.filter((s) => s.urunHazirlik === 'Hazırlanıyor' || s.urunHazirlik === 'Tedarik Bekleniyor').length,
    sevkEdilecek: filtreliSiparisler.filter((s) => s.teslimatDurumu === 'Hazırlanıyor').length,
    teslimEdilecek: filtreliSiparisler.filter((s) => s.teslimatDurumu === 'Yolda' || s.teslimatDurumu === 'Kargoda').length,
  }), [filtreliSiparisler])

  useEffect(() => { if (siparisSayfa > toplamSiparisSayfa) setSiparisSayfa(toplamSiparisSayfa) }, [siparisSayfa, toplamSiparisSayfa])
  useEffect(() => { if (gecmisSiparisSayfa > toplamGecmisSiparisSayfa) setGecmisSiparisSayfa(toplamGecmisSiparisSayfa) }, [gecmisSiparisSayfa, toplamGecmisSiparisSayfa])
  useEffect(() => setSiparisSayfa(1), [siparisArama, siparisOdemeFiltresi])

  const siparisTelefonunuGetir = (kayit) =>
    siparisIcinMusteriBul(kayit, musteriler)?.telefon ?? 'Bilinmiyor'

  const siparisMusteriAra = (siparis) => {
    const telefon = siparisTelefonunuGetir(siparis)
    telefonAramasiBaslat?.(telefon === 'Bilinmiyor' ? '' : telefon, siparisMusteriAdiniGetir(siparis))
  }

  const siparisDuzenlemeAc = (siparis) => {
    setDuzenlenenSiparisNo(siparis.siparisNo)
    setSiparisFormu({
      musteriUid: String(siparis.musteriUid ?? ''),
      urun: siparis.urun, toplamTutar: String(siparis.toplamTutar),
      siparisTarihi: siparis.siparisTarihi, odemeDurumu: siparis.odemeDurumu,
      urunHazirlik: siparis.urunHazirlik, teslimatDurumu: siparis.teslimatDurumu,
      teslimatSuresi: siparis.teslimatSuresi,
    })
  }

  const siparisDurumGuncellemeAc = (siparis) => {
    setDurumGuncellenenSiparisNo(siparis.siparisNo)
    setSiparisDurumFormu({
      odemeDurumu: siparis.odemeDurumu, urunHazirlik: siparis.urunHazirlik,
      teslimatDurumu: siparis.teslimatDurumu, teslimatSuresi: siparis.teslimatSuresi,
    })
  }

  const siparisFormuGuncelle = (alan, deger) => setSiparisFormu((p) => ({ ...p, [alan]: deger }))
  const siparisDurumFormuGuncelle = (alan, deger) => setSiparisDurumFormu((p) => ({ ...p, [alan]: deger }))

  const yeniSiparisPenceresiniAc = () => {
    setSiparisFormu({ ...bosSiparisFormu, musteriUid: String(musteriSecenekleri[0]?.uid ?? ''), siparisTarihi: new Date().toISOString().slice(0, 10), teslimatSuresi: '2 iş günü' })
    setYeniSiparisAcik(true)
  }

  const yeniSiparisKaydet = async () => {
    const musteriUid = String(siparisFormu.musteriUid ?? '').trim()
    const toplamTutar = Number(siparisFormu.toplamTutar)
    const seciliMusteri = musteriler.find((m) => String(m.uid) === musteriUid) ?? null
    if (!musteriUid || !seciliMusteri || !siparisFormu.siparisTarihi || Number.isNaN(toplamTutar)) {
      toastGoster?.('hata', 'Yeni sipariş formunda eksik veya hatalı bilgi var.'); return
    }
    if (negatifSayiVarMi(toplamTutar)) { toastGoster?.('hata', 'Sipariş tutarı negatif olamaz.'); return }
    try {
      const yanit = await api.post('/customer-orders', {
        customer_id: seciliMusteri.uid,
        total_amount: toplamTutar,
        order_date: siparisFormu.siparisTarihi,
        payment_status: siparisFormu.odemeDurumu || 'Beklemede',
        preparation_status: siparisFormu.urunHazirlik || 'Hazırlanıyor',
        delivery_status: siparisFormu.teslimatDurumu || 'Hazırlanıyor',
        items: [],
      })
      const yeni = yanit?.data ?? yanit
      setSiparisler((p) => [mapSiparis({ ...yeni, musteri: seciliMusteri.ad }), ...p])
      setYeniSiparisAcik(false)
      setSiparisSayfa(1)
      setSiparisFormu(bosSiparisFormu)
      toastGoster?.('basari', `${yeni.siparisNo} numaralı yeni sipariş oluşturuldu.`)
    } catch { toastGoster?.('hata', 'Sipariş oluşturulurken hata oluştu.') }
  }

  const siparisDuzenlemeKaydet = async () => {
    const siparis = siparisler.find((s) => s.siparisNo === duzenlenenSiparisNo)
    if (!siparis) return
    const toplamTutar = Number(siparisFormu.toplamTutar)
    if (Number.isNaN(toplamTutar)) { toastGoster?.('hata', 'Tutar hatalı.'); return }
    try {
      await api.put(`/customer-orders/${siparis.uid}`, {
        payment_status: siparisFormu.odemeDurumu,
        preparation_status: siparisFormu.urunHazirlik,
        delivery_status: siparisFormu.teslimatDurumu,
        total_amount: toplamTutar,
      })
      setSiparisler((p) => p.map((s) => s.siparisNo === duzenlenenSiparisNo ? { ...s, odemeDurumu: siparisFormu.odemeDurumu, urunHazirlik: siparisFormu.urunHazirlik, teslimatDurumu: siparisFormu.teslimatDurumu, toplamTutar } : s))
      setDuzenlenenSiparisNo(null)
      setSiparisFormu(bosSiparisFormu)
      toastGoster?.('basari', 'Sipariş güncellendi.')
    } catch { toastGoster?.('hata', 'Güncelleme sırasında hata oluştu.') }
  }

  const siparisDurumKaydet = async () => {
    if (!durumGuncellenenSiparisNo) return
    const siparis = siparisler.find((s) => s.siparisNo === durumGuncellenenSiparisNo)
    if (!siparis) return
    try {
      await api.put(`/customer-orders/${siparis.uid}`, {
        payment_status: siparisDurumFormu.odemeDurumu,
        preparation_status: siparisDurumFormu.urunHazirlik,
        delivery_status: siparisDurumFormu.teslimatDurumu,
      })
      setSiparisler((p) => p.map((s) => s.siparisNo === durumGuncellenenSiparisNo ? { ...s, ...siparisDurumFormu } : s))
      setDurumGuncellenenSiparisNo(null)
      toastGoster?.('basari', `${durumGuncellenenSiparisNo} durumu güncellendi.`)
    } catch { toastGoster?.('hata', 'Durum güncellenirken hata oluştu.') }
  }

  const siparisSil = async () => {
    if (!silinecekSiparis) return
    const silinenSiparis = { ...silinecekSiparis }
    try {
      await api.delete(`/customer-orders/${silinenSiparis.uid}`)
      setSiparisler((p) => p.filter((s) => s.siparisNo !== silinenSiparis.siparisNo))
      setSilinecekSiparis(null)
      toastGoster?.('basari', `${silinenSiparis.siparisNo} siparişi silindi.`)
    } catch { toastGoster?.('hata', 'Sipariş silinirken hata oluştu.') }
  }

  return {
    siparisler, siparisArama, setSiparisArama, siparisOdemeFiltresi, setSiparisOdemeFiltresi,
    siparisSekmesi, setSiparisSekmesi, siparisSayfa, setSiparisSayfa, gecmisSiparisArama,
    setGecmisSiparisArama, gecmisSiparisSayfa, setGecmisSiparisSayfa, yeniSiparisAcik,
    setYeniSiparisAcik, detaySiparis, setDetaySiparis, detayGecmisSiparis, setDetayGecmisSiparis,
    duzenlenenSiparisNo, setDuzenlenenSiparisNo, durumGuncellenenSiparisNo, setDurumGuncellenenSiparisNo,
    silinecekSiparis, setSilinecekSiparis, siparisFormu, siparisDurumFormu, gecmisSiparisler,
    siraliSiparisler, filtreliSiparisler, toplamSiparisSayfa, sayfadakiSiparisler,
    toplamGecmisSiparisSayfa, sayfadakiGecmisSiparisler, siparisAktivitesi, musteriSecenekleri,
    siparisFormuGuncelle, siparisDurumFormuGuncelle, yeniSiparisPenceresiniAc, yeniSiparisKaydet,
    siparisDuzenlemeAc, siparisDuzenlemeKaydet, siparisDurumGuncellemeAc, siparisDurumKaydet,
    siparisSil, siparisMusteriAra, siparisMusteriAdiniGetir, siparisTelefonunuGetir,
  }
}
