import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import GravedadBadge from '../components/GravedadBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { Users, Play } from 'lucide-react'
import { obtenerMiPerfil } from '../api/medicoService'
import { listarSalaEspera, iniciarConsulta, finalizarConsulta } from '../api/salaEsperaService'

export default function SalaEspera() {
  const [medicoId, setMedicoId] = useState(null)
  const [turnos, setTurnos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accionEnCurso, setAccionEnCurso] = useState(null)

  const cargar = useCallback(async (idMedico) => {
    try {
      const data = await listarSalaEspera(idMedico)
      setTurnos(data)
    } catch {
      setError('No se pudo cargar la sala de espera.')
    }
  }, [])

  useEffect(() => {
    let activo = true
    obtenerMiPerfil()
      .then((medico) => {
        if (!activo) return
        setMedicoId(medico.id)
        return cargar(medico.id)
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar el perfil del médico.')
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => { activo = false }
  }, [cargar])

  useEffect(() => {
    if (!medicoId) return
    const id = setInterval(() => cargar(medicoId), 15000)
    return () => clearInterval(id)
  }, [medicoId, cargar])

  const handleIniciar = async (citaId) => {
    setAccionEnCurso(citaId)
    try {
      await iniciarConsulta(citaId)
      await cargar(medicoId)
    } catch {
      setError('No se pudo iniciar la consulta.')
    } finally {
      setAccionEnCurso(null)
    }
  }

  const handleFinalizar = async (citaId) => {
    setAccionEnCurso(citaId)
    try {
      await finalizarConsulta(citaId)
      await cargar(medicoId)
    } catch {
      setError('No se pudo finalizar la consulta.')
    } finally {
      setAccionEnCurso(null)
    }
  }

  if (loading) return <Layout title="Sala de espera"><LoadingSpinner /></Layout>
  if (error) return <Layout title="Sala de espera"><EmptyState title="Error" description={error} /></Layout>

  const todos = turnos || []
  const consultaEnCurso = todos.find((t) => t.estado === 'EN_CONSULTA')
  const pacientesEspera = todos.filter((t) => t.estado === 'ESPERANDO')
  const vacio = pacientesEspera.length === 0

  return (
      <Layout title="Sala de espera">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6 min-w-0">
            <section className="rounded-xl border border-line bg-white">
              <div className="px-6 py-4 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-leve" />
                  <h2 className="text-sm font-semibold">Fila de hoy</h2>
                </div>
                <p className="mt-1 text-sm text-muted">Se actualiza cada 15 s · Ordenada por gravedad estimada y hora de llegada.</p>
              </div>

              {vacio ? (
                  <EmptyState icon={Users} title="Sin pacientes en espera" description="Los pacientes aparecen aquí al estimar su cita al llegar." />
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                      <tr className="bg-subtle text-left">
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted w-16">#</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Paciente</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Gravedad</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted text-right">Espera</th>
                        <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted text-right">Acción</th>
                      </tr>
                      </thead>
                      <tbody>
                      {pacientesEspera.map((p) => (
                          <tr key={p.citaId} className="border-t border-line hover:bg-subtle/60 transition-colors duration-150">
                            <td className="px-6 py-4 align-top">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold tabular-nums ${
                                p.posicion === 1 ? 'bg-brand-800 text-white' : 'bg-subtle border border-line text-ink'
                            }`}>
                              {p.posicion}
                            </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <span className="block font-semibold">{p.pacienteNombre}</span>
                              <span className="block text-xs text-muted tabular-nums">
                                Llegó {new Date(p.horaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} h
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <GravedadBadge gravedad={p.gravedad} />
                            </td>
                            <td className="px-6 py-4 align-top text-right tabular-nums font-semibold">{p.minutosEsperaEstimados} min</td>
                            <td className="px-6 py-4 align-top text-right">
                              <button type="button" disabled={p.posicion !== 1 || !!consultaEnCurso || accionEnCurso === p.citaId}
                                      onClick={() => handleIniciar(p.citaId)}
                                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                                          p.posicion === 1
                                              ? 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 focus:ring-brand-600'
                                              : 'border border-line bg-white text-muted hover:bg-subtle hover:text-ink'
                                      }`}>
                                Llamar
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
              {!vacio && (
                  <div className="px-6 py-4 border-t border-line">
                    <p className="text-sm text-muted">La espera acumula la duración de las consultas que van adelante en la fila.</p>
                  </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-xl bg-info text-white p-5">
              {consultaEnCurso ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Consulta en curso</p>
                        <p className="mt-1 text-base font-semibold leading-6">{consultaEnCurso.pacienteNombre}</p>
                      </div>
                    </div>
                    <button type="button" disabled={accionEnCurso === consultaEnCurso.citaId}
                            onClick={() => handleFinalizar(consultaEnCurso.citaId)}
                            className="mt-4 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-info hover:bg-white/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-info disabled:opacity-60">
                      Finalizar consulta
                    </button>
                  </>
              ) : (
                  <p className="text-sm text-white/80">Ningún paciente en consulta ahora mismo.</p>
              )}
            </section>

            <section className="rounded-xl border border-line bg-white">
              <div className="px-5 py-4 border-b border-line">
                <h2 className="text-sm font-semibold">Estado de la fila</h2>
              </div>
              <dl className="p-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-subtle px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">En espera</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em]">{pacientesEspera.length}</dd>
                </div>
                <div className="rounded-lg bg-subtle px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Espera del último</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em]">{pacientesEspera[pacientesEspera.length - 1]?.minutosEsperaEstimados ?? 0} min</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-line bg-white">
              <div className="px-5 py-4 border-b border-line">
                <h2 className="text-sm font-semibold">Reparto por gravedad</h2>
              </div>
              <ul className="p-5 space-y-3 text-sm">
                {['URGENTE', 'MODERADA', 'LEVE'].map((g) => {
                  const count = pacientesEspera.filter((p) => p.gravedad === g).length
                  return (
                      <li key={g} className="flex items-center justify-between gap-3">
                        <GravedadBadge gravedad={g} />
                        <span className="font-semibold tabular-nums">{count}</span>
                      </li>
                  )
                })}
              </ul>
            </section>

            <section className="rounded-xl border border-line bg-white p-5">
              <h2 className="text-sm font-semibold">Criterio de orden</h2>
              <p className="mt-2 text-sm text-muted leading-5">
                El sistema ordena por gravedad estimada, no por hora de llegada. Reordenar la fila manualmente rompe el triage.
              </p>
              <p className="mt-3 text-sm text-muted leading-5">
                Si un paciente presenta una emergencia médica grave, remítalo al área de valoración inmediata sin esperar turno.
              </p>
            </section>
          </aside>
        </div>
      </Layout>
  )
}
