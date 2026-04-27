import { useCallback, useEffect, useRef, useState } from 'react'
import api, { setToken } from '../../../core/api/apiClient'

const BOS_KIMLIK = { username: '', password: '' }

export default function useAuth({ onLoginSuccess } = {}) {
  const [credentials, setCredentials] = useState(BOS_KIMLIK)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginGecisiAktif, setLoginGecisiAktif] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const timeoutRef = useRef(null)

  // Sayfa yenilendiğinde token varsa oturumu geri yükle
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsLoggedIn(true)
      } catch {
        setToken(null)
        localStorage.removeItem('auth_user')
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const setField = useCallback((field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
    setError('')
  }, [])

  const setUsername = useCallback((value) => setField('username', value), [setField])
  const setPassword = useCallback((value) => setField('password', value), [setField])

  const resetAuth = useCallback(() => {
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null }
    setCredentials(BOS_KIMLIK)
    setError('')
    setLoginGecisiAktif(false)
    setIsLoggedIn(false)
    setCurrentUser(null)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } catch {
      // Token zaten geçersizse hata görmezden gel
    } finally {
      setToken(null)
      localStorage.removeItem('auth_user')
      resetAuth()
    }
  }, [resetAuth])

  const handleLogin = useCallback(async (event) => {
    event.preventDefault()
    const username = credentials.username.trim()
    const password = credentials.password

    if (!username || !password) {
      setError('Kullanıcı adı ve şifre boş bırakılamaz.')
      return false
    }

    setError('')
    setLoginGecisiAktif(true)

    try {
      const data = await api.post('/login', { username, password })

      // Token ve kullanıcı bilgilerini kaydet
      setToken(data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))

      // Kısa animasyon gecikmesi
      timeoutRef.current = window.setTimeout(() => {
        setCurrentUser(data.user)
        setIsLoggedIn(true)
        setLoginGecisiAktif(false)
        onLoginSuccess?.(data.user)
      }, 800)

      return true
    } catch (err) {
      setLoginGecisiAktif(false)
      if (err.status === 422) {
        setError('Kullanıcı adı veya şifre hatalı.')
      } else {
        setError('Sunucuya bağlanılamadı. Lütfen backend\'in çalışır durumda olduğunu kontrol edin.')
      }
      return false
    }
  }, [credentials.username, credentials.password, onLoginSuccess])

  return {
    username: credentials.username,
    password: credentials.password,
    currentUser,
    isLoggedIn,
    loginGecisiAktif,
    error,
    setUsername,
    setPassword,
    handleLogin,
    logout,
    resetAuth,
  }
}
