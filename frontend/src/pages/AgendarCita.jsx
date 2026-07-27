import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { crearCita } from '../api/citaService'
import { listarMedicos } from '../api/medicoService'
import { obtenerMiPerfil } from '../api/pacienteService'
import Layout from '../components/Layout'
import { Calendar, LoaderCircle } from 'lucide-react'

export default function AgendarCita() {
  const { user } = useAuth()
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
    cargarMedicos()
    cargarMiPerfil()
  }, [])

  const cargarMedicos = async () => {
    try {
      const res = await listarMedicos()
      setMedicos(res.contenido || res)
    } catch (err) {
      setErrors({ medicos: 'No se pudieron cargar los medicos.' })
    }
  }

  const cargarMiPerfil = async () => {
    try {
      await obtenerMiPerfil()
    } catch (err) {
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
    if (!form.medicoId) newErrors.medicoId = 'Selecciona un medico'
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

  if (loading) return <Layout title="Agendar cita"><p className="text-sm text-muted">Cargando...</p></Layout>
  if (serverError && !form.medicoId && !form.fechaHora) return <Layout title="Agendar cita"><p className="text-sm text-urgente font-medium" role="alert">{serverError}</p></Layout>

  return (
      <Layout title="Agendar cita">
        <div className="max-w-2xl">
          <div className="rounded-xl border border-line bg-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold">Nueva cita</h2>
                <p className="text-sm text-muted">Selecciona el medico y la fecha deseada.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="medicoId" className="label">Medico</label>
                <select id="medicoId" name="medicoId" value={form.medicoId} onChange={handleChange} required
                        className="input-field">
                  <option value="">-- Selecciona un medico --</option>
                  {medicos.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.especialidad})
                      </option>
                  ))}
                </select>
                {errors.medicoId && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.medicoId}</p>}
              </div>

              <div>
                <label htmlFor="fechaHora" className="label">Fecha y hora</label>
                <input id="fechaHora" name="fechaHora" type="datetime-local" value={form.fechaHora}
                       onChange={handleChange} required className="input-field" />
                {errors.fechaHora && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.fechaHora}</p>}
              </div>

              {serverError && <p className="text-sm text-urgente font-medium" role="alert">{serverError}</p>}
              {success && <p className="text-sm text-leve font-medium">Cita agendada correctamente.</p>}

              <button type="submit" disabled={submitting}
                      className="btn-primary flex items-center justify-center gap-2">
                {submitting && <LoaderCircle className="w-5 h-5 animate-spin" />}
                {submitting ? 'Agendando...' : 'Agendar cita'}
              </button>
            </form>
          </div>
        </div>
      </Layout>
  )
}
