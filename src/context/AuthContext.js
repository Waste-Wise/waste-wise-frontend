import { createContext, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types' // Import PropTypes for prop validation
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/router'
import axios from 'axios'
import apiDefinitions from 'src/api/apiDefinitions'
import authConfig from 'src/configs/auth'

// Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [expiry, setExpiry] = useState(0)

  // Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem('refreshToken')
      if (storedToken) {
        setLoading(true)
        apiDefinitions
          .refresh({ refresh_token: storedToken })
          .then(async response => {
            if (response.status === 200) {
              const decodedToken = jwt.decode(response.data.token)

              const userData = {
                id: decodedToken._id,
                email: decodedToken.email,
                role: 'admin',
                userRole: decodedToken.role,
                username: decodedToken.name,
                fullName: decodedToken.name,
                password: ''
              }

              setUser({ ...userData })
              window.localStorage.setItem('userData', JSON.stringify(userData))
              window.localStorage.setItem('refreshToken', response.data.refresh_token)
              window.localStorage.setItem('accessToken', response.data.token)

              setExpiry(decodedToken.exp)

              setLoading(false)
            } else {
              throw new Error('Token expired')
            }
          })
          .catch(err => {
            console.log(err)
            handleTokenExpired()
          })
      } else {
        handleTokenExpired()
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.userData })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  const handleTokenExpired = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    setUser(null)
    setLoading(false)
    if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
      router.replace('/login')
    }
  }

  useEffect(() => {
    let tokenExpiry = expiry * 1000
    const currentTime = new Date().getTime()
    const timeToExpiry = tokenExpiry - currentTime

    //console log expiry time in minutes
    // console.log('Token expiry time in minutes: ', timeToExpiry / 60000)

    setTimeout(() => {
      const storedToken = window.localStorage.getItem('refreshToken')
      if (storedToken) {
        apiDefinitions
          .refresh({ refresh_token: storedToken })
          .then(async response => {
            if (response.status === 200) {
              const decodedToken = jwt.decode(response.data.token)

              const userData = {
                id: decodedToken._id,
                email: decodedToken.email,
                role: 'admin',
                userRole: decodedToken.role,
                username: decodedToken.name,
                fullName: decodedToken.name,
                password: ''
              }

              setUser({ ...userData })
              window.localStorage.setItem('userData', JSON.stringify(userData))
              window.localStorage.setItem('refreshToken', response.data.refresh_token)
              window.localStorage.setItem('accessToken', response.data.token)

              setExpiry(decodedToken.exp)
            } else {
              throw new Error('Token expired')
            }
          })
          .catch(err => {
            console.log(err)
            handleTokenExpired()
          })
      } else {
        handleTokenExpired()
      }
    }, timeToExpiry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiry])

  // Memoize the values object
  const authValues = useMemo(
    () => ({
      user,
      loading,
      setUser,
      setLoading,
      login: handleLogin,
      logout: handleLogout
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  )

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
}

// Add prop validation for children
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export { AuthContext, AuthProvider }
