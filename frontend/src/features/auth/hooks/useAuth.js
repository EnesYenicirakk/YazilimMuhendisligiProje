import { useCallback, useEffect, useRef, useState } from 'react'

const BOS_KIMLIK = {
  username: '',
  password: '',
}

export default function useAuth({
  validUsername = 'admin',
  validPassword = 'admin123',
  loginDelay = 1180,
  onLoginSuccess,
} = {}) {
  const [credentials, setCredentials] = useState(BOS_KIMLIK)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginGecisiAktif, setLoginGecisiAktif] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const timeoutRef = useRef(null)

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
  }, [])

  const logout = useCallback(() => {
    resetAuth()
  }, [resetAuth])

  const handleLogin = useCallback((event) => {
    event.preventDefault()

    const girilenKullanici = credentials.username.trim()
    const sifreDogru = credentials.password === validPassword
    const kullaniciDogru = girilenKullanici === validUsername

    if (!kullaniciDogru || !sifreDogru) {
      setError('Kullanıcı adı veya şifre hatalı.')
      return false
    }

    setError('')
    setLoginGecisiAktif(true)
    timeoutRef.current = window.setTimeout(() => {
      const user = { username: girilenKullanici }
      setCurrentUser(user)
      setIsLoggedIn(true)
      setLoginGecisiAktif(false)
      onLoginSuccess?.(user)
    }, loginDelay)

    return true
  }, [credentials.password, credentials.username, loginDelay, onLoginSuccess, validPassword, validUsername])

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

