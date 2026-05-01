import http from 'k6/http';
import { check, sleep } from 'k6';

// Load Test Configuration: Stable load with 100 VUs
export const options = {
    stages: [
        { duration: '1m', target: 100 }, // Ramp up to 100 VUs
        { duration: '3m', target: 100 }, // Stay at 100 VUs
        { duration: '1m', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // Hata oranı %1'den az olmalı
        http_req_duration: ['p(95)<500'], // İsteklerin %95'i 500ms'den hızlı olmalı (Yük altında daha hızlı bekliyoruz)
    },
};

const BASE_URL = 'http://localhost:8002/api';

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
    });

    const token = loginRes.json('access_token');
    if (!token) return;

    const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    // 2. Senaryo: Ürün Listeleme
    let productsRes = http.get(`${BASE_URL}/products`, { headers: authHeaders });
    check(productsRes, { 'products status is 200': (r) => r.status === 200 });

    sleep(1);

    // 3. Senaryo: Finansal Veriler
    let financeRes = http.get(`${BASE_URL}/finance`, { headers: authHeaders });
    check(financeRes, { 'finance status is 200': (r) => r.status === 200 });

    sleep(1);

    // 4. Senaryo: Müşteriler
    let customersRes = http.get(`${BASE_URL}/customers`, { headers: authHeaders });
    check(customersRes, { 'customers status is 200': (r) => r.status === 200 });

    sleep(2);
}
