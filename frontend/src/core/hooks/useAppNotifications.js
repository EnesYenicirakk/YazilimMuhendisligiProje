import { useEffect, useMemo, useState, useRef } from 'react'
import { aiHizliKonular } from '../../shared/utils/constantsAndHelpers'
import { apiFetch } from '../services/backendApiService'

export default function useAppNotifications({
  aktifSayfa,
  dashboardCanliOzetler,
  stokDegisimLoglari = [],
  siraliSiparisler,
  tedarikSiparisleri = [],
  urunler,
  paraFormatla,
  tarihFormatla,
  sayfaDegistir,
  onUrunDuzenlemeSekmeDegistir,
  onOdemeSekmeDegistir,
  onTedarikciSekmeDegistir,
  toastGoster,
}) {
  const [aiPanelAcik, setAiPanelAcik] = useState(false)
  const [aiPanelKucuk, setAiPanelKucuk] = useState(false)
  const [aiPanelKapaniyor, setAiPanelKapaniyor] = useState(false)
  const [bildirimPanelAcik, setBildirimPanelAcik] = useState(false)
  const [bildirimPanelKapaniyor, setBildirimPanelKapaniyor] = useState(false)
  const [okunanBildirimler, setOkunanBildirimler] = useState([])
  const [temizlenenBildirimler, setTemizlenenBildirimler] = useState([])
  const [aiTemaMenuAcik, setAiTemaMenuAcik] = useState(false)
  const [aiMesajMetni, setAiMesajMetni] = useState('')
  const [aiHizliKonularAcik, setAiHizliKonularAcik] = useState(true)
  const [aiYukleniyor, setAiYukleniyor] = useState(false)
  const aiGecmisRef = useRef([])
  const [aiMesajlar, setAiMesajlar] = useState([
    { id: 1, rol: 'bot', metin: 'Tekrardan hoş geldiniz, size nasıl yardımcı olabilirim?', saat: 'Şimdi' },
  ])

  const tumBildirimler = useMemo(() => {
    const otomatikTedarikBildirimleri = tedarikSiparisleri
      .filter((siparis) => siparis.otomatik && siparis.kaynak === 'stok-koruma')
      .slice(0, 3)
      .map((siparis) => ({
        id: `tedarik-${siparis.tedarikciUid}-${siparis.siparisNo}`,
        tur: 'stok',
        baslik: `${siparis.urun} için otomatik sipariş açıldı`,
        detay:
          `${siparis.firmaAdi} üzerinden ${siparis.miktar} adet sipariş oluşturuldu. ` +
          `Sipariş no ${siparis.siparisNo}, durum ${siparis.durum.toLocaleLowerCase('tr-TR')} olarak izleniyor.`,
        zaman: tarihFormatla(siparis.tarih),
        sayfa: 'alicilar',
        sekme: 'siparisler',
      }))

    const kritikStokBildirimleri = dashboardCanliOzetler.kritikStokluUrunler.slice(0, 3).map((urun) => ({
      id: `kritik-${urun.uid}`,
      tur: 'kritik',
      baslik: `${urun.ad} kritik stokta`,
      detay: `Minimum ${urun.minimumStok}, mevcut ${urun.magazaStok}. Yeniden sipariş planlanmalı.`,
      zaman: 'Az önce',
      sayfa: 'envanter',
    }))

    const stokLogBildirimleri = stokDegisimLoglari.slice(0, 3).map((log) => ({
      id: `stok-log-${log.id}`,
      tur: 'stok',
      baslik: `${log.urun} için ${log.islem.toLocaleLowerCase('tr-TR')}`,
      detay: `${log.eskiStok} adetten ${log.yeniStok} adede güncellendi. ${log.aciklama}`,
      zaman: log.tarih,
      sayfa: 'urun-duzenleme',
      sekme: 'stok-gecmisi',
    }))

    const sonSatisBildirimleri = siraliSiparisler.slice(0, 3).map((siparis) => ({
      id: `satis-${siparis.siparisNo}`,
      tur: 'satis',
      baslik: `${siparis.siparisNo} numaralı sipariş kaydedildi`,
      detay: `${siparis.musteri} için ${siparis.urun} satıldı. Tutar ${paraFormatla(siparis.toplamTutar)}.`,
      zaman: tarihFormatla(siparis.siparisTarihi),
      sayfa: 'siparisler',
    }))

    const bekleyenTahsilatBildirimleri = siraliSiparisler
      .filter((siparis) => siparis.odemeDurumu === 'Beklemede')
      .slice(0, 2)
      .map((siparis) => ({
        id: `bekleyen-${siparis.siparisNo}`,
        tur: 'tahsilat',
        baslik: `${siparis.siparisNo} tahsilat bekliyor`,
        detay: `${siparis.musteri} için ${paraFormatla(siparis.toplamTutar)} tutarında ödeme bekleniyor.`,
        zaman: tarihFormatla(siparis.siparisTarihi),
        sayfa: 'odemeler',
        sekme: 'gelen',
      }))

    return [
      ...otomatikTedarikBildirimleri,
      ...kritikStokBildirimleri,
      ...stokLogBildirimleri,
      ...sonSatisBildirimleri,
      ...bekleyenTahsilatBildirimleri,
    ].slice(0, 8)
  }, [dashboardCanliOzetler.kritikStokluUrunler, paraFormatla, siraliSiparisler, stokDegisimLoglari, tedarikSiparisleri, tarihFormatla])

  const bildirimler = useMemo(
    () => tumBildirimler.filter((bildirim) => !temizlenenBildirimler.includes(bildirim.id)),
    [temizlenenBildirimler, tumBildirimler],
  )

  const okunmamisBildirimSayisi = useMemo(
    () => bildirimler.filter((bildirim) => !okunanBildirimler.includes(bildirim.id)).length,
    [bildirimler, okunanBildirimler],
  )


  useEffect(() => {
    if (!aiPanelKapaniyor) return undefined
    const zamanlayici = window.setTimeout(() => {
      setAiPanelAcik(false)
      setAiPanelKapaniyor(false)
    }, 260)
    return () => window.clearTimeout(zamanlayici)
  }, [aiPanelKapaniyor])

  useEffect(() => {
    if (!bildirimPanelKapaniyor) return undefined
    const zamanlayici = window.setTimeout(() => {
      setBildirimPanelAcik(false)
      setBildirimPanelKapaniyor(false)
    }, 240)
    return () => window.clearTimeout(zamanlayici)
  }, [bildirimPanelKapaniyor])

  useEffect(() => {
    const aktifBildirimIdleri = tumBildirimler.map((bildirim) => bildirim.id)
    setOkunanBildirimler((onceki) => onceki.filter((id) => aktifBildirimIdleri.includes(id)))
    setTemizlenenBildirimler((onceki) => onceki.filter((id) => aktifBildirimIdleri.includes(id)))
  }, [tumBildirimler])

  useEffect(() => {
    setAiTemaMenuAcik(false)
    if (aktifSayfa === 'merkez') {
      setBildirimPanelAcik(false)
      setBildirimPanelKapaniyor(false)
      setAiPanelAcik(false)
      setAiPanelKapaniyor(false)
      setAiPanelKucuk(false)
    }
  }, [aktifSayfa])

  const aiMesajGonder = (hazirMetin) => {
    const metin = (hazirMetin ?? aiMesajMetni).trim()
    if (!metin || aiYukleniyor) return

    if (!hazirMetin) setAiMesajMetni('')

    if (metin === 'Diğer') {
      setAiHizliKonularAcik(false)
      return
    }

    const saatStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const mesajId = Date.now().toString()
    const typingId = mesajId + '-typing'

    setAiMesajlar((onceki) => [
      ...onceki,
      { id: mesajId, rol: 'kullanici', metin, saat: saatStr },
      { id: typingId, rol: 'bot', metin: '...', saat: '', yukleniyor: true }
    ])
    
    setAiHizliKonularAcik(false)
    setAiYukleniyor(true)

    const gecmis = aiGecmisRef.current.slice(-20)

    apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ message: metin, history: gecmis })
    })
      .then((data) => {
        const yanit = data.reply || 'Yanıt alınamadı.'
        
        aiGecmisRef.current = [
          ...aiGecmisRef.current,
          { role: 'user', content: metin },
          { role: 'assistant', content: yanit }
        ].slice(-20)

        const yanitSaat = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        setAiMesajlar((onceki) =>
          onceki.map((m) => (m.id === typingId ? { ...m, metin: yanit, saat: yanitSaat, yukleniyor: false } : m))
        )
      })
      .catch((err) => {
        const hataMesaji = err?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
        setAiMesajlar((onceki) =>
          onceki.map((m) =>
            m.id === typingId ? { ...m, metin: `⚠️ ${hataMesaji}`, saat: 'Hata', yukleniyor: false } : m
          )
        )
      })
      .finally(() => {
        setAiYukleniyor(false)
      })
  }

  const aiPaneliAc = () => {
    setAiTemaMenuAcik(false)
    setAiPanelKapaniyor(false)
    setAiHizliKonularAcik(true)
    setAiPanelAcik(true)
    setAiPanelKucuk(false)
  }

  const aiPaneliKapat = () => {
    setAiTemaMenuAcik(false)
    setAiPanelKapaniyor(true)
  }

  const sohbetiTemizle = () => {
    setAiMesajlar([
      { id: 1, rol: 'bot', metin: 'Tekrardan hoş geldiniz, size nasıl yardımcı olabilirim?', saat: 'Şimdi' },
    ])
    aiGecmisRef.current = []
    setAiHizliKonularAcik(true)
    setAiMesajMetni('')
  }

  const aiPanelDugmeTikla = () => {
    if (aiPanelAcik && !aiPanelKucuk && !aiPanelKapaniyor) {
      aiPaneliKapat()
      return
    }
    aiPaneliAc()
  }

  const bildirimPaneliKapat = () => setBildirimPanelKapaniyor(true)

  const bildirimPaneliAc = () => {
    setBildirimPanelKapaniyor(false)
    setBildirimPanelAcik(true)
  }

  const bildirimDugmesiTikla = () => {
    if (bildirimPanelAcik && !bildirimPanelKapaniyor) {
      bildirimPaneliKapat()
      return
    }
    bildirimPaneliAc()
  }

  const bildirimiOkunduYap = (bildirimId) => {
    setOkunanBildirimler((onceki) => (onceki.includes(bildirimId) ? onceki : [...onceki, bildirimId]))
  }

  const bildirimiOkunmadiYap = (bildirimId) => {
    setOkunanBildirimler((onceki) => onceki.filter((id) => id !== bildirimId))
  }

  const bildirimiTemizle = (bildirimId) => {
    setTemizlenenBildirimler((onceki) => (onceki.includes(bildirimId) ? onceki : [...onceki, bildirimId]))
    setOkunanBildirimler((onceki) => onceki.filter((id) => id !== bildirimId))
  }

  const tumBildirimleriTemizle = () => {
    setTemizlenenBildirimler(bildirimler.map((bildirim) => bildirim.id))
    toastGoster?.('basari', 'Tüm bildirimler temizlendi.')
  }

  const bildirimdenSayfayaGit = (bildirim) => {
    bildirimiOkunduYap(bildirim.id)
    bildirimPaneliKapat()
    sayfaDegistir?.(bildirim.sayfa)

    if (!bildirim.sekme) return

    if (bildirim.sayfa === 'urun-duzenleme') {
      window.setTimeout(() => onUrunDuzenlemeSekmeDegistir?.(bildirim.sekme), 0)
      return
    }

    if (bildirim.sayfa === 'odemeler') {
      window.setTimeout(() => onOdemeSekmeDegistir?.(bildirim.sekme), 0)
      return
    }

    if (bildirim.sayfa === 'alicilar') {
      window.setTimeout(() => onTedarikciSekmeDegistir?.(bildirim.sekme), 0)
    }
  }

  return {
    aiHizliKonular,
    aiHizliKonularAcik,
    aiMesajGonder,
    aiMesajMetni,
    aiMesajlar,
    aiPanelAcik,
    aiPanelKapaniyor,
    aiPanelDugmeTikla,
    aiPanelKucuk,
    aiPaneliKapat,
    aiTemaMenuAcik,
    bildirimDugmesiTikla,
    bildirimPanelAcik,
    bildirimPanelKapaniyor,
    bildirimPaneliKapat,
    bildirimdenSayfayaGit,
    bildirimler,
    bildirimiOkunduYap,
    bildirimiOkunmadiYap,
    bildirimiTemizle,
    okunanBildirimler,
    okunmamisBildirimSayisi,
    setAiHizliKonularAcik,
    setAiMesajMetni,
    setAiPanelKucuk,
    setAiTemaMenuAcik,
    tumBildirimleriTemizle,
    aiYukleniyor,
    sohbetiTemizle,
  }
}
