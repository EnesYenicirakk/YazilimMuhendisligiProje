## 1. CODEBASE TOPOLOGY & BOTTLENECKS
- [frontend/src/styles/common.css](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/styles/common.css):1 is the largest file at 5,722 lines. Breakdown: 1-735 root tokens + login screen; 736-1347 shell/menu/global search/notification panel; 1348-1665 AI panel; 1701-2258 merkez/home hub animations; 2259-3059 shared page/table/modal/invoice styles; 3068-5627 responsive overrides and dashboard/mobile variants; 5629-5722 swipe-card mechanics for `MobilKart`. Real styling is centralized here; [frontend/src/App.css](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.css):1 only imports CSS, while [frontend/src/styles/dashboard.css](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/styles/dashboard.css):1, [frontend/src/styles/siparisler.css](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/styles/siparisler.css):1, and [frontend/src/styles/musteriler.css](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/styles/musteriler.css):1 are near-stubs.
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):619 is the main bottleneck at 5,187 lines with 106 `useState`, 26 `useMemo`, and 15 `useEffect`. Breakdown: 1-618 constants, seed data, helpers, PDF/HTML builders, icon helpers; 619-745 all app state declarations; 747-1235 derived selectors and computed data; 1237-1306 effects; 1308-2857 all mutations/side effects/CRUD handlers; 2859-2972 login render; 2974-3179 app shell + merkez render; 3181-3476 dashboard render; 3478-4238 page branches; 4247-4404 global search/notifications/AI shell; 4406-5187 toast stack and every modal for every feature.
- [frontend/src/components/common/Ikonlar.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/Ikonlar.jsx):1 is the second JS bottleneck at 576 lines. Breakdown: 1-259 `KucukIkon`; 261-455 mock datasets/factories/`tarihFormatla`; 461-558 `SayfaIkonu`; 559-576 mixed exports. This file currently mixes UI components, shared utilities, and feature seed data in one module.
- [frontend/src/features/tedarikciler/TedarikcilerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/tedarikciler/TedarikcilerPaneli.jsx):1 is 305 lines, but it is only a partial feature shell. Breakdown: 1-33 prop contract; 35-177 supplier list tab; 179-303 supplier orders tab. Actual supplier CRUD/detail modals still live in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):4733.
- [frontend/src/features/siparisler/SiparislerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/siparisler/SiparislerPaneli.jsx):1 is 301 lines. Breakdown: 1-33 prop contract; 35-191 active orders tab; 193-300 archived orders tab. Actual add/edit/status/delete modals still live in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):4442.
- [frontend/src/FaturalamaPanel.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturalamaPanel.jsx):1 is 285 lines. Breakdown: 1-25 prop contract; 27-209 invoice composer tab; 211-284 invoice history tab. Invoice document generation and preview side effects still live in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):2557.
- [frontend/src/FaturaModallari.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturaModallari.jsx):1 is 196 lines and duplicates invoice preview markup already present in `FaturalamaPanel.jsx` and `App.jsx` HTML builders.
- [frontend/src/components/common/MobilKart.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/MobilKart.jsx):1 is only 144 lines but is behavior-heavy. It owns gesture state, DOM listeners, and swipe-action rendering, so it is a reusable interaction primitive, not a pure presentational card.
- [frontend/src/main.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/main.jsx):1 shows there is no router/provider stack. `App` is mounted directly under a local error boundary.

## 2. DEPENDENCY & STATE ANALYSIS
- Import graph today is: [frontend/src/main.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/main.jsx):4 -> [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):1; `App.jsx` imports [frontend/src/components/common/Ikonlar.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/Ikonlar.jsx):559, [frontend/src/components/common/MobilKart.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/MobilKart.jsx):1, [frontend/src/components/common/BosDurumKarti.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/BosDurumKarti.jsx):1, and lazily loads [frontend/src/FaturalamaPanel.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturalamaPanel.jsx):1, [frontend/src/FaturaModallari.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturaModallari.jsx):1, [frontend/src/AiPanel.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/AiPanel.jsx):1, [frontend/src/BildirimPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/BildirimPaneli.jsx):1, [frontend/src/features/siparisler/SiparislerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/siparisler/SiparislerPaneli.jsx):1, [frontend/src/features/musteriler/MusterilerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/musteriler/MusterilerPaneli.jsx):1, and [frontend/src/features/tedarikciler/TedarikcilerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/tedarikciler/TedarikcilerPaneli.jsx):1.
- Global/local state is not truly global; it is centralized local state in `App.jsx`, which functions as an in-memory store. There is no `Context`, no router, no reducer, no external store, and no API layer.
- Auth/login state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):620 is `username`, `password`, `isLoggedIn`, `loginGecisiAktif`, `error`, `sifreGorunur`.
- Shell/navigation/dashboard shell state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):626 is `aktifSayfa`, `mobilMenuAcik`, `toastlar`, `sonGeriAlma`, `gizlenenOzetKartlari`, `acikOzetMenusu`, `dashboardBolumMenusuAcik`, `gorunenDashboardBolumleri`, `gecisBalonu`, `merkezeDonusAktif`, `merkezGirisEfekti`, `globalAramaMetni`, `globalAramaMobilAcik`.
- Inventory/product state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):636 is `urunler`, `aramaMetni`, `envanterKategori`, `envanterSayfa`, `eklemeAcik`, `duzenlemeAcik`, `silinecekUrun`, `seciliUid`, `form`, `urunDuzenlemeArama`, `urunDuzenlemeSayfa`, `urunDuzenlemeSekmesi`, `stokLogSayfa`, `urunDuzenlemeModalAcik`, `silinecekDuzenlemeUrunu`, `urunDuzenlemeUid`, `urunDuzenlemeFormu`.
- Orders state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):641 is `siparisler`, `siparisArama`, `siparisOdemeFiltresi`, `siparisSekmesi`, `siparisSayfa`, `gecmisSiparisArama`, `gecmisSiparisSayfa`, `yeniSiparisAcik`, `detaySiparis`, `detayGecmisSiparis`, `duzenlenenSiparisNo`, `durumGuncellenenSiparisNo`, `silinecekSiparis`, `siparisFormu`, `siparisDurumFormu`, `gecmisSiparisler`.
- Finance state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):639 is `gelenNakitListesi`, `gidenNakitListesi`, `odemeSekmesi`, `gelenSayfa`, `gidenSayfa`, `duzenlenenOdeme`, `odemeFormu`, `silinecekOdeme`.
- Customer state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):675 is `musteriler`, `musteriArama`, `musteriSayfa`, `musteriEklemeAcik`, `musteriDuzenlemeAcik`, `musteriNotAcik`, `seciliMusteriUid`, `musteriFormu`, `musteriNotMetni`, `silinecekMusteri`.
- Supplier state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):677 is `tedarikciler`, `tedarikciArama`, `tedarikciSekmesi`, `tedarikciSayfa`, `tedarikciSiparisSayfa`, `tedarikciDetaySekmesi`, `tedarikciEklemeAcik`, `tedarikciDuzenlemeAcik`, `tedarikciNotAcik`, `tedarikciDetayAcik`, `seciliTedarikciUid`, `tedarikciFormu`, `tedarikciNotMetni`, `silinecekTedarikci`, `tedarikciSiparisEklemeAcik`, `tedarikciSiparisFormu`, `genelTedarikSiparisAcik`, `genelTedarikSiparisFormu`.
- Invoice state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):739 is `faturalar`, `faturaSekmesi`, `faturaArama`, `faturaFormu`, `faturaDetayAcik`, `seciliFaturaId`, `pdfOnizlemeAcik`.
- AI/notification state in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):689 is `aiPanelAcik`, `aiPanelKucuk`, `aiPanelKapaniyor`, `bildirimPanelAcik`, `bildirimPanelKapaniyor`, `okunanBildirimler`, `temizlenenBildirimler`, `aiTemaMenuAcik`, `aiMesajMetni`, `aiHizliKonularAcik`, `aiMesajlar`.
- Shared dependency graph is severe: `urunler` feeds inventory filters, product-editor filters, dashboard critical stock, global search, invoice line price resolution, and invoice preview; `siparisler` feeds order lists, dashboard metrics, notifications, AI canned replies, weekly chart, and global search; `tedarikciler` feeds supplier pages, aggregated supplier orders, invoice counterparties, invoice print/PDF lookup, and global search; `musteriler` feeds customer pages, order phone lookup, invoice counterparties, invoice print/PDF lookup, and global search.
- There is hidden relational coupling by display text. Orders do not store `musteriUid`; [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):1826 resolves customers by normalized name, then falls back to `siparisMusteriTelefonlari` from [frontend/src/components/common/Ikonlar.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/Ikonlar.jsx):322. This is fragile and will break if display names change.
- There is another hidden shape mismatch in invoicing. [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):839 synthesizes customer invoice fields (`adres`, `vergiNo`) because customer entities do not actually own invoice-ready data. Invoice rendering later accepts both `vergiNumarasi` and `vergiNo`.
- The most severe prop drilling chains are `App.jsx -> SiparislerPaneli.jsx -> MobilKart.jsx` with `setDetaySiparis`, `siparisDuzenlemeAc`, `siparisDurumGuncellemeAc`, `setSilinecekSiparis`, `siparisMusteriAra`, `setSiparisSekmesi`, `setSiparisArama`, `setSiparisOdemeFiltresi`, `setSiparisSayfa`, `setGecmisSiparisArama`, `setGecmisSiparisSayfa`.
- The next most severe chain is `App.jsx -> MusterilerPaneli.jsx -> MobilKart.jsx` with `musteriFavoriDegistir`, `musteriNotAc`, `musteriDuzenlemeAc`, `telefonAramasiBaslat`, `setSilinecekMusteri`, `setMusteriArama`, `setMusteriSayfa`, `musteriSayfayaGit`.
- The supplier chain is `App.jsx -> TedarikcilerPaneli.jsx -> MobilKart.jsx` with `tedarikciDetayAc`, `tedarikciFavoriDegistir`, `tedarikciNotAc`, `tedarikciDuzenlemeAc`, `telefonAramasiBaslat`, `setSilinecekTedarikci`, `genelTedarikSiparisEklemeAc`, plus whole collections `tedarikciler` and `seciliTedarikci`.
- `App.jsx -> FaturalamaPanel.jsx` is not multi-hop, but the prop surface is extremely wide: `faturaFormu`, `faturaFormuGuncelle`, `faturaKarsiTarafDegistir`, `faturaKarsiTaraflar`, `faturaKaydet`, `faturaOnizleme`, `faturaPdfOnizlemeAc`, `faturaSatiriEkle`, `faturaSatiriGuncelle`, `faturaSatiriSil`, `faturaSekmesi`, `faturaTuruDegistir`, `faturayiPdfIndir`, `faturayiYazdir`, `filtreliFaturalar`, `setFaturaArama`, `setFaturaSekmesi`, `urunler`, `paraFormatla`, `tarihFormatla`.
- `App.jsx -> AiPanel.jsx` passes raw setters directly: `setAiMesajMetni`, `setAiHizliKonularAcik`, `setAiPanelKucuk`, `setAiTemaMenuAcik`. `App.jsx -> BildirimPaneli.jsx` does the same with notification mutations.
- There are no API calls today. There is no `fetch`, `axios`, or service layer. Tightly coupled business logic inside UI components is instead: invoice HTML/PDF/print generation in [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):456 and :2557; search indexing and cross-page navigation in :941 and :1971; analytics/notifications/AI response generation in :1051, :1094, and :1171; CRUD validation and undo logic in :1443, :1674, :2063, :2222, :2369, :2670, and :2767; telephone launch in :1817; DOM/iframe/container manipulation in :2566 and :2611.

## 3. TARGET ARCHITECTURE (CLEAN & MODULAR)
```text
frontend/src/
  app/
    AppShell.jsx
    PageRouter.jsx
    hooks/useShellController.js
    providers/ErrorBoundary.jsx
  data/
    seeds/
      inventory.seed.js
      orders.seed.js
      customers.seed.js
      suppliers.seed.js
      finance.seed.js
      invoices.seed.js
      stockLogs.seed.js
  shared/
    ui/
      EmptyStateCard.jsx
      MobileSwipeCard.jsx
      icons/KucukIkon.jsx
      icons/SayfaIkonu.jsx
    utils/
      formatters.js
      text.js
      validators.js
      pagination.js
  services/
    browser/phone.service.js
    browser/print.service.js
    pdf/invoiceHtml.service.js
    pdf/invoicePdf.service.js
    search/globalSearch.service.js
    ai/cannedReplies.service.js
  features/
    auth/components/LoginScreen.jsx
    dashboard/components/DashboardPage.jsx
    dashboard/hooks/useDashboardMetrics.js
    dashboard/hooks/useNotifications.js
    inventory/components/InventoryPage.jsx
    inventory/components/InventoryModals.jsx
    inventory/hooks/useInventoryState.js
    inventory/selectors.js
    product-editor/components/ProductEditorPage.jsx
    product-editor/components/ProductEditorModals.jsx
    product-editor/hooks/useProductEditorState.js
    product-editor/selectors.js
    orders/components/OrdersPage.jsx
    orders/components/OrderModals.jsx
    orders/hooks/useOrdersState.js
    orders/selectors.js
    customers/components/CustomersPage.jsx
    customers/components/CustomerModals.jsx
    customers/hooks/useCustomersState.js
    customers/selectors.js
    suppliers/components/SuppliersPage.jsx
    suppliers/components/SupplierDetailModal.jsx
    suppliers/components/SupplierModals.jsx
    suppliers/hooks/useSuppliersState.js
    suppliers/selectors.js
    finance/components/FinancePage.jsx
    finance/components/FinanceModals.jsx
    finance/hooks/useFinanceState.js
    finance/selectors.js
    invoices/components/InvoicesPage.jsx
    invoices/components/InvoicePreview.jsx
    invoices/components/InvoiceModals.jsx
    invoices/hooks/useInvoicesState.js
    invoices/selectors.js
    invoices/model.js
  styles/
    tokens.css
    base.css
    app-shell.css
    features/*.css
```
- `AppShell.jsx` must only orchestrate `aktifSayfa`, lazy loading, top-level overlays, and composition. It must not own feature CRUD rules, invoice generation, search indexing, or analytics.
- UI components must be pure. No `window`, `document`, `Date.now()` IDs, validation, filtering, sorting, PDF generation, or cross-feature navigation matrices inside presentational components.
- Every feature gets one hook as its first extraction boundary. Hooks may own state/effects/commands for one feature only and must return a stable view-model.
- Every `selectors.js` file must be pure and React-free. Put filters, sorting, pagination, aggregations, and search record building there.
- `services/browser` and `services/pdf` must own all iframe/DOM/`window.location.href`/dynamic import side effects.
- `shared/ui/icons` must contain only icon components. Seed data and formatters must never remain in the same file as React components.
- `data/seeds` is the only acceptable place for mock in-memory data until a backend exists.
- Keep compatibility barrels during migration. Example: leave `Ikonlar.jsx` as a temporary re-export file first, then delete it only after all imports move.

## 4. THE GRANULAR, ZERO-REGRESSION ROADMAP
- Verification rule for every phase: only touch one feature boundary at a time; keep public prop names stable until that feature is fully moved; smoke-test only the touched feature; compare against the current lint baseline instead of trying to “clean lint” globally because the repo currently has 223 errors and 11 warnings, mostly `react/prop-types` noise.
- Phase 0A: Create a characterization checklist before refactoring. Cover login, merkez navigation, dashboard cards, inventory add/edit/delete/undo, product-editor edit/delete, active and archived orders, customer add/edit/note/delete, supplier detail/add/edit/note/delete/order creation, finance edit/delete, invoice create/preview/print/PDF, global search, notifications, AI panel, and mobile swipe cards.
- Phase 1A: Extract `KucukIkon` and `SayfaIkonu` from [frontend/src/components/common/Ikonlar.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/Ikonlar.jsx):1 into `src/shared/ui/icons/KucukIkon.jsx` and `src/shared/ui/icons/SayfaIkonu.jsx`. Keep `Ikonlar.jsx` as a compatibility barrel re-exporting the same names.
- Phase 1B: Extract seed data from [frontend/src/components/common/Ikonlar.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/Ikonlar.jsx):261 into `src/data/seeds/*.js`. Keep old exports alive from `Ikonlar.jsx` until all consumers move.
- Phase 1C: Extract pure helpers from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):39 and :410 into `src/shared/utils/formatters.js`, `text.js`, `validators.js`, `pagination.js`, and `features/invoices/model.js`. Do not change JSX yet.
- Phase 1D: Extract browser/PDF side effects from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):456, :584, :2557, and :2601 into `src/services/pdf/invoiceHtml.service.js`, `invoicePdf.service.js`, and `src/services/browser/print.service.js`. Keep handler signatures in `App.jsx` unchanged after the first move.
- Phase 2A: Extract shell controller state from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):620-635, :689-703, :1237-1306, :1308-1415, and :1901-2023 into `src/app/hooks/useShellController.js`. This hook should own `aktifSayfa`, shell resets, toast/undo, global search visibility, AI open/close, and notification open/close.
- Phase 2B: Extract `ToastStack`, `GlobalSearchBar`, and notification trigger UI from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):4247 and :4406 into `src/app/components/*.jsx`, still wired to `useShellController`.
- Phase 3A: Extract inventory selectors from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):747 and :763 into `src/features/inventory/selectors.js`.
- Phase 3B: Extract inventory state/actions from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):684 and :1417 into `src/features/inventory/hooks/useInventoryState.js`.
- Phase 3C: Move inventory JSX from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):4082 and inventory modals from :5068 into `src/features/inventory/components/InventoryPage.jsx` and `InventoryModals.jsx`.
- Phase 4A: Extract product-editor selectors/state from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):763, :782, :1531, and :1592 into `src/features/product-editor/selectors.js` and `hooks/useProductEditorState.js`.
- Phase 4B: Move product-editor JSX from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):3766 into `src/features/product-editor/components/ProductEditorPage.jsx`. Keep `stokDegisimLoglari` read-only until this phase is stable.
- Phase 5A: Extract order selectors from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):888, :910, :1051, and :2820 into `src/features/orders/selectors.js`.
- Phase 5B: Extract order state/actions from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):641 and :1633 into `src/features/orders/hooks/useOrdersState.js`.
- Phase 5C: Move list/history JSX from [frontend/src/features/siparisler/SiparislerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/siparisler/SiparislerPaneli.jsx):1 and order modals from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):4442 into `src/features/orders/components/OrdersPage.jsx` and `OrderModals.jsx`. Preserve current string-based customer linking for this phase; do not introduce IDs yet.
- Phase 6A: Extract customer selectors/state/actions from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):786 and :2025 into `src/features/customers/selectors.js` and `hooks/useCustomersState.js`.
- Phase 6B: Move customer page JSX from [frontend/src/features/musteriler/MusterilerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/musteriler/MusterilerPaneli.jsx):1 and customer modals from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):4642 into `src/features/customers/components/CustomersPage.jsx` and `CustomerModals.jsx`.
- Phase 7A: Extract supplier selectors from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):802 and :820 into `src/features/suppliers/selectors.js`.
- Phase 7B: Extract supplier state/actions from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):677 and :2160 into `src/features/suppliers/hooks/useSuppliersState.js`.
- Phase 7C: Move supplier page JSX from [frontend/src/features/tedarikciler/TedarikcilerPaneli.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/features/tedarikciler/TedarikcilerPaneli.jsx):1 and supplier modals/detail from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):4733 into `src/features/suppliers/components/SuppliersPage.jsx`, `SupplierDetailModal.jsx`, and `SupplierModals.jsx`.
- Phase 8A: Extract finance selectors/state/actions from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):1152 and :2743 into `src/features/finance/selectors.js` and `hooks/useFinanceState.js`.
- Phase 8B: Move finance page JSX from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):3569 and finance modals from :4604 into `src/features/finance/components/FinancePage.jsx` and `FinanceModals.jsx`.
- Phase 9A: Extract invoice selectors/model from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):271 and :839 into `src/features/invoices/model.js` and `selectors.js`.
- Phase 9B: Extract invoice state/actions from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):739 and :2485 into `src/features/invoices/hooks/useInvoicesState.js`.
- Phase 9C: Create one shared `InvoicePreview.jsx` and replace the duplicated preview markup in [frontend/src/FaturalamaPanel.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturalamaPanel.jsx):1 and [frontend/src/FaturaModallari.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturaModallari.jsx):1 before touching print/PDF behavior again.
- Phase 9D: Move invoice page and invoice modals to `src/features/invoices/components/InvoicesPage.jsx` and `InvoiceModals.jsx`, replacing [frontend/src/FaturalamaPanel.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturalamaPanel.jsx):1 and [frontend/src/FaturaModallari.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturaModallari.jsx):1 with temporary wrappers first.
- Phase 10A: Extract dashboard metrics, notifications, AI canned replies, and global-search record building from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):930-1230 and :1834-2023 into `src/features/dashboard/hooks/useDashboardMetrics.js`, `useNotifications.js`, `src/services/ai/cannedReplies.service.js`, and `src/services/search/globalSearch.service.js`.
- Phase 10B: Move login, merkez, and dashboard render blocks from [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):2859 and :3181 into `src/features/auth/components/LoginScreen.jsx`, `src/app/components/HomeHub.jsx`, and `src/features/dashboard/components/DashboardPage.jsx`.
- Phase 11A: Collapse [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):619 into a thin `AppShell` that only composes hooks and page components.
- Phase 11B: Split [frontend/src/styles/common.css](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/styles/common.css):1 last, not first. Keep class names stable; move tokens/base/shell/feature rules into separate files without changing selectors during the move.

## 5. HIGH-RISK ZONES
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):1325 `sayfaDegistir` is the highest-risk function. It resets more than 25 pieces of feature state; partial extraction without preserving this reset matrix will leave stale modals, stale search terms, or broken tab state.
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):636 `urunler` is shared by inventory, product-editor, dashboard critical stock, global search, and invoice pricing. Any shape change here is cross-feature.
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):638 `siparisler` is shared by orders UI, dashboard metrics, AI replies, notifications, weekly charts, and global search. This is the second major pseudo-global dataset.
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):677 `tedarikciler` plus `seciliTedarikciUid` drives supplier list, supplier detail modal, aggregated supplier orders, invoice counterparties, invoice print/PDF lookup, and search. Refactor this feature only after selectors are extracted.
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):839 `faturaKarsiTaraflar`, `seciliFaturaKarsiTaraf`, `faturaOnizleme`, `seciliFaturaId`, `faturayiYazdir`, and `faturayiPdfIndir` form one coupled invoice pipeline. The preview, modal preview, print HTML, and PDF export must be kept in lockstep.
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):941 `globalAramaSonuclari` and [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):1971 `globalAramaSonucunuAc` are cross-feature routers. They mutate search state, tabs, pages, selected entity IDs, and modal visibility across multiple domains.
- [frontend/src/App.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/App.jsx):1393 `toastlar` and `sonGeriAlma` are a shared undo framework used by product, order, customer, supplier, and finance deletions. If this contract changes, every delete flow regresses at once.
- [frontend/src/components/common/Ikonlar.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/components/common/Ikonlar.jsx):559 is a mixed-export hot spot. Lint already flags it for Fast Refresh incompatibility, and many files depend on it for unrelated reasons.
- [frontend/src/FaturalamaPanel.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturalamaPanel.jsx):1 and [frontend/src/FaturaModallari.jsx](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/FaturaModallari.jsx):1 duplicate invoice presentation. If one copy changes without the others, preview/PDF/print parity breaks immediately.
- [frontend/src/styles/common.css](c:/Users/rojha/OneDrive/Belgeler/GitHub/YazilimMuhendisligiProje/frontend/src/styles/common.css):1 is a global cascade risk. Selector changes here can silently break unrelated pages because feature CSS is not truly isolated.
