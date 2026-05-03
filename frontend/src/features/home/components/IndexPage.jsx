import { merkezMenusu } from '../../../shared/utils/constantsAndHelpers'
import { SayfaIkonu } from '../../../components/common/Ikonlar'

export default function IndexPage({
  gecisBalonu,
  merkezGirisEfekti,
  merkezdenSayfayaGit,
  onLogout,
}) {
  return (
    <>
      <section className={`merkez-ekrani ${gecisBalonu ? 'gecis-aktif' : ''} ${merkezGirisEfekti ? 'geri-giris' : ''}`} data-testid="home-page">
        <div className="merkez-sahne">
          <div className="arka-plan-baloncuklari" aria-hidden="true">
            <div className="arka-balon arka-balon-1">
              <small>Satış</small>
              <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                <path d="M8 37 L25 30 L42 18 L60 23 L78 14 L92 28" className="cizgi-a" />
                <path d="M8 43 L25 35 L42 40 L60 29 L78 33 L92 22" className="cizgi-b" />
                <path d="M8 46 L25 48 L42 44 L60 47 L78 41 L92 45" className="cizgi-c" />
              </svg>
            </div>
            <div className="arka-balon arka-balon-2">
              <small>Nakit</small>
              <div className="mini-halka-grafik">
                <span>68%</span>
              </div>
            </div>
            <div className="arka-balon arka-balon-3">
              <small>Sipariş</small>
              <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                <path d="M8 34 L25 22 L42 27 L60 16 L78 12 L92 19" className="cizgi-a" />
                <path d="M8 41 L25 39 L42 29 L60 33 L78 23 L92 26" className="cizgi-b" />
                <path d="M8 48 L25 46 L42 44 L60 40 L78 43 L92 38" className="cizgi-c" />
              </svg>
            </div>
            <div className="arka-balon arka-balon-4">
              <small>Envanter</small>
              <div className="mini-liste-grafik">
                <span style={{ width: '62%' }} />
                <span style={{ width: '48%' }} />
                <span style={{ width: '71%' }} />
              </div>
            </div>
            <div className="arka-balon arka-balon-5">
              <small>Trend</small>
              <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                <path d="M8 38 L25 20 L42 31 L60 26 L78 9 L92 18" className="cizgi-a" />
                <path d="M8 44 L25 37 L42 34 L60 20 L78 29 L92 24" className="cizgi-b" />
                <path d="M8 50 L25 45 L42 46 L60 42 L78 38 L92 41" className="cizgi-c" />
              </svg>
            </div>
            <div className="arka-balon arka-balon-6">
              <small>Gelir</small>
              <div className="mini-karsilastirma">
                <span style={{ height: '48%' }} />
                <span style={{ height: '72%' }} />
              </div>
            </div>
            <div className="arka-balon arka-balon-7">
              <small>Sevkiyat</small>
              <svg viewBox="0 0 100 58" className="mini-coklu-cizgi-grafik">
                <path d="M8 42 L25 33 L42 19 L60 25 L78 17 L92 12" className="cizgi-a" />
                <path d="M8 47 L25 40 L42 35 L60 28 L78 24 L92 30" className="cizgi-b" />
                <path d="M8 49 L25 46 L42 43 L60 45 L78 39 L92 36" className="cizgi-c" />
              </svg>
            </div>
            <div className="arka-balon arka-balon-8">
              <small>Stok</small>
              <div className="mini-liste-grafik">
                <span style={{ width: '70%' }} />
                <span style={{ width: '56%' }} />
                <span style={{ width: '64%' }} />
              </div>
            </div>
            <div className="arka-balon arka-balon-9">
              <small>Günlük Satış</small>
              <div className="mini-cubuk-grafik">
                <span style={{ height: '42%' }} />
                <span style={{ height: '56%' }} />
                <span style={{ height: '34%' }} />
                <span style={{ height: '68%' }} />
                <span style={{ height: '48%' }} />
                <span style={{ height: '74%' }} />
              </div>
            </div>
            <div className="arka-balon arka-balon-10">
              <small>Stok Hızı</small>
              <div className="mini-cubuk-grafik">
                <span style={{ height: '28%' }} />
                <span style={{ height: '62%' }} />
                <span style={{ height: '52%' }} />
                <span style={{ height: '78%' }} />
                <span style={{ height: '39%' }} />
                <span style={{ height: '58%' }} />
              </div>
            </div>
            <div className="arka-balon arka-balon-11">
              <small>Aylık Hacim</small>
              <div className="mini-cubuk-grafik">
                <span style={{ height: '46%' }} />
                <span style={{ height: '36%' }} />
                <span style={{ height: '64%' }} />
                <span style={{ height: '72%' }} />
                <span style={{ height: '54%' }} />
                <span style={{ height: '60%' }} />
              </div>
            </div>
          </div>

          <div className="merkez-cember dis-cember" />
          <div className="merkez-cember ic-cember" />

          <div className="merkez-baslik-karti">
            <p>Yönetim Merkezi</p>
            <h1>Stok Takip Sistemi</h1>
            <span>Bir modül seçerek devam edin</span>
          </div>

          {merkezMenusu.map((kart, index) => (
            <button
              key={kart.sayfa}
              type="button"
              data-testid={`home-${kart.sayfa}`}
              className={`merkez-balon renk-${kart.renk} balon-${index + 1} ${gecisBalonu === kart.sayfa ? 'giriliyor' : ''}`}
              onClick={() => merkezdenSayfayaGit(kart.sayfa)}
            >
              <div className="merkez-balon-icerik">
                <SayfaIkonu sayfa={kart.sayfa} className="menu-ikon merkez-ikon-svg" />
                <span>{kart.baslik}</span>
                <small>{kart.aciklama}</small>
              </div>
            </button>
          ))}

          <button type="button" className="merkez-cikis-buton" onClick={onLogout} aria-label="Çıkış yap">
            <span className="merkez-cikis-ikon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
                <path d="M10 12h10" />
                <path d="m17 7 5 5-5 5" />
              </svg>
            </span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </section>
    </>
  )
}
