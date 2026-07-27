import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GravedadBadge from '../components/GravedadBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { Users, Play } from 'lucide-react'

const MOCK_SALA = [
  { id: 1, posicion: 1, pacienteNombre: 'Ernesto Mendoza Sosa', edad: 67, horaLlegada: '09:52', horaCita: '11:30', presionSistolica: 176, presionDiastolica: 104, pesoKg: 81.0, gravedad: 'URGENTE', duracion: 30, minutosEspera: 0 },
  { id: 2, posicion: 2, pacienteNombre: 'Juan Pérez Ramírez', edad: 41, horaLlegada: '10:05', horaCita: '10:30', presionSistolica: 138, presionDiastolica: 88, pesoKg: 72.5, gravedad: 'MODERADA', duracion: 20, minutosEspera: 30 },
  { id: 3, posicion: 3, pacienteNombre: 'Alicia Rentería Bautista', edad: 55, horaLlegada: '10:11', horaCita: '12:00', presionSistolica: 142, presionDiastolica: 90, pesoKg: 68.3, gravedad: 'MODERADA', duracion: 20, minutosEspera: 50 },
  { id: 4, posicion: 4, pacienteNombre: 'Carmen Vásquez Toledo', edad: 29, horaLlegada: '09:47', horaCita: '11:00', presionSistolica: 118, presionDiastolica: 76, pesoKg: 64.0, gravedad: 'LEVE', duracion: 15, minutosEspera: 70 },
]

export default function SalaEspera() {
  const [sala, setSala] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [consultaEnCurso] = useState({
    pacienteNombre: 'Rosa Elena Jiménez',
    inicio: '10:04',
    lleva: 20,
  })

  useEffect(() => {
    setTimeout(() => {
      setSala(MOCK_SALA)
      setLoading(false)
    }, 300)
    const id = setInterval(() => {
      // En producción: refetch del backend
    }, 15000)
    return () => clearInterval(id)
  }, [])

  if (loading) return <Layout title="Sala de espera"><LoadingSpinner /></Layout>
  if (error) return <Layout title="Sala de espera"><EmptyState title="Error" description={error} /></Layout>

  const pacientesEspera = sala?.filter(p => p.estado !== 'ATENDIDA' && p.estado !== 'EN_CONSULTA') || []
  const vacio = pacientesEspera.length === 0

  return (
    <Layout title="Sala de espera">
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-8 space-y-6 min-w-0">
          <section className="rounded-xl border border-line bg-white">
            <div className="px-6 py-4 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-leve" />
                <h2 className="text-sm font-semibold">Fila de hoy · Consultorio 3</h2>
              </div>
              <p className="mt-1 text-sm text-muted">Se actualiza cada 15 s · Ordenada por gravedad estimada y hora de llegada.</p>
            </div>

            {vacio ? (
              <EmptyState icon={Users} title="Sin pacientes en espera" description="Los pacientes aparecen aquí al registrar su llegada en el módulo de triage." />
            ) : (
              <>
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
                        <tr key={p.id} className="border-t border-line hover:bg-subtle/60 transition-colors duration-150">
                          <td className="px-6 py-4 align-top">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold tabular-nums ${
                              p.posicion === 1 ? 'bg-brand-800 text-white' : 'bg-subtle border border-line text-ink'
                            }`}>
                              {p.posicion}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span className="block font-semibold">{p.pacienteNombre}</span>
                            <span className="block text-xs text-muted tabular-nums">{p.edad} años · Llegó {p.horaLlegada} h · Cita {p.horaCita} h</span>
                            <span className="block mt-1 text-xs tabular-nums">
                              <span className={p.presionSistolica >= 140 || p.presionDiastolica >= 90 ? 'font-semibold text-urgente' : 'font-semibold'}>
                                {p.presionSistolica} / {p.presionDiastolica} mmHg
                              </span>
                              <span className="text-muted"> · {p.pesoKg} kg</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <GravedadBadge gravedad={p.gravedad} />
                            <span className="block mt-1.5 text-xs text-muted tabular-nums">Consulta {p.duracion} min</span>
                          </td>
                          <td className="px-6 py-4 align-top text-right tabular-nums font-semibold">{p.minutosEspera} min</td>
                          <td className="px-6 py-4 align-top text-right">
                            <button type="button"
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
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
                <div className="px-6 py-4 border-t border-line">
                  <p className="text-sm text-muted">La espera acumula la duración de las consultas que van adelante en la fila.</p>
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="col-span-4 space-y-6">
          <section className="rounded-xl bg-info text-white p-5">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">Consulta en curso</p>
                <p className="mt-1 text-base font-semibold leading-6">{consultaEnCurso.pacienteNombre}</p>
                <p className="mt-1 text-sm text-white/80 tabular-nums">Inició {consultaEnCurso.inicio} h · lleva {consultaEnCurso.lleva} min</p>
              </div>
            </div>
            <button type="button"
              className="mt-4 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-info hover:bg-white/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-info">
              Finalizar consulta
            </button>
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
                <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em]">{pacientesEspera[pacientesEspera.length - 1]?.minutosEspera ?? 0} min</dd>
              </div>
              <div className="rounded-lg bg-subtle px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Atendidos hoy</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em]">6</dd>
              </div>
              <div className="rounded-lg bg-subtle px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Sin estimar</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em]">0</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-line bg-white">
            <div className="px-5 py-4 border-b border-line">
              <h2 className="text-sm font-semibold">Reparto por gravedad</h2>
            </div>
            <ul className="p-5 space-y-3 text-sm">
              {['URGENTE', 'MODERADA', 'LEVE'].map((g) => {
                const count = pacientesEspera.filter(p => p.gravedad === g).length
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
