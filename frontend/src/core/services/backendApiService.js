/**
 * Backend API Servis Yapılandırması
 */

// MAMP üzerinde proje yoluna göre burayı güncelleyebilirsin.
// Eğer Virtual Host kullanıyorsan direkt 'http://localhost/api' olabilir.
const BASE_URL = 'http://localhost/api'; 

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API isteği başarısız oldu.');
  }

  return response.json();
};

export const productApi = {
  getAll: () => apiFetch('/products'),
  getById: (id) => apiFetch(`/products/${id}`),
  create: (data) => apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
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
};
