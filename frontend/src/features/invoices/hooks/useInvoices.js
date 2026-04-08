import { useMemo, useState } from 'react'
import {
  baslangicFaturalari,
  bosFaturaFormu,
  bosFaturaSatiri,
  faturaBelgeHtmlOlustur,
  faturaBelgeTamHtmlOlustur,
  faturaKaydiOlustur,
  faturaToplamlariHesapla,
  pdfKutuphaneleriniYukle,
} from '../../../shared/utils/constantsAndHelpers'

const FATURA_KDV_ORANI = 0.2

export default function useInvoices({ musteriler, tedarikciler, urunler, toastGoster }) {
  const [faturalar, setFaturalar] = useState(baslangicFaturalari)
  const [faturaSekmesi, setFaturaSekmesi] = useState('yeni')
  const [faturaArama, setFaturaArama] = useState('')
  const [faturaFormu, setFaturaFormu] = useState(bosFaturaFormu)
  const [faturaDetayAcik, setFaturaDetayAcik] = useState(false)
  const [seciliFaturaId, setSeciliFaturaId] = useState(null)
  const [pdfOnizlemeAcik, setPdfOnizlemeAcik] = useState(false)

  const faturaKarsiTaraflar = useMemo(() => {
    if (faturaFormu.tur === 'Satış Faturası') {
      return musteriler.map((musteri) => ({
        uid: musteri.uid,
        ad: musteri.ad,
        telefon: musteri.telefon,
        adres: 'Malatya Yeşilyurt / Malatya',
        vergiNo: '1111111111',
      }))
    }

    return tedarikciler.map((tedarikci) => ({
      uid: tedarikci.uid,
      ad: tedarikci.firmaAdi,
      telefon: tedarikci.telefon,
      adres: tedarikci.adres,
      vergiNo: tedarikci.vergiNumarasi,
    }))
  }, [faturaFormu.tur, musteriler, tedarikciler])

  const seciliFaturaKarsiTaraf = useMemo(
    () => faturaKarsiTaraflar.find((kayit) => String(kayit.uid) === String(faturaFormu.karsiTarafUid)) ?? null,
    [faturaFormu.karsiTarafUid, faturaKarsiTaraflar],
  )

  const faturaOnizleme = useMemo(() => {
    const satirlar = faturaFormu.satirlar
      .filter((satir) => satir.urun.trim())
      .map((satir) => ({
        ...satir,
        miktar: Number(satir.miktar),
        birimFiyat: Number(satir.birimFiyat),
        kdvOrani: Number(satir.kdvOrani || FATURA_KDV_ORANI),
      }))

    const toplamlar = faturaToplamlariHesapla(satirlar)

    return {
      id: 'onizleme',
      faturaNo: `FTR-${new Date().getFullYear()}-${String(faturalar.length + 1).padStart(3, '0')}`,
      tur: faturaFormu.tur,
      karsiTarafUid: faturaFormu.karsiTarafUid,
      karsiTarafAdi: seciliFaturaKarsiTaraf?.ad ?? faturaFormu.karsiTarafAdi,
      tarih: faturaFormu.tarih,
      odemeTarihi: faturaFormu.odemeTarihi,
      satirlar,
      not: faturaFormu.not.trim(),
      durum: 'Taslak',
      ...toplamlar,
    }
  }, [faturaFormu, faturalar.length, seciliFaturaKarsiTaraf])

  const filtreliFaturalar = useMemo(() => {
    const arama = faturaArama.trim().toLowerCase()
    if (!arama) return faturalar

    return faturalar.filter(
      (fatura) =>
        fatura.faturaNo.toLowerCase().includes(arama) ||
        fatura.karsiTarafAdi.toLowerCase().includes(arama) ||
        fatura.tur.toLowerCase().includes(arama),
    )
  }, [faturaArama, faturalar])

  const seciliFatura = useMemo(
    () => faturalar.find((fatura) => fatura.id === seciliFaturaId) ?? null,
    [faturalar, seciliFaturaId],
  )

  const faturaNumarasiOlustur = () => `FTR-${new Date().getFullYear()}-${String(faturalar.length + 1).padStart(3, '0')}`

  const faturaFormunuSifirla = () => {
    setFaturaFormu({
      ...bosFaturaFormu,
      tarih: new Date().toISOString().slice(0, 10),
      odemeTarihi: new Date().toISOString().slice(0, 10),
      satirlar: [bosFaturaSatiri(Date.now())],
    })
  }

  const faturaFormuGuncelle = (alan, deger) => {
    setFaturaFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const faturaTuruDegistir = (tur) => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      tur,
      karsiTarafUid: '',
      karsiTarafAdi: '',
      satirlar: onceki.satirlar.map((satir) => ({ ...satir, birimFiyat: 0, urunUid: '', urun: '' })),
    }))
  }

  const faturaKarsiTarafDegistir = (uid) => {
    const secili = faturaKarsiTaraflar.find((kayit) => String(kayit.uid) === String(uid))
    setFaturaFormu((onceki) => ({
      ...onceki,
      karsiTarafUid: uid,
      karsiTarafAdi: secili?.ad ?? '',
    }))
  }

  const faturaSatiriGuncelle = (satirId, alan, deger) => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      satirlar: onceki.satirlar.map((satir) => {
        if (satir.id !== satirId) return satir
        if (alan === 'urunUid') {
          const urun = urunler.find((item) => String(item.uid) === String(deger))
          return {
            ...satir,
            urunUid: deger,
            urun: urun ? urun.ad : '',
            birimFiyat: urun ? (onceki.tur === 'Satış Faturası' ? urun.satisFiyati : urun.alisFiyati) : 0,
          }
        }
        return { ...satir, [alan]: deger }
      }),
    }))
  }

  const faturaSatiriEkle = () => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      satirlar: [...onceki.satirlar, bosFaturaSatiri(Date.now() + onceki.satirlar.length)],
    }))
  }

  const faturaSatiriSil = (satirId) => {
    setFaturaFormu((onceki) => ({
      ...onceki,
      satirlar: onceki.satirlar.length === 1 ? onceki.satirlar : onceki.satirlar.filter((satir) => satir.id !== satirId),
    }))
  }

  const faturaDetayAc = (fatura) => {
    setSeciliFaturaId(fatura.id)
    setFaturaDetayAcik(true)
  }

  const faturaIdIleDetayAc = (faturaId) => {
    setSeciliFaturaId(faturaId)
    setFaturaDetayAcik(true)
  }

  const faturaKarsiTarafiniBul = (fatura) => {
    const bulunanKayit =
      fatura.tur === 'Satış Faturası'
        ? musteriler.find((musteri) => String(musteri.uid) === String(fatura.karsiTarafUid))
        : tedarikciler.find((tedarikci) => String(tedarikci.uid) === String(fatura.karsiTarafUid))

    return bulunanKayit ?? {
      uid: null,
      ad: fatura.karsiTarafAdi ?? 'Bilinmeyen Kayıt',
      firmaAdi: fatura.karsiTarafAdi ?? 'Bilinmeyen Kayıt',
      telefon: '',
      adres: '',
      vergiNumarasi: '',
      vergiNo: '',
    }
  }

  const faturayiYazdir = (fatura) => {
    if (!fatura.satirlar.length || !fatura.karsiTarafAdi) {
      toastGoster?.('hata', 'Yazdırma için önce fatura bilgilerini tamamlayın.')
      return
    }

    const karsiTaraf = faturaKarsiTarafiniBul(fatura)

    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.visibility = 'hidden'

    const temizle = () => {
      window.setTimeout(() => {
        iframe.remove()
      }, 400)
    }

    iframe.onload = () => {
      window.setTimeout(() => {
        try {
          iframe.contentWindow.focus()
          iframe.contentWindow.print()
          iframe.contentWindow.addEventListener('afterprint', temizle, { once: true })
          window.setTimeout(temizle, 1500)
        } catch {
          temizle()
          setPdfOnizlemeAcik(true)
          if (fatura.id !== 'onizleme') setSeciliFaturaId(fatura.id)
          toastGoster?.('uyari', 'Yazdırma başlatılamadı. Önizleme açıldı.')
        }
      }, 180)
    }

    document.body.appendChild(iframe)
    iframe.srcdoc = faturaBelgeTamHtmlOlustur(fatura, karsiTaraf)
  }

  const faturayiPdfIndir = (fatura) => {
    if (!fatura.satirlar.length || !fatura.karsiTarafAdi) {
      toastGoster?.('hata', 'PDF indirmek için önce fatura bilgilerini tamamlayın.')
      return
    }

    const karsiTaraf = faturaKarsiTarafiniBul(fatura)

    const kap = document.createElement('div')
    kap.style.position = 'fixed'
    kap.style.left = '-99999px'
    kap.style.top = '0'
    kap.style.width = '794px'
    kap.style.background = '#ffffff'
    kap.innerHTML = faturaBelgeHtmlOlustur(fatura, karsiTaraf)
    document.body.appendChild(kap)

    const gorseller = Array.from(kap.querySelectorAll('img'))
    const bekleyenler = gorseller.map((gorsel) =>
      gorsel.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            gorsel.onload = () => resolve()
            gorsel.onerror = () => resolve()
          }),
    )

    Promise.all(bekleyenler)
      .then(() => new Promise((resolve) => window.setTimeout(resolve, 120)))
      .then(async () => {
        const { html2canvas, jsPDF } = await pdfKutuphaneleriniYukle()
        const canvas = await html2canvas(kap, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
        })
        const pdf = new jsPDF('p', 'mm', 'a4')
        const sayfaGenislik = pdf.internal.pageSize.getWidth()
        const sayfaYuksekligi = pdf.internal.pageSize.getHeight()
        const gorselYuksekligi = (canvas.height * sayfaGenislik) / canvas.width
        const gorsel = canvas.toDataURL('image/png')
        let kalanYukseklik = gorselYuksekligi
        let konum = 0

        pdf.addImage(gorsel, 'PNG', 0, konum, sayfaGenislik, gorselYuksekligi, undefined, 'FAST')
        kalanYukseklik -= sayfaYuksekligi

        while (kalanYukseklik > 0) {
          konum = kalanYukseklik - gorselYuksekligi
          pdf.addPage()
          pdf.addImage(gorsel, 'PNG', 0, konum, sayfaGenislik, gorselYuksekligi, undefined, 'FAST')
          kalanYukseklik -= sayfaYuksekligi
        }

        pdf.save(`${fatura.faturaNo}.pdf`)
        toastGoster?.('basari', `${fatura.faturaNo} PDF olarak indirildi.`)
      })
      .catch(() => {
        setPdfOnizlemeAcik(true)
        if (fatura.id !== 'onizleme') setSeciliFaturaId(fatura.id)
        toastGoster?.('uyari', 'PDF indirme sırasında önizleme açıldı.')
      })
      .finally(() => {
        kap.remove()
      })
  }

  const faturaKaydet = () => {
    const karsiTarafAdi = (seciliFaturaKarsiTaraf?.ad ?? faturaFormu.karsiTarafAdi).trim()
    const gecerliSatirlar = faturaFormu.satirlar
      .filter((satir) => satir.urun.trim())
      .map((satir) => ({
        ...satir,
        miktar: Number(satir.miktar),
        birimFiyat: Number(satir.birimFiyat),
        kdvOrani: Number(satir.kdvOrani || FATURA_KDV_ORANI),
      }))

    if (!faturaFormu.tarih || !faturaFormu.odemeTarihi || !karsiTarafAdi || !faturaFormu.karsiTarafUid || !gecerliSatirlar.length) {
      toastGoster?.('hata', 'Fatura oluşturmak için tüm zorunlu alanları doldurun.')
      return
    }

    if (gecerliSatirlar.some((satir) => !satir.urun.trim() || Number.isNaN(satir.miktar) || Number.isNaN(satir.birimFiyat) || satir.miktar <= 0 || satir.birimFiyat < 0)) {
      toastGoster?.('hata', 'Fatura satırlarında eksik veya hatalı bilgi var.')
      return
    }

    const yeniFatura = faturaKaydiOlustur({
      id: Date.now(),
      faturaNo: faturaNumarasiOlustur(),
      tur: faturaFormu.tur,
      karsiTarafUid: Number(faturaFormu.karsiTarafUid),
      karsiTarafAdi,
      tarih: faturaFormu.tarih,
      odemeTarihi: faturaFormu.odemeTarihi,
      satirlar: gecerliSatirlar,
      not: faturaFormu.not.trim(),
      durum: 'Hazır',
    })

    setFaturalar((onceki) => [yeniFatura, ...onceki])
    setFaturaSekmesi('gecmis')
    faturaFormunuSifirla()
    toastGoster?.('basari', `${yeniFatura.faturaNo} numaralı fatura oluşturuldu.`)
  }

  const faturaPdfOnizlemeAc = (fatura = faturaOnizleme) => {
    if (!fatura.satirlar.length || !fatura.karsiTarafAdi) {
      toastGoster?.('hata', 'PDF önizlemesi için önce fatura bilgilerini tamamlayın.')
      return
    }

    if (fatura.id !== 'onizleme') {
      setSeciliFaturaId(fatura.id)
    } else {
      setSeciliFaturaId(null)
    }
    setPdfOnizlemeAcik(true)
  }

  return {
    faturalar,
    faturaSekmesi,
    setFaturaSekmesi,
    faturaArama,
    setFaturaArama,
    faturaFormu,
    faturaDetayAcik,
    seciliFaturaId,
    pdfOnizlemeAcik,
    faturaKarsiTaraflar,
    faturaOnizleme,
    filtreliFaturalar,
    seciliFatura,
    faturaFormuGuncelle,
    faturaTuruDegistir,
    faturaKarsiTarafDegistir,
    faturaSatiriGuncelle,
    faturaSatiriEkle,
    faturaSatiriSil,
    faturaDetayAc,
    faturaIdIleDetayAc,
    faturayiYazdir,
    faturayiPdfIndir,
    faturaKaydet,
    faturaPdfOnizlemeAc,
    setFaturaDetayAcik,
    setPdfOnizlemeAcik,
  }
}
