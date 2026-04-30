/**
 * Backend API Servis Yapılandırması
 */

// Laravel 'php artisan serve' kullanıyorsan: http://127.0.0.1:8000/api
// MAMP Virtual Host kullanıyorsan: http://localhost/api
const BASE_URL = 'http://127.0.0.1:8000/api'; 

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API isteği başarısız oldu.');
  }

  return data;
};

export const authApi = {
  login: (credentials) => apiFetch('/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => apiFetch('/logout', { method: 'POST' }),
  getUser: () => apiFetch('/user'),
};

export const notificationApi = {
  getAll: () => apiFetch('/notifications'),
  markAsRead: (id) => apiFetch(`/notifications/${id}`, { method: 'PATCH' }),
  delete: (id) => apiFetch(`/notifications/${id}`, { method: 'DELETE' }),
  clearAll: () => apiFetch('/notifications/clear-all', { method: 'POST' }),
};

export const productApi = {
  getAll: () => apiFetch('/products'),
  getById: (id) => apiFetch(`/products/${id}`),
  create: (data) => apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
  bulkStockUpdate: (data) => apiFetch('/products/bulk-stock-update', { method: 'POST', body: JSON.stringify(data) }),
};

export const customerApi = {
  getAll: () => apiFetch('/customers'),
  create: (data) => apiFetch('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/customers/${id}`, { method: 'DELETE' }),
};

export const orderApi = {
  getAll: () => apiFetch('/orders'),
  create: (data) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/orders/${id}`, { method: 'DELETE' }),
  cancel: (id, data) => apiFetch(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, data) => apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
};

export const categoryApi = {
  getAll: () => apiFetch('/categories'),
};

export const financeApi = {
  getAll: () => apiFetch('/finance'),
};

export const supplierApi = {
  getAll: () => apiFetch('/suppliers'),
  create: (data) => apiFetch('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/suppliers/${id}`, { method: 'DELETE' }),
  createOrder: (supplierId, data) => apiFetch(`/suppliers/${supplierId}/orders`, { method: 'POST', body: JSON.stringify(data) }),
};
