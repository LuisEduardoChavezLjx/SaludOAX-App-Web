import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { validarFormularioAcceso, tieneErrores } from '../utilidades/validaciones'
import { MensajeError } from '../componentes/comunes/MensajeError'
import { NOMBRE_CLINICA } from '../utilidades/constantes'

export default function Register() {
  const { register, estaAutenticado } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorServidor('')

    const erroresValidacion = validarFormularioAcceso({ email, contrasena })
    setErrores(erroresValidacion)

    if (tieneErrores(erroresValidacion)) return

    setCargando(true)
    try {
      await register(email.trim(), contrasena, 'PACIENTE')
      navigate('/salud')
    } catch (err) {
      setErrorServidor(err.message || 'No se pudo crear la cuenta. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleBlurEmail = () => {
    const err = validarFormularioAcceso({ email, contrasena: '' })
    setErrores((prev) => ({ ...prev, email: err.email || undefined }))
  }

  const handleBlurContrasena = () => {
    const err = validarFormularioAcceso({ email: '', contrasena })
    setErrores((prev) => ({ ...prev, contrasena: err.contrasena || undefined }))
  }

  if (estaAutenticado) {
    return null
  }

  return (
      <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 text-ink">
        <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl border border-line shadow-sm">
          <div className="flex flex-col items-center">
          <span className="w-11 h-11 rounded-xl bg-brand-700 flex items-center justify-center text-white">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" aria-hidden="true">
              <path d="M13 4h6v9h9v6h-9v9h-6v-9H4v-6h9V4z" fill="currentColor" opacity=".28" />
              <path d="M4 16h5l3-6 4 12 3-6h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
            <span className="mt-3 text-base font-semibold tracking-tight text-brand-800">{NOMBRE_CLINICA}</span>
          </div>

          <h1 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-center">Crear cuenta</h1>
          <p className="mt-1.5 text-sm text-muted text-center">Cree su cuenta de paciente para agendar consultas.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8">
            <MensajeError mensaje={errorServidor} />

            <div className="mb-5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink mb-2">
                Correo electronico
              </label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlurEmail}
                    className="w-full rounded-lg border border-line bg-white pl-10 pr-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    placeholder="nombre@correo.com"
                    disabled={cargando}
                    aria-invalid={!!errores.email}
                    aria-describedby={errores.email ? 'email-error' : undefined}
                />
              </div>
              {errores.email && (
                  <p id="email-error" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-urgente" role="alert">
                    {errores.email}
                  </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="contrasena" className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink mb-2">
                Contrasena
              </label>
              <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted pointer-events-none">
                <Lock className="w-5 h-5" />
              </span>
                <input
                    id="contrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    onBlur={handleBlurContrasena}
                    className="w-full rounded-lg border border-line bg-white pl-10 pr-11 py-2.5 text-sm text-ink focus:border-brand-700 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    placeholder="********"
                    disabled={cargando}
                    aria-invalid={!!errores.contrasena}
                    aria-describedby={errores.contrasena ? 'contrasena-error' : undefined}
                />
                <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink focus:outline-none focus:text-brand-700"
                    aria-label={mostrarContrasena ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    aria-pressed={mostrarContrasena}
                >
                  {mostrarContrasena ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errores.contrasena && (
                  <p id="contrasena-error" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-urgente" role="alert">
                    {errores.contrasena}
                  </p>
              )}
              <p className="mt-2 text-xs text-muted">
                Minimo 8 caracteres, una mayuscula, un numero y un caracter especial.
              </p>
            </div>

            <button
                type="submit"
                disabled={cargando}
                className="w-full rounded-lg bg-brand-700 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-brand-800 active:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-8 text-sm text-muted text-center">
            Ya tiene cuenta?{' '}
            <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
              Iniciar sesion
            </Link>
          </p>
        </div>
      </div>
  )
}
