import { useState } from 'react'
import { crearPerfilPaciente } from '../api/pacienteService'

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
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
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

        setLoading(true)
        try {
            await crearPerfilPaciente({
                nombre: form.nombre,
                telefono: form.telefono || null,
                fechaNacimiento: form.fechaNacimiento || null,
                sexo: form.sexo || null,
                pesoKg: form.pesoKg === '' ? null : Number(form.pesoKg),
                presionSistolica: form.presionSistolica === '' ? null : Number(form.presionSistolica),
                presionDiastolica: form.presionDiastolica === '' ? null : Number(form.presionDiastolica),
                contextoSalud: form.contextoSalud,
            })
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

            <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
            <input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={handleChange}
            />
            {errors.fechaNacimiento && <p role="alert">{errors.fechaNacimiento}</p>}

            <label htmlFor="sexo">Sexo</label>
            <select id="sexo" name="sexo" value={form.sexo} onChange={handleChange}>
                <option value="">Sin especificar</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
            </select>

            <label htmlFor="pesoKg">Peso (kg)</label>
            <input
                id="pesoKg"
                name="pesoKg"
                type="number"
                step="0.1"
                placeholder="ej. 70.5"
                value={form.pesoKg}
                onChange={handleChange}
            />
            {errors.pesoKg && <p role="alert">{errors.pesoKg}</p>}

            <label htmlFor="presionSistolica">Presion sistolica</label>
            <input
                id="presionSistolica"
                name="presionSistolica"
                type="number"
                placeholder="ej. 120"
                value={form.presionSistolica}
                onChange={handleChange}
            />
            {errors.presionSistolica && <p role="alert">{errors.presionSistolica}</p>}

            <label htmlFor="presionDiastolica">Presion diastolica</label>
            <input
                id="presionDiastolica"
                name="presionDiastolica"
                type="number"
                placeholder="ej. 80"
                value={form.presionDiastolica}
                onChange={handleChange}
            />
            {errors.presionDiastolica && <p role="alert">{errors.presionDiastolica}</p>}

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
