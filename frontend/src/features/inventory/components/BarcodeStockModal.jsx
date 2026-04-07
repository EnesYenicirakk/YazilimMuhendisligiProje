import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatOneDReader } from '@zxing/browser'
import Quagga from '@ericblade/quagga2'
import { BarcodeFormat, ChecksumException, DecodeHintType, FormatException, NotFoundException } from '@zxing/library'
import { createWorker, PSM } from 'tesseract.js'
import { useToast } from '../../../core/contexts/ToastContext'

const TARAMA_ARALIGI_MS = 240
const QUAGGA_DENEME_ARALIGI_MS = 900
const OCR_DENEME_ARALIGI_MS = 2200
const KARE_ANALIZ_DENEME_ARALIGI_MS = 1200
const AYNI_KOD_BEKLEME_MS = 1400
const KARE_YAKALA_DONUS_ACILARI = [-10, -6, 6, 10]
const DESTEKLENEN_FORMATLAR = [
  'code_128',
  'ean_13',
  'ean_8',
  'itf',
  'upc_a',
  'upc_e',
]
const barkodMetniniTemizle = (deger) => String(deger ?? '').replace(/\s+/g, '').trim()
const sayisalBarkodMetniniTemizle = (deger) => String(deger ?? '').replace(/[^\d]/g, '')
const OCR_MIN_UZUNLUK = 7
const barkodAdayiniHazirla = (deger) => {
  const temizDeger = barkodMetniniTemizle(deger)
  if (!temizDeger) return ''

  const sayisalDeger = sayisalBarkodMetniniTemizle(temizDeger)
  if (
    sayisalDeger.length >= OCR_MIN_UZUNLUK &&
    sayisalDeger.length <= BARKOD_MAX_UZUNLUK
  ) {
    return sayisalDeger
  }

  return ''
}
const ZXING_FORMATLARI = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
]
const BEKLENEN_ZXING_HATA_ADLARI = new Set(['NotFoundException', 'ChecksumException', 'FormatException'])
const BARKOD_MIN_UZUNLUK = 8
const BARKOD_MAX_UZUNLUK = 14
const TARAMA_BANTLARI = [
  { merkez: 0.68, yukseklikOrani: 0.42 },
  { merkez: 0.54, yukseklikOrani: 0.36 },
  { merkez: 0.4, yukseklikOrani: 0.32 },
]
const OCR_BANTLARI = [
  {
    baslangicOrani: 0.56,
    yukseklikOrani: 0.24,
    yatayBaslangicOrani: 0.14,
    yatayBitisOrani: 0.86,
    olcekX: 6.2,
    olcekY: 8.2,
    filter: 'grayscale(1) contrast(300%) brightness(142%)',
    esikCarpani: 0.9,
    esikAlt: 84,
  },
  {
    baslangicOrani: 0.6,
    yukseklikOrani: 0.19,
    yatayBaslangicOrani: 0.1,
    yatayBitisOrani: 0.9,
    olcekX: 6.9,
    olcekY: 9.2,
    filter: 'grayscale(1) contrast(360%) brightness(148%)',
    esikCarpani: 0.89,
    esikAlt: 80,
  },
  {
    baslangicOrani: 0.64,
    yukseklikOrani: 0.16,
    yatayBaslangicOrani: 0.08,
    yatayBitisOrani: 0.92,
    olcekX: 7.2,
    olcekY: 9.6,
    filter: 'grayscale(1) contrast(410%) brightness(154%)',
    esikCarpani: 0.87,
    esikAlt: 76,
  },
  {
    baslangicOrani: 0.52,
    yukseklikOrani: 0.28,
    yatayBaslangicOrani: 0.18,
    yatayBitisOrani: 0.82,
    olcekX: 5.8,
    olcekY: 7.8,
    filter: 'grayscale(1) contrast(280%) brightness(136%)',
    esikCarpani: 0.92,
    esikAlt: 90,
  },
]
const KARE_YAKALA_TARAMA_BOLGELERI = [
  {
    baslangicOrani: 0.08,
    yukseklikOrani: 0.84,
    yatayBaslangicOrani: 0.02,
    yatayBitisOrani: 0.98,
    olcekX: 1.5,
    olcekY: 1.5,
    filter: 'grayscale(1) contrast(190%) brightness(110%)',
  },
  {
    baslangicOrani: 0.18,
    yukseklikOrani: 0.58,
    yatayBaslangicOrani: 0.04,
    yatayBitisOrani: 0.96,
    olcekX: 2.1,
    olcekY: 2.1,
    filter: 'grayscale(1) contrast(260%) brightness(124%)',
  },
  {
    baslangicOrani: 0.26,
    yukseklikOrani: 0.46,
    yatayBaslangicOrani: 0.06,
    yatayBitisOrani: 0.94,
    olcekX: 2.35,
    olcekY: 2.35,
    filter: 'grayscale(1) contrast(320%) brightness(136%)',
    esikleme: true,
    esikCarpani: 0.92,
    esikAlt: 88,
  },
  {
    baslangicOrani: 0.24,
    yukseklikOrani: 0.5,
    yatayBaslangicOrani: 0.12,
    yatayBitisOrani: 0.9,
    olcekX: 2.8,
    olcekY: 2.6,
    filter: 'grayscale(1) contrast(360%) brightness(142%)',
    esikleme: true,
    esikCarpani: 0.9,
    esikAlt: 82,
  },
]
const KARE_YAKALA_OCR_BANTLARI = [
  {
    baslangicOrani: 0.56,
    yukseklikOrani: 0.24,
    yatayBaslangicOrani: 0.12,
    yatayBitisOrani: 0.88,
    olcekX: 6.4,
    olcekY: 8.4,
    filter: 'grayscale(1) contrast(320%) brightness(144%)',
    esikCarpani: 0.9,
    esikAlt: 84,
  },
  {
    baslangicOrani: 0.6,
    yukseklikOrani: 0.18,
    yatayBaslangicOrani: 0.09,
    yatayBitisOrani: 0.91,
    olcekX: 7,
    olcekY: 9.4,
    filter: 'grayscale(1) contrast(390%) brightness(150%)',
    esikCarpani: 0.89,
    esikAlt: 80,
  },
  {
    baslangicOrani: 0.64,
    yukseklikOrani: 0.16,
    yatayBaslangicOrani: 0.06,
    yatayBitisOrani: 0.94,
    olcekX: 7.4,
    olcekY: 9.8,
    filter: 'grayscale(1) contrast(430%) brightness(156%)',
    esikCarpani: 0.87,
    esikAlt: 76,
  },
  {
    baslangicOrani: 0.52,
    yukseklikOrani: 0.28,
    yatayBaslangicOrani: 0.16,
    yatayBitisOrani: 0.84,
    olcekX: 5.8,
    olcekY: 8,
    filter: 'grayscale(1) contrast(290%) brightness(136%)',
    esikCarpani: 0.92,
    esikAlt: 90,
  },
]
const GTIN_UZUNLUK_ONCELIGI = [13, 12, 14, 11, 10, 9, 8, 7]

const zxingHatasiBeklenenTurMu = (error) =>
  error instanceof NotFoundException ||
  error instanceof ChecksumException ||
  error instanceof FormatException ||
  BEKLENEN_ZXING_HATA_ADLARI.has(error?.name)

const hedefKaynakKutusuHesapla = (video, hedefAlani) => {
  if (!video || !hedefAlani || !video.videoWidth || !video.videoHeight) return null

  const videoAlani = video.getBoundingClientRect()
  const hedefKutusu = hedefAlani.getBoundingClientRect()
  const olcek = Math.max(videoAlani.width / video.videoWidth, videoAlani.height / video.videoHeight)

  if (!Number.isFinite(olcek) || olcek <= 0) return null

  const gorunenGenislik = video.videoWidth * olcek
  const gorunenYukseklik = video.videoHeight * olcek
  const yatayKirma = Math.max(0, (gorunenGenislik - videoAlani.width) / 2)
  const dikeyKirma = Math.max(0, (gorunenYukseklik - videoAlani.height) / 2)
  const hedefX = hedefKutusu.left - videoAlani.left
  const hedefY = hedefKutusu.top - videoAlani.top
  const kaynakX = Math.max(0, Math.round((hedefX + yatayKirma) / olcek))
  const kaynakY = Math.max(0, Math.round((hedefY + dikeyKirma) / olcek))
  const kaynakGenislik = Math.min(video.videoWidth - kaynakX, Math.round(hedefKutusu.width / olcek))
  const kaynakYukseklik = Math.min(video.videoHeight - kaynakY, Math.round(hedefKutusu.height / olcek))

  if (kaynakGenislik <= 0 || kaynakYukseklik <= 0) return null

  return {
    x: kaynakX,
    y: kaynakY,
    width: kaynakGenislik,
    height: kaynakYukseklik,
  }
}

const tuvaliDondur = (kaynakTuval, hedefTuval) => {
  if (!kaynakTuval || !hedefTuval) return null

  hedefTuval.width = kaynakTuval.height
  hedefTuval.height = kaynakTuval.width

  const baglam = hedefTuval.getContext('2d', { willReadFrequently: true })
  if (!baglam) return null

  baglam.setTransform(1, 0, 0, 1, 0, 0)
  baglam.clearRect(0, 0, hedefTuval.width, hedefTuval.height)
  baglam.translate(hedefTuval.width, 0)
  baglam.rotate(Math.PI / 2)
  baglam.drawImage(kaynakTuval, 0, 0)
  baglam.setTransform(1, 0, 0, 1, 0, 0)

  return hedefTuval
}

const tuvaliAciylaDondur = (kaynakTuval, hedefTuval, aci) => {
  if (!kaynakTuval || !hedefTuval || !Number.isFinite(aci) || aci === 0) return null

  const radyan = (aci * Math.PI) / 180
  const kosinus = Math.abs(Math.cos(radyan))
  const sinus = Math.abs(Math.sin(radyan))
  const yeniGenislik = Math.max(1, Math.ceil(kaynakTuval.width * kosinus + kaynakTuval.height * sinus))
  const yeniYukseklik = Math.max(1, Math.ceil(kaynakTuval.width * sinus + kaynakTuval.height * kosinus))

  hedefTuval.width = yeniGenislik
  hedefTuval.height = yeniYukseklik

  const baglam = hedefTuval.getContext('2d', { willReadFrequently: true })
  if (!baglam) return null

  baglam.setTransform(1, 0, 0, 1, 0, 0)
  baglam.clearRect(0, 0, yeniGenislik, yeniYukseklik)
  baglam.translate(yeniGenislik / 2, yeniYukseklik / 2)
  baglam.rotate(radyan)
  baglam.drawImage(kaynakTuval, -kaynakTuval.width / 2, -kaynakTuval.height / 2)
  baglam.setTransform(1, 0, 0, 1, 0, 0)

  return hedefTuval
}

const tuvaliKopyala = (kaynakTuval, hedefTuval = document.createElement('canvas')) => {
  if (!kaynakTuval || !hedefTuval) return null

  hedefTuval.width = kaynakTuval.width
  hedefTuval.height = kaynakTuval.height

  const baglam = hedefTuval.getContext('2d', { willReadFrequently: true })
  if (!baglam) return null

  baglam.setTransform(1, 0, 0, 1, 0, 0)
  baglam.clearRect(0, 0, hedefTuval.width, hedefTuval.height)
  baglam.drawImage(kaynakTuval, 0, 0)
  return hedefTuval
}

const ocrBenzeriKarakterleriRakamaCevir = (metin) =>
  String(metin ?? '')
    .toUpperCase()
    .replace(/[OQD]/g, '0')
    .replace(/[IL|]/g, '1')
    .replace(/Z/g, '2')
    .replace(/S/g, '5')
    .replace(/G/g, '6')
    .replace(/B/g, '8')

const gtinKontrolBasamagiHesapla = (govde) =>
  String(govde ?? '')
    .split('')
    .reverse()
    .reduce((toplam, rakam, index) => toplam + Number(rakam) * (index % 2 === 0 ? 3 : 1), 0)

const gtinGecerliMi = (kod) => {
  const temizKod = sayisalBarkodMetniniTemizle(kod)
  if (temizKod.length < BARKOD_MIN_UZUNLUK || temizKod.length > BARKOD_MAX_UZUNLUK) return false
  const govde = temizKod.slice(0, -1)
  const kontrol = Number(temizKod.slice(-1))
  if (!govde || Number.isNaN(kontrol)) return false
  return ((10 - (gtinKontrolBasamagiHesapla(govde) % 10)) % 10) === kontrol
}

const ocrAdayPuaniniHesapla = (aday) => {
  let puan = 0
  const uzunlukOnceligi = GTIN_UZUNLUK_ONCELIGI.indexOf(aday.length)

  if (gtinGecerliMi(aday)) {
    puan += 100
  }

  puan += uzunlukOnceligi === -1 ? 0 : (GTIN_UZUNLUK_ONCELIGI.length - uzunlukOnceligi) * 10
  puan += aday.length
  return puan
}

const ocrMetnindenBarkodAdaylariniTopla = (metin) => {
  const normalizeMetin = ocrBenzeriKarakterleriRakamaCevir(metin)
  const ocrAdayDeseni = new RegExp(`[0-9OQDILSZBG|\\s-]{${OCR_MIN_UZUNLUK},32}`, 'g')
  const adaylar = new Set()
  const adayiEkle = (hamAday) => {
    const temizAday = sayisalBarkodMetniniTemizle(hamAday)
    if (temizAday.length >= OCR_MIN_UZUNLUK && temizAday.length <= BARKOD_MAX_UZUNLUK) {
      adaylar.add(temizAday)
    }
  }

  normalizeMetin.split(/\r?\n/).forEach(adayiEkle)
  ;(normalizeMetin.match(ocrAdayDeseni) ?? []).forEach(adayiEkle)

  const birlesikRakamlar = sayisalBarkodMetniniTemizle(normalizeMetin)
  if (birlesikRakamlar.length >= OCR_MIN_UZUNLUK) {
    if (birlesikRakamlar.length <= BARKOD_MAX_UZUNLUK) {
      adaylar.add(birlesikRakamlar)
    } else {
      GTIN_UZUNLUK_ONCELIGI.filter((uzunluk) => uzunluk >= OCR_MIN_UZUNLUK).forEach((uzunluk) => {
        for (let index = 0; index <= birlesikRakamlar.length - uzunluk; index += 1) {
          adaylar.add(birlesikRakamlar.slice(index, index + uzunluk))
        }
      })
    }
  }

  return [...adaylar]
}

const ocrMetnindenBarkodBul = (metin) => {
  const adaylar = ocrMetnindenBarkodAdaylariniTopla(metin)
  const sayisalAday = adaylar
    .sort((ilk, ikinci) => ocrAdayPuaniniHesapla(ikinci) - ocrAdayPuaniniHesapla(ilk))
    [0] ?? ''

  return sayisalAday
}

const EAN_L_KODLARI = {
  '0001101': '0',
  '0011001': '1',
  '0010011': '2',
  '0111101': '3',
  '0100011': '4',
  '0110001': '5',
  '0101111': '6',
  '0111011': '7',
  '0110111': '8',
  '0001011': '9',
}

const EAN_G_KODLARI = {
  '0100111': '0',
  '0110011': '1',
  '0011011': '2',
  '0100001': '3',
  '0011101': '4',
  '0111001': '5',
  '0000101': '6',
  '0010001': '7',
  '0001001': '8',
  '0010111': '9',
}

const EAN_R_KODLARI = {
  '1110010': '0',
  '1100110': '1',
  '1101100': '2',
  '1000010': '3',
  '1011100': '4',
  '1001110': '5',
  '1010000': '6',
  '1000100': '7',
  '1001000': '8',
  '1110100': '9',
}

const EAN13_PARITE_ILK_HANE = {
  LLLLLL: '0',
  LLGLGG: '1',
  LLGGLG: '2',
  LLGGGL: '3',
  LGLLGG: '4',
  LGGLLG: '5',
  LGGGLL: '6',
  LGLGLG: '7',
  LGLGGL: '8',
  LGGLGL: '9',
}

const barkodSatiriParlakliklariniAl = (tuval, oranY) => {
  if (!tuval) return []

  const baglam = tuval.getContext('2d', { willReadFrequently: true })
  if (!baglam) return []

  const merkezY = Math.max(0, Math.min(tuval.height - 1, Math.round(tuval.height * oranY)))
  const ustY = Math.max(0, merkezY - 1)
  const altY = Math.min(tuval.height - 1, merkezY + 1)
  const yukseklik = altY - ustY + 1
  const gorselVeri = baglam.getImageData(0, ustY, tuval.width, yukseklik)
  const parlakliklar = new Array(tuval.width).fill(0)

  for (let x = 0; x < tuval.width; x += 1) {
    let toplam = 0

    for (let y = 0; y < yukseklik; y += 1) {
      const indeks = (y * tuval.width + x) * 4
      toplam += (gorselVeri.data[indeks] + gorselVeri.data[indeks + 1] + gorselVeri.data[indeks + 2]) / 3
    }

    parlakliklar[x] = toplam / yukseklik
  }

  return parlakliklar
}

const barkodSatiriniIkililestir = (parlakliklar, esikKaydirma = 0) => {
  if (!parlakliklar.length) return []

  const minParlaklik = Math.min(...parlakliklar)
  const maxParlaklik = Math.max(...parlakliklar)
  const aralik = maxParlaklik - minParlaklik
  if (aralik < 35) return []

  const temelEsik = minParlaklik + aralik * (0.5 + esikKaydirma)
  return parlakliklar.map((deger) => (deger < temelEsik ? 1 : 0))
}

const barkodBitleriniOrnekle = (ikiliSatir, baslangic, bitis, modulSayisi) => {
  const toplamGenislik = bitis - baslangic
  if (!ikiliSatir.length || toplamGenislik <= modulSayisi) return ''

  let bitler = ''

  for (let modul = 0; modul < modulSayisi; modul += 1) {
    const modulBaslangici = baslangic + (modul * toplamGenislik) / modulSayisi
    const modulBitisi = baslangic + ((modul + 1) * toplamGenislik) / modulSayisi
    const pikselBaslangici = Math.max(0, Math.floor(modulBaslangici))
    const pikselBitisi = Math.min(ikiliSatir.length, Math.ceil(modulBitisi))

    let siyahSayisi = 0
    let toplamPiksel = 0

    for (let piksel = pikselBaslangici; piksel < pikselBitisi; piksel += 1) {
      siyahSayisi += ikiliSatir[piksel]
      toplamPiksel += 1
    }

    if (toplamPiksel === 0) return ''
    bitler += siyahSayisi >= toplamPiksel / 2 ? '1' : '0'
  }

  return bitler
}

const ean13BitleriniCoz = (bitler) => {
  if (bitler.length !== 95) return ''
  if (!bitler.startsWith('101') || bitler.slice(45, 50) !== '01010' || !bitler.endsWith('101')) return ''

  let solSayilar = ''
  let parite = ''

  for (let index = 0; index < 6; index += 1) {
    const desen = bitler.slice(3 + index * 7, 10 + index * 7)
    if (EAN_L_KODLARI[desen] != null) {
      solSayilar += EAN_L_KODLARI[desen]
      parite += 'L'
    } else if (EAN_G_KODLARI[desen] != null) {
      solSayilar += EAN_G_KODLARI[desen]
      parite += 'G'
    } else {
      return ''
    }
  }

  const ilkHane = EAN13_PARITE_ILK_HANE[parite]
  if (ilkHane == null) return ''

  let sagSayilar = ''

  for (let index = 0; index < 6; index += 1) {
    const desen = bitler.slice(50 + index * 7, 57 + index * 7)
    if (EAN_R_KODLARI[desen] == null) {
      return ''
    }
    sagSayilar += EAN_R_KODLARI[desen]
  }

  const kod = `${ilkHane}${solSayilar}${sagSayilar}`
  return gtinGecerliMi(kod) ? kod : ''
}

const ean8BitleriniCoz = (bitler) => {
  if (bitler.length !== 67) return ''
  if (!bitler.startsWith('101') || bitler.slice(31, 36) !== '01010' || !bitler.endsWith('101')) return ''

  let solSayilar = ''
  let sagSayilar = ''

  for (let index = 0; index < 4; index += 1) {
    const solDesen = bitler.slice(3 + index * 7, 10 + index * 7)
    const sagDesen = bitler.slice(36 + index * 7, 43 + index * 7)

    if (EAN_L_KODLARI[solDesen] == null || EAN_R_KODLARI[sagDesen] == null) {
      return ''
    }

    solSayilar += EAN_L_KODLARI[solDesen]
    sagSayilar += EAN_R_KODLARI[sagDesen]
  }

  const kod = `${solSayilar}${sagSayilar}`
  return gtinGecerliMi(kod) ? kod : ''
}

const ozelSatirdanBarkodCoz = (ikiliSatir) => {
  if (!ikiliSatir.length) return ''

  const ilkSiyah = ikiliSatir.findIndex((deger) => deger === 1)
  const sonSiyah = ikiliSatir.length - 1 - [...ikiliSatir].reverse().findIndex((deger) => deger === 1)

  if (ilkSiyah < 0 || sonSiyah <= ilkSiyah) return ''

  for (const modulSayisi of [95, 67]) {
    for (let baslangicKaydirma = -4; baslangicKaydirma <= 4; baslangicKaydirma += 1) {
      for (let bitisKaydirma = -4; bitisKaydirma <= 4; bitisKaydirma += 1) {
        const baslangic = Math.max(0, ilkSiyah + baslangicKaydirma)
        const bitis = Math.min(ikiliSatir.length, sonSiyah + bitisKaydirma + 1)
        const bitler = barkodBitleriniOrnekle(ikiliSatir, baslangic, bitis, modulSayisi)

        if (!bitler) continue

        const cozulenKod = modulSayisi === 95 ? ean13BitleriniCoz(bitler) : ean8BitleriniCoz(bitler)
        if (cozulenKod) {
          return cozulenKod
        }
      }
    }
  }

  return ''
}

const ozelCozucuIcinTuvaliTara = (tuval) => {
  if (!tuval || tuval.width < 120 || tuval.height < 40) return ''

  const satirlar = [0.16, 0.24, 0.32, 0.4, 0.48, 0.56]
  const esikKaydirmalari = [-0.08, -0.03, 0, 0.03, 0.08]

  for (const oranY of satirlar) {
    const parlakliklar = barkodSatiriParlakliklariniAl(tuval, oranY)
    if (parlakliklar.length === 0) continue

    for (const esikKaydirma of esikKaydirmalari) {
      const ikiliSatir = barkodSatiriniIkililestir(parlakliklar, esikKaydirma)
      const cozulenKod = ozelSatirdanBarkodCoz(ikiliSatir)
      if (cozulenKod) {
        return cozulenKod
      }
    }
  }

  return ''
}

const kaynakBolgesindenTuvalOlustur = (kaynakTuval, hedefTuval, secenekler = {}) => {
  if (!kaynakTuval || !hedefTuval) return null

  const baslangicOrani = secenekler.baslangicOrani ?? 0
  const yukseklikOrani = secenekler.yukseklikOrani ?? 1
  const yatayBaslangicOrani = secenekler.yatayBaslangicOrani ?? 0
  const yatayBitisOrani = secenekler.yatayBitisOrani ?? 1
  const esikleme = secenekler.esikleme ?? false
  const minGenislik = secenekler.minGenislik ?? 24
  const minYukseklik = secenekler.minYukseklik ?? 24
  const olcekX = secenekler.olcekX ?? 1
  const olcekY = secenekler.olcekY ?? olcekX
  const filtre = secenekler.filter ?? 'none'
  const esikCarpani = secenekler.esikCarpani ?? 0.96
  const esikAlt = secenekler.esikAlt ?? 105
  const esikUst = secenekler.esikUst ?? 225
  const kaynakX = Math.max(0, Math.round(kaynakTuval.width * yatayBaslangicOrani))
  const kaynakY = Math.max(0, Math.round(kaynakTuval.height * baslangicOrani))
  const kaynakGenislik = Math.max(minGenislik, Math.round(kaynakTuval.width * (yatayBitisOrani - yatayBaslangicOrani)))
  const kaynakYukseklik = Math.max(minYukseklik, Math.round(kaynakTuval.height * yukseklikOrani))
  const duzeltilmisKaynakGenislik = Math.min(kaynakTuval.width - kaynakX, kaynakGenislik)
  const duzeltilmisKaynakYukseklik = Math.min(kaynakTuval.height - kaynakY, kaynakYukseklik)

  if (duzeltilmisKaynakGenislik <= 0 || duzeltilmisKaynakYukseklik <= 0) return null

  hedefTuval.width = Math.max(1, Math.round(duzeltilmisKaynakGenislik * olcekX))
  hedefTuval.height = Math.max(1, Math.round(duzeltilmisKaynakYukseklik * olcekY))

  const baglam = hedefTuval.getContext('2d', { willReadFrequently: true })
  if (!baglam) return null

  baglam.setTransform(1, 0, 0, 1, 0, 0)
  baglam.clearRect(0, 0, hedefTuval.width, hedefTuval.height)
  baglam.imageSmoothingEnabled = secenekler.imageSmoothingEnabled ?? false
  baglam.filter = filtre
  baglam.drawImage(
    kaynakTuval,
    kaynakX,
    kaynakY,
    duzeltilmisKaynakGenislik,
    duzeltilmisKaynakYukseklik,
    0,
    0,
    hedefTuval.width,
    hedefTuval.height,
  )
  baglam.filter = 'none'

  if (esikleme) {
    const gorselVeri = baglam.getImageData(0, 0, hedefTuval.width, hedefTuval.height)
    const { data } = gorselVeri
    let toplamParlaklik = 0

    for (let index = 0; index < data.length; index += 4) {
      toplamParlaklik += (data[index] + data[index + 1] + data[index + 2]) / 3
    }

    const pikselSayisi = Math.max(1, data.length / 4)
    const ortalamaParlaklik = toplamParlaklik / pikselSayisi
    const esik = Math.min(esikUst, Math.max(esikAlt, ortalamaParlaklik * esikCarpani))

    for (let index = 0; index < data.length; index += 4) {
      const parlaklik = (data[index] + data[index + 1] + data[index + 2]) / 3
      const renk = parlaklik > esik ? 255 : 0
      data[index] = renk
      data[index + 1] = renk
      data[index + 2] = renk
      data[index + 3] = 255
    }

    baglam.putImageData(gorselVeri, 0, 0)
  }

  return hedefTuval
}

const ocrIcinTuvaliHazirla = (kaynakTuval, hedefTuval, secenekler = {}) => {
  return kaynakBolgesindenTuvalOlustur(kaynakTuval, hedefTuval, {
    baslangicOrani: 0.58,
    yukseklikOrani: 0.22,
    minYukseklik: 24,
    olcekX: 3,
    olcekY: 4,
    imageSmoothingEnabled: false,
    filter: 'grayscale(1) contrast(240%) brightness(132%)',
    ...secenekler,
  })
}

export default function BarcodeStockModal({ inventoryData }) {
  const {
    barkodModalAcik,
    barkodIslemTuru,
    barkodMetni,
    barkodMiktari,
    barkodSepeti,
    barkodEslesmeleri,
    barkodSeciliUrun,
    barkodToplamKalem,
    barkodToplamAdet,
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
  } = inventoryData

  const { toastGoster } = useToast()
  const [kameraAcik, setKameraAcik] = useState(false)
  const [kameraYukleniyor, setKameraYukleniyor] = useState(false)
  const [kameraHatasi, setKameraHatasi] = useState('')
  const [kareIsleniyor, setKareIsleniyor] = useState(false)
  const [ocrHazirlaniyor, setOcrHazirlaniyor] = useState(false)
  const [taramaParlamasi, setTaramaParlamasi] = useState(false)
  const [taramaKaynakBilgisi, setTaramaKaynakBilgisi] = useState('')
  const [taramaHamMetni, setTaramaHamMetni] = useState('')
  const [taramaSecilenBarkod, setTaramaSecilenBarkod] = useState('')
  const [yakalananKareOnizleme, setYakalananKareOnizleme] = useState('')
  const [aktifDokunsalDugme, setAktifDokunsalDugme] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const intervalRef = useRef(null)
  const sonOkunanRef = useRef({ deger: '', zaman: 0 })
  const parlamaZamanlayiciRef = useRef(null)
  const sesBaglamiRef = useRef(null)
  const dokunsalDugmeZamanlayiciRef = useRef(null)
  const otomatikBaslatildiRef = useRef(false)
  const hedefRef = useRef(null)
  const taramaCanvasRef = useRef(null)
  const taramaBantCanvaslariRef = useRef([])
  const taramaDondurmeCanvaslariRef = useRef([])
  const taramaCalisiyorRef = useRef(false)
  const zxingReaderRef = useRef(null)
  const ocrWorkerRef = useRef(null)
  const ocrHazirlaniyorRef = useRef(null)
  const ocrCalisiyorRef = useRef(false)
  const sonOcrDenemeRef = useRef(0)
  const ocrCanvaslariRef = useRef([])
  const ocrKullanilamiyorRef = useRef(false)
  const quaggaCalisiyorRef = useRef(false)
  const sonQuaggaDenemeRef = useRef(0)
  const sonKareAnalizDenemeRef = useRef(0)
  const sonTaramaDurumuRef = useRef({ kaynak: '', hamMetin: '', secilenBarkod: '' })

  const taramaBilgisiniGuncelle = useCallback((kaynak, hamMetin = '', secilenBarkod = '') => {
    const yeniDurum = {
      kaynak,
      hamMetin: String(hamMetin ?? '').slice(0, 48),
      secilenBarkod: secilenBarkod ? String(secilenBarkod).slice(0, 24) : '',
    }
    const oncekiDurum = sonTaramaDurumuRef.current

    if (
      oncekiDurum.kaynak === yeniDurum.kaynak &&
      oncekiDurum.hamMetin === yeniDurum.hamMetin &&
      oncekiDurum.secilenBarkod === yeniDurum.secilenBarkod
    ) {
      return
    }

    sonTaramaDurumuRef.current = yeniDurum
    setTaramaKaynakBilgisi(yeniDurum.kaynak)
    setTaramaHamMetni(yeniDurum.hamMetin)
    setTaramaSecilenBarkod(yeniDurum.secilenBarkod)
  }, [])

  const barkodDestekleniyor = typeof window !== 'undefined' && 'BarcodeDetector' in window
  const satisModu = barkodIslemTuru === 'satis'
  const miktar = Number(barkodMiktari || 0)
  const seciliUrunSonrakiStok = barkodSeciliUrun
    ? satisModu
      ? Math.max(0, barkodSeciliUrun.magazaStok - miktar)
      : barkodSeciliUrun.magazaStok + miktar
    : null

  const bipCal = useCallback(() => {
    if (typeof window === 'undefined') return

    const SesBaglami = window.AudioContext || window.webkitAudioContext
    if (!SesBaglami) return

    if (!sesBaglamiRef.current) {
      sesBaglamiRef.current = new SesBaglami()
    }

    const baglam = sesBaglamiRef.current
    const baslangic = baglam.currentTime

    if (baglam.state === 'suspended') {
      baglam.resume().catch(() => {})
    }

    const anaKazanc = baglam.createGain()
    anaKazanc.connect(baglam.destination)
    anaKazanc.gain.setValueAtTime(0.0001, baslangic)
    anaKazanc.gain.exponentialRampToValueAtTime(0.08, baslangic + 0.015)
    anaKazanc.gain.exponentialRampToValueAtTime(0.0001, baslangic + 0.14)

    const tokSes = baglam.createOscillator()
    tokSes.type = 'square'
    tokSes.frequency.setValueAtTime(910, baslangic)
    tokSes.frequency.exponentialRampToValueAtTime(680, baslangic + 0.12)

    const altTon = baglam.createOscillator()
    altTon.type = 'triangle'
    altTon.frequency.setValueAtTime(455, baslangic)
    altTon.frequency.exponentialRampToValueAtTime(340, baslangic + 0.12)

    tokSes.connect(anaKazanc)
    altTon.connect(anaKazanc)
    tokSes.start(baslangic)
    altTon.start(baslangic)
    tokSes.stop(baslangic + 0.14)
    altTon.stop(baslangic + 0.14)
  }, [])

  const tikCal = useCallback((frekans = 1280) => {
    if (typeof window === 'undefined') return

    const SesBaglami = window.AudioContext || window.webkitAudioContext
    if (!SesBaglami) return

    if (!sesBaglamiRef.current) {
      sesBaglamiRef.current = new SesBaglami()
    }

    const baglam = sesBaglamiRef.current
    const baslangic = baglam.currentTime

    if (baglam.state === 'suspended') {
      baglam.resume().catch(() => {})
    }

    const kazanc = baglam.createGain()
    kazanc.connect(baglam.destination)
    kazanc.gain.setValueAtTime(0.0001, baslangic)
    kazanc.gain.exponentialRampToValueAtTime(0.045, baslangic + 0.008)
    kazanc.gain.exponentialRampToValueAtTime(0.0001, baslangic + 0.07)

    const osilator = baglam.createOscillator()
    osilator.type = 'triangle'
    osilator.frequency.setValueAtTime(frekans, baslangic)
    osilator.frequency.exponentialRampToValueAtTime(Math.max(760, frekans - 260), baslangic + 0.05)
    osilator.connect(kazanc)
    osilator.start(baslangic)
    osilator.stop(baslangic + 0.07)
  }, [])

  const dokunsalGeriBildirimVer = useCallback(({ seviye = 'hafif', dugme = '' } = {}) => {
    const titreSim = seviye === 'basari'
      ? [36, 18, 54]
      : seviye === 'orta'
        ? [18, 10, 18]
        : [12]

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(titreSim)
    }

    if (seviye !== 'basari') {
      tikCal(seviye === 'orta' ? 1140 : 1280)
    }

    if (dokunsalDugmeZamanlayiciRef.current) {
      window.clearTimeout(dokunsalDugmeZamanlayiciRef.current)
    }

    if (dugme) {
      setAktifDokunsalDugme(dugme)
      dokunsalDugmeZamanlayiciRef.current = window.setTimeout(() => {
        setAktifDokunsalDugme('')
      }, 220)
    }
  }, [tikCal])

  const okutmaEfektiniCalistir = useCallback(() => {
    bipCal()
    dokunsalGeriBildirimVer({ seviye: 'basari' })

    if (parlamaZamanlayiciRef.current) {
      window.clearTimeout(parlamaZamanlayiciRef.current)
    }

    setTaramaParlamasi(true)
    parlamaZamanlayiciRef.current = window.setTimeout(() => {
      setTaramaParlamasi(false)
    }, 260)
  }, [bipCal, dokunsalGeriBildirimVer])

  const ocrWorkeriniHazirla = useCallback(async () => {
    if (ocrKullanilamiyorRef.current) return null
    if (ocrWorkerRef.current) return ocrWorkerRef.current
    if (ocrHazirlaniyorRef.current) return ocrHazirlaniyorRef.current

    setOcrHazirlaniyor(true)
    ocrHazirlaniyorRef.current = createWorker(
      'eng',
      undefined,
      {
        logger: () => {},
        errorHandler: () => {},
      },
      {
        load_system_dawg: '0',
        load_freq_dawg: '0',
        load_punc_dawg: '0',
        load_number_dawg: '1',
      },
    )
      .then(async (worker) => {
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.RAW_LINE,
          tessedit_char_whitelist: '0123456789',
          preserve_interword_spaces: '0',
          user_defined_dpi: '300',
        })
        ocrWorkerRef.current = worker
        return worker
      })
      .catch(() => {
        ocrKullanilamiyorRef.current = true
        taramaBilgisiniGuncelle('OCR', 'OCR başlatılamadı')
        return null
      })
      .finally(() => {
        setOcrHazirlaniyor(false)
        ocrHazirlaniyorRef.current = null
      })

    return ocrHazirlaniyorRef.current
  }, [taramaBilgisiniGuncelle])

  const kamerayiDurdur = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    taramaCalisiyorRef.current = false

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }

    setKameraAcik(false)
    setKameraYukleniyor(false)
    setKareIsleniyor(false)
  }, [])

  const taramaKaynaklariniHazirla = useCallback(() => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return []

    const hedefAlani = hedefRef.current
    const kaynakKutusu = hedefKaynakKutusuHesapla(video, hedefAlani)
    if (!kaynakKutusu) return []

    const olcek = Math.min(2.8, Math.max(1.45, 960 / Math.max(kaynakKutusu.width, 1)))
    const hedefGenislik = Math.max(1, Math.round(kaynakKutusu.width * olcek))
    const hedefYukseklik = Math.max(1, Math.round(kaynakKutusu.height * olcek))
    const tuval = taramaCanvasRef.current ?? document.createElement('canvas')
    taramaCanvasRef.current = tuval
    tuval.width = hedefGenislik
    tuval.height = hedefYukseklik

    const baglam = tuval.getContext('2d', { willReadFrequently: true })
    if (!baglam) return []

    baglam.imageSmoothingEnabled = false
    baglam.clearRect(0, 0, hedefGenislik, hedefYukseklik)
    baglam.drawImage(
      video,
      kaynakKutusu.x,
      kaynakKutusu.y,
      kaynakKutusu.width,
      kaynakKutusu.height,
      0,
      0,
      hedefGenislik,
      hedefYukseklik,
    )

    const kaynaklar = []

    TARAMA_BANTLARI.forEach((bant, index) => {
      const bantYukseklik = Math.max(36, Math.round(hedefYukseklik * bant.yukseklikOrani))
      const bantY = Math.max(
        0,
        Math.min(
          hedefYukseklik - bantYukseklik,
          Math.round(hedefYukseklik * bant.merkez - bantYukseklik / 2),
        ),
      )

      const bantTuvali = taramaBantCanvaslariRef.current[index] ?? document.createElement('canvas')
      taramaBantCanvaslariRef.current[index] = bantTuvali
      bantTuvali.width = hedefGenislik
      bantTuvali.height = bantYukseklik

      const bantBaglami = bantTuvali.getContext('2d', { willReadFrequently: true })
      if (!bantBaglami) return

      bantBaglami.imageSmoothingEnabled = false
      bantBaglami.clearRect(0, 0, bantTuvali.width, bantTuvali.height)
      bantBaglami.drawImage(
        tuval,
        0,
        bantY,
        hedefGenislik,
        bantYukseklik,
        0,
        0,
        bantTuvali.width,
        bantTuvali.height,
      )

      kaynaklar.push(bantTuvali)
    })

    kaynaklar.push(tuval)

    const donusmusKaynaklar = [...kaynaklar]

    kaynaklar.forEach((kaynak, index) => {
      const donmusTuval = taramaDondurmeCanvaslariRef.current[index] ?? document.createElement('canvas')
      taramaDondurmeCanvaslariRef.current[index] = donmusTuval
      const dondurulmusKaynak = tuvaliDondur(kaynak, donmusTuval)
      if (dondurulmusKaynak) {
        donusmusKaynaklar.push(dondurulmusKaynak)
      }
    })

    return donusmusKaynaklar
  }, [])

  const ocrKaynaklariniHazirla = useCallback(() => {
    const anaTuval = taramaCanvasRef.current
    if (!anaTuval) return []

    const kaynaklar = []

    OCR_BANTLARI.forEach((bant, index) => {
      const normalTuval = ocrCanvaslariRef.current[index * 2] ?? document.createElement('canvas')
      ocrCanvaslariRef.current[index * 2] = normalTuval
      const esikliTuval = ocrCanvaslariRef.current[index * 2 + 1] ?? document.createElement('canvas')
      ocrCanvaslariRef.current[index * 2 + 1] = esikliTuval

      const normalKaynak = ocrIcinTuvaliHazirla(anaTuval, normalTuval, bant)
      if (normalKaynak) {
        kaynaklar.push(normalKaynak)
      }

      const esikliKaynak = ocrIcinTuvaliHazirla(anaTuval, esikliTuval, { ...bant, esikleme: true })
      if (esikliKaynak) {
        kaynaklar.push(esikliKaynak)
      }
    })

    return kaynaklar
  }, [])

  const ozelCozucuIleBarkodOku = useCallback((kaynaklar, kaynakEtiketi = '') => {
    const uygunKaynaklar = [...(kaynaklar ?? [])]
      .filter((kaynak) => kaynak?.width && kaynak?.height && kaynak.width >= kaynak.height)
      .sort((ilk, ikinci) => (ikinci.width * ikinci.height) - (ilk.width * ilk.height))
      .slice(0, 4)

    for (const kaynak of uygunKaynaklar) {
      const bulunanKod = ozelCozucuIcinTuvaliTara(kaynak)
      if (bulunanKod) {
        taramaBilgisiniGuncelle(kaynakEtiketi ? `${kaynakEtiketi} / Özel Çözücü` : 'Özel Çözücü', bulunanKod, bulunanKod)
        return bulunanKod
      }
    }

    return ''
  }, [taramaBilgisiniGuncelle])

  const quaggaIleBarkodOku = useCallback(async (kaynaklar, kaynakEtiketi = '', zorla = false) => {
    if (quaggaCalisiyorRef.current) return ''

    const simdi = Date.now()
    if (!zorla && simdi - sonQuaggaDenemeRef.current < QUAGGA_DENEME_ARALIGI_MS) return ''

    const uygunKaynaklar = [...(kaynaklar ?? [])]
      .filter((kaynak) => kaynak?.width && kaynak?.height)
      .sort((ilk, ikinci) => (ikinci.width * ikinci.height) - (ilk.width * ilk.height))
      .slice(0, 3)

    if (uygunKaynaklar.length === 0) return ''

    sonQuaggaDenemeRef.current = simdi
    quaggaCalisiyorRef.current = true

    try {
      for (const kaynak of uygunKaynaklar) {
        const sonuc = await new Promise((resolve) => {
          Quagga.decodeSingle(
            {
              src: kaynak.toDataURL('image/png'),
              locate: true,
              locator: {
                halfSample: false,
                patchSize: 'large',
              },
              inputStream: {
                size: 0,
              },
              decoder: {
                readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader'],
              },
            },
            (result) => resolve(result?.codeResult?.code ?? ''),
          )
        })

        const bulunanKod = sayisalBarkodMetniniTemizle(sonuc)
        const gecerliKod = barkodAdayiniHazirla(sonuc)
        if (gecerliKod) {
          taramaBilgisiniGuncelle(kaynakEtiketi ? `${kaynakEtiketi} / Quagga` : 'Quagga', sonuc, gecerliKod)
          return gecerliKod
        }
      }
    } catch {
      // Quagga fallback sessiz kalsın.
    } finally {
      quaggaCalisiyorRef.current = false
    }

    return ''
  }, [taramaBilgisiniGuncelle])

  const kaynaklardanBarkodOku = useCallback(async (kaynaklar, kaynakEtiketi = '', zorla = false) => {
    if (kaynaklar.length === 0) return ''
    const video = videoRef.current

    if (zxingReaderRef.current) {
      for (const kaynak of kaynaklar) {
        try {
          const sonuc = zxingReaderRef.current.decodeFromCanvas(kaynak)
          const bulunanKod =
            (typeof sonuc?.getText === 'function' && sonuc.getText()) ||
            sonuc?.text ||
            ''

          if (bulunanKod) {
            const gecerliKod = barkodAdayiniHazirla(bulunanKod)
            if (!gecerliKod) {
              continue
            }
            taramaBilgisiniGuncelle(
              kaynakEtiketi ? `${kaynakEtiketi} / ZXing` : 'ZXing',
              bulunanKod,
              gecerliKod,
            )
            return gecerliKod
          }
        } catch (error) {
          if (!zxingHatasiBeklenenTurMu(error)) {
            throw error
          }
        }
      }
    }

    const ozelCozucuIleBulunanKod = ozelCozucuIleBarkodOku(kaynaklar, kaynakEtiketi)
    if (ozelCozucuIleBulunanKod) {
      return ozelCozucuIleBulunanKod
    }

    const quaggaIleBulunanKod = await quaggaIleBarkodOku(kaynaklar, kaynakEtiketi, zorla)
    if (quaggaIleBulunanKod) {
      return quaggaIleBulunanKod
    }

    const detector = detectorRef.current
    if (detector && video) {
      for (const kaynak of [...kaynaklar, video]) {
        try {
          const kodlar = await detector.detect(kaynak)
          const bulunanKod = kodlar.find((kod) => kod.rawValue)?.rawValue
          if (bulunanKod) {
            const gecerliKod = barkodAdayiniHazirla(bulunanKod)
            if (!gecerliKod) {
              continue
            }
            taramaBilgisiniGuncelle(
              kaynakEtiketi ? `${kaynakEtiketi} / BarcodeDetector` : 'BarcodeDetector',
              bulunanKod,
              gecerliKod,
            )
            return gecerliKod
          }
        } catch {
          // Sessiz devam et.
        }
      }
    }

    return ''
  }, [ozelCozucuIleBarkodOku, quaggaIleBarkodOku, taramaBilgisiniGuncelle])

  const karedenBarkodOku = useCallback(async () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return ''

    const kaynaklar = taramaKaynaklariniHazirla()
    return kaynaklardanBarkodOku(kaynaklar)
  }, [kaynaklardanBarkodOku, taramaKaynaklariniHazirla])

  const ocrKaynaklarindanBarkodOku = useCallback(async (kaynaklar, kaynakEtiketi = 'OCR', zorla = false, secenekler = {}) => {
    if (ocrKullanilamiyorRef.current || ocrCalisiyorRef.current) return ''

    const simdi = Date.now()
    if (!zorla && simdi - sonOcrDenemeRef.current < OCR_DENEME_ARALIGI_MS) return ''
    if (kaynaklar.length === 0) return ''
    const araDurumlariGoster = secenekler.araDurumlariGoster ?? true
    const erkenCikisAktif = secenekler.erkenCikisAktif ?? false

    sonOcrDenemeRef.current = simdi
    ocrCalisiyorRef.current = true

    try {
      const worker = await ocrWorkeriniHazirla()
      if (!worker) return ''
      const adaySkorlari = new Map()

      for (const kaynak of kaynaklar) {
        const { data } = await worker.recognize(kaynak)
        if (araDurumlariGoster) {
          taramaBilgisiniGuncelle(kaynakEtiketi, data?.text)
        }
        const bulunanKod = ocrMetnindenBarkodBul(data?.text)
        if (bulunanKod) {
          const oncekiAday = adaySkorlari.get(bulunanKod) ?? {
            adet: 0,
            puan: 0,
            hamMetin: data?.text ?? '',
          }

          const yeniAday = {
            adet: oncekiAday.adet + 1,
            puan: oncekiAday.puan + ocrAdayPuaniniHesapla(bulunanKod),
            hamMetin: oncekiAday.hamMetin || data?.text || '',
          }

          adaySkorlari.set(bulunanKod, yeniAday)

          if (
            erkenCikisAktif &&
            (
              yeniAday.adet >= 2 ||
              (bulunanKod.length >= 12 && gtinGecerliMi(bulunanKod))
            )
          ) {
            taramaBilgisiniGuncelle(kaynakEtiketi, yeniAday.hamMetin, bulunanKod)
            return bulunanKod
          }
        }
      }

      const enIyiAday = [...adaySkorlari.entries()]
        .sort((ilk, ikinci) => {
          const ikinciSkor = ikinci[1].adet * 1000 + ikinci[1].puan
          const ilkSkor = ilk[1].adet * 1000 + ilk[1].puan
          if (ikinciSkor !== ilkSkor) return ikinciSkor - ilkSkor
          return ikinci[0].length - ilk[0].length
        })[0]

      if (enIyiAday) {
        taramaBilgisiniGuncelle(kaynakEtiketi, enIyiAday[1].hamMetin, enIyiAday[0])
        return enIyiAday[0]
      }
    } catch {
      // OCR fallback sessiz kalsın.
    } finally {
      ocrCalisiyorRef.current = false
    }

    return ''
  }, [ocrWorkeriniHazirla, taramaBilgisiniGuncelle])

  const ocrIleBarkodOku = useCallback(async () => {
    const kaynaklar = ocrKaynaklariniHazirla()
    return ocrKaynaklarindanBarkodOku(kaynaklar, 'OCR')
  }, [ocrKaynaklariniHazirla, ocrKaynaklarindanBarkodOku])

  const barkoduIsle = useCallback((hamDeger, secenekler = {}) => {
    const gecerlilesenDeger = barkodAdayiniHazirla(hamDeger)
    if (!gecerlilesenDeger) return

    const simdi = Date.now()
    const degerAnahtari = gecerlilesenDeger.toLocaleLowerCase('tr-TR')
    const sonOkunan = sonOkunanRef.current
    const zorla = secenekler.zorla ?? false

    if (!zorla && sonOkunan.deger === degerAnahtari && simdi - sonOkunan.zaman < AYNI_KOD_BEKLEME_MS) {
      return
    }

    sonOkunanRef.current = {
      deger: degerAnahtari,
      zaman: simdi,
    }

    taramaBilgisiniGuncelle('Alan Dolduruldu', gecerlilesenDeger, gecerlilesenDeger)
    setBarkodMetni(gecerlilesenDeger)
    okutmaEfektiniCalistir()
  }, [okutmaEfektiniCalistir, setBarkodMetni, taramaBilgisiniGuncelle])

  const gelismisKareTaramaKaynaklariniHazirla = useCallback((anaTuval) => {
    if (!anaTuval) return []

    const kaynaklar = [anaTuval]

    KARE_YAKALA_TARAMA_BOLGELERI.forEach((bolge) => {
      const hedefTuval = document.createElement('canvas')
      const hazirKaynak = kaynakBolgesindenTuvalOlustur(anaTuval, hedefTuval, {
        imageSmoothingEnabled: false,
        ...bolge,
      })

      if (hazirKaynak) {
        kaynaklar.push(hazirKaynak)
      }
    })

    const donusmusKaynaklar = [...kaynaklar]
    kaynaklar.forEach((kaynak) => {
      const donmusTuval = document.createElement('canvas')
      const dondurulmusKaynak = tuvaliDondur(kaynak, donmusTuval)
      if (dondurulmusKaynak) {
        donusmusKaynaklar.push(dondurulmusKaynak)
      }
    })

    const aciliKaynaklar = [...kaynaklar]
      .filter((kaynak) => kaynak?.width && kaynak?.height && kaynak.width >= kaynak.height)
      .sort((ilk, ikinci) => (ikinci.width * ikinci.height) - (ilk.width * ilk.height))
      .slice(0, 4)

    aciliKaynaklar.forEach((kaynak) => {
      KARE_YAKALA_DONUS_ACILARI.forEach((aci) => {
        const aciliTuval = document.createElement('canvas')
        const dondurulmusKaynak = tuvaliAciylaDondur(kaynak, aciliTuval, aci)
        if (dondurulmusKaynak) {
          donusmusKaynaklar.push(dondurulmusKaynak)
        }
      })
    })

    return donusmusKaynaklar
  }, [])

  const gelismisKareOcrKaynaklariniHazirla = useCallback((anaTuval, secenekler = {}) => {
    if (!anaTuval) return []

    const hizli = secenekler.hizli ?? false
    const kaynaklar = []
    const bantlar = hizli ? KARE_YAKALA_OCR_BANTLARI.slice(0, 3) : KARE_YAKALA_OCR_BANTLARI

    bantlar.forEach((bant, index) => {
      const normalTuval = document.createElement('canvas')
      const esikliTuval = document.createElement('canvas')
      if (!hizli || index === 0) {
        const normalKaynak = ocrIcinTuvaliHazirla(anaTuval, normalTuval, bant)
        if (normalKaynak) {
          kaynaklar.push(normalKaynak)
        }
      }

      const esikliKaynak = ocrIcinTuvaliHazirla(anaTuval, esikliTuval, {
        ...bant,
        esikleme: true,
      })

      if (esikliKaynak) {
        kaynaklar.push(esikliKaynak)
      }
    })

    return kaynaklar
  }, [])

  const yakalananKareyiAnalizEt = useCallback(async ({
    kaynakEtiketi = 'Kare Analizi',
    durumMetni = 'Yakalanan kare yüksek hassasiyetle işleniyor...',
    sessiz = false,
    sayiOncelikli = true,
    hizliSayiTaramasi = false,
    ocrSonCareKullan = true,
    onizlemeGoster = true,
    gelismisBarkodTaramasi = true,
    araDurumlariGoster = true,
  } = {}) => {
    const canliKaynaklar = taramaKaynaklariniHazirla()
    const anaTuval = taramaCanvasRef.current

    if (canliKaynaklar.length === 0 || !anaTuval) {
      if (!sessiz) {
        toastGoster('uyari', 'Kare yakalanamadı. Barkodu çerçeve içinde biraz daha sabit tutup tekrar deneyin.')
      }
      return ''
    }

    const yakalananTuval = tuvaliKopyala(anaTuval)
    if (!yakalananTuval) {
      if (!sessiz) {
        toastGoster('uyari', 'Yakalanan görüntü işlenemedi. Lütfen tekrar deneyin.')
      }
      return ''
    }

    if (onizlemeGoster) {
      setYakalananKareOnizleme(yakalananTuval.toDataURL('image/jpeg', 0.58))
    }

    let sayiOcrDenemesiYapildi = false

    if (sayiOncelikli) {
      sayiOcrDenemesiYapildi = true
      if (araDurumlariGoster) {
        taramaBilgisiniGuncelle(
          `${kaynakEtiketi} / Sayılar`,
          hizliSayiTaramasi
            ? 'Görüntü alındı. Hızlı sayı okuması yapılıyor...'
            : 'Görünen rakamlar öncelikli okunuyor...',
        )
      }

      const sayiOcrKaynaklari = gelismisKareOcrKaynaklariniHazirla(yakalananTuval, {
        hizli: hizliSayiTaramasi,
      })
      const sayiOcrIleBulunanKod = await ocrKaynaklarindanBarkodOku(
        sayiOcrKaynaklari,
        `${kaynakEtiketi} / Sayılar`,
        true,
        { araDurumlariGoster, erkenCikisAktif: true },
      )

      if (sayiOcrIleBulunanKod) {
        barkoduIsle(sayiOcrIleBulunanKod, { zorla: true })
        return sayiOcrIleBulunanKod
      }
    }

    if (gelismisBarkodTaramasi) {
      if (araDurumlariGoster) {
        taramaBilgisiniGuncelle(kaynakEtiketi, durumMetni)
      }

      const gelismisTaramaKaynaklari = [
        ...canliKaynaklar,
        ...gelismisKareTaramaKaynaklariniHazirla(yakalananTuval),
      ]
      const bulunanKod = await kaynaklardanBarkodOku(gelismisTaramaKaynaklari, kaynakEtiketi, true)

      if (bulunanKod) {
        barkoduIsle(bulunanKod, { zorla: true })
        return bulunanKod
      }
    }

    if (ocrSonCareKullan && (!sayiOcrDenemesiYapildi || hizliSayiTaramasi)) {
      if (araDurumlariGoster) {
        taramaBilgisiniGuncelle(`${kaynakEtiketi} / OCR`, 'Rakamlar öncelikli okunamadı. Son çare geniş OCR deneniyor...')
      }

      const ocrKaynaklari = gelismisKareOcrKaynaklariniHazirla(yakalananTuval)
      const ocrIleBulunanKod = await ocrKaynaklarindanBarkodOku(
        ocrKaynaklari,
        `${kaynakEtiketi} / OCR`,
        true,
        { araDurumlariGoster, erkenCikisAktif: true },
      )
      if (ocrIleBulunanKod) {
        barkoduIsle(ocrIleBulunanKod, { zorla: true })
        return ocrIleBulunanKod
      }
    }

    const bulunamadiMesaji = sessiz
      ? 'Tam barkod çözülemedi. Yeni kare bekleniyor...'
      : 'Tam barkod çözülemedi. Barkodu biraz daha yaklaştırıp tekrar deneyin.'
    taramaBilgisiniGuncelle(kaynakEtiketi, bulunamadiMesaji, '')

    if (!sessiz) {
      toastGoster('uyari', 'Yakalanan karede tam barkod çözülemedi. Barkodu biraz daha yaklaştırıp tekrar deneyin.')
    }

    return ''
  }, [
    barkoduIsle,
    gelismisKareOcrKaynaklariniHazirla,
    gelismisKareTaramaKaynaklariniHazirla,
    kaynaklardanBarkodOku,
    ocrKaynaklarindanBarkodOku,
    taramaBilgisiniGuncelle,
    taramaKaynaklariniHazirla,
    toastGoster,
  ])

  const kareYakalarakBarkodCoz = useCallback(async () => {
    if (!kameraAcik || !videoRef.current || videoRef.current.readyState < 2) {
      toastGoster('uyari', 'Önce kameranın net görüntü vermesini bekleyin, ardından tekrar deneyin.')
      return
    }

    if (kareIsleniyor || taramaCalisiyorRef.current) return

    setKareIsleniyor(true)
    taramaBilgisiniGuncelle('Kare Analizi', 'Görüntü alındı. Hızlı sayı okuması başlatılıyor...')
    taramaCalisiyorRef.current = true

    try {
      await yakalananKareyiAnalizEt({
        kaynakEtiketi: 'Kare Analizi',
        durumMetni: 'Hızlı sayı okuması yetmezse geniş analiz yapılacak...',
        sessiz: false,
        sayiOncelikli: true,
        hizliSayiTaramasi: true,
        ocrSonCareKullan: true,
        onizlemeGoster: true,
        gelismisBarkodTaramasi: false,
        araDurumlariGoster: true,
      })
    } catch {
      toastGoster('hata', 'Yakalanan kare çözümlenirken beklenmeyen bir sorun oluştu.')
    } finally {
      taramaCalisiyorRef.current = false
      setKareIsleniyor(false)
    }
  }, [kareIsleniyor, kameraAcik, taramaBilgisiniGuncelle, toastGoster, yakalananKareyiAnalizEt])

  const kamerayiBaslat = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toastGoster('hata', 'Bu cihazda kamera erişimi kullanılamıyor.')
      return
    }

    kamerayiDurdur()
    setKameraHatasi('')
    setKameraYukleniyor(true)

    try {
      if (barkodDestekleniyor) {
        const tarayiciFormatlari = typeof window.BarcodeDetector.getSupportedFormats === 'function'
          ? await window.BarcodeDetector.getSupportedFormats().catch(() => DESTEKLENEN_FORMATLAR)
          : DESTEKLENEN_FORMATLAR
        const kullanilabilirFormatlar = DESTEKLENEN_FORMATLAR.filter((format) => tarayiciFormatlari.includes(format))

        detectorRef.current = kullanilabilirFormatlar.length > 0
          ? new window.BarcodeDetector({ formats: kullanilabilirFormatlar })
          : null
      } else {
        detectorRef.current = null
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      if (!zxingReaderRef.current) {
        const ipuclari = new Map()
        ipuclari.set(DecodeHintType.POSSIBLE_FORMATS, ZXING_FORMATLARI)
        ipuclari.set(DecodeHintType.TRY_HARDER, true)
        zxingReaderRef.current = new BrowserMultiFormatOneDReader(ipuclari, {
          delayBetweenScanAttempts: 90,
          delayBetweenScanSuccess: 750,
          tryPlayVideoTimeout: 4000,
        })
      }

      sonKareAnalizDenemeRef.current = 0

      intervalRef.current = window.setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2 || taramaCalisiyorRef.current) return

        taramaCalisiyorRef.current = true

        try {
          const simdi = Date.now()
          if (simdi - sonKareAnalizDenemeRef.current >= KARE_ANALIZ_DENEME_ARALIGI_MS) {
            sonKareAnalizDenemeRef.current = simdi
            const otomatikBulunanKod = await yakalananKareyiAnalizEt({
              kaynakEtiketi: 'Otomatik Sayı Analizi',
              durumMetni: 'Kameradaki görünen rakamlar okunuyor...',
              sessiz: true,
              sayiOncelikli: true,
              hizliSayiTaramasi: true,
              ocrSonCareKullan: false,
              onizlemeGoster: false,
              gelismisBarkodTaramasi: false,
              araDurumlariGoster: false,
            })
            if (otomatikBulunanKod) {
              return
            }
          }
        } catch {
          // Tarama döngüsü sessiz devam etsin.
        } finally {
          taramaCalisiyorRef.current = false
        }
      }, TARAMA_ARALIGI_MS)

      setKameraHatasi('')
      setKameraAcik(true)
      void ocrWorkeriniHazirla()
    } catch (error) {
      const mesaj = error?.name === 'NotAllowedError'
        ? 'Kamera izni verilmedi. Barkod okutmak için izin vermeniz gerekiyor.'
        : 'Kamera başlatılamadı. Lütfen cihazınızın kamera erişimini kontrol edin.'

      setKameraHatasi(mesaj)
      toastGoster('hata', mesaj)
      kamerayiDurdur()
    } finally {
      setKameraYukleniyor(false)
    }
  }, [
    barkodDestekleniyor,
    barkoduIsle,
    karedenBarkodOku,
    kamerayiDurdur,
    ocrWorkeriniHazirla,
    taramaBilgisiniGuncelle,
    toastGoster,
    yakalananKareyiAnalizEt,
  ])

  useEffect(() => {
    if (!barkodModalAcik) {
      otomatikBaslatildiRef.current = false
      ocrCalisiyorRef.current = false
      sonOcrDenemeRef.current = 0
      quaggaCalisiyorRef.current = false
      sonQuaggaDenemeRef.current = 0
      sonKareAnalizDenemeRef.current = 0
      setKareIsleniyor(false)
      setOcrHazirlaniyor(false)
      setTaramaKaynakBilgisi('')
      setTaramaHamMetni('')
      setTaramaSecilenBarkod('')
      setAktifDokunsalDugme('')
      sonTaramaDurumuRef.current = { kaynak: '', hamMetin: '', secilenBarkod: '' }
      setYakalananKareOnizleme('')
      kamerayiDurdur()
      setKameraHatasi('')
      return
    }

    if (!otomatikBaslatildiRef.current) {
      otomatikBaslatildiRef.current = true
      void kamerayiBaslat()
    }
  }, [barkodModalAcik, kamerayiBaslat, kamerayiDurdur])

  useEffect(() => {
    return () => {
      kamerayiDurdur()
      ocrCalisiyorRef.current = false
      quaggaCalisiyorRef.current = false
      const worker = ocrWorkerRef.current
      ocrWorkerRef.current = null
      ocrHazirlaniyorRef.current = null
      if (dokunsalDugmeZamanlayiciRef.current) {
        window.clearTimeout(dokunsalDugmeZamanlayiciRef.current)
      }
      if (worker) {
        void worker.terminate().catch(() => {})
      }
      if (parlamaZamanlayiciRef.current) {
        window.clearTimeout(parlamaZamanlayiciRef.current)
      }
    }
  }, [kamerayiDurdur])

  if (!barkodModalAcik) return null

  const kameraDurumMetni = kameraYukleniyor
    ? 'Kamera hazırlanıyor...'
    : kameraHatasi || (ocrHazirlaniyor
        ? 'Son çare OCR hazırlanıyor. İlk kullanım birkaç saniye sürebilir.'
        : (kareIsleniyor
        ? 'Yakalanan kare yüksek hassasiyetle analiz ediliyor. Bu adım birkaç saniye sürebilir.'
        : (kameraAcik ? 'Kameradaki rakamları çerçevede net tutun. Sayılar otomatik okunuyor.' : '')))

  return (
    <div className="modal-kaplama barkod-kaplama" onClick={barkodModaliniKapat}>
      <div
        className={`modal-kutu barkod-kutu ${satisModu ? 'satis-modu' : 'alis-modu'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="barkod-modal-ust">
          <div>
            <span className="barkod-modal-etiket">Hızlı Stok İşlemi</span>
            <h3>Barkod ile Stok Yönetimi</h3>
            <p>Ürün ID veya barkod girerek sepet oluşturun, ardından stokları tek adımda güncelleyin.</p>
          </div>
          <button
            type="button"
            className={`barkod-modal-kapat ${aktifDokunsalDugme === 'kapat' ? 'dokunsal-aktif' : ''}`}
            onPointerDown={() => dokunsalGeriBildirimVer({ seviye: 'hafif', dugme: 'kapat' })}
            onClick={barkodModaliniKapat}
            aria-label="Barkod ekranını kapat"
          >
            ×
          </button>
        </div>

        <div className="barkod-islem-anahtari" role="tablist" aria-label="Stok işlem türü">
          <button
            type="button"
            className={`${!satisModu ? 'aktif ' : ''}${aktifDokunsalDugme === 'sekme-alis' ? 'dokunsal-aktif' : ''}`.trim()}
            onPointerDown={() => dokunsalGeriBildirimVer({ seviye: 'hafif', dugme: 'sekme-alis' })}
            onClick={() => barkodIslemTurunuDegistir('alis')}
          >
            <strong>Alış</strong>
            <span>Stok Girişi</span>
          </button>
          <button
            type="button"
            className={`${satisModu ? 'aktif ' : ''}${aktifDokunsalDugme === 'sekme-satis' ? 'dokunsal-aktif' : ''}`.trim()}
            onPointerDown={() => dokunsalGeriBildirimVer({ seviye: 'hafif', dugme: 'sekme-satis' })}
            onClick={() => barkodIslemTurunuDegistir('satis')}
          >
            <strong>Satış</strong>
            <span>Stok Çıkışı</span>
          </button>
        </div>

        <div className="barkod-icerik">
          <section className="barkod-paneli barkod-form-paneli">
            <div className="barkod-alan-baslik barkod-alan-baslik-kamera">
              <div>
                <h4>Barkod Girişi</h4>
                <span>{satisModu ? 'Kırmızı tema satış işlemi içindir.' : 'Yeşil tema alış işlemi içindir.'}</span>
              </div>
              <div className="barkod-kamera-dugme-grubu">
                <button
                  type="button"
                  className={`barkod-kamera-dugmesi ${kameraAcik ? 'aktif' : ''} ${aktifDokunsalDugme === 'kamera' ? 'dokunsal-aktif' : ''}`.trim()}
                  onPointerDown={() => dokunsalGeriBildirimVer({ seviye: 'hafif', dugme: 'kamera' })}
                  onClick={kameraAcik ? kamerayiDurdur : kamerayiBaslat}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                    <path d="M20 8V6a2 2 0 0 0-2-2h-2" />
                    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                    <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
                    <path d="M8 7v10" />
                    <path d="M10.5 6.5v11" />
                    <path d="M13 7.5v9" />
                    <path d="M15.5 6.5v11" />
                  </svg>
                  <span>{kameraAcik ? 'Kamerayı Durdur' : 'Kamera ile Okut'}</span>
                </button>
                <button
                  type="button"
                  className={`barkod-kamera-yardimci-dugme ${aktifDokunsalDugme === 'kare-yakala' ? 'dokunsal-aktif' : ''}`.trim()}
                  onPointerDown={() => dokunsalGeriBildirimVer({ seviye: 'orta', dugme: 'kare-yakala' })}
                  onClick={() => void kareYakalarakBarkodCoz()}
                  disabled={!kameraAcik || kameraYukleniyor || kareIsleniyor}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 8a2 2 0 0 1 2-2h2l1.2-1.6A1.8 1.8 0 0 1 11.65 4h.7a1.8 1.8 0 0 1 1.45.4L15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z" />
                    <path d="M12 10.1a2.9 2.9 0 1 0 0 5.8a2.9 2.9 0 0 0 0-5.8Z" />
                  </svg>
                  <span>{kareIsleniyor ? 'Kare İşleniyor' : 'Kare Yakala'}</span>
                </button>
              </div>
            </div>

            {(kameraAcik || kameraYukleniyor || kameraHatasi) && (
              <div className={`barkod-kamera-alani ${taramaParlamasi ? 'parladi' : ''}`}>
                <video ref={videoRef} className="barkod-kamera-video" autoPlay muted playsInline />
                <div className="barkod-kamera-overlay" aria-hidden="true">
                  <div ref={hedefRef} className="barkod-kamera-hedef">
                    <div className="barkod-kamera-lazer" />
                  </div>
                </div>
                {kameraDurumMetni && (
                  <div className="barkod-kamera-durum">
                    <strong>{kameraDurumMetni}</strong>
                  </div>
                )}
              </div>
            )}

            {(taramaKaynakBilgisi || taramaSecilenBarkod || taramaHamMetni) && (
              <div className="barkod-urun-onizleme">
                <div className="barkod-urun-ozet">
                  <div>
                    <span>Son kaynak</span>
                    <strong>{taramaKaynakBilgisi || '-'}</strong>
                  </div>
                  <div>
                    <span>Okunan sayı</span>
                    <strong>{taramaSecilenBarkod || '-'}</strong>
                  </div>
                </div>
                <div className="barkod-kalem-stok">
                  <span>Son durum</span>
                  <strong>{taramaHamMetni || '-'}</strong>
                </div>
              </div>
            )}

            {yakalananKareOnizleme && (
              <div className="barkod-kare-onizleme">
                <div className="barkod-kare-onizleme-baslik">
                  <span>Son Yakalanan Kare</span>
                  <strong>Otomatik analiz bu görüntü üstünde yapılıyor</strong>
                </div>
                <img src={yakalananKareOnizleme} alt="Son yakalanan barkod karesi" />
              </div>
            )}

            <div className="barkod-girdi-grid">
              <label className="barkod-girdi-alani barkod-girdi-buyuk">
                <span>Barkod / Ürün ID</span>
                <input
                  type="text"
                  value={barkodMetni}
                  onChange={(event) => setBarkodMetni(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      barkodSepeteEkle()
                    }
                  }}
                  placeholder="Örn. MTR-2001"
                />
              </label>

              <label className="barkod-girdi-alani">
                <span>Miktar</span>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={barkodMiktari}
                  onChange={(event) => barkodMiktariGuncelle(event.target.value)}
                />
              </label>

              <button
                type="button"
                className={`barkod-sepete-ekle ${aktifDokunsalDugme === 'sepete-ekle' ? 'dokunsal-aktif' : ''}`.trim()}
                onPointerDown={() => dokunsalGeriBildirimVer({ seviye: 'hafif', dugme: 'sepete-ekle' })}
                onClick={() => barkodSepeteEkle()}
              >
                Sepete Ekle
              </button>
            </div>

            {barkodSeciliUrun && (
              <div className="barkod-urun-onizleme">
                <div className="barkod-urun-kimlik">
                  <span className="urun-avatar">{barkodSeciliUrun.avatar}</span>
                  <div>
                    <strong>{barkodSeciliUrun.ad}</strong>
                    <span>{barkodSeciliUrun.urunId}</span>
                  </div>
                </div>
                <div className="barkod-urun-ozet">
                  <div>
                    <span>Mevcut stok</span>
                    <strong>{barkodSeciliUrun.magazaStok}</strong>
                  </div>
                  <div>
                    <span>İşlem sonrası</span>
                    <strong>{seciliUrunSonrakiStok}</strong>
                  </div>
                </div>
              </div>
            )}

            {barkodEslesmeleri.length > 0 && (
              <div className="barkod-eslesmeler">
                {barkodEslesmeleri.map((urun) => (
                  <button
                    key={`barkod-eslesme-${urun.uid}`}
                    type="button"
                    className={`barkod-eslesme-buton ${barkodSeciliUrun?.uid === urun.uid ? 'aktif' : ''}`}
                    onClick={() => barkodAdayiniSec(urun)}
                  >
                    <strong>{urun.ad}</strong>
                    <span>{urun.urunId}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="barkod-paneli barkod-sepet-paneli">
            <div className="barkod-alan-baslik">
              <h4>İşlem Sepeti</h4>
              {barkodSepeti.length > 0 && (
                <button type="button" className="barkod-link-buton" onClick={barkodSepetiniTemizle}>
                  Sepeti Temizle
                </button>
              )}
            </div>

            {barkodSepeti.length === 0 ? (
              <div className="barkod-bos-durum">
                <strong>Sepetiniz boş.</strong>
                <span>Barkod veya ürün ID girip miktar belirleyerek işlem oluşturun.</span>
              </div>
            ) : (
              <div className="barkod-sepet-listesi">
                {barkodSepeti.map((kalem) => (
                  <article key={`barkod-kalem-${kalem.uid}`} className="barkod-sepet-kalem">
                    <div className="barkod-kalem-kimlik">
                      <span className="urun-avatar">{kalem.avatar}</span>
                      <div>
                        <strong>{kalem.ad}</strong>
                        <span>{kalem.urunId}</span>
                      </div>
                    </div>

                    <div className="barkod-kalem-aksiyon">
                      <label>
                        <span>Miktar</span>
                        <input
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={kalem.miktar}
                          onChange={(event) => barkodKalemMiktariniDegistir(kalem.uid, event.target.value)}
                        />
                      </label>

                      <div className="barkod-kalem-stok">
                        <span>Mevcut: {kalem.mevcutStok}</span>
                        <strong>
                          Sonraki: {satisModu ? kalem.mevcutStok - kalem.miktar : kalem.mevcutStok + kalem.miktar}
                        </strong>
                      </div>

                      <button type="button" className="barkod-kalem-sil" onClick={() => barkodKaleminiKaldir(kalem.uid)}>
                        Kaldır
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="barkod-alt-ozet">
          <div className="barkod-alt-bilgi">
            <strong>{satisModu ? 'Satış Özeti' : 'Alış Özeti'}</strong>
            <span>{barkodToplamKalem} kalem • {barkodToplamAdet} adet</span>
          </div>
          <button
            type="button"
            className={`barkod-onay-buton ${aktifDokunsalDugme === 'stoklari-guncelle' ? 'dokunsal-aktif' : ''}`.trim()}
            disabled={barkodSepeti.length === 0}
            onPointerDown={() => dokunsalGeriBildirimVer({ seviye: 'orta', dugme: 'stoklari-guncelle' })}
            onClick={barkodStoklariniGuncelle}
          >
            Stokları Güncelle
          </button>
        </div>
      </div>
    </div>
  )
}
