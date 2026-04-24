const tarihFormatla = (isoTarih) => {
  if (!isoTarih) return '—'
  const tarih = new Date(isoTarih)
  if (Number.isNaN(tarih.getTime())) return '—'
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tarih)
}

export { tarihFormatla }
