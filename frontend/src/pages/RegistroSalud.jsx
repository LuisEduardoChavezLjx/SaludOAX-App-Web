import { useState, useEffect } from 'react'
import { crearPerfilPaciente, obtenerMiPerfil, actualizarPerfilPaciente } from '../api/pacienteService'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { Heart, LoaderCircle } from 'lucide-react'

const RANGOS = {
    pesoKg: { min: 1, max: 400, etiqueta: 'El peso debe estar entre 1 y 400 kg' },
    presionSistolica: { min: 50, max: 300, etiqueta: 'La sistolica debe estar entre 50 y 300' },
    presionDiastolica: { min: 30, max: 200, etiqueta: 'La diastolica debe estar entre 30 y 200' },
}

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
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [editando, setEditando] = useState(false)
    const [perfilId, setPerfilId] = useState(null)

    useEffect(() => {
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
            .catch(() => {
                setEditando(false)
            })
            .finally(() => setLoading(false))
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (errors[e.target.name]) setErrors((e) => ({ ...e, [e.target.name]: '' }))
    }

    const validarRango = (campo, valor, newErrors) => {
        if (valor === '') return
        const numero = Number(valor)
        const rango = RANGOS[campo]
        if (Number.isNaN(numero) || numero < rango.min || numero > rango.max) {
            newErrors[campo] = rango.etiqueta
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
        if (form.contextoSalud.length > 500) newErrors.contextoSalud = 'Maximo 500 caracteres'

        validarRango('pesoKg', form.pesoKg, newErrors)
        validarRango('presionSistolica', form.presionSistolica, newErrors)
        validarRango('presionDiastolica', form.presionDiastolica, newErrors)

        if (form.fechaNacimiento && new Date(form.fechaNacimiento) >= new Date()) {
            newErrors.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy'
        }

        const sistolica = Number(form.presionSistolica)
        const diastolica = Number(form.presionDiastolica)
        if (form.presionSistolica && form.presionDiastolica && diastolica >= sistolica) {
            newErrors.presionDiastolica = 'La diastolica debe ser menor que la sistolica'
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
                pesoKg: form.pesoKg === '' ? null : Number(form.pesoKg),
                presionSistolica: form.presionSistolica === '' ? null : Number(form.presionSistolica),
                presionDiastolica: form.presionDiastolica === '' ? null : Number(form.presionDiastolica),
                contextoSalud: form.contextoSalud,
            }

            if (editando && perfilId) {
                await actualizarPerfilPaciente(perfilId, payload)
            } else {
                await crearPerfilPaciente(payload)
            }
            setSuccess(true)
        } catch (err) {
            setServerError(err.response?.data?.mensaje || 'No se pudo guardar la informacion.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <Layout title="Datos de salud"><LoadingSpinner /></Layout>

    return (
        <Layout title="Mis datos de salud">
            <div className="max-w-2xl">
                <div className="rounded-xl border border-line bg-white p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
                <Heart className="w-5 h-5" />
              </span>
                        <div>
                            <h2 className="text-base font-semibold">{editando ? 'Editar datos de salud' : 'Datos de salud'}</h2>
                            <p className="text-sm text-muted">Proporciona tu informacion medica basica.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        <div>
                            <label htmlFor="nombre" className="label">Nombre completo</label>
                            <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} className="input-field" />
                            {errors.nombre && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label htmlFor="telefono" className="label">Telefono</label>
                            <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} className="input-field" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fechaNacimiento" className="label">Fecha de nacimiento</label>
                                <input id="fechaNacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento}
                                       onChange={handleChange} className="input-field" />
                                {errors.fechaNacimiento && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.fechaNacimiento}</p>}
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

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="pesoKg" className="label">Peso (kg)</label>
                                <input id="pesoKg" name="pesoKg" type="number" step="0.1" placeholder="ej. 70.5"
                                       value={form.pesoKg} onChange={handleChange} className="input-field" />
                                {errors.pesoKg && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.pesoKg}</p>}
                            </div>
                            <div>
                                <label htmlFor="presionSistolica" className="label">Sistolica</label>
                                <input id="presionSistolica" name="presionSistolica" type="number" placeholder="ej. 120"
                                       value={form.presionSistolica} onChange={handleChange} className="input-field" />
                                {errors.presionSistolica && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.presionSistolica}</p>}
                            </div>
                            <div>
                                <label htmlFor="presionDiastolica" className="label">Diastolica</label>
                                <input id="presionDiastolica" name="presionDiastolica" type="number" placeholder="ej. 80"
                                       value={form.presionDiastolica} onChange={handleChange} className="input-field" />
                                {errors.presionDiastolica && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.presionDiastolica}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="contextoSalud" className="label">Motivo de consulta / contexto</label>
                            <textarea id="contextoSalud" name="contextoSalud" value={form.contextoSalud}
                                      onChange={handleChange} maxLength={500} rows={3} className="input-field" />
                            {errors.contextoSalud && <p className="mt-2 text-xs font-medium text-urgente" role="alert">{errors.contextoSalud}</p>}
                        </div>

                        {serverError && <p className="text-sm text-urgente font-medium" role="alert">{serverError}</p>}
                        {success && <p className="text-sm text-leve font-medium">Informacion guardada correctamente.</p>}

                        <button type="submit" disabled={submitting}
                                className="btn-primary flex items-center justify-center gap-2">
                            {submitting && <LoaderCircle className="w-5 h-5 animate-spin" />}
                            {submitting ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar')}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
