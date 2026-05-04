import { useEffect, useMemo, useState } from 'react'
import { supplierApi, categoryApi } from '../../../core/services/backendApiService'
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

const rastgeleOgeSec = (liste) => {
  if (!Array.isArray(liste) || liste.length === 0) return null
  const index = Math.floor(Math.random() * liste.length)
  return liste[index] ?? null
}

export default function useSuppliers({ toastGoster, isLoggedIn }) {
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
  const [loading, setLoading] = useState(true)
  const [tedarikciSiparisEklemeAcik, setTedarikciSiparisEklemeAcik] = useState(false)
  const [tedarikciSiparisFormu, setTedarikciSiparisFormu] = useState(bosTedarikciSiparisFormu)
  const [duzenlenenTedarikciSiparisi, setDuzenlenenTedarikciSiparisi] = useState(null)
  const [genelTedarikSiparisAcik, setGenelTedarikSiparisAcik] = useState(false)
  const [genelTedarikSiparisFormu, setGenelTedarikSiparisFormu] = useState({
    tedarikciUid: '',
    ...bosTedarikciSiparisFormu,
  })
  const [kategoriler, setKategoriler] = useState([])

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

    const digerKategoriliTedarikciler = tedarikciler.filter(
      (tedarikci) => metniNormalizeEt(tedarikci.urunGrubu) !== kategori,
    )

    return rastgeleOgeSec(digerKategoriliTedarikciler) ?? rastgeleOgeSec(tedarikciler)
  }

  const tedarikciSiparisiniYerlestir = (tedarikciUid, siparis, oncekiSiparisNo = null) => {
    setTedarikciler((onceki) =>
      onceki.map((tedarikci) => {
        if (tedarikci.uid !== Number(tedarikciUid)) return tedarikci

        const mevcutSiparisler = Array.isArray(tedarikci.siparisler) ? tedarikci.siparisler : []
        const digerSiparisler = mevcutSiparisler.filter((kayit) => {
          if (siparis.id != null && kayit.id != null) {
            return String(kayit.id) !== String(siparis.id)
          }

          return oncekiSiparisNo ? kayit.siparisNo !== oncekiSiparisNo : kayit.siparisNo !== siparis.siparisNo
        })
        const yeniSiparisler = [siparis, ...digerSiparisler].sort((a, b) => siparisZamaniniAl(b) - siparisZamaniniAl(a))

        return {
          ...tedarikci,
          siparisler: yeniSiparisler,
          toplamAlisSayisi: yeniSiparisler.length,
          toplamHarcama: yeniSiparisler.reduce((toplam, kayit) => toplam + Number(kayit.tutar ?? 0), 0),
        }
      }),
    )
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
    if (!isLoggedIn) return

    const verileriYukle = async () => {
      setLoading(true)
      try {
        const [tedarikciVerileri, kategoriVerileri] = await Promise.all([
          supplierApi.getAll(),
          categoryApi.getAll()
        ])
        setTedarikciler(tedarikciVerileri)
        setKategoriler(kategoriVerileri)
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error)
        toastGoster?.('hata', 'Tedarikçi ve kategori verileri alınamadı.')
      } finally {
        setLoading(false)
      }
    }
    verileriYukle()
  }, [toastGoster, isLoggedIn])

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
  const tedarikciSiparisKapat = () => { setTedarikciSiparisEklemeAcik(false); setDuzenlenenTedarikciSiparisi(null); setTedarikciSiparisFormu(bosTedarikciSiparisFormu) }
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
  const tedarikciFavoriDegistir = (uid) => {
    const tedarikci = tedarikciler.find((t) => t.uid === uid)
    if (!tedarikci) return

    const guncellenenTedarikciData = {
      firmaAdi: tedarikci.firmaAdi,
      yetkiliKisi: tedarikci.yetkiliKisi ?? '',
      telefon: tedarikci.telefon ?? '',
      email: tedarikci.email ?? '',
      adres: tedarikci.adres ?? '',
      vergiNumarasi: tedarikci.vergiNumarasi ?? '',
      urunGrubu: tedarikci.urunGrubu ?? '',
      not: tedarikci.not ?? '',
      toplamAlisSayisi: Number(tedarikci.toplamAlisSayisi ?? 0),
      ortalamaTeslimSuresi: tedarikci.ortalamaTeslimSuresi ?? '',
      toplamHarcama: Number(tedarikci.toplamHarcama ?? 0),
      favori: !tedarikci.favori,
    }

    supplierApi.update(uid, guncellenenTedarikciData).then((sunucuVerisi) => {
      setTedarikciler((onceki) =>
        onceki.map((t) => (t.uid === uid ? sunucuVerisi : t)),
      )
    }).catch(err => {
      console.error('Tedarikçi favori durumu güncellenirken hata:', err)
      toastGoster?.('hata', 'Favori durumu güncellenirken hata oluştu.')
    })
  }

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

    if (!firmaAdi || !yetkiliKisi || !telefon || !email || !adres || !vergiNumarasi || !urunGrubu) {
      toastGoster?.('hata', 'Lütfen tüm zorunlu alanları (*) doldurun.')
      return
    }

    if (!epostaGecerliMi(email)) {
      toastGoster?.('hata', 'Geçerli bir e-posta adresi giriniz.')
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
    if (!secili) return

    const guncellenenTedarikciData = {
      ...secili,
      not: temizNot,
    }

    supplierApi.update(seciliTedarikciUid, guncellenenTedarikciData).then((sunucuVerisi) => {
      setTedarikciler((onceki) =>
        onceki.map((t) => (t.uid === seciliTedarikciUid ? sunucuVerisi : t)),
      )
      tedarikciNotKapat()
      toastGoster?.('basari', `${secili.firmaAdi} notu kaydedildi.`)
    }).catch(err => {
      console.error('Tedarikçi notu güncellenirken hata:', err)
      toastGoster?.('hata', 'Not kaydedilirken sunucu hatası oluştu.')
    })
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
    setDuzenlenenTedarikciSiparisi(null)
    setTedarikciSiparisFormu({ siparisNo: tedarikciSiparisNoOlustur(secili.uid), tarih: new Date().toISOString().slice(0, 10), tutar: '', durum: 'Bekliyor' })
    setTedarikciSiparisEklemeAcik(true)
  }

  const tedarikciSiparisDuzenlemeAc = (tedarikciUid, siparis) => {
    if (!siparis) return

    setSeciliTedarikciUid(Number(tedarikciUid))
    setDuzenlenenTedarikciSiparisi({
      id: siparis.id ?? null,
      siparisNo: siparis.siparisNo,
    })
    setTedarikciSiparisFormu({
      siparisNo: siparis.siparisNo ?? '',
      tarih: siparis.tarih ?? bugunYmd(),
      tutar: String(siparis.tutar ?? ''),
      durum: siparis.durum ?? 'Bekliyor',
    })
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
      toastGoster?.('hata', 'Tedarik??i sipari??i formunda eksik veya hatal?? bilgi var.')
      return
    }
    if (negatifSayiVarMi(tutar)) {
      toastGoster?.('hata', 'Sipari?? tutar?? negatif olamaz.')
      return
    }

    const mevcutSiparisler = tedarikciler.find((tedarikci) => tedarikci.uid === seciliTedarikciUid)?.siparisler ?? []
    const tekrarVar = mevcutSiparisler.some((siparis) => {
      const ayniSiparisNo = siparis.siparisNo?.toLowerCase() === siparisNo.toLowerCase()
      if (!ayniSiparisNo) return false
      if (duzenlenenTedarikciSiparisi?.id != null && siparis.id != null) {
        return String(siparis.id) !== String(duzenlenenTedarikciSiparisi.id)
      }
      if (duzenlenenTedarikciSiparisi?.siparisNo) {
        return siparis.siparisNo !== duzenlenenTedarikciSiparisi.siparisNo
      }
      return true
    })
    if (tekrarVar) {
      toastGoster?.('hata', 'Bu sipari?? numaras?? zaten mevcut.')
      return
    }

    const mevcutSiparis = mevcutSiparisler.find((siparis) => {
      if (duzenlenenTedarikciSiparisi?.id != null && siparis.id != null) {
        return String(siparis.id) === String(duzenlenenTedarikciSiparisi.id)
      }
      return duzenlenenTedarikciSiparisi?.siparisNo && siparis.siparisNo === duzenlenenTedarikciSiparisi.siparisNo
    })

    const payload = {
      siparisNo,
      tarih,
      tutar,
      durum,
      urun: mevcutSiparis?.urun ?? '',
      urunId: mevcutSiparis?.urunId ?? '',
      miktar: mevcutSiparis?.miktar ?? 0,
      birimFiyat: mevcutSiparis?.birimFiyat ?? 0,
      otomatik: mevcutSiparis?.otomatik ?? false,
      kaynak: mevcutSiparis?.kaynak ?? '',
      oncekiStok: mevcutSiparis?.oncekiStok ?? 0,
      hedefStok: mevcutSiparis?.hedefStok ?? 0,
      beklenenStok: mevcutSiparis?.beklenenStok ?? 0,
    }

    const oncekiSiparisNo = duzenlenenTedarikciSiparisi?.siparisNo ?? null
    const isEditing = duzenlenenTedarikciSiparisi?.id != null
    const istek = isEditing
      ? supplierApi.updateOrder(seciliTedarikciUid, duzenlenenTedarikciSiparisi.id, payload)
      : supplierApi.createOrder(seciliTedarikciUid, payload)

    istek
      .then((sunucuSiparisi) => {
        tedarikciSiparisiniYerlestir(seciliTedarikciUid, sunucuSiparisi, oncekiSiparisNo)
        tedarikciSiparisKapat()
        toastGoster?.('basari', isEditing ? `${siparisNo} numaral?? tedarik??i sipari??i g??ncellendi.` : `${siparisNo} numaral?? tedarik??i sipari??i olu??turuldu.`)
      })
      .catch((hata) => {
        toastGoster?.('hata', hata.message || 'Tedarik??i sipari??i kaydedilirken bir hata olu??tu.')
      })
  }

  const genelTedarikSiparisKaydet = () => {
    const tedarikciUid = Number(genelTedarikSiparisFormu.tedarikciUid)
    const secili = tedarikciler.find((tedarikci) => tedarikci.uid === tedarikciUid)
    const siparisNo = genelTedarikSiparisFormu.siparisNo.trim()
    const tarih = genelTedarikSiparisFormu.tarih
    const tutar = Number(genelTedarikSiparisFormu.tutar)
    const durum = genelTedarikSiparisFormu.durum.trim()

    if (!tedarikciUid || !secili || !siparisNo || !tarih || !durum || Number.isNaN(tutar)) {
      toastGoster?.('hata', 'Yeni tedarik sipari??i i??in eksik veya hatal?? alan var.')
      return
    }
    if (negatifSayiVarMi(tutar)) {
      toastGoster?.('hata', 'Sipari?? tutar?? negatif olamaz.')
      return
    }
    const tekrarVar = tedarikciler.some((tedarikci) => tedarikci.uid === tedarikciUid && tedarikci.siparisler.some((siparis) => siparis.siparisNo.toLowerCase() === siparisNo.toLowerCase()))
    if (tekrarVar) {
      toastGoster?.('hata', 'Bu tedarik??i i??in ayn?? sipari?? numaras?? zaten mevcut.')
      return
    }

    supplierApi.createOrder(tedarikciUid, {
      siparisNo,
      tarih,
      tutar,
      durum,
    })
      .then((sunucuSiparisi) => {
        tedarikciSiparisiniYerlestir(tedarikciUid, sunucuSiparisi)
        setTedarikciSiparisSayfa(1)
        genelTedarikSiparisKapat()
        toastGoster?.('basari', `${secili.firmaAdi} i??in ${siparisNo} numaral?? sipari?? olu??turuldu.`)
      })
      .catch((hata) => {
        toastGoster?.('hata', hata.message || 'Tedarik sipari??i kaydedilirken bir hata olu??tu.')
      })
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
      birimFiyat,
      otomatik: true,
      kaynak: 'stok-koruma',
      oncekiStok: Number(oncekiStok ?? urun.magazaStok ?? 0),
      hedefStok: Number(hedefStok ?? 0),
      beklenenStok: Number(oncekiStok ?? urun.magazaStok ?? 0) + siparisMiktari,
    }

    // Önce local state'i güncelle
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

    // Backend'e kaydet
    supplierApi.createOrder(eslesenTedarikci.uid, siparis).catch((err) => {
      console.error('Otomatik tedarik siparişi kaydedilemedi:', err)
    })

    toastGoster?.('bilgi', `${urun.ad} için ${eslesenTedarikci.firmaAdi} üzerinden otomatik tedarik siparişi oluşturuldu.`)

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
    duzenlenenTedarikciSiparisi,
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
    tedarikciSiparisDuzenlemeAc,
    genelTedarikSiparisEklemeAc,
    tedarikciSiparisKaydet,
    genelTedarikSiparisKaydet,
    otomatikTedarikSiparisiOlustur,
    tedarikciSil,
    kategoriler,
    loading,
  }
}
