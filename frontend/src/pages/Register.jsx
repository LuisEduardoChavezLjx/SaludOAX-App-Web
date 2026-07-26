import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/

export default function Register() {
    const { register } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const newErrors = {}
        if (!email) newErrors.email = 'El email es obligatorio'
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Formato de email invalido'

        if (!password) newErrors.password = 'La contrasena es obligatoria'
        else if (!PASSWORD_REGEX.test(password))
            newErrors.password = 'Debe tener 8+ caracteres, una mayuscula, un numero y un caracter especial'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')
        if (!validate()) return

        setLoading(true)
        try {
            await register(email, password)
            window.location.href = '/'
        } catch (err) {
            setServerError(
                err.response?.data?.mensaje || 'No se pudo completar el registro. Intenta de nuevo.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h1>Crear cuenta</h1>

            <label htmlFor="email">Correo electronico</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p role="alert">{errors.email}</p>}

            <label htmlFor="password">Contrasena</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p role="alert">{errors.password}</p>}

            {serverError && <p role="alert">{serverError}</p>}

            <button type="submit" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarme'}
            </button>
        </form>
    )
}
