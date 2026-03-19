import InvoicePreview from './features/invoices/components/InvoicePreview';
export default function FaturaModallari({
  faturaDetayAcik,
  faturaOnizleme,
  faturayiPdfIndir,
  faturayiYazdir,
  paraFormatla,
  pdfOnizlemeAcik,
  seciliFatura,
  setFaturaDetayAcik,
  setPdfOnizlemeAcik,
  tarihFormatla,
}) {
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

      {pdfOnizlemeAcik && (
        <div className="modal-kaplama">
          <div className="modal-kutu buyuk fatura-modal">
            <div className="fatura-modal-ust">
              <div>
                <h3>PDF Önizleme</h3>
                <p>{(seciliFatura ?? faturaOnizleme).faturaNo} için yazdırılabilir görünüm hazır.</p>
              </div>
              <span className="stok-log-rozet">PDF Önizleme</span>
            </div>

            <div className="fatura-detay-belgesi">
              <InvoicePreview fatura={seciliFatura ?? faturaOnizleme} paraFormatla={paraFormatla} tarihFormatla={tarihFormatla} />
            </div>

            <div className="modal-aksiyon">
              <button type="button" className="ikinci" onClick={() => faturayiPdfIndir(seciliFatura ?? faturaOnizleme)}>PDF İndir</button>
              <button type="button" className="ikinci" onClick={() => faturayiYazdir(seciliFatura ?? faturaOnizleme)}>Yazdır</button>
              <button type="button" onClick={() => setPdfOnizlemeAcik(false)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
