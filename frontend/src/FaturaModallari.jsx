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
              <div className="fatura-onizleme-ust">
                <div>
                  <img
                    src="/ytu-logo.png"
                    alt="MTÜ Sanayi logosu"
                    className="fatura-sirket-rozet"
                    onError={(event) => {
                      event.currentTarget.src = '/ytu-logo.svg'
                    }}
                  />
                  <h2>MTÜ Sanayi</h2>
                  <p>Malatya Yeşilyurt, Ankara Yolu 5. Km No:42</p>
                  <p>Vergi No: 4481237781</p>
                </div>
                <div className="fatura-durum-kutu">
                  <span className="panel-bilgi-rozet">{seciliFatura.tur}</span>
                  <strong>{seciliFatura.faturaNo}</strong>
                </div>
              </div>

              <div className="fatura-onizleme-bilgi">
                <div>
                  <small>{seciliFatura.tur === 'Satış Faturası' ? 'Müşteri' : 'Tedarikçi'}</small>
                  <strong>{seciliFatura.karsiTarafAdi}</strong>
                </div>
                <div>
                  <small>Tarih</small>
                  <strong>{tarihFormatla(seciliFatura.tarih)}</strong>
                </div>
                <div>
                  <small>Ödeme Tarihi</small>
                  <strong>{tarihFormatla(seciliFatura.odemeTarihi)}</strong>
                </div>
              </div>

              <div className="fatura-onizleme-govde">
                <h3>Ürünler</h3>
                <div className="fatura-onizleme-satirlar">
                  {seciliFatura.satirlar.map((satir) => (
                    <div key={`detay-fatura-${seciliFatura.id}-${satir.id}`} className="fatura-onizleme-satir">
                      <div>
                        <strong>{satir.urun}</strong>
                        <span>{satir.miktar} x {paraFormatla(satir.birimFiyat)}</span>
                      </div>
                      <strong>{paraFormatla(Number(satir.miktar) * Number(satir.birimFiyat))}</strong>
                    </div>
                  ))}
                </div>

                <div className="fatura-toplamlar">
                  <div><span>Ara Toplam</span><strong>{paraFormatla(seciliFatura.araToplam)}</strong></div>
                  <div><span>KDV</span><strong>{paraFormatla(seciliFatura.kdv)}</strong></div>
                  <div className="genel-toplam"><span>Toplam</span><strong>{paraFormatla(seciliFatura.toplam)}</strong></div>
                </div>

                <div className="fatura-belge-alt">
                  <div className="fatura-belge-not">{seciliFatura.not || 'Standart ödeme ve teslimat koşulları geçerlidir.'}</div>
                  <img
                    src="/gib-logo.png"
                    alt="Gelir İdaresi Başkanlığı mührü"
                    className="fatura-gib-rozet"
                    onError={(event) => {
                      event.currentTarget.src = '/gib-logo.svg'
                    }}
                  />
                </div>
              </div>
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
              <div className="fatura-onizleme-ust">
                <div>
                  <img
                    src="/ytu-logo.png"
                    alt="MTÜ Sanayi logosu"
                    className="fatura-sirket-rozet"
                    onError={(event) => {
                      event.currentTarget.src = '/ytu-logo.svg'
                    }}
                  />
                  <h2>MTÜ Sanayi</h2>
                  <p>Malatya Yeşilyurt, Ankara Yolu 5. Km No:42</p>
                  <p>Vergi No: 4481237781</p>
                </div>
                <div className="fatura-durum-kutu">
                  <span className="panel-bilgi-rozet">{(seciliFatura ?? faturaOnizleme).tur}</span>
                  <strong>{(seciliFatura ?? faturaOnizleme).faturaNo}</strong>
                </div>
              </div>

              <div className="fatura-onizleme-bilgi">
                <div>
                  <small>{(seciliFatura ?? faturaOnizleme).tur === 'Satış Faturası' ? 'Müşteri' : 'Tedarikçi'}</small>
                  <strong>{(seciliFatura ?? faturaOnizleme).karsiTarafAdi}</strong>
                </div>
                <div>
                  <small>Tarih</small>
                  <strong>{tarihFormatla((seciliFatura ?? faturaOnizleme).tarih)}</strong>
                </div>
                <div>
                  <small>Ödeme Tarihi</small>
                  <strong>{tarihFormatla((seciliFatura ?? faturaOnizleme).odemeTarihi)}</strong>
                </div>
              </div>

              <div className="fatura-onizleme-govde">
                <h3>Ürünler</h3>
                <div className="fatura-onizleme-satirlar">
                  {(seciliFatura ?? faturaOnizleme).satirlar.map((satir) => (
                    <div key={`pdf-onizleme-${satir.id}`} className="fatura-onizleme-satir">
                      <div>
                        <strong>{satir.urun}</strong>
                        <span>{satir.miktar} x {paraFormatla(satir.birimFiyat)}</span>
                      </div>
                      <strong>{paraFormatla(Number(satir.miktar) * Number(satir.birimFiyat))}</strong>
                    </div>
                  ))}
                </div>

                <div className="fatura-toplamlar">
                  <div><span>Ara Toplam</span><strong>{paraFormatla((seciliFatura ?? faturaOnizleme).araToplam)}</strong></div>
                  <div><span>KDV</span><strong>{paraFormatla((seciliFatura ?? faturaOnizleme).kdv)}</strong></div>
                  <div className="genel-toplam"><span>Toplam</span><strong>{paraFormatla((seciliFatura ?? faturaOnizleme).toplam)}</strong></div>
                </div>

                <div className="fatura-belge-alt">
                  <div className="fatura-belge-not">{(seciliFatura ?? faturaOnizleme).not || 'Standart ödeme ve teslimat koşulları geçerlidir.'}</div>
                  <img
                    src="/gib-logo.png"
                    alt="Gelir İdaresi Başkanlığı mührü"
                    className="fatura-gib-rozet"
                    onError={(event) => {
                      event.currentTarget.src = '/gib-logo.svg'
                    }}
                  />
                </div>
              </div>
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
