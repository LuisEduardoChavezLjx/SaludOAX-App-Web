import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'
import RestablecerPassword from './pages/RestablecerPassword'
import RegistroSalud from './pages/RegistroSalud'
import MisCitas from './pages/MisCitas'
import AgendarCita from './pages/AgendarCita'
import AdminUsuarios from './paginas/AdminUsuarios'
import AdminMedicos from './paginas/AdminMedicos'
import AgendaMedico from './pages/AgendaMedico'
import SalaEspera from './pages/SalaEspera'
import AgendaMedico from './paginas/AgendaMedico'
import SalaEspera from './paginas/SalaEspera'
import { Navbar } from './componentes/comunes/Navbar'

function PrivateRoute({ children, allowedRoles }) {
  const { user, cargando } = useAuth()

  if (cargando) return null

  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.rol)) return <Navigate to="/" replace />

  return children
}

function AuthLayout() {
  const { user } = useAuth()
  if (!user) return <Outlet />
  return <Outlet />
}

function PublicLayout() {
  return <Outlet />
}

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  const redirectMap = {
    ADMIN: '/admin/usuarios',
    MEDICO: '/medico/agenda',
    PACIENTE: '/mis-citas',
  }
  return <Navigate to={redirectMap[user.rol] || '/'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar" element={<RecuperarPassword />} />
            <Route path="/restablecer/:token" element={<RestablecerPassword />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/salud" element={<PrivateRoute allowedRoles={['PACIENTE']}><RegistroSalud /></PrivateRoute>} />
            <Route path="/mis-citas" element={<PrivateRoute allowedRoles={['PACIENTE']}><MisCitas /></PrivateRoute>} />
            <Route path="/agendar-cita" element={<PrivateRoute allowedRoles={['PACIENTE']}><AgendarCita /></PrivateRoute>} />
            <Route path="/admin/usuarios" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminUsuarios /></PrivateRoute>} />
            <Route path="/admin/medicos" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminMedicos /></PrivateRoute>} />
            <Route path="/medico/agenda" element={<PrivateRoute allowedRoles={['MEDICO']}><AgendaMedico /></PrivateRoute>} />
            <Route path="/medico/sala-espera" element={<PrivateRoute allowedRoles={['MEDICO']}><SalaEspera /></PrivateRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
