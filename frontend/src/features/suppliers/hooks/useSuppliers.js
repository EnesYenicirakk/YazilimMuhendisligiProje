import { useEffect, useMemo, useState } from 'react'
import { baslangicTedarikcileri } from '../../../components/common/Ikonlar'
import {
  bosTedarikciFormu,
  bosTedarikciSiparisFormu,
  favorileriOneTasi,
  negatifSayiVarMi,
  telefonGecerliMi,
  telefonuNormalizeEt,
} from '../../../shared/utils/constantsAndHelpers'

const TEDARIKCI_SAYFA_BASINA = 8

export default function useSuppliers({ toastGoster }) {
  const [tedarikciler, setTedarikciler] = useState(baslangicTedarikcileri)
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
    return kayitlar.sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
  }, [tedarikciler])

  const toplamTedarikSiparisSayfa = Math.max(1, Math.ceil(tumTedarikSiparisleri.length / TEDARIKCI_SAYFA_BASINA))
  const tedarikSiparisBaslangic = (tedarikciSiparisSayfa - 1) * TEDARIKCI_SAYFA_BASINA
  const sayfadakiTedarikSiparisleri = tumTedarikSiparisleri.slice(
    tedarikSiparisBaslangic,
    tedarikSiparisBaslangic + TEDARIKCI_SAYFA_BASINA,
  )

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
      setTedarikciler((onceki) => [{ uid: Date.now(), firmaAdi, yetkiliKisi, telefon, email, adres, vergiNumarasi, urunGrubu, toplamAlisSayisi, ortalamaTeslimSuresi, toplamHarcama, not, alinanUrunler: [], siparisler: [], fiyatGecmisi: [], favori: false }, ...onceki])
      setTedarikciSayfa(1)
      tedarikciEklemeKapat()
      toastGoster?.('basari', `${firmaAdi} tedarikçi listesine eklendi.`)
      return
    }

    setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === seciliTedarikciUid ? { ...tedarikci, firmaAdi, yetkiliKisi, telefon, email, adres, vergiNumarasi, urunGrubu, toplamAlisSayisi, ortalamaTeslimSuresi, toplamHarcama, not } : tedarikci)))
    tedarikciDuzenlemeKapat()
    toastGoster?.('basari', `${firmaAdi} tedarikçi kaydı güncellendi.`)
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

    setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === seciliTedarikciUid ? { ...tedarikci, siparisler: [{ siparisNo, tarih, tutar, durum }, ...tedarikci.siparisler], toplamAlisSayisi: tedarikci.toplamAlisSayisi + 1, toplamHarcama: tedarikci.toplamHarcama + tutar } : tedarikci)))
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

    setTedarikciler((onceki) => onceki.map((tedarikci) => (tedarikci.uid === tedarikciUid ? { ...tedarikci, siparisler: [{ siparisNo, tarih, tutar, durum }, ...tedarikci.siparisler], toplamAlisSayisi: tedarikci.toplamAlisSayisi + 1, toplamHarcama: tedarikci.toplamHarcama + tutar } : tedarikci)))
    setTedarikciSiparisSayfa(1)
    genelTedarikSiparisKapat()
    toastGoster?.('basari', `${secili.firmaAdi} için ${siparisNo} numaralı sipariş oluşturuldu.`)
  }

  const tedarikciSil = () => {
    if (!silinecekTedarikci) return
    const silinenAd = silinecekTedarikci.firmaAdi
    const silinenTedarikci = { ...silinecekTedarikci }
    const silinenIndex = tedarikciler.findIndex((tedarikci) => tedarikci.uid === silinenTedarikci.uid)
    setTedarikciler((onceki) => onceki.filter((tedarikci) => tedarikci.uid !== silinenTedarikci.uid))
    tedarikciSilmeKapat()
    if (seciliTedarikciUid === silinenTedarikci.uid) tedarikciDetayKapat()

    toastGoster?.('basari', `${silinenAd} tedarikçi listesinden silindi.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setTedarikciler((onceki) => {
          if (onceki.some((tedarikci) => tedarikci.uid === silinenTedarikci.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenTedarikci)
          return yeni
        })
        toastGoster?.('basari', `${silinenAd} geri alındı.`)
      },
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
    tedarikciKaydet,
    tedarikciNotKaydet,
    tedarikciSiparisFormuGuncelle,
    genelTedarikSiparisFormuGuncelle,
    tedarikciSiparisEklemeAc,
    genelTedarikSiparisEklemeAc,
    tedarikciSiparisKaydet,
    genelTedarikSiparisKaydet,
    tedarikciSil,
  }
}
