import { useCallback, useEffect, useRef, useState } from 'react'
import { authApi } from '../../../core/services/backendApiService'

const BOS_KIMLIK = {
  username: '',
  password: '',
}

export default function useAuth({
  loginDelay = 500,
  onLoginSuccess,
} = {}) {
  const [credentials, setCredentials] = useState(BOS_KIMLIK)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'))
  const [loginGecisiAktif, setLoginGecisiAktif] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const timeoutRef = useRef(null)

  // Sayfa yüklendiğinde token varsa kullanıcı bilgilerini çek
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      authApi.getUser()
        .then(data => {
          setCurrentUser(data)
          setIsLoggedIn(true)
        })
        .catch(() => {
          localStorage.removeItem('access_token')
          setIsLoggedIn(false)
        })
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const setField = useCallback((field, value) => {
    setCredentials((onceki) => ({ ...onceki, [field]: value }))
    setError('')
  }, [])

  const setUsername = useCallback((value) => setField('username', value), [setField])
  const setPassword = useCallback((value) => setField('password', value), [setField])

  const resetAuth = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCredentials(BOS_KIMLIK)
    setError('')
    setLoginGecisiAktif(false)
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('access_token')
  }, [])

  const logout = useCallback(() => {
    authApi.logout().finally(() => {
      resetAuth()
    })
  }, [resetAuth])

  const handleLogin = useCallback(async (event) => {
    if (event) event.preventDefault()

    setError('')
    setLoginGecisiAktif(true)

    try {
      const data = await authApi.login({
        username: credentials.username,
        password: credentials.password,
      })

      localStorage.setItem('access_token', data.access_token)
      
      const user = data.user
      setCurrentUser(user)
      setIsLoggedIn(true)
      onLoginSuccess?.(user)
      return true
    } catch (err) {
      setError(err.message || 'Giriş başarısız oldu.')
      return false
    } finally {
      setLoginGecisiAktif(false)
    }
  }, [credentials.password, credentials.username, onLoginSuccess])

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

