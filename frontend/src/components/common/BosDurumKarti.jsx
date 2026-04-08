function BosDurumKarti({
  baslik,
  aciklama,
  eylemMetni,
  onEylem,
}) {
  return (
    <div className="bos-durum-karti" role="status" aria-live="polite">
      <div className="bos-durum-ikon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
          <path d="M8.8 11h4.4" />
        </svg>
      </div>
      <div className="bos-durum-metin">
        <strong>{baslik}</strong>
        <p>{aciklama}</p>
      </div>
      {eylemMetni && onEylem && (
        <button type="button" className="bos-durum-buton" onClick={onEylem}>
          {eylemMetni}
        </button>
      )}
    </div>
  )
}

export default BosDurumKarti
