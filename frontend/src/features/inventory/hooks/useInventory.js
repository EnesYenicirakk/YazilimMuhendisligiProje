import { useEffect, useMemo, useState } from 'react'
import {
  avatarOlustur,
  bosForm,
  bosUrunDuzenlemeFormu,
  favorileriOneTasi,
  negatifSayiVarMi,
} from '../../../shared/utils/constantsAndHelpers'
import { productApi, categoryApi } from '../../../core/services/backendApiService'

const SAYFA_BASINA_URUN = 8
const STOK_LOG_SAYFA_BASINA = 8
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
            urun.urunId.toLowerCase().includes(metin),
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
            urun.urunId.toLowerCase().includes(metin),
        )

    return favorileriOneTasi(sonuc)
  }, [urunDuzenlemeArama, urunler])

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
    setForm((onceki) => {
      const yeniForm = { ...onceki, [alan]: sonrakiDeger }
      if (alan === 'kategori' && eklemeAcik) {
        yeniForm.urunId = urunIdOlustur(deger)
      }
      return yeniForm
    })
  }

  const formuTemizle = () => {
    setForm(bosForm)
    setSeciliUid(null)
  }

  const urunIdOlustur = (kategori = 'Diğer') => {
    const mapping = {
      Elektrik: 'ELK',
      Filtre: 'FLT',
      Fren: 'FRN',
      'Fren Balataları': 'BLT',
      Motor: 'MTR',
      Şanzıman: 'SNZ',
      Diğer: 'DGR',
      Aydınlatma: 'AYD',
      'Süspansiyon ve Direksiyon': 'SSP',
      'Soğutma Sistemi': 'SGT',
      'Yakıt ve Ateşleme': 'YKT',
      'Yağlar ve Sıvılar': 'YAG',
      'Kaporta ve Karoseri': 'KPR',
      'Debriyaj Sistemi': 'DBR',
      'Egzoz Sistemi': 'EGZ',
      'Aksesuar ve Bakım': 'AKS',
    }
    const prefix = mapping[kategori] || (kategori.substring(0, 3).toUpperCase())
    const rastgeleSayi = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}-${rastgeleSayi}`
  }

  const eklemePenceresiniAc = () => {
    formuTemizle()
    setForm((onceki) => ({ ...onceki, urunId: urunIdOlustur() }))
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
      kategori: urun.kategori || 'Diğer',
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
      minimumStok: String(urun.minimumStok ?? 10),
      alisFiyati: String(urun.alisFiyati ?? 0),
      satisFiyati: String(urun.satisFiyati ?? 0),
      tedarikciUid: urun.tedarikciUid || '',
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
    const kategori = form.kategori || 'Diğer'
    const urunAdedi = Number(form.urunAdedi)
    const magazaStok = Number(form.magazaStok)
    const minimumStok = Number(form.minimumStok)
    const alisFiyati = Number(form.alisFiyati || 0)
    const satisFiyati = Number(form.satisFiyati || 0)
    const tedarikciUid = form.tedarikciUid

    if (!urunId || !ad || !kategori || [urunAdedi, magazaStok, minimumStok, alisFiyati, satisFiyati].some((deger) => Number.isNaN(deger))) {
      toastGoster?.('hata', 'Zorunlu alanları (*) doldurduğunuzdan emin olun.')
      return
    }

    if (negatifSayiVarMi(urunAdedi, magazaStok, minimumStok, alisFiyati, satisFiyati)) {
      toastGoster?.('hata', 'Adet, stok ve fiyat alanları negatif olamaz.')
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
        alisFiyati,
        satisFiyati,
        kategori,
        tedarikciUid,
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
      alisFiyati,
      satisFiyati,
      kategori,
      tedarikciUid,
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
      kategori: urun.kategori || 'Diğer',
      urunAdedi: String(urun.urunAdedi),
      magazaStok: String(urun.magazaStok),
      alisFiyati: String(urun.alisFiyati ?? 0),
      satisFiyati: String(urun.satisFiyati ?? 0),
      tedarikciUid: urun.tedarikciUid || '',
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
    const kategori = urunDuzenlemeFormu.kategori || 'Diğer'
    const urunAdedi = Number(urunDuzenlemeFormu.urunAdedi)
    const magazaStok = Number(urunDuzenlemeFormu.magazaStok)
    const alisFiyati = Number(urunDuzenlemeFormu.alisFiyati)
    const satisFiyati = Number(urunDuzenlemeFormu.satisFiyati)
    const tedarikciUid = urunDuzenlemeFormu.tedarikciUid

    if (!urunId || !ad || !kategori || [urunAdedi, magazaStok, alisFiyati, satisFiyati].some((deger) => Number.isNaN(deger))) {
      toastGoster?.('hata', 'Zorunlu alanları (*) doldurduğunuzdan emin olun.')
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
      kategori,
      tedarikciUid,
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
      urunId: urun.urunId,
      barkod: urun.barkod ?? '',
      ad: urun.ad,
      avatar: urun.avatar ?? '',
      kategori: urun.kategori || 'Diğer',
      urunAdedi: Number(urun.urunAdedi ?? 0),
      magazaStok: Number(urun.magazaStok ?? 0),
      minimumStok: Number(urun.minimumStok ?? 0),
      alisFiyati: Number(urun.alisFiyati ?? 0),
      satisFiyati: Number(urun.satisFiyati ?? 0),
      tedarikciUid: urun.tedarikciUid ?? '',
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

  const inventoryModallariniKapat = () => {
    eklemePenceresiniKapat()
    duzenlemePenceresiniKapat()
    setSilinecekUrun(null)
    urunDuzenlemeModaliniKapat()
    setSilinecekDuzenlemeUrunu(null)
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
    favoriDegistir,
    urunStokunuAzalt,
    otomatikStokKorumasiniUygula,
    envanterSayfayaGit,
    urunDuzenlemeSayfayaGit,
    inventoryModallariniKapat,
    loading,
  }
}

