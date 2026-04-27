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
};
