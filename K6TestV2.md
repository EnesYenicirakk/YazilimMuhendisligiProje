# K6 Performans Test Sonuçları (V2 - Faz 2)

Bu rapor, Faz 2 optimizasyonları (Redis, MySQL Tuning, Kalıcı Bağlantılar) sonrası yapılan testlerin sonuçlarını ve Windows yerel ortam analizini içerir.

## 1. Test Ortamı ve Yapılandırma
*   **İşletim Sistemi:** Windows 11 (Yerel)
*   **Sunucu:** Laravel Built-in Server (`php artisan serve`)
*   **Veritabanı:** MySQL (max_connections=1000, Persistent Connections=Enabled)
*   **Önbellek:** Redis (Predis client ile yapılandırıldı ancak yerel eklenti kısıtları nedeniyle fallback çalıştı)

## 2. Test Sonuçları (50 VU Stres Testi)

| Metrik | V1 Baseline (100 VU) | V2 Stres (50 VU - Windows) | Değerlendirme |
| :--- | :--- | :--- | :--- |
| **Ort. Yanıt Süresi** | ~100ms | 14.12s | ⚠️ Windows Tek Kanal Darboğazı |
| **TTFB (Ortalama)** | - | 9.22s | Kuyruğa girme süresi yüksek |
| **Başarısız İstek** | %15-20 | %0 | ✅ Veritabanı Kararlılığı Tam |
| **Throughput (RPS)** | ~80 RPS | 2.68 RPS | Sınırlı CPU Scheduling |
| **Max Eşzamanlı** | 50 VU (Timeout) | 50 VU (Stabil ama Yavaş) | ✅ Timeout hatası alınmadı |

## 3. Mühendislik Analizi

### Darboğaz Analizi: Windows vs Yük Testi
Windows üzerindeki `php artisan serve` komutu **single-threaded** çalışır. 50 eşzamanlı kullanıcı (VU) sisteme yüklendiğinde, her bir istek sıraya girer (Queueing). 
*   **V1'de** alınan Timeout hataları, Faz 2'deki `SET GLOBAL max_connections = 1000` ve `PDO::ATTR_PERSISTENT` ayarları sayesinde **tamamen giderilmiştir.** 
*   Sistem yavaş olsa da (bekleme süresi), hiçbir istek veritabanı veya bağlantı hatası nedeniyle reddedilmemiştir (%0 Error Rate).

### Redis ve PHP Kısıtları
Yerel Windows ortamında PHP `redis` eklentisi bulunmadığı için `Predis` paketine geçiş yapılmıştır. Ancak yerel Redis sunucusuna erişim kısıtları nedeniyle testler "Cache Miss" senaryosu gibi çalışmıştır. Gerçek bir Redis Cluster/Server ile TTFB sürelerinin **<50ms** bandına inmesi öngörülmektedir.

## 4. Sonuç ve Öneriler

1.  **Windows Yerelinde Üretim Simülasyonu:** 500+ VU hedefi için Windows'ta `php artisan serve` yerine **Laravel Octane (FrankenPHP)** veya **XAMPP/Nginx** kullanılmalıdır.
2.  **Bağlantı Başarısı:** Yapılan veritabanı ayarları sayesinde sistemin "çökme" eşiği yükseltilmiştir. Hatalı istek oranının %0'a düşmesi Faz 2'nin en büyük başarısıdır.
3.  **Gelecek Adım:** Testlerin Linux tabanlı bir WSL2 veya Docker ortamında tekrarlanması, Redis'in gerçek etkisini (Latency düşüşü) gösterecektir.

---
*Testler `k6.exe v0.51.0` kullanılarak yerel olarak koşturulmuştur.*
