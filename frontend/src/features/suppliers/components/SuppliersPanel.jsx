import TedarikcilerPaneli from '../../tedarikciler/TedarikcilerPaneli'

export default function SuppliersPanel({
  suppliersData,
  paraFormatla,
  tarihFormatla,
  telefonAramasiBaslat,
}) {
  return (
    <TedarikcilerPaneli
      tedarikciSekmesi={suppliersData.tedarikciSekmesi}
      setTedarikciSekmesi={suppliersData.setTedarikciSekmesi}
      tedarikciArama={suppliersData.tedarikciArama}
      setTedarikciArama={suppliersData.setTedarikciArama}
      tedarikciEklemeAc={suppliersData.tedarikciEklemeAc}
      sayfadakiTedarikciler={suppliersData.sayfadakiTedarikciler}
      tedarikciBaslangic={suppliersData.tedarikciBaslangic}
      tedarikciDetayAc={suppliersData.tedarikciDetayAc}
      tedarikciFavoriDegistir={suppliersData.tedarikciFavoriDegistir}
      tedarikciNotAc={suppliersData.tedarikciNotAc}
      tedarikciDuzenlemeAc={suppliersData.tedarikciDuzenlemeAc}
      telefonAramasiBaslat={telefonAramasiBaslat}
      setSilinecekTedarikci={suppliersData.setSilinecekTedarikci}
      paraFormatla={paraFormatla}
      tedarikciSayfa={suppliersData.tedarikciSayfa}
      tedarikciSayfayaGit={suppliersData.tedarikciSayfayaGit}
      toplamTedarikciSayfa={suppliersData.toplamTedarikciSayfa}
      setTedarikciSayfa={suppliersData.setTedarikciSayfa}
      sayfadakiTedarikSiparisleri={suppliersData.sayfadakiTedarikSiparisleri}
      genelTedarikSiparisEklemeAc={suppliersData.genelTedarikSiparisEklemeAc}
      tarihFormatla={tarihFormatla}
      tedarikciler={suppliersData.tedarikciler}
      seciliTedarikci={suppliersData.seciliTedarikci}
      tedarikciSiparisSayfa={suppliersData.tedarikciSiparisSayfa}
      tedarikciSiparisSayfayaGit={suppliersData.tedarikciSiparisSayfayaGit}
      toplamTedarikSiparisSayfa={suppliersData.toplamTedarikSiparisSayfa}
      tedarikSiparisBaslangic={suppliersData.tedarikSiparisBaslangic}
    />
  )
}
