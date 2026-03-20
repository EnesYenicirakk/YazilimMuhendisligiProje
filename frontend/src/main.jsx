import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './core/contexts/ToastContext.jsx'

class UygulamaHataSiniri extends Component {
  constructor(props) {
    super(props)
    this.state = { hata: null }
  }

  static getDerivedStateFromError(hata) {
    return { hata }
  }

  componentDidCatch(hata, bilgi) {
    console.error('React render hatası:', hata, bilgi)
  }

  render() {
    if (this.state.hata) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f3f7fc', color: '#1f3044' }}>
          <section style={{ width: 'min(720px, 100%)', background: '#fff', border: '1px solid #dce7f4', borderRadius: 20, padding: 24, boxShadow: '0 20px 50px rgba(31,48,68,0.08)' }}>
            <h1 style={{ margin: '0 0 12px', fontSize: 28 }}>Uygulama başlatılırken bir hata oluştu</h1>
            <p style={{ margin: '0 0 16px', lineHeight: 1.6 }}>
              Bu beyaz ekranın yerine gerçek hata bilgisini gösteriyoruz ki sorunu hızlıca kapatabilelim.
            </p>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 14, lineHeight: 1.5, background: '#f8fbff', border: '1px solid #dce7f4', borderRadius: 14, padding: 16 }}>
              {String(this.state.hata.stack || this.state.hata.message || this.state.hata)}
            </pre>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UygulamaHataSiniri>
      <ToastProvider>
        <App />
      </ToastProvider>
    </UygulamaHataSiniri>
  </StrictMode>,
)
