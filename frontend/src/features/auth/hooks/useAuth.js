import { useCallback, useEffect, useState } from 'react'
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
  const [bekleyenKullanici, setBekleyenKullanici] = useState(null)

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

  const setField = useCallback((field, value) => {
    setCredentials((onceki) => ({ ...onceki, [field]: value }))
    setError('')
  }, [])

  const setUsername = useCallback((value) => setField('username', value), [setField])
  const setPassword = useCallback((value) => setField('password', value), [setField])

  const resetAuth = useCallback(() => {
    setCredentials(BOS_KIMLIK)
    setError('')
    setLoginGecisiAktif(false)
    setBekleyenKullanici(null)
    setIsLoggedIn(false)
    setCurrentUser(null)
    tokenDeposu.removeItem(TOKEN_KEY)
  }, [tokenDeposu])

  const logout = useCallback(() => {
    authApi.logout().finally(() => {
      resetAuth()
    })
  }, [resetAuth])

  const completeLoginTransition = useCallback(() => {
    if (!bekleyenKullanici) return

    setCurrentUser(bekleyenKullanici)
    setIsLoggedIn(true)
    setCredentials(BOS_KIMLIK)
    setLoginGecisiAktif(false)
    onLoginSuccess?.(bekleyenKullanici)
    setBekleyenKullanici(null)
  }, [bekleyenKullanici, onLoginSuccess])

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
      setBekleyenKullanici(data.user)
      return true
    } catch (err) {
      tokenDeposu.removeItem(TOKEN_KEY)
      setBekleyenKullanici(null)
      setLoginGecisiAktif(false)
      setError(err.message || 'Giris basarisiz oldu.')
      return false
    }
  }, [credentials.password, credentials.username, tokenDeposu])

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
    completeLoginTransition,
    logout,
    resetAuth,
  }
}
