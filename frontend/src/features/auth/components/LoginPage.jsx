import LoginForm from './LoginForm'
import { SayfaIkonu } from '../../../components/common/Ikonlar'

export default function LoginPage({ auth, merkezMenusu }) {
  return (
    <main className="login-page">
      <div className={`login-balon-sahnesi ${auth.loginGecisiAktif ? 'aktif' : ''}`} aria-hidden="true">
        {merkezMenusu.map((kart, index) => (
          <div key={`login-${kart.sayfa}`} className={`login-balon renk-${kart.renk} login-balon-${index + 1}`}>
            <div className="login-balon-icerik">
              <SayfaIkonu sayfa={kart.sayfa} className="login-balon-ikon" />
              <span>{kart.baslik}</span>
              <small>{kart.aciklama}</small>
            </div>
          </div>
        ))}
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
          <div className="visual-wrap">
            <div className="chart-card">
              <div className="chart-header">
                <span>Analiz</span>
                <small>Haftalık</small>
              </div>
              <div className="chart-lines">
                <span className="line one" />
                <span className="line two" />
                <span className="line three" />
              </div>
            </div>

            <div className="stats-card">
              <div className="donut" />
              <p>Toplam</p>
              <strong>%42</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
