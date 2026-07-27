import { NavLink } from 'react-router-dom'

const NAV_PACIENTE = [
  { to: '/mis-citas', label: 'Mis citas', icon: CalendarIcon },
  { to: '/agendar-cita', label: 'Agendar cita', icon: PlusIcon },
  { to: '/mi-espera', label: 'Mi turno', icon: ClockIcon },
]

const NAV_MEDICO = [
  { to: '/medico/agenda', label: 'Agenda del día', icon: CalendarIcon },
  { to: '/medico/sala-espera', label: 'Sala de espera', icon: UsersIcon },
]

const NAV_ADMIN = [
  { to: '/admin/usuarios', label: 'Usuarios', icon: UsersIcon },
  { to: '/admin/medicos', label: 'Médicos', icon: MedicoIcon },
]

function CalendarIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function UsersIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  )
}

function MedicoIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
    </svg>
  )
}

const rolLabels = {
  PACIENTE: 'Paciente',
  MEDICO: 'Médico',
  ADMIN: 'Administración',
}

const rolNav = {
  PACIENTE: NAV_PACIENTE,
  MEDICO: NAV_MEDICO,
  ADMIN: NAV_ADMIN,
}

export default function Sidebar({ rol }) {
  const items = rolNav[rol] || []
  const label = rolLabels[rol] || ''

  return (
    <aside className="w-64 shrink-0 bg-brand-900 text-white flex flex-col min-h-screen">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
        <span className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center text-white shrink-0">
          <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" aria-hidden="true">
            <path d="M13 4h6v9h9v6h-9v9h-6v-9H4v-6h9V4z" fill="currentColor" opacity=".28" />
            <path d="M4 16h5l3-6 4 12 3-6h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-base font-semibold tracking-tight">SaludOAX</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">{label}</p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                isActive
                  ? 'font-semibold bg-white/15 text-white'
                  : 'font-medium text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 shrink-0">
        <p className="px-3 py-2 text-xs text-white/50 leading-4">Centro de Salud Comunitario</p>
      </div>
    </aside>
  )
}
