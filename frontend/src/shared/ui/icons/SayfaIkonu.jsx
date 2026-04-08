function SayfaIkonu({ sayfa, className = 'menu-ikon' }) {
  if (sayfa === 'dashboard') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="7" height="7" rx="1.2" />
          <rect x="13" y="4" width="7" height="5" rx="1.2" />
          <rect x="4" y="13" width="7" height="7" rx="1.2" />
          <rect x="13" y="11" width="7" height="9" rx="1.2" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'envanter') {
    return (
      <span className={`${className} menu-ikon-envanter`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6.5" y="5.8" width="11" height="14.7" rx="1.8" />
          <path d="M9 4.8h6v2.1H9z" />
          <path d="M9.3 10h5.5M9.3 13h5.5M9.3 16h4.2" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'musteriler') {
    return (
      <span className={`${className} menu-ikon-telefon`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4.5h5l1.2 3.3-2.3 1.4a13.1 13.1 0 0 0 5.9 5.9l1.4-2.3L19.5 14v5a2 2 0 0 1-2.1 2A16.7 16.7 0 0 1 3 6.6 2 2 0 0 1 5 4.5z" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'alicilar') {
    return (
      <span className={`${className} menu-ikon-telefon2`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="2.8" width="10" height="18.5" rx="2.2" />
          <circle cx="12" cy="17.2" r="1" />
          <path d="M10 5.8h4" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'odemeler') {
    return (
      <span className={`${className} menu-ikon-cuzdan`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="5" width="17" height="14" rx="2.5" />
          <path d="M19.5 9h2a1.5 1.5 0 0 1 0 6h-2" />
          <circle cx="16" cy="12" r="1.1" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'siparisler') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7.5h12M6 12h12M6 16.5h12" />
          <circle cx="4" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="4" cy="12" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="4" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'urun-duzenleme') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l4.2-1 9-9a2 2 0 0 0-2.8-2.8l-9 9L4 20z" />
          <path d="M13 6l5 5" />
        </svg>
      </span>
    )
  }

  if (sayfa === 'faturalama') {
    return (
      <span className={className} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3.5h8l3 3V20l-2-1.2L14 20l-2-1.2L10 20l-2-1.2L6 20V5a1.5 1.5 0 0 1 1-1.5z" />
          <path d="M9 10h6M9 13.5h6M9 17h4" />
        </svg>
      </span>
    )
  }

  return <span className={className} aria-hidden="true">•</span>
}

export { SayfaIkonu }

