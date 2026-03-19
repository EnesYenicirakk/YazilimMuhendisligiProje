import { useEffect, useRef, useState } from 'react'

const KAPALI_KONUM = 0
const AKSIYON_ESIGI = 68
const MAKS_KAYDIRMA = 148

function MobilKart({
  className = '',
  ust,
  govde,
  aksiyon,
  children,
  solaAksiyonlar = [],
  sagaAksiyonlar = [],
  solaEtiket = 'Sil',
  sagaEtiket = 'İşlemler',
}) {
  const kartRef = useRef(null)
  const baslangicXRef = useRef(0)
  const baslangicYRef = useRef(0)
  const oncekiKaydirmaRef = useRef(0)
  const [kaydirma, setKaydirma] = useState(KAPALI_KONUM)
  const [surukleniyor, setSurukleniyor] = useState(false)

  const solaAcik = kaydirma < -AKSIYON_ESIGI
  const sagaAcik = kaydirma > AKSIYON_ESIGI
  const solaIpucuGoster = kaydirma < -18
  const sagaIpucuGoster = kaydirma > 18

  useEffect(() => {
    if (kaydirma === KAPALI_KONUM) return undefined

    const disTiklamaKapat = (event) => {
      if (!kartRef.current?.contains(event.target)) {
        setKaydirma(KAPALI_KONUM)
      }
    }

    document.addEventListener('pointerdown', disTiklamaKapat)
    return () => document.removeEventListener('pointerdown', disTiklamaKapat)
  }, [kaydirma])

  const dokunmaBasladi = (event) => {
    const dokunus = event.touches[0]
    baslangicXRef.current = dokunus.clientX
    baslangicYRef.current = dokunus.clientY
    oncekiKaydirmaRef.current = kaydirma
    setSurukleniyor(true)
  }

  const dokunmaHareketi = (event) => {
    if (!surukleniyor) return

    const dokunus = event.touches[0]
    const farkX = dokunus.clientX - baslangicXRef.current
    const farkY = dokunus.clientY - baslangicYRef.current

    if (Math.abs(farkY) > Math.abs(farkX)) return

    event.preventDefault()

    const sonraki = Math.max(
      -MAKS_KAYDIRMA,
      Math.min(MAKS_KAYDIRMA, oncekiKaydirmaRef.current + farkX),
    )
    setKaydirma(sonraki)
  }

  const dokunmaBitti = () => {
    setSurukleniyor(false)

    if (kaydirma <= -AKSIYON_ESIGI && solaAksiyonlar.length > 0) {
      setKaydirma(-Math.min(MAKS_KAYDIRMA, 112 + solaAksiyonlar.length * 6))
      return
    }

    if (kaydirma >= AKSIYON_ESIGI && sagaAksiyonlar.length > 0) {
      setKaydirma(Math.min(MAKS_KAYDIRMA, 112 + sagaAksiyonlar.length * 6))
      return
    }

    setKaydirma(KAPALI_KONUM)
  }

  const aksiyonTiklandi = (aksiyonCalistir) => {
    setKaydirma(KAPALI_KONUM)
    aksiyonCalistir?.()
  }

  return (
    <div
      ref={kartRef}
      className={`mobil-kart-kabuk ${className} ${solaAcik ? 'sola-acik' : ''} ${sagaAcik ? 'saga-acik' : ''}`.trim()}
    >
      <div className="mobil-kart-arka-plan mobil-kart-arka-plan-sol">
        <div className={`swipe-aksiyon-etiketi ${solaIpucuGoster ? 'goster' : ''}`}>{solaEtiket}</div>
        <div className="swipe-aksiyonlar">
          {solaAksiyonlar.map((aksiyonItem) => (
            <button
              key={aksiyonItem.id}
              type="button"
              className={`swipe-aksiyon-buton ${aksiyonItem.varyant || ''}`.trim()}
              onClick={() => aksiyonTiklandi(aksiyonItem.onClick)}
            >
              {aksiyonItem.etiket}
            </button>
          ))}
        </div>
      </div>

      <div className="mobil-kart-arka-plan mobil-kart-arka-plan-sag">
        <div className={`swipe-aksiyon-etiketi ${sagaIpucuGoster ? 'goster' : ''}`}>{sagaEtiket}</div>
        <div className="swipe-aksiyonlar">
          {sagaAksiyonlar.map((aksiyonItem) => (
            <button
              key={aksiyonItem.id}
              type="button"
              className={`swipe-aksiyon-buton ${aksiyonItem.varyant || ''}`.trim()}
              onClick={() => aksiyonTiklandi(aksiyonItem.onClick)}
            >
              {aksiyonItem.etiket}
            </button>
          ))}
        </div>
      </div>

      <article
        className={`mobil-kart ${className}`.trim()}
        style={{ transform: `translateX(${kaydirma}px)` }}
        onTouchStart={dokunmaBasladi}
        onTouchMove={dokunmaHareketi}
        onTouchEnd={dokunmaBitti}
        onTouchCancel={dokunmaBitti}
      >
        {ust ? <div className="mobil-kart-ust">{ust}</div> : null}
        {govde ? <div className="mobil-kart-govde">{govde}</div> : null}
        {aksiyon ? <div className="mobil-kart-aksiyon">{aksiyon}</div> : null}
        {children}
      </article>
    </div>
  )
}

export default MobilKart
