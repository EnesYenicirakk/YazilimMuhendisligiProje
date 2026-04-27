import { aiHizliKonular, enCokSatilanUrunleriHesapla, metniNormalizeEt } from '../../shared/utils/constantsAndHelpers'
import { fetchAiResponse } from '../services/aiService'

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

  const aiHazirCevaplar = useMemo(() => {
    const enSonSiparis = siraliSiparisler[0]
    const referansTarih = new Date()
    const buAySiparisleri = siraliSiparisler.filter((siparis) => {
      const tarih = new Date(`${siparis.siparisTarihi}T00:00:00`)
      return tarih.getMonth() === referansTarih.getMonth() && tarih.getFullYear() === referansTarih.getFullYear()
    })

    const buAyToplamSatis = buAySiparisleri.reduce((toplam, siparis) => toplam + siparis.toplamTutar, 0)
    const enYuksekAylikSiparis = [...buAySiparisleri].sort((a, b) => b.toplamTutar - a.toplamTutar)[0]
    const dusukStokluUrunler = [...urunler]
      .filter((urun) => dashboardCanliOzetler.kritikStokluUrunler.some((kritikUrun) => kritikUrun.uid === urun.uid))
      .sort((a, b) => a.magazaStok - b.magazaStok)
      .slice(0, 4)
    const kargolananSiparisler = siraliSiparisler.filter(
      (siparis) =>
        siparis.teslimatDurumu === 'Yolda' ||
        siparis.teslimatDurumu === 'Kargoda' ||
        siparis.teslimatDurumu === 'Teslim Edildi',
    )
    const teslimEdilenler = kargolananSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Teslim Edildi')
    const yoldakiler = kargolananSiparisler.filter(
      (siparis) => siparis.teslimatDurumu === 'Yolda' || siparis.teslimatDurumu === 'Kargoda',
    )
    const kargolanmayanSiparisler = siraliSiparisler.filter((siparis) => siparis.teslimatDurumu === 'Hazırlanıyor')
    const kargolanmayanOzet = kargolanmayanSiparisler.slice(0, 3).map((siparis) => `${siparis.siparisNo} - ${siparis.urun}`).join(', ')

    const enCokSatanlar = enCokSatilanUrunleriHesapla(siraliSiparisler, 3)
      .map((urun) => `${urun.ad} (${urun.miktar} adet)`)
      .join(', ')

    return {
      [metniNormalizeEt('Bu ay gerçekleşen satışlar hakkında bilgi ver.')]:
        `Bu ay toplam ${buAySiparisleri.length} siparişten ${paraFormatla(buAyToplamSatis)} ciro oluştu. En yüksek tutarlı sipariş ${enYuksekAylikSiparis?.siparisNo ?? '-'} numaralı kayıtta, ${enYuksekAylikSiparis?.musteri ?? '-'} için ${paraFormatla(enYuksekAylikSiparis?.toplamTutar ?? 0)} olarak görünüyor.`,
      [metniNormalizeEt('Bana stokları azalan ürünlerimiz hakkında bilgi ver.')]:
        dusukStokluUrunler.length > 0
          ? `Kritik stok seviyesine düşen ürünler: ${dusukStokluUrunler.map((urun) => `${urun.ad} (minimum ${urun.minimumStok} / mevcut ${urun.magazaStok})`).join(', ')}. Bu ürünler için yeniden sipariş açılması gerekiyor.`
          : 'Şu an kritik eşik altında görünen bir ürün yok. Envanter genel olarak dengeli görünüyor.',
      [metniNormalizeEt('Kargolanan siparişlerin teslimi yapıldı mı')]:
        `Toplam ${kargolananSiparisler.length} sipariş kargoya çıktı. Bunların ${teslimEdilenler.length} adedi teslim edildi, ${yoldakiler.length} adedi ise hâlâ yolda. En yakın teslimat beklenen kayıtlar dashboarddaki son siparişler tablosunda da görünüyor.`,
      [metniNormalizeEt('Hangi siparişlerimiz henüz kargolanmadı')]:
        kargolanmayanSiparisler.length > 0
          ? `Şu an ${kargolanmayanSiparisler.length} sipariş henüz kargolanmadı. Öne çıkan kayıtlar: ${kargolanmayanOzet}. Bu siparişlerin durumu siparişler ekranında "Hazırlanıyor" olarak işaretli.`
          : 'Şu anda kargolanmamış açık sipariş görünmüyor. Tüm kayıtlar ya yolda ya da teslim edilmiş durumda.',
      [metniNormalizeEt('En çok satan ürünlerimizden bana bahset.')]:
        enCokSatanlar
          ? `Sipariş kaydına göre öne çıkan ürünler: ${enCokSatanlar}. Bu ürünler dashboarddaki "En Çok Satılan Ürünler" alanıyla aynı veriden hesaplanıyor.`
          : 'Teslim edilmiş siparişlere göre öne çıkan bir ürün verisi henüz oluşmadı.',
      [metniNormalizeEt('En son gerçekleşen satışın ayrıntılarını anlat.')]:
        enSonSiparis
          ? `En son satış ${enSonSiparis.siparisNo} numarasıyla ${tarihFormatla(enSonSiparis.siparisTarihi)} tarihinde oluşturuldu. Ürün ${enSonSiparis.urun}, müşteri ${enSonSiparis.musteri}, tutar ${paraFormatla(enSonSiparis.toplamTutar)} ve teslimat durumu ${enSonSiparis.teslimatDurumu.toLocaleLowerCase('tr-TR')} olarak kayıtlı.`
          : 'En son satış kaydı şu anda bulunamadı.',
    }
  }, [dashboardCanliOzetler.kritikStokluUrunler, paraFormatla, siraliSiparisler, tarihFormatla, urunler])

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
    if (!metin) return

    const normalizeMetin = metniNormalizeEt(metin)
    setAiHizliKonularAcik(false)
    setAiMesajlar((onceki) => [...onceki, { id: Date.now(), rol: 'kullanici', metin, saat: 'Şimdi' }])
    if (!hazirMetin) setAiMesajMetni('')

    if (normalizeMetin === metniNormalizeEt('Diğer')) return

    const hazirCevap = aiHazirCevaplar[normalizeMetin]
    if (hazirCevap) {
      window.setTimeout(() => {
        setAiMesajlar((onceki) => [...onceki, { id: Date.now() + 1, rol: 'bot', metin: hazirCevap, saat: 'Şimdi' }])
      }, 320)
    } else {
      // Dış API'den cevap al
      const botMesajId = Date.now() + 1
      setAiMesajlar((onceki) => [...onceki, { id: botMesajId, rol: 'bot', metin: 'Düşünüyorum...', saat: 'Şimdi' }])

      fetchAiResponse(metin)
        .then((cevap) => {
          setAiMesajlar((onceki) => 
            onceki.map(m => m.id === botMesajId ? { ...m, metin: cevap } : m)
          )
        })
        .catch((error) => {
          setAiMesajlar((onceki) => 
            onceki.map(m => m.id === botMesajId ? { ...m, metin: 'Üzgünüm, şu an cevap veremiyorum. ' + error.message } : m)
          )
        })
    }
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
  }
}
