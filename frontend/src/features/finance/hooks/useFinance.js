import { useMemo, useState } from 'react'
import {
  favorileriOneTasi,
  gerceklesenOdemeTutari,
  odemeDurumunuStandartlastir,
} from '../../../shared/utils/constantsAndHelpers'

const ODEME_SAYFA_BASINA = 10
const BOS_ODEME_FORMU = { taraf: '', tarih: '', durum: '', tutar: '' }

const tedarikSiparisiDurumunuFinansaCevir = (durum) => {
  const normalize = String(durum ?? '').trim().toLocaleLowerCase('tr-TR')
  if (normalize === 'teslim alındı') return 'Ödendi'
  if (normalize === 'iptal') return 'İptal'
  return 'Beklemede'
}

const siparisiTahsilataDonustur = (siparis, favori = false) => {
  const durum = odemeDurumunuStandartlastir(siparis?.odemeDurumu)
  if ((siparis?.musteriUid == null && !siparis?.musteri) || (durum !== 'Ödendi' && durum !== 'Kısmi')) {
    return null
  }

  const urunAdedi = Number(siparis?.urunAdedi ?? siparis?.miktar ?? 0)

  return {
    odemeNo: `TSL-${siparis.siparisNo}`,
    taraf: siparis.musteri ?? 'Kayıtsız Müşteri',
    tarih: siparis.siparisTarihi,
    durum,
    tutar: Number(siparis.toplamTutar ?? 0),
    odenenTutar: Number(siparis.toplamTutar ?? 0),
    favori,
    aciklama: `${siparis.urun ?? 'Sipariş'} · ${urunAdedi} adet`,
    kaynakTipi: 'musteri-siparisi',
    kilitli: true,
  }
}

const tedarikSiparisiniOdemeyeDonustur = (siparis, favori = false) => ({
  odemeNo: `ODM-${siparis.siparisNo}`,
  taraf: siparis.firmaAdi ?? 'Tedarikçi',
  tarih: siparis.tarih,
  durum: tedarikSiparisiDurumunuFinansaCevir(siparis.durum),
  tutar: Number(siparis.tutar ?? 0),
  odenenTutar: Number(siparis.tutar ?? 0),
  favori,
  aciklama: `${siparis.urun || 'Tedarik siparişi'} · ${Number(siparis.miktar ?? 0)} adet`,
  kaynakTipi: 'tedarik-siparisi',
  kilitli: true,
})

export default function useFinance({
  toastGoster,
  isLoggedIn,
  siparisler = [],
  tedarikSiparisleri = [],
}) {
  const [odemeSekmesi, setOdemeSekmesi] = useState('gelen')
  const [gelenSayfa, setGelenSayfa] = useState(1)
  const [gidenSayfa, setGidenSayfa] = useState(1)
  const [duzenlenenOdeme, setDuzenlenenOdeme] = useState(null)
  const [odemeFormu, setOdemeFormu] = useState(BOS_ODEME_FORMU)
  const [silinecekOdeme, setSilinecekOdeme] = useState(null)
  const [favoriKayitlari, setFavoriKayitlari] = useState({})

  const gelenNakitListesi = useMemo(
    () =>
      siparisler
        .map((siparis) =>
          siparisiTahsilataDonustur(siparis, Boolean(favoriKayitlari[`gelen:${siparis.siparisNo}`])),
        )
        .filter(Boolean),
    [favoriKayitlari, siparisler],
  )

  const gidenNakitListesi = useMemo(
    () =>
      tedarikSiparisleri.map((siparis) =>
        tedarikSiparisiniOdemeyeDonustur(
          siparis,
          Boolean(favoriKayitlari[`giden:${siparis.siparisNo}`]),
        ),
      ),
    [favoriKayitlari, tedarikSiparisleri],
  )

  const siraliGelenNakit = useMemo(
    () => favorileriOneTasi(gelenNakitListesi, (kayit) => new Date(kayit.tarih).getTime()),
    [gelenNakitListesi],
  )

  const siraliGidenNakit = useMemo(
    () => favorileriOneTasi(gidenNakitListesi, (kayit) => new Date(kayit.tarih).getTime()),
    [gidenNakitListesi],
  )

  const toplamGelenNakit = useMemo(
    () => siraliGelenNakit.reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0),
    [siraliGelenNakit],
  )

  const toplamGidenNakit = useMemo(
    () => siraliGidenNakit.reduce((toplam, kayit) => toplam + gerceklesenOdemeTutari(kayit), 0),
    [siraliGidenNakit],
  )

  const aySonuKari = toplamGelenNakit - toplamGidenNakit
  const toplamGelenSayfa = Math.max(1, Math.ceil(siraliGelenNakit.length / ODEME_SAYFA_BASINA))
  const toplamGidenSayfa = Math.max(1, Math.ceil(siraliGidenNakit.length / ODEME_SAYFA_BASINA))

  const gelenSayfadakiKayitlar = siraliGelenNakit.slice(
    (gelenSayfa - 1) * ODEME_SAYFA_BASINA,
    gelenSayfa * ODEME_SAYFA_BASINA,
  )

  const gidenSayfadakiKayitlar = siraliGidenNakit.slice(
    (gidenSayfa - 1) * ODEME_SAYFA_BASINA,
    gidenSayfa * ODEME_SAYFA_BASINA,
  )

  const finansFavoriDegistir = (sekme, odemeNo) => {
    const kayitAnahtari = `${sekme}:${String(odemeNo).replace(/^(TSL|ODM)-/i, '')}`
    setFavoriKayitlari((onceki) => ({
      ...onceki,
      [kayitAnahtari]: !onceki[kayitAnahtari],
    }))
  }

  const odemeDuzenlemeAc = (_sekme, kayit) => {
    if (kayit?.kilitli) {
      toastGoster?.('uyari', 'Bu kayıt siparişlerden otomatik oluşturuluyor. Düzenlemek için ilgili siparişi güncelleyin.')
      return
    }

    setDuzenlenenOdeme({ sekme: _sekme, odemeNo: kayit.odemeNo })
    setOdemeFormu({
      taraf: kayit.taraf,
      tarih: kayit.tarih,
      durum: kayit.durum,
      tutar: String(kayit.tutar),
    })
  }

  const odemeSilmeAc = (kayit) => {
    if (kayit?.kilitli) {
      toastGoster?.('uyari', 'Bu kayıt siparişlerden otomatik oluşturuluyor. Silmek için ilgili siparişi iptal edin veya kaldırın.')
      return
    }

    setSilinecekOdeme(kayit)
  }

  const odemeDuzenlemeKapat = () => {
    setDuzenlenenOdeme(null)
    setOdemeFormu(BOS_ODEME_FORMU)
  }

  const odemeFormuGuncelle = (alan, deger) => {
    setOdemeFormu((onceki) => ({ ...onceki, [alan]: deger }))
  }

  const odemeDuzenlemeKaydet = () => {
    toastGoster?.('uyari', 'Finans kayıtları sipariş akışından otomatik üretiliyor. Düzenleme için ilgili sipariş ekranını kullanın.')
    odemeDuzenlemeKapat()
  }

  const odemeSilmeKapat = () => {
    setSilinecekOdeme(null)
  }

  const odemeSil = () => {
    toastGoster?.('uyari', 'Finans kayıtları sipariş akışından otomatik üretiliyor. Silme için ilgili sipariş ekranını kullanın.')
    odemeSilmeKapat()
  }

  const financeModallariniKapat = () => {
    odemeDuzenlemeKapat()
    odemeSilmeKapat()
  }

  return {
    odemeSekmesi,
    setOdemeSekmesi,
    gelenSayfa,
    setGelenSayfa,
    gidenSayfa,
    setGidenSayfa,
    duzenlenenOdeme,
    odemeFormu,
    silinecekOdeme,
    gelenSayfadakiKayitlar,
    gidenSayfadakiKayitlar,
    toplamGelenSayfa,
    toplamGidenSayfa,
    toplamGelenNakit,
    toplamGidenNakit,
    aySonuKari,
    siraliGelenNakit,
    siraliGidenNakit,
    finansFavoriDegistir,
    odemeDuzenlemeAc,
    odemeSilmeAc,
    odemeDuzenlemeKapat,
    odemeFormuGuncelle,
    odemeDuzenlemeKaydet,
    setSilinecekOdeme,
    odemeSilmeKapat,
    odemeSil,
    financeModallariniKapat,
    loading: !isLoggedIn ? true : false,
  }
}
