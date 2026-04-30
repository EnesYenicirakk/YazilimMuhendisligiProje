import { useEffect, useMemo, useState } from 'react'
import {
  avatarOlustur,
  barkodOlustur,
  bosForm,
  bosUrunDuzenlemeFormu,
  favorileriOneTasi,
  negatifSayiVarMi,
} from '../../../shared/utils/constantsAndHelpers'
import { productApi, categoryApi } from '../../../core/services/backendApiService'

const SAYFA_BASINA_URUN = 8
const STOK_LOG_SAYFA_BASINA = 8
const barkodMetniniNormalizeEt = (deger) => String(deger ?? '').replace(/\s+/g, '').toLocaleLowerCase('tr-TR')
const NEGATIF_OLAMAZ_ALANLAR = new Set(['urunAdedi', 'magazaStok', 'minimumStok', 'alisFiyati', 'satisFiyati'])

const negatifOlmayanSayiyaDonustur = (deger) => {
  const temizDeger = String(deger ?? '').replace(',', '.').replace(/[^\d.]/g, '')
  const ilkNokta = temizDeger.indexOf('.')
  if (ilkNokta === -1) return temizDeger

  return `${temizDeger.slice(0, ilkNokta + 1)}${temizDeger.slice(ilkNokta + 1).replace(/\./g, '')}`
}

export default function useInventory({ toastGoster, isLoggedIn }) {
  const [urunler, setUrunler] = useState([])
  const [kategoriler, setKategoriler] = useState(['Tümü'])
  const [stokDegisimLoglari, setStokDegisimLoglari] = useState([])
  const [loading, setLoading] = useState(true)
  const [aramaMetni, setAramaMetni] = useState('')
  const [envanterKategori, setEnvanterKategori] = useState('Tümü')
  const [envanterSayfa, setEnvanterSayfa] = useState(1)
  const [urunDuzenlemeArama, setUrunDuzenlemeArama] = useState('')
  const [urunDuzenlemeSayfa, setUrunDuzenlemeSayfa] = useState(1)
  const [urunDuzenlemeSekmesi, setUrunDuzenlemeSekmesi] = useState('urunler')
  const [stokLogSayfa, setStokLogSayfa] = useState(1)
  const [eklemeAcik, setEklemeAcik] = useState(false)
  const [duzenlemeAcik, setDuzenlemeAcik] = useState(false)
  const [silinecekUrun, setSilinecekUrun] = useState(null)
  const [urunDuzenlemeModalAcik, setUrunDuzenlemeModalAcik] = useState(false)
  const [silinecekDuzenlemeUrunu, setSilinecekDuzenlemeUrunu] = useState(null)
  const [seciliUid, setSeciliUid] = useState(null)
  const [form, setForm] = useState(bosForm)
  const [urunDuzenlemeUid, setUrunDuzenlemeUid] = useState(null)
  const [urunDuzenlemeFormu, setUrunDuzenlemeFormu] = useState(bosUrunDuzenlemeFormu)
  const [barkodModalAcik, setBarkodModalAcik] = useState(false)
  const [barkodIslemTuru, setBarkodIslemTuru] = useState('alis')
  const [barkodMetni, setBarkodMetni] = useState('')
  const [barkodMiktari, setBarkodMiktari] = useState('1')
  const [barkodSepeti, setBarkodSepeti] = useState([])

  const stokLogTarihiOlustur = () => {
    const tarih = new Date()
    const yil = tarih.getFullYear()
    const ay = String(tarih.getMonth() + 1).padStart(2, '0')
    const gun = String(tarih.getDate()).padStart(2, '0')
    const saat = String(tarih.getHours()).padStart(2, '0')
    const dakika = String(tarih.getMinutes()).padStart(2, '0')
    return `${yil}-${ay}-${gun} ${saat}:${dakika}`
  }

  const stokLoguEkle = ({ urun, urunId, eskiStok, yeniStok, islem, aciklama, kullanici = 'Admin' }) => {
    setStokDegisimLoglari((onceki) => [
      {
        id: Date.now() + Math.random(),
        tarih: stokLogTarihiOlustur(),
        urun,
        urunId,
        islem,
        eskiStok,
        yeniStok,
        kullanici,
        aciklama,
      },
      ...onceki,
    ])
    setStokLogSayfa(1)
  }

  const stokDegisimiLogla = ({ oncekiUrun, sonrakiUrun, artisMesaji, dususMesaji }) => {
    if (!oncekiUrun || !sonrakiUrun || oncekiUrun.magazaStok === sonrakiUrun.magazaStok) return

    const stokFarki = sonrakiUrun.magazaStok - oncekiUrun.magazaStok
    stokLoguEkle({
      urun: sonrakiUrun.ad,
      urunId: sonrakiUrun.urunId,
      eskiStok: oncekiUrun.magazaStok,
      yeniStok: sonrakiUrun.magazaStok,
      islem: stokFarki > 0 ? 'Stok artışı' : 'Stok düşüşü',
      aciklama: stokFarki > 0 ? artisMesaji(Math.abs(stokFarki)) : dususMesaji(Math.abs(stokFarki)),
    })
  }

  const filtreliUrunler = useMemo(() => {
    const metin = aramaMetni.trim().toLowerCase()
    const kategoriyeGore = envanterKategori === 'Tümü'
      ? urunler
      : urunler.filter((urun) => urun.kategori === envanterKategori)
    const sonuc = !metin
      ? kategoriyeGore
      : kategoriyeGore.filter(
          (urun) =>
            urun.ad.toLowerCase().includes(metin) ||
            urun.urunId.toLowerCase().includes(metin) ||
            barkodMetniniNormalizeEt(urun.barkod).includes(metin),
        )

    return favorileriOneTasi(sonuc)
  }, [aramaMetni, envanterKategori, urunler])

  const toplamEnvanterSayfa = Math.max(1, Math.ceil(filtreliUrunler.length / SAYFA_BASINA_URUN))
  const sayfaBaslangic = (envanterSayfa - 1) * SAYFA_BASINA_URUN
  const sayfadakiUrunler = filtreliUrunler.slice(sayfaBaslangic, sayfaBaslangic + SAYFA_BASINA_URUN)

  const filtreliDuzenlemeUrunleri = useMemo(() => {
    const metin = urunDuzenlemeArama.trim().toLowerCase()
    const sonuc = !metin
      ? urunler
      : urunler.filter(
          (urun) =>
            urun.ad.toLowerCase().includes(metin) ||
            urun.urunId.toLowerCase().includes(metin) ||
            barkodMetniniNormalizeEt(urun.barkod).includes(metin),
        )

    return favorileriOneTasi(sonuc)
  }, [urunDuzenlemeArama, urunler])

  const barkodAramaMetni = barkodMetniniNormalizeEt(barkodMetni)

  const barkodEslesmeleri = useMemo(() => {
    if (!barkodAramaMetni) return []

    return urunler
      .filter(
        (urun) =>
          barkodMetniniNormalizeEt(urun.barkod).includes(barkodAramaMetni) ||
          urun.urunId.toLowerCase().includes(barkodAramaMetni) ||
          urun.ad.toLowerCase().includes(barkodAramaMetni),
      )
      .slice(0, 6)
  }, [barkodAramaMetni, urunler])

  const barkodSeciliUrun = useMemo(
    () =>
      barkodEslesmeleri.find(
        (urun) =>
          barkodMetniniNormalizeEt(urun.barkod) === barkodAramaMetni ||
          urun.urunId.toLowerCase() === barkodAramaMetni,
      ) ?? barkodEslesmeleri[0] ?? null,
    [barkodAramaMetni, barkodEslesmeleri],
  )

  const barkodToplamKalem = barkodSepeti.length
  const barkodToplamAdet = barkodSepeti.reduce((toplam, kalem) => toplam + kalem.miktar, 0)

  const toplamUrunDuzenlemeSayfa = Math.max(1, Math.ceil(filtreliDuzenlemeUrunleri.length / SAYFA_BASINA_URUN))
  const urunDuzenlemeBaslangic = (urunDuzenlemeSayfa - 1) * SAYFA_BASINA_URUN
  const sayfadakiDuzenlemeUrunleri = filtreliDuzenlemeUrunleri.slice(
    urunDuzenlemeBaslangic,
    urunDuzenlemeBaslangic + SAYFA_BASINA_URUN,
  )

  const toplamStokLogSayfa = Math.max(1, Math.ceil(stokDegisimLoglari.length / STOK_LOG_SAYFA_BASINA))
  const stokLogBaslangic = (stokLogSayfa - 1) * STOK_LOG_SAYFA_BASINA
  const sayfadakiStokLoglari = stokDegisimLoglari.slice(
    stokLogBaslangic,
    stokLogBaslangic + STOK_LOG_SAYFA_BASINA,
  )

  useEffect(() => {
    if (!isLoggedIn) return

    const urunleriYukle = async () => {
      setLoading(true)
      try {
        const [urunVerileri, kategoriVerileri] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
        ])
        setUrunler(urunVerileri)
        setKategoriler(['Tümü', ...kategoriVerileri.map((c) => c.name)])
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error)
        toastGoster?.('hata', 'Ürün verileri veritabanından alınamadı.')
      } finally {
        setLoading(false)
      }
    }
    urunleriYukle()
  }, [toastGoster, isLoggedIn])

  useEffect(() => {
    if (envanterSayfa > toplamEnvanterSayfa) {
      setEnvanterSayfa(toplamEnvanterSayfa)
    }
  }, [envanterSayfa, toplamEnvanterSayfa])

  useEffect(() => {
    if (stokLogSayfa > toplamStokLogSayfa) {
      setStokLogSayfa(toplamStokLogSayfa)
    }
  }, [stokLogSayfa, toplamStokLogSayfa])

  useEffect(() => {
    if (urunDuzenlemeSayfa > toplamUrunDuzenlemeSayfa) {
      setUrunDuzenlemeSayfa(toplamUrunDuzenlemeSayfa)
    }
  }, [urunDuzenlemeSayfa, toplamUrunDuzenlemeSayfa])

  const formGuncelle = (alan, deger) => {
    const sonrakiDeger = NEGATIF_OLAMAZ_ALANLAR.has(alan) ? negatifOlmayanSayiyaDonustur(deger) : deger
    setForm((onceki) => ({ ...onceki, [alan]: sonrakiDeger }))
  }

  const formuTemizle = () => {
    setForm(bosForm)
    setSeciliUid(null)
  }

  const eklemePenceresiniAc = () => {
    formuTemizle()
    setEklemeAcik(true)
  }

  const eklemePenceresiniKapat = () => {
    setEklemeAcik(false)
    formuTemizle()
  }

  const duzenlemePenceresiniAc = (urun) => {
    setSeciliUid(urun.uid)
    setForm({
      urunId: urun.urunId,
      ad: urun.ad,
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
      minimumStok: String(urun.minimumStok ?? 10),
    })
    setDuzenlemeAcik(true)
  }

  const duzenlemePenceresiniKapat = () => {
    setDuzenlemeAcik(false)
    formuTemizle()
  }

  const formKaydet = (mod) => {
    const urunId = form.urunId.trim()
    const ad = form.ad.trim()
    const urunAdedi = Number(form.urunAdedi)
    const magazaStok = Number(form.magazaStok)
    const minimumStok = Number(form.minimumStok)

    if (!urunId || !ad || Number.isNaN(urunAdedi) || Number.isNaN(magazaStok) || Number.isNaN(minimumStok)) {
      toastGoster?.('hata', 'Ürün bilgileri eksik veya hatalı görünüyor.')
      return
    }

    if (negatifSayiVarMi(urunAdedi, magazaStok, minimumStok)) {
      toastGoster?.('hata', 'Ürün adedi ve stok alanları negatif olamaz.')
      return
    }

    const tekrarEdenUrunId = urunler.some(
      (urun) => urun.urunId.toLowerCase() === urunId.toLowerCase() && (mod === 'ekle' || urun.uid !== seciliUid),
    )
    if (tekrarEdenUrunId) {
      toastGoster?.('hata', `${urunId} ürün ID'si zaten kullanılıyor.`)
      return
    }

    if (mod === 'ekle') {
      const yeniUrunData = {
        urunId,
        ad,
        urunAdedi,
        magazaStok,
        minimumStok,
        kategori: 'Diğer',
        barkod: barkodOlustur(Date.now()),
        avatar: avatarOlustur(ad),
      }

      productApi.create(yeniUrunData).then((sunucuVerisi) => {
        setUrunler((onceki) => [sunucuVerisi, ...onceki])
        stokLoguEkle({
          urun: sunucuVerisi.ad,
          urunId: sunucuVerisi.urunId,
          eskiStok: 0,
          yeniStok: sunucuVerisi.magazaStok,
          islem: 'Stok artışı',
          aciklama: `${sunucuVerisi.magazaStok} adet başlangıç stokuyla envantere eklendi.`,
        })
        eklemePenceresiniKapat()
        setEnvanterSayfa(1)
        toastGoster?.('basari', `${ad} envantere eklendi.`)
      }).catch(err => {
        console.error('Ürün eklenirken hata:', err)
        toastGoster?.('hata', 'Ürün eklenirken bir hata oluştu.')
      })
      return
    }

    const mevcutUrun = urunler.find((urun) => urun.uid === seciliUid)
    const guncellenenUrunData = {
      ...(mevcutUrun ?? {}),
      urunId,
      ad,
      urunAdedi,
      magazaStok,
      minimumStok,
    }

    productApi.update(seciliUid, guncellenenUrunData).then((sunucuVerisi) => {
      setUrunler((onceki) =>
        onceki.map((urun) => (urun.uid === seciliUid ? sunucuVerisi : urun)),
      )

      stokDegisimiLogla({
        oncekiUrun: mevcutUrun,
        sonrakiUrun: sunucuVerisi,
        artisMesaji: (fark) => `Ürün düzenlemesinde stok ${fark} adet artırıldı.`,
        dususMesaji: (fark) => `Ürün düzenlemesinde stok ${fark} adet azaltıldı.`,
      })

      duzenlemePenceresiniKapat()
      toastGoster?.('basari', `${ad} bilgileri güncellendi.`)
    }).catch(err => {
      console.error('Ürün güncellenirken hata:', err)
      toastGoster?.('hata', 'Ürün güncellenirken bir hata oluştu.')
    })
  }

  const urunSil = () => {
    if (!silinecekUrun) return
    const silinenUrun = { ...silinecekUrun }
    const silinenAd = silinenUrun.ad
    
    productApi.delete(silinenUrun.uid).then(() => {
      setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinenUrun.uid))
      stokLoguEkle({
        urun: silinenUrun.ad,
        urunId: silinenUrun.urunId,
        eskiStok: silinenUrun.magazaStok,
        yeniStok: 0,
        islem: 'Ürün silindi',
        aciklama: `${silinenUrun.magazaStok} adet stokla envanterden kaldırıldı.`,
      })
      setSilinecekUrun(null)
      toastGoster?.('basari', `${silinenAd} envanterden silindi.`)
    }).catch(err => {
      console.error('Ürün silinirken hata:', err)
      toastGoster?.('hata', 'Ürün silinirken bir hata oluştu.')
    })
  }

  const urunDuzenlemeModaliniAc = (urun) => {
    setUrunDuzenlemeUid(urun.uid)
    setUrunDuzenlemeFormu({
      urunId: urun.urunId,
      ad: urun.ad,
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
      alisFiyati: String(urun.alisFiyati ?? 0),
      satisFiyati: String(urun.satisFiyati ?? 0),
    })
    setUrunDuzenlemeModalAcik(true)
  }

  const urunDuzenlemeModaliniKapat = () => {
    setUrunDuzenlemeModalAcik(false)
    setUrunDuzenlemeUid(null)
    setUrunDuzenlemeFormu(bosUrunDuzenlemeFormu)
  }

  const urunDuzenlemeFormuGuncelle = (alan, deger) => {
    const sonrakiDeger = NEGATIF_OLAMAZ_ALANLAR.has(alan) ? negatifOlmayanSayiyaDonustur(deger) : deger
    setUrunDuzenlemeFormu((onceki) => ({ ...onceki, [alan]: sonrakiDeger }))
  }

  const urunDuzenlemeKaydet = () => {
    const urunId = urunDuzenlemeFormu.urunId.trim()
    const ad = urunDuzenlemeFormu.ad.trim()
    const urunAdedi = Number(urunDuzenlemeFormu.urunAdedi)
    const magazaStok = Number(urunDuzenlemeFormu.magazaStok)
    const alisFiyati = Number(urunDuzenlemeFormu.alisFiyati)
    const satisFiyati = Number(urunDuzenlemeFormu.satisFiyati)

    if (!urunId || !ad || [urunAdedi, magazaStok, alisFiyati, satisFiyati].some((deger) => Number.isNaN(deger))) {
      toastGoster?.('hata', 'Ürün düzenleme alanlarında eksik veya hatalı veri var.')
      return
    }

    if (negatifSayiVarMi(urunAdedi, magazaStok, alisFiyati, satisFiyati)) {
      toastGoster?.('hata', 'Adet, stok ve fiyat alanları negatif olamaz.')
      return
    }

    const tekrarEdenUrunId = urunler.some(
      (urun) => urun.urunId.toLowerCase() === urunId.toLowerCase() && urun.uid !== urunDuzenlemeUid,
    )
    if (tekrarEdenUrunId) {
      toastGoster?.('hata', `${urunId} ürün ID'si zaten kullanılıyor.`)
      return
    }

    const mevcutUrun = urunler.find((urun) => urun.uid === urunDuzenlemeUid)
    const guncellenenUrunData = {
      ...(mevcutUrun ?? {}),
      urunId,
      ad,
      urunAdedi,
      magazaStok,
      alisFiyati,
      satisFiyati,
    }

    productApi.update(urunDuzenlemeUid, guncellenenUrunData).then((sunucuVerisi) => {
      setUrunler((onceki) =>
        onceki.map((urun) => (urun.uid === urunDuzenlemeUid ? sunucuVerisi : urun)),
      )

      stokDegisimiLogla({
        oncekiUrun: mevcutUrun,
        sonrakiUrun: sunucuVerisi,
        artisMesaji: (fark) => `Ürün güncellemesinde stok ${fark} adet artırıldı.`,
        dususMesaji: (fark) => `Ürün güncellemesinde stok ${fark} adet azaltıldı.`,
      })

      urunDuzenlemeModaliniKapat()
      toastGoster?.('basari', `${ad} fiyat ve stok bilgileri kaydedildi.`)
    }).catch(err => {
      console.error('Ürün güncellenirken hata:', err)
      toastGoster?.('hata', 'Ürün güncellenirken bir hata oluştu.')
    })
  }

  const urunDuzenlemeSil = () => {
    if (!silinecekDuzenlemeUrunu) return
    const silinenUrun = { ...silinecekDuzenlemeUrunu }
    const silinenAd = silinenUrun.ad
    productApi.delete(silinenUrun.uid).then(() => {
      setUrunler((onceki) => onceki.filter((urun) => urun.uid !== silinenUrun.uid))
      stokLoguEkle({
        urun: silinenUrun.ad,
        urunId: silinenUrun.urunId,
        eskiStok: silinenUrun.magazaStok,
        yeniStok: 0,
        islem: 'Ürün silindi',
        aciklama: `${silinenUrun.magazaStok} adet stokla ürün düzenleme listesinden kaldırıldı.`,
      })
      setSilinecekDuzenlemeUrunu(null)
      toastGoster?.('basari', `${silinenAd} envanterden silindi.`)
    }).catch(err => {
      console.error('Ürün silinirken hata:', err)
      toastGoster?.('hata', 'Ürün silinirken bir hata oluştu.')
    })
  }

  const favoriDegistir = (uid) => {
    const urun = urunler.find((u) => u.uid === uid)
    if (!urun) return

    const guncellenenUrunData = {
      ...urun,
      favori: !urun.favori,
    }

    productApi.update(uid, guncellenenUrunData).then((sunucuVerisi) => {
      setUrunler((onceki) =>
        onceki.map((u) => (u.uid === uid ? sunucuVerisi : u)),
      )
    }).catch(err => {
      console.error('Ürün favori durumu güncellenirken hata:', err)
      toastGoster?.('hata', 'Favori durumu güncellenirken hata oluştu.')
    })
  }

  const urunStokunuAzalt = ({ urunUid, miktar }) => {
    const dusulecekMiktar = Number(miktar)
    if (!Number.isFinite(dusulecekMiktar) || dusulecekMiktar <= 0) return

    setUrunler((onceki) =>
      onceki.map((urun) => {
        if (String(urun.uid) !== String(urunUid)) return urun

        return {
          ...urun,
          magazaStok: Math.max(0, Number(urun.magazaStok ?? 0) - dusulecekMiktar),
        }
      }),
    )
  }

  const otomatikStokKorumasiniUygula = ({ urunUid, miktar, hedefStok, tedarikciAdi, siparisNo }) => {
    const siparisMiktari = Number(miktar)
    if (!Number.isFinite(siparisMiktari) || siparisMiktari <= 0) return null

    const ilgiliUrun = urunler.find((urun) => urun.uid === urunUid)
    if (!ilgiliUrun) return null

    const yeniStok = ilgiliUrun.magazaStok + siparisMiktari

    setUrunler((onceki) =>
      onceki.map((urun) =>
        urun.uid === urunUid
          ? { ...urun, magazaStok: yeniStok }
          : urun,
      ),
    )

    stokLoguEkle({
      urun: ilgiliUrun.ad,
      urunId: ilgiliUrun.urunId,
      eskiStok: ilgiliUrun.magazaStok,
      yeniStok,
      islem: 'Stok artışı',
      kullanici: 'Sistem',
      aciklama:
        `${ilgiliUrun.ad} otomatik tedarik ürünü olduğu için otomatik stok koruması devreye girdi. ` +
        `${tedarikciAdi ?? 'Atanan tedarikçi'} üzerinden ${siparisMiktari} adet sipariş işlendi` +
        `${siparisNo ? ` (${siparisNo})` : ''}; stok ${hedefStok ?? yeniStok} seviyesine tamamlandı.`,
    })

    return {
      ...ilgiliUrun,
      magazaStok: yeniStok,
    }
  }

  const envanterSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamEnvanterSayfa) return
    setEnvanterSayfa(sayfa)
  }

  const urunDuzenlemeSayfayaGit = (sayfa) => {
    if (sayfa < 1 || sayfa > toplamUrunDuzenlemeSayfa) return
    setUrunDuzenlemeSayfa(sayfa)
  }

  const barkodAlanlariniTemizle = () => {
    setBarkodMetni('')
    setBarkodMiktari('1')
  }

  const barkodModaliniAc = () => {
    barkodAlanlariniTemizle()
    setBarkodSepeti([])
    setBarkodIslemTuru('alis')
    setBarkodModalAcik(true)
  }

  const barkodModaliniKapat = () => {
    barkodAlanlariniTemizle()
    setBarkodSepeti([])
    setBarkodIslemTuru('alis')
    setBarkodModalAcik(false)
  }

  const barkodIslemTurunuDegistir = (yeniTur) => {
    if (yeniTur === barkodIslemTuru) return

    if (barkodSepeti.length > 0) {
      setBarkodSepeti([])
      toastGoster?.('uyari', 'İşlem türü değiştiği için mevcut sepet temizlendi.')
    }

    barkodAlanlariniTemizle()
    setBarkodIslemTuru(yeniTur)
  }

  const barkodMiktariGuncelle = (deger) => {
    if (deger === '') {
      setBarkodMiktari('')
      return
    }

    setBarkodMiktari(deger.replace(/[^\d]/g, ''))
  }

  const barkodAdayiniSec = (urun, secenekler = {}) => {
    if (!urun) return
    setBarkodMetni(secenekler.barkodMetni ?? urun.urunId ?? urun.barkod)
  }

  const barkodSepeteEkle = (adayUrun = barkodSeciliUrun, secenekler = {}) => {
    const miktar = Number(barkodMiktari)

    if (!adayUrun) {
      toastGoster?.('hata', 'Geçerli bir barkod veya ürün ID girin.')
      return
    }

    if (!Number.isInteger(miktar) || miktar <= 0) {
      toastGoster?.('hata', 'Miktar en az 1 olmalıdır.')
      return
    }

    const sepettekiKalem = barkodSepeti.find((kalem) => kalem.uid === adayUrun.uid)
    const sepettekiMevcutMiktar = sepettekiKalem?.miktar ?? 0
    const toplamIstenenMiktar = sepettekiMevcutMiktar + miktar

    if (barkodIslemTuru === 'satis' && toplamIstenenMiktar > adayUrun.magazaStok) {
      toastGoster?.('hata', `${adayUrun.ad} için yeterli mağaza stoğu yok.`)
      return
    }

    setBarkodSepeti((onceki) => {
      if (sepettekiKalem) {
        return onceki.map((kalem) =>
          kalem.uid === adayUrun.uid ? { ...kalem, miktar: toplamIstenenMiktar } : kalem,
        )
      }

      return [
        ...onceki,
        {
          uid: adayUrun.uid,
          urunId: adayUrun.urunId,
          barkod: adayUrun.barkod,
          ad: adayUrun.ad,
          kategori: adayUrun.kategori,
          avatar: adayUrun.avatar,
          miktar,
          mevcutStok: adayUrun.magazaStok,
        },
      ]
    })

    if (secenekler.metniKoru) {
      setBarkodMiktari('1')
    } else {
      barkodAlanlariniTemizle()
    }
    toastGoster?.('basari', `${adayUrun.ad} sepete eklendi.`)
  }

  const barkodKalemMiktariniDegistir = (uid, yeniMiktar) => {
    const miktar = Number(yeniMiktar)
    if (!Number.isInteger(miktar) || miktar <= 0) return

    setBarkodSepeti((onceki) =>
      onceki.map((kalem) => {
        if (kalem.uid !== uid) return kalem

        const ilgiliUrun = urunler.find((urun) => urun.uid === uid)
        if (barkodIslemTuru === 'satis' && ilgiliUrun && miktar > ilgiliUrun.magazaStok) {
          return kalem
        }

        return { ...kalem, miktar }
      }),
    )
  }

  const barkodKaleminiKaldir = (uid) => {
    setBarkodSepeti((onceki) => onceki.filter((kalem) => kalem.uid !== uid))
  }

  const barkodSepetiniTemizle = () => {
    setBarkodSepeti([])
    barkodAlanlariniTemizle()
  }

  const barkodStoklariniGuncelle = () => {
    if (barkodSepeti.length === 0) {
      toastGoster?.('hata', 'Önce sepete en az bir ürün ekleyin.')
      return
    }

    const yetersizKalem =
      barkodIslemTuru === 'satis'
        ? barkodSepeti.find((kalem) => {
            const ilgiliUrun = urunler.find((urun) => urun.uid === kalem.uid)
            return !ilgiliUrun || kalem.miktar > ilgiliUrun.magazaStok
          })
        : null

    if (yetersizKalem) {
      toastGoster?.('hata', `${yetersizKalem.ad} için yeterli stok bulunmuyor.`)
      return
    }

    const updateData = {
      items: barkodSepeti.map((kalem) => ({ uid: kalem.uid, miktar: kalem.miktar })),
      type: barkodIslemTuru,
    }

    productApi.bulkStockUpdate(updateData).then(() => {
      setUrunler((onceki) =>
        onceki.map((urun) => {
          const kalem = barkodSepeti.find((item) => item.uid === urun.uid)
          if (!kalem) return urun

          const yeniStok = barkodIslemTuru === 'alis'
            ? urun.magazaStok + kalem.miktar
            : urun.magazaStok - kalem.miktar

          return {
            ...urun,
            magazaStok: yeniStok,
          }
        }),
      )

      barkodSepeti.forEach((kalem) => {
        const ilgiliUrun = urunler.find((urun) => urun.uid === kalem.uid)
        if (!ilgiliUrun) return

        const yeniStok = barkodIslemTuru === 'alis'
          ? ilgiliUrun.magazaStok + kalem.miktar
          : ilgiliUrun.magazaStok - kalem.miktar

        stokLoguEkle({
          urun: ilgiliUrun.ad,
          urunId: ilgiliUrun.urunId,
          eskiStok: ilgiliUrun.magazaStok,
          yeniStok,
          islem: barkodIslemTuru === 'alis' ? 'Stok artışı' : 'Stok düşüşü',
          aciklama:
            barkodIslemTuru === 'alis'
              ? `Barkod ekranından ${kalem.miktar} adet stok girişi yapıldı.`
              : `Barkod ekranından ${kalem.miktar} adet stok çıkışı yapıldı.`,
        })
      })

      toastGoster?.(
        'basari',
        barkodIslemTuru === 'alis'
          ? `${barkodToplamKalem} kalem için stok girişi tamamlandı.`
          : `${barkodToplamKalem} kalem için stok çıkışı tamamlandı.`,
      )

      barkodModaliniKapat()
    }).catch((err) => {
      console.error('Stoklar güncellenirken hata:', err)
      toastGoster?.('hata', 'Stoklar güncellenirken sunucu hatası oluştu.')
    })
  }

  const inventoryModallariniKapat = () => {
    eklemePenceresiniKapat()
    duzenlemePenceresiniKapat()
    setSilinecekUrun(null)
    urunDuzenlemeModaliniKapat()
    setSilinecekDuzenlemeUrunu(null)
    barkodModaliniKapat()
  }

  return {
    urunler,
    kategoriler,
    stokDegisimLoglari,
    aramaMetni,
    setAramaMetni,
    envanterKategori,
    setEnvanterKategori,
    envanterSayfa,
    setEnvanterSayfa,
    urunDuzenlemeArama,
    setUrunDuzenlemeArama,
    urunDuzenlemeSayfa,
    setUrunDuzenlemeSayfa,
    urunDuzenlemeSekmesi,
    setUrunDuzenlemeSekmesi,
    stokLogSayfa,
    setStokLogSayfa,
    eklemeAcik,
    duzenlemeAcik,
    silinecekUrun,
    setSilinecekUrun,
    urunDuzenlemeModalAcik,
    silinecekDuzenlemeUrunu,
    setSilinecekDuzenlemeUrunu,
    form,
    urunDuzenlemeFormu,
    barkodModalAcik,
    barkodIslemTuru,
    barkodMetni,
    barkodMiktari,
    barkodSepeti,
    barkodEslesmeleri,
    barkodSeciliUrun,
    barkodToplamKalem,
    barkodToplamAdet,
    filtreliUrunler,
    toplamEnvanterSayfa,
    sayfaBaslangic,
    sayfadakiUrunler,
    toplamUrunDuzenlemeSayfa,
    urunDuzenlemeBaslangic,
    sayfadakiDuzenlemeUrunleri,
    toplamStokLogSayfa,
    stokLogBaslangic,
    sayfadakiStokLoglari,
    formGuncelle,
    eklemePenceresiniAc,
    eklemePenceresiniKapat,
    duzenlemePenceresiniAc,
    duzenlemePenceresiniKapat,
    formKaydet,
    urunSil,
    urunDuzenlemeModaliniAc,
    urunDuzenlemeModaliniKapat,
    urunDuzenlemeFormuGuncelle,
    urunDuzenlemeKaydet,
    urunDuzenlemeSil,
    barkodModaliniAc,
    barkodModaliniKapat,
    barkodIslemTurunuDegistir,
    barkodAdayiniSec,
    setBarkodMetni,
    barkodMiktariGuncelle,
    barkodSepeteEkle,
    barkodKalemMiktariniDegistir,
    barkodKaleminiKaldir,
    barkodSepetiniTemizle,
    barkodStoklariniGuncelle,
    favoriDegistir,
    urunStokunuAzalt,
    otomatikStokKorumasiniUygula,
    envanterSayfayaGit,
    urunDuzenlemeSayfayaGit,
    inventoryModallariniKapat,
    loading,
  }
}
