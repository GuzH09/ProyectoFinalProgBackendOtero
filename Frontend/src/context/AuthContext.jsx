import { createContext, useState, useCallback } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [profile, setProfile] = useState(null)

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/current`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error(error)
      setIsAuthenticated(false)
    }
  }, [])

  return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, checkAuth }}>
            {children}
        </AuthContext.Provider>
  )
}
