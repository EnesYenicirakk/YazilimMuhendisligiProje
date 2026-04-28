import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../../../core/api/apiClient'
import {
  avatarOlustur,
  barkodOlustur,
  bosForm,
  bosUrunDuzenlemeFormu,
  favorileriOneTasi,
  negatifSayiVarMi,
} from '../../../shared/utils/constantsAndHelpers'

const SAYFA_BASINA_URUN = 8
const STOK_LOG_SAYFA_BASINA = 8
const barkodMetniniNormalizeEt = (deger) => String(deger ?? '').replace(/\s+/g, '').toLocaleLowerCase('tr-TR')

export default function useInventory({ toastGoster, isLoggedIn }) {
  const [urunler, setUrunler] = useState([])
  const [stokDegisimLoglari, setStokDegisimLoglari] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)

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

  // Backend'den ürünleri ve stok loglarını yükle
  const urunleriFetchle = useCallback(async () => {
    try {
      const data = await api.get('/products')
      const urunListesi = (data?.data ?? data ?? []).map((u) => ({
        uid: u.uid,
        urunId: u.urunId,
        barkod: u.barkod,
        kategori: u.kategori ?? 'Diğer',
        ad: u.ad,
        avatar: u.avatar,
        urunAdedi: u.urunAdedi ?? 0,
        magazaStok: u.magazaStok ?? 0,
        minimumStok: u.minimumStok ?? 10,
        alisFiyati: u.alisFiyati ?? 0,
        satisFiyati: u.satisFiyati ?? 0,
        favori: u.favori ?? false,
      }))
      setUrunler(urunListesi)
    } catch {
      toastGoster?.('hata', 'Ürünler yüklenirken hata oluştu.')
    }
  }, [toastGoster])

  const stokLoglariFetchle = useCallback(async () => {
    try {
      const data = await api.get('/stock-logs')
      const logListesi = (data?.data ?? data ?? []).map((l) => ({
        id: l.uid,
        tarih: l.tarih,
        urun: l.urun,
        urunId: l.urunId,
        islem: l.islem,
        eskiStok: l.eskiStok,
        yeniStok: l.yeniStok,
        kullanici: l.kullanici ?? 'Admin',
        aciklama: l.aciklama,
      }))
      setStokDegisimLoglari(logListesi)
    } catch {
      // Stok log hatası sessiz geçsin
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return
    setYukleniyor(true)
    Promise.all([urunleriFetchle(), stokLoglariFetchle()]).finally(() =>
      setYukleniyor(false),
    )
  }, [isLoggedIn, urunleriFetchle, stokLoglariFetchle])

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
    setForm((onceki) => ({ ...onceki, [alan]: deger }))
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

  const formKaydet = async (mod) => {
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

    try {
      if (mod === 'ekle') {
        const yanit = await api.post('/products', {
          sku: urunId, name: ad, stock_quantity: urunAdedi,
          store_stock: magazaStok, minimum_stock: magazaStok,
          category_id: 7, // Diğer — kullanıcı sonradan değiştirebilir
        })
        const yeni = yanit?.data ?? yanit
        const yeniUrun = {
          uid: yeni.uid, urunId: yeni.urunId, barkod: yeni.barkod,
          kategori: yeni.kategori ?? 'Diğer',
          ad: yeni.ad, avatar: yeni.avatar ?? avatarOlustur(ad),
          urunAdedi: yeni.urunAdedi ?? urunAdedi, magazaStok: yeni.magazaStok ?? magazaStok,
          minimumStok: yeni.minimumStok ?? minimumStok, alisFiyati: 0, satisFiyati: 0, favori: false,
        }
        setUrunler((p) => [yeniUrun, ...p])
        eklemePenceresiniKapat()
        setEnvanterSayfa(1)
        toastGoster?.('basari', `${ad} envantere eklendi.`)
      } else {
        const mevcutUrun = urunler.find((u) => u.uid === seciliUid)
        await api.put(`/products/${seciliUid}`, {
          sku: urunId, name: ad, stock_quantity: urunAdedi,
          store_stock: magazaStok, minimum_stock: minimumStok,
        })
        const guncellenenUrun = { ...(mevcutUrun ?? {}), urunId, ad, urunAdedi, magazaStok, minimumStok, avatar: avatarOlustur(ad) }
        setUrunler((p) => p.map((u) => (u.uid === seciliUid ? guncellenenUrun : u)))
        stokDegisimiLogla({
          oncekiUrun: mevcutUrun,
          sonrakiUrun: guncellenenUrun,
          artisMesaji: (fark) => `Ürün düzenlemesinde stok ${fark} adet artırıldı.`,
          dususMesaji: (fark) => `Ürün düzenlemesinde stok ${fark} adet azaltıldı.`,
        })
        duzenlemePenceresiniKapat()
        toastGoster?.('basari', `${ad} bilgileri güncellendi.`)
      }
    } catch {
      toastGoster?.('hata', 'İşlem sırasında hata oluştu.')
    }
  }

  const urunSil = async () => {
    if (!silinecekUrun) return
    const silinenUrun = { ...silinecekUrun }
    const silinenAd = silinenUrun.ad
    try {
      await api.delete(`/products/${silinenUrun.uid}`)
      setUrunler((p) => p.filter((u) => u.uid !== silinenUrun.uid))
      setSilinecekUrun(null)
      toastGoster?.('basari', `${silinenAd} envanterden silindi.`)
    } catch {
      toastGoster?.('hata', 'Ürün silinirken hata oluştu.')
    }
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
    setUrunDuzenlemeFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const urunDuzenlemeKaydet = async () => {
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
    const guncellenenUrun = {
      ...(mevcutUrun ?? {}),
      urunId,
      barkod: mevcutUrun?.barkod ?? barkodOlustur(urunDuzenlemeUid),
      kategori: mevcutUrun?.kategori ?? 'Diğer',
      ad,
      urunAdedi,
      magazaStok,
      alisFiyati,
      satisFiyati,
      avatar: avatarOlustur(ad),
    }

    setUrunler((onceki) =>
      onceki.map((urun) =>
        urun.uid === urunDuzenlemeUid
          ? guncellenenUrun
          : urun,
      ),
    )

    stokDegisimiLogla({
      oncekiUrun: mevcutUrun,
      sonrakiUrun: guncellenenUrun,
      artisMesaji: (fark) => `Ürün güncellemesinde stok ${fark} adet artırıldı.`,
      dususMesaji: (fark) => `Ürün güncellemesinde stok ${fark} adet azaltıldı.`,
    })

    urunDuzenlemeModaliniKapat()
    toastGoster?.('basari', `${ad} fiyat ve stok bilgileri kaydedildi.`)
  }

  const urunDuzenlemeSil = () => {
    if (!silinecekDuzenlemeUrunu) return
    const silinenUrun = { ...silinecekDuzenlemeUrunu }
    const silinenAd = silinenUrun.ad
    const silinenIndex = urunler.findIndex((urun) => urun.uid === silinenUrun.uid)
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
    toastGoster?.('basari', `${silinenAd} ürün düzenleme listesinden kaldırıldı.`, {
      eylemEtiketi: 'Geri Al',
      sure: 5000,
      eylem: () => {
        setUrunler((onceki) => {
          if (onceki.some((urun) => urun.uid === silinenUrun.uid)) return onceki
          const yeni = [...onceki]
          yeni.splice(silinenIndex < 0 ? yeni.length : silinenIndex, 0, silinenUrun)
          return yeni
        })
        stokLoguEkle({
          urun: silinenUrun.ad,
          urunId: silinenUrun.urunId,
          eskiStok: 0,
          yeniStok: silinenUrun.magazaStok,
          islem: 'Stok artışı',
          aciklama: 'Silme işlemi geri alındı ve ürün yeniden ürün listesine eklendi.',
        })
        toastGoster?.('basari', `${silinenAd} geri alındı.`)
      },
    })
  }

  const favoriDegistir = (uid) => {
    setUrunler((onceki) =>
      onceki.map((urun) => (urun.uid === uid ? { ...urun, favori: !urun.favori } : urun)),
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
    otomatikStokKorumasiniUygula,
    envanterSayfayaGit,
    urunDuzenlemeSayfayaGit,
    inventoryModallariniKapat,
    yukleniyor,
    urunleriFetchle,
  }
}
