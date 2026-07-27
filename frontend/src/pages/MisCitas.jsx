import { useEffect, useState } from 'react'
import { listarCitasPorPaciente, cambiarEstadoCita } from '../api/citaService'
import { obtenerMiPerfil } from '../api/pacienteService'
import Layout from '../components/Layout'
import EstadoCitaBadge from '../components/EstadoCitaBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ConfirmModal from '../components/ConfirmModal'
import { CalendarX2 } from 'lucide-react'

export default function MisCitas() {
  const [pagina, setPagina] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [citaACancelar, setCitaACancelar] = useState(null)
  const [cancelando, setCancelando] = useState(false)
  const [pacienteId, setPacienteId] = useState(null)

  useEffect(() => {
    obtenerMiPerfil()
        .then((perfil) => setPacienteId(perfil.id))
        .catch(() => setError('No se pudo cargar tu perfil de paciente.'))
  }, [])

  useEffect(() => {
    if (!pacienteId) return
    cargar(pagina)
  }, [pacienteId, pagina])

  const cargar = async (page) => {
    setLoading(true)
    setError('')
    try {
      const res = await listarCitasPorPaciente(pacienteId, page, 5)
      setData(res)
    } catch (err) {
      setError('No se pudieron cargar las citas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const confirmarCancelacion = async () => {
    setCancelando(true)
    try {
      await cambiarEstadoCita(citaACancelar.id, 'CANCELADA')
      setCitaACancelar(null)
      cargar(pagina)
    } catch (err) {
      setError('No se pudo cancelar la cita.')
    } finally {
      setCancelando(false)
    }
  }

  if (loading && !pacienteId) return <Layout title="Mis citas"><LoadingSpinner /></Layout>
  if (loading && pacienteId) return <Layout title="Mis citas"><LoadingSpinner /></Layout>
  if (error) return <Layout title="Mis citas"><p className="text-sm text-urgente font-medium" role="alert">{error}</p></Layout>
  if (!data) return null

  const vacio = data.contenido.length === 0
  const inicioRango = data.totalElementos === 0 ? 0 : pagina * 5 + 1
  const finRango = Math.min((pagina + 1) * 5, data.totalElementos)

  return (
      <Layout title="Mis citas">
        <div className="max-w-4xl">
          <div className="rounded-xl border border-line bg-white min-w-0">
            {vacio ? (
                <EmptyState icon={CalendarX2} title="Sin citas" description="No tienes citas registradas. Agenda una para verla aqui." />
            ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                      <tr className="bg-subtle text-left">
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Fecha y hora</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Estado</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted text-right">Accion</th>
                      </tr>
                      </thead>
                      <tbody>
                      {data.contenido.map((cita) => (
                          <tr key={cita.id} className="border-t border-line hover:bg-subtle/60 transition-colors duration-150">
                            <td className="px-6 py-4 font-medium tabular-nums">
                              {new Date(cita.fechaHora).toLocaleString('es-MX', {
                                dateStyle: 'long', timeStyle: 'short',
                              })}
                            </td>
                            <td className="px-6 py-4"><EstadoCitaBadge estado={cita.estado} /></td>
                            <td className="px-6 py-4 text-right">
                              {cita.estado === 'PENDIENTE' && (
                                  <button type="button" onClick={() => setCitaACancelar(cita)}
                                          className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-urgente hover:bg-urgente hover:text-white hover:border-urgente transition-colors duration-150">
                                    Cancelar
                                  </button>
                              )}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>

                  {data.totalPaginas > 1 && (
                      <div className="px-6 py-4 border-t border-line flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-muted">
                          Mostrando {inicioRango}–{finRango} de {data.totalElementos} citas
                        </p>
                        <nav className="flex items-center gap-1" aria-label="Paginacion">
                          <button type="button" onClick={() => setPagina((p) => Math.max(0, p - 1))}
                                  disabled={pagina === 0}
                                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed">
                            Anterior
                          </button>
                          {Array.from({ length: data.totalPaginas }, (_, i) => (
                              <button key={i} type="button" onClick={() => setPagina(i)}
                                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
                                          i === pagina
                                              ? 'bg-brand-700 text-white'
                                              : 'border border-line bg-white text-muted hover:bg-subtle hover:text-ink'
                                      }`}>
                                {i + 1}
                              </button>
                          ))}
                          <button type="button" onClick={() => setPagina((p) => Math.min(data.totalPaginas - 1, p + 1))}
                                  disabled={pagina === data.totalPaginas - 1}
                                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold text-muted hover:bg-subtle hover:text-ink transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed">
                            Siguiente
                          </button>
                        </nav>
                      </div>
                  )}
                </>
            )}
          </div>
        </div>

        <ConfirmModal
            open={!!citaACancelar}
            title="Cancelar cita"
            message={`Estas por cancelar tu cita del ${
                citaACancelar ? new Date(citaACancelar.fechaHora).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' }) : ''
            }. Esta accion no se puede deshacer.`}
            onConfirm={confirmarCancelacion}
            onCancel={() => setCitaACancelar(null)}
            loading={cancelando}
        />
      </Layout>
  )
}
