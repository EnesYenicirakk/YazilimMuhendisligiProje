// Merkezi API istemcisi — tüm fetch çağrıları buradan geçer.
// Token, localStorage'da saklanır ve her isteğe otomatik eklenir.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const getToken = () => localStorage.getItem('auth_token')

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Sadece mevcut bir token varsa ve login/logout dışında bir 401 aldıysak session'ı temizle.
    if (token && endpoint !== '/login' && endpoint !== '/logout') {
      setToken(null)
      localStorage.removeItem('auth_user')
      window.location.reload()
    }
    const error = new Error('Oturum süresi doldu veya yetkisiz erişim.')
    error.status = 401
    throw error
  }

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }
    const error = new Error(errorData?.message || 'API hatası oluştu.')
    error.status = response.status
    error.data = errorData
    throw error
  }

  // 204 No Content
  if (response.status === 204) return null

  return response.json()
}

// --- HTTP kısayolları ---
export const api = {
  get: (endpoint) => apiFetch(endpoint),
  post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiFetch(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
}

export default api
