import { useCallback, useEffect, useRef, useState } from 'react'
import { authApi } from '../../../core/services/backendApiService'

const BOS_KIMLIK = {
  username: '',
  password: '',
}

const TOKEN_KEY = 'access_token'

export default function useAuth({
  onLoginSuccess,
} = {}) {
  const tokenDeposu = window.sessionStorage
  const [credentials, setCredentials] = useState(BOS_KIMLIK)
  const [isLoggedIn, setIsLoggedIn] = useState(!!tokenDeposu.getItem(TOKEN_KEY))
  const [loginGecisiAktif, setLoginGecisiAktif] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const token = tokenDeposu.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoggedIn(false)
      return
    }

    authApi.getUser()
      .then((data) => {
        setCurrentUser(data)
        setIsLoggedIn(true)
      })
      .catch(() => {
        tokenDeposu.removeItem(TOKEN_KEY)
        setCurrentUser(null)
        setIsLoggedIn(false)
      })
  }, [tokenDeposu])

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
    tokenDeposu.removeItem(TOKEN_KEY)
  }, [tokenDeposu])

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

      tokenDeposu.setItem(TOKEN_KEY, data.access_token)

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
  }, [credentials.password, credentials.username, onLoginSuccess, tokenDeposu])

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
