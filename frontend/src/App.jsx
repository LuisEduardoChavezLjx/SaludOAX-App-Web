import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'
import RestablecerPassword from './pages/RestablecerPassword'
import RegistroSalud from './pages/RegistroSalud'
import MisCitas from './pages/MisCitas'
import AgendarCita from './pages/AgendarCita'

function Home() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="max-w-md w-full card shadow-sm text-center">
        <h1 className="text-2xl font-bold text-brand-800 mb-4">SaludOAX</h1>
        {user ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">Sesión iniciada como: <span className="font-semibold text-ink">{user.email}</span> (<span className="font-medium">{user.rol}</span>)</p>
            <button onClick={logout} className="btn-secondary w-full">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted">No has iniciado sesión.</p>
        )}
      </div>
    </div>
  )
}

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<RecuperarPassword />} />
          <Route path="/restablecer/:token" element={<RestablecerPassword />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/salud"
            element={
              <PrivateRoute allowedRoles={['PACIENTE']}>
                <RegistroSalud />
              </PrivateRoute>
            }
          />
          <Route
            path="/mis-citas"
            element={
              <PrivateRoute allowedRoles={['PACIENTE']}>
                <MisCitas />
              </PrivateRoute>
            }
          />
          <Route
            path="/agendar-cita"
            element={
              <PrivateRoute allowedRoles={['PACIENTE']}>
                <AgendarCita />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
