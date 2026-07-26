import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'

function Home() {
  const { user, logout } = useAuth()
  return (
    <div>
      <h1>saludOax</h1>
      {user ? (
        <div>
          <p>Sesion iniciada como: {user.email} ({user.rol})</p>
          <button onClick={logout}>Cerrar sesion</button>
        </div>
      ) : (
        <p>No has iniciado sesion.</p>
      )}
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
