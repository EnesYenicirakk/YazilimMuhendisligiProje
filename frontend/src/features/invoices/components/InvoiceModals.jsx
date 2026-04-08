import InvoicePreview from './InvoicePreview'

export default function InvoiceModals({ invoicesData, paraFormatla, tarihFormatla }) {
  const {
    faturaDetayAcik,
    faturaOnizleme,
    faturayiPdfIndir,
    faturayiYazdir,
    pdfOnizlemeAcik,
    seciliFatura,
    setFaturaDetayAcik,
    setPdfOnizlemeAcik,
  } = invoicesData

  const onizlemeFaturasi = seciliFatura ?? faturaOnizleme

  return (
    <>
      {faturaDetayAcik && seciliFatura && (
        <div className="modal-kaplama">
          <div className="modal-kutu buyuk fatura-modal">
            <div className="fatura-modal-ust">
              <div>
                <h3>{seciliFatura.faturaNo}</h3>
                <p>{seciliFatura.karsiTarafAdi} için oluşturulan {seciliFatura.tur.toLocaleLowerCase('tr-TR')}.</p>
              </div>
              <span className="stok-log-rozet">{seciliFatura.durum}</span>
            </div>

            <div className="fatura-detay-belgesi">
              <InvoicePreview fatura={seciliFatura} paraFormatla={paraFormatla} tarihFormatla={tarihFormatla} />
            </div>

            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => faturayiPdfIndir(seciliFatura)}>PDF İndir</button>
              <button type="button" className="ikinci" onClick={() => faturayiYazdir(seciliFatura)}>Yazdır</button>
              <button type="button" onClick={() => setFaturaDetayAcik(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {pdfOnizlemeAcik && onizlemeFaturasi && (
        <div className="modal-kaplama">
          <div className="modal-kutu buyuk fatura-modal">
            <div className="fatura-modal-ust">
              <div>
                <h3>PDF Önizleme</h3>
                <p>{onizlemeFaturasi.faturaNo} için yazdırılabilir görünüm hazır.</p>
              </div>
              <span className="stok-log-rozet">PDF Önizleme</span>
            </div>

            <div className="fatura-detay-belgesi">
              <InvoicePreview fatura={onizlemeFaturasi} paraFormatla={paraFormatla} tarihFormatla={tarihFormatla} />
            </div>

            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => faturayiPdfIndir(onizlemeFaturasi)}>PDF İndir</button>
              <button type="button" className="ikinci" onClick={() => faturayiYazdir(onizlemeFaturasi)}>Yazdır</button>
              <button type="button" onClick={() => setPdfOnizlemeAcik(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
