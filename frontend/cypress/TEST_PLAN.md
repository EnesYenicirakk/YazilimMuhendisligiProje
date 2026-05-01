# Cypress E2E Test Planı

Bu plan stok takip uygulamasının yalnızca local/dev/test ortamında çalışan güvenli uçtan uca testlerini kapsar.

## Güvenlik Sınırları

- Cypress `baseUrl` `http://127.0.0.1:5173`, API yardımcıları `http://127.0.0.1:8000/api` kullanır.
- API helper'ları local host dışında çalışırsa test içinde hata verir.
- Test verileri `TEST_` prefix'i ile oluşturulur.
- Toplu silme, truncate, drop, delete-all veya prefix'e göre silme yoktur.
- Silme testleri gerçek silme onayı vermez; yalnızca modal açılıp iptal edilir.
- Dış servis, ödeme, SMS, mail, kargo, fatura gönderimi veya production secret kullanılmaz.
- Backend unit/integration sorumlulukları Cypress'e taşınmaz.

## Kapsam

1. Authentication
   - Geçerli test kullanıcısı ile giriş.
   - Hatalı girişte formda kalma ve token yazılmaması.

2. Dashboard
   - Dashboard sayfasının açılması.
   - Özet kartlarının görünmesi.
   - Dashboard üzerinden envantere geçiş.

3. Envanter ve Ürün Yönetimi
   - `TEST_` ürün ekleme ve listeleme.
   - Sadece kendi `TEST_` ürününde stok güncelleme.
   - Ürün yönetimi ekranında ürün bilgilerini doğrulama.
   - Eksik ürün formu validasyonu.
   - Silme modalını açıp iptal etme.

4. Siparişler
   - `TEST_` müşteri ve `TEST_` ürün ile sipariş oluşturma.
   - Sipariş sonrası yalnızca test ürününün mağaza stok değerinin azalmasını doğrulama.
   - Eksik/hatalı sipariş formunda modalın kapanmaması.
   - Sipariş detay modalı.
   - İptal modalını açıp iptalden vazgeçme.

5. Müşteriler
   - `TEST_` müşteri ekleme ve listede arama.
   - Müşteri silme modalını açıp iptal etme.

6. Finans
   - Finans özetlerinin görünmesi.
   - Tahsilat/ödeme sekmeleri arasında kayıt değiştirmeden gezinme.

## Bilerek Yapılmayanlar

- Ürün, müşteri veya sipariş kalıcı silme onayı.
- Gerçek kullanıcı/müşteri/sipariş datası ile işlem.
- Fatura PDF üretimi, dosya upload/export/import veya dış servis tetikleyen akışlar.
- Performans/yük/güvenlik testleri.
- Production ortamına yönelik test çalıştırma.
