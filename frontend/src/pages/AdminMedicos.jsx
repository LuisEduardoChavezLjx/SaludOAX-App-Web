import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GravedadBadge from '../components/GravedadBadge'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { Search, Stethoscope, ToggleLeft, ToggleRight } from 'lucide-react'

const ESPECIALIDADES = ['Medicina General', 'Pediatría', 'Ginecología', 'Cardiología', 'Dermatología', 'Traumatología']

const MOCK_MEDICOS = {
  contenido: [
    { id: 1, nombre: 'Dra. Ana Gómez Luna', especialidad: 'Medicina General', disponible: true, especialidades: ['Medicina General', 'Pediatría'], email: 'ana.gomez@saludoax.me', telefono: '9511234567' },
    { id: 2, nombre: 'Dr. Luis Ramírez Ortiz', especialidad: 'Cardiología', disponible: true, especialidades: ['Cardiología'], email: 'luis.ramirez@saludoax.me', telefono: '9512345678' },
    { id: 3, nombre: 'Dra. Carmen Ruiz Soto', especialidad: 'Ginecología', disponible: false, especialidades: ['Ginecología', 'Medicina General'], email: 'carmen.ruiz@saludoax.me', telefono: '9513456789' },
    { id: 4, nombre: 'Dr. Jorge Díaz Mendoza', especialidad: 'Traumatología', disponible: true, especialidades: ['Traumatología', 'Medicina General'], email: 'jorge.diaz@saludoax.me', telefono: '9514567890' },
    { id: 5, nombre: 'Dra. Sofía Torres Vega', especialidad: 'Pediatría', disponible: true, especialidades: ['Pediatría'], email: 'sofia.torres@saludoax.me', telefono: '9515678901' },
  ],
  paginaActual: 0,
  tamanoPagina: 10,
  totalElementos: 5,
  totalPaginas: 1,
}

export default function AdminMedicos() {
  const [medicos, setMedicos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seleccionado, setSeleccionado] = useState(null)
  const [buscador, setBuscador] = useState('')
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('TODAS')
  const [filtroDisponible, setFiltroDisponible] = useState('TODOS')
  const [page, setPage] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setMedicos(MOCK_MEDICOS)
      setLoading(false)
    }, 300)
  }, [])

  const handleToggleDisponible = (medico) => {
    setMedicos((prev) => ({
      ...prev,
      content: prev.contenido.map((m) => m.id === medico.id ? { ...m, disponible: !m.disponible } : m),
    }))
    if (seleccionado?.id === medico.id) {
      setSeleccionado((prev) => ({ ...prev, disponible: !prev.disponible }))
    }
  }

  if (loading) return <Layout title="Gestión de médicos"><LoadingSpinner /></Layout>
  if (error) return <Layout title="Gestión de médicos"><EmptyState title="Error" description={error} /></Layout>

  return (
      <Layout title="Gestión de médicos">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 rounded-xl border border-line bg-white min-w-0">
            <div className="px-6 py-4 border-b border-line flex flex-wrap items-end gap-4">
              <div className="min-w-[200px] flex-1">
                <label htmlFor="buscar-m" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Buscar médico</label>
                <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                  <Search className="w-5 h-5" />
                </span>
                  <input id="buscar-m" type="search" placeholder="Nombre del médico" value={buscador} onChange={(e) => setBuscador(e.target.value)}
                         className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="filtro-esp" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Especialidad</label>
                <select id="filtro-esp" value={filtroEspecialidad} onChange={(e) => setFiltroEspecialidad(e.target.value)}
                        className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none">
                  <option value="TODAS">Todas</option>
                  {ESPECIALIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="filtro-disp" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Disponibilidad</label>
                <select id="filtro-disp" value={filtroDisponible} onChange={(e) => setFiltroDisponible(e.target.value)}
                        className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none">
                  <option value="TODOS">Todos</option>
                  <option value="true">Disponible</option>
                  <option value="false">No disponible</option>
                </select>
              </div>
            </div>

            {medicos.contenido.length === 0 ? (
                <EmptyState icon={Stethoscope} title="Sin médicos registrados" description="No hay médicos que coincidan con los filtros." />
            ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                      <tr className="bg-subtle text-left">
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Médico</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Especialidad</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Disponible</th>
                      </tr>
                      </thead>
                      <tbody>
                      {medicos.contenido.map((m) => (
                          <tr key={m.id} onClick={() => setSeleccionado(m)}
                              className={`border-t border-line cursor-pointer transition-colors duration-150 ${
                                  seleccionado?.id === m.id ? 'bg-brand-50' : 'hover:bg-subtle/60'
                              }`}>
                            <td className="px-6 py-4">
                              <span className="block font-medium">{m.nombre}</span>
                              <span className="block text-xs text-muted">{m.email}</span>
                            </td>
                            <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full border border-line bg-subtle px-2.5 py-1 text-xs font-semibold text-ink">
                            {m.especialidad}
                          </span>
                            </td>
                            <td className="px-6 py-4">
                              {m.disponible ? (
                                  <span className="inline-flex items-center gap-1.5 text-sm text-leve">
                              <span className="w-1.5 h-1.5 rounded-full bg-leve" /> Disponible
                            </span>
                              ) : (
                                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutro" /> No disponible
                            </span>
                              )}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={medicos.paginaActual} totalPages={medicos.totalPaginas} totalElements={medicos.totalElementos} size={medicos.tamanoPagina} onPageChange={setPage} />
                </>
            )}
          </section>

          <aside className="lg:col-span-4 space-y-6">
            {!seleccionado ? (
                <section className="rounded-xl border border-line bg-white p-6 text-center text-sm text-muted">
                  <p>Seleccione un médico de la lista para ver su detalle.</p>
                </section>
            ) : (
                <>
                  <section className="rounded-xl border border-line bg-white">
                    <div className="px-5 py-4 border-b border-line">
                      <h2 className="text-sm font-semibold">{seleccionado.nombre}</h2>
                    </div>
                    <dl className="p-5 space-y-4 text-sm">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Correo</dt>
                        <dd className="mt-1">{seleccionado.email}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Teléfono</dt>
                        <dd className="mt-1">{seleccionado.telefono || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Especialidad principal</dt>
                        <dd className="mt-1">
                      <span className="inline-flex items-center rounded-full border border-line bg-subtle px-2.5 py-1 text-xs font-semibold text-ink">
                        {seleccionado.especialidad}
                      </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Especialidades adicionales</dt>
                        <dd className="mt-1 flex flex-wrap gap-2">
                          {seleccionado.especialidades.filter(e => e !== seleccionado.especialidad).map((e) => (
                              <span key={e} className="inline-flex items-center rounded-full border border-line bg-white px-2.5 py-1 text-xs font-semibold text-muted">
                          {e}
                        </span>
                          ))}
                          {seleccionado.especialidades.length <= 1 && (
                              <span className="text-xs text-muted">Sin adicionales</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  <section className="rounded-xl border border-line bg-white p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold">Disponibilidad</h2>
                      <button type="button" onClick={() => handleToggleDisponible(seleccionado)}
                              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                                  seleccionado.disponible
                                      ? 'bg-leve/10 text-leve hover:bg-leve/20'
                                      : 'bg-subtle text-muted hover:bg-line'
                              }`}>
                        {seleccionado.disponible ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {seleccionado.disponible ? 'Disponible' : 'No disponible'}
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-muted leading-5">
                      Un médico no disponible no aparecerá en el selector de citas para nuevos pacientes, pero sus citas existentes se conservan.
                    </p>
                  </section>
                </>
            )}
          </aside>
        </div>
      </Layout>
  )
}
