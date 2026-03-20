import BosDurumKarti from '../../components/common/BosDurumKarti'
import { KucukIkon } from '../../components/common/Ikonlar'
import MobilKart from '../../components/common/MobilKart'

function TedarikcilerPaneli(props) {
  const {
    tedarikciSekmesi,
    setTedarikciSekmesi,
    tedarikciArama,
    setTedarikciArama,
    tedarikciEklemeAc,
    sayfadakiTedarikciler,
    tedarikciBaslangic,
    tedarikciDetayAc,
    tedarikciFavoriDegistir,
    tedarikciNotAc,
    tedarikciDuzenlemeAc,
    telefonAramasiBaslat,
    setSilinecekTedarikci,
    paraFormatla,
    tedarikciSayfa,
    tedarikciSayfayaGit,
    toplamTedarikciSayfa,
    setTedarikciSayfa,
    sayfadakiTedarikSiparisleri,
    genelTedarikSiparisEklemeAc,
    tarihFormatla,
    tedarikciler,
    seciliTedarikci,
    tedarikciSiparisSayfa,
    tedarikciSiparisSayfayaGit,
    toplamTedarikSiparisSayfa,
    tedarikSiparisBaslangic,
  } = props

  return (
    <section>
      <header className="ust-baslik envanter-baslik">
        <div>
          <h1>KayÄ±tlÄ± TedarikÃ§iler</h1>
          <p>TedarikÃ§i detaylarÄ±nÄ±, sipariÅŸlerini ve fiyat geÃ§miÅŸlerini tek yerden yÃ¶netin.</p>
        </div>
      </header>

      <section className="panel-kart musteriler-kart">
        <div className="odeme-sekme-alani">
          <button
            type="button"
            className={`odeme-sekme ${tedarikciSekmesi === 'liste' ? 'aktif' : ''}`}
            onClick={() => setTedarikciSekmesi('liste')}
          >
            TedarikÃ§i Listesi
          </button>
          <button
            type="button"
            className={`odeme-sekme ${tedarikciSekmesi === 'siparisler' ? 'aktif' : ''}`}
            onClick={() => setTedarikciSekmesi('siparisler')}
          >
            Son Tedarik SipariÅŸleri
          </button>
        </div>

        {tedarikciSekmesi === 'liste' && (
          <>
            <div className="panel-ust-cizgi tedarikci-ust-cizgi">
              <h2>TedarikÃ§i Listesi</h2>
              <div className="tedarikci-arama-alani">
                <input
                  type="text"
                  placeholder="Firma, yetkili, telefon veya Ã¼rÃ¼n grubu ara"
                  value={tedarikciArama}
                  onChange={(event) => setTedarikciArama(event.target.value)}
                />
                <button type="button" className="mobil-arama-dugmesi" aria-label="TedarikÃ§i ara"><KucukIkon tip="detay" /></button>
              </div>
              <button type="button" className="urun-ekle-karti" onClick={tedarikciEklemeAc}>
                <span className="urun-ekle-ikon" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                <span className="urun-ekle-metin">TedarikÃ§i Ekle</span>
              </button>
            </div>

            {sayfadakiTedarikciler.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Firma</th>
                        <th>Yetkili</th>
                        <th>Telefon</th>
                        <th>ÃœrÃ¼n Grubu</th>
                        <th>Toplam AlÄ±ÅŸ</th>
                        <th>Ortalama Teslim</th>
                        <th>Toplam Harcama</th>
                        <th>Not</th>
                        <th>Ä°ÅŸlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiTedarikciler.map((tedarikci, index) => (
                        <tr key={tedarikci.uid} className="satir-tiklanabilir" onClick={() => tedarikciDetayAc(tedarikci)}>
                          <td>{String(tedarikciBaslangic + index + 1).padStart(2, '0')}</td>
                          <td>
                            <div className="urun-hucre">
                              <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                              <strong>{tedarikci.firmaAdi}</strong>
                            </div>
                          </td>
                          <td>{tedarikci.yetkiliKisi}</td>
                          <td>{tedarikci.telefon}</td>
                          <td>{tedarikci.urunGrubu}</td>
                          <td>{tedarikci.toplamAlisSayisi}</td>
                          <td>{tedarikci.ortalamaTeslimSuresi}</td>
                          <td>{paraFormatla(tedarikci.toplamHarcama)}</td>
                          <td className="musteri-not-ozet">{tedarikci.not}</td>
                          <td>
                            <div className="islem-dugmeleri">
                              <button type="button" className={`ikon-dugme favori ${tedarikci.favori ? 'aktif' : ''}`} title="Favori" onClick={(event) => { event.stopPropagation(); tedarikciFavoriDegistir(tedarikci.uid) }}><KucukIkon tip="favori" /></button>
                              <button type="button" className="ikon-dugme not" title="Not Ekle" onClick={(event) => { event.stopPropagation(); tedarikciNotAc(tedarikci) }}><KucukIkon tip="not" /></button>
                              <button type="button" className="ikon-dugme duzenle" title="DÃ¼zenle" onClick={(event) => { event.stopPropagation(); tedarikciDuzenlemeAc(tedarikci) }}><KucukIkon tip="duzenle" /></button>
                              <button type="button" className="ikon-dugme telefon" title="Ara" onClick={(event) => { event.stopPropagation(); telefonAramasiBaslat(tedarikci.telefon, tedarikci.firmaAdi) }}><KucukIkon tip="telefon" /></button>
                              <button type="button" className="ikon-dugme sil" title="Sil" onClick={(event) => { event.stopPropagation(); setSilinecekTedarikci(tedarikci) }}><KucukIkon tip="sil" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiTedarikciler.map((tedarikci, index) => (
                    <MobilKart
                      key={`mobil-tedarikci-${tedarikci.uid}`}
                      className="tedarikci-mobil-kart"
                      solaEtiket="Sil"
                      sagaEtiket="Detay ve iÅŸlemler"
                      solaAksiyonlar={[
                        { id: 'sil', etiket: 'Sil', varyant: 'tehlike', onClick: () => setSilinecekTedarikci(tedarikci) },
                      ]}
                      sagaAksiyonlar={[
                        { id: 'detay', etiket: 'Detay', onClick: () => tedarikciDetayAc(tedarikci) },
                        { id: 'favori', etiket: 'Favori', varyant: 'favori', aktif: tedarikci.favori, onClick: () => tedarikciFavoriDegistir(tedarikci.uid) },
                        { id: 'not', etiket: 'Not', onClick: () => tedarikciNotAc(tedarikci) },
                        { id: 'duzenle', etiket: 'DÃ¼zenle', varyant: 'ikincil', onClick: () => tedarikciDuzenlemeAc(tedarikci) },
                        { id: 'ara', etiket: 'Ara', varyant: 'ikincil', onClick: () => telefonAramasiBaslat(tedarikci.telefon, tedarikci.firmaAdi) },
                      ]}
                      ust={
                        <>
                          <strong>{String(tedarikciBaslangic + index + 1).padStart(2, '0')} - {tedarikci.firmaAdi}</strong>
                          <span>{tedarikci.urunGrubu}</span>
                        </>
                      }
                      govde={
                        <>
                          <div className="mobil-kart-kisi">
                            <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                            <div className="mobil-kisi-metin">
                              <strong>{tedarikci.yetkiliKisi}</strong>
                              <span>{tedarikci.telefon}</span>
                            </div>
                          </div>
                          <div className="mobil-bilgi-satiri"><span>E-posta</span><strong>{tedarikci.email}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Toplam AlÄ±ÅŸ</span><strong>{tedarikci.toplamAlisSayisi}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Toplam Harcama</span><strong>{paraFormatla(tedarikci.toplamHarcama)}</strong></div>
                          <div className="mobil-bilgi-satiri tam"><span>Not</span><strong>{tedarikci.not}</strong></div>
                        </>
                      }
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => tedarikciSayfayaGit(tedarikciSayfa - 1)} disabled={tedarikciSayfa === 1}>â€¹</button>
                  {Array.from({ length: toplamTedarikciSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button key={`tedarikci-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${tedarikciSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => tedarikciSayfayaGit(sayfaNo)}>
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => tedarikciSayfayaGit(tedarikciSayfa + 1)} disabled={tedarikciSayfa === toplamTedarikciSayfa}>â€º</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="TedarikÃ§i bulunamadÄ±"
                aciklama="Firma, yetkili veya Ã¼rÃ¼n grubu filtresine uygun tedarikÃ§i gÃ¶rÃ¼nmÃ¼yor."
                eylemMetni="AramayÄ± Temizle"
                onEylem={() => {
                  setTedarikciArama('')
                  setTedarikciSayfa(1)
                }}
              />
            )}
          </>
        )}

        {tedarikciSekmesi === 'siparisler' && (
          <>
            <div className="panel-ust-cizgi tedarikci-ust-cizgi">
              <h2>MaÄŸazaya Verilen Son SipariÅŸler</h2>
              <button type="button" className="siparis-aksiyon-buton" onClick={genelTedarikSiparisEklemeAc}>
                Yeni SipariÅŸ
              </button>
            </div>

            {sayfadakiTedarikSiparisleri.length > 0 ? (
              <>
                <div className="tablo-sarmal masaustu-tablo">
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>TedarikÃ§i</th>
                        <th>SipariÅŸ No</th>
                        <th>Tarih</th>
                        <th>Tutar</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sayfadakiTedarikSiparisleri.map((siparis, index) => (
                        <tr key={`${siparis.tedarikciUid}-${siparis.siparisNo}`} className="satir-tiklanabilir" onClick={() => tedarikciDetayAc(tedarikciler.find((item) => item.uid === siparis.tedarikciUid) ?? seciliTedarikci)}>
                          <td>{String(tedarikSiparisBaslangic + index + 1).padStart(2, '0')}</td>
                          <td>
                            <div className="urun-hucre">
                              <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                              <div className="mobil-kisi-metin">
                                <strong>{siparis.firmaAdi}</strong>
                                <span>{siparis.yetkiliKisi}</span>
                              </div>
                            </div>
                          </td>
                          <td>{siparis.siparisNo}</td>
                          <td>{tarihFormatla(siparis.tarih)}</td>
                          <td>{paraFormatla(siparis.tutar)}</td>
                          <td><span className={`tedarik-durum ${siparis.durum === 'Bekliyor' ? 'bekliyor' : siparis.durum === 'HazÄ±rlanÄ±yor' ? 'hazirlaniyor' : 'teslim'}`}>{siparis.durum}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mobil-kart-listesi">
                  {sayfadakiTedarikSiparisleri.map((siparis) => (
                    <MobilKart
                      key={`mobil-tedarik-siparis-${siparis.tedarikciUid}-${siparis.siparisNo}`}
                      className="tedarikci-mobil-kart"
                      sagaEtiket="TedarikÃ§iye git"
                      sagaAksiyonlar={[
                        {
                          id: 'git',
                          etiket: 'Detay',
                          onClick: () => tedarikciDetayAc(tedarikciler.find((item) => item.uid === siparis.tedarikciUid) ?? seciliTedarikci),
                        },
                      ]}
                      ust={
                        <>
                          <strong>{siparis.siparisNo}</strong>
                          <span className={`tedarik-durum ${siparis.durum === 'Bekliyor' ? 'bekliyor' : siparis.durum === 'HazÄ±rlanÄ±yor' ? 'hazirlaniyor' : 'teslim'}`}>{siparis.durum}</span>
                        </>
                      }
                      govde={
                        <>
                          <div className="mobil-kart-kisi">
                            <span className="musteri-avatar tedarikci-avatar" aria-hidden="true"><KucukIkon tip="fabrika" /></span>
                            <div className="mobil-kisi-metin">
                              <strong>{siparis.firmaAdi}</strong>
                              <span>{siparis.telefon}</span>
                            </div>
                          </div>
                          <div className="mobil-bilgi-satiri"><span>Tarih</span><strong>{tarihFormatla(siparis.tarih)}</strong></div>
                          <div className="mobil-bilgi-satiri"><span>Tutar</span><strong>{paraFormatla(siparis.tutar)}</strong></div>
                        </>
                      }
                    />
                  ))}
                </div>

                <div className="sayfalama">
                  <button type="button" className="sayfa-ok" onClick={() => tedarikciSiparisSayfayaGit(tedarikciSiparisSayfa - 1)} disabled={tedarikciSiparisSayfa === 1}>â€¹</button>
                  {Array.from({ length: toplamTedarikSiparisSayfa }, (_, i) => i + 1).map((sayfaNo) => (
                    <button key={`tedarik-siparis-sayfa-${sayfaNo}`} type="button" className={`sayfa-buton ${tedarikciSiparisSayfa === sayfaNo ? 'aktif' : ''}`} onClick={() => tedarikciSiparisSayfayaGit(sayfaNo)}>
                      {sayfaNo}
                    </button>
                  ))}
                  <button type="button" className="sayfa-ok" onClick={() => tedarikciSiparisSayfayaGit(tedarikciSiparisSayfa + 1)} disabled={tedarikciSiparisSayfa === toplamTedarikSiparisSayfa}>â€º</button>
                </div>
              </>
            ) : (
              <BosDurumKarti
                baslik="Tedarik sipariÅŸi bulunamadÄ±"
                aciklama="HenÃ¼z gÃ¶rÃ¼ntÃ¼lenecek maÄŸaza tedarik sipariÅŸi kaydÄ± yok."
                eylemMetni="Yeni SipariÅŸ"
                onEylem={genelTedarikSiparisEklemeAc}
              />
            )}
          </>
        )}
      </section>
    </section>
  )
}

export default TedarikcilerPaneli

