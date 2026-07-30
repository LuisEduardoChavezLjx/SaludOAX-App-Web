import { NavLink } from 'react-router-dom';

export function SidebarAdmin() {
  const enlaces = [
    { to: '/admin/usuarios', label: 'Usuarios' },
    { to: '/admin/medicos', label: 'Médicos' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-brand-900 text-white flex flex-col">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
        <span className="text-base font-semibold tracking-tight">SaludOAX</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <p className="px-3 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
          Administración
        </p>
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                isActive ? 'font-semibold bg-white/15 text-white' : 'font-medium text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {enlace.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <p className="px-3 py-2 text-xs text-white/50 leading-4">
          Instituto Tecnologico de Oaxaca<br />Oaxaca de Juárez
        </p>
      </div>
    </aside>
  );
}