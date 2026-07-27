import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { crearCita } from '../api/citaService'
import { listarMedicos } from '../api/medicoService'
import { obtenerMiPerfil } from '../api/pacienteService'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus, Stethoscope, Calendar, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function AgendarCita() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [medicos, setMedicos] = useState([])
  const [form, setForm] = useState({
    medicoId: '',
    fechaHora: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([cargarMedicos(), cargarMiPerfil()])
  }, [])

  const cargarMedicos = async () => {
    try {
      const res = await listarMedicos()
      setMedicos(res.contenido || res)
    } catch {
      setErrors({ medicos: 'No se pudieron cargar los médicos.' })
    }
  }

  const cargarMiPerfil = async () => {
    try {
      await obtenerMiPerfil()
    } catch {
      setServerError('No tienes perfil de paciente. Completa tus datos de salud primero.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors((e) => ({ ...e, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.medicoId) newErrors.medicoId = 'Selecciona un médico'
    if (!form.fechaHora) newErrors.fechaHora = 'Selecciona fecha y hora'
    else if (new Date(form.fechaHora) <= new Date()) newErrors.fechaHora = 'La fecha debe ser futura'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess(false)
    if (!validate()) return

    setSubmitting(true)
    try {
      await crearCita({
        medicoId: Number(form.medicoId),
        fechaHora: form.fechaHora,
      })
      setSuccess(true)
      setForm({ medicoId: '', fechaHora: '' })
    } catch (err) {
      setServerError(err.response?.data?.mensaje || 'No se pudo agendar la cita.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout title="Agendar cita" subtitle="Selecciona el médico y la fecha deseada">
      <button
        onClick={() => navigate('/mis-citas')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink transition-colors duration-150"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mis citas
      </button>

      <div className="card">

          {loading && (
            <div className="text-center py-8">
              <p className="text-muted">Cargando...</p>
            </div>
          )}

          {serverError && !form.medicoId && !form.fechaHora && loading === false && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-urgente/30 bg-urgente/5 px-4 py-3 text-sm text-urgente">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {serverError}
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-leve/30 bg-leve/5 px-4 py-3 text-sm text-leve">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Cita agendada correctamente.
            </div>
          )}

          {!loading && !serverError && (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <label htmlFor="medicoId" className="label">Médico</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <select
                    id="medicoId"
                    name="medicoId"
                    value={form.medicoId}
                    onChange={handleChange}
                    className="input-field pl-10 appearance-none bg-white"
                    required
                  >
                    <option value="">-- Selecciona un médico --</option>
                    {medicos.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.especialidad || 'Medicina General'})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.medicoId && (
                  <p className="mt-1.5 text-xs font-semibold text-urgente">{errors.medicoId}</p>
                )}
              </div>

              <div>
                <label htmlFor="fechaHora" className="label">Fecha y hora</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    id="fechaHora"
                    name="fechaHora"
                    type="datetime-local"
                    value={form.fechaHora}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
                {errors.fechaHora && (
                  <p className="mt-1.5 text-xs font-semibold text-urgente">{errors.fechaHora}</p>
                )}
              </div>

              {serverError && form.medicoId && (
                <div className="flex items-center gap-3 rounded-xl border border-urgente/30 bg-urgente/5 px-4 py-3 text-sm text-urgente">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {serverError}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  {submitting ? 'Agendando...' : 'Agendar cita'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/mis-citas')}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
    </Layout>
  )
}
