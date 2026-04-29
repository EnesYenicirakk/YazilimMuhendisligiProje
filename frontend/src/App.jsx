import { Suspense, lazy, useState } from 'react'
import './App.css'
import { useMemo } from 'react'
import { useEffect } from 'react'
import IndexPage from './features/home/components/IndexPage'
import DashboardPage from './features/dashboard/components/DashboardPage'
import OdemelerPage from './features/finance/components/OdemelerPage'
import UrunDuzenlemePage from './features/inventory/components/UrunDuzenlemePage'
import InventoryPage from './features/inventory/components/InventoryPage'
import BarcodeStockModal from './features/inventory/components/BarcodeStockModal'
import BosDurumKarti from './components/common/BosDurumKarti'
import { KucukIkon } from './components/common/Ikonlar'
import MobilKart from './components/common/MobilKart'
import Sidebar from './components/layout/Sidebar'
import BottomNav from './components/layout/BottomNav'
import LoginPage from './features/auth/components/LoginPage'
import useInventory from './features/inventory/hooks/useInventory'
import OrdersPanel from './features/orders/components/OrdersPanel'
import OrderModals from './features/orders/components/OrderModals'
import useOrders from './features/orders/hooks/useOrders'
import useAuth from './features/auth/hooks/useAuth'
import useDashboard from './features/dashboard/hooks/useDashboard'
import useCustomers from './features/customers/hooks/useCustomers'
import useFinance from './features/finance/hooks/useFinance'
import useInvoices from './features/invoices/hooks/useInvoices'
import useSuppliers from './features/suppliers/hooks/useSuppliers'
import useGlobalSearch from './core/hooks/useGlobalSearch'
import useAppNotifications from './core/hooks/useAppNotifications'
import { useToast } from './core/contexts/ToastContext'
import {
  paraFormatla,
  durumSinifi,
  kritikStoktaMi,
  merkezMenusu,
  siparisTamamlandiMi,
  tarihFormatla,
} from './shared/utils/constantsAndHelpers'

const BildirimPaneli = lazy(() => import('./BildirimPaneli'))
const AiPanel = lazy(() => import('./AiPanel'))
const InvoicesPanel = lazy(() => import('./features/invoices/components/InvoicesPanel'))
const InvoiceModals = lazy(() => import('./features/invoices/components/InvoiceModals'))
const CustomersPanel = lazy(() => import('./features/customers/components/CustomersPanel'))
const FinanceModals = lazy(() => import('./features/finance/components/FinanceModals'))
const InventoryModals = lazy(() => import('./features/inventory/components/InventoryModals'))
const SuppliersPanel = lazy(() => import('./features/suppliers/components/SuppliersPanel'))
const SupplierModals = lazy(() => import('./features/suppliers/components/SupplierModals'))
const CustomerModals = lazy(() => import('./features/customers/components/CustomerModals'))

function TemaIkonu({ tema }) {
  if (tema === 'acik') {
    return (
      <span className="ai-tema-ikon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
        </svg>
      </span>
    )
  }

  return (
    <span className="ai-tema-ikon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 15.2A8.5 8.5 0 1 1 10.1 4a6.8 6.8 0 0 0 9.9 11.2z" />
      </svg>
    </span>
  )
}

function App() {
  const [aktifSayfa, setAktifSayfa] = useState('merkez')
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false)
  const [gecisBalonu, setGecisBalonu] = useState('')
  const [merkezeDonusAktif, setMerkezeDonusAktif] = useState(false)
  const [merkezGirisEfekti, setMerkezGirisEfekti] = useState(false)
  const { toastGoster } = useToast()

  const auth = useAuth({
    onLoginSuccess: () => setAktifSayfa('merkez'),
  })

  const inventoryData = useInventory({ toastGoster, isLoggedIn: auth.isLoggedIn })
  const customersData = useCustomers({ toastGoster, isLoggedIn: auth.isLoggedIn })
  const suppliersData = useSuppliers({ toastGoster, isLoggedIn: auth.isLoggedIn })
  const financeData = useFinance({ toastGoster, isLoggedIn: auth.isLoggedIn })

  const sayfaDegistir = (sayfa) => {
    setAktifSayfa(sayfa)
    inventoryData.inventoryModallariniKapat()
    customersData.musteriModallariniKapat()
    financeData.financeModallariniKapat()
    suppliersData.tedarikciModallariniKapat()
    invoicesData.setFaturaDetayAcik(false)
    invoicesData.setPdfOnizlemeAcik(false)
    dashboardData.setAcikOzetMenusu('')
    dashboardData.setDashboardBolumMenusuAcik(false)
    setMobilMenuAcik(false)
    ordersData.setYeniSiparisAcik(false)
    ordersData.setDetaySiparis(null)
    ordersData.setDetayGecmisSiparis(null)
    ordersData.setDuzenlenenSiparisNo(null)
    ordersData.setDurumGuncellenenSiparisNo(null)
    ordersData.setSilinecekSiparis(null)

    if (sayfa === 'envanter') inventoryData.setEnvanterSayfa(1)
    if (sayfa === 'urun-duzenleme') inventoryData.setUrunDuzenlemeSayfa(1)
    if (sayfa === 'urun-duzenleme') inventoryData.setStokLogSayfa(1)
    if (sayfa === 'musteriler') customersData.setMusteriSayfa(1)
    if (sayfa === 'alicilar') {
      suppliersData.setTedarikciSayfa(1)
      suppliersData.setTedarikciSiparisSayfa(1)
      suppliersData.setTedarikciSekmesi('liste')
    }
    if (sayfa === 'siparisler') ordersData.setSiparisSayfa(1)
    if (sayfa === 'odemeler') {
      financeData.setOdemeSekmesi('gelen')
      financeData.setGelenSayfa(1)
      financeData.setGidenSayfa(1)
    }
    if (sayfa === 'faturalama') {
      invoicesData.setFaturaSekmesi('yeni')
    }
  }

  const ordersData = useOrders({
    musteriler: customersData.musteriler,
    urunler: inventoryData.urunler,
    toastGoster,
    isLoggedIn: auth.isLoggedIn,
    telefonAramasiBaslat: (telefon, etiket = 'Kayıt') => {
      if (!telefon) {
        toastGoster('hata', `${etiket} için phone bilgisi bulunamadı.`)
        return
      }
      window.location.href = `tel:${telefon.replace(/\s+/g, '')}`
    },
  })

  const customersViewData = useMemo(() => {
    const musteriIstatistikleri = ordersData.siparisler.reduce((harita, siparis) => {
      if (!siparisTamamlandiMi(siparis) || siparis.musteriUid == null) return harita

      const uid = String(siparis.musteriUid)
      const onceki = harita.get(uid) ?? { toplamSiparis: 0, toplamHarcama: 0 }
      harita.set(uid, {
        toplamSiparis: onceki.toplamSiparis + 1,
        toplamHarcama: onceki.toplamHarcama + Number(siparis.toplamTutar || 0),
      })
      return harita
    }, new Map())

    const zenginlestir = (liste) =>
      liste.map((musteri) => {
        const istatistik = musteriIstatistikleri.get(String(musteri.uid))
        return {
          ...musteri,
          toplamSiparis: istatistik?.toplamSiparis ?? 0,
          toplamHarcama: istatistik?.toplamHarcama ?? 0,
        }
      })

    return {
      ...customersData,
      musteriler: zenginlestir(customersData.musteriler),
      filtreliMusteriler: zenginlestir(customersData.filtreliMusteriler),
      sayfadakiMusteriler: zenginlestir(customersData.sayfadakiMusteriler),
    }
  }, [customersData, ordersData.siparisler])

  const { urunler, stokDegisimLoglari } = inventoryData

  const invoicesData = useInvoices({
    musteriler: customersData.musteriler,
    tedarikciler: suppliersData.tedarikciler,
    urunler: inventoryData.urunler,
    toastGoster,
  })

  const dashboardData = useDashboard({
    siparisler: ordersData.siparisler,
    siraliSiparisler: ordersData.siraliSiparisler,
    urunler: inventoryData.urunler,
    gelenNakitKayitlari: financeData.siraliGelenNakit,
    gidenNakitKayitlari: financeData.siraliGidenNakit,
    aySonuKari: financeData.aySonuKari,
    toastGoster,
  })

  useEffect(() => {
    if (!auth.isLoggedIn) return

    const kritikFavoriUrunler = inventoryData.urunler.filter((urun) => urun.favori && kritikStoktaMi(urun))
    if (kritikFavoriUrunler.length === 0) return

    kritikFavoriUrunler.forEach((urun) => {
      const minimumStok = Number(urun.minimumStok ?? 0)
      const mevcutStok = Number(urun.magazaStok ?? 0)
      const hedefStok = Math.max(minimumStok * 2, minimumStok + 6)
      const siparisMiktari = hedefStok - mevcutStok

      if (siparisMiktari <= 0) return

      const acikOtomatikSiparisVar = suppliersData.tumTedarikSiparisleri.some(
        (siparis) =>
          siparis.otomatik &&
          siparis.kaynak === 'stok-koruma' &&
          siparis.urunId === urun.urunId &&
          siparis.durum !== 'Teslim alındı',
      )

      if (acikOtomatikSiparisVar) return

      suppliersData.otomatikTedarikSiparisiOlustur({
        urun,
        miktar: siparisMiktari,
        hedefStok,
        oncekiStok: mevcutStok,
      })
    })
  }, [auth.isLoggedIn, inventoryData.urunler, suppliersData.tumTedarikSiparisleri, suppliersData.tedarikciler])

  const searchData = useGlobalSearch({
    aktifSayfa,
    urunler: inventoryData.urunler,
    siparisler: ordersData.siraliSiparisler,
    gecmisSiparisler: ordersData.gecmisSiparisler,
    musteriler: customersViewData.musteriler,
    tedarikciler: suppliersData.tedarikciler,
    faturalar: invoicesData.faturalar,
    paraFormatla,
    sayfaDegistir,
    inventoryData,
    ordersData,
    customersData,
    suppliersData,
    invoicesData,
  })

  const appNotifications = useAppNotifications({
    aktifSayfa,
    dashboardCanliOzetler: dashboardData.dashboardCanliOzetler,
    stokDegisimLoglari,
    siraliSiparisler: ordersData.siraliSiparisler,
    tedarikSiparisleri: suppliersData.tumTedarikSiparisleri,
    urunler,
    paraFormatla,
    tarihFormatla,
    sayfaDegistir,
    onUrunDuzenlemeSekmeDegistir: inventoryData.setUrunDuzenlemeSekmesi,
    onOdemeSekmeDegistir: financeData.setOdemeSekmesi,
    onTedarikciSekmeDegistir: suppliersData.setTedarikciSekmesi,
    toastGoster,
  })

  const merkezeDon = () => {
    if (merkezeDonusAktif) return

    setMerkezeDonusAktif(true)
    window.setTimeout(() => {
      sayfaDegistir('merkez')
      setMerkezGirisEfekti(true)
      setMerkezeDonusAktif(false)
      window.setTimeout(() => {
        setMerkezGirisEfekti(false)
      }, 520)
    }, 340)
  }

  const merkezdenSayfayaGit = (sayfa) => {
    setGecisBalonu(sayfa)
    window.setTimeout(() => {
      setGecisBalonu('')
      sayfaDegistir(sayfa)
    }, 520)
  }

  const telefonAramasiBaslat = (telefon, etiket = 'Kayıt') => {
    if (!telefon) {
      toastGoster('hata', `${etiket} için telefon bilgisi bulunamadı.`)
      return
    }

    window.location.href = `tel:${telefon.replace(/\s+/g, '')}`
  }

  if (!auth.isLoggedIn) {
    return <LoginPage auth={auth} merkezMenusu={merkezMenusu} />
  }

  return (
    <main className="dashboard-page">
      <section className={`dashboard-shell ${aktifSayfa === 'merkez' ? 'merkez-modu' : ''}`}>
        <Sidebar
          aktifSayfa={aktifSayfa}
          sayfaDegistir={sayfaDegistir}
          mobilMenuAcik={mobilMenuAcik}
          setMobilMenuAcik={setMobilMenuAcik}
        />

        <div className={`icerik-alani ${aktifSayfa === 'merkez' ? 'merkez-icerik' : ''} ${merkezeDonusAktif ? 'merkeze-donuyor' : ''}`}>
          {aktifSayfa === 'merkez' && (
            <IndexPage
              gecisBalonu={gecisBalonu}
              merkezGirisEfekti={merkezGirisEfekti}
              merkezdenSayfayaGit={merkezdenSayfayaGit}
            />
          )}

          {aktifSayfa !== 'merkez' && (
            <button type="button" className={`geri-buton ${merkezeDonusAktif ? 'aktif' : ''}`} onClick={merkezeDon}>
              ‹ Merkeze Dön
            </button>
          )}

          {aktifSayfa === 'dashboard' && (
            <DashboardPage
              KucukIkon={KucukIkon}
              sayfaDegistir={sayfaDegistir}
              dashboardData={dashboardData}
            />
          )}

          {aktifSayfa === 'siparisler' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Siparişler yükleniyor...</section>}>
              <OrdersPanel
                ordersData={ordersData}
                paraFormatla={paraFormatla}
                tarihFormatla={tarihFormatla}
                durumSinifi={durumSinifi}
              />
            </Suspense>
          )}

          {aktifSayfa === 'musteriler' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Müşteriler yükleniyor...</section>}>
              <CustomersPanel
                customersData={customersViewData}
                paraFormatla={paraFormatla}
                tarihFormatla={tarihFormatla}
                telefonAramasiBaslat={telefonAramasiBaslat}
              />
            </Suspense>
          )}

          {aktifSayfa === 'alicilar' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Tedarikçiler yükleniyor...</section>}>
              <SuppliersPanel
                suppliersData={suppliersData}
                paraFormatla={paraFormatla}
                tarihFormatla={tarihFormatla}
                telefonAramasiBaslat={telefonAramasiBaslat}
              />
            </Suspense>
          )}

          {aktifSayfa === 'odemeler' && (
            <OdemelerPage
              KucukIkon={KucukIkon}
              MobilKart={MobilKart}
              loading={financeData.loading}
              odemeSekmesi={financeData.odemeSekmesi}
              setOdemeSekmesi={financeData.setOdemeSekmesi}
              toplamGelenNakit={financeData.toplamGelenNakit}
              toplamGidenNakit={financeData.toplamGidenNakit}
              gelenSayfadakiKayitlar={financeData.gelenSayfadakiKayitlar}
              gidenSayfadakiKayitlar={financeData.gidenSayfadakiKayitlar}
              finansFavoriDegistir={financeData.finansFavoriDegistir}
              odemeDuzenlemeAc={financeData.odemeDuzenlemeAc}
              setSilinecekOdeme={financeData.setSilinecekOdeme}
              gelenSayfa={financeData.gelenSayfa}
              setGelenSayfa={financeData.setGelenSayfa}
              toplamGelenSayfa={financeData.toplamGelenSayfa}
              gidenSayfa={financeData.gidenSayfa}
              setGidenSayfa={financeData.setGidenSayfa}
              toplamGidenSayfa={financeData.toplamGidenSayfa}
            />
          )}

          {aktifSayfa === 'urun-duzenleme' && (
            <UrunDuzenlemePage
              KucukIkon={KucukIkon}
              BosDurumKarti={BosDurumKarti}
              MobilKart={MobilKart}
              urunDuzenlemeSekmesi={inventoryData.urunDuzenlemeSekmesi}
              setUrunDuzenlemeSekmesi={inventoryData.setUrunDuzenlemeSekmesi}
              urunDuzenlemeArama={inventoryData.urunDuzenlemeArama}
              setUrunDuzenlemeArama={inventoryData.setUrunDuzenlemeArama}
              setUrunDuzenlemeSayfa={inventoryData.setUrunDuzenlemeSayfa}
              sayfadakiDuzenlemeUrunleri={inventoryData.sayfadakiDuzenlemeUrunleri}
              urunDuzenlemeBaslangic={inventoryData.urunDuzenlemeBaslangic}
              favoriDegistir={inventoryData.favoriDegistir}
              urunDuzenlemeModaliniAc={inventoryData.urunDuzenlemeModaliniAc}
              setSilinecekDuzenlemeUrunu={inventoryData.setSilinecekDuzenlemeUrunu}
              urunDuzenlemeSayfa={inventoryData.urunDuzenlemeSayfa}
              urunDuzenlemeSayfayaGit={inventoryData.urunDuzenlemeSayfayaGit}
              toplamUrunDuzenlemeSayfa={inventoryData.toplamUrunDuzenlemeSayfa}
              sayfadakiStokLoglari={inventoryData.sayfadakiStokLoglari}
              stokLogBaslangic={inventoryData.stokLogBaslangic}
              stokLogSayfa={inventoryData.stokLogSayfa}
              setStokLogSayfa={inventoryData.setStokLogSayfa}
              toplamStokLogSayfa={inventoryData.toplamStokLogSayfa}
            />
          )}

          {aktifSayfa === 'faturalama' && (
            <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Faturalama ekranı yükleniyor...</section>}>
              <InvoicesPanel
                KucukIkon={KucukIkon}
                invoicesData={invoicesData}
                paraFormatla={paraFormatla}
                tarihFormatla={tarihFormatla}
                urunler={urunler}
              />
            </Suspense>
          )}

          {aktifSayfa === 'envanter' && (
            <InventoryPage
              KucukIkon={KucukIkon}
              BosDurumKarti={BosDurumKarti}
              MobilKart={MobilKart}
              eklemePenceresiniAc={inventoryData.eklemePenceresiniAc}
              envanterKategori={inventoryData.envanterKategori}
              setEnvanterKategori={inventoryData.setEnvanterKategori}
              envanterSayfa={inventoryData.envanterSayfa}
              setEnvanterSayfa={inventoryData.setEnvanterSayfa}
              envanterSayfayaGit={inventoryData.envanterSayfayaGit}
              toplamEnvanterSayfa={inventoryData.toplamEnvanterSayfa}
              aramaMetni={inventoryData.aramaMetni}
              setAramaMetni={inventoryData.setAramaMetni}
              sayfadakiUrunler={inventoryData.sayfadakiUrunler}
              sayfaBaslangic={inventoryData.sayfaBaslangic}
              favoriDegistir={inventoryData.favoriDegistir}
              duzenlemePenceresiniAc={inventoryData.duzenlemePenceresiniAc}
              setSilinecekUrun={inventoryData.setSilinecekUrun}
              loading={inventoryData.loading}
            />
          )}
        </div>
      </section>

      {aktifSayfa !== 'merkez' && (
        <>
          <div className={`global-arama-kapsayici ${searchData.globalAramaMobilAcik || searchData.globalAramaMetni ? 'acik' : ''}`}>
            <button
              type="button"
              className="global-arama-mobil-dugme"
              aria-label="Global aramayı aç"
              onClick={() => searchData.setGlobalAramaMobilAcik((onceki) => !onceki)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>

            <div className="global-arama-alani">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                value={searchData.globalAramaMetni}
                onChange={(event) => searchData.setGlobalAramaMetni(event.target.value)}
                placeholder="Ürün, sipariş, müşteri veya tedarikçi ara"
              />
              {searchData.globalAramaMetni && (
                <button type="button" className="global-arama-temizle" aria-label="Aramayı temizle" onClick={searchData.aramayiTemizle}>
                  ×
                </button>
              )}
            </div>

            {searchData.globalAramaMetni.trim() && (
              <div className="global-arama-sonuclar">
                {searchData.globalAramaSonuclari.length === 0 ? (
                  <div className="global-arama-bos">
                    <strong>Sonuç bulunamadı.</strong>
                    <span>Başka bir anahtar kelime deneyin.</span>
                  </div>
                ) : (
                  searchData.globalAramaSonuclari.map((sonuc) => (
                    <button
                      key={sonuc.id}
                      type="button"
                      className="global-arama-sonuc"
                      onClick={() => searchData.globalAramaSonucunuAc(sonuc)}
                    >
                      <span className="global-arama-etiket">{sonuc.tur}</span>
                      <strong>{sonuc.baslik}</strong>
                      <small>{sonuc.alt}</small>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="bildirim-dugmesi"
            aria-label="Bildirimler"
            onClick={appNotifications.bildirimDugmesiTikla}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17H5l2-2v-4a5 5 0 1 1 10 0v4l2 2h-4" />
              <path d="M10 17a2 2 0 0 0 4 0" />
            </svg>
            {appNotifications.okunmamisBildirimSayisi > 0 && <span className="bildirim-sayisi">{appNotifications.okunmamisBildirimSayisi}</span>}
          </button>
        </>
      )}

      {aktifSayfa !== 'merkez' && appNotifications.bildirimPanelAcik && (
        <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Bildirimler yükleniyor...</section>}>
          <BildirimPaneli
            KucukIkon={KucukIkon}
            bildirimPanelKapaniyor={appNotifications.bildirimPanelKapaniyor}
            bildirimPaneliKapat={appNotifications.bildirimPaneliKapat}
            bildirimdenSayfayaGit={appNotifications.bildirimdenSayfayaGit}
            bildirimler={appNotifications.bildirimler}
            bildirimiOkunduYap={appNotifications.bildirimiOkunduYap}
            bildirimiOkunmadiYap={appNotifications.bildirimiOkunmadiYap}
            bildirimiTemizle={appNotifications.bildirimiTemizle}
            okunanBildirimler={appNotifications.okunanBildirimler}
            tumBildirimleriTemizle={appNotifications.tumBildirimleriTemizle}
          />
        </Suspense>
      )}

      {aktifSayfa !== 'merkez' && (
        <button
          type="button"
          className="barkod-dugmesi"
          aria-label="Barkod tara"
          title="Barkod Tara"
          onClick={inventoryData.barkodModaliniAc}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 8V6a2 2 0 0 1 2-2h2" />
            <path d="M20 8V6a2 2 0 0 0-2-2h-2" />
            <path d="M4 16v2a2 2 0 0 0 2 2h2" />
            <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
            <path d="M8 7v10" />
            <path d="M10.5 6.5v11" />
            <path d="M13 7.5v9" />
            <path d="M15.5 6.5v11" />
          </svg>
        </button>
      )}

      {aktifSayfa !== 'merkez' && (
        <button
          type="button"
          className="ai-yardim-buton"
          aria-label="Yapay zeka yardımı"
          onClick={appNotifications.aiPanelDugmeTikla}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 9h8M8 13h5" />
          </svg>
        </button>
      )}

      <BottomNav aktifSayfa={aktifSayfa} sayfaDegistir={sayfaDegistir} />

      {aktifSayfa !== 'merkez' && appNotifications.aiPanelAcik && !appNotifications.aiPanelKucuk && (
        <Suspense fallback={<section className="panel-kart lazy-panel-bekleme">Asistan yükleniyor...</section>}>
          <AiPanel
            KucukIkon={KucukIkon}
            TemaIkonu={TemaIkonu}
            aiHizliKonular={appNotifications.aiHizliKonular}
            aiHizliKonularAcik={appNotifications.aiHizliKonularAcik}
            aiMesajGonder={appNotifications.aiMesajGonder}
            aiMesajMetni={appNotifications.aiMesajMetni}
            aiMesajlar={appNotifications.aiMesajlar}
            aiPanelKapaniyor={appNotifications.aiPanelKapaniyor}
            aiPaneliKapat={appNotifications.aiPaneliKapat}
            aiTemaMenuAcik={appNotifications.aiTemaMenuAcik}
            aiYukleniyor={appNotifications.aiYukleniyor}
            setAiMesajMetni={appNotifications.setAiMesajMetni}
            setAiHizliKonularAcik={appNotifications.setAiHizliKonularAcik}
            setAiPanelKucuk={appNotifications.setAiPanelKucuk}
            setAiTemaMenuAcik={appNotifications.setAiTemaMenuAcik}
            sohbetiTemizle={appNotifications.sohbetiTemizle}
          />
        </Suspense>
      )}

      <OrderModals ordersData={ordersData} paraFormatla={paraFormatla} tarihFormatla={tarihFormatla} />

      <Suspense fallback={null}>
        <CustomerModals customersData={customersData} />
      </Suspense>

      <Suspense fallback={null}>
        <FinanceModals financeData={financeData} />
      </Suspense>

      <Suspense fallback={null}>
        <InventoryModals inventoryData={inventoryData} />
      </Suspense>

      <BarcodeStockModal inventoryData={inventoryData} />

      <Suspense fallback={null}>
        <SupplierModals
          suppliersData={suppliersData}
          paraFormatla={paraFormatla}
          tarihFormatla={tarihFormatla}
        />
      </Suspense>

      <Suspense fallback={null}>
        <InvoiceModals
          invoicesData={invoicesData}
          paraFormatla={paraFormatla}
          tarihFormatla={tarihFormatla}
        />
      </Suspense>
    </main>
  )
}

export default App

