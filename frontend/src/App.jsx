import { useState } from 'react'
import './App.css'

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'admin123'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (username.trim() === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      setIsLoggedIn(true)
      setError('')
      return
    }

    setIsLoggedIn(false)
    setError('Kullanici adi veya sifre hatali.')
  }

  return (
    <main className="login-page">
      <div className="background-shape shape-one" />
      <div className="background-shape shape-two" />

      <section className="login-card" aria-label="Giris Formu">
        <p className="brand">Stok Takip</p>
        <h1>Hos geldiniz</h1>
        <p className="subtitle">Devam etmek icin giris yapin.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Kullanici adi</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Kullanici adinizi girin"
            autoComplete="username"
          />

          <label htmlFor="password">Sifre</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sifrenizi girin"
            autoComplete="current-password"
          />

          <button type="submit">Giris yap</button>
        </form>

        {error && <p className="message error">{error}</p>}
        {isLoggedIn && <p className="message success">Giris basarili. Hos geldiniz, admin.</p>}
      </section>
    </main>
  )
}

export default App
