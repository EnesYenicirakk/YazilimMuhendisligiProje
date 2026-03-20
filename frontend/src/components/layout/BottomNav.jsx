import { SayfaIkonu } from '../common/Ikonlar'

const HIZLI_GECIS_OGELERI = [
  { sayfa: 'dashboard', etiket: 'Dashboard' },
  { sayfa: 'envanter', etiket: 'Envanter' },
  { sayfa: 'siparisler', etiket: 'Siparişler' },
  { sayfa: 'odemeler', etiket: 'Finansal Akış' },
]

export default function BottomNav({ aktifSayfa, sayfaDegistir }) {
  if (aktifSayfa === 'merkez') return null

  return (
    <nav className="mobil-alt-menu" aria-label="Hızlı gezinme">
      {HIZLI_GECIS_OGELERI.map((oge) => (
        <button
          key={oge.sayfa}
          type="button"
          className={`mobil-alt-menu-ogesi ${aktifSayfa === oge.sayfa ? 'aktif' : ''}`}
          onClick={() => sayfaDegistir(oge.sayfa)}
        >
          <SayfaIkonu sayfa={oge.sayfa} className="mobil-alt-menu-ikon" />
          <span>{oge.etiket}</span>
        </button>
      ))}
    </nav>
  )
}
