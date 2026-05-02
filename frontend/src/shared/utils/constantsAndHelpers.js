
export const tarihFormatla = (isoTarih) => {
  if (!isoTarih) return ''
  const tarih = new Date(isoTarih)
  if (isNaN(tarih.getTime())) return isoTarih
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tarih)
}

export const envanterKategorileri = ['Tümü', 'Motor', 'Fren', 'Filtre', 'Elektrik', 'Şanzıman', 'Diğer']

const FATURA_KDV_ORANI = 0.2

export const avatarOlustur = (ad) =>
  ad
    .split(' ')
    .slice(0, 2)
    .map((parca) => parca[0].toUpperCase() || '')
    .join('')
    .slice(0, 2)

export const gunEtiketiKisalt = (etiket) => {
  const harita = {
    Pzt: 'P',
    Sal: 'S',
    Çar: 'Ç',
    Per: 'P',
    Cum: 'C',
    Cmt: 'C',
    Paz: 'P',
  }

  return harita[etiket] || etiket.charAt(0) || etiket
}

const barkodKontrolBasamagiHesapla = (govde) => {
  const toplam = String(govde)
    .split('')
    .reduce((akumulator, rakam, index) => {
      const katsayi = index % 2 === 0 ? 1 : 3
      return akumulator + Number(rakam) * katsayi
    }, 0)

  return (10 - (toplam % 10)) % 10
}

export const barkodOlustur = (kaynak) => {
  const seriNo = String(kaynak ?? '')
    .replace(/\D/g, '')
    .slice(-6)
    .padStart(6, '0')
  const govde = `869100${seriNo}`
  return `${govde}${barkodKontrolBasamagiHesapla(govde)}`
}

export const urunOlustur = (uid, urunId, kategori, ad, urunAdedi, magazaStok, minimumStok, alisFiyati, satisFiyati, barkod = barkodOlustur(uid)) => ({
  uid,
  urunId,
  barkod,
  kategori,
  ad,
  avatar: avatarOlustur(ad),
  urunAdedi,
  magazaStok,
  minimumStok,
  alisFiyati,
  satisFiyati,
  favori: false,
})

export const baslangicUrunleri = []

export const dashboardBolumSablonu = [
  { anahtar: 'canli', etiket: 'Canlı Özetler' },
  { anahtar: 'haftalik', etiket: 'Haftalık Grafik ve En Çok Satanlar' },
  { anahtar: 'kritik', etiket: 'Kritik Stok Uyarısı' },
  { anahtar: 'oncelikler', etiket: 'Bugünkü Öncelikler' },
  { anahtar: 'yakin', etiket: 'Yakın Zamanda Satılan Ürünler' },
  { anahtar: 'altGrafikler', etiket: 'Alt Grafikler' },
]

export const paraFormatla = (deger) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(deger)
}

export const cizgiNoktalari = (degerler, maksimumDeger) => {
  const maxDeger = maksimumDeger || Math.max(...degerler, 1)
  const xAlan = 300
  const yAlan = 90

  return degerler
    .map((deger, index) => {
      const x = 10 + (index * xAlan) / Math.max(degerler.length - 1, 1)
      const y = 10 + yAlan - (deger / maxDeger) * yAlan
      return `${x},${y}`
    })
    .join(' ')
}

export const durumSinifi = (durum) => {
  if (durum === 'Yolda' || durum === 'Kargoda') return 'durum-yolda'
  if (durum === 'Hazırlanıyor') return 'durum-hazirlaniyor'
  if (durum === 'Teslim Edildi') return 'durum-teslim'
  return ''
}

export const teslimatGununuCoz = (metin) => {
  const eslesme = String(metin).match(/(\d+)/)
  return eslesme ? Number(eslesme[1]) : 0
}

export const siparisMiktariniGetir = (siparis) => {
  const miktar = Number(siparis?.miktar)
  return Number.isFinite(miktar) && miktar > 0 ? miktar : 1
}

export const siparisTamamlandiMi = (siparis) =>
  siparis?.teslimatDurumu === 'Teslim Edildi' ||
  siparis?.durum === 'Teslim Edildi' ||
  siparis?.durum === 'Tamamlandı'

export const odemeDurumunuStandartlastir = (durum) => {
  const normalize = String(durum ?? '').trim().toLocaleLowerCase('tr-TR')
  if (normalize === 'tahsil edildi' || normalize === 'ödendi') return 'Ödendi'
  if (normalize === 'beklemede') return 'Beklemede'
  if (normalize === 'iptal') return 'İptal'
  if (normalize === 'kısmi' || normalize === 'kismi') return 'Kısmi'
  return 'Beklemede'
}

export const gerceklesenOdemeTutari = (kayit) => {
  const durum = odemeDurumunuStandartlastir(kayit?.durum)
  const odemeTutari = Number(kayit?.odenenTutar ?? kayit?.tutar ?? 0)
  return durum === 'Ödendi' || durum === 'Kısmi' ? odemeTutari : 0
}

export const enCokSatilanUrunleriHesapla = (siparisler, limit = 6) => {
  const satisOzetleri = siparisler.reduce((harita, siparis) => {
    if (!siparisTamamlandiMi(siparis)) return harita

    const urunAdi = String(siparis.urun ?? '').trim()
    if (!urunAdi) return harita

    harita.set(urunAdi, (harita.get(urunAdi) ?? 0) + siparisMiktariniGetir(siparis))
    return harita
  }, new Map())

  return Array.from(satisOzetleri.entries())
    .map(([ad, miktar]) => ({ ad, miktar }))
    .sort((a, b) => b.miktar - a.miktar || a.ad.localeCompare(b.ad, 'tr'))
    .slice(0, limit)
}

export const telefonuNormalizeEt = (telefon) => telefon.replace(/\D/g, '')

export const telefonGecerliMi = (telefon) => {
  const rakamlar = telefonuNormalizeEt(telefon)
  return /^0\d{10}$/.test(rakamlar)
}

export const negatifSayiVarMi = (...degerler) => degerler.some((deger) => Number(deger) < 0)

export const bosForm = {
  urunId: '',
  ad: '',
  kategori: '',
  urunAdedi: '',
  magazaStok: '',
  minimumStok: '',
  alisFiyati: '',
  satisFiyati: '',
  tedarikciUid: '',
}

export const bosUrunDuzenlemeFormu = {
  urunId: '',
  ad: '',
  kategori: '',
  urunAdedi: '',
  magazaStok: '',
  alisFiyati: '',
  satisFiyati: '',
  tedarikciUid: '',
}

export const bosMusteriFormu = {
  ad: '',
  yetkiliKisi: '',
  telefon: '',
  email: '',
  adres: '',
  vergiNumarasi: '',
  sonAlim: '',
  not: '',
}

export const bosTedarikciFormu = {
  firmaAdi: '',
  yetkiliKisi: '',
  telefon: '',
  email: '',
  adres: '',
  vergiNumarasi: '',
  urunGrubu: '',
  not: '',
  toplamAlisSayisi: '',
  ortalamaTeslimSuresi: '',
  toplamHarcama: '',
}

export const bosTedarikciSiparisFormu = {
  siparisNo: '',
  tarih: '',
  tutar: '',
  durum: 'Bekliyor',
}

export const bosSiparisFormu = {
  musteriUid: '',
  kayitsizMusteri: false,
  musteri: '',
  urunUid: '',
  urun: '',
  urunAdedi: '1',
  toplamTutar: '',
  siparisTarihi: '',
  odemeDurumu: 'Beklemede',
  urunHazirlik: 'Hazırlanıyor',
  teslimatDurumu: 'Hazırlanıyor',
  teslimatSuresi: '',
}

export const bosFaturaSatiri = (id = Date.now()) => ({
  id,
  urunUid: '',
  urun: '',
  miktar: 1,
  birimFiyat: 0,
  kdvOrani: FATURA_KDV_ORANI,
})

export const bosFaturaFormu = {
  tur: 'Satış Faturası',
  karsiTarafUid: '',
  karsiTarafAdi: '',
  tarih: new Date().toISOString().slice(0, 10),
  odemeTarihi: new Date().toISOString().slice(0, 10),
  not: '',
  satirlar: [bosFaturaSatiri(1)],
}

export const faturaToplamlariHesapla = (satirlar) => {
  const araToplam = satirlar.reduce((toplam, satir) => toplam + Number(satir.miktar || 0) * Number(satir.birimFiyat || 0), 0)
  const kdv = satirlar.reduce(
    (toplam, satir) => toplam + Number(satir.miktar || 0) * Number(satir.birimFiyat || 0) * Number(satir.kdvOrani || FATURA_KDV_ORANI),
    0,
  )
  return {
    araToplam,
    kdv,
    toplam: araToplam + kdv,
  }
}

export const faturaKaydiOlustur = ({ id, faturaNo, tur, karsiTarafUid, karsiTarafAdi, tarih, odemeTarihi, satirlar, not, durum = 'Taslak' }) => {
  const temizSatirlar = satirlar.map((satir) => ({
    ...satir,
    miktar: Number(satir.miktar),
    birimFiyat: Number(satir.birimFiyat),
    kdvOrani: Number(satir.kdvOrani || FATURA_KDV_ORANI),
  }))
  const toplamlar = faturaToplamlariHesapla(temizSatirlar)
  return {
    id,
    faturaNo,
    tur,
    karsiTarafUid,
    karsiTarafAdi,
    tarih,
    odemeTarihi,
    satirlar: temizSatirlar,
    not,
    durum,
    ...toplamlar,
  }
}

export const baslangicFaturalari = []

export const merkezMenusu = [
  { sayfa: 'dashboard', baslik: 'Dashboard', renk: 'turuncu', aciklama: 'Özet görünüm' },
  { sayfa: 'envanter', baslik: 'Envanter', renk: 'yesil-koyu', aciklama: 'Stok yönetimi' },
  { sayfa: 'siparisler', baslik: 'Siparişler', renk: 'altin', aciklama: 'Sipariş hareketleri' },
  { sayfa: 'musteriler', baslik: 'Kayıtlı Müşteriler', renk: 'turkuaz', aciklama: 'Müşteri listesi' },
  { sayfa: 'alicilar', baslik: 'Kayıtlı Tedarikçiler', renk: 'lacivert', aciklama: 'Tedarikçi kayıtları' },
  { sayfa: 'odemeler', baslik: 'Finansal Akış', renk: 'kehribar', aciklama: 'Nakit akışı' },
  { sayfa: 'urun-duzenleme', baslik: 'Ürün Düzenleme', renk: 'mavi-gri', aciklama: 'Ürün güncelleme' },
  { sayfa: 'faturalama', baslik: 'Faturalama (PDF)', renk: 'kiremit', aciklama: 'Fatura üretimi' },
]

export const aiHizliKonular = [
  { etiket: 'Bugünkü Satış', mesaj: 'Bugün kaç TLlik satış yaptım?' },
  { etiket: 'Aylık Ciro', mesaj: 'Bu ayki toplam ciromuz ne kadar?' },
  { etiket: 'Bekleyen İşler', mesaj: 'Kaç sipariş kargolanmayı bekliyor?' },
  { etiket: 'Kritik Stoklar', mesaj: 'Stokları azalan kaç ürün var?' },
  { etiket: 'En Popüler', mesaj: 'En çok satan ürünümüz hangisi?' },
  { etiket: 'Müşteri Sayısı', mesaj: 'Kayıtlı kaç tane müşterim var?' },
  { etiket: 'Diğer', mesaj: null },
]

export const metniNormalizeEt = (metin) =>
  metin
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.!,;:]/g, '')
    .trim()

export const favorileriOneTasi = (liste, tarihAl) =>
  [...liste].sort((a, b) => {
    if (Boolean(a.favori) !== Boolean(b.favori)) return a.favori ? -1 : 1
    if (tarihAl) return tarihAl(b) - tarihAl(a)
    return 0
  })

export const kritikStoktaMi = (urun) => urun.magazaStok <= (urun.minimumStok ?? 10)

export const htmlGuvenliMetin = (metin) =>
  String(metin ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const pdfGuvenliMetin = (metin) =>
  String(metin ?? '')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')

export const pdfSatirOlustur = (metin, x, y, fontBoyutu = 12) =>
  `BT /F1 ${fontBoyutu} Tf 1 0 0 1 ${x} ${y} Tm (${pdfGuvenliMetin(metin)}) Tj ET`

export const faturaBelgeHtmlOlustur = (fatura, karsiTaraf) => {
  const guvenliKarsiTaraf = karsiTaraf ?? {}
  const logoUrl = `${window.location.origin}/ytu-logo.png`
  const gibLogoUrl = `${window.location.origin}/gib-logo.png`
  const yedekLogoUrl = `${window.location.origin}/ytu-logo.svg`
  const yedekGibLogoUrl = `${window.location.origin}/gib-logo.svg`
  const guvenliFaturaNo = htmlGuvenliMetin(fatura.faturaNo)
  const guvenliFaturaTuru = htmlGuvenliMetin(fatura.tur)
  const guvenliTarih = htmlGuvenliMetin(tarihFormatla(fatura.tarih))
  const guvenliOdemeTarihi = htmlGuvenliMetin(tarihFormatla(fatura.odemeTarihi))
  const guvenliKarsiTarafAdi = htmlGuvenliMetin(fatura.karsiTarafAdi)
  const guvenliTelefon = htmlGuvenliMetin(guvenliKarsiTaraf?.telefon ?? '')
  const guvenliAdres = htmlGuvenliMetin(guvenliKarsiTaraf?.adres ?? '')
  const guvenliVergiNo = htmlGuvenliMetin(guvenliKarsiTaraf?.vergiNumarasi ?? guvenliKarsiTaraf?.vergiNo ?? '')
  const guvenliDurum = htmlGuvenliMetin(fatura.durum)
  const guvenliNot = htmlGuvenliMetin(fatura.not || '')

  const satirlarHtml = fatura.satirlar
    .map((satir, index) => {
      const toplam = Number(satir.miktar) * Number(satir.birimFiyat)
      return `
        <tr>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${index + 1}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${htmlGuvenliMetin(satir.urun)}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${satir.miktar}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${paraFormatla(satir.birimFiyat)}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">%${Math.round((satir.kdvOrani || FATURA_KDV_ORANI) * 100)}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #dfeaf8;">${paraFormatla(toplam)}</td>
        </tr>
      `
    })
    .join('')

  return `
    <div style="width:794px;background:#fff;padding:18px 20px 22px;color:#17314d;font-family:Arial,sans-serif;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:18px;">
        <div style="max-width:255px;">
          <div style="font-size:13px;color:#61748d;margin-bottom:8px;">${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
          <div style="font-size:18px;font-weight:800;color:#1f61b8;margin-bottom:8px;">MTÜ Sanayi</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Malatya Yeşilyurt, Ankara Yolu 5. Km No:42</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Vergi No: 4481237781 | Tel: 0422 456 12 77</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">info@mtusanayi.com</div>
        </div>
        <div style="display:grid;justify-items:center;gap:6px;">
          <div style="font-size:11px;color:#5b6f88;">${guvenliFaturaNo}</div>
          <img src="${logoUrl}" onerror="this.onerror=null;this.src='${yedekLogoUrl}'" alt="MTÜ" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #d2e2f8;background:#fff;" />
        </div>
        <div style="max-width:240px;text-align:left;">
          <div style="font-size:18px;font-weight:800;color:#1f61b8;margin-bottom:8px;">${guvenliFaturaTuru}</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Fatura No: ${guvenliFaturaNo}</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Tarih: ${guvenliTarih}</div>
          <div style="font-size:11px;line-height:1.45;color:#45617c;">Ödeme Tarihi: ${guvenliOdemeTarihi}</div>
        </div>
      </div>

      <div style="margin-top:14px;border:1px solid #d9e8f9;border-radius:14px;padding:14px 16px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div>
          <div style="font-size:13px;font-weight:700;color:#244668;margin-bottom:10px;">${fatura.tur === 'Satış Faturası' ? 'Müşteri Bilgileri' : 'Tedarikçi Bilgileri'}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">${guvenliKarsiTarafAdi}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">${guvenliTelefon}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">${guvenliAdres}</div>
          <div style="font-size:11px;line-height:1.7;color:#2f4866;">Vergi No: ${guvenliVergiNo}</div>
        </div>
        <div>
          <div style="font-size:13px;font-weight:700;color:#244668;margin-bottom:10px;">Fatura Özeti</div>
          <div style="font-size:11px;line-height:1.9;color:#2f4866;">Durum: ${guvenliDurum}</div>
          <div style="font-size:11px;line-height:1.9;color:#2f4866;">Satır Sayısı: ${fatura.satirlar.length}</div>
          <div style="font-size:11px;line-height:1.9;color:#2f4866;">Toplam Kalem: ${fatura.satirlar.reduce((toplam, satir) => toplam + Number(satir.miktar), 0)}</div>
        </div>
      </div>

      <div style="margin-top:14px;border:1px solid #d9e8f9;border-radius:14px;padding:14px 16px;">
        <div style="font-size:13px;font-weight:700;color:#244668;margin-bottom:10px;">Ürünler</div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">No</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Hizmet / Ürün</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Miktar</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Birim Fiyat</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">KDV Oranı</th>
              <th style="padding:8px 6px;border-bottom:1px solid #dfeaf8;text-align:left;color:#516b86;">Toplam</th>
            </tr>
          </thead>
          <tbody>${satirlarHtml}</tbody>
        </table>

        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-top:18px;">
          <div style="font-size:11px;color:#6f8298;line-height:1.5;max-width:360px;">${guvenliNot}</div>
          <div style="min-width:220px;display:grid;gap:8px;">
            <div style="display:flex;justify-content:space-between;color:#45617d;font-size:11px;"><span>Ara Toplam</span><strong style="color:#17314d;">${paraFormatla(fatura.araToplam)}</strong></div>
            <div style="display:flex;justify-content:space-between;color:#45617d;font-size:11px;"><span>KDV</span><strong style="color:#17314d;">${paraFormatla(fatura.kdv)}</strong></div>
            <div style="display:flex;justify-content:space-between;color:#1f61b8;font-size:14px;font-weight:800;border-top:1px solid #dce7f5;padding-top:8px;"><span>Toplam</span><strong>${paraFormatla(fatura.toplam)}</strong></div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;margin-top:14px;">
          <img src="${gibLogoUrl}" onerror="this.onerror=null;this.src='${yedekGibLogoUrl}'" alt="GİB" style="width:86px;height:86px;object-fit:contain;" />
        </div>
      </div>
    </div>
  `
}

export const faturaBelgeTamHtmlOlustur = (fatura, karsiTaraf) => `
  <html lang="tr">
    <head>
      <meta charset="utf-8" />
      <title>${htmlGuvenliMetin(fatura.faturaNo)}</title>
      <style>
        html, body { margin: 0; padding: 0; background: #ffffff; }
        body { font-family: Arial, sans-serif; color: #17314d; }
        .yazdir-sayfa { width: 794px; margin: 0 auto; padding: 28px 0; box-sizing: border-box; }
        img { max-width: 100%; }
        @page { size: A4; margin: 10mm; }
        @media print {
          body { background: #ffffff; }
          .yazdir-sayfa { margin: 0 auto; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="yazdir-sayfa">${faturaBelgeHtmlOlustur(fatura, karsiTaraf)}</div>
    </body>
  </html>
`

export let pdfKutuphaneleriPromise = null

export const pdfKutuphaneleriniYukle = async () => {
  if (!pdfKutuphaneleriPromise) {
    pdfKutuphaneleriPromise = Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]).then(([html2canvasModulu, jsPdfModulu]) => ({
      html2canvas: html2canvasModulu.default,
      jsPDF: jsPdfModulu.default,
    }))
  }

  return pdfKutuphaneleriPromise
}



