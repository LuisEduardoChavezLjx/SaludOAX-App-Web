import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import GravedadBadge from '../components/GravedadBadge'
import EstadoCitaBadge from '../components/EstadoCitaBadge'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { Search, Zap, LoaderCircle } from 'lucide-react'
import { listarCitasPorMedico } from '../api/citaService'
import { estimarCita } from '../api/estimacionService'
import { obtenerMiPerfil } from '../api/medicoService'

export default function AgendaMedico() {
  const [citas, setCitas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seleccionada, setSeleccionada] = useState(null)
  const [buscador, setBuscador] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0])
  const [page, setPage] = useState(0)
  const [estimando, setEstimando] = useState(false)
  const [estimacionResult, setEstimacionResult] = useState(null)
  const [estimacionError, setEstimacionError] = useState(null)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError(null)
    obtenerMiPerfil()
      .then((medico) => listarCitasPorMedico(medico.id, page))
      .then((data) => {
        if (activo) setCitas(data)
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar la agenda del día.')
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => { activo = false }
  }, [page])

  const handleSelect = useCallback((cita) => {
    setSeleccionada(cita)
    setEstimacionResult(null)
    setEstimacionError(null)
  }, [])

  const handleEstimar = async () => {
    if (!seleccionada) return
    setEstimando(true)
    setEstimacionResult(null)
    setEstimacionError(null)
    try {
      const res = await estimarCita(seleccionada.id)
      setEstimacionResult(res)
      setCitas((prev) => prev && {
        ...prev,
        contenido: prev.contenido.map((c) =>
          c.id === seleccionada.id ? { ...c, gravedad: res.gravedad, duracion: res.tiempoEstimadoMin } : c
        ),
      })
    } catch {
      setEstimacionError('No se pudo calcular la estimación. Intenta de nuevo.')
    } finally {
      setEstimando(false)
    }
  }

  if (loading) return <Layout title="Agenda del día"><LoadingSpinner /></Layout>
  if (error) return <Layout title="Agenda del día"><EmptyState title="Error" description={error} /></Layout>

  const citasFiltradas = (citas?.contenido || []).filter((cita) => {
    const coincideNombre = cita.pacienteNombre.toLowerCase().includes(buscador.toLowerCase())
    const coincideEstado = filtroEstado === 'TODOS' || cita.estado === filtroEstado
    const coincideFecha = !filtroFecha || cita.fechaHora.startsWith(filtroFecha)
    return coincideNombre && coincideEstado && coincideFecha
  })

  return (
      <Layout title="Agenda del día" subtitle={new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 rounded-xl border border-line bg-white min-w-0">
            <div className="px-6 py-4 border-b border-line flex flex-wrap items-end gap-4">
              <div className="min-w-[200px] flex-1">
                <label htmlFor="buscar" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Buscar paciente</label>
                <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                  <Search className="w-5 h-5" />
                </span>
                  <input id="buscar" type="search" placeholder="Nombre del paciente" value={buscador} onChange={(e) => setBuscador(e.target.value)}
                         className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none" />
                </div>
              </div>
              <div className="min-w-[170px]">
                <label htmlFor="filtro-estado" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Estado</label>
                <select id="filtro-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none">
                  <option value="TODOS">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADA">Confirmada</option>
                  <option value="ATENDIDA">Atendida</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>
              <div className="min-w-[170px]">
                <label htmlFor="filtro-fecha" className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-2">Fecha</label>
                <input id="filtro-fecha" type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)}
                       className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 focus:outline-none" />
              </div>
            </div>

            {citasFiltradas.length === 0 ? (
                <EmptyState title="Sin citas" description="No hay citas que coincidan con los filtros." />
            ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                      <tr className="bg-subtle text-left">
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Hora</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Paciente</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Gravedad</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted text-right">Duración</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Estado</th>
                      </tr>
                      </thead>
                      <tbody>
                      {citasFiltradas.map((cita) => (
                          <tr key={cita.id} onClick={() => handleSelect(cita)}
                              className={`border-t border-line cursor-pointer transition-colors duration-150 ${
                                  seleccionada?.id === cita.id ? 'bg-brand-50' : 'hover:bg-subtle/60'
                              }`}>
                            <td className="px-6 py-4 font-semibold tabular-nums">
                              {new Date(cita.fechaHora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4">
                              <span className="block font-medium">{cita.pacienteNombre}</span>
                              <span className="block text-xs text-muted">{cita.contextoSalud || 'Sin motivo registrado'}</span>
                            </td>
                            <td className="px-6 py-4"><GravedadBadge gravedad={cita.gravedad} /></td>
                            <td className="px-6 py-4 text-right tabular-nums">{cita.duracion ? `${cita.duracion} min` : '—'}</td>
                            <td className="px-6 py-4"><EstadoCitaBadge estado={cita.estado} /></td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={citas.paginaActual} totalPages={citas.totalPaginas} totalElements={citas.totalElementos} size={citas.tamanoPagina} onPageChange={setPage} />
                </>
            )}
          </section>

          <aside className="lg:col-span-4 rounded-xl border border-line bg-white">
            {!seleccionada ? (
                <div className="p-6 text-center text-sm text-muted">
                  <p>Seleccione una cita de la lista para ver su detalle.</p>
                </div>
            ) : (
                <>
                  <div className="px-6 py-5 border-b border-line">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                      Cita seleccionada · {new Date(seleccionada.fechaHora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} h
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{seleccionada.pacienteNombre}</h2>
                    <p className="mt-1 text-sm text-muted">Expediente #{seleccionada.id}</p>
                  </div>

                  <div className="px-6 py-5 border-b border-line">
                    <h3 className="text-sm font-semibold">Contexto de salud</h3>
                    <p className="mt-2 text-sm text-muted leading-6">{seleccionada.contextoSalud || 'Sin notas registradas.'}</p>
                  </div>

                  <div className="px-6 py-5 border-b border-line">
                    <h3 className="text-sm font-semibold">Signos vitales de esta visita</h3>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted mb-1.5">Peso (kg)</label>
                        <p className="text-sm font-semibold tabular-nums">{seleccionada.pesoKg ?? '—'}</p>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted mb-1.5">Sistólica</label>
                        <p className="text-sm font-semibold tabular-nums">{seleccionada.presionSistolica ?? '—'}</p>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted mb-1.5">Diastólica</label>
                        <p className="text-sm font-semibold tabular-nums">{seleccionada.presionDiastolica ?? '—'}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button type="button" onClick={handleEstimar} disabled={estimando}
                              className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-800 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:opacity-50">
                        {estimando ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        {estimando ? 'Estimando...' : recibeEstimacionLabel(seleccionada.gravedad)}
                      </button>
                      {estimacionError && <p className="mt-2 text-xs font-semibold text-urgente">{estimacionError}</p>}
                    </div>
                  </div>

                  {estimacionResult && (
                      <div className="px-6 py-5">
                        <h3 className="text-sm font-semibold">Estimación de consulta</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-subtle px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Gravedad</p>
                            <p className="mt-2"><GravedadBadge gravedad={estimacionResult.gravedad} /></p>
                          </div>
                          <div className="rounded-lg bg-subtle px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Duración estimada</p>
                            <p className="mt-1.5 flex items-baseline gap-1.5">
                              <span className="text-2xl font-semibold tabular-nums tracking-[-0.02em]">{estimacionResult.tiempoEstimadoMin}</span>
                              <span className="text-sm text-muted font-medium">min</span>
                            </p>
                          </div>
                        </div>
                        <p className="mt-5 pt-4 border-t border-line text-xs text-muted">
                          Calculada el {new Date(estimacionResult.creadoEn).toLocaleString('es-MX')}. Es una referencia para ordenar la sala de espera, no un diagnóstico.
                        </p>
                      </div>
                  )}
                </>
            )}
          </aside>
        </div>
      </Layout>
  )
}

function recibeEstimacionLabel(gravedad) {
  if (gravedad) return 'Recalcular estimación'
  return 'Estimar con IA'
}
