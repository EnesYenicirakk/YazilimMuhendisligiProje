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
  setAiMesajMetni,
  setAiHizliKonularAcik,
  setAiPanelKucuk,
  setAiTemaMenuAcik,
}) {
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
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8.3" r="4.1" />
              <path d="M4.9 19.8a7.9 7.9 0 0 1 14.2 0c-1.7 1.4-4.3 2.2-7.1 2.2s-5.4-.8-7.1-2.2Z" />
            </svg>
          </div>
          <div>
            <strong>Kişisel Asistanınız</strong>
            <small>Her zaman yanınızda</small>
          </div>
        </div>

        <div className="ai-panel-aksiyonlar">
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

      <div className="ai-mesajlar">
        {aiMesajlar.map((mesaj, index) => (
          <article key={mesaj.id} className={`ai-mesaj ai-mesaj-${mesaj.rol}`}>
            <p>{mesaj.metin}</p>
            {index === 0 && mesaj.rol === 'bot' && aiHizliKonularAcik && (
              <div className="ai-hizli-konular">
                {aiHizliKonular.map((konu) => (
                  <button
                    key={konu.etiket}
                    type="button"
                    className="ai-hizli-konu"
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
            <span>{mesaj.saat}</span>
          </article>
        ))}
      </div>

      <div className="ai-giris-alani">
        <input
          type="text"
          value={aiMesajMetni}
          onChange={(event) => setAiMesajMetni(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') aiMesajGonder()
          }}
          placeholder="Mesaj yaz..."
        />
        <button type="button" className="ai-gonder-buton" onClick={() => aiMesajGonder()}>
          <KucukIkon tip="gonder" />
        </button>
      </div>
    </section>
  )
}
