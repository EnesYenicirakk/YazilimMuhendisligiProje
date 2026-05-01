import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend } from 'k6/metrics';

// Custom Metrics
const ttfbTrend = new Trend('ttfb_duration');

export const options = {
    stages: [
        { duration: '30s', target: 100 }, // Warm up
        { duration: '2m', target: 500 },  // Heavy load
        { duration: '1m', target: 500 },  // Sustained load
        { duration: '30s', target: 0 },   // Cool down
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // < 1% error rate
        http_req_duration: ['p(95)<200'], // 95% of requests under 200ms
        ttfb_duration: ['p(95)<100'],     // 95% of TTFB under 100ms (Redis check)
        'http_reqs': ['count>20000'],    // Min throughput
    },
};

const BASE_URL = 'http://localhost:8002/api';

// Cache Warming: Runs once per VU (or once globally depending on setup)
// In k6, setup() runs once at the beginning.
export function setup() {
    console.log('--- Phase 2: Cache Warming Started ---');
    
    // Login to get token for warming
    const loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({
        username: 'admin',
        password: 'admin123'
    }), { headers: { 'Content-Type': 'application/json' } });
    
    const token = loginRes.json('access_token');
    
    if (token) {
        const headers = { 'Authorization': `Bearer ${token}` };
        // Hit critical cached endpoints multiple times
        for (let i = 0; i < 5; i++) {
            http.get(`${BASE_URL}/products`, { headers });
            http.get(`${BASE_URL}/finance`, { headers });
        }
    }
    
    console.log('--- Phase 2: Cache Warming Completed ---');
    return { token: token };
}

export default function (data) {
    const authHeaders = {
        'Authorization': `Bearer ${data.token}`,
        'Content-Type': 'application/json',
    };

    group('Authenticated Operations', function () {
        // 1. Products (Heavily Cached)
        const productsRes = http.get(`${BASE_URL}/products`, { headers: authHeaders });
        ttfbTrend.add(productsRes.timings.waiting);
        check(productsRes, {
            'products status is 200': (r) => r.status === 200,
            'cache hit speed (<50ms)': (r) => r.timings.duration < 50,
        });

        // 2. Finance Data
        const financeRes = http.get(`${BASE_URL}/finance`, { headers: authHeaders });
        check(financeRes, { 'finance status is 200': (r) => r.status === 200 });

        // 3. Customers
        const customersRes = http.get(`${BASE_URL}/customers`, { headers: authHeaders });
        check(customersRes, { 'customers status is 200': (r) => r.status === 200 });
    });

    sleep(1);
}
