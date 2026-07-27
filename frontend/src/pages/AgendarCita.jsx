import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { crearCita } from '../api/citaService'
import { listarMedicos } from '../api/medicoService'
import { obtenerMiPerfil } from '../api/pacienteService'

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

  if (loading) return <p>Cargando...</p>
  if (serverError && !form.medicoId && !form.fechaHora) return <p role="alert">{serverError}</p>

  return (
      <form onSubmit={handleSubmit} noValidate>
        <h1>Agendar cita</h1>

        <label htmlFor="medicoId">Medico</label>
        <select id="medicoId" name="medicoId" value={form.medicoId} onChange={handleChange} required>
          <option value="">-- Selecciona un medico --</option>
          {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} ({m.especialidad})
              </option>
          ))}
        </select>
        {errors.medicoId && <p role="alert">{errors.medicoId}</p>}

        <label htmlFor="fechaHora">Fecha y hora</label>
        <input
            id="fechaHora"
            name="fechaHora"
            type="datetime-local"
            value={form.fechaHora}
            onChange={handleChange}
            required
        />
        {errors.fechaHora && <p role="alert">{errors.fechaHora}</p>}

        {serverError && <p role="alert">{serverError}</p>}
        {success && <p>Cita agendada correctamente.</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Agendando...' : 'Agendar cita'}
        </button>
      </form>
  )
}