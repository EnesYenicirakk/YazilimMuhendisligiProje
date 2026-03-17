export default function BildirimPaneli({
  KucukIkon,
  bildirimPanelKapaniyor,
  bildirimPaneliKapat,
  bildirimdenSayfayaGit,
  bildirimler,
  bildirimiOkunduYap,
  bildirimiOkunmadiYap,
  bildirimiTemizle,
  okunanBildirimler,
  tumBildirimleriTemizle,
}) {
  return (
    <section className={`bildirim-paneli ${bildirimPanelKapaniyor ? 'kapaniyor' : 'aciliyor'}`}>
      <header className="bildirim-panel-ust">
        <div>
          <strong>Bildirimler</strong>
          <small>Yakın zamanda gerçekleşen gelişmeler</small>
        </div>
        <div className="bildirim-panel-aksiyonlari">
          <button
            type="button"
            className="bildirim-hepsini-temizle"
            onClick={tumBildirimleriTemizle}
            disabled={bildirimler.length === 0}
          >
            Hepsini Temizle
          </button>
          <button type="button" className="bildirim-panel-kapat" onClick={bildirimPaneliKapat} aria-label="Bildirimleri Kapat">
            ×
          </button>
        </div>
      </header>

      <div className="bildirim-listesi">
        {bildirimler.length === 0 ? (
          <div className="bildirim-bos">
            <strong>Görüntülenecek bildirim kalmadı.</strong>
            <p>Yeni kritik stok, satış veya stok hareketleri burada belirecek.</p>
          </div>
        ) : (
          bildirimler.map((bildirim) => {
            const okundu = okunanBildirimler.includes(bildirim.id)

            return (
              <article
                key={bildirim.id}
                className={`bildirim-oge ${bildirim.tur} ${okundu ? 'okundu' : 'okunmadi'}`}
                onClick={() => bildirimdenSayfayaGit(bildirim)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    bildirimdenSayfayaGit(bildirim)
                  }
                }}
              >
                <span className="bildirim-ikon" aria-hidden="true">
                  <KucukIkon
                    tip={
                      bildirim.tur === 'kritik'
                        ? 'bildirim-kritik'
                        : bildirim.tur === 'stok'
                          ? 'bildirim-stok'
                          : bildirim.tur === 'tahsilat'
                            ? 'bildirim-tahsilat'
                            : 'bildirim-satis'
                    }
                  />
                </span>
                <div className="bildirim-icerik">
                  <div className="bildirim-etiket-satiri">
                    <strong>{bildirim.baslik}</strong>
                    <span className={`bildirim-durum-rozeti ${okundu ? 'okundu' : 'okunmadi'}`}>
                      {okundu ? 'Okundu' : 'Yeni'}
                    </span>
                  </div>
                  <p>{bildirim.detay}</p>
                  <div className="bildirim-alt-satir">
                    <small>{bildirim.zaman}</small>
                    <div className="bildirim-kart-aksiyonlari">
                      <button
                        type="button"
                        className="bildirim-mini-buton"
                        onClick={(event) => {
                          event.stopPropagation()
                          okundu ? bildirimiOkunmadiYap(bildirim.id) : bildirimiOkunduYap(bildirim.id)
                        }}
                      >
                        {okundu ? 'Okunmadı Yap' : 'Okundu Yap'}
                      </button>
                      <button
                        type="button"
                        className="bildirim-mini-buton vurgulu"
                        onClick={(event) => {
                          event.stopPropagation()
                          bildirimiTemizle(bildirim.id)
                        }}
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
