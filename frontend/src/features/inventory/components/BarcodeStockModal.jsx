import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '../../../core/contexts/ToastContext'

const TARAMA_ARALIGI_MS = 240
const AYNI_KOD_BEKLEME_MS = 1400
const DESTEKLENEN_FORMATLAR = [
  'ean_13',
  'ean_8',
  'code_128',
  'code_39',
  'code_93',
  'codabar',
  'itf',
  'upc_a',
  'upc_e',
  'qr_code',
]

export default function BarcodeStockModal({ inventoryData }) {
  const {
    urunler,
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
  const [taramaParlamasi, setTaramaParlamasi] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const intervalRef = useRef(null)
  const sonOkunanRef = useRef({ deger: '', zaman: 0 })
  const parlamaZamanlayiciRef = useRef(null)
  const sesBaglamiRef = useRef(null)
  const otomatikBaslatildiRef = useRef(false)

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

  const okutmaEfektiniCalistir = useCallback(() => {
    bipCal()
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([35, 22, 45])
    }

    if (parlamaZamanlayiciRef.current) {
      window.clearTimeout(parlamaZamanlayiciRef.current)
    }

    setTaramaParlamasi(true)
    parlamaZamanlayiciRef.current = window.setTimeout(() => {
      setTaramaParlamasi(false)
    }, 260)
  }, [bipCal])

  const kamerayiDurdur = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

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
  }, [])

  const barkoduIsle = useCallback((hamDeger) => {
    const temizDeger = String(hamDeger ?? '').trim()
    if (!temizDeger) return

    const simdi = Date.now()
    const degerAnahtari = temizDeger.toLowerCase()
    const sonOkunan = sonOkunanRef.current

    if (sonOkunan.deger === degerAnahtari && simdi - sonOkunan.zaman < AYNI_KOD_BEKLEME_MS) {
      return
    }

    sonOkunanRef.current = {
      deger: degerAnahtari,
      zaman: simdi,
    }

    const eslesenUrun =
      urunler.find((urun) => urun.urunId.toLowerCase() === degerAnahtari) ??
      urunler.find((urun) => urun.ad.toLowerCase() === degerAnahtari) ??
      urunler.find((urun) => urun.urunId.toLowerCase().includes(degerAnahtari))

    if (!eslesenUrun) {
      setBarkodMetni(temizDeger)
      toastGoster('uyari', 'Okunan barkod ürün listesinde bulunamadı.')
      return
    }

    setBarkodMetni(eslesenUrun.urunId)
    barkodAdayiniSec(eslesenUrun)
    barkodSepeteEkle(eslesenUrun)
    okutmaEfektiniCalistir()
  }, [barkodAdayiniSec, barkodSepeteEkle, okutmaEfektiniCalistir, setBarkodMetni, toastGoster, urunler])

  const kamerayiBaslat = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toastGoster('hata', 'Bu cihazda kamera erişimi kullanılamıyor.')
      return
    }

    kamerayiDurdur()
    setKameraHatasi('')
    setKameraYukleniyor(true)

    try {
      detectorRef.current = barkodDestekleniyor
        ? new window.BarcodeDetector({ formats: DESTEKLENEN_FORMATLAR })
        : null

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

      if (detectorRef.current) {
        intervalRef.current = window.setInterval(async () => {
          if (!videoRef.current || !detectorRef.current || videoRef.current.readyState < 2) return

          try {
            const kodlar = await detectorRef.current.detect(videoRef.current)
            const bulunanKod = kodlar.find((kod) => kod.rawValue)?.rawValue
            if (bulunanKod) {
              barkoduIsle(bulunanKod)
            }
          } catch {
            // Tarama döngüsü sessiz devam etsin.
          }
        }, TARAMA_ARALIGI_MS)
        setKameraHatasi('')
      } else {
        setKameraHatasi('Kamera açık. Bu tarayıcı otomatik barkod algılamayı desteklemiyor; barkodu elle girebilirsiniz.')
      }

      setKameraAcik(true)
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
  }, [barkodDestekleniyor, barkoduIsle, kamerayiDurdur, toastGoster])

  useEffect(() => {
    if (!barkodModalAcik) {
      otomatikBaslatildiRef.current = false
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
      if (parlamaZamanlayiciRef.current) {
        window.clearTimeout(parlamaZamanlayiciRef.current)
      }
    }
  }, [kamerayiDurdur])

  if (!barkodModalAcik) return null

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
          <button type="button" className="barkod-modal-kapat" onClick={barkodModaliniKapat} aria-label="Barkod ekranını kapat">
            ×
          </button>
        </div>

        <div className="barkod-islem-anahtari" role="tablist" aria-label="Stok işlem türü">
          <button
            type="button"
            className={!satisModu ? 'aktif' : ''}
            onClick={() => barkodIslemTurunuDegistir('alis')}
          >
            <strong>Alış</strong>
            <span>Stok Girişi</span>
          </button>
          <button
            type="button"
            className={satisModu ? 'aktif' : ''}
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
              <button
                type="button"
                className={`barkod-kamera-dugmesi ${kameraAcik ? 'aktif' : ''}`}
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
            </div>

            {(kameraAcik || kameraYukleniyor || kameraHatasi) && (
              <div className={`barkod-kamera-alani ${taramaParlamasi ? 'parladi' : ''}`}>
                <video ref={videoRef} className="barkod-kamera-video" autoPlay muted playsInline />
                <div className="barkod-kamera-overlay" aria-hidden="true">
                  <div className="barkod-kamera-hedef">
                    <div className="barkod-kamera-lazer" />
                  </div>
                </div>
                <div className="barkod-kamera-durum">
                  {kameraYukleniyor && <strong>Kamera hazırlanıyor...</strong>}
                  {!kameraYukleniyor && kameraAcik && <strong>Barkodu çerçeveye hizalayın. Okuma kesintisiz devam ediyor.</strong>}
                  {kameraHatasi && <strong>{kameraHatasi}</strong>}
                </div>
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

              <button type="button" className="barkod-sepete-ekle" onClick={() => barkodSepeteEkle()}>
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
            className="barkod-onay-buton"
            disabled={barkodSepeti.length === 0}
            onClick={barkodStoklariniGuncelle}
          >
            Stokları Güncelle
          </button>
        </div>
      </div>
    </div>
  )
}
