import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          // Fetch user data
          const response = await api.get('/auth/user/')
          setUser(response.data)
        } catch (error) {
          console.error('Failed to load user:', error)
          // Token might be expired, try to refresh
          await refreshToken()
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) {
      try {
        const response = await api.post('/auth/token/refresh/', {
          refresh: refresh
        })
        const newAccessToken = response.data.access
        localStorage.setItem('access_token', newAccessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

        // Fetch user data
        const userResponse = await api.get('/auth/user/')
        setUser(userResponse.data)
        return true
      } catch (error) {
        console.error('Failed to refresh token:', error)
        logout()
        return false
      }
    }
    return false
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password
      })

      const { access, refresh } = response.data

      // Save tokens
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`

      // Fetch user data
      const userResponse = await api.get('/auth/user/')
      setUser(userResponse.data)

      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: error.userMessage || error.response?.data?.detail || 'Erro ao fazer login'
      }
    }
  }

  const register = async (username, email, password, password2) => {
    try {
      const response = await api.post('/auth/register/', {
        username,
        email,
        password,
        password2
      })

      const { tokens } = response.data

      // Save tokens
      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)

      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`

      // Set user
      setUser(response.data.user)

      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return {
        success: false,
        error: error.userMessage || error.response?.data?.error || 'Erro ao criar conta'
      }
    }
  }

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        await api.post('/auth/logout/', {
          refresh_token: refresh
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens and user
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
