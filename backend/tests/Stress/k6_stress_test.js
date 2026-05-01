import http from 'k6/http';
import { check, sleep } from 'k6';

// Test Konfigürasyonu
export const options = {
    stages: [
        { duration: '30s', target: 50 }, // 0'dan 50 kullanıcıya 30 saniyede çık
        { duration: '1m', target: 500 }, // 50'den 500 kullanıcıya 1 dakikada çık
        { duration: '2m', target: 500 }, // 500 kullanıcıda 2 dakika kal
        { duration: '30s', target: 0 },   // 500'den 0'a 30 saniyede in
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // Hata oranı %1'den az olmalı
        http_req_duration: ['p(95)<800'], // İsteklerin %95'i 800ms'den hızlı olmalı
    },
};

const BASE_URL = 'http://localhost:8002/api'; // Kendi API URL'nize göre güncelleyin

export default function () {
    // 1. Senaryo: Login
    let loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({
        username: 'admin',
        password: 'admin123'
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, {
        'status is 200': (r) => r.status === 200,
        'has token': (r) => r.json().hasOwnProperty('access_token'),
    });

    // Token'ı al
    const token = loginRes.json('access_token');
    const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    // 2. Senaryo: Ürün Listeleme
    let productsRes = http.get(`${BASE_URL}/products`, { headers: authHeaders });
    check(productsRes, { 'products status is 200': (r) => r.status === 200 });

    sleep(1); // Kullanıcı bekleme süresini simüle et

    // 3. Senaryo: Finansal Veriler (Karmaşık Sorgu Simülasyonu)
    let financeRes = http.get(`${BASE_URL}/finance`, { headers: authHeaders });
    check(financeRes, { 'finance status is 200': (r) => r.status === 200 });

    sleep(1);

    // 4. Senaryo: Müşteriler
    let customersRes = http.get(`${BASE_URL}/customers`, { headers: authHeaders });
    check(customersRes, { 'customers status is 200': (r) => r.status === 200 });

    sleep(2);
}
