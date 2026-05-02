import LoginForm from './LoginForm'
import { SayfaIkonu } from '../../../components/common/Ikonlar'
import { merkezMenuPozisyonlari } from '../../../shared/utils/constantsAndHelpers'

export default function LoginPage({ auth, merkezMenusu }) {
  return (
    <main className="login-page">
      <div className={`login-balon-sahnesi ${auth.loginGecisiAktif ? 'aktif' : ''}`} aria-hidden="true">
        <div className="login-balon-orbit">
          {merkezMenusu.map((kart, index) => {
            const pozisyon = merkezMenuPozisyonlari[index] ?? { x: 0, y: 0 }

            return (
              <div
                key={`login-${kart.sayfa}`}
                className={`login-balon renk-${kart.renk}`}
                style={{
                  '--menu-x': pozisyon.x,
                  '--menu-y': pozisyon.y,
                  '--menu-index': index,
                }}
              >
                <div className="login-balon-icerik">
                  <SayfaIkonu sayfa={kart.sayfa} className="login-balon-ikon" />
                  <span>{kart.baslik}</span>
                  <small>{kart.aciklama}</small>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {auth.loginGecisiAktif && (
        <div className="login-gecis-mercek" aria-hidden="true">
          <div className="login-gecis-flash" />
          <div className="login-gecis-isik" />
          <span className="login-gecis-ripple ripple-bir" />
          <span className="login-gecis-ripple ripple-iki" />
          <img
            src="/ytu-logo.png"
            alt=""
            className="login-gecis-logo"
            onAnimationEnd={auth.completeLoginTransition}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = '/ytu-logo.svg'
            }}
          />
        </div>
      )}

      <section className={`login-shell ${auth.loginGecisiAktif ? 'gecis-aktif' : ''}`} aria-label="Giriş Ekranı">
        <LoginForm
          username={auth.username}
          password={auth.password}
          error={auth.error}
          isSubmitting={auth.loginGecisiAktif}
          onUsernameChange={auth.setUsername}
          onPasswordChange={auth.setPassword}
          onSubmit={auth.handleLogin}
        />

        <div className="panel right-panel" aria-hidden="true">
          <div className="login-hero-scene">
            <span className="hero-halka halka-buyuk" />
            <span className="hero-halka halka-kucuk" />
            <span className="hero-dot-grid dot-grid-ust" />
            <span className="hero-dot-grid dot-grid-alt" />

            <div className="hero-mini-kart hero-mini-analiz">
              <div className="hero-mini-baslik">Haftalık Analiz</div>
              <div className="hero-mini-cubuklar">
                <span className="mini-cubuk cubuk-bir" />
                <span className="mini-cubuk cubuk-iki" />
                <span className="mini-cubuk cubuk-uc" />
                <span className="mini-cubuk cubuk-dort" />
              </div>
              <div className="hero-mini-satirlar">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="hero-mini-kart hero-mini-stok">
              <div className="hero-mini-donut-wrap">
                <div className="hero-mini-donut" />
                <div className="hero-mini-stok-metin">
                  <div className="hero-mini-baslik">Stok Doluluk Oranı</div>
                  <strong>%72</strong>
                  <small>Toplam Stok</small>
                </div>
              </div>
            </div>

            <div className="hero-card hero-analiz-karti">
              <div className="hero-card-ust">
                <span>Analiz</span>
                <small>Haftalık</small>
              </div>
              <div className="hero-cizgi-grafik">
                <span className="hero-dikey-cizgi" />
                <span className="hero-dikey-cizgi" />
                <span className="hero-dikey-cizgi" />
                <span className="hero-dikey-cizgi" />
                <svg viewBox="0 0 220 88" className="hero-cizgi-svg" aria-hidden="true">
                  <path d="M8 56C26 54 37 48 53 45C67 42 79 27 97 29C114 31 121 45 138 42C155 39 164 24 182 27C197 30 205 20 214 22" />
                </svg>
                <div className="hero-gunler">
                  <span>Pzt</span>
                  <span>Sal</span>
                  <span>Çar</span>
                  <span>Per</span>
                  <span>Cum</span>
                  <span>Cmt</span>
                  <span>Paz</span>
                </div>
              </div>
            </div>

            <div className="hero-card hero-stok-karti">
              <div className="hero-donut">
                <div className="hero-donut-ic" />
              </div>
              <div className="hero-stok-bilgisi">
                <small>Stok Durumu</small>
                <strong>%42</strong>
                <span>Mevcut stok</span>
              </div>
            </div>

            <div className="hero-depo-sahnesi">
              <div className="hero-arka-raf hero-arka-raf-sol" />
              <div className="hero-arka-raf hero-arka-raf-orta" />

              <div className="hero-forklift">
                <div className="hero-forklift-kabin" />
                <div className="hero-forklift-govde" />
                <div className="hero-forklift-mast" />
                <div className="hero-forklift-catal-sol" />
                <div className="hero-forklift-catal-sag" />
                <span className="hero-teker teker-sol" />
                <span className="hero-teker teker-sag" />
              </div>

              <div className="hero-palet hero-palet-sol">
                <span className="hero-kutu" />
                <span className="hero-kutu" />
                <span className="hero-kutu" />
                <span className="hero-kutu" />
              </div>

              <div className="hero-raf">
                <div className="hero-raf-kolon kolon-sol" />
                <div className="hero-raf-kolon kolon-sag" />
                <div className="hero-raf-capraz capraz-bir" />
                <div className="hero-raf-capraz capraz-iki" />
                <div className="hero-raf-capraz capraz-uc" />
                <div className="hero-raf-kat kat-bir">
                  <span className="hero-kutu" />
                  <span className="hero-kutu" />
                  <span className="hero-kutu" />
                </div>
                <div className="hero-raf-kat kat-iki">
                  <span className="hero-kutu" />
                  <span className="hero-kutu" />
                  <span className="hero-kutu" />
                </div>
                <div className="hero-raf-kat kat-uc">
                  <span className="hero-kutu" />
                  <span className="hero-kutu" />
                  <span className="hero-kutu" />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-metin">
            <h2>Stok yönetimini sadeleştirin</h2>
            <p>Sanayi parçalarını tek ekrandan yönetin, stok seviyelerini hızlı takip edin.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
