import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

function getInitials(name) {
  if (!name) return '??'
  const parts = name.split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const hoy = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const nombre = user?.nombre || user?.email || ''
  const email = user?.email || ''
  const iniciales = getInitials(nombre)

  return (
      <header className="h-16 shrink-0 bg-white border-b border-line flex items-center justify-between px-8">
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-lg font-semibold tracking-[-0.01em] truncate">{title}</h1>
          {subtitle && <span className="text-sm text-muted hidden sm:inline">{subtitle}</span>}
          {!subtitle && <span className="text-sm text-muted hidden sm:inline capitalize">{hoy}</span>}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-brand-700 text-white text-xs font-semibold flex items-center justify-center">
            {iniciales}
          </span>
            <span className="leading-tight hidden md:block">
            <span className="block text-sm font-semibold truncate max-w-[180px]">{nombre}</span>
            <span className="block text-xs text-muted truncate max-w-[180px]">{email}</span>
          </span>
          </div>
          <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>
  )
}
