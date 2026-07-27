import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import GravedadBadge from '../components/GravedadBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { MensajeError as ErrorMessage } from '../componentes/comunes/MensajeError'
import EmptyState from '../components/EmptyState'
import { obtenerMiTurno } from '../api/salaEsperaService'
import { Clock, Users, ClipboardList } from 'lucide-react'

export default function MiEspera() {
  const [turno, setTurno] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargar()
    const id = setInterval(cargar, 15000)
    return () => clearInterval(id)
  }, [])

  const cargar = async () => {
    try {
      const data = await obtenerMiTurno()
      setTurno(data)
      setError(null)
    } catch (err) {
      if (!turno) setError(err.response?.data?.mensaje || 'No se pudo cargar tu turno.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Layout title="Mi turno"><LoadingSpinner /></Layout>
  if (error) return <Layout title="Mi turno"><p className="text-sm text-muted">{error}</p></Layout>

  if (!turno) {
    return (
        <Layout title="Mi turno">
          <EmptyState
              icon={ClipboardList}
              title="Sin cita para hoy"
              description="No tienes ninguna cita agendada para el día de hoy. Agenda una cita para ver tu posición en la fila."
          />
        </Layout>
    )
  }

  return (
      <Layout title="Mi turno" subtitle="Sala de espera">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl bg-brand-900 text-white p-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white/70">Su posición en la fila</p>
              <p className="mt-2 text-[112px] leading-[100px] font-bold tracking-[-0.04em] tabular-nums">
                {turno.posicion || '—'}
              </p>
              <p className="mt-4 text-lg text-white/80">
                Tiempo estimado de espera: <span className="font-semibold text-white tabular-nums">{turno.minutosEsperaEstimados || 0} min</span>
              </p>
            </div>

            <div className="rounded-xl border border-line bg-white">
              <div className="px-6 py-4 border-b border-line">
                <h2 className="text-sm font-semibold">Cita de hoy</h2>
              </div>
              <dl className="p-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Médico</dt>
                  <dd className="mt-1 font-medium">{turno.medicoNombre || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Especialidad</dt>
                  <dd className="mt-1 font-medium">{turno.especialidad || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Hora de cita</dt>
                  <dd className="mt-1 font-medium tabular-nums">{turno.horaCita || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Consultorio</dt>
                  <dd className="mt-1 font-medium">{turno.consultorio || '—'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Gravedad estimada</dt>
                  <dd className="mt-1"><GravedadBadge gravedad={turno.gravedad} /></dd>
                </div>
              </dl>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted" />
                <h2 className="text-sm font-semibold">¿Cómo funciona?</h2>
              </div>
              <p className="mt-3 text-sm text-muted leading-6">
                La fila se ordena por gravedad estimada, no por hora de llegada. Los pacientes con mayor urgencia pasan primero.
              </p>
            </section>

            <section className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted" />
                <h2 className="text-sm font-semibold">Mientras espera</h2>
              </div>
              <ul className="mt-3 text-sm text-muted leading-6 space-y-2">
                <li>• Esté atento al llamado por el módulo de triage</li>
                <li>• Puede salir de la sala, pero regrese antes de su turno</li>
                <li>• Si su estado de salud empeora, notifique al personal</li>
              </ul>
            </section>
          </aside>
        </div>
      </Layout>
  )
}
