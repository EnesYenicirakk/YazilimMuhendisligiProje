# K6 Performans Test Sonuçları

Bu rapor, yapılan Load (Yük), Stress (Stres) ve Spike (Sıçrama) testlerinin sonuçlarını içermektedir.

## 1. Test Özetleri

### Load Test (Yük Testi)
- **Hedef:** 100 eşzamanlı kullanıcı (VU).
- **Süre:** 10 dakika.
- **Sonuç:** Sistem 100 VU altında kararlı bir şekilde çalıştı. Ortalama yanıt süresi 100ms'nin altında kaldı.
- **Başarı Oranı:** %100

### Stress Test (Stres Testi)
- **Hedef:** 500 eşzamanlı kullanıcıya kadar kademeli artış.
- **Süre:** Yaklaşık 16 dakika planlandı (4.5 dakikada eşik değerleri aşıldığı için durduruldu).
- **Gözlemler:**
    - 100 VU'ya kadar performans mükemmel.
    - 200+ VU'da yanıt süreleri (latency) artmaya başladı.
    - 500 VU'da bazı istekler zaman aşımına uğradı (p95: ~1.5s).
- **Hata Oranı:** %1'in üzerine çıktı (Threshold crossed).
- **Maksimum İstek Hızı:** ~205 istek/saniye.

### Spike Test (Sıçrama Testi)
- **Hedef:** Aniden 500 kullanıcıya çıkış.
- **Sonuç:** Sistem anlık yük altında kısa süreli yavaşlama yaşasa da ayakta kaldı. Önbellekleme (Caching) sayesinde oda listeleme gibi "hot" endpointler etkilenmedi.

## 2. Metrik Tablosu (Stres Testi Verileri)

| Metrik | Değer | Açıklama |
| :--- | :--- | :--- |
| **http_req_duration (avg)** | 558.58 ms | İstek başına ortalama süre |
| **http_req_duration (p95)** | 1.59 s | İsteklerin %95'inin tamamlanma süresi |
| **http_reqs** | 55,350 | Toplam yapılan istek sayısı |
| **http_reqs (per sec)** | 205.04 | Saniyedeki istek sayısı (Throughput) |
| **http_req_failed** | > %1 | Başarısız istek oranı (Eşik aşıldı) |
| **VUs (Max)** | 500 | Ulaşılan maksimum eşzamanlı kullanıcı |

## 3. Yapılan Optimizasyonlar ve Etkileri

1.  **Veritabanı İndeksleme:** `Reservation` ve `Notification` modellerine eklenen indeksler sayesinde sorgu süreleri büyük ölçüde azaldı.
2.  **Yanıt Önbellekleme (Caching):** `/api/rooms` endpointi için `node-cache` kullanıldı. Önbellekten dönen yanıtlar **<10ms** içinde tamamlanmaktadır.
3.  **Middleware Optimizasyonu:** Gereksiz loglama ve ara işlemler temizlendi.

## 4. Öneriler

*   **Redis Geçişi:** Mevcut in-memory cache yerine Redis kullanarak çoklu sunucu (cluster) desteği sağlanmalı.
*   **Bağlantı Havuzu (Pool):** DB bağlantı havuzu ayarları yüksek yükler için tekrar gözden geçirilmeli.
*   **Yatay Ölçekleme:** 500+ kullanıcı trafiği beklendiğinde Load Balancer ve birden fazla backend instance kullanımına geçilmeli.
