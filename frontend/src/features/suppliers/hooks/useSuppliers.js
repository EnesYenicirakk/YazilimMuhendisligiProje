import { useEffect, useMemo, useState } from 'react'
import { supplierApi } from '../../../core/services/backendApiService'
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

const urunAdiEslesiyorMu = (urunAdi, adayMetin) => {
  const normalizeUrunAdi = metniNormalizeEt(urunAdi ?? '')
  const normalizeAdayMetin = metniNormalizeEt(adayMetin ?? '')

  if (!normalizeUrunAdi || !normalizeAdayMetin) return false

  return (
    normalizeUrunAdi === normalizeAdayMetin ||
    normalizeUrunAdi.includes(normalizeAdayMetin) ||
    normalizeAdayMetin.includes(normalizeUrunAdi)
  )
}

const otomatikSiparisNoOlustur = (tedarikci, urunUid) => {
  const onEk =
    tedarikci.firmaAdi
      .split(' ')
      .map((parca) => parca[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'OT'
  const zamanDamgasi = String(Date.now()).slice(-6)
  const urunKuyrugu = String(urunUid).slice(-2).padStart(2, '0')

  return `${onEk}-A${zamanDamgasi}${urunKuyrugu}`
}

const siparisZamaniniAl = (siparis) => {
  const tamZaman = siparis?.olusturulmaZamani
    ? new Date(siparis.olusturulmaZamani).getTime()
    : Number.NaN

  if (!Number.isNaN(tamZaman)) return tamZaman

  const gunBazliZaman = new Date(`${siparis?.tarih ?? ''}T00:00:00`).getTime()
  return Number.isNaN(gunBazliZaman) ? 0 : gunBazliZaman
}

export default function useSuppliers({ toastGoster }) {
  const [tedarikciler, setTedarikciler] = useState([])
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
  const [genelTedarikSiparisFormu, setGenelTedarikSiparisFormu] = useState({
    tedarikciUid: '',
    ...bosTedarikciSiparisFormu,
  })

  const filtreliTedarikciler = useMemo(() => {
    const metin = tedarikciArama.trim().toLowerCase()
    const sonuc = !metin
      ? tedarikciler
      : tedarikciler.filter(
          (tedarikci) =>
            tedarikci.firmaAdi.toLowerCase().includes(metin) ||
            tedarikci.telefon.toLowerCase().includes(metin) ||
            tedarikci.yetkiliKisi.toLowerCase().includes(metin) ||
            tedarikci.urunGrubu.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(sonuc, (tedarikci) => tedarikci.toplamHarcama)
  }, [tedarikciArama, tedarikciler])

  const toplamTedarikciSayfa = Math.max(1, Math.ceil(filtreliTedarikciler.length / TEDARIKCI_SAYFA_BASINA))
  const tedarikciBaslangic = (tedarikciSayfa - 1) * TEDARIKCI_SAYFA_BASINA
  const sayfadakiTedarikciler = filtreliTedarikciler.slice(tedarikciBaslangic, tedarikciBaslangic + TEDARIKCI_SAYFA_BASINA)
  const seciliTedarikci = tedarikciler.find((tedarikci) => tedarikci.uid === seciliTedarikciUid) ?? null

  const urunIcinTedarikciBul = (urun) => {
    if (!urun) return null

    const urunAdi = urun.ad?.trim()
    const kategori = metniNormalizeEt(urun.kategori ?? '')
    const adEslesenTedarikciler = favorileriOneTasi(
      tedarikciler.filter((tedarikci) =>
        Array.isArray(tedarikci.alinanUrunler) &&
        tedarikci.alinanUrunler.some((kalem) => urunAdiEslesiyorMu(urunAdi, kalem.urun)),
      ),
      (tedarikci) => tedarikci.toplamHarcama,
    )

    if (adEslesenTedarikciler[0]) return adEslesenTedarikciler[0]

    const kategoriEslesenTedarikciler = favorileriOneTasi(
      tedarikciler.filter((tedarikci) => metniNormalizeEt(tedarikci.urunGrubu) === kategori),
      (tedarikci) => tedarikci.toplamHarcama,
    )

    if (kategoriEslesenTedarikciler[0]) return kategoriEslesenTedarikciler[0]

    return favorileriOneTasi([...tedarikciler], (tedarikci) => tedarikci.toplamHarcama)[0] ?? null
  }

  const tumTedarikSiparisleri = useMemo(() => {
    const kayitlar = tedarikciler.flatMap((tedarikci) =>
      tedarikci.siparisler.map((siparis) => ({
        ...siparis,
        tedarikciUid: tedarikci.uid,
        firmaAdi: tedarikci.firmaAdi,
        yetkiliKisi: tedarikci.yetkiliKisi,
        telefon: tedarikci.telefon,
      })),
    )
    return kayitlar.sort((a, b) => siparisZamaniniAl(b) - siparisZamaniniAl(a))
  }, [tedarikciler])

  const toplamTedarikSiparisSayfa = Math.max(1, Math.ceil(tumTedarikSiparisleri.length / TEDARIKCI_SAYFA_BASINA))
  const tedarikSiparisBaslangic = (tedarikciSiparisSayfa - 1) * TEDARIKCI_SAYFA_BASINA
  const sayfadakiTedarikSiparisleri = tumTedarikSiparisleri.slice(
    tedarikSiparisBaslangic,
    tedarikSiparisBaslangic + TEDARIKCI_SAYFA_BASINA,
  )

  useEffect(() => {
    const tedarikcileriYukle = async () => {
      try {
        const veriler = await supplierApi.getAll()
        setTedarikciler(veriler)
      } catch (error) {
        console.error('Tedarikçiler yüklenirken hata oluştu:', error)
        toastGoster?.('hata', 'Tedarikçi listesi veritabanından alınamadı.')
      }
    }
    tedarikcileriYukle()
  }, [toastGoster])

  useEffect(() => {
    if (tedarikciSayfa > toplamTedarikciSayfa) setTedarikciSayfa(toplamTedarikciSayfa)
  }, [tedarikciSayfa, toplamTedarikciSayfa])

  useEffect(() => {
    setTedarikciSayfa(1)
  }, [tedarikciArama])

  useEffect(() => {
    if (tedarikciSiparisSayfa > toplamTedarikSiparisSayfa) setTedarikciSiparisSayfa(toplamTedarikSiparisSayfa)
  }, [tedarikciSiparisSayfa, toplamTedarikSiparisSayfa])

  const tedarikciFormuTemizle = () => {
    setSeciliTedarikciUid(null)
    setTedarikciFormu(bosTedarikciFormu)
    setTedarikciNotMetni('')
    setTedarikciDetaySekmesi('genel')
  }
  const tedarikciEklemeKapat = () => { setTedarikciEklemeAcik(false); tedarikciFormuTemizle() }
  const tedarikciDuzenlemeKapat = () => { setTedarikciDuzenlemeAcik(false); tedarikciFormuTemizle() }
  const tedarikciNotKapat = () => { setTedarikciNotAcik(false); setSeciliTedarikciUid(null); setTedarikciNotMetni('') }
  const tedarikciDetayKapat = () => { setTedarikciDetayAcik(false); setSeciliTedarikciUid(null); setTedarikciDetaySekmesi('genel') }
  const tedarikciSiparisKapat = () => { setTedarikciSiparisEklemeAcik(false); setTedarikciSiparisFormu(bosTedarikciSiparisFormu) }
  const genelTedarikSiparisKapat = () => { setGenelTedarikSiparisAcik(false); setGenelTedarikSiparisFormu({ tedarikciUid: '', ...bosTedarikciSiparisFormu }) }
  const tedarikciSilmeKapat = () => setSilinecekTedarikci(null)
  const tedarikciModallariniKapat = () => {
    tedarikciEklemeKapat(); tedarikciDuzenlemeKapat(); tedarikciNotKapat(); tedarikciDetayKapat(); tedarikciSiparisKapat(); genelTedarikSiparisKapat(); tedarikciSilmeKapat()
  }

  const tedarikciSayfayaGit = (sayfa) => { if (sayfa >= 1 && sayfa <= toplamTedarikciSayfa) setTedarikciSayfa(sayfa) }
  const tedarikciSiparisSayfayaGit = (sayfa) => { if (sayfa >= 1 && sayfa <= toplamTedarikSiparisSayfa) setTedarikciSiparisSayfa(sayfa) }

  const tedarikciEklemeAc = () => { tedarikciFormuTemizle(); setTedarikciEklemeAcik(true) }
  const tedarikciDuzenlemeAc = (tedarikci) => {
    setSeciliTedarikciUid(tedarikci.uid)
    setTedarikciFormu({
      firmaAdi: tedarikci.firmaAdi,
      yetkiliKisi: tedarikci.yetkiliKisi,
      telefon: tedarikci.telefon,
      email: tedarikci.email,
      adres: tedarikci.adres,
      vergiNumarasi: tedarikci.vergiNumarasi,
      urunGrubu: tedarikci.urunGrubu,
      not: tedarikci.not,
      toplamAlisSayisi: String(tedarikci.toplamAlisSayisi),
      ortalamaTeslimSuresi: tedarikci.ortalamaTeslimSuresi,
      toplamHarcama: String(tedarikci.toplamHarcama),
    })
    setTedarikciDuzenlemeAcik(true)
  }
  const tedarikciDetayAc = (tedarikci) => { setSeciliTedarikciUid(tedarikci.uid); setTedarikciDetaySekmesi('genel'); setTedarikciDetayAcik(true) }
  const tedarikciNotAc = (tedarikci) => { setSeciliTedarikciUid(tedarikci.uid); setTedarikciNotMetni(tedarikci.not); setTedarikciNotAcik(true) }
  const tedarikciFormuGuncelle = (alan, deger) => setTedarikciFormu((onceki) => ({ ...onceki, [alan]: deger }))
  const tedarikciFavoriDegistir = (uid) => setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === uid ? { ...tedarikci, favori: !tedarikci.favori } : tedarikci)))

  const epostaGecerliMi = (eposta) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)

  const tedarikciKaydet = (mod) => {
    const firmaAdi = tedarikciFormu.firmaAdi.trim()
    const yetkiliKisi = tedarikciFormu.yetkiliKisi.trim()
    const telefon = tedarikciFormu.telefon.trim()
    const email = tedarikciFormu.email.trim()
    const adres = tedarikciFormu.adres.trim()
    const vergiNumarasi = tedarikciFormu.vergiNumarasi.trim()
    const urunGrubu = tedarikciFormu.urunGrubu.trim()
    const not = tedarikciFormu.not.trim()
    const toplamAlisSayisi = Number(tedarikciFormu.toplamAlisSayisi)
    const toplamHarcama = Number(tedarikciFormu.toplamHarcama)
    const ortalamaTeslimSuresi = tedarikciFormu.ortalamaTeslimSuresi.trim()

    if (!firmaAdi || !yetkiliKisi || !telefon || !email || !adres || !vergiNumarasi || !urunGrubu || !not || !ortalamaTeslimSuresi || Number.isNaN(toplamAlisSayisi) || Number.isNaN(toplamHarcama)) {
      toastGoster?.('hata', 'Tedarikçi formunda eksik veya hatalı alan var.')
      return
    }
    if (!telefonGecerliMi(telefon)) {
      toastGoster?.('hata', 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalı.')
      return
    }
    if (!epostaGecerliMi(email)) {
      toastGoster?.('hata', 'Geçerli bir e-posta adresi girin.')
      return
    }
    if (!/^\d{10}$/.test(telefonuNormalizeEt(vergiNumarasi))) {
      toastGoster?.('hata', 'Vergi numarası 10 haneli olmalı.')
      return
    }
    if (negatifSayiVarMi(toplamAlisSayisi, toplamHarcama)) {
      toastGoster?.('hata', 'Alış sayısı ve toplam harcama negatif olamaz.')
      return
    }

    if (mod === 'ekle') {
      const yeniTedarikciData = { firmaAdi, yetkiliKisi, telefon, email, adres, vergiNumarasi, urunGrubu, not }
      supplierApi.create(yeniTedarikciData).then((sunucuVerisi) => {
        setTedarikciler((onceki) => [sunucuVerisi, ...onceki])
        setTedarikciSayfa(1)
        tedarikciEklemeKapat()
        toastGoster?.('basari', `${firmaAdi} tedarikçi listesine eklendi.`)
      }).catch(err => {
        console.error('Tedarikçi eklenirken hata:', err)
        toastGoster?.('hata', 'Tedarikçi eklenirken bir hata oluştu.')
      })
      return
    }

    const guncellenenTedarikciData = { firmaAdi, yetkiliKisi, telefon, email, adres, vergiNumarasi, urunGrubu, not }
    supplierApi.update(seciliTedarikciUid, guncellenenTedarikciData).then((sunucuVerisi) => {
      setTedarikciler((onceki) =>
        onceki.map((t) => (t.uid === seciliTedarikciUid ? sunucuVerisi : t)),
      )
      tedarikciDuzenlemeKapat()
      toastGoster?.('basari', `${firmaAdi} tedarikçi kaydı güncellendi.`)
    }).catch(err => {
      console.error('Tedarikçi güncellenirken hata:', err)
      toastGoster?.('hata', 'Tedarikçi güncellenirken bir hata oluştu.')
    })
  }

  const tedarikciNotKaydet = () => {
    const temizNot = tedarikciNotMetni.trim()
    if (!temizNot) {
      toastGoster?.('hata', 'Tedarikçi notu boş bırakılamaz.')
      return
    }
    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === seciliTedarikciUid)
    setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === seciliTedarikciUid ? { ...tedarikci, not: temizNot } : tedarikci)))
    tedarikciNotKapat()
    toastGoster?.('basari', `${secili?.firmaAdi ?? 'Tedarikçi'} notu kaydedildi.`)
  }

  const tedarikciSiparisFormuGuncelle = (alan, deger) => setTedarikciSiparisFormu((onceki) => ({ ...onceki, [alan]: deger }))

  const tedarikciSiparisNoOlustur = (tedarikciUid) => {
    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === Number(tedarikciUid))
    if (!secili) return ''

    const onEk = secili.firmaAdi.split(' ').map((parca) => parca[0] || '').join('').slice(0, 2).toUpperCase() || 'TD'
    const sonNumara = secili.siparisler.reduce((maksimum, siparis) => {
      const sayi = Number(String(siparis.siparisNo).replace(/[^\d]/g, ''))
      return Number.isNaN(sayi) ? maksimum : Math.max(maksimum, sayi)
    }, 100)

    return `${onEk}-${sonNumara + 1}`
  }

  const genelTedarikSiparisFormuGuncelle = (alan, deger) => {
    setGenelTedarikSiparisFormu((onceki) => (
      alan === 'tedarikciUid'
        ? { ...onceki, tedarikciUid: deger, siparisNo: tedarikciSiparisNoOlustur(deger), tarih: onceki.tarih, tutar: onceki.tutar, durum: onceki.durum }
        : { ...onceki, [alan]: deger }
    ))
  }

  const tedarikciSiparisEklemeAc = () => {
    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === seciliTedarikciUid)
    if (!secili) return
    setTedarikciSiparisFormu({ siparisNo: tedarikciSiparisNoOlustur(secili.uid), tarih: new Date().toISOString().slice(0, 10), tutar: '', durum: 'Bekliyor' })
    setTedarikciSiparisEklemeAcik(true)
  }

  const genelTedarikSiparisEklemeAc = () => {
    const ilkTedarikci = tedarikciler[0]
    setGenelTedarikSiparisFormu({
      tedarikciUid: ilkTedarikci ? String(ilkTedarikci.uid) : '',
      siparisNo: ilkTedarikci ? tedarikciSiparisNoOlustur(ilkTedarikci.uid) : '',
      tarih: new Date().toISOString().slice(0, 10),
      tutar: '',
      durum: 'Bekliyor',
    })
    setGenelTedarikSiparisAcik(true)
  }

  const tedarikciSiparisKaydet = () => {
    const siparisNo = tedarikciSiparisFormu.siparisNo.trim()
    const tarih = tedarikciSiparisFormu.tarih
    const tutar = Number(tedarikciSiparisFormu.tutar)
    const durum = tedarikciSiparisFormu.durum.trim()

    if (!seciliTedarikciUid || !siparisNo || !tarih || !durum || Number.isNaN(tutar)) {
      toastGoster?.('hata', 'Tedarikçi siparişi formunda eksik veya hatalı bilgi var.')
      return
    }
    if (negatifSayiVarMi(tutar)) {
      toastGoster?.('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }
    const tekrarVar = tedarikciler.some((tedarikci) => tedarikci.uid === seciliTedarikciUid && tedarikci.siparisler.some((siparis) => siparis.siparisNo.toLowerCase() === siparisNo.toLowerCase()))
    if (tekrarVar) {
      toastGoster?.('hata', 'Bu sipariş numarası zaten mevcut.')
      return
    }

    setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === seciliTedarikciUid ? { ...tedarikci, siparisler: [{ siparisNo, tarih, olusturulmaZamani: new Date().toISOString(), tutar, durum }, ...tedarikci.siparisler], toplamAlisSayisi: tedarikci.toplamAlisSayisi + 1, toplamHarcama: tedarikci.toplamHarcama + tutar } : tedarikci)))
    tedarikciSiparisKapat()
    toastGoster?.('basari', `${siparisNo} numaralı tedarikçi siparişi oluşturuldu.`)
  }

  const genelTedarikSiparisKaydet = () => {
    const tedarikciUid = Number(genelTedarikSiparisFormu.tedarikciUid)
    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === tedarikciUid)
    const siparisNo = genelTedarikSiparisFormu.siparisNo.trim()
    const tarih = genelTedarikSiparisFormu.tarih
    const tutar = Number(genelTedarikSiparisFormu.tutar)
    const durum = genelTedarikSiparisFormu.durum.trim()

    if (!tedarikciUid || !secili || !siparisNo || !tarih || !durum || Number.isNaN(tutar)) {
      toastGoster?.('hata', 'Yeni tedarik siparişi için eksik veya hatalı alan var.')
      return
    }
    if (negatifSayiVarMi(tutar)) {
      toastGoster?.('hata', 'Sipariş tutarı negatif olamaz.')
      return
    }
    const tekrarVar = tedarikciler.some((tedarikci) => tedarikci.uid === tedarikciUid && tedarikci.siparisler.some((siparis) => siparis.siparisNo.toLowerCase() === siparisNo.toLowerCase()))
    if (tekrarVar) {
      toastGoster?.('hata', 'Bu tedarikçi için aynı sipariş numarası zaten mevcut.')
      return
    }

    setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === tedarikciUid ? { ...tedarikci, siparisler: [{ siparisNo, tarih, olusturulmaZamani: new Date().toISOString(), tutar, durum }, ...tedarikci.siparisler], toplamAlisSayisi: tedarikci.toplamAlisSayisi + 1, toplamHarcama: tedarikci.toplamHarcama + tutar } : tedarikci)))
    setTedarikciSiparisSayfa(1)
    genelTedarikSiparisKapat()
    toastGoster?.('basari', `${secili.firmaAdi} için ${siparisNo} numaralı sipariş oluşturuldu.`)
  }

  const otomatikTedarikSiparisiOlustur = ({ urun, miktar, hedefStok, oncekiStok }) => {
    const siparisMiktari = Number(miktar)

    if (!urun || !Number.isFinite(siparisMiktari) || siparisMiktari <= 0) return null

    const eslesenTedarikci = urunIcinTedarikciBul(urun)
    if (!eslesenTedarikci) {
      toastGoster?.('uyari', `${urun.ad} için otomatik sipariş oluşturulamadı. Uygun tedarikçi bulunamadı.`)
      return null
    }

    const acikOtomatikSiparisVar = tedarikciler.some((tedarikci) =>
      tedarikci.siparisler.some(
        (siparis) =>
          siparis.otomatik &&
          siparis.kaynak === 'stok-koruma' &&
          siparis.urunId === urun.urunId &&
          siparis.durum !== 'Teslim alındı',
      ),
    )

    if (acikOtomatikSiparisVar) return null

    const referansKalem =
      eslesenTedarikci.alinanUrunler.find((kalem) => urunAdiEslesiyorMu(urun.ad, kalem.urun)) ??
      eslesenTedarikci.alinanUrunler[0]
    const birimFiyat = Number(referansKalem?.sonFiyat ?? urun.alisFiyati ?? 0)
    const tarih = bugunYmd()
    const siparisNo = otomatikSiparisNoOlustur(eslesenTedarikci, urun.uid)
    const siparis = {
      siparisNo,
      tarih,
      olusturulmaZamani: new Date().toISOString(),
      tutar: siparisMiktari * birimFiyat,
      durum: 'Bekliyor',
      urun: urun.ad,
      urunId: urun.urunId,
      miktar: siparisMiktari,
      otomatik: true,
      kaynak: 'stok-koruma',
      oncekiStok: Number(oncekiStok ?? urun.magazaStok ?? 0),
      hedefStok: Number(hedefStok ?? 0),
      beklenenStok: Number(oncekiStok ?? urun.magazaStok ?? 0) + siparisMiktari,
    }

    setTedarikciler((onceki) =>
      onceki.map((tedarikci) => {
        if (tedarikci.uid !== eslesenTedarikci.uid) return tedarikci

        const guncelAlinanUrunler = Array.isArray(tedarikci.alinanUrunler) ? [...tedarikci.alinanUrunler] : []
        const mevcutKalemIndex = guncelAlinanUrunler.findIndex((kalem) => urunAdiEslesiyorMu(urun.ad, kalem.urun))
        const yeniAlimKalemi = {
          urun: urun.ad,
          sonFiyat: birimFiyat,
          sonAlisTarihi: tarih,
        }

        if (mevcutKalemIndex >= 0) {
          guncelAlinanUrunler[mevcutKalemIndex] = {
            ...guncelAlinanUrunler[mevcutKalemIndex],
            ...yeniAlimKalemi,
          }
        } else {
          guncelAlinanUrunler.unshift(yeniAlimKalemi)
        }

        return {
          ...tedarikci,
          alinanUrunler: guncelAlinanUrunler,
          siparisler: [siparis, ...tedarikci.siparisler],
          toplamAlisSayisi: Number(tedarikci.toplamAlisSayisi ?? 0) + 1,
          toplamHarcama: Number(tedarikci.toplamHarcama ?? 0) + siparis.tutar,
        }
      }),
    )
    setTedarikciSiparisSayfa(1)

    return {
      ...siparis,
      tedarikciUid: eslesenTedarikci.uid,
      firmaAdi: eslesenTedarikci.firmaAdi,
      yetkiliKisi: eslesenTedarikci.yetkiliKisi,
      telefon: eslesenTedarikci.telefon,
    }
  }

  const tedarikciSil = () => {
    if (!silinecekTedarikci) return
    const silinenAd = silinecekTedarikci.firmaAdi
    const silinenTedarikci = { ...silinecekTedarikci }
    const silinenIndex = tedarikciler.findIndex((tedarikci) => tedarikci.uid === silinenTedarikci.uid)
    const silinenTedarikci = { ...silinecekTedarikci }
    const silinenAd = silinenTedarikci.firmaAdi

    supplierApi.delete(silinenTedarikci.uid).then(() => {
      setTedarikciler((onceki) => onceki.filter((t) => t.uid !== silinenTedarikci.uid))
      tedarikciSilmeKapat()
      if (seciliTedarikciUid === silinenTedarikci.uid) tedarikciDetayKapat()
      toastGoster?.('basari', `${silinenAd} tedarikçi listesinden silindi.`)
    }).catch(err => {
      console.error('Tedarikçi silinirken hata:', err)
      toastGoster?.('hata', 'Tedarikçi silinirken bir hata oluştu.')
    })
  }

  return {
    tedarikciler,
    tedarikciArama,
    setTedarikciArama,
    tedarikciSekmesi,
    setTedarikciSekmesi,
    tedarikciSayfa,
    setTedarikciSayfa,
    tedarikciSiparisSayfa,
    setTedarikciSiparisSayfa,
    tedarikciDetaySekmesi,
    setTedarikciDetaySekmesi,
    tedarikciEklemeAcik,
    tedarikciDuzenlemeAcik,
    tedarikciNotAcik,
    tedarikciDetayAcik,
    seciliTedarikciUid,
    tedarikciFormu,
    tedarikciNotMetni,
    setTedarikciNotMetni,
    silinecekTedarikci,
    setSilinecekTedarikci,
    tedarikciSiparisEklemeAcik,
    tedarikciSiparisFormu,
    genelTedarikSiparisAcik,
    genelTedarikSiparisFormu,
    toplamTedarikciSayfa,
    tedarikciBaslangic,
    sayfadakiTedarikciler,
    seciliTedarikci,
    tumTedarikSiparisleri,
    toplamTedarikSiparisSayfa,
    tedarikSiparisBaslangic,
    sayfadakiTedarikSiparisleri,
    tedarikciFormuTemizle,
    tedarikciEklemeKapat,
    tedarikciDuzenlemeKapat,
    tedarikciNotKapat,
    tedarikciDetayKapat,
    tedarikciSiparisKapat,
    genelTedarikSiparisKapat,
    tedarikciSilmeKapat,
    tedarikciModallariniKapat,
    tedarikciSayfayaGit,
    tedarikciSiparisSayfayaGit,
    tedarikciEklemeAc,
    tedarikciDuzenlemeAc,
    tedarikciDetayAc,
    tedarikciNotAc,
    tedarikciFormuGuncelle,
    tedarikciFavoriDegistir,
    urunIcinTedarikciBul,
    tedarikciKaydet,
    tedarikciNotKaydet,
    tedarikciSiparisFormuGuncelle,
    genelTedarikSiparisFormuGuncelle,
    tedarikciSiparisEklemeAc,
    genelTedarikSiparisEklemeAc,
    tedarikciSiparisKaydet,
    genelTedarikSiparisKaydet,
    otomatikTedarikSiparisiOlustur,
    tedarikciSil,
  }
}
