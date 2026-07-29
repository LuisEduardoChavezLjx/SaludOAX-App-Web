import { createContext, useContext, useState, useCallback } from 'react'
import * as authService from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser())
  const [cargando, setCargando] = useState(false)

  const handleLogin = useCallback(async (email, password) => {
    setCargando(true)
    try {
      const data = await authService.login(email, password)
      setUser({ email: data.email, rol: data.rol, nombre: data.nombre })
      return data
    } finally {
      setCargando(false)
    }
  }, [])

  const handleRegister = useCallback(async (email, password) => {
    setCargando(true)
    try {
      const data = await authService.register(email, password)
      setUser({ email: data.email, rol: data.rol, nombre: data.nombre })
      return data
    } finally {
      setCargando(false)
    }
  }, [])

  const handleLogout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev))
  }, [])

  return (
      <AuthContext.Provider value={{ user, cargando, estaAutenticado: !!user, login: handleLogin, register: handleRegister, logout: handleLogout, updateUser }}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
