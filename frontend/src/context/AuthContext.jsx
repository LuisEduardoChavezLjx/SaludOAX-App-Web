import { createContext, useContext, useState } from 'react'
import * as authService from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser())

  const handleLogin = async (email, password) => {
    const data = await authService.login(email, password)
    setUser({ email: data.email, rol: data.rol })
    return data
  }

  const handleRegister = async (email, password) => {
    const data = await authService.register(email, password)
    setUser({ email: data.email, rol: data.rol })
    return data
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
  }

  return (
      <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout }}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
