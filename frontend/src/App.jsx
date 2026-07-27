import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import RegistroSalud from './pages/RegistroSalud'
import MisCitas from './pages/MisCitas'
import AgendarCita from './pages/AgendarCita'

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
