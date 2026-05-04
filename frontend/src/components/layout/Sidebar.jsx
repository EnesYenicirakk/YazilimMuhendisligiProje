import { useEffect, useRef, useState } from 'react'
import { SayfaIkonu } from '../common/Ikonlar'
import SnakeMiniGame from './SnakeMiniGame'

const MENU_OGELERI = [
  { sayfa: 'dashboard', etiket: 'Dashboard' },
  { sayfa: 'envanter', etiket: 'Envanter' },
  { sayfa: 'siparisler', etiket: 'Siparişler' },
  { sayfa: 'musteriler', etiket: 'Kayıtlı Müşteriler' },
  { sayfa: 'alicilar', etiket: 'Kayıtlı Tedarikçiler' },
  { sayfa: 'odemeler', etiket: 'Finansal Akış' },
  { sayfa: 'urun-duzenleme', etiket: 'Ürün Düzenleme' },
  { sayfa: 'faturalama', etiket: 'Faturalama (PDF)' },
]

const EASTER_EGG_CLICK_WINDOW_MS = 800

export default function Sidebar({
  aktifSayfa,
  sayfaDegistir,
  mobilMenuAcik,
  setMobilMenuAcik,
}) {
  const [snakeAcik, setSnakeAcik] = useState(false)
  const [logoTiklamaSayisi, setLogoTiklamaSayisi] = useState(0)
  const clickTimerRef = useRef(null)
  const logoWrapRef = useRef(null)

  useEffect(() => () => {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!snakeAcik) return undefined

    const handlePointerDown = (event) => {
      if (logoWrapRef.current?.contains(event.target)) return
      setSnakeAcik(false)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [snakeAcik])

  if (aktifSayfa === 'merkez') return null

  const logoTiklandi = () => {
    sayfaDegistir('dashboard')

    const yeniSayi = logoTiklamaSayisi + 1
    setLogoTiklamaSayisi(yeniSayi)

    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current)
    }

    if (yeniSayi >= 3) {
      setSnakeAcik((onceki) => !onceki)
      setLogoTiklamaSayisi(0)
      clickTimerRef.current = null
      return
    }

    clickTimerRef.current = window.setTimeout(() => {
      setLogoTiklamaSayisi(0)
      clickTimerRef.current = null
    }, EASTER_EGG_CLICK_WINDOW_MS)
  }

  return (
    <>
      {!mobilMenuAcik && (
        <button
          type="button"
          className="mobil-menu-dugmesi"
          onClick={() => setMobilMenuAcik(true)}
          aria-label="Menüyü aç"
        >
          <span />
          <span />
          <span />
        </button>
      )}

      {mobilMenuAcik && (
        <button
          type="button"
          className="mobil-menu-arka-plan"
          aria-label="Menüyü kapat"
          onClick={() => setMobilMenuAcik(false)}
        />
      )}

      <aside className={`yan-menu ${mobilMenuAcik ? 'mobil-acik' : ''}`}>
        <div className="mobil-menu-ust">
          <h2>Menü</h2>
          <button
            type="button"
            className="mobil-menu-kapat"
            onClick={() => setMobilMenuAcik(false)}
            aria-label="Menüyü kapat"
          >
            ×
          </button>
        </div>

        <div ref={logoWrapRef} className="sidebar-logo-wrap">
          <img
            src="/ytu-logo.png"
            alt="MTÜ Sanayi logosu"
            className="sayfa-logo menu-logo"
            style={{ cursor: 'pointer' }}
            onClick={logoTiklandi}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = '/ytu-logo.svg'
            }}
          />
          {snakeAcik && <SnakeMiniGame onClose={() => setSnakeAcik(false)} />}
        </div>

        <nav>
          {MENU_OGELERI.map((oge) => (
            <button
              key={oge.sayfa}
              type="button"
              data-testid={`menu-${oge.sayfa}`}
              className={`menu-link ${aktifSayfa === oge.sayfa ? 'aktif' : ''}`}
              onClick={() => sayfaDegistir(oge.sayfa)}
            >
              <SayfaIkonu sayfa={oge.sayfa} />
              <span>{oge.etiket}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
