import React from 'react';

export default function InvoicePreview({
  fatura,
  paraFormatla,
  tarihFormatla,
}) {
  return (
    <>
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
          <span className="panel-bilgi-rozet">{fatura.tur}</span>
          <strong>{fatura.faturaNo}</strong>
        </div>
      </div>

      <div className="fatura-onizleme-bilgi">
        <div>
          <small>{fatura.tur === 'Satış Faturası' ? 'Müşteri' : 'Tedarikçi'}</small>
          <strong>{fatura.karsiTarafAdi || 'Seçim bekleniyor'}</strong>
        </div>
        <div>
          <small>Tarih</small>
          <strong>{fatura.tarih ? tarihFormatla(fatura.tarih) : '-'}</strong>
        </div>
        <div>
          <small>Ödeme Tarihi</small>
          <strong>{fatura.odemeTarihi ? tarihFormatla(fatura.odemeTarihi) : '-'}</strong>
        </div>
      </div>

      <div className="fatura-onizleme-govde">
        <h3>Ürünler</h3>
        <div className="fatura-onizleme-satirlar">
          {fatura.satirlar && fatura.satirlar.length ? fatura.satirlar.map((satir, index) => (
            <div key={`onizleme-satir-${satir.id}-${index}`} className="fatura-onizleme-satir">
              <div>
                <strong>{satir.urun}</strong>
                <span>{satir.miktar} x {paraFormatla(satir.birimFiyat)}</span>
              </div>
              <strong>{paraFormatla(Number(satir.miktar) * Number(satir.birimFiyat))}</strong>
            </div>
          )) : <p className="fatura-bos-metin">Önizleme için ürün satırı ekleyin.</p>}
        </div>

        <div className="fatura-toplamlar">
          <div><span>Ara Toplam</span><strong>{paraFormatla(fatura.araToplam)}</strong></div>
          <div><span>KDV</span><strong>{paraFormatla(fatura.kdv)}</strong></div>
          <div className="genel-toplam"><span>Toplam</span><strong>{paraFormatla(fatura.toplam)}</strong></div>
        </div>

        <div className="fatura-belge-alt">
          <div className="fatura-belge-not">{fatura.not || 'Standart ödeme ve teslimat koşulları geçerlidir.'}</div>
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
    </>
  );
}
