import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'
import RestablecerPassword from './pages/RestablecerPassword'
import RegistroSalud from './pages/RegistroSalud'
import MisCitas from './pages/MisCitas'
import AgendarCita from './pages/AgendarCita'
import MiEspera from './pages/MiEspera'
import AgendaMedico from './pages/AgendaMedico'
import SalaEspera from './pages/SalaEspera'
import AdminUsuarios from './pages/AdminUsuarios'
import AdminMedicos from './pages/AdminMedicos'

function HomeRedirect() {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    switch (user.rol) {
        case 'ADMIN': return <Navigate to="/admin/usuarios" replace />
        case 'MEDICO': return <Navigate to="/medico/agenda" replace />
        case 'PACIENTE': return <Navigate to="/citas" replace />
        default: return <Navigate to="/login" replace />
    }
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

                    <Route path="/" element={<PrivateRoute><HomeRedirect /></PrivateRoute>} />

                    <Route path="/salud" element={<PrivateRoute allowedRoles={['PACIENTE']}><RegistroSalud /></PrivateRoute>} />
                    <Route path="/mis-citas" element={<PrivateRoute allowedRoles={['PACIENTE']}><MisCitas /></PrivateRoute>} />
                    <Route path="/agendar-cita" element={<PrivateRoute allowedRoles={['PACIENTE']}><AgendarCita /></PrivateRoute>} />
                    <Route path="/mi-espera" element={<PrivateRoute allowedRoles={['PACIENTE']}><MiEspera /></PrivateRoute>} />

                    <Route path="/medico/agenda" element={<PrivateRoute allowedRoles={['MEDICO']}><AgendaMedico /></PrivateRoute>} />
                    <Route path="/medico/sala-espera" element={<PrivateRoute allowedRoles={['MEDICO']}><SalaEspera /></PrivateRoute>} />

                    <Route path="/admin/usuarios" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminUsuarios /></PrivateRoute>} />
                    <Route path="/admin/medicos" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminMedicos /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
