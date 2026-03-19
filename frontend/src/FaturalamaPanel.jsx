import InvoicePreview from './features/invoices/components/InvoicePreview';
export default function FaturalamaPanel({
  KucukIkon,
  faturalar,
  faturaArama,
  faturaDetayAc,
  faturaFormu,
  faturaFormuGuncelle,
  faturaKarsiTarafDegistir,
  faturaKarsiTaraflar,
  faturaKaydet,
  faturaOnizleme,
  faturaPdfOnizlemeAc,
  faturaSatiriEkle,
  faturaSatiriGuncelle,
  faturaSatiriSil,
  faturaSekmesi,
  faturaTuruDegistir,
  faturayiPdfIndir,
  faturayiYazdir,
  filtreliFaturalar,
  paraFormatla,
  setFaturaArama,
  setFaturaSekmesi,
  tarihFormatla,
  urunler,
}) {
  return (
    <section>
      <header className="ust-baslik siparisler-baslik">
        <div>
          <h1>Faturalama (PDF)</h1>
          <p>Canlı fatura oluşturun, geçmiş faturaları görüntüleyin ve yazdırılabilir PDF önizlemesi alın.</p>
        </div>
      </header>

      <section className="panel-kart fatura-kart">
        <div className="odeme-sekme-alani">
          <button type="button" className={`odeme-sekme ${faturaSekmesi === 'yeni' ? 'aktif' : ''}`} onClick={() => setFaturaSekmesi('yeni')}>
            Yeni Fatura
          </button>
          <button type="button" className={`odeme-sekme ${faturaSekmesi === 'gecmis' ? 'aktif' : ''}`} onClick={() => setFaturaSekmesi('gecmis')}>
            Fatura Geçmişi
          </button>
        </div>

        {faturaSekmesi === 'yeni' && (
          <div className="fatura-grid">
            <div className="fatura-form-alani">
              <div className="panel-ust-cizgi">
                <h2>Yeni Fatura Oluştur</h2>
                <span className="panel-bilgi-rozet">{faturaFormu.tur}</span>
              </div>

              <div className="fatura-form-grid">
                <label>
                  Fatura Türü
                  <select value={faturaFormu.tur} onChange={(event) => faturaTuruDegistir(event.target.value)}>
                    <option>Satış Faturası</option>
                    <option>Alış Faturası</option>
                  </select>
                </label>

                <label>
                  {faturaFormu.tur === 'Satış Faturası' ? 'Müşteri' : 'Tedarikçi'}
                  <select value={faturaFormu.karsiTarafUid} onChange={(event) => faturaKarsiTarafDegistir(event.target.value)}>
                    <option value="">{faturaFormu.tur === 'Satış Faturası' ? 'Müşteri seçin' : 'Tedarikçi seçin'}</option>
                    {faturaKarsiTaraflar.map((kayit) => (
                      <option key={`fatura-karsi-${kayit.uid}`} value={kayit.uid}>{kayit.ad}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Fatura Tarihi
                  <input type="date" value={faturaFormu.tarih} onChange={(event) => faturaFormuGuncelle('tarih', event.target.value)} />
                </label>

                <label>
                  Ödeme Tarihi
                  <input type="date" value={faturaFormu.odemeTarihi} onChange={(event) => faturaFormuGuncelle('odemeTarihi', event.target.value)} />
                </label>
              </div>

              <div className="fatura-satirlar">
                <div className="panel-ust-cizgi">
                  <h2>Ürünler</h2>
                  <button type="button" className="siparis-aksiyon-buton" onClick={faturaSatiriEkle}>Satır Ekle</button>
                </div>

                <div className="fatura-satir-listesi">
                  {faturaFormu.satirlar.map((satir, index) => (
                    <div key={`fatura-satir-${satir.id}`} className="fatura-satir-karti">
                      <div className="fatura-satir-ust">
                        <strong>Ürün Kalemi {index + 1}</strong>
                        <button type="button" className="ikon-dugme sil" onClick={() => faturaSatiriSil(satir.id)}><KucukIkon tip="sil" /></button>
                      </div>
                      <div className="fatura-satir-grid">
                        <label>
                          Ürün
                          <select value={satir.urunUid} onChange={(event) => faturaSatiriGuncelle(satir.id, 'urunUid', event.target.value)}>
                            <option value="">Ürün seçin</option>
                            {urunler.map((urun) => (
                              <option key={`fatura-urun-${urun.uid}`} value={urun.uid}>{urun.ad}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Miktar
                          <input type="number" min="1" value={satir.miktar} onChange={(event) => faturaSatiriGuncelle(satir.id, 'miktar', event.target.value)} />
                        </label>
                        <label>
                          Birim Fiyat
                          <input type="number" min="0" value={satir.birimFiyat} onChange={(event) => faturaSatiriGuncelle(satir.id, 'birimFiyat', event.target.value)} />
                        </label>
                        <label>
                          KDV
                          <select value={satir.kdvOrani} onChange={(event) => faturaSatiriGuncelle(satir.id, 'kdvOrani', event.target.value)}>
                            <option value={0.2}>%20</option>
                            <option value={0.1}>%10</option>
                            <option value={0.01}>%1</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <label className="fatura-not-alani">
                Açıklama / Not
                <textarea value={faturaFormu.not} onChange={(event) => faturaFormuGuncelle('not', event.target.value)} placeholder="Teslimat, ödeme ve ek açıklama notları." />
              </label>

              <div className="fatura-aksiyonlari">
                <button type="button" className="ikinci" onClick={() => faturaPdfOnizlemeAc()}>PDF'e Çevir</button>
                <button type="button" className="ikinci" onClick={() => faturayiYazdir(faturaOnizleme)}>Yazdır</button>
                <button type="button" onClick={faturaKaydet}>Faturayı Kaydet</button>
              </div>
            </div>

            <aside className="fatura-onizleme-karti">
              <InvoicePreview fatura={faturaOnizleme} paraFormatla={paraFormatla} tarihFormatla={tarihFormatla} />

                <div className="fatura-onizleme-alt">
                  <button type="button" className="ikinci" onClick={() => faturayiPdfIndir(faturaOnizleme)}>PDF İndir</button>
                  <button type="button" onClick={() => faturaPdfOnizlemeAc()}>Önizlemeyi Aç</button>
                </div>
            </aside>
          </div>
        )}

        {faturaSekmesi === 'gecmis' && (
          <>
            <div className="panel-ust-cizgi">
              <h2>Fatura Geçmişi</h2>
              <input
                type="text"
                placeholder="Fatura no veya müşteri / tedarikçi ara"
                value={faturaArama}
                onChange={(event) => setFaturaArama(event.target.value)}
              />
            </div>

            <div className="tablo-sarmal masaustu-tablo">
              <table>
                <thead>
                  <tr>
                    <th>Fatura No</th>
                    <th>Tür</th>
                    <th>Firma / Müşteri</th>
                    <th>Tarih</th>
                    <th>Toplam</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtreliFaturalar.map((fatura) => (
                    <tr key={fatura.id}>
                      <td>{fatura.faturaNo}</td>
                      <td>{fatura.tur}</td>
                      <td>{fatura.karsiTarafAdi}</td>
                      <td>{tarihFormatla(fatura.tarih)}</td>
                      <td>{paraFormatla(fatura.toplam)}</td>
                      <td><span className="stok-log-rozet">{fatura.durum}</span></td>
                      <td>
                        <button type="button" className="siparis-aksiyon-buton" onClick={() => faturaDetayAc(fatura)}>Tekrar Görüntüle</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobil-kart-listesi">
              {filtreliFaturalar.map((fatura) => (
                <article key={`mobil-fatura-${fatura.id}`} className="mobil-kart">
                  <div className="mobil-kart-ust">
                    <strong>{fatura.faturaNo}</strong>
                    <span className="stok-log-rozet">{fatura.durum}</span>
                  </div>
                  <div className="mobil-kart-govde">
                    <div className="mobil-bilgi-satiri"><span>Tür</span><strong>{fatura.tur}</strong></div>
                    <div className="mobil-bilgi-satiri"><span>Firma / Müşteri</span><strong>{fatura.karsiTarafAdi}</strong></div>
                    <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(fatura.tarih)}</strong></div>
                    <div className="mobil-bilgi-satiri"><span>Toplam</span><strong>{paraFormatla(fatura.toplam)}</strong></div>
                  </div>
                  <div className="mobil-kart-aksiyon">
                    <button type="button" className="siparis-aksiyon-buton" onClick={() => faturaDetayAc(fatura)}>Tekrar Görüntüle</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </section>
  )
}
