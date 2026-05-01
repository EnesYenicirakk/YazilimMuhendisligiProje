import BosDurumKarti from '../../../components/common/BosDurumKarti'
import { KucukIkon } from '../../../components/common/Ikonlar'
import MobilKart from '../../../components/common/MobilKart'

export default function CustomersPanel({
  customersData,
  paraFormatla,
  tarihFormatla,
  telefonAramasiBaslat,
}) {
  const {
    musteriEklemeAc,
    musteriArama,
    setMusteriArama,
    setMusteriSayfa,
    sayfadakiMusteriler,
    musteriBaslangic,
    musteriFavoriDegistir,
    musteriNotAc,
    musteriDuzenlemeAc,
    setSilinecekMusteri,
    musteriSayfa,
    musteriSayfayaGit,
    toplamMusteriSayfa,
  } = customersData

  return (
    <section data-cy="customers-page">
      <header className="ust-baslik envanter-baslik">
        <div>
          <h1>Kayıtlı Müşteriler</h1>
          <p>
            Daha önce alışveriş yapan müşterileri telefon ve not bilgileriyle birlikte yönetin.
          </p>
        </div>
        <button type="button" className="urun-ekle-karti" data-cy="customer-add-button" onClick={musteriEklemeAc}>
          <span className="urun-ekle-ikon" aria-hidden="true">
            <KucukIkon tip="musteri-ekle" />
          </span>
          <span className="urun-ekle-metin">Müşteri Ekle</span>
        </button>
      </header>

      <section className="panel-kart musteriler-kart">
        <div className="panel-ust-cizgi">
          <h2>Müşteri Listesi</h2>
          <input
            data-cy="customer-search"
            type="text"
            placeholder="Müşteri adı veya telefon ara"
            value={musteriArama}
            onChange={(event) => {
              setMusteriArama(event.target.value)
              setMusteriSayfa(1)
            }}
          />
        </div>

        {customersData.loading ? (
          <div className="yukleniyor-alani">
            <div className="yukleniyor-spinner"></div>
            <p>Müşteriler yükleniyor...</p>
          </div>
        ) : (
          <>
            {sayfadakiMusteriler.length > 0 ? (
          <>
            <div className="tablo-sarmal masaustu-tablo">
              <table data-cy="customers-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Müşteri</th>
                    <th>Telefon</th>
                    <th>Son Satın Alım</th>
                    <th>Sipariş Sayısı</th>
                    <th>Toplam Harcama</th>
                    <th>Not</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {sayfadakiMusteriler.map((musteri, index) => (
                    <tr key={musteri.uid} data-cy="customer-row" data-customer-id={musteri.uid}>
                      <td>{String(musteriBaslangic + index + 1).padStart(2, '0')}</td>
                      <td>
                        <div className="urun-hucre">
                          <span className="musteri-avatar" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="8.1" r="4.05" />
                              <path d="M4.8 19.8a8.1 8.1 0 0 1 14.4 0A11.2 11.2 0 0 1 12 22a11.2 11.2 0 0 1-7.2-2.2Z" />
                            </svg>
                          </span>
                          <strong>{musteri.ad}</strong>
                        </div>
                      </td>
                      <td>{musteri.telefon}</td>
                      <td>{tarihFormatla(musteri.sonAlim)}</td>
                      <td>{musteri.toplamSiparis}</td>
                      <td>{paraFormatla(musteri.toplamHarcama)}</td>
                      <td className="musteri-not-ozet">{musteri.not}</td>
                      <td>
                        <div className="islem-dugmeleri">
                          <button type="button" className={`ikon-dugme favori ${musteri.favori ? 'aktif' : ''}`} title="Favori" onClick={() => musteriFavoriDegistir(musteri.uid)}><KucukIkon tip="favori" /></button>
                          <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={() => musteriNotAc(musteri)}><KucukIkon tip="not" /></button>
                          <button type="button" className="ikon-dugme duzenle" title="Düzenle" onClick={() => musteriDuzenlemeAc(musteri)}><KucukIkon tip="duzenle" /></button>
                          <button type="button" className="ikon-dugme telefon" data-cy="customer-call-button" title="Ara" onClick={() => telefonAramasiBaslat(musteri.telefon, musteri.ad)}><KucukIkon tip="telefon" /></button>
                          <button type="button" className="ikon-dugme sil" data-cy="customer-delete-button" title="Sil" onClick={() => setSilinecekMusteri(musteri)}><KucukIkon tip="sil" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobil-kart-listesi">
              {sayfadakiMusteriler.map((musteri, index) => (
                <MobilKart
                  key={`mobil-musteri-${musteri.uid}`}
                  className="musteri-mobil-kart"
                  solaEtiket="Sil"
                  sagaEtiket="Favori, not ve ara"
                  solaAksiyonlar={[
                    { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekMusteri(musteri) },
                  ]}
                  sagaAksiyonlar={[
                    { id: 'favori', etiket: 'Favori', varyant: 'favori', aktif: musteri.favori, onClick: () => musteriFavoriDegistir(musteri.uid) },
                    { id: 'not', etiket: 'Not', onClick: () => musteriNotAc(musteri) },
                    { id: 'duzenle', etiket: 'Düzenle', varyant: 'ikincil', onClick: () => musteriDuzenlemeAc(musteri) },
                    { id: 'ara', etiket: 'Ara', varyant: 'ikincil', onClick: () => telefonAramasiBaslat(musteri.telefon, musteri.ad) },
                  ]}
                  ust={
                    <>
                      <strong>{String(musteriBaslangic + index + 1).padStart(2, '0')} - {musteri.ad}</strong>
                      <span>{tarihFormatla(musteri.sonAlim)}</span>
                    </>
                  }
                  govde={
                    <>
                      <div className="mobil-kart-kisi">
                        <span className="musteri-avatar" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="8.1" r="4.05" />
                            <path d="M4.8 19.8a8.1 8.1 0 0 1 14.4 0A11.2 11.2 0 0 1 12 22a11.2 11.2 0 0 1-7.2-2.2Z" />
                          </svg>
                        </span>
                        <div className="mobil-kisi-metin">
                          <strong>{musteri.ad}</strong>
                          <span>{musteri.telefon}</span>
                        </div>
                      </div>
                      <div className="mobil-bilgi-satiri"><span>Sipariş Sayısı</span><strong>{musteri.toplamSiparis}</strong></div>
                      <div className="mobil-bilgi-satiri"><span>Toplam Harcama</span><strong>{paraFormatla(musteri.toplamHarcama)}</strong></div>
                      <div className="mobil-bilgi-satiri tam"><span>Not</span><strong>{musteri.not}</strong></div>
                    </>
                  }
                />
              ))}
            </div>

            <div className="sayfalama">
              <button type="button" className="sayfa-ok" onClick={() => musteriSayfayaGit(musteriSayfa - 1)} disabled={musteriSayfa === 1}>‹</button>
              {Array.from({ length: toplamMusteriSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                <button key={`musteri-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${musteriSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => musteriSayfayaGit(sayfaNo)}>
                  {sayfaNo}
                </button>
              ))}
              <button type="button" className="sayfa-ok" onClick={() => musteriSayfayaGit(musteriSayfa + 1)} disabled={musteriSayfa === toplamMusteriSayfa}>›</button>
            </div>
          </>
        ) : (
          <BosDurumKarti
            baslik="Müşteri bulunamadı"
            aciklama="Aradığınız isim veya telefon numarasına uygun müşteri kaydı görünmüyor."
            eylemMetni="Aramayı Temizle"
            onEylem={() => {
              setMusteriArama('')
              setMusteriSayfa(1)
            }}
          />
        )}
      </>
    )}
      </section>
    </section>
  )
}
