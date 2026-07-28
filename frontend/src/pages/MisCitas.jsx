import { useEffect, useState } from 'react'
import { listarCitasPorPaciente, cambiarEstadoCita } from '../api/citaService'
import { obtenerMiPerfil } from '../api/pacienteService'
import Layout from '../components/Layout'
import EstadoCitaBadge from '../components/EstadoCitaBadge'
import Pagination from '../components/Pagination'
import ConfirmModal from '../components/ConfirmModal'
import { Calendar, Clock, AlertCircle, CalendarPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

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
    } catch {
      setError('No se pudo cancelar la cita.')
    } finally {
      setCancelando(false)
    }
  }

  return (
    <Layout title="Mis citas" subtitle="Consulta y administra tus citas médicas">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/agendar-cita"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 active:bg-brand-900 transition-colors duration-150"
        >
          <CalendarPlus className="w-4 h-4" />
          Nueva cita
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-urgente/30 bg-urgente/5 px-4 py-3 text-sm text-urgente">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {loading && !pacienteId && (
        <div className="card text-center py-12">
          <p className="text-muted">Cargando perfil...</p>
        </div>
      )}

      {loading && pacienteId && (
        <div className="card text-center py-12">
          <p className="text-muted">Cargando citas...</p>
        </div>
      )}

      {!loading && data && data.contenido.length === 0 && (
        <div className="card text-center py-16">
          <Calendar className="w-12 h-12 text-muted/40 mx-auto" />
          <p className="mt-4 text-base font-semibold">No tienes citas registradas</p>
          <p className="mt-1 text-sm text-muted">Agenda tu primera cita médica</p>
          <Link
            to="/agendar-cita"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 transition-colors duration-150"
          >
            <CalendarPlus className="w-4 h-4" />
            Agendar cita
          </Link>
        </div>
      )}

      {data && data.contenido.length > 0 && (
        <div className="card p-0 divide-y divide-line overflow-hidden">
          {data.contenido.map((cita) => (
            <div key={cita.id} className="flex items-center justify-between px-6 py-4 hover:bg-subtle/50 transition-colors duration-150">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-brand-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {new Date(cita.fechaHora).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-muted" />
                    <span className="text-sm text-muted">
                      {new Date(cita.fechaHora).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <EstadoCitaBadge estado={cita.estado} />
                {cita.estado === 'PENDIENTE' && (
                  <button
                    type="button"
                    onClick={() => setCitaACancelar(cita)}
                    className="rounded-lg border border-urgente/30 px-3 py-1.5 text-xs font-semibold text-urgente hover:bg-urgente/5 transition-colors duration-150"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {data && (
        <Pagination
          page={data.paginaActual || 0}
          totalPages={data.totalPaginas || 1}
          totalElements={data.totalElementos || 0}
          size={5}
          pageLabel="Mostrando"
          onPageChange={setPagina}
        />
      )}

      <ConfirmModal
        open={!!citaACancelar}
        title="Cancelar cita"
        message={`Estás por cancelar tu cita del ${
          citaACancelar
            ? new Date(citaACancelar.fechaHora).toLocaleDateString('es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''
        }. Esta acción no se puede deshacer.`}
        onConfirm={confirmarCancelacion}
        onCancel={() => setCitaACancelar(null)}
        loading={cancelando}
      />
    </Layout>
  )
}
