import { useState } from 'react'
import { crearPerfilPaciente } from '../api/pacienteService'

export default function RegistroSalud() {
  const [form, setForm] = useState({
    nombre: '', telefono: '', peso: '', presion: '', contextoSalud: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (form.contextoSalud.length > 500) newErrors.contextoSalud = 'Maximo 500 caracteres'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setSuccess(false)
    if (!validate()) return

    setLoading(true)
    try {
      await crearPerfilPaciente(form)
      setSuccess(true)
    } catch (err) {
      setServerError(err.response?.data?.mensaje || 'No se pudo guardar la informacion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Datos de salud</h1>

      <label htmlFor="nombre">Nombre completo</label>
      <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} />
      {errors.nombre && <p role="alert">{errors.nombre}</p>}

      <label htmlFor="telefono">Telefono</label>
      <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />

      <label htmlFor="peso">Peso</label>
      <input id="peso" name="peso" placeholder="ej. 70kg" value={form.peso} onChange={handleChange} />

      <label htmlFor="presion">Presion</label>
      <input id="presion" name="presion" placeholder="ej. 120/80" value={form.presion} onChange={handleChange} />

      <label htmlFor="contextoSalud">Motivo de consulta / contexto</label>
      <textarea
        id="contextoSalud"
        name="contextoSalud"
        value={form.contextoSalud}
        onChange={handleChange}
        maxLength={500}
      />
      {errors.contextoSalud && <p role="alert">{errors.contextoSalud}</p>}

      {serverError && <p role="alert">{serverError}</p>}
      {success && <p>Informacion guardada correctamente.</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
