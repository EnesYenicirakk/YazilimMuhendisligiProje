import { useEffect, useRef } from 'react'

export default function AiPanel({
  KucukIkon,
  TemaIkonu,
  aiHizliKonular,
  aiHizliKonularAcik,
  aiMesajGonder,
  aiMesajMetni,
  aiMesajlar,
  aiPanelKapaniyor,
  aiPaneliKapat,
  aiTemaMenuAcik,
  aiYukleniyor,
  setAiMesajMetni,
  setAiHizliKonularAcik,
  setAiPanelKucuk,
  setAiTemaMenuAcik,
  sohbetiTemizle,
}) {
  const mesajlarRef = useRef(null)

  // Yeni mesaj geldiğinde otomatik aşağı kaydır
  useEffect(() => {
    if (mesajlarRef.current) {
      mesajlarRef.current.scrollTop = mesajlarRef.current.scrollHeight
    }
  }, [aiMesajlar])

  // Basit markdown benzeri formatlama (bold, satır sonu)
  const metniFormatla = (metin) => {
    if (!metin) return ''
    return metin
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
  }

  return (
    <section className={`ai-panel ai-tema-acik ${aiPanelKapaniyor ? 'kapaniyor' : 'aciliyor'}`}>
      <header className="ai-panel-ust">
        <div className="ai-panel-kontroller">
          <button
            type="button"
            className="ai-ikon-buton"
            aria-label="Tema menüsü"
            onClick={() => setAiTemaMenuAcik((onceki) => !onceki)}
          >
            <KucukIkon tip="ayar" />
          </button>
          {aiTemaMenuAcik && (
            <div className="ai-tema-menu">
              <button
                type="button"
                className="aktif"
                onClick={() => {
                  setAiTemaMenuAcik(false)
                }}
              >
                <TemaIkonu tema="acik" />
                <span>Açık Tema</span>
              </button>
            </div>
          )}
        </div>

        <div className="ai-panel-baslik">
          <div className="ai-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <strong>Nex</strong>
            <small>{aiYukleniyor ? 'Yanıt yazıyor...' : 'Çevrimiçi'}</small>
          </div>
        </div>

        <div className="ai-panel-aksiyonlar">
          <button
            type="button"
            className="ai-ikon-buton"
            aria-label="Sohbeti Temizle"
            title="Sohbeti Temizle"
            onClick={sohbetiTemizle}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <button
            type="button"
            className="ai-ikon-buton"
            aria-label="Alta al"
            onClick={() => {
              setAiPanelKucuk(true)
              setAiTemaMenuAcik(false)
            }}
          >
            -
          </button>
          <button
            type="button"
            className="ai-ikon-buton"
            aria-label="Kapat"
            onClick={aiPaneliKapat}
          >
            ×
          </button>
        </div>
      </header>

      <div className="ai-mesajlar" ref={mesajlarRef}>
        {aiMesajlar.map((mesaj, index) => (
          <article key={mesaj.id} className={`ai-mesaj ai-mesaj-${mesaj.rol}${mesaj.yukleniyor ? ' ai-mesaj-yukleniyor' : ''}`}>
            {mesaj.yukleniyor ? (
              <div className="ai-typing-indicator">
                <span className="ai-typing-dot" />
                <span className="ai-typing-dot" />
                <span className="ai-typing-dot" />
              </div>
            ) : (
              <p dangerouslySetInnerHTML={{ __html: metniFormatla(mesaj.metin) }} />
            )}
            {index === 0 && mesaj.rol === 'bot' && aiHizliKonularAcik && (
              <div className="ai-hizli-konular">
                {aiHizliKonular.map((konu) => (
                  <button
                    key={konu.etiket}
                    type="button"
                    className="ai-hizli-konu"
                    disabled={aiYukleniyor}
                    onClick={() => {
                      if (konu.etiket === 'Diğer') {
                        setAiHizliKonularAcik(false)
                        return
                      }
                      aiMesajGonder(konu.mesaj)
                    }}
                  >
                    {konu.etiket}
                  </button>
                ))}
              </div>
            )}
            {!mesaj.yukleniyor && mesaj.saat && <span>{mesaj.saat}</span>}
          </article>
        ))}
      </div>

      <div className="ai-giris-alani">
        <input
          type="text"
          value={aiMesajMetni}
          onChange={(event) => setAiMesajMetni(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !aiYukleniyor) aiMesajGonder()
          }}
          placeholder={aiYukleniyor ? 'Yanıt bekleniyor...' : 'Mesaj yaz...'}
          disabled={aiYukleniyor}
        />
        <button
          type="button"
          className="ai-gonder-buton"
          onClick={() => aiMesajGonder()}
          disabled={aiYukleniyor || !aiMesajMetni.trim()}
        >
          <KucukIkon tip="gonder" />
        </button>
      </div>
    </section>
  )
}
