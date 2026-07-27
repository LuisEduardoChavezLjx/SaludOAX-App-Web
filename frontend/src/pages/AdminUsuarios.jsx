import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import { listarUsuarios, crearUsuario, cambiarEstadoUsuario } from '../api/usuariosService'
import { useAuth } from '../context/AuthContext'
import { Search, UserPlus, Shield, Users } from 'lucide-react'

const ROL_COLORS = {
  ADMIN: 'bg-info/10 text-info border-info/20',
  MEDICO: 'bg-brand-50 text-brand-800 border-brand-200',
  PACIENTE: 'bg-subtle text-muted border-line',
}

const MOCK_USUARIOS = {
  contenido: [
    { id: 1, email: 'admin@saludoax.com', rol: 'ADMIN', activo: true, perfil: 'Administrador' },
    { id: 2, email: 'medico1@saludoax.com', rol: 'MEDICO', activo: true, perfil: 'Dra. Ana Gómez' },
    { id: 3, email: 'medico2@saludoax.com', rol: 'MEDICO', activo: true, perfil: 'Dr. Luis Ramírez' },
    { id: 4, email: 'paciente1@correo.com', rol: 'PACIENTE', activo: true, perfil: 'Paciente de prueba 1' },
    { id: 5, email: 'paciente2@correo.com', rol: 'PACIENTE', activo: false, perfil: 'Paciente de prueba 2' },
    { id: 6, email: 'paciente3@correo.com', rol: 'PACIENTE', activo: true, perfil: 'Paciente de prueba 3' },
  ],
  paginaActual: 0,
  tamanoPagina: 10,
  totalElementos: 6,
  totalPaginas: 1,
}

export default function AdminUsuarios() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [buscador, setBuscador] = useState('')
  const [filtroRol, setFiltroRol] = useState('TODOS')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [page, setPage] = useState(0)
  const [modalAlta, setModalAlta] = useState(false)
  const [modalBaja, setModalBaja] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setUsuarios(MOCK_USUARIOS)
      setLoading(false)
    }, 300)
  }, [])

  const handleToggleEstado = async (usuario) => {
    setSubmitting(true)
    try {
      await cambiarEstadoUsuario(usuario.id, !usuario.activo)
      setUsuarios((prev) => ({
        ...prev,
        content: prev.content.map((u) => u.id === usuario.id ? { ...u, activo: !u.activo } : u),
      }))
      setModalBaja(null)
    } catch {
      // Mock
      setUsuarios((prev) => ({
        ...prev,
        content: prev.content.map((u) => u.id === usuario.id ? { ...u, activo: !u.activo } : u),
      }))
      setModalBaja(null)
    } finally {
      setSubmitting(false)
    }
  }

  const isMismoAdmin = (usuario) => usuario.email === user?.email

  if (loading) return <Layout title="Gestión de usuarios"><LoadingSpinner /></Layout>
  if (error) return <Layout title="Gestión de usuarios"><EmptyState title="Error" description={error} /></Layout>

  const totalPorRol = (rol) => usuarios?.content.filter((u) => u.rol === rol).length || 0

  return (
      <Layout title="Gestión de usuarios">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 rounded-xl border border-line bg-white min-w-0">
            <div className="px-6 py-4 border-b border-line flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="min-w-[200px]">
                  <label htmlFor="buscar-u" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Buscar</label>
                  <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                    <Search className="w-5 h-5" />
                  </span>
                    <input id="buscar-u" type="search" placeholder="Correo electrónico" value={buscador} onChange={(e) => setBuscador(e.target.value)}
                           className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="filtro-rol" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Rol</label>
                  <select id="filtro-rol" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}
                          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none">
                    <option value="TODOS">Todos</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MEDICO">Médico</option>
                    <option value="PACIENTE">Paciente</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="filtro-estado-u" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Estado</label>
                  <select id="filtro-estado-u" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none">
                    <option value="TODOS">Todos</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => setModalAlta(true)}
                      className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 active:bg-brand-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2">
                <UserPlus className="w-5 h-5" />
                Nuevo usuario
              </button>
            </div>

            {usuarios.contenido.length === 0 ? (
                <EmptyState icon={Users} title="Sin usuarios registrados" description="No hay usuarios que coincidan con los filtros." />
            ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                      <tr className="bg-subtle text-left">
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Usuario</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Rol</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Estado</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted text-right">Acción</th>
                      </tr>
                      </thead>
                      <tbody>
                      {usuarios.contenido.map((u) => (
                          <tr key={u.id} className="border-t border-line hover:bg-subtle/60 transition-colors duration-150">
                            <td className="px-6 py-4">
                              <span className="block font-medium">{u.perfil || u.email}</span>
                              <span className="block text-xs text-muted">{u.email}</span>
                            </td>
                            <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${ROL_COLORS[u.rol] || ''}`}>
                            {u.rol}
                          </span>
                            </td>
                            <td className="px-6 py-4">
                              {u.activo ? (
                                  <span className="inline-flex items-center gap-1.5 text-sm text-leve">
                              <span className="w-1.5 h-1.5 rounded-full bg-leve" /> Activo
                            </span>
                              ) : (
                                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutro" /> Inactivo
                            </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button type="button" onClick={() => setModalBaja(u)}
                                      disabled={isMismoAdmin(u)}
                                      className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                                      title={isMismoAdmin(u) ? 'No puedes desactivar tu propia cuenta' : undefined}>
                                {u.activo ? 'Dar de baja' : 'Reactivar'}
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={usuarios.paginaActual} totalPages={usuarios.totalPaginas} totalElements={usuarios.totalElementos} size={usuarios.tamanoPagina} onPageChange={setPage} />
                </>
            )}
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-xl border border-line bg-white">
              <div className="px-5 py-4 border-b border-line">
                <h2 className="text-sm font-semibold">Cuentas registradas</h2>
              </div>
              <dl className="p-5 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-info" />
                    Administradores
                  </dt>
                  <dd className="font-semibold tabular-nums">{totalPorRol('ADMIN')}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-[10px] font-bold text-brand-800">M</span>
                    Médicos
                  </dt>
                  <dd className="font-semibold tabular-nums">{totalPorRol('MEDICO')}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted" />
                    Pacientes
                  </dt>
                  <dd className="font-semibold tabular-nums">{totalPorRol('PACIENTE')}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-line bg-white p-5">
              <h2 className="text-sm font-semibold">Reglas de la baja</h2>
              <ul className="mt-3 text-sm text-muted leading-6 space-y-2">
                <li>• La baja es <strong>lógica</strong>: el usuario deja de poder iniciar sesión, pero sus registros históricos se conservan.</li>
                <li>• Un administrador <strong>no puede desactivarse a sí mismo</strong>.</li>
                <li>• Para eliminar un usuario físicamente, contacte al soporte técnico.</li>
              </ul>
            </section>
          </aside>
        </div>

        <ConfirmModal open={!!modalBaja} title={modalBaja?.activo ? 'Dar de baja usuario' : 'Reactivar usuario'}
                      message={`¿Está seguro de que desea ${modalBaja?.activo ? 'desactivar' : 'reactivar'} la cuenta de "${modalBaja?.email}"?`}
                      onConfirm={() => handleToggleEstado(modalBaja)} onCancel={() => setModalBaja(null)} loading={submitting}
                      variante={modalBaja?.activo ? 'peligro' : 'confirmar'} />

        <ConfirmModal open={modalAlta} title="Alta de usuario"
                      message="Esta funcionalidad requiere un formulario con campos de perfil según el rol. Implementar cuando el backend esté listo."
                      onConfirm={() => setModalAlta(false)} onCancel={() => setModalAlta(false)}
                      variante="confirmar" />
      </Layout>
  )
}
