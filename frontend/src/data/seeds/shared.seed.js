const tarihFormatla = (isoTarih) => {
  const tarih = new Date(isoTarih)
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(tarih)
}

export { tarihFormatla }
