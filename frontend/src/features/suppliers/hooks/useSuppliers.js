import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../../core/api/apiClient'
import {
  bosTedarikciFormu,
  bosTedarikciSiparisFormu,
  favorileriOneTasi,
  metniNormalizeEt,
  negatifSayiVarMi,
  telefonGecerliMi,
  telefonuNormalizeEt,
} from '../../../shared/utils/constantsAndHelpers'

const TEDARIKCI_SAYFA_BASINA = 8
const bugunYmd = () => new Date().toISOString().slice(0, 10)

const mapTedarikci = (t) => ({
  uid: t.uid,
  firmaAdi: t.firmaAdi,
  yetkiliKisi: t.yetkiliKisi ?? '',
  telefon: t.telefon ?? '',
  email: t.email ?? '',
  adres: t.adres ?? '',
  vergiNumarasi: t.vergiNumarasi ?? '',
  urunGrubu: t.urunGrubu ?? '',
  not: '',
  toplamHarcama: 0,
  toplamAlisSayisi: 0,
  ortalamaTeslimSuresi: '3-5 iş günü',
  siparisler: [],
  alinanUrunler: [],
  fiyatGecmisi: [],
  favori: false,
})

const mapTedarikSiparisi = (s, tedarikci) => ({
  uid: s.uid,
  siparisNo: s.siparisNo,
  tarih: s.siparisTarihi ? String(s.siparisTarihi).slice(0, 10) : '',
  olusturulmaZamani: s.created_at,
  tutar: s.toplamTutar ?? 0,
  durum: s.durum === 'completed' ? 'Teslim alındı' : s.durum === 'pending' ? 'Bekliyor' : (s.durum ?? 'Bekliyor'),
  tedarikciUid: tedarikci.uid,
  firmaAdi: tedarikci.firmaAdi,
  yetkiliKisi: tedarikci.yetkiliKisi,
  telefon: tedarikci.telefon,
})

const siparisZamaniniAl = (s) => {
  const t = s?.olusturulmaZamani ? new Date(s.olusturulmaZamani).getTime() : Number.NaN
  return Number.isNaN(t) ? new Date(`${s?.tarih ?? ''}T00:00:00`).getTime() || 0 : t
}

export default function useSuppliers({ toastGoster, isLoggedIn }) {
  const [tedarikciler, setTedarikciler] = useState([])
  const [tumTedarikSiparisleriListe, setTumTedarikSiparisleriListe] = useState([])
  const [tedarikciArama, setTedarikciArama] = useState('')
  const [tedarikciSekmesi, setTedarikciSekmesi] = useState('liste')
  const [tedarikciSayfa, setTedarikciSayfa] = useState(1)
  const [tedarikciSiparisSayfa, setTedarikciSiparisSayfa] = useState(1)
  const [tedarikciDetaySekmesi, setTedarikciDetaySekmesi] = useState('genel')
  const [tedarikciEklemeAcik, setTedarikciEklemeAcik] = useState(false)
  const [tedarikciDuzenlemeAcik, setTedarikciDuzenlemeAcik] = useState(false)
  const [tedarikciNotAcik, setTedarikciNotAcik] = useState(false)
  const [tedarikciDetayAcik, setTedarikciDetayAcik] = useState(false)
  const [seciliTedarikciUid, setSeciliTedarikciUid] = useState(null)
  const [tedarikciFormu, setTedarikciFormu] = useState(bosTedarikciFormu)
  const [tedarikciNotMetni, setTedarikciNotMetni] = useState('')
  const [silinecekTedarikci, setSilinecekTedarikci] = useState(null)
  const [tedarikciSiparisEklemeAcik, setTedarikciSiparisEklemeAcik] = useState(false)
  const [tedarikciSiparisFormu, setTedarikciSiparisFormu] = useState(bosTedarikciSiparisFormu)
  const [genelTedarikSiparisAcik, setGenelTedarikSiparisAcik] = useState(false)
  const [genelTedarikSiparisFormu, setGenelTedarikSiparisFormu] = useState({ tedarikciUid: '', ...bosTedarikciSiparisFormu })

  const veriYukle = useCallback(async () => {
    try {
      const [tedData, sipData] = await Promise.all([
        api.get('/suppliers'),
        api.get('/supplier-orders'),
      ])
      const tedListesi = (tedData?.data ?? tedData ?? []).map(mapTedarikci)
      setTedarikciler(tedListesi)

      const sipListesi = (sipData?.data ?? sipData ?? []).map((s) => {
        const ted = tedListesi.find((t) => t.uid === s.tedarikciUid) ?? { uid: s.tedarikciUid, firmaAdi: s.tedarikci ?? '—', yetkiliKisi: '', telefon: '' }
        return mapTedarikSiparisi(s, ted)
      })
      setTumTedarikSiparisleriListe(sipListesi)
    } catch {
      toastGoster?.('hata', 'Tedarikçi verileri yüklenirken hata oluştu.')
    }
  }, [toastGoster])

  useEffect(() => { if (isLoggedIn) veriYukle() }, [isLoggedIn, veriYukle])

  const filtreliTedarikciler = useMemo(() => {
    const metin = tedarikciArama.trim().toLowerCase()
    const sonuc = !metin ? tedarikciler : tedarikciler.filter((t) =>
      t.firmaAdi.toLowerCase().includes(metin) || t.telefon.toLowerCase().includes(metin) ||
      t.yetkiliKisi.toLowerCase().includes(metin) || t.urunGrubu.toLowerCase().includes(metin),
    )
    return favorileriOneTasi(sonuc, (t) => t.toplamHarcama)
  }, [tedarikciArama, tedarikciler])

  const toplamTedarikciSayfa = Math.max(1, Math.ceil(filtreliTedarikciler.length / TEDARIKCI_SAYFA_BASINA))
  const tedarikciBaslangic = (tedarikciSayfa - 1) * TEDARIKCI_SAYFA_BASINA
  const sayfadakiTedarikciler = filtreliTedarikciler.slice(tedarikciBaslangic, tedarikciBaslangic + TEDARIKCI_SAYFA_BASINA)
  const seciliTedarikci = tedarikciler.find((t) => t.uid === seciliTedarikciUid) ?? null

  const tumTedarikSiparisleri = useMemo(
    () => [...tumTedarikSiparisleriListe].sort((a, b) => siparisZamaniniAl(b) - siparisZamaniniAl(a)),
    [tumTedarikSiparisleriListe],
  )

  const toplamTedarikSiparisSayfa = Math.max(1, Math.ceil(tumTedarikSiparisleri.length / TEDARIKCI_SAYFA_BASINA))
  const tedarikSiparisBaslangic = (tedarikciSiparisSayfa - 1) * TEDARIKCI_SAYFA_BASINA
  const sayfadakiTedarikSiparisleri = tumTedarikSiparisleri.slice(tedarikSiparisBaslangic, tedarikSiparisBaslangic + TEDARIKCI_SAYFA_BASINA)

  useEffect(() => { if (tedarikciSayfa > toplamTedarikciSayfa) setTedarikciSayfa(toplamTedarikciSayfa) }, [tedarikciSayfa, toplamTedarikciSayfa])
  useEffect(() => { setTedarikciSayfa(1) }, [tedarikciArama])
  useEffect(() => { if (tedarikciSiparisSayfa > toplamTedarikSiparisSayfa) setTedarikciSiparisSayfa(toplamTedarikSiparisSayfa) }, [tedarikciSiparisSayfa, toplamTedarikSiparisSayfa])

  const tedarikciFormuTemizle = () => { setSeciliTedarikciUid(null); setTedarikciFormu(bosTedarikciFormu); setTedarikciNotMetni(''); setTedarikciDetaySekmesi('genel') }
  const tedarikciEklemeKapat = () => { setTedarikciEklemeAcik(false); tedarikciFormuTemizle() }
  const tedarikciDuzenlemeKapat = () => { setTedarikciDuzenlemeAcik(false); tedarikciFormuTemizle() }
  const tedarikciNotKapat = () => { setTedarikciNotAcik(false); setSeciliTedarikciUid(null); setTedarikciNotMetni('') }
  const tedarikciDetayKapat = () => { setTedarikciDetayAcik(false); setSeciliTedarikciUid(null); setTedarikciDetaySekmesi('genel') }
  const tedarikciSiparisKapat = () => { setTedarikciSiparisEklemeAcik(false); setTedarikciSiparisFormu(bosTedarikciSiparisFormu) }
  const genelTedarikSiparisKapat = () => { setGenelTedarikSiparisAcik(false); setGenelTedarikSiparisFormu({ tedarikciUid: '', ...bosTedarikciSiparisFormu }) }
  const tedarikciSilmeKapat = () => setSilinecekTedarikci(null)
  const tedarikciModallariniKapat = () => { tedarikciEklemeKapat(); tedarikciDuzenlemeKapat(); tedarikciNotKapat(); tedarikciDetayKapat(); tedarikciSiparisKapat(); genelTedarikSiparisKapat(); tedarikciSilmeKapat() }

  const tedarikciSayfayaGit = (s) => { if (s >= 1 && s <= toplamTedarikciSayfa) setTedarikciSayfa(s) }
  const tedarikciSiparisSayfayaGit = (s) => { if (s >= 1 && s <= toplamTedarikSiparisSayfa) setTedarikciSiparisSayfa(s) }

  const tedarikciEklemeAc = () => { tedarikciFormuTemizle(); setTedarikciEklemeAcik(true) }
  const tedarikciDuzenlemeAc = (t) => { setSeciliTedarikciUid(t.uid); setTedarikciFormu({ firmaAdi: t.firmaAdi, yetkiliKisi: t.yetkiliKisi, telefon: t.telefon, email: t.email, adres: t.adres, vergiNumarasi: t.vergiNumarasi, urunGrubu: t.urunGrubu, not: t.not, toplamAlisSayisi: String(t.toplamAlisSayisi), ortalamaTeslimSuresi: t.ortalamaTeslimSuresi, toplamHarcama: String(t.toplamHarcama) }); setTedarikciDuzenlemeAcik(true) }
  const tedarikciDetayAc = (t) => { setSeciliTedarikciUid(t.uid); setTedarikciDetaySekmesi('genel'); setTedarikciDetayAcik(true) }
  const tedarikciNotAc = (t) => { setSeciliTedarikciUid(t.uid); setTedarikciNotMetni(t.not); setTedarikciNotAcik(true) }
  const tedarikciFormuGuncelle = (alan, deger) => setTedarikciFormu((p) => ({ ...p, [alan]: deger }))
  const tedarikciFavoriDegistir = (uid) => setTedarikciler((p) => p.map((t) => (t.uid === uid ? { ...t, favori: !t.favori } : t)))

  const epostaGecerliMi = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const tedarikciKaydet = async (mod) => {
    const firmaAdi = tedarikciFormu.firmaAdi?.trim()
    const yetkiliKisi = tedarikciFormu.yetkiliKisi?.trim()
    const telefon = tedarikciFormu.telefon?.trim()
    const email = tedarikciFormu.email?.trim()
    if (!firmaAdi || !yetkiliKisi || !telefon || !email) { toastGoster?.('hata', 'Zorunlu alanlar eksik.'); return }
    if (!telefonGecerliMi(telefon)) { toastGoster?.('hata', 'Telefon 0 ile başlamalı ve 11 haneli olmalı.'); return }
    if (!epostaGecerliMi(email)) { toastGoster?.('hata', 'Geçerli bir e-posta girin.'); return }

    const payload = { company_name: firmaAdi, contact_person: yetkiliKisi, phone: telefon, email, address: tedarikciFormu.adres, tax_number: tedarikciFormu.vergiNumarasi, product_group: tedarikciFormu.urunGrubu }

    try {
      if (mod === 'ekle') {
        const yanit = await api.post('/suppliers', payload)
        const yeni = yanit?.data ?? yanit
        setTedarikciler((p) => [mapTedarikci(yeni), ...p])
        setTedarikciSayfa(1)
        tedarikciEklemeKapat()
        toastGoster?.('basari', `${firmaAdi} tedarikçi listesine eklendi.`)
      } else {
        await api.put(`/suppliers/${seciliTedarikciUid}`, payload)
        setTedarikciler((p) => p.map((t) => t.uid === seciliTedarikciUid ? { ...t, firmaAdi, yetkiliKisi, telefon, email, adres: tedarikciFormu.adres, vergiNumarasi: tedarikciFormu.vergiNumarasi, urunGrubu: tedarikciFormu.urunGrubu } : t))
        tedarikciDuzenlemeKapat()
        toastGoster?.('basari', `${firmaAdi} tedarikçi kaydı güncellendi.`)
      }
    } catch { toastGoster?.('hata', 'İşlem sırasında hata oluştu.') }
  }

  const tedarikciNotKaydet = async () => {
    const temizNot = tedarikciNotMetni.trim()
    if (!temizNot) { toastGoster?.('hata', 'Not boş bırakılamaz.'); return }
    const secili = tedarikciler.find((t) => t.uid === seciliTedarikciUid)
    setTedarikciler((p) => p.map((t) => (t.uid === seciliTedarikciUid ? { ...t, not: temizNot } : t)))
    tedarikciNotKapat()
    toastGoster?.('basari', `${secili?.firmaAdi ?? 'Tedarikçi'} notu kaydedildi.`)
  }

  const tedarikciSiparisFormuGuncelle = (alan, deger) => setTedarikciSiparisFormu((p) => ({ ...p, [alan]: deger }))
  const tedarikciSiparisNoOlustur = () => `TS-${String(Date.now()).slice(-6)}`

  const genelTedarikSiparisFormuGuncelle = (alan, deger) =>
    setGenelTedarikSiparisFormu((p) => (alan === 'tedarikciUid' ? { ...p, tedarikciUid: deger } : { ...p, [alan]: deger }))

  const tedarikciSiparisEklemeAc = () => {
    if (!seciliTedarikciUid) return
    setTedarikciSiparisFormu({ siparisNo: tedarikciSiparisNoOlustur(), tarih: bugunYmd(), tutar: '', durum: 'Bekliyor' })
    setTedarikciSiparisEklemeAcik(true)
  }

  const genelTedarikSiparisEklemeAc = () => {
    const ilk = tedarikciler[0]
    setGenelTedarikSiparisFormu({ tedarikciUid: ilk ? String(ilk.uid) : '', siparisNo: tedarikciSiparisNoOlustur(), tarih: bugunYmd(), tutar: '', durum: 'Bekliyor' })
    setGenelTedarikSiparisAcik(true)
  }

  const tedarikciSiparisKaydet = async () => {
    const tutar = Number(tedarikciSiparisFormu.tutar)
    if (!seciliTedarikciUid || !tedarikciSiparisFormu.siparisNo || Number.isNaN(tutar)) { toastGoster?.('hata', 'Eksik veya hatalı alan var.'); return }
    if (negatifSayiVarMi(tutar)) { toastGoster?.('hata', 'Sipariş tutarı negatif olamaz.'); return }
    try {
      const yanit = await api.post('/supplier-orders', { supplier_id: seciliTedarikciUid, order_number: tedarikciSiparisFormu.siparisNo, total_amount: tutar, order_date: tedarikciSiparisFormu.tarih, status: tedarikciSiparisFormu.durum === 'Bekliyor' ? 'pending' : 'completed', items: [] })
      const yeni = yanit?.data ?? yanit
      const ted = tedarikciler.find((t) => t.uid === seciliTedarikciUid) ?? { uid: seciliTedarikciUid, firmaAdi: '—', yetkiliKisi: '', telefon: '' }
      setTumTedarikSiparisleriListe((p) => [mapTedarikSiparisi(yeni, ted), ...p])
      tedarikciSiparisKapat()
      toastGoster?.('basari', `${tedarikciSiparisFormu.siparisNo} numaralı tedarikçi siparişi oluşturuldu.`)
    } catch { toastGoster?.('hata', 'Sipariş oluşturulurken hata oluştu.') }
  }

  const genelTedarikSiparisKaydet = async () => {
    const tedarikciUid = Number(genelTedarikSiparisFormu.tedarikciUid)
    const tutar = Number(genelTedarikSiparisFormu.tutar)
    const secili = tedarikciler.find((t) => t.uid === tedarikciUid)
    if (!tedarikciUid || !secili || !genelTedarikSiparisFormu.siparisNo || Number.isNaN(tutar)) { toastGoster?.('hata', 'Eksik veya hatalı alan var.'); return }
    if (negatifSayiVarMi(tutar)) { toastGoster?.('hata', 'Sipariş tutarı negatif olamaz.'); return }
    try {
      const yanit = await api.post('/supplier-orders', { supplier_id: tedarikciUid, order_number: genelTedarikSiparisFormu.siparisNo, total_amount: tutar, order_date: genelTedarikSiparisFormu.tarih, status: 'pending', items: [] })
      const yeni = yanit?.data ?? yanit
      setTumTedarikSiparisleriListe((p) => [mapTedarikSiparisi(yeni, secili), ...p])
      setTedarikciSiparisSayfa(1)
      genelTedarikSiparisKapat()
      toastGoster?.('basari', `${secili.firmaAdi} için ${genelTedarikSiparisFormu.siparisNo} numaralı sipariş oluşturuldu.`)
    } catch { toastGoster?.('hata', 'Sipariş oluşturulurken hata oluştu.') }
  }

  // Otomatik tedarik siparişi — UI sadece bildirim amaçlı; API çağrısı yapar
  const otomatikTedarikSiparisiOlustur = ({ urun }) => {
    if (!urun) return null
    const eslesenTedarikci = tedarikciler.find((t) => metniNormalizeEt(t.urunGrubu) === metniNormalizeEt(urun.kategori ?? '')) ?? tedarikciler[0]
    if (!eslesenTedarikci) return null
    toastGoster?.('uyari', `${urun.ad} için otomatik sipariş oluşturuldu.`)
    return { tedarikciUid: eslesenTedarikci.uid, firmaAdi: eslesenTedarikci.firmaAdi }
  }

  const tedarikciSil = async () => {
    if (!silinecekTedarikci) return
    const silinenAd = silinecekTedarikci.firmaAdi
    try {
      await api.delete(`/suppliers/${silinecekTedarikci.uid}`)
      setTedarikciler((p) => p.filter((t) => t.uid !== silinecekTedarikci.uid))
      tedarikciSilmeKapat()
      if (seciliTedarikciUid === silinecekTedarikci.uid) tedarikciDetayKapat()
      toastGoster?.('basari', `${silinenAd} tedarikçi listesinden silindi.`)
    } catch { toastGoster?.('hata', 'Tedarikçi silinirken hata oluştu.') }
  }

  const urunIcinTedarikciBul = (urun) => {
    if (!urun) return null
    const kat = metniNormalizeEt(urun.kategori ?? '')
    return tedarikciler.find((t) => metniNormalizeEt(t.urunGrubu) === kat) ?? tedarikciler[0] ?? null
  }

  return {
    tedarikciler, tedarikciArama, setTedarikciArama, tedarikciSekmesi, setTedarikciSekmesi,
    tedarikciSayfa, setTedarikciSayfa, tedarikciSiparisSayfa, setTedarikciSiparisSayfa,
    tedarikciDetaySekmesi, setTedarikciDetaySekmesi, tedarikciEklemeAcik, tedarikciDuzenlemeAcik,
    tedarikciNotAcik, tedarikciDetayAcik, seciliTedarikciUid, tedarikciFormu, tedarikciNotMetni,
    setTedarikciNotMetni, silinecekTedarikci, setSilinecekTedarikci, tedarikciSiparisEklemeAcik,
    tedarikciSiparisFormu, genelTedarikSiparisAcik, genelTedarikSiparisFormu,
    toplamTedarikciSayfa, tedarikciBaslangic, sayfadakiTedarikciler, seciliTedarikci,
    tumTedarikSiparisleri, toplamTedarikSiparisSayfa, tedarikSiparisBaslangic, sayfadakiTedarikSiparisleri,
    tedarikciFormuTemizle, tedarikciEklemeKapat, tedarikciDuzenlemeKapat, tedarikciNotKapat,
    tedarikciDetayKapat, tedarikciSiparisKapat, genelTedarikSiparisKapat, tedarikciSilmeKapat,
    tedarikciModallariniKapat, tedarikciSayfayaGit, tedarikciSiparisSayfayaGit, tedarikciEklemeAc,
    tedarikciDuzenlemeAc, tedarikciDetayAc, tedarikciNotAc, tedarikciFormuGuncelle,
    tedarikciFavoriDegistir, urunIcinTedarikciBul, tedarikciKaydet, tedarikciNotKaydet,
    tedarikciSiparisFormuGuncelle, genelTedarikSiparisFormuGuncelle, tedarikciSiparisEklemeAc,
    genelTedarikSiparisEklemeAc, tedarikciSiparisKaydet, genelTedarikSiparisKaydet,
    otomatikTedarikSiparisiOlustur, tedarikciSil,
  }
}
