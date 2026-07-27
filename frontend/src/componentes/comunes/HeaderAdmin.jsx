import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function HeaderAdmin({ titulo, accionPrimaria }) {
  const { user, logout } = useAuth();
  const navegar = useNavigate();
  const iniciales = user?.email?.slice(0, 2).toUpperCase() || 'AD';

  return (
    <header className="h-16 shrink-0 bg-white border-b border-line flex items-center justify-between px-8">
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-semibold tracking-[-0.01em]">{titulo}</h1>
        {accionPrimaria}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-brand-800 text-white text-xs font-semibold flex items-center justify-center">
            {iniciales}
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">Administrador SaludOAX</span>
            <span className="block text-xs text-muted">{user?.email}</span>
          </span>
        </div>
        <button
          onClick={() => { logout(); navegar('/login'); }}
          className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}