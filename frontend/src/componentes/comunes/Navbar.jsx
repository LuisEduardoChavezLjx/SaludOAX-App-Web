import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const navegar = useNavigate();

  const handleLogout = () => {
    logout();
    navegar('/login');
  };

  if (!user) return null;

  const enlaces = {
    ADMIN: [
      { to: '/admin/usuarios', label: 'Usuarios' },
      { to: '/admin/medicos', label: 'Médicos' },
    ],
    MEDICO: [
      { to: '/medico/agenda', label: 'Mi agenda' },
      { to: '/medico/sala-espera', label: 'Sala de espera' },
    ],
    PACIENTE: [
      { to: '/agendar-cita', label: 'Agendar cita' },
      { to: '/mis-citas', label: 'Mis citas' },
      { to: '/salud', label: 'Mis datos de salud' },
    ],
  };

  const iniciales = user.email?.slice(0, 2).toUpperCase() || 'US';

  return (
    <header className="h-16 bg-white border-b border-line sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center text-white">
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" aria-hidden="true">
              <path d="M13 4h6v9h9v6h-9v9h-6v-9H4v-6h9V4z" fill="currentColor" opacity=".28"/>
              <path d="M4 16h5l3-6 4 12 3-6h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="text-lg font-semibold text-brand-800 hidden sm:block">SaludOAX</span>
        </Link>

        <nav className="flex items-center gap-6">
          {enlaces[user.rol]?.map((enlace) => (
            <Link
              key={enlace.to}
              to={enlace.to}
              className="text-sm font-medium text-muted hover:text-brand-700 transition-colors duration-150"
            >
              {enlace.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-muted">{user.email}</span>
          <div className="w-9 h-9 rounded-full bg-brand-700 text-white text-sm font-semibold flex items-center justify-center">
            {iniciales}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}