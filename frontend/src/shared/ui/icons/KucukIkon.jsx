function KucukIkon({ tip }) {
  if (tip === 'favori') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="m12 3.7 2.57 5.22 5.76.84-4.16 4.05.98 5.72L12 16.8 6.85 19.53l.98-5.72-4.16-4.05 5.76-.84L12 3.7Z" />
      </svg>
    )
  }

  if (tip === 'otomatik-tedarik') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 7 4v5c0 4.4-2.9 7.9-7 9-4.1-1.1-7-4.6-7-9V7l7-4Z" />
        <path d="M9 12h4" />
        <path d="m11 10 2 2-2 2" />
      </svg>
    )
  }

  if (tip === 'not') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3h8l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M16 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    )
  }

  if (tip === 'duzenle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17.25V21h3.75L18.8 8.94l-3.75-3.75L3 17.25Z" />
        <path d="m14.95 5.19 3.75 3.75" />
      </svg>
    )
  }

  if (tip === 'sil') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
        <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      </svg>
    )
  }

  if (tip === 'detay') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    )
  }

  if (tip === 'telefon') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72l.39 2.56a2 2 0 0 1-.57 1.72L7.1 9.83a16 16 0 0 0 7.07 7.07l1.83-1.83a2 2 0 0 1 1.72-.57l2.56.39A2 2 0 0 1 22 16.92Z" />
      </svg>
    )
  }

  if (tip === 'durum') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    )
  }

  if (tip === 'fabrika') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21V9l7 4V9l7 4V5l4 2v14H3Z" />
        <path d="M7 21v-4" />
        <path d="M11 21v-4" />
        <path d="M15 21v-4" />
      </svg>
    )
  }

  if (tip === 'musteri-ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="10" cy="8" r="3.5" />
        <path d="M4.5 19a6 6 0 0 1 11 0" />
        <path d="M18 8v6" />
        <path d="M15 11h6" />
      </svg>
    )
  }

  if (tip === 'siparis-ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="17" cy="19" r="1.5" />
        <path d="M3 4h2l2.2 9.2a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L19 8H7.2" />
        <path d="M18 3v4" />
        <path d="M16 5h4" />
      </svg>
    )
  }

  if (tip === 'urun-ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="M12 12l8-4.5" />
        <path d="M12 21v-9" />
        <path d="M18 3v4" />
        <path d="M16 5h4" />
      </svg>
    )
  }

  if (tip === 'ekle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    )
  }

  if (tip === 'liste') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'kutu') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="M12 12l8-4.5" />
        <path d="M12 21v-9" />
      </svg>
    )
  }

  if (tip === 'cuzdan') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
        <path d="M4 9h13.5A2.5 2.5 0 0 1 20 11.5v1A2.5 2.5 0 0 1 17.5 15H4" />
        <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'saat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </svg>
    )
  }

  if (tip === 'menu') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="12" cy="19" r="1.8" />
      </svg>
    )
  }

  if (tip === 'basari') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m7 12 3 3 7-7" />
      </svg>
    )
  }

  if (tip === 'uyari') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 7v6" />
        <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'bildirim-kritik') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 21 19H3L12 3Z" />
        <path d="M12 9v4" />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'bildirim-stok') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="M12 12l8-4.5" />
      </svg>
    )
  }

  if (tip === 'bildirim-tahsilat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
        <path d="M4 9h13.5A2.5 2.5 0 0 1 20 11.5v1A2.5 2.5 0 0 1 17.5 15H4" />
        <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (tip === 'bildirim-satis') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 18h16" />
        <path d="M7 15V9" />
        <path d="M12 15V6" />
        <path d="M17 15v-3" />
      </svg>
    )
  }

  if (tip === 'ayar') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="12" cy="19" r="1.8" />
      </svg>
    )
  }

  if (tip === 'gonder') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 20 21 12 3 4l3 8-3 8Z" />
        <path d="M6 12h8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
    </svg>
  )
}

export { KucukIkon }
