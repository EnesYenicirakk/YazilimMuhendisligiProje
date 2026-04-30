import SiparislerPaneli from '../../siparisler/SiparislerPaneli'

export default function OrdersPanel({ ordersData, paraFormatla, tarihFormatla, durumSinifi }) {
  return (
    <SiparislerPaneli
      yeniSiparisPenceresiniAc={ordersData.yeniSiparisPenceresiniAc}
      siparisSekmesi={ordersData.siparisSekmesi}
      setSiparisSekmesi={ordersData.setSiparisSekmesi}
      siparisAktivitesi={ordersData.siparisAktivitesi}
      siparisArama={ordersData.siparisArama}
      setSiparisArama={ordersData.setSiparisArama}
      siparisOdemeFiltresi={ordersData.siparisOdemeFiltresi}
      setSiparisOdemeFiltresi={ordersData.setSiparisOdemeFiltresi}
      sayfadakiSiparisler={ordersData.sayfadakiSiparisler}
      paraFormatla={paraFormatla}
      tarihFormatla={tarihFormatla}
      durumSinifi={durumSinifi}
      loading={ordersData.loading}
      setDetaySiparis={ordersData.setDetaySiparis}
      siparisDuzenlemeAc={ordersData.siparisDuzenlemeAc}
      siparisDurumGuncellemeAc={ordersData.siparisDurumGuncellemeAc}
      setSilinecekSiparis={ordersData.setSilinecekSiparis}
      siparisMusteriAra={ordersData.siparisMusteriAra}
      siparisIptalAc={ordersData.siparisIptalAc}
      siparisSayfa={ordersData.siparisSayfa}
      setSiparisSayfa={ordersData.setSiparisSayfa}
      toplamSiparisSayfa={ordersData.toplamSiparisSayfa}
      gecmisSiparisArama={ordersData.gecmisSiparisArama}
      setGecmisSiparisArama={ordersData.setGecmisSiparisArama}
      setGecmisSiparisSayfa={ordersData.setGecmisSiparisSayfa}
      sayfadakiGecmisSiparisler={ordersData.sayfadakiGecmisSiparisler}
      setDetayGecmisSiparis={ordersData.setDetayGecmisSiparis}
      gecmisSiparisSayfa={ordersData.gecmisSiparisSayfa}
      toplamGecmisSiparisSayfa={ordersData.toplamGecmisSiparisSayfa}
      iptalSiparisArama={ordersData.iptalSiparisArama}
      setIptalSiparisArama={ordersData.setIptalSiparisArama}
      setIptalSiparisSayfa={ordersData.setIptalSiparisSayfa}
      sayfadakiIptalSiparisler={ordersData.sayfadakiIptalSiparisler}
      iptalSiparisSayfa={ordersData.iptalSiparisSayfa}
      toplamIptalSiparisSayfa={ordersData.toplamIptalSiparisSayfa}
    />
  )
}
