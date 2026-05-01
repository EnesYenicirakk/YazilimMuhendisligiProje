import { useState } from 'react'

export default function LoginForm({
  username,
  password,
  error,
  isSubmitting,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  logoSrc = '/ytu-logo.png',
  fallbackLogoSrc = '/ytu-logo.svg',
}) {
  const [sifreGorunur, setSifreGorunur] = useState(false)

  return (
    <section className="panel left-panel">
      <img
        src={logoSrc}
        alt="MTÜ Sanayi logosu"
        className="sayfa-logo login-logo"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = fallbackLogoSrc
        }}
      />
      <h1>Giriş Yap</h1>
      <p className="subtitle">Envanter paneline erişmek için bilgilerinizi girin.</p>

      <form onSubmit={onSubmit} className="login-form" data-testid="login-form">
        <label htmlFor="username">Kullanıcı adı</label>
        <input
          id="username"
          data-testid="login-username"
          type="text"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          placeholder="Kullanıcı adınızı girin"
          autoComplete="username"
        />

        <label htmlFor="password">Şifre</label>
        <div className="sifre-alani">
          <input
            id="password"
            data-testid="login-password"
            type={sifreGorunur ? 'text' : 'password'}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Şifrenizi girin"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="sifre-goster-buton"
            onClick={() => setSifreGorunur((onceki) => !onceki)}
            aria-label={sifreGorunur ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {sifreGorunur ? 'Gizle' : 'Göster'}
          </button>
        </div>

        <button type="submit" className="login-giris-buton" data-testid="login-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Yönlendiriliyor...' : 'Giriş yap'}
        </button>
      </form>

      {error && <p className="message error" data-testid="login-error">{error}</p>}
    </section>
  )
}

