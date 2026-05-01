import { SayfaIkonu } from '../common/Ikonlar'

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

export default function Sidebar({
  aktifSayfa,
  sayfaDegistir,
  mobilMenuAcik,
  setMobilMenuAcik,
}) {
  if (aktifSayfa === 'merkez') return null

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

        <img
          src="/ytu-logo.png"
          alt="MTÜ Sanayi logosu"
          className="sayfa-logo menu-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => sayfaDegistir('dashboard')}
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/ytu-logo.svg'
          }}
        />

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
