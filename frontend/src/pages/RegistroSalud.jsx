import { useState, useEffect } from 'react'
import { crearPerfilPaciente, obtenerMiPerfil, actualizarPerfilPaciente, obtenerUltimosVitales } from '../api/pacienteService'
import Layout from '../components/Layout'
import { Heart, Weight, AlertCircle, CheckCircle2, FileText, User, Calendar, Stethoscope } from 'lucide-react'

export default function RegistroSalud() {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    sexo: '',
    pesoKg: '',
    presionSistolica: '',
    presionDiastolica: '',
    contextoSalud: '',
  })
  const [ultimosVitales, setUltimosVitales] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editando, setEditando] = useState(false)
  const [perfilId, setPerfilId] = useState(null)

  useEffect(() => {
    Promise.all([
      obtenerMiPerfil()
        .then((perfil) => {
          setEditando(true)
          setPerfilId(perfil.id)
          setForm({
            nombre: perfil.nombre || '',
            telefono: perfil.telefono || '',
            fechaNacimiento: perfil.fechaNacimiento || '',
            sexo: perfil.sexo || '',
            pesoKg: perfil.pesoKg != null ? String(perfil.pesoKg) : '',
            presionSistolica: perfil.presionSistolica != null ? String(perfil.presionSistolica) : '',
            presionDiastolica: perfil.presionDiastolica != null ? String(perfil.presionDiastolica) : '',
            contextoSalud: perfil.contextoSalud || '',
          })
        })
        .catch(() => setEditando(false)),
      obtenerUltimosVitales()
        .then(setUltimosVitales)
        .catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors((e) => ({ ...e, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (form.contextoSalud.length > 500) newErrors.contextoSalud = 'Máximo 500 caracteres'

    if (form.fechaNacimiento && new Date(form.fechaNacimiento) >= new Date()) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy'
    }

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
      const payload = {
        nombre: form.nombre,
        telefono: form.telefono || null,
        fechaNacimiento: form.fechaNacimiento || null,
        sexo: form.sexo || null,
        pesoKg: null,
        presionSistolica: null,
        presionDiastolica: null,
        contextoSalud: form.contextoSalud,
      }

      if (editando && perfilId) {
        await actualizarPerfilPaciente(perfilId, payload)
      } else {
        await crearPerfilPaciente(payload)
      }
      setSuccess(true)
    } catch (err) {
      setServerError(err.response?.data?.mensaje || 'No se pudo guardar la información.')
    } finally {
      setSubmitting(false)
    }
  }

  const vitalesDisponibles = ultimosVitales && ultimosVitales.pesoKg != null

  return (
    <Layout title={editando ? 'Editar datos de salud' : 'Datos de salud'} subtitle="Información necesaria para la estimación de tu consulta">
      {loading && (
        <div className="card text-center py-12">
          <p className="text-muted">Cargando...</p>
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="card space-y-8">
            {serverError && (
              <div className="flex items-center gap-3 rounded-xl border border-urgente/30 bg-urgente/5 px-4 py-3 text-sm text-urgente">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {serverError}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 rounded-xl border border-leve/30 bg-leve/5 px-4 py-3 text-sm text-leve">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Información guardada correctamente.
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-muted" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">Datos personales</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="md:col-span-2">
                  <label htmlFor="nombre" className="label">Nombre completo</label>
                  <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} className="input-field" />
                  {errors.nombre && <p className="mt-1.5 text-xs font-semibold text-urgente">{errors.nombre}</p>}
                </div>
                <div>
                  <label htmlFor="telefono" className="label">Teléfono</label>
                  <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label htmlFor="fechaNacimiento" className="label">Fecha de nacimiento</label>
                  <input id="fechaNacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} className="input-field" />
                  {errors.fechaNacimiento && <p className="mt-1.5 text-xs font-semibold text-urgente">{errors.fechaNacimiento}</p>}
                </div>
                <div>
                  <label htmlFor="sexo" className="label">Sexo</label>
                  <select id="sexo" name="sexo" value={form.sexo} onChange={handleChange} className="input-field">
                    <option value="">Sin especificar</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-line" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-muted" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">Signos vitales — última consulta</h2>
              </div>

              {!vitalesDisponibles && (
                <div className="rounded-xl border border-dashed border-line bg-subtle/50 px-5 py-8 text-center">
                  <p className="text-sm text-muted">Aún no hay registros de consultas anteriores.</p>
                  <p className="text-xs text-muted/60 mt-1">Los signos vitales se capturarán durante tu primera consulta.</p>
                </div>
              )}

              {vitalesDisponibles && (
                <div className="rounded-xl border border-line divide-y divide-line overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Calendar className="w-4 h-4 text-muted shrink-0" />
                    <span className="text-sm text-muted">
                      Registrados el {new Date(ultimosVitales.fechaCita).toLocaleDateString('es-MX', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {ultimosVitales.medicoNombre && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Stethoscope className="w-4 h-4 text-muted shrink-0" />
                      <span className="text-sm text-muted">Atendido por <span className="font-semibold text-ink">{ultimosVitales.medicoNombre}</span></span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 divide-x divide-line">
                    <div className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-1">
                        <Weight className="w-3.5 h-3.5" />
                        Peso
                      </div>
                      <p className="text-lg font-bold tabular-nums">{ultimosVitales.pesoKg} <span className="text-sm font-normal text-muted">kg</span></p>
                    </div>
                    <div className="px-4 py-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-1">Sistólica</p>
                      <p className="text-lg font-bold tabular-nums">{ultimosVitales.presionSistolica} <span className="text-sm font-normal text-muted">mmHg</span></p>
                    </div>
                    <div className="px-4 py-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted mb-1">Diastólica</p>
                      <p className="text-lg font-bold tabular-nums">{ultimosVitales.presionDiastolica} <span className="text-sm font-normal text-muted">mmHg</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-line" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-muted" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">Contexto de salud</h2>
              </div>
              <div>
                <label htmlFor="contextoSalud" className="label">Motivo de consulta / notas adicionales</label>
                <textarea
                  id="contextoSalud"
                  name="contextoSalud"
                  value={form.contextoSalud}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe brevemente el motivo de tu consulta, síntomas o cualquier información relevante..."
                />
                <div className="mt-1.5 flex items-center justify-between">
                  {errors.contextoSalud && <p className="text-xs font-semibold text-urgente">{errors.contextoSalud}</p>}
                  <p className="text-xs text-muted/60 ml-auto">{form.contextoSalud.length}/500</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" disabled={submitting} className="btn-primary inline-flex items-center justify-center gap-2">
              {submitting ? 'Guardando...' : (editando ? 'Actualizar datos' : 'Guardar datos')}
            </button>
          </div>
        </form>
      )}
    </Layout>
  )
}
